import React, { useState } from "react";
import { loginUser } from "../api.js";

// Sun icon SVG
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

// Moon icon SVG
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

// Chart icon for brand mark
const ChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

export default function Login({ onLogin, addToast, theme, onToggleTheme }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (val) => {
    if (!val.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()))
      return "Please enter a valid email address.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(email);
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      const user = await loginUser(email.trim().toLowerCase());
      onLogin(user);
    } catch (err) {
      const msg = err.message || "Cannot connect to server. Is the backend running?";
      setError(msg);
      addToast("error", "Sign in failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Theme toggle in top-right */}
      <button
        className="theme-toggle"
        onClick={onToggleTheme}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        style={{ position: "fixed", top: 16, right: 16 }}
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand-mark"><ChartIcon /></div>
          <div>
            <div className="login-brand-name">PulseTrade</div>
            <div className="login-brand-tag">Real-Time Stock Dashboard</div>
          </div>
        </div>

        <div className="divider login-divider" />

        <p className="login-title">Sign in</p>
        <p className="login-subtitle">Enter your email to access your dashboard.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              className={`input${error ? " error" : ""}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
              autoComplete="email"
              autoFocus
              disabled={loading}
            />
            {error && <div className="error-text">{error}</div>}
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading ? <><span className="spinner" /> Signing in</> : "Sign in"}
          </button>
        </form>

        {/* Demo hint */}
        <div className="login-hint">
          <strong>Multi-user demo:</strong> Open two browsers and sign in with different accounts to test real-time isolation.
          <div className="demo-pills">
            {["user1@example.com", "user2@example.com"].map((d) => (
              <button
                key={d}
                type="button"
                id={`demo-${d.split("@")[0]}`}
                className="demo-pill"
                onClick={() => { setEmail(d); setError(""); }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
