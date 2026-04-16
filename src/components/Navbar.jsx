/**
 * components/Navbar.jsx
 * ---------------------
 * The top navigation bar, visible on all authenticated pages.
 *
 * Key behaviours:
 * 1. Reads the current user's role from AuthContext
 * 2. Renders ONLY the nav links that role is allowed to see
 * 3. Highlights the currently active page
 * 4. Provides a logout button
 *
 * Role-based nav is a core RBAC (Role-Based Access Control) pattern —
 * in production you'd also enforce this server-side (middleware checks JWT role).
 */

import React from "react";
import { useAuth } from "../hooks/useAuth";
import "../styles/navbar.css";

/**
 * Defines which pages each role can navigate to.
 * Key = role string, Value = array of { label, page } objects.
 *
 * In a real app you'd fetch allowed routes from:
 *   GET /api/auth/me/permissions
 */
const ROLE_NAVIGATION = {
  student: [
    { label: "Dashboard", page: "dashboard" },
    { label: "My Courses", page: "courses" },
    { label: "Intranet",   page: "intranet" },
  ],
  staff: [
    { label: "Dashboard",    page: "dashboard" },
    { label: "Intranet",     page: "intranet" },
    { label: "Staff Portal", page: "staff" },
  ],
  admin: [
    { label: "Dashboard",  page: "dashboard" },
    { label: "Courses",    page: "courses" },
    { label: "Intranet",   page: "intranet" },
    { label: "Staff Portal", page: "staff" },
    { label: "Admin Panel", page: "admin" },
  ],
};

/**
 * @param {string}   activePage  — the currently rendered page key
 * @param {function} onNavigate  — callback to change the active page
 */
export default function Navbar({ activePage, onNavigate }) {
  const { user, logout } = useAuth();

  // Get the nav links allowed for this user's role
  const navLinks = ROLE_NAVIGATION[user.role] || [];

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">

        {/* ── Brand ── */}
        <span className="navbar-brand">Maluti TVET</span>

        {/* ── Navigation Links ── */}
        <ul className="navbar-links">
          {navLinks.map(({ label, page }) => (
            <li key={page}>
              <button
                className={`nav-link ${activePage === page ? "active" : ""}`}
                onClick={() => onNavigate(page)}
                aria-current={activePage === page ? "page" : undefined}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* ── User Info + Logout ── */}
        <div className="navbar-right">
          {/* Role indicator — coloured dot + name */}
          <div className="role-indicator">
            <span
              className={`role-dot role-dot-${user.role}`}
              aria-label={`Role: ${user.role}`}
            />
            <span>{user.name.split(" ")[0]}</span> {/* First name only */}
          </div>

          {/* Logout button — calls AuthContext.logout(), which resets user to null */}
          <button className="logout-btn" onClick={logout} aria-label="Sign out">
            Sign Out
          </button>
        </div>

      </nav>

      {/* Spacer div so page content doesn't hide behind the fixed navbar */}
      <div className="navbar-spacer" aria-hidden="true" />
    </>
  );
}

