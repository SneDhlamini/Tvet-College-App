/**
 * context/AuthContext.jsx
 * -----------------------
 * Provides global authentication state to the entire app using React's
 * Context API — the React equivalent of a Redux auth slice or Zustand store.
 *
 * Why Context?
 * Without context, you'd need to "prop-drill" the user object through
 * every component: App → Navbar → NavLink → Avatar. That's messy.
 * Context lets any component call useAuth() and get the user directly.
 *
 * In production, this would be replaced by:
 * - Reading a JWT from localStorage / httpOnly cookie
 * - Calling GET /api/auth/me to validate the token on mount
 * - Storing the decoded user object in context
 */

import React, { createContext, useState, useCallback } from "react";
import { authenticateUser } from "../data/users";

// 1. Create the context object — this is what consumers will import
export const AuthContext = createContext(null);

/**
 * AuthProvider wraps the entire app (in index.js) so all components
 * can access auth state without prop drilling.
 *
 * @param {React.ReactNode} children — the component tree inside this provider
 */
export function AuthProvider({ children }) {
  // The currently logged-in user object, or null if logged out
  const [user, setUser] = useState(null);

  // Error message to display when login fails
  const [authError, setAuthError] = useState("");

  /**
   * login()
   * Simulates POST /api/auth/login
   * In production: fetch('/api/auth/login', { method:'POST', body: JSON.stringify({email, password}) })
   * then store the returned JWT in localStorage.
   *
   * @param {string} email
   * @param {string} password
   * @returns {boolean} true if login succeeded
   */
  const login = useCallback((email, password) => {
    setAuthError(""); // Clear any previous error

    const foundUser = authenticateUser(email, password);

    if (foundUser) {
      setUser(foundUser);
      return true;
    } else {
      setAuthError("Invalid email or password. Try demo1234.");
      return false;
    }
  }, []);

  /**
   * logout()
   * Simulates POST /api/auth/logout or just clearing the JWT.
   * Resets user to null, which triggers the app to show the login screen.
   */
  const logout = useCallback(() => {
    setUser(null);
    setAuthError("");
  }, []);

  // The value exposed to all consumers of this context
  const contextValue = {
    user,        // Current user object (or null)
    authError,   // Login error string (or "")
    login,       // login(email, password) function
    logout,      // logout() function
    isLoggedIn: !!user, // Convenience boolean
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}


