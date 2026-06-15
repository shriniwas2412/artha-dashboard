import React from "react";
import ConnectionBadge from "./ConnectionBadge.jsx";

const ChartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
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

export default function Header({ user, connectionStatus, onLogout, theme, onToggleTheme }) {
  const avatarLetter = user?.email ? user.email[0].toUpperCase() : "U";

  return (
    <header className="header" role="banner">
      {/* Brand */}
      <div className="header-brand">
        <div className="header-brand-mark"><ChartIcon /></div>
        <span className="header-brand-name">PulseTrade</span>
      </div>

      {/* Right */}
      <div className="header-right">
        <ConnectionBadge status={connectionStatus} />

        <div className="header-user" title={user?.email}>
          <div className="header-avatar">{avatarLetter}</div>
          <span className="header-email">{user?.email}</span>
        </div>

        {/* Theme toggle */}
        <button
          id="theme-toggle-btn"
          className="theme-toggle"
          onClick={onToggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Logout */}
        <button
          id="logout-btn"
          className="btn btn-ghost"
          onClick={onLogout}
          style={{ padding: "6px 12px", fontSize: "0.8125rem" }}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
