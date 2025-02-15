import { useState, useEffect } from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { subscribeToSessionsForClub } from "@/api/sessions";
import { PaginatedClubSessionsExtendedType } from "@/schemas/session";

/**
 * Custom hook to subscribe to a club's sessions with real-time updates.
 *
 * This hook manages the subscription to a Firebase collection of club sessions. It handles:
 * - Real-time data updates via Firebase's subscription mechanism.
 * - Pagination by tracking the last visible document snapshot.
 * - Optional filtering by start and end dates.
 * - Loading state management.
 * - Error handling.
 *
 * The subscription automatically cleans up on component unmount or when any of the dependencies change.
 *
 * @param {string} clubId - Unique identifier for the club whose sessions are being fetched.
 * @param {number} pageSize - The maximum number of sessions to fetch per page.
 * @param {QueryDocumentSnapshot<DocumentData> | null | undefined} [startAfterDoc] -
 *   Document snapshot used as a starting point for pagination. If omitted, fetching begins from the first document.
 * @param {Date} [startDate] - Optional filter to only fetch sessions occurring on or after this date.
 * @param {Date} [endDate] - Optional filter to only fetch sessions occurring on or before this date.
 *
 * @returns {{
 *   data: PaginatedClubSessionsExtendedType,
 *   error: Error | null,
 *   loading: boolean
 * }}
 *   An object containing:
 *   - `data`: The paginated session data, including an array of sessions and the last visible document snapshot.
 *   - `error`: Any error encountered during the subscription process, or null if no error occurred.
 *   - `loading`: A boolean indicating whether the subscription is in the process of fetching data.
 */
const useClubSessions = (
  clubId: string,
  pageSize: number,
  startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null,
  startDate?: Date,
  endDate?: Date,
) => {
  // State to store the paginated sessions data. It includes both the list of sessions
  // and the reference to the last visible document snapshot for pagination.
  const [data, setData] = useState<PaginatedClubSessionsExtendedType>({
    sessions: [],
    lastVisible: null,
  });

  // State to store any error encountered during the subscription process.
  const [error, setError] = useState<Error | null>(null);

  // State indicating whether data is currently being loaded.
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Ensure clubId is provided before attempting to subscribe.
    if (!clubId) return;

    setLoading(true);

    // Begin subscription to the club's sessions.
    // The subscription will listen for real-time updates and invoke callbacks accordingly.
    const unsubscribe = subscribeToSessionsForClub(
      clubId,
      pageSize,
      startAfterDoc ?? null,
      // Success callback: Update the session data and mark loading as complete.
      (newData) => {
        setData(newData);
        setLoading(false);
      },
      // Error callback: Log the error, update the error state, and mark loading as complete.
      (err) => {
        console.error("Error subscribing to sessions:", err);
        setError(err);
        setLoading(false);
      },
      startDate,
      endDate,
    );

    // Cleanup: Unsubscribe from the session updates when the component unmounts or when any dependency changes.
    return () => {
      unsubscribe();
    };
  }, [clubId, pageSize, startAfterDoc, startDate, endDate]);

  // Return the current session data, any subscription error, and the loading status.
  return { data, error, loading };
};

export { useClubSessions };
