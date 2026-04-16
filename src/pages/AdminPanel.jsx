
/**
 * pages/AdminPanel.jsx
 * ---------------------
 * Admin-only page that shows a searchable, filterable student records table.
 *
 * Features:
 * - Live search by name, student ID, or programme
 * - Filter by enrolment status (All / Active / At-Risk / Inactive)
 * - Sort by any column (click header to toggle asc/desc)
 * - Status badges (colour-coded)
 * - GPA display with colour coding (red/amber/green)
 * - "Export CSV" button (simulated download)
 * - Summary statistics row at the top
 *
 * In production, data would come from:
 *   GET /api/admin/students?search=&status=&page=1&limit=20
 *   (paginated, server-filtered — not in-memory as done here)
 *
 * Wrapped in <ProtectedRoute allowedRoles={['admin']}> in App.jsx
 * so non-admins can never reach this component.
 */

import React, { useState, useMemo } from "react";
import { MOCK_STUDENTS } from "../data/students";
import "../styles/admin.css";

// ── Status filter options ────────────────────────────────────────────────────
const STATUS_FILTERS = ["All", "active", "at-risk", "inactive"];

/** Maps status → badge CSS class */
const STATUS_BADGE = {
  "active":   "badge-success",
  "at-risk":  "badge-danger",
  "inactive": "badge-warning",
};

/** Maps status → display label */
const STATUS_LABEL = {
  "active":   "Active",
  "at-risk":  "At Risk",
  "inactive": "Inactive",
};

/** Colour-codes the GPA value */
function gpaColor(gpa) {
  if (gpa === 0)    return "var(--color-text-muted)";
  if (gpa >= 3.5)   return "var(--color-success)";
  if (gpa >= 2.5)   return "var(--color-accent)";
  return "var(--color-danger)";
}

/**
 * generateCSV — converts the student array to a CSV string and triggers a download.
 * In production: the server would generate the CSV to handle large datasets.
 */
