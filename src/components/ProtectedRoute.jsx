/**
 * components/ProtectedRoute.jsx
 * ------------------------------
 * A wrapper component that checks whether the current user's role
 * is allowed to view a given page, and redirects (or shows a
 * denial message) if not.
 *
 * This simulates what express-jwt + role middleware does on the backend:
 *
 *   // Express example:
 *   router.get('/admin/students',
 *     verifyJWT,                       // ← checks token is valid
 *     requireRole(['admin']),          // ← checks role
 *     adminController.getStudents      // ← actual handler
 *   );
 *
 * Here we do the same check client-side for UX purposes.
 * NOTE: Client-side guards are UX only — real security lives on the server.
 *
 * Usage:
 *   <ProtectedRoute allowedRoles={['admin']}>
 *     <AdminPanel />
 *   </ProtectedRoute>
 */

import React from "react";
import { useAuth } from "../hooks/useAuth";

/**
 * @param {string[]} allowedRoles — list of roles that may see the children
 * @param {React.ReactNode} children — the page to render if access is granted
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  // Check if the current user's role is in the allowed list
  const hasAccess = user && allowedRoles.includes(user.role);

  if (!hasAccess) {
    // Render an access denied panel instead of crashing or silently failing
    return (
      <div className="page-wrapper fade-up">
        <div className="card" style={{ textAlign: "center", padding: "64px 32px" }}>
          {/* Lock emoji — quick visual cue */}
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔒</div>
          <h2>Access Denied</h2>
          <p style={{ marginTop: "8px" }}>
            Your role (<strong>{user?.role}</strong>) does not have permission
            to view this page.
          </p>
        </div>
      </div>
    );
  }

  // Access granted — render the actual page
  return children;
}




