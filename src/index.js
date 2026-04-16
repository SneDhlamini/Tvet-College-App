/**
 * src/index.js
 * ------------
 * The entry point of the React application.
 *
 * React DOM mounts the <App /> component tree into the <div id="root">
 * element defined in public/index.html.
 *
 * <AuthProvider> wraps everything so ANY component in the tree can call
 * useAuth() to get the current user, login(), and logout() — without
 * prop-drilling through every layer.
 *
 * In production:
 * - React.StrictMode double-invokes lifecycle methods in dev to catch bugs.
 * - You'd also initialise Sentry, analytics, i18n, and global providers here.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./styles/global.css"; // Global CSS variables + resets, loaded once here

// Find the root DOM node (defined in public/index.html)
const rootElement = document.getElementById("root");

// Create a React 18 concurrent-mode root
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/*
      AuthProvider must be the outermost wrapper so every component
      (including Navbar, ProtectedRoute, and all pages) can read auth state.
    */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

