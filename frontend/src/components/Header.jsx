import React from "react";
import ConnectionBadge from "./ConnectionBadge.jsx";

export default function Header({ user, connectionStatus, onLogout }) {
  const avatarLetter = user?.email ? user.email[0].toUpperCase() : "U";

  return (
    <header className="header" role="banner">
      {/* Brand */}
      <div className="header-brand">
        <div className="header-brand-icon" aria-hidden="true">📈</div>
        <div>
          <div className="header-brand-name">PulseTrade</div>
          <div className="header-brand-sub">Real-Time Stock Dashboard</div>
        </div>
      </div>

      {/* Right side */}
      <div className="header-right">
        <ConnectionBadge status={connectionStatus} />

        {/* User info */}
        <div className="header-user" title={user?.email}>
          <div className="header-user-avatar" aria-hidden="true">{avatarLetter}</div>
          <span className="header-user-email">{user?.email}</span>
        </div>

        {/* Logout */}
        <button
          id="logout-btn"
          className="btn btn-ghost header-logout-btn"
          onClick={onLogout}
          title="Sign out"
        >
          <span>↩</span>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
