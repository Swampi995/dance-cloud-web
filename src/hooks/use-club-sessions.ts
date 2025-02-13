import { useState, useEffect } from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { subscribeToSessionsForClub } from "@/api/sessions";
import { PaginatedClubSessionsExtendedType } from "@/schemas/session";

const useClubSessions = (
  clubId: string,
  pageSize: number,
  startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null,
) => {
  const [data, setData] = useState<PaginatedClubSessionsExtendedType>({
    sessions: [],
    lastVisible: null,
  });
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to real-time updates using your custom subscription function
    if (!clubId) return;
    setLoading(true);

    const unsubscribe = subscribeToSessionsForClub(
      clubId,
      pageSize,
      startAfterDoc ?? null,
      (newData) => {
        setData(newData);
        setLoading(false);
      },
      (err) => {
        console.error("Error subscribing to sessions:", err);
        setError(err);
        setLoading(false);
      },
    );

    // Clean up the subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [clubId, pageSize, startAfterDoc]);

  return { data, error, loading };
};

export { useClubSessions };
