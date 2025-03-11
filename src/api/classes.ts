import { db } from "@/lib/firebase";
import { ClubClassType } from "@/schemas/classes";
import {
  collection,
  doc,
  FirestoreError,
  onSnapshot,
  query,
} from "firebase/firestore";
import { mapDocToClubClass } from "./mappers";

/**
 * Subscribes to real-time updates for a club's classes in Firestore.
 *
 * This function sets up a Firestore listener on the "classes" subcollection of a specific club document.
 * When the data changes, the provided callback is invoked with an array of ClubClassType objects.
 * If an error occurs during the subscription, it will be logged to the console and passed to an optional error callback.
 *
 * @param {string} clubId - The unique identifier of the club.
 * @param {(data: ClubClassType[]) => void} callback - A function to be called with the updated list of club classes.
 * @param {(error: Error) => void} [errorCallback] - An optional function to be called if an error occurs.
 * @returns {() => void} A function to unsubscribe from the real-time updates.
 *
 * @example
 * // Subscribe to updates for a club's classes:
 * const unsubscribe = subscribeToClassesForClub("club123", (classes) => {
 *   console.log("Updated club classes:", classes);
 * }, (error) => {
 *   console.error("Error subscribing to classes:", error);
 * });
 *
 * // When you no longer need to receive updates, call the unsubscribe function:
 * unsubscribe();
 */
export const subscribeToClassesForClub = (
  clubId: string,
  callback: (data: ClubClassType[]) => void,
  errorCallback?: (error: Error) => void,
) => {
  // Build a reference to the specific club document and its "classes" subcollection.
  const clubDocRef = doc(db, "clubs", clubId);
  const classesRef = collection(clubDocRef, "classes");

  // Create a query against the "classes" subcollection.
  const classesQuery = query(classesRef);

  // Start listening for real-time updates with onSnapshot.
  // onSnapshot returns an unsubscribe function to stop listening.
  return onSnapshot(
    classesQuery,
    (clubClassDocSnapshot) => {
      // Map each document in the snapshot to a ClubClassType object.
      const clubClassData = clubClassDocSnapshot.docs.map(mapDocToClubClass);
      // Call the callback with the updated list of club classes.
      callback(clubClassData);
    },
    (error: FirestoreError) => {
      // Log the error to the console.
      console.error("Error subscribing to classes:", error);
      // If an error callback was provided, call it with the error.
      if (errorCallback) errorCallback(error);
    },
  );
};
