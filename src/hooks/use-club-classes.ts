import { subscribeToClassesForClub } from "@/api/classes";
import { ClubClassType } from "@/schemas/classes";
import { useEffect, useState } from "react";

/**
 * Custom React hook to subscribe to real-time updates of a club's classes.
 *
 * This hook utilizes the `subscribeToClassesForClub` function to listen for changes
 * in a club's classes collection in Firestore. It manages the state for the club class data,
 * any errors that occur during the subscription, and a loading indicator while the data is being fetched.
 *
 * @param {string} clubId - The unique identifier of the club for which to subscribe to class updates.
 * @returns {{
 *   data: ClubClassType[],
 *   error: Error | null,
 *   loading: boolean
 * }} An object containing:
 *   - `data`: An array of club class objects.
 *   - `error`: Any error encountered during the subscription (or `null` if no error occurred).
 *   - `loading`: A boolean indicating whether the data is currently being loaded.
 */
const useClubClasses = (clubId: string) => {
  // State to store the club classes data.
  const [data, setData] = useState<ClubClassType[]>([]);

  // State to store any error encountered during the subscription process.
  const [error, setError] = useState<Error | null>(null);

  // State indicating whether data is currently being loaded.
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!clubId) return;

    setLoading(true);

    // Begin subscription to the club's classes.
    // The subscription listens for real-time updates and invokes callbacks accordingly.
    const unsubscribe = subscribeToClassesForClub(
      clubId,
      // Success callback: update the club class data and mark loading as complete.
      (newData) => {
        setData(newData);
        setLoading(false);
      },
      // Error callback: log the error, update the error state, and mark loading as complete.
      (err) => {
        console.error("Error subscribing to classes:", err);
        setError(err);
        setLoading(false);
      },
    );

    // Cleanup: Unsubscribe from the club classes updates when the component unmounts or when the clubId changes.
    return () => {
      unsubscribe();
    };
  }, [clubId]);

  // Return the current club class data, any subscription error, and the loading status.
  return { data, error, loading };
};

export { useClubClasses };
