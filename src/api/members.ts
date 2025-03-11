import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  FirestoreError,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {
  mapDocToBaseClubMember,
  mapDocToUser,
  mapDocToUserMembership,
} from "./mappers";
import { ExtendedClubMemberType } from "@/schemas/members";

/**
 * Subscribes to real-time updates for club members associated with a specific class.
 *
 * This function sets up a Firestore listener on the "members" subcollection of the specified club.
 * It filters the documents to include only those where the "classes" array contains the provided classId.
 * For each club member document, it creates an extended club member object by:
 *  - Mapping the base club member data using `mapDocToBaseClubMember`.
 *  - Establishing a nested listener on the user document referenced in the base club member and mapping it using `mapDocToUser`.
 *  - Setting up another nested listener to fetch the user's membership data for the club, mapped via `mapDocToUserMembership`.
 *
 * The callback is invoked with the updated list of extended club member objects whenever any relevant data changes.
 * If an error occurs at any point in the subscription process, the error is logged and the optional errorCallback
 * is invoked.
 *
 * @param clubId - The unique identifier of the club.
 * @param classId - The identifier of the class to filter the club members by.
 * @param callback - A function that receives an array of ExtendedClubMemberType objects when the data updates.
 * @param errorCallback - Optional. A function that receives an error if the subscription fails.
 *
 * @returns A function that can be called to unsubscribe from the real-time updates.
 *
 * @example
 * const unsubscribe = subscribeToMembersForClub(
 *   "club123",
 *   "class456",
 *   (members) => {
 *     console.log("Updated club members:", members);
 *   },
 *   (error) => {
 *     console.error("Error subscribing to club members:", error);
 *   }
 * );
 *
 * // To stop listening for updates:
 * unsubscribe();
 */
export const subscribeToMembersForClub = (
  clubId: string,
  classId: string,
  callback: (data: ExtendedClubMemberType[]) => void,
  errorCallback?: (error: Error) => void,
) => {
  // Build a reference to the specific club document and its "members" subcollection.
  const clubDocRef = doc(db, "clubs", clubId);
  const clubClassDocRef = doc(clubDocRef, "classes", classId);

  // Reference to the "members" subcollection within the club document.
  const clubMembersRef = collection(clubDocRef, "members");

  // Create a query to filter club members whose "classes" array contains the specified club class reference.
  const clubMembersQuery = query(
    clubMembersRef,
    where("classes", "array-contains", clubClassDocRef),
  );

  // This array will hold unsubscribe functions for all nested listeners.
  let extraUnsubs: Array<() => void> = [];

  // Subscribe to the main club members query for real-time updates.
  const unsubscribe = onSnapshot(
    clubMembersQuery,
    (clubMemberDocSnapshot) => {
      // Clear any existing nested subscriptions before processing the new snapshot.
      extraUnsubs.forEach((fn) => fn());
      extraUnsubs = [];

      // Map each document in the snapshot to an extended club member object.
      const extendedClubMembers: ExtendedClubMemberType[] =
        clubMemberDocSnapshot.docs.map((docSnap) => {
          // Map the base club member data.
          const baseClubMember = mapDocToBaseClubMember(docSnap);
          // Create an extended club member structure with placeholders for nested data.
          const extendedClubMember: ExtendedClubMemberType = {
            ...baseClubMember,
            userData: null,
            userMembershipData: null,
          };

          // Subscribe to real-time updates on the user document referenced in the base club member.
          const unsubUser = onSnapshot(
            baseClubMember.user,
            (userDocSnapshot) => {
              extendedClubMember.userData = mapDocToUser(userDocSnapshot);

              // Build a reference to the "memberships" subcollection for the user.
              const userMembershipsRef = collection(
                db,
                "users",
                extendedClubMember.userData.id,
                "memberships",
              );

              // Create a query to fetch the membership data for the current club.
              const membershipQuery = query(
                userMembershipsRef,
                where("club", "==", clubDocRef),
              );

              // Subscribe to real-time updates on the membership data.
              const unsubMembership = onSnapshot(
                membershipQuery,
                (membershipSnapshot) => {
                  if (!membershipSnapshot.empty) {
                    const membershipDoc = membershipSnapshot.docs[0];
                    extendedClubMember.userMembershipData =
                      mapDocToUserMembership(membershipDoc);
                    // Invoke the callback with updated data.
                    callback(extendedClubMembers);
                  }
                },
                (err: FirestoreError) => {
                  console.error("Error fetching membership data:", err);
                  if (errorCallback) errorCallback(err);
                },
              );

              // Store the unsubscribe function for the membership listener.
              extraUnsubs.push(unsubMembership);

              // Invoke the callback with updated user data.
              callback(extendedClubMembers);
            },
            (err: FirestoreError) => {
              console.error("Error fetching user data:", err);
              if (errorCallback) errorCallback(err);
            },
          );

          // Store the unsubscribe function for the user listener.
          extraUnsubs.push(unsubUser);

          return extendedClubMember;
        });

      // Call the callback with the updated list of club members.
      callback(extendedClubMembers);
    },
    (error: FirestoreError) => {
      console.error("Error subscribing to members:", error);
      if (errorCallback) errorCallback(error);
    },
  );

  // Return a cleanup function that unsubscribes from the main query and all nested listeners.
  return () => {
    unsubscribe();
    extraUnsubs.forEach((fn) => fn());
  };
};
