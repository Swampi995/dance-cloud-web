import { subscribeToMembersForClub } from "@/api/members";
import { ClubMemberType } from "@/schemas/members";
import { useEffect, useState } from "react";

/**
 * Custom React hook to subscribe to real-time updates of a club's members.
 *
 * This hook utilizes the `subscribeToMembersForClub` function to listen for changes
 * in a club's members collection in Firestore. It manages the state for the club member data,
 * any errors that occur during the subscription, and a loading indicator while the data is being fetched.
 *
 * @param {string} clubId - The unique identifier of the club for which to subscribe to member updates.
 * @param {string} classId - The unique identifier of the club's class for which to subscribe to member updates.
 * @returns {{
 *   data: ClubMemberType[],
 *   error: Error | null,
 *   loading: boolean
 * }} An object containing:
 *   - `data`: An array of club member objects.
 *   - `error`: Any error encountered during the subscription (or `null` if no error occurred).
 *   - `loading`: A boolean indicating whether the data is currently being loaded.
 */
const useClubMembers = (clubId: string, classId: string) => {
  // State to store the club member data.
  const [data, setData] = useState<ClubMemberType[]>([]);

  // State to store any error encountered during the subscription process.
  const [error, setError] = useState<Error | null>(null);

  // State indicating whether data is currently being loaded.
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!clubId || !classId) return;

    setLoading(true);

    // Begin subscription to the club's members.
    // The subscription listens for real-time updates and invokes callbacks accordingly.
    const unsubscribe = subscribeToMembersForClub(
      clubId,
      classId,
      // Success callback: update the club member data and mark loading as complete.
      (newData) => {
        setData(newData);
        setLoading(false);
      },
      // Error callback: log the error, update the error state, and mark loading as complete.
      (err) => {
        console.error("Error subscribing to members:", err);
        setError(err);
        setLoading(false);
      },
    );

    // Cleanup: Unsubscribe from the club members updates when the component unmounts or when the clubId or classId changes.
    return () => {
      unsubscribe();
    };
  }, [clubId, classId]);

  // Return the current club member data, any subscription error, and the loading status.
  return { data, error, loading };
};

export { useClubMembers };
