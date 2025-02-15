import { ClubContext, ClubContextValue } from "@/contexts/club-context";
import { useContext } from "react";

/**
 * Custom hook to access the club context.
 *
 * This hook provides access to the current club context state, including the list of clubs,
 * loading and error states, the currently selected club, and a method to update the selected club.
 *
 * @returns The current value of the club context.
 */
function useClubs(): ClubContextValue {
  // Retrieve and return the current context value for clubs.
  return useContext(ClubContext);
}

export { useClubs };
