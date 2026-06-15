import React from "react";

export default function ConnectionBadge({ status }) {
  const config = {
    connected:    { label: "Live",         dotClass: "dot-green",  badgeClass: "connected" },
    connecting:   { label: "Connecting",   dotClass: "dot-yellow", badgeClass: "connecting" },
    disconnected: { label: "Disconnected", dotClass: "dot-red",    badgeClass: "disconnected" },
  }[status] || { label: "Offline", dotClass: "dot-red", badgeClass: "disconnected" };

  return (
    <div
      id="connection-badge"
      className={`conn-badge ${config.badgeClass}`}
      title={`Socket.IO: ${status}`}
      role="status"
      aria-live="polite"
    >
      <span className={`dot ${config.dotClass}`} aria-hidden="true" />
      {config.label}
    </div>
  );
}
