/**
 * src/App.jsx
 * -----------
 * Root component — controls which "page" is rendered based on:
 *   1. Whether the user is logged in (auth gate)
 *   2. Which page the user has navigated to (activePage state)
 *
 * We use a simple string-based "router" (activePage state) instead of
 * react-router-dom to keep the project dependency-free and focussed on
 * demonstrating core React patterns.
 *
 * In production you'd use react-router-dom v6:
 *   <Routes>
 *     <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 *     <Route path="/admin"     element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />
 *   </Routes>
 */

import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";

// Layout components
import Navbar         from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm      from "./components/LoginForm";

// Pages
import Dashboard  from "./pages/Dashboard";
import Courses    from "./pages/Courses";
import Intranet   from "./pages/Intranet";
import StaffPortal from "./pages/StaffPortal";
import AdminPanel from "./pages/AdminPanel";

/**
 * Maps a page key → the component to render.
 * Keeping this outside the component avoids re-creating the object on every render.
 */
const PAGES = {
  dashboard: <Dashboard />,
  courses:   <Courses />,
  intranet:  <Intranet />,
  staff:     <StaffPortal />,
  admin:     (
    // AdminPanel is protected — only 'admin' role may access it
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminPanel />
    </ProtectedRoute>
  ),
};

export default function App() {
  const { isLoggedIn, user } = useAuth();

  /**
   * activePage — string key of the currently displayed page.
   * Default to "dashboard" on login.
   */
  const [activePage, setActivePage] = useState("dashboard");

  /**
   * When the user logs in, reset to the dashboard so they don't land
   * on a stale page from a previous session.
   */
  const handleNavigate = (page) => {
    setActivePage(page);
    // Scroll to the top of the page on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Not logged in → show the login screen ──────────────────────────────
  if (!isLoggedIn) {
    return <LoginForm />;
  }

  // ── Logged in → show the main app shell ───────────────────────────────
  return (
    <>
      {/*
        Navbar is always visible when logged in.
        It receives activePage and onNavigate so it can highlight
        the current link and trigger page changes.
      */}
      <Navbar activePage={activePage} onNavigate={handleNavigate} />

      {/*
        Render the active page.
        If the page key is somehow unknown, fall back to Dashboard.
      */}
      <main role="main">
        {PAGES[activePage] ?? <Dashboard />}
      </main>
    </>
  );
}