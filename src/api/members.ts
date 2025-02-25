import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  FirestoreError,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { mapDocToClubMember } from "./mappers";
import { ClubMemberType } from "@/schemas/members";

/**
 * Subscribes to real-time updates for club members associated with a specific class.
 *
 * This function sets up a Firestore listener on the "members" subcollection of the specified club.
 * It filters the documents to include only those where the "classes" array contains the provided classId.
 * When a change is detected, each document is mapped to a ClubMemberType object using the mapDocToClubMember function,
 * and the resulting array is passed to the callback function.
 * In case of an error during the subscription, the error is logged to the console and, if provided, the errorCallback is invoked.
 *
 * @param clubId - The unique identifier of the club.
 * @param classId - The identifier of the class to filter the club members by.
 * @param callback - A function that receives an array of ClubMemberType objects when the data updates.
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
  callback: (data: ClubMemberType[]) => void,
  errorCallback?: (error: Error) => void,
) => {
  // Build a reference to the specific club document and its "members" subcollection.
  const clubDocRef = doc(db, "clubs", clubId);
  const membersRef = collection(clubDocRef, "members");

  // Create a query against the "members" subcollection.
  const membersQuery = query(
    membersRef,
    where("classes", "array-contains", classId),
  );

  // Start listening for real-time updates with onSnapshot.
  // onSnapshot returns an unsubscribe function to stop listening.
  return onSnapshot(
    membersQuery,
    (clubMemberDocSnapshot) => {
      // Map each document in the snapshot to a ClubMemberType object.
      const clubMemberData = clubMemberDocSnapshot.docs.map(mapDocToClubMember);
      // Call the callback with the updated list of club members.
      callback(clubMemberData);
    },
    (error: FirestoreError) => {
      // Log the error to the console.
      console.error("Error subscribing to members:", error);
      // If an error callback was provided, call it with the error.
      if (errorCallback) errorCallback(error);
    },
  );
};
