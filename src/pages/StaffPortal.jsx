/**
 * pages/StaffPortal.jsx
 * ----------------------
 * Staff-only page: the entry point for document management.
 *
 * This page:
 * 1. Welcomes the logged-in staff member by name
 * 2. Shows a quick-stat row (modules taught, documents uploaded, notices posted)
 * 3. Renders the <PDFUploader /> component for document uploads
 *
 * Accessible to both "staff" AND "admin" roles (admin sees everything).
 * Protected by the ROLE_NAVIGATION map in Navbar.jsx — only those roles
 * get the "Staff Portal" link. For belt-and-suspenders protection in production,
 * the API endpoints behind this page would also verify the JWT role server-side.
 *
 * In production:
 *   GET /api/staff/portal/summary → { modulesCount, documentsCount, noticesCount }
 */

import React from "react";
import { useAuth } from "../hooks/useAuth";
import PDFUploader from "../components/PDFUploader";
import "../styles/staff.css";

export default function StaffPortal() {
  const { user } = useAuth();

  return (
    <div className="page-wrapper fade-up">

      {/* ── Page Header ── */}
      <div className="staff-header">
        <div>
          <h1>Staff Portal</h1>
          <p>
            {user.department || "Academic Staff"} ·{" "}
            <span className="staff-id">{user.employeeId}</span>
          </p>
        </div>
        {/* Role indicator badge */}
        <div className="staff-role-badge">
          {user.role === "admin" ? "🛡️ Administrator" : "👩‍🏫 Lecturer"}
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="staff-stats">
        {[
          { icon: "📚", label: "Modules Taught",      value: "4",  color: "var(--color-staff)" },
          { icon: "📄", label: "Documents Uploaded",  value: "7",  color: "var(--color-accent)" },
          { icon: "📢", label: "Notices Posted",       value: "2",  color: "var(--color-info)" },
        ].map((stat) => (
          <div key={stat.label} className="staff-stat card">
            <span className="staff-stat-icon" aria-hidden="true">{stat.icon}</span>
            <div>
              <div className="staff-stat-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="staff-stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section: Document Manager ── */}
      <section aria-labelledby="doc-section-title">
        <div className="staff-section-header">
          <h2 id="doc-section-title">Document Manager</h2>
          <p>
            Upload PDF documents for students and staff. Supported formats: PDF only.
            Maximum file size: 10 MB.
          </p>
        </div>

        {/*
          PDFUploader is a self-contained component (in components/PDFUploader.jsx).
          It handles drag-and-drop, validation, simulated progress, and the document list.
        */}
        <div className="card">
          <PDFUploader />
        </div>
      </section>

    </div>
  );
}

