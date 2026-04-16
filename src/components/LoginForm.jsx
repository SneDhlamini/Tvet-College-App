/**
 * components/LoginForm.jsx
 * ------------------------
 * The entry-point auth screen — shown whenever no user is logged in.
 *
 * UX flow:
 *   1. User picks a role from the role selector cards (Student / Staff / Admin)
 *   2. The email field auto-fills with the demo email for that role
 *   3. User enters password (demo1234) and submits
 *   4. On success → AuthContext sets the user → App renders the main shell
 *   5. On failure → authError from AuthContext is displayed inline
 *
 * In production, the email/password would be sent to:
 *   POST /api/auth/login  →  { token: "eyJ..." }
 * The JWT would be stored in localStorage (or an httpOnly cookie for security)
 * and decoded to populate AuthContext on app load.
 */

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../styles/login.css";

/**
 * Demo role options — displayed as clickable selector cards.
 * Each maps to a mock user in data/users.js.
 */
const ROLES = [
  {
    role:  "student",
    label: "Student",
    email: "student@maluti.ac.za",
    icon:  "🎓",
    desc:  "View courses, progress & notices",
    color: "var(--color-student)",
  },
  {
    role:  "staff",
    label: "Staff",
    email: "staff@maluti.ac.za",
    icon:  "👩‍🏫",
    desc:  "Upload materials & post notices",
    color: "var(--color-staff)",
  },
  {
    role:  "admin",
    label: "Admin",
    email: "admin@maluti.ac.za",
    icon:  "🛡️",
    desc:  "Full system access & student records",
    color: "var(--color-admin)",
  },
];

export default function LoginForm() {
  const { login, authError } = useAuth();

  // Which role card is selected — determines the pre-filled email
  const [selectedRole, setSelectedRole] = useState("student");

  // Controlled form fields
  const [email,    setEmail]    = useState("student@maluti.ac.za");
  const [password, setPassword] = useState("");

  // Prevent double-submit while simulated async login is running
  const [isLoading, setIsLoading] = useState(false);

  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  /**
   * handleRoleSelect — updates the selected role and auto-fills the email.
   */
  function handleRoleSelect(roleObj) {
    setSelectedRole(roleObj.role);
    setEmail(roleObj.email);
  }

  /**
   * handleSubmit — called on form submission.
   * Simulates a short async delay (as if hitting a real API),
   * then delegates to AuthContext.login().
   */
  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    // Simulate network latency (remove in production — the real fetch handles this)
    await new Promise((r) => setTimeout(r, 600));

    login(email, password);
    setIsLoading(false);
  }

  return (
    <div className="login-bg">
      {/* Decorative background blobs */}
      <div className="login-blob login-blob-1" aria-hidden="true" />
      <div className="login-blob login-blob-2" aria-hidden="true" />

      <div className="login-shell fade-up">

        {/* ── Branding ── */}
        <div className="login-brand">
          <div className="login-logo" aria-hidden="true">MT</div>
          <div>
            <h1 className="login-title">Maluti TVET</h1>
            <p className="login-subtitle">College Management Portal</p>
          </div>
        </div>

        {/* ── Role Selector ── */}
        <div className="role-selector" role="group" aria-label="Select your role">
          {ROLES.map((r) => (
            <button
              key={r.role}
              type="button"
              className={`role-card ${selectedRole === r.role ? "role-card-active" : ""}`}
              style={selectedRole === r.role ? { borderColor: r.color, boxShadow: `0 0 16px ${r.color}33` } : {}}
              onClick={() => handleRoleSelect(r)}
              aria-pressed={selectedRole === r.role}
            >
              <span className="role-card-icon" aria-hidden="true">{r.icon}</span>
              <span className="role-card-label">{r.label}</span>
              <span className="role-card-desc">{r.desc}</span>
            </button>
          ))}
        </div>

        {/* ── Login Form ── */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>

          {/* Email field — auto-filled by role selection, still editable */}
          <div className="field-group">
            <label className="field-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@maluti.ac.za"
              required
              autoComplete="email"
              aria-describedby={authError ? "auth-error" : undefined}
            />
          </div>

          {/* Password field with show/hide toggle */}
          <div className="field-group">
            <label className="field-label" htmlFor="password">Password</label>
            <div className="password-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="field-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Error message from AuthContext */}
          {authError && (
            <div id="auth-error" className="login-error" role="alert">
              {authError}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className={`btn-primary login-btn ${isLoading ? "login-btn-loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              "Sign In →"
            )}
          </button>

        </form>

        {/* Demo hint — remove in production */}
        <p className="login-hint">
          Demo password: <code>demo1234</code> for all roles
        </p>

      </div>
    </div>
  );
}

