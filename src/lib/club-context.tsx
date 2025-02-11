// club-context.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore/lite";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Club, ClubSchema } from "@/schemas/club";

type ClubContextValue = {
  clubs: Club[];
  loading: boolean;
  error: Error | null;
};

export function mapDocToClub(doc: QueryDocumentSnapshot<DocumentData>): Club {
  const rawData = {
    id: doc.id,
    ...doc.data(),
  };

  const parsed = ClubSchema.parse(rawData);
  return parsed;
}

const ClubContext = createContext<ClubContextValue>({
  clubs: [],
  loading: false,
  error: null,
});

export function ClubProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      if (!user) return;
      setLoading(true);

      try {
        const clubsRef = collection(db, "clubs");
        const q = query(clubsRef, where("admins", "array-contains", user.uid));
        const snapshot = await getDocs(q);

        const clubsData = snapshot.docs.map(mapDocToClub);
        setClubs(clubsData);
      } catch (err) {
        console.error("Error fetching clubs:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [user]);

  return (
    <ClubContext.Provider value={{ clubs, loading, error }}>
      {children}
    </ClubContext.Provider>
  );
}

// Custom hook for consuming context
export function useClubs() {
  return useContext(ClubContext);
}
