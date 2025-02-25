import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  FirestoreError,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { mapDocToBaseClubMember, mapDocToUser } from "./mappers";
import { ExtendedClubMemberType } from "@/schemas/members";

/**
 * Subscribes to real-time updates for club members associated with a specific class.
 *
 * This function sets up a Firestore listener on the "members" subcollection of the specified club.
 * It filters the documents to include only those where the "classes" array contains the provided classId.
 * When a change is detected, each club member document with its user reference is mapped to a ExtendedClubMemberType object using the mapDocToBaseClubMember and mapDocToUser functions,
 * and the resulting array is passed to the callback function.
 * In case of an error during the subscription, the error is logged to the console and, if provided, the errorCallback is invoked.
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

  const clubMembersRef = collection(clubDocRef, "members");

  // Create a query against the "members" subcollection.
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
          };

          // Subscribe to real-time updates on the user document referenced in the base club member.
          const unsubUser = onSnapshot(
            baseClubMember.user,
            (userDocSnapshot) => {
              extendedClubMember.userData = mapDocToUser(userDocSnapshot);
              // Invoke callback with updated session data whenever user data changes.
              callback(extendedClubMembers);
            },
            (err: FirestoreError) => {
              console.error("Error fetching user data:", err);
              if (errorCallback) errorCallback(err);
            },
          );

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
