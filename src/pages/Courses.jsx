/**
 * pages/Courses.jsx
 * -----------------
 * Shows the logged-in student's enrolled modules with completion progress.
 *
 * Key concepts demonstrated:
 * - Mapping over an array to render a list of cards (React's core pattern)
 * - Progress bars using inline styles (dynamic CSS widths)
 * - Colour-coding by status
 *
 * In production, course data would come from:
 *   GET /api/student/courses  (JWT identifies which student to query)
 *   → PostgreSQL join: students ↔ enrolments ↔ modules ↔ assessments
 */

import React from "react";
import "../styles/courses.css";

// Mock course data — in production: fetched from the API on mount (useEffect + fetch)
const COURSES = [
  {
    id: 1,
    code: "ITS401",
    title: "Systems Analysis & Design",
    lecturer: "Mr. K. Molefe",
    credits: 16,
    progress: 75,
    grade: "B+",
    status: "on-track",
    nextAssessment: "Task 3 — Due 28 Apr",
  },
  {
    id: 2,
    code: "ITS402",
    title: "Database Management",
    lecturer: "Ms. T. Sithole",
    credits: 16,
    progress: 82,
    grade: "A",
    status: "on-track",
    nextAssessment: "Practical Exam — 5 May",
  },
  {
    id: 3,
    code: "ITS403",
    title: "Web Development (HTML/CSS/JS)",
    lecturer: "Mr. B. Shabalala",
    credits: 12,
    progress: 60,
    grade: "C+",
    status: "at-risk",
    nextAssessment: "Portfolio — Due 30 Apr",
  },
  {
    id: 4,
    code: "ITS404",
    title: "Networking Fundamentals",
    lecturer: "Ms. P. Dlamini",
    credits: 12,
    progress: 90,
    grade: "A+",
    status: "excellent",
    nextAssessment: "Final Exam — 20 May",
  },
  {
    id: 5,
    code: "ITS405",
    title: "Programming in Python",
    lecturer: "Mr. D. Mokoena",
    credits: 16,
    progress: 45,
    grade: "D",
    status: "at-risk",
    nextAssessment: "Assignment 2 — Due 22 Apr",
  },
  {
    id: 6,
    code: "COM401",
    title: "Business Communication",
    lecturer: "Ms. A. Khumalo",
    credits: 8,
    progress: 100,
    grade: "A",
    status: "complete",
    nextAssessment: "Module complete ✓",
  },
];

/** Maps status string → CSS class for colour-coding */
function statusClass(status) {
  return {
    "excellent": "badge-success",
    "on-track":  "badge-info",
    "at-risk":   "badge-danger",
    "complete":  "badge-success",
  }[status] || "badge-info";
}

/** Maps progress % → progress bar colour */
function progressColor(pct) {
  if (pct >= 80) return "var(--color-success)";
  if (pct >= 60) return "var(--color-accent)";
  return "var(--color-danger)";
}

export default function Courses() {
  return (
    <div className="page-wrapper fade-up">

      {/* ── Page Header ── */}
      <div className="courses-header">
        <div>
          <h1>My Courses</h1>
          <p>2024 Academic Year · Semester 1</p>
        </div>
        <div className="courses-summary">
          <span>{COURSES.length} modules enrolled</span>
          <span>·</span>
          <span>
            {Math.round(COURSES.reduce((s, c) => s + c.progress, 0) / COURSES.length)}% avg. progress
          </span>
        </div>
      </div>

      {/* ── Course Cards ── */}
      <div className="courses-list">
        {COURSES.map((course) => (
          <div key={course.id} className="course-card card">

            {/* Top row: code + status badge */}
            <div className="course-top">
              <span className="course-code">{course.code}</span>
              <span className={`badge ${statusClass(course.status)}`}>
                {course.status.replace("-", " ")}
              </span>
            </div>

            {/* Module title + lecturer */}
            <h3 className="course-title">{course.title}</h3>
            <p className="course-lecturer">{course.lecturer} · {course.credits} credits</p>

            {/* Progress bar */}
            <div className="progress-section">
              <div className="progress-label">
                <span>Progress</span>
                <span style={{ color: progressColor(course.progress), fontWeight: 600 }}>
                  {course.progress}%
                </span>
              </div>
              {/*
                The progress bar width is set dynamically via inline style.
                The colour transitions from red → amber → green based on percentage.
              */}
              <div className="progress-track" aria-label={`${course.progress}% complete`}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${course.progress}%`,
                    background: progressColor(course.progress),
                  }}
                />
              </div>
            </div>

            {/* Bottom row: grade + next assessment */}
            <div className="course-footer">
              <div className="course-grade">
                <span className="grade-label">Current Grade</span>
                <span className="grade-value">{course.grade}</span>
              </div>
              <div className="course-next">
                <span className="next-label">Next</span>
                <span className="next-value">{course.nextAssessment}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}


