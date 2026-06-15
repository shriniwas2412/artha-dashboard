import React from "react";

/**
 * ConnectionBadge — shows current Socket.IO connection status.
 * status: "connected" | "connecting" | "disconnected"
 */
export default function ConnectionBadge({ status }) {
  const config = {
    connected: {
      label: "Live",
      dotClass: "green",
      badgeClass: "connected",
      title: "Socket.IO connected — receiving live updates",
    },
    connecting: {
      label: "Connecting",
      dotClass: "yellow",
      badgeClass: "connecting",
      title: "Establishing connection to the server…",
    },
    disconnected: {
      label: "Offline",
      dotClass: "red",
      badgeClass: "disconnected",
      title: "Disconnected from server — trying to reconnect",
    },
  }[status] || {
    label: "Unknown",
    dotClass: "red",
    badgeClass: "disconnected",
    title: "Unknown connection state",
  };

  return (
    <div
      id="connection-badge"
      className={`connection-badge ${config.badgeClass}`}
      title={config.title}
      role="status"
      aria-live="polite"
    >
      <span className={`pulse-dot ${config.dotClass}`} aria-hidden="true" />
      {config.label}
    </div>
  );
}
