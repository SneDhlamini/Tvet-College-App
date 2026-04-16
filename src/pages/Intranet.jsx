
/**
 * pages/Intranet.jsx
 * ------------------
 * A shared notice board visible to all roles (student, staff, admin).
 *
 * Features:
 * - Filterable list of notices by category
 * - Priority badges (urgent / important / info)
 * - Staff and Admin see an additional "Post Notice" panel (RBAC)
 * - Notices are sorted by date (newest first)
 *
 * In production, notices would come from:
 *   GET /api/intranet/notices?category=all&limit=20
 *   → PostgreSQL table: notices (id, title, body, category, priority, author_id, created_at)
 *
 * Posting a notice:
 *   POST /api/intranet/notices  { title, body, category, priority }
 *   → Returns the newly created notice record
 */

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../styles/intranet.css";

// ── Mock Notice Data ─────────────────────────────────────────────────────────
// In production: fetched from the API via useEffect on mount.
const INITIAL_NOTICES = [
  {
    id: 1,
    title: "2024 Semester 1 Examination Timetable Released",
    body: "The final examination timetable for Semester 1 has been published on the academic calendar. Students are advised to check their individual schedules and report any clashes to the Registry office by 26 April.",
    category: "Exams",
    priority: "urgent",
    author: "Academic Registry",
    date: new Date("2024-04-15T08:00:00"),
    pinned: true,
  },
  {
    id: 2,
    title: "Library Extended Hours — Exam Period",
    body: "The campus library will extend its operating hours from 07:00 to 22:00 during the examination period (2 May – 31 May). Group study rooms must be booked in advance via the library portal.",
    category: "Facilities",
    priority: "important",
    author: "Library Services",
    date: new Date("2024-04-14T10:30:00"),
    pinned: false,
  },
  {
    id: 3,
    title: "Student Support Workshop: Exam Stress Management",
    body: "The counselling office invites all students to a free workshop on managing exam stress. Sessions run every Tuesday at 13:00 in Room A204. No registration required.",
    category: "Student Support",
    priority: "info",
    author: "Student Services",
    date: new Date("2024-04-13T09:00:00"),
    pinned: false,
  },
  {
    id: 4,
    title: "ICT System Maintenance — Saturday 20 April",
    body: "The student portal, email, and Wi-Fi will be unavailable from 02:00 to 06:00 on Saturday 20 April for scheduled maintenance. Please save all work before this window.",
    category: "IT",
    priority: "urgent",
    author: "ICT Department",
    date: new Date("2024-04-12T15:00:00"),
    pinned: false,
  },
  {
    id: 5,
    title: "Bursary Applications: NSFAS Appeal Window Open",
    body: "Students who were provisionally declined for NSFAS funding may submit appeal documentation to the Financial Aid office (Room Admin-12) before 30 April. Required documents: certified ID, proof of income, academic record.",
    category: "Finance",
    priority: "important",
    author: "Financial Aid",
    date: new Date("2024-04-10T11:00:00"),
    pinned: false,
  },
  {
    id: 6,
    title: "Staff Meeting: Curriculum Review — 24 April",
    body: "All academic staff are required to attend the annual curriculum review meeting on 24 April at 09:00 in the Main Boardroom. Please bring printed copies of your module outlines.",
    category: "Staff",
    priority: "important",
    author: "Academic Management",
    date: new Date("2024-04-09T08:30:00"),
    pinned: false,
  },
];

// Available filter categories — "All" + the unique categories in the data
const CATEGORIES = ["All", "Exams", "Facilities", "Student Support", "IT", "Finance", "Staff"];

/** Maps priority → badge CSS class */
const PRIORITY_BADGE = {
  urgent:    "badge-danger",
  important: "badge-warning",
  info:      "badge-info",
};

/** Maps priority → emoji icon */
const PRIORITY_ICON = {
  urgent:    "🔴",
  important: "🟡",
  info:      "🔵",
};

