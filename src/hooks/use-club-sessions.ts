import { useState, useEffect } from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { subscribeToSessionsForClub } from "@/api/sessions";
import { PaginatedClubSessionsExtendedType } from "@/schemas/session";

/**
 * Custom hook to subscribe to club sessions with real-time updates.
 *
 * This hook uses a Firebase subscription function to listen for real-time
 * updates to club sessions, managing the loading, error, and paginated data states.
 *
 * @param {string} clubId - The unique identifier for the club.
 * @param {number} pageSize - The number of sessions to fetch per page.
 * @param {QueryDocumentSnapshot<DocumentData> | null | undefined} [startAfterDoc] -
 *   The document snapshot from which to start fetching sessions (for pagination).
 * @returns {{
 *   data: PaginatedClubSessionsExtendedType,
 *   error: Error | null,
 *   loading: boolean
 * }} An object containing the paginated session data, any subscription error, and loading state.
 */
const useClubSessions = (
  clubId: string,
  pageSize: number,
  startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null,
) => {
  // State to store the paginated sessions data.
  const [data, setData] = useState<PaginatedClubSessionsExtendedType>({
    sessions: [],
    lastVisible: null,
  });
  // State to store any error that occurs during the subscription.
  const [error, setError] = useState<Error | null>(null);
  // State to indicate whether the data is currently being loaded.
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // If no clubId is provided, do not initiate the subscription.
    if (!clubId) return;

    // Indicate that the data is loading.
    setLoading(true);

    // Start the subscription to club sessions.
    const unsubscribe = subscribeToSessionsForClub(
      clubId,
      pageSize,
      startAfterDoc ?? null,
      // Callback when new data is received.
      (newData) => {
        setData(newData);
        setLoading(false);
      },
      // Callback when an error occurs during subscription.
      (err) => {
        console.error("Error subscribing to sessions:", err);
        setError(err);
        setLoading(false);
      },
    );

    // Clean up the subscription when the component unmounts or dependencies change.
    return () => {
      unsubscribe();
    };
  }, [clubId, pageSize, startAfterDoc]);

  // Return the session data, any errors, and the loading status.
  return { data, error, loading };
};

export { useClubSessions };
