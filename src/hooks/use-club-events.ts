import { subscribeToEventsForClub } from "@/api/events";
import { ClubEventType } from "@/schemas/events";
import { useEffect, useState } from "react";

/**
 * Custom React hook to subscribe to real-time updates of a club's events.
 *
 * This hook utilizes the `subscribeToEventsForClub` function to listen for changes
 * in a club's events collection in Firestore. It manages the state for the club event data,
 * any errors that occur during the subscription, and a loading indicator while the data is being fetched.
 *
 * @param {string} clubId - The unique identifier of the club for which to subscribe to events updates.
 * @returns {{
 *   data: ClubEventType[],
 *   error: Error | null,
 *   loading: boolean
 * }} An object containing:
 *   - `data`: An array of club events objects.
 *   - `error`: Any error encountered during the subscription (or `null` if no error occurred).
 *   - `loading`: A boolean indicating whether the data is currently being loaded.
 */
const useClubEvents = (clubId: string) => {
  // State to store the club events data.
  const [data, setData] = useState<ClubEventType[]>([]);

  // State to store any error encountered during the subscription process.
  const [error, setError] = useState<Error | null>(null);

  // State indicating whether data is currently being loaded.
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!clubId) return;

    setLoading(true);

    // Begin subscription to the club's events.
    // The subscription listens for real-time updates and invokes callbacks accordingly.
    const unsubscribe = subscribeToEventsForClub(
      clubId,
      // Success callback: update the club event data and mark loading as complete.
      (newData) => {
        setData(newData);
        setLoading(false);
      },
      // Error callback: log the error, update the error state, and mark loading as complete.
      (error) => {
        console.error("Error subscribing to events:", error);
        setError(error);
        setLoading(false);
      },
    );

    // Cleanup: Unsubscribe from the club events updates when the component unmounts or when the clubId changes.
    return () => {
      unsubscribe();
    };
  }, [clubId]);

  // Return the current club event data, any subscription error, and the loading status.
  return { data, error, loading };
};

export { useClubEvents };
