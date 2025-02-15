/**
 * @fileoverview This file provides a custom hook `useAuth` for accessing the authentication context.
 * It wraps React's `useContext` hook to allow components to easily consume the authentication state.
 */

import { AuthContext, AuthContextType } from "@/contexts/auth-context";
import { useContext } from "react";

/**
 * Custom hook to access the authentication context.
 *
 * This hook abstracts the use of React's `useContext` to provide the authentication context,
 * which includes the current Firebase user and the loading status.
 *
 * @returns {AuthContextType} The authentication context value containing the `user` and `loading` state.
 */
function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export { useAuth };
