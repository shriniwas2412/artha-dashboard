import React from "react";

// Simple chart-line SVG icon
const EmptyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-3)" }}>
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

export default function EmptyState() {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon"><EmptyIcon /></div>
      <h3>No stocks in your watchlist</h3>
      <p>Add a stock from the Watchlist panel on the left to start receiving live price updates.</p>
      <div className="empty-tickers">
        {["GOOG", "TSLA", "AMZN", "META", "NVDA"].map((t) => (
          <span key={t} className="empty-ticker-tag">{t}</span>
        ))}
      </div>
    </div>
  );
}
