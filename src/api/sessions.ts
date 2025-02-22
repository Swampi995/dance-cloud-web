/**
 * @module ClubSessionsSubscription
 *
 * This module provides a real-time subscription to a paginated list of session documents for a specific club from Firestore.
 * It allows optional filtering by a date range and automatically extends each session document with related data:
 * - **User Data**: The profile of the user who created the session.
 * - **User Membership Data**: Membership information for the user.
 * - **Club Membership Data**: Additional membership details (if available) tied to the user’s membership.
 *
 * The function leverages Firestore's `onSnapshot()` to listen for live updates on the queried sessions as well as on the
 * related nested documents. The supplied callback is invoked each time the underlying data changes.
 *
 * **Usage Note:**
 * The function returns a cleanup function that must be called to unsubscribe from all active listeners when updates are no longer needed.
 */

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  FirestoreError,
  QueryConstraint,
} from "firebase/firestore";

import {
  ExtendedClubSessionType,
  PaginatedClubSessionsExtendedType,
} from "@/schemas/session";
import {
  mapDocToBaseSession,
  mapDocToUserMembership,
  mapDocToClubMembership,
  mapDocToUser,
} from "./mappers";

/**
 * Subscribes to real-time updates for a paginated list of sessions for a club,
 * with optional filtering by a start and/or end date.
 *
 * Each session's base data is augmented with:
 * - **User Data:** Fetched via a nested listener on the user's document.
 * - **User Membership Data:** Fetched via a nested listener on the membership document.
 * - **Club Membership Data:** If available, fetched via an additional nested listener.
 *
 * **Callback Behavior:**
 * The provided `callback` is called initially with the first set of sessions and then again whenever
 * any of the underlying documents (session, user, membership, or club membership) update.
 *
 * **Pagination:**
 * When `startAfterDoc` is provided, the query will fetch sessions starting immediately after that document.
 *
 * @param {string} clubId - The Firestore ID of the club.
 * @param {number} pageSize - The maximum number of session documents to fetch.
 * @param {QueryDocumentSnapshot<DocumentData> | null} startAfterDoc - Document snapshot to start after (for pagination).
 * @param {(data: PaginatedClubSessionsExtendedType) => void} callback - Function invoked with updated session data.
 * @param {(error: Error) => void} [errorCallback] - Optional function called if an error occurs during any subscription.
 * @param {Date} [startDate] - (Optional) Only include sessions with `date >= startDate`.
 * @param {Date} [endDate] - (Optional) Only include sessions with `date <= endDate`.
 * @returns {() => void} A cleanup function that, when called, unsubscribes from all active listeners.
 */
