import { ClubContext } from "@/contexts/club-context";
import { useContext } from "react";

function useClubs() {
  return useContext(ClubContext);
}

export { useClubs };