function downloadCSV(students) {
  const header = ["ID", "Name", "Programme", "Year", "Status", "GPA"];
  const rows = students.map((s) => [
    s.id, s.name, `"${s.programme}"`, s.year, s.status, s.gpa,
  ]);
  const csv = [header, ...rows].map((r) => r.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `maluti-students-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminPanel() {
  // ── Filter & Search State ─────────────────────────────────────────────────
  const [search,         setSearch]         = useState("");
  const [statusFilter,   setStatusFilter]   = useState("All");
  const [sortKey,        setSortKey]        = useState("name");
  const [sortDir,        setSortDir]        = useState("asc"); // "asc" | "desc"

  /**
   * handleSort — toggles direction if the same column is clicked again,
   * otherwise switches to the new column (ascending).
   */
  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  /**
   * filteredStudents — derived state via useMemo.
   * Recalculates only when search, statusFilter, sortKey, or sortDir changes.
   * Avoids re-sorting on every render.
   */
  const filteredStudents = useMemo(() => {
    let result = [...MOCK_STUDENTS];

    // 1. Filter by status
    if (statusFilter !== "All") {
      result = result.filter((s) => s.status === statusFilter);
    }

    // 2. Full-text search across name, id, and programme (case-insensitive)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.programme.toLowerCase().includes(q)
      );
    }

    // 3. Sort
    result.sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      // String comparison
      if (typeof av === "string") {
        av = av.toLowerCase();
        bv = bv.toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ?  1 : -1;
      return 0;
    });

    return result;
  }, [search, statusFilter, sortKey, sortDir]);

  // ── Summary Stats ─────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:    MOCK_STUDENTS.length,
    active:   MOCK_STUDENTS.filter((s) => s.status === "active").length,
    atRisk:   MOCK_STUDENTS.filter((s) => s.status === "at-risk").length,
    inactive: MOCK_STUDENTS.filter((s) => s.status === "inactive").length,
    avgGpa:   (
      MOCK_STUDENTS.filter((s) => s.gpa > 0).reduce((s, c) => s + c.gpa, 0) /
      MOCK_STUDENTS.filter((s) => s.gpa > 0).length
    ).toFixed(2),
  }), []);

  /** Sort indicator arrow */
  function sortArrow(key) {
    if (key !== sortKey) return <span className="sort-arrow sort-arrow-inactive">↕</span>;
    return <span className="sort-arrow">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  return (
    <div className="page-wrapper fade-up">

      {/* ── Page Header ── */}
      <div className="admin-header">
        <div>
          <h1>Admin Panel</h1>
          <p>Student records — {MOCK_STUDENTS.length} enrolled</p>
        </div>
        {/* Export button — downloads filtered results as CSV */}
        <button
          className="btn-primary"
          onClick={() => downloadCSV(filteredStudents)}
          title="Export current view as CSV"
        >
          ↓ Export CSV
        </button>
      </div>

      {/* ── Summary Stats Strip ── */}
      <div className="admin-stats">
        <div className="stat-chip">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-chip stat-chip-active">
          <span className="stat-value">{stats.active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-chip stat-chip-risk">
          <span className="stat-value">{stats.atRisk}</span>
          <span className="stat-label">At Risk</span>
        </div>
        <div className="stat-chip stat-chip-inactive">
          <span className="stat-value">{stats.inactive}</span>
          <span className="stat-label">Inactive</span>
        </div>
        <div className="stat-chip stat-chip-gpa">
          <span className="stat-value">{stats.avgGpa}</span>
          <span className="stat-label">Avg GPA</span>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="admin-filters">
        {/* Search input */}
        <div className="search-wrap">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="admin-search"
            placeholder="Search by name, student ID, or programme…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search students"
          />
          {/* Clear button — visible only when there's a query */}
          {search && (
            <button
              className="search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status filter buttons */}
        <div className="status-filters" role="group" aria-label="Filter by status">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              className={`filter-chip ${statusFilter === s ? "filter-chip-active" : ""}`}
              onClick={() => setStatusFilter(s)}
              aria-pressed={statusFilter === s}
            >
              {s === "All" ? "All" : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results count ── */}
      <p className="admin-results-count">
        Showing <strong>{filteredStudents.length}</strong> of {MOCK_STUDENTS.length} students
      </p>

      {/* ── Student Table ── */}
      {filteredStudents.length === 0 ? (
        <div className="admin-empty card">
          <p>No students match your search or filter.</p>
          <button
            className="btn-ghost"
            style={{ marginTop: "12px" }}
            onClick={() => { setSearch(""); setStatusFilter("All"); }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="table-wrap card">
          <table className="student-table" aria-label="Student records">
            <thead>
              <tr>
                {/* Sortable column headers */}
                {[
                  { key: "id",          label: "Student ID"  },
                  { key: "name",        label: "Name"        },
                  { key: "programme",   label: "Programme"   },
                  { key: "year",        label: "Year"        },
                  { key: "status",      label: "Status"      },
                  { key: "gpa",         label: "GPA"         },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="table-th"
                    onClick={() => handleSort(key)}
                    aria-sort={
                      sortKey === key
                        ? (sortDir === "asc" ? "ascending" : "descending")
                        : "none"
                    }
                    role="columnheader"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleSort(key)}
                  >
                    {label} {sortArrow(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="table-row">
                  {/* Student ID */}
                  <td className="table-td td-id">
                    <code className="student-id">{student.id}</code>
                  </td>

                  {/* Name */}
                  <td className="table-td td-name">
                    <div className="student-avatar" aria-hidden="true">
                      {student.name.charAt(0)}
                    </div>
                    <span>{student.name}</span>
                  </td>

                  {/* Programme */}
                  <td className="table-td td-programme">{student.programme}</td>

                  {/* Year */}
                  <td className="table-td td-year">
                    <span className="year-badge">Y{student.year}</span>
                  </td>

                  {/* Status badge */}
                  <td className="table-td td-status">
                    <span className={`badge ${STATUS_BADGE[student.status]}`}>
                      {STATUS_LABEL[student.status]}
                    </span>
                  </td>

                  {/* GPA — colour coded */}
                  <td className="table-td td-gpa">
                    <span
                      className="gpa-value"
                      style={{ color: gpaColor(student.gpa) }}
                    >
                      {student.gpa === 0 ? "—" : student.gpa.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
