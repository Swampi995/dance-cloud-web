import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
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
  selectedClub: Club | null;
  setSelectedClub: Dispatch<SetStateAction<Club | null>>;
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
  selectedClub: null,
  setSelectedClub: () => {},
});

export function ClubProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

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

        if (clubsData.length > 0) {
          const storedClubId = localStorage.getItem(
            `selectedClubId:${user.uid}`,
          );

          const matchedClub = storedClubId
            ? clubsData.find((club) => club.id === storedClubId)
            : null;

          setSelectedClub(matchedClub ?? clubsData[0]);
        }
      } catch (err) {
        console.error("Error fetching clubs:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [user]);

  useEffect(() => {
    if (selectedClub && user) {
      localStorage.setItem(`selectedClubId:${user.uid}`, selectedClub.id);
    }
  }, [selectedClub]);

  return (
    <ClubContext.Provider
      value={{
        clubs,
        loading,
        error,
        selectedClub,
        setSelectedClub,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
}

// Custom hook for consuming context
export function useClubs() {
  return useContext(ClubContext);
}
