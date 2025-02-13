import { db } from "@/lib/firebase";
import { ClubType } from "@/schemas/club";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { mapDocToClub } from "./mappers";

/**
 * Subscribes to clubs for a given user.
 *
 * @param userId - The ID of the user.
 * @param callback - Called with an updated list of clubs whenever data changes.
 * @param errorCallback - (Optional) Called when an error occurs.
 * @returns A function to unsubscribe the listener.
 */
export const subscribeToClubsForUser = (
  userId: string,
  callback: (clubs: ClubType[]) => void,
  errorCallback?: (error: Error) => void,
) => {
  const clubsRef = collection(db, "clubs");
  const q = query(clubsRef, where("admins", "array-contains", userId));
  // onSnapshot delivers an initial snapshot (possibly from cache) and then updates.
  return onSnapshot(
    q,
    (snapshot) => {
      const clubsData = snapshot.docs.map(mapDocToClub);
      callback(clubsData);
    },
    (error) => {
      console.error("Error subscribing to clubs:", error);
      if (errorCallback) errorCallback(error);
    },
  );
};
