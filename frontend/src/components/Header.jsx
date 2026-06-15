import React from "react";
import ConnectionBadge from "./ConnectionBadge.jsx";

const ChartLineIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const HelpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default function Header({ user, connectionStatus, onLogout, theme, onToggleTheme, onOpenTutorial }) {
  const avatarLetter = user?.email ? user.email[0].toUpperCase() : "U";
  return (
    <header className="header" role="banner">
      <div className="header-brand">
        <div className="header-mark"><ChartLineIcon /></div>
        <div>
          <div className="header-name">Artha</div>
          <div className="header-sub">The Mathematics of Markets</div>
        </div>
      </div>

      <div className="header-right">
        <ConnectionBadge status={connectionStatus} />

        <div className="header-user" title={user?.email}>
          <div className="header-avatar">{avatarLetter}</div>
          <span className="header-email">{user?.email}</span>
        </div>

        <button
          id="tutorial-help-btn"
          className="btn-icon"
          onClick={onOpenTutorial}
          title="Open tutorial"
          aria-label="Open tutorial"
        >
          <HelpIcon />
        </button>

        <button
          id="theme-toggle-btn"
          className="btn-icon"
          onClick={onToggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        <button
          id="logout-btn"
          className="btn btn-ghost"
          style={{ padding: "5px 12px", fontSize: "0.8125rem" }}
          onClick={onLogout}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
