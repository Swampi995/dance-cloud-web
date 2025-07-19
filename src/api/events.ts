import { db } from "@/lib/firebase";
import { ClubEventType } from "@/schemas/events";
import {
  collection,
  doc,
  FirestoreError,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { mapDocToClubEvent } from "./mappers";

/**
 * Subscribes to real-time updates for a club's events in Firestore.
 *
 * This function sets up a Firestore listener on the "events" subcollection of a specific club document.
 * When the data changes, the provided callback is invoked with an array of ClubEventType objects.
 * If an error occurs during the subscription, it will be logged to the console and passed to an optional error callback.
 * @param {string} clubId - The unique identifier of the club.
 * @param {(data: ClubEventType[]) => void} callback - A function to be called with the updated list of club events.
 * @param {(error: Error) => void} [errorCallback] - An optional function to be called if an error occurs.
 * @param {(Date|Timestamp)=} endAfter
 *   Optional. Only fire the callback for events whose **`endAfter`**
 *   is on or after this value.
 * @param {(Date|Timestamp)=} endBefore
 *   Optional. Only fire the callback for events whose **`endDate`**
 *   is *on or before* this value.
 *   Can be combined with `endAfter` to create a bounded date range.
 *
 * @returns {() => void} A function to unsubscribe from the real-time updates.
 *
 * @example
 * // Subscribe to events that end after 1 Jan 2025 and END before 30 Jun 2025:
 * const unsubscribe = subscribeToEventsForClub(
 *   "club123",
 *   (events) => console.log(events),
 *   console.error,
 *   new Date("2025-01-01"),   // endAfter   (endDate >= 1 Jan 2025)
 *   new Date("2025-06-30"),   // endBefore    (endDate  <= 30 Jun 2025)
 * );
 */
export const subscribeToEventsForClub = (
  clubId: string,
  callback: (data: ClubEventType[]) => void,
  errorCallback?: (error: Error) => void,
  endAfter?: Date | Timestamp,
  endBefore?: Date | Timestamp,
) => {
  // Build a reference to the specific club document and its "events" subcollection.
  const eventsRef = collection(db, "events");
  const clubDocRef = doc(db, "clubs", clubId);

  // Create a query against the "events" subcollection.
  let eventsQuery = query(eventsRef, where("club", "==", clubDocRef));

  /**
   * Firestore requires an orderBy on every field that has a range (inequality) filter.
   */
  if (endAfter) {
    eventsQuery = query(eventsQuery, orderBy("endDate", "asc"));
  }

  if (endBefore) {
    eventsQuery = query(eventsQuery, orderBy("endDate", "desc"));
  }

  if (endAfter) {
    eventsQuery = query(
      eventsQuery,
      where(
        "endDate",
        ">=",
        endAfter instanceof Date ? Timestamp.fromDate(endAfter) : endAfter,
      ),
    );
  }

  if (endBefore) {
    eventsQuery = query(
      eventsQuery,
      where(
        "endDate",
        "<",
        endBefore instanceof Date ? Timestamp.fromDate(endBefore) : endBefore,
      ),
    );
  }

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
