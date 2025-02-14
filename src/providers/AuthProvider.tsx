import { ReactNode, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import type { User } from "firebase/auth";
import { AuthContext } from "@/contexts/auth-context";

/**
 * Provides authentication state to its children via context.
 *
 * This component listens for changes in the Firebase authentication state and
 * updates the context accordingly. It initially sets the loading state to `true`
 * until the authentication state is determined.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {ReactNode} props.children - The children components that will have access to the auth context.
 * @returns {JSX.Element} The AuthContext provider wrapping the children.
 */
function AuthProvider({ children }: { children: ReactNode }) {
  // State for the authenticated user; null if no user is authenticated.
  const [user, setUser] = useState<User | null>(null);

  // State to track if the authentication status is still being loaded.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase authentication state changes.
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Update user state with the authenticated user (or null if not logged in)
      setUser(user);
      // Set loading to false once the authentication state is determined.
      setLoading(false);
    });

    // Cleanup the subscription when the component unmounts.
    return unsubscribe;
  }, []);

  return (
    // Provide the user and loading state to all children components.
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
