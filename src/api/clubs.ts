import { db } from "@/lib/firebase"; // Import the Firestore database instance.
import { ClubType } from "@/schemas/club"; // Import the ClubType definition.
import { collection, query, where, onSnapshot } from "firebase/firestore"; // Import Firestore functions.
import { mapDocToClub } from "./mappers"; // Import helper to map Firestore docs to ClubType objects.

/**
 * Subscribes to clubs for a given user.
 *
 * This function sets up a real-time Firestore listener on the "clubs" collection.
 * It filters the clubs where the given user is an admin (using the "admins" array field).
 * Every time the data changes, the provided callback is invoked with the updated list of clubs.
 *
 * @param {string} userId - The ID of the user to filter clubs by.
 * @param {(clubs: ClubType[]) => void} callback - Function called with the updated clubs data.
 * @param {(error: Error) => void} [errorCallback] - Optional function called when an error occurs.
 * @returns {() => void} A function to unsubscribe the Firestore listener.
 */
export const subscribeToClubsForUser = (
  userId: string,
  callback: (clubs: ClubType[]) => void,
  errorCallback?: (error: Error) => void,
) => {
  // Create a reference to the "clubs" collection in Firestore.
  const clubsRef = collection(db, "clubs");

  // Build a query to find clubs where the "admins" field includes the specified userId.
  const clubQuery = query(clubsRef, where("admins", "array-contains", userId));

  // Start listening for real-time updates with onSnapshot.
  // onSnapshot returns an unsubscribe function to stop listening.
  return onSnapshot(
    clubQuery,
    (clubDocSnapshot) => {
      // Map each document in the snapshot to a ClubType object.
      const clubsData = clubDocSnapshot.docs.map(mapDocToClub);
      // Call the callback with the updated list of clubs.
      callback(clubsData);
    },
    (error) => {
      // Log the error to the console.
      console.error("Error subscribing to clubs:", error);
      // If an error callback was provided, call it with the error.
      if (errorCallback) errorCallback(error);
    },
  );
};
