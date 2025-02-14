import { ClubType } from "@/schemas/club";
import { createContext, Dispatch, SetStateAction } from "react";

/**
 * Defines the shape of the club context.
 *
 * @typedef {Object} ClubContextValue
 * @property {ClubType[]} clubs - Array of clubs available for the user.
 * @property {boolean} loading - Indicates whether the club data is currently loading.
 * @property {Error | null} error - Contains error information if the club data failed to load.
 * @property {ClubType | null} selectedClub - The currently selected club.
 * @property {Dispatch<SetStateAction<ClubType | null>>} setSelectedClub - Function to update the selected club.
 */
export type ClubContextValue = {
  clubs: ClubType[];
  loading: boolean;
  error: Error | null;
  selectedClub: ClubType | null;
  setSelectedClub: Dispatch<SetStateAction<ClubType | null>>;
};

/**
 * ClubContext is a React context that holds the club state, including the list of clubs,
 * loading and error states, the currently selected club, and a method to update the selected club.
 *
 * @constant
 * @type {React.Context<ClubContextValue>}
 */
const ClubContext = createContext<ClubContextValue>({
  clubs: [],
  loading: false,
  error: null,
  selectedClub: null,
  setSelectedClub: () => {},
});

export { ClubContext };
