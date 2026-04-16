/**
 * hooks/useAuth.js
 * ----------------
 * Custom hook that wraps useContext(AuthContext).
 *
 * Why a custom hook?
 * - Cleaner imports: `useAuth()` vs `useContext(AuthContext)` everywhere
 * - Single place to add error handling (throws if used outside AuthProvider)
 * - Standard pattern in production codebases (e.g. react-query, next-auth all do this)
 *
 * Usage in any component:
 *   import { useAuth } from '../hooks/useAuth';
 *   const { user, logout } = useAuth();
 */

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  // Guard: if this hook is called outside <AuthProvider>, fail loudly
  if (!context) {
    throw new Error("useAuth() must be used inside an <AuthProvider>.");
  }

  return context;
}

