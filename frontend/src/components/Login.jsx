import React, { useState } from "react";
import { loginUser } from "../api.js";

const ChartLineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export default function Login({ onLogin, addToast, theme, onToggleTheme }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (v) => {
    if (!v.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "Please enter a valid email.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(email);
    if (err) { setError(err); return; }
    setError(""); setLoading(true);
    try {
      const user = await loginUser(email.trim().toLowerCase());
      onLogin(user);
    } catch (err) {
      const msg = err.message || "Cannot connect to the server. Make sure the backend is running.";
      setError(msg);
      addToast("error", "Sign in failed", msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      {/* Left hero panel */}
      <div className="login-hero">
        <div className="login-hero-brand">
          <div className="login-hero-mark"><ChartLineIcon /></div>
          <div>
            <div className="login-hero-name">Artha</div>
            <div className="login-hero-tag">The Mathematics of Markets</div>
          </div>
        </div>

        <div className="login-hero-body">
          <h1 className="login-hero-headline">
            Real-time stock tracking,<br />
            made precise.
          </h1>
          <p className="login-hero-sub">
            Track live simulated prices from NASDAQ and NSE markets.
            Subscribe to your chosen stocks, watch them update every second,
            and monitor multiple users simultaneously.
          </p>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-val">10</div>
              <div className="hero-stat-lbl">Stocks tracked</div>
            </div>
            <div>
              <div className="hero-stat-val">1s</div>
              <div className="hero-stat-lbl">Update interval</div>
            </div>
            <div>
              <div className="hero-stat-val">2</div>
              <div className="hero-stat-lbl">Markets (US + IN)</div>
            </div>
          </div>
        </div>

        <div className="login-hero-footer">
          <div className="sanskrit-note">Artha</div>
          wealth · purpose · prosperity
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-form-panel">
        <button
          className="btn-icon login-theme-btn"
          onClick={onToggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        <div className="login-card fade-up">
          <h2 className="login-card-title">Sign in to Artha</h2>
          <p className="login-card-sub">Enter your email to access your dashboard.</p>

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
            <button id="login-submit-btn" type="submit" className="btn btn-primary login-btn-full" disabled={loading}>
              {loading ? <><span className="spinner" /> Signing in</> : "Sign in"}
            </button>
          </form>

          <div className="login-hint">
            <strong>Multi-user demo:</strong> Open two browsers and sign in as different accounts to test real-time isolation.
            <div className="demo-pills">
              {["user1@example.com", "user2@example.com"].map((d) => (
                <button
                  key={d} type="button"
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
    </div>
  );
}
