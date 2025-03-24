import { db } from "@/lib/firebase";
import { ClubEventType } from "@/schemas/events";
import {
  collection,
  doc,
  FirestoreError,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { mapDocToClubEvent } from "./mappers";

/**
 * Subscribes to real-time updates for a club's events in Firestore.
 *
 * This function sets up a Firestore listener on the "events" subcollection of a specific club document.
 * When the data changes, the provided callback is invoked with an array of ClubEventType objects.
 * If an error occurs during the subscription, it will be logged to the console and passed to an optional error callback.
 *
 * @param {string} clubId - The unique identifier of the club.
 * @param {(data: ClubEventType[]) => void} callback - A function to be called with the updated list of club events.
 * @param {(error: Error) => void} [errorCallback] - An optional function to be called if an error occurs.
 * @returns {() => void} A function to unsubscribe from the real-time updates.
 *
 * @example
 * // Subscribe to updates for a club's events:
 * const unsubscribe = subscribeToEventsForClub("club123", (events) => {
 *   console.log("Updated club events:", events);
 * }, (error) => {
 *   console.error("Error subscribing to events:", error);
 * });
 *
 * // When you no longer need to receive updates, call the unsubscribe function:
 * unsubscribe();
 */
export const subscribeToEventsForClub = (
  clubId: string,
  callback: (data: ClubEventType[]) => void,
  errorCallback?: (error: Error) => void,
) => {
  // Build a reference to the specific club document and its "events" subcollection.
  const eventsRef = collection(db, "events");
  const clubDocRef = doc(db, "clubs", clubId);

  // Create a query against the "events" subcollection.
  const eventsQuery = query(eventsRef, where("club", "==", clubDocRef));

  // Start listening for real-time updates with onSnapshot.
  // onSnapshot returns an unsubscribe function to stop listening.
  return onSnapshot(
    eventsQuery,
    (clubEventDocSnapshot) => {
      // Map each document in the snapshot to a ClubEventType object.
      const clubEventData = clubEventDocSnapshot.docs.map(mapDocToClubEvent);
      // Call the callback with the updated list of club events.
      callback(clubEventData);
    },
    (error: FirestoreError) => {
      // Log the error to the console.
      console.error("Error subscribing to events:", error);
      // If an error callback was provided, call it with the error.
      if (errorCallback) errorCallback(error);
    },
  );
};
