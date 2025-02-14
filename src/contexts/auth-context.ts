/**
 * @fileoverview This file sets up the authentication context for the application.
 * It defines the type for the authentication state and creates a React Context
 * to manage the authenticated user and loading status across the app.
 */

import { User } from "firebase/auth";
import { createContext } from "react";

/**
 * Type definition for the authentication context.
 *
 * @typedef {Object} AuthContextType
 * @property {User | null} user - The authenticated Firebase user. It is null if no user is authenticated.
 * @property {boolean} loading - Indicates whether the authentication state is still loading.
 */
export type AuthContextType = {
  user: User | null;
  loading: boolean;
};

/**
 * React Context for managing authentication state.
 *
 * This context provides a way to share authentication-related data (the user and loading status)
 * across the component tree without having to pass props down manually at every level.
 *
 * The default value is set with `user` as null (no user authenticated) and `loading` as true.
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export { AuthContext };
