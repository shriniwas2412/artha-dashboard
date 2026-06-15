import React from "react";

/**
 * MarketOverview — shows market status stats panel.
 */
export default function MarketOverview({ subscriptionCount, connectionStatus }) {
  const isConnected = connectionStatus === "connected";

  return (
    <section className="glass-card market-overview" aria-label="Market Overview">
      <div className="market-overview-header">
        <span aria-hidden="true">📊</span>
        <h3>Market Overview</h3>
      </div>

      <div className="market-overview-grid">
        <div className="market-stat">
          <span className="market-stat-label">
            <span className="icon" aria-hidden="true">🟢</span>
            Market Status
          </span>
          <span className="market-stat-value" style={{ color: "var(--color-green)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
            Simulated Open
          </span>
        </div>

        <div className="market-stat">
          <span className="market-stat-label">
            <span className="icon" aria-hidden="true">📈</span>
            Supported Stocks
          </span>
          <span className="market-stat-value" style={{ fontFamily: "var(--font-mono)" }}>5</span>
        </div>

        <div className="market-stat">
          <span className="market-stat-label">
            <span className="icon" aria-hidden="true">⭐</span>
            Your Subscriptions
          </span>
          <span className="market-stat-value" id="subscription-count" style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>
            {subscriptionCount}
          </span>
        </div>

        <div className="market-stat">
          <span className="market-stat-label">
            <span className="icon" aria-hidden="true">⚡</span>
            Update Frequency
          </span>
          <span className="market-stat-value" style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>1s</span>
        </div>

        <div className="market-stat">
          <span className="market-stat-label">
            <span className="icon" aria-hidden="true">🔌</span>
            Realtime Status
          </span>
          <span
            className="market-stat-value"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: isConnected ? "var(--color-green)" : "var(--color-red)",
            }}
          >
            {isConnected ? "Connected" : connectionStatus === "connecting" ? "Connecting…" : "Disconnected"}
          </span>
        </div>
      </div>
    </section>
  );
}
