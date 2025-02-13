import { ClubType } from "@/schemas/club";
import { createContext, Dispatch, SetStateAction } from "react";

type ClubContextValue = {
  clubs: ClubType[];
  loading: boolean;
  error: Error | null;
  selectedClub: ClubType | null;
  setSelectedClub: Dispatch<SetStateAction<ClubType | null>>;
};

const ClubContext = createContext<ClubContextValue>({
  clubs: [],
  loading: false,
  error: null,
  selectedClub: null,
  setSelectedClub: () => {},
});

export { ClubContext };