export default function Intranet() {
  const { user } = useAuth();

  // Active category filter — "All" shows everything
  const [activeCategory, setActiveCategory] = useState("All");

  // Notices list — starts with mock data, can be extended by staff/admin
  const [notices, setNotices] = useState(INITIAL_NOTICES);

  // ── Post Notice Form State (staff / admin only) ──
  const [showPostForm, setShowPostForm] = useState(false);
  const [newTitle,     setNewTitle]     = useState("");
  const [newBody,      setNewBody]      = useState("");
  const [newCategory,  setNewCategory]  = useState("Exams");
  const [newPriority,  setNewPriority]  = useState("info");
  const [postSuccess,  setPostSuccess]  = useState(false);

  // Whether this user can post notices (staff and admin only)
  const canPost = user.role === "staff" || user.role === "admin";

  // ── Filter notices by selected category ─────────────────────────────────
  const filteredNotices = notices.filter(
    (n) => activeCategory === "All" || n.category === activeCategory
  );

  // Pinned notices always appear first
  const sortedNotices = [
    ...filteredNotices.filter((n) => n.pinned),
    ...filteredNotices.filter((n) => !n.pinned),
  ];

  /**
   * handlePostNotice — adds a new notice to the top of the list.
   * In production: POST /api/intranet/notices → server saves to DB → returns record
   */
  function handlePostNotice(e) {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const newNotice = {
      id: Date.now(),
      title:    newTitle.trim(),
      body:     newBody.trim(),
      category: newCategory,
      priority: newPriority,
      author:   user.name,
      date:     new Date(),
      pinned:   false,
    };

    // Prepend to list (newest first)
    setNotices((prev) => [newNotice, ...prev]);

    // Reset form
    setNewTitle("");
    setNewBody("");
    setNewCategory("Exams");
    setNewPriority("info");
    setShowPostForm(false);
    setPostSuccess(true);

    // Auto-hide success message
    setTimeout(() => setPostSuccess(false), 4000);
  }

  return (
    <div className="page-wrapper fade-up">

      {/* ── Page Header ── */}
      <div className="intranet-header">
        <div>
          <h1>College Intranet</h1>
          <p>Official notices, announcements & updates</p>
        </div>
        {/* Only staff/admin see the "Post Notice" button */}
        {canPost && (
          <button
            className="btn-primary"
            onClick={() => setShowPostForm((v) => !v)}
            aria-expanded={showPostForm}
          >
            {showPostForm ? "✕ Cancel" : "+ Post Notice"}
          </button>
        )}
      </div>

      {/* ── Post Success Banner ── */}
      {postSuccess && (
        <div className="intranet-success" role="status">
          ✓ Notice posted successfully and visible to all users.
        </div>
      )}

      {/* ── Post Notice Form (staff/admin only, toggleable) ── */}
      {canPost && showPostForm && (
        <div className="intranet-post-form card">
          <h3>Post a New Notice</h3>
          <form onSubmit={handlePostNotice} className="post-form-fields">

            <div className="post-form-row">
              {/* Category selector */}
              <div className="field-group-inline">
                <label className="field-label-sm" htmlFor="notice-category">Category</label>
                <select
                  id="notice-category"
                  className="intranet-select"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Priority selector */}
              <div className="field-group-inline">
                <label className="field-label-sm" htmlFor="notice-priority">Priority</label>
                <select
                  id="notice-priority"
                  className="intranet-select"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                >
                  <option value="info">Info</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div className="field-group-full">
              <label className="field-label-sm" htmlFor="notice-title">Notice Title</label>
              <input
                id="notice-title"
                type="text"
                className="intranet-input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter a clear, descriptive title"
                required
                maxLength={120}
              />
            </div>

            {/* Body */}
            <div className="field-group-full">
              <label className="field-label-sm" htmlFor="notice-body">Message</label>
              <textarea
                id="notice-body"
                className="intranet-textarea"
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Write the full notice content here…"
                rows={4}
                required
                maxLength={800}
              />
              <span className="char-count">{newBody.length} / 800</span>
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
              Publish Notice
            </button>
          </form>
        </div>
      )}

      {/* ── Category Filters ── */}
      <div className="intranet-filters" role="tablist" aria-label="Filter notices by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            className={`filter-chip ${activeCategory === cat ? "filter-chip-active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
            {/* Show count for "All" */}
            {cat === "All" && (
              <span className="filter-count">{notices.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Notice List ── */}
      {sortedNotices.length === 0 ? (
        <div className="intranet-empty card">
          <p>No notices in this category yet.</p>
        </div>
      ) : (
        <div className="notice-list">
          {sortedNotices.map((notice) => (
            <article
              key={notice.id}
              className={`notice-card card ${notice.pinned ? "notice-pinned" : ""}`}
              aria-label={notice.title}
            >
              {/* Pinned indicator */}
              {notice.pinned && (
                <div className="notice-pin-label" aria-label="Pinned notice">
                  📌 Pinned
                </div>
              )}

              {/* Notice header */}
              <div className="notice-header">
                <div className="notice-badges">
                  <span className={`badge ${PRIORITY_BADGE[notice.priority]}`}>
                    {PRIORITY_ICON[notice.priority]} {notice.priority}
                  </span>
                  <span className="badge badge-info">{notice.category}</span>
                </div>

                {/* Date */}
                <time
                  className="notice-date"
                  dateTime={notice.date.toISOString()}
                >
                  {notice.date.toLocaleDateString("en-ZA", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </time>
              </div>

              {/* Title + body */}
              <h3 className="notice-title">{notice.title}</h3>
              <p  className="notice-body">{notice.body}</p>

              {/* Footer: author */}
              <div className="notice-footer">
                <span className="notice-author">— {notice.author}</span>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
}





