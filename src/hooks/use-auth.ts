import { AuthContext } from "@/contexts/auth-context";
import { useContext } from "react";

function useAuth() {
  return useContext(AuthContext);
}

export { useAuth };