export const subscribeToSessionsForClub = (
  clubId: string,
  pageSize: number,
  startAfterDoc: QueryDocumentSnapshot<DocumentData> | null,
  callback: (data: PaginatedClubSessionsExtendedType) => void,
  errorCallback?: (error: Error) => void,
  startDate?: Date,
  endDate?: Date,
) => {
  // Build a reference to the specific club document and its "sessions" subcollection.
  const clubDocRef = doc(db, "clubs", clubId);
  const sessionsRef = collection(clubDocRef, "sessions");

  // Collect all query constraints in an array to pass into Firestore's query builder.
  const constraints: QueryConstraint[] = [];

  // If startDate is provided, adjust it to the very beginning of that day (00:00:00.000)
  if (startDate) {
    const startOfDay = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      0,
      0,
      0,
      0,
    );
    constraints.push(where("date", ">=", startOfDay));
  }

  // If endDate is provided, adjust it to the very end of that day (23:59:59.999)
  if (endDate) {
    const endOfDay = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      23,
      59,
      59,
      999,
    );
    constraints.push(where("date", "<=", endOfDay));
  }

  // Order sessions by date in descending order (most recent first).
  constraints.push(orderBy("date", "desc"));

  // For pagination: if a starting document is provided, continue after that document.
  if (startAfterDoc) {
    constraints.push(startAfter(startAfterDoc));
  }

  // Limit the number of sessions returned to the specified page size.
  constraints.push(limit(pageSize));

  // Create the final Firestore query with the accumulated constraints.
  const sessionsQuery = query(sessionsRef, ...constraints);

  // This array will hold unsubscribe functions for all nested listeners.
  let extraUnsubs: Array<() => void> = [];

  // Subscribe to the main sessions query for real-time updates.
  const unsubscribe = onSnapshot(
    sessionsQuery,
    (sessionDocSnapshot) => {
      // Clear any existing nested subscriptions before processing the new snapshot.
      extraUnsubs.forEach((fn) => fn());
      extraUnsubs = [];

      // Map each session document into an extended session object.
      const extendedSessions: ExtendedClubSessionType[] =
        sessionDocSnapshot.docs.map((docSnap) => {
          // Map the base session data.
          const baseSession = mapDocToBaseSession(docSnap);
          // Create an extended session structure with placeholders for nested data.
          const extendedSession: ExtendedClubSessionType = {
            ...baseSession,
            userData: null,
            userMembershipData: null,
            clubMembershipData: null,
          };

          // 1) Subscribe to real-time updates on the user document referenced in the session.
          const unsubUser = onSnapshot(
            baseSession.user,
            (userDocSnapshot) => {
              extendedSession.userData = mapDocToUser(userDocSnapshot);
              // Invoke callback with updated session data whenever user data changes.
              callback({
                sessions: extendedSessions,
                lastVisible:
                  sessionDocSnapshot.docs[sessionDocSnapshot.docs.length - 1] ||
                  null,
              });
            },
            (err: FirestoreError) => {
              console.error("Error fetching user data:", err);
              if (errorCallback) errorCallback(err);
            },
          );
          extraUnsubs.push(unsubUser);

          // 2) Subscribe to real-time updates on the user membership document.
          const unsubMembership = onSnapshot(
            baseSession.membership,
            (membershipDocSnapshot) => {
              extendedSession.userMembershipData = mapDocToUserMembership(
                membershipDocSnapshot,
              );

              // 2a) If the user membership references a club membership, subscribe to that document.
              const clubMembershipRef =
                extendedSession.userMembershipData?.membership;
              if (clubMembershipRef) {
                const unsubClubMembership = onSnapshot(
                  clubMembershipRef,
                  (clubMembershipDocSnapshot) => {
                    extendedSession.clubMembershipData = mapDocToClubMembership(
                      clubMembershipDocSnapshot,
                    );
                    // Callback with updated data when club membership data changes.
                    callback({
                      sessions: extendedSessions,
                      lastVisible:
                        sessionDocSnapshot.docs[
                          sessionDocSnapshot.docs.length - 1
                        ] || null,
                    });
                  },
                  (err: FirestoreError) => {
                    console.error("Error fetching club membership data:", err);
                    if (errorCallback) errorCallback(err);
                  },
                );
                extraUnsubs.push(unsubClubMembership);
              }

              // Callback with updated data when user membership data changes.
              callback({
                sessions: extendedSessions,
                lastVisible:
                  sessionDocSnapshot.docs[sessionDocSnapshot.docs.length - 1] ||
                  null,
              });
            },
            (err: FirestoreError) => {
              console.error("Error fetching membership data:", err);
              if (errorCallback) errorCallback(err);
            },
          );
          extraUnsubs.push(unsubMembership);

          return extendedSession;
        });

      // Determine the last visible document from the snapshot (used for pagination).
      const lastVisible =
        sessionDocSnapshot.docs.length > 0
          ? sessionDocSnapshot.docs[sessionDocSnapshot.docs.length - 1]
          : null;

      // Initial callback invocation with the current set of extended sessions.
      callback({ sessions: extendedSessions, lastVisible });
    },
    (error: FirestoreError) => {
      console.error("Error subscribing to sessions:", error);
      if (errorCallback) errorCallback(error);
    },
  );

  // Return a cleanup function that unsubscribes from the main query and all nested listeners.
  return () => {
    unsubscribe();
    extraUnsubs.forEach((fn) => fn());
  };
};
