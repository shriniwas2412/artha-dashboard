import React from "react";

/**
 * EmptyState — shown when user has no subscribed stocks.
 */
export default function EmptyState() {
  return (
    <div className="empty-state" role="status" aria-label="No stocks subscribed">
      <div className="empty-state-icon" aria-hidden="true">📭</div>
      <h3>No stocks in your watchlist yet</h3>
      <p>
        Subscribe to a stock using the <strong style={{ color: "var(--color-accent)" }}>Watchlist</strong> panel on the left to start receiving live price updates every second.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
        {["GOOG", "TSLA", "AMZN", "META", "NVDA"].map((ticker) => (
          <span
            key={ticker}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 6,
              background: "rgba(61, 126, 255, 0.08)",
              border: "1px solid rgba(61, 126, 255, 0.15)",
              color: "var(--color-accent)",
            }}
          >
            {ticker}
          </span>
        ))}
      </div>
    </div>
  );
}
