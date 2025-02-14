import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  DocumentData,
  FirestoreError,
} from "firebase/firestore";

import {
  ExtendedClubSessionType,
  PaginatedClubSessionsExtendedType,
} from "@/schemas/session";
import {
  mapDocToBaseSession,
  mapDocToUserMembership,
  mapDocToUser,
} from "./mappers";

/**
 * Subscribes to real-time updates for a page of sessions for a club.
 * In addition to listening for changes to the session documents, it also
 * sets up individual listeners for the user and membership documents referenced by each session.
 *
 * @param {string} clubId - The ID of the club.
 * @param {number} pageSize - The number of sessions to fetch per page.
 * @param {QueryDocumentSnapshot<DocumentData> | null} startAfterDoc - (Optional) Document snapshot to start after, used for pagination.
 * @param {(data: PaginatedClubSessionsExtendedType) => void} callback - Function called whenever session or related document data is updated.
 * @param {(error: Error) => void} [errorCallback] - (Optional) Function called if an error occurs during any subscription.
 * @returns {() => void} A function that, when invoked, unsubscribes from all active listeners.
 */
export const subscribeToSessionsForClub = (
  clubId: string,
  pageSize: number,
  startAfterDoc: QueryDocumentSnapshot<DocumentData> | null,
  callback: (data: PaginatedClubSessionsExtendedType) => void,
  errorCallback?: (error: Error) => void,
) => {
  // Create a reference to the club document in Firestore.
  const clubDocRef = doc(db, "clubs", clubId);

  // Create a reference to the 'sessions' subcollection within the club document.
  const sessionsRef = collection(clubDocRef, "sessions");

  // Build a Firestore query to retrieve sessions ordered by date.
  // If a startAfterDoc is provided (for pagination), it is applied to the query.
  const sessionsQuery = startAfterDoc
    ? query(
        sessionsRef,
        orderBy("date"),
        startAfter(startAfterDoc),
        limit(pageSize),
      )
    : query(sessionsRef, orderBy("date"), limit(pageSize));

  // This array will hold unsubscribe functions for each per-session listener (for user and membership data)
  let extraUnsubs: Array<() => void> = [];

  // Subscribe to the sessions query to get real-time updates.
  const unsubscribe = onSnapshot(
    sessionsQuery,
    (snapshot) => {
      // When the sessions update, remove any previous per-session subscriptions to avoid duplicates.
      extraUnsubs.forEach((fn) => fn());
      extraUnsubs = [];

      // Map each session document to an extended session object.
      // Each extended session includes base session data plus placeholders for user and membership data.
      const extendedSessions: ExtendedClubSessionType[] = snapshot.docs.map(
        (docSnap) => {
          // Convert the Firestore document to a base session object.
          const baseSession = mapDocToBaseSession(docSnap);

          // Initialize the extended session with null values for userData and userMembershipData.
          const extendedSession: ExtendedClubSessionType = {
            ...baseSession,
            userData: null,
            userMembershipData: null,
          };

          // Set up a listener for the user document referenced in the base session.
          const unsubUser = onSnapshot(
            baseSession.user,
            (userSnap: DocumentSnapshot<DocumentData>) => {
              // Update the extended session with the latest user data.
              extendedSession.userData = mapDocToUser(userSnap);
              // Invoke the callback with the updated sessions list.
              callback({
                sessions: extendedSessions,
                lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,
              });
            },
            (err: FirestoreError) => {
              console.error("Error fetching user data:", err);
              // If an error callback is provided, call it with the error.
              if (errorCallback) errorCallback(err);
            },
          );
          // Store the unsubscribe function for the user listener.
          extraUnsubs.push(unsubUser);

          // Set up a listener for the membership document referenced in the base session.
          const unsubMembership = onSnapshot(
            baseSession.membership,
            (membershipSnap: DocumentSnapshot<DocumentData>) => {
              // Update the extended session with the latest membership data.
              extendedSession.userMembershipData =
                mapDocToUserMembership(membershipSnap);
              // Invoke the callback with the updated sessions list.
              callback({
                sessions: extendedSessions,
                lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,
              });
            },
            (err: FirestoreError) => {
              console.error("Error fetching membership data:", err);
              // If an error callback is provided, call it with the error.
              if (errorCallback) errorCallback(err);
            },
          );
          // Store the unsubscribe function for the membership listener.
          extraUnsubs.push(unsubMembership);

          // Return the extended session object.
          return extendedSession;
        },
      );

      // Identify the last visible document in the snapshot for use in pagination.
      const lastVisible =
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1]
          : null;

      // Trigger the initial callback with the list of extended sessions.
      // Note: The user and membership data will update as their respective listeners receive data.
      callback({ sessions: extendedSessions, lastVisible });
    },
    (error: FirestoreError) => {
      // Log and propagate any error encountered while subscribing to the sessions.
      console.error("Error subscribing to sessions:", error);
      if (errorCallback) errorCallback(error);
    },
  );

  // Return a combined unsubscribe function that stops both the main sessions listener and all per-session listeners.
  return () => {
    unsubscribe();
    extraUnsubs.forEach((fn) => fn());
  };
};
