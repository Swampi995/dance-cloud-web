import { AuthContext } from "@/providers/AuthProvider";
import { useContext } from "react";

function useAuth() {
  return useContext(AuthContext);
}

export { useAuth };
