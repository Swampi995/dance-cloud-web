import { useState, useEffect, ReactNode } from "react";
import { ClubType } from "@/schemas/club";
import { useAuth } from "@/hooks/use-auth";
import { subscribeToClubsForUser } from "@/api/clubs";
import { ClubContext } from "@/contexts/club-context";

function ClubProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<ClubType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedClub, setSelectedClub] = useState<ClubType | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    // Subscribe to clubs updates in real time
    const unsubscribe = subscribeToClubsForUser(
      // user.uid,
      "f1WLBZdgCUYtbaGcwtn1GL9rH832",
      (clubsData) => {
        setClubs(clubsData);
        if (clubsData.length > 0) {
          const storedClubId = localStorage.getItem(
            `selectedClubId:${user.uid}`,
          );
          const matchedClub = storedClubId
            ? clubsData.find((club) => club.id === storedClubId)
            : null;
          setSelectedClub(matchedClub ?? clubsData[0]);
        } else {
          setSelectedClub(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    // Clean up the listener when the component unmounts or when the user changes.
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (selectedClub && user) {
      localStorage.setItem(`selectedClubId:${user.uid}`, selectedClub.id);
    }
  }, [selectedClub, user]);

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

export { ClubProvider };
