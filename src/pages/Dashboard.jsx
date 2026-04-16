/**
 * pages/Dashboard.jsx
 * --------------------
 * The landing page after login.
 * Shows a personalised welcome and role-specific summary cards.
 *
 * Demonstrates:
 * - Conditional rendering based on user.role
 * - Reading user data from AuthContext via useAuth()
 * - CSS Grid for responsive card layout
 *
 * In a real app each card's data would come from:
 *   GET /api/dashboard/summary  → returns counts, alerts, notifications
 */

import React from "react";
import { useAuth } from "../hooks/useAuth";
import "../styles/dashboard.css";

// ── Card Data ────────────────────────────────────────────────────────────────
// Defined outside the component so they don't get re-created on every render.
// In production: fetched from the API and stored in useState.

const STUDENT_CARDS = [
  { icon: "📚", label: "Enrolled Modules", value: "6",   color: "var(--color-student)" },
  { icon: "✅", label: "Completed Tasks",  value: "14",  color: "var(--color-success)" },
  { icon: "⚠️", label: "Pending Tasks",    value: "3",   color: "var(--color-warning)" },
  { icon: "🎯", label: "Overall Progress", value: "68%", color: "var(--color-accent)" },
];

const STAFF_CARDS = [
  { icon: "👨‍🏫", label: "Classes Today",     value: "3",  color: "var(--color-staff)" },
  { icon: "📝", label: "Assignments Due",    value: "12", color: "var(--color-warning)" },
  { icon: "📄", label: "Documents Uploaded", value: "7",  color: "var(--color-info)" },
  { icon: "📢", label: "Notices Posted",     value: "2",  color: "var(--color-accent)" },
];

const ADMIN_CARDS = [
  { icon: "🎓", label: "Total Students",  value: "1,204", color: "var(--color-admin)" },
  { icon: "👩‍🏫", label: "Staff Members",   value: "48",   color: "var(--color-staff)" },
  { icon: "⚠️", label: "At-Risk Students", value: "23",   color: "var(--color-danger)" },
  { icon: "📊", label: "Avg. Pass Rate",   value: "74%",  color: "var(--color-success)" },
];

/**
 * Maps role → card dataset
 * Centralised here so adding a new role only requires one object update.
 */
const ROLE_CARDS = {
  student: STUDENT_CARDS,
  staff:   STAFF_CARDS,
  admin:   ADMIN_CARDS,
};

export default function Dashboard() {
  const { user } = useAuth();

  const cards = ROLE_CARDS[user.role] || [];

  // Greeting varies by time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" :
    hour < 17 ? "Good afternoon" :
    "Good evening";

  return (
    <div className="page-wrapper fade-up">

      {/* ── Welcome Header ── */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-greeting">{greeting},</p>
          <h1 className="dashboard-name">{user.name}</h1>
          <p className="dashboard-role-line">
            {/* Show role-specific subtitle */}
            {user.role === "student" && `Student · ${user.programme} · Year ${user.year}`}
            {user.role === "staff"   && `Staff · ${user.department}`}
            {user.role === "admin"   && `Administrator · ${user.department}`}
          </p>
        </div>

        {/* Decorative role badge */}
        <div className={`dashboard-role-badge dashboard-role-badge-${user.role}`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="dashboard-grid">
        {cards.map((card) => (
          <div key={card.label} className="dash-card card">
            {/* Coloured top accent bar */}
            <div
              className="dash-card-accent"
              style={{ background: card.color }}
              aria-hidden="true"
            />

            <div className="dash-card-body">
              <span className="dash-card-icon" aria-hidden="true">
                {card.icon}
              </span>
              <div>
                <div className="dash-card-value" style={{ color: card.color }}>
                  {card.value}
                </div>
                <div className="dash-card-label">{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Info ── */}
      <div className="dashboard-info card">
        <h3>📅 Today's Date</h3>
        <p style={{ marginTop: "6px" }}>
          {new Date().toLocaleDateString("en-ZA", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
        <p style={{ marginTop: "12px", fontSize: "0.85rem" }}>
          {user.role === "admin"   && "You have full system access. Use the Admin Panel to manage student records."}
          {user.role === "staff"   && "Upload course materials and notices in the Staff Portal."}
          {user.role === "student" && `Student number: ${user.studentNumber}`}
        </p>
      </div>

    </div>
  );
}



