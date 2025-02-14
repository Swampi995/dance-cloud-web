import { useState, useEffect, ReactNode } from "react";
import { ClubType } from "@/schemas/club";
import { useAuth } from "@/hooks/use-auth";
import { subscribeToClubsForUser } from "@/api/clubs";
import { ClubContext } from "@/contexts/club-context";

/**
 * ClubProvider component that subscribes to real-time club updates for the current user.
 *
 * This component listens for changes to the clubs associated with the authenticated user.
 * It updates the list of clubs and selects a club (either from localStorage or the first available)
 * once the data is received. It also handles loading and error states during the subscription process.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - Child components that will have access to the club context.
 * @returns {JSX.Element} The ClubContext provider wrapping the children.
 */
function ClubProvider({ children }: { children: ReactNode }) {
  // Retrieve the currently authenticated user
  const { user } = useAuth();

  // State to hold the list of clubs associated with the user
  const [clubs, setClubs] = useState<ClubType[]>([]);
  // State to indicate if club data is currently being loaded
  const [loading, setLoading] = useState(false);
  // State to capture any error during club data fetching
  const [error, setError] = useState<Error | null>(null);
  // State to track the currently selected club
  const [selectedClub, setSelectedClub] = useState<ClubType | null>(null);

  /**
   * Effect to subscribe to club updates for the authenticated user.
   * When the user is available, it subscribes to real-time updates.
   * On data update, it stores the clubs and selects an appropriate club.
   * Also handles cleanup when the component unmounts or the user changes.
   */
  useEffect(() => {
    if (!user) return;

    // Indicate loading state while fetching club data
    setLoading(true);

    // Subscribe to real-time club updates for the user.
    // Note: The user.uid is commented out and replaced with a static value for now.
    const unsubscribe = subscribeToClubsForUser(
      // Intended usage: user.uid,
      "f1WLBZdgCUYtbaGcwtn1GL9rH832",
      // Success callback: update clubs and set selected club.
      (clubsData) => {
        setClubs(clubsData);

        if (clubsData.length > 0) {
          // Retrieve the stored club id from localStorage for the current user
          const storedClubId = localStorage.getItem(
            `selectedClubId:${user.uid}`,
          );
          // Try to find the club that matches the stored id
          const matchedClub = storedClubId
            ? clubsData.find((club) => club.id === storedClubId)
            : null;
          // If a matching club is found, set it as selected; otherwise, select the first club
          setSelectedClub(matchedClub ?? clubsData[0]);
        } else {
          // No clubs available, so clear the selected club
          setSelectedClub(null);
        }

        // Loading is complete once clubs data is received
        setLoading(false);
      },
      // Error callback: update error state and stop loading.
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    // Cleanup the subscription when the component unmounts or when the user changes.
    return () => unsubscribe();
  }, [user]);

  /**
   * Effect to update localStorage with the currently selected club id.
   * This ensures that on subsequent loads, the previously selected club can be restored.
   */
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
