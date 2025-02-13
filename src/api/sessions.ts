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
 * Subscribes to real-time updates for a page of sessions for a club,
 * including real-time subscriptions to each session’s referenced user and membership documents.
 *
 * @param clubId         - The ID of the club.
 * @param pageSize       - Number of sessions per page.
 * @param startAfterDoc  - (Optional) Document snapshot to start after (for pagination).
 * @param callback       - Function to call with the updated data.
 * @param errorCallback  - (Optional) Function to call on errors.
 * @returns A function to unsubscribe from all listeners.
 */
export const subscribeToSessionsForClub = (
  clubId: string,
  pageSize: number,
  startAfterDoc: QueryDocumentSnapshot<DocumentData> | null,
  callback: (data: PaginatedClubSessionsExtendedType) => void,
  errorCallback?: (error: Error) => void,
) => {
  const clubDocRef = doc(db, "clubs", clubId);
  const sessionsRef = collection(clubDocRef, "sessions");

  const sessionsQuery = startAfterDoc
    ? query(
        sessionsRef,
        orderBy("date"),
        startAfter(startAfterDoc),
        limit(pageSize),
      )
    : query(sessionsRef, orderBy("date"), limit(pageSize));

  // Track extra per-session unsubscribe functions so we can clean them up.
  let extraUnsubs: Array<() => void> = [];

  const unsubscribe = onSnapshot(
    sessionsQuery,
    (snapshot) => {
      // Clear previous per-session listeners.
      extraUnsubs.forEach((fn) => fn());
      extraUnsubs = [];

      // Map session docs to extended sessions.
      const extendedSessions: ExtendedClubSessionType[] = snapshot.docs.map(
        (docSnap) => {
          // Parse the top-level session data
          const baseSession = mapDocToBaseSession(docSnap);
          const extendedSession: ExtendedClubSessionType = {
            ...baseSession,
            // Initially null until we fetch them
            userData: null,
            userMembershipData: null,
          };

          // Subscribe to user document
          const unsubUser = onSnapshot(
            baseSession.user,
            (userSnap: DocumentSnapshot<DocumentData>) => {
              extendedSession.userData = mapDocToUser(userSnap);
              // Each time user data updates, call the callback with the new overall sessions
              callback({
                sessions: extendedSessions,
                lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,
              });
            },
            (err: FirestoreError) => {
              console.error("Error fetching user data:", err);
              if (errorCallback) errorCallback(err);
            },
          );
          extraUnsubs.push(unsubUser);

          // Subscribe to membership document
          const unsubMembership = onSnapshot(
            baseSession.membership,
            (membershipSnap: DocumentSnapshot<DocumentData>) => {
              extendedSession.userMembershipData =
                mapDocToUserMembership(membershipSnap);
              callback({
                sessions: extendedSessions,
                lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,
              });
            },
            (err: FirestoreError) => {
              console.error("Error fetching membership data:", err);
              if (errorCallback) errorCallback(err);
            },
          );
          extraUnsubs.push(unsubMembership);

          return extendedSession;
        },
      );

      // Provide initial callback with the base sessions (they’ll be updated by user/membership subscriptions).
      const lastVisible =
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1]
          : null;

      callback({ sessions: extendedSessions, lastVisible });
    },
    (error: FirestoreError) => {
      console.error("Error subscribing to sessions:", error);
      if (errorCallback) errorCallback(error);
    },
  );

  // Return a combined unsubscribe function
  return () => {
    unsubscribe();
    extraUnsubs.forEach((fn) => fn());
  };
};
