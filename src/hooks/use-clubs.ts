import { ClubContext } from "@/providers/ClubProvider";
import { useContext } from "react";

function useClubs() {
  return useContext(ClubContext);
}

export { useClubs };
