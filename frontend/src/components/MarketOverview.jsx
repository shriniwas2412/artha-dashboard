import React from "react";

export default function MarketOverview({ subscriptionCount, connectionStatus }) {
  const isConnected = connectionStatus === "connected";

  const rows = [
    { label: "Market Status",      value: "Simulated Open", cls: "green" },
    { label: "Supported Stocks",   value: "5",              cls: "" },
    { label: "Your Subscriptions", value: String(subscriptionCount), cls: "blue", id: "subscription-count" },
    { label: "Update Interval",    value: "1s",             cls: "blue" },
    { label: "Realtime",           value: isConnected ? "Connected" : connectionStatus === "connecting" ? "Connecting" : "Disconnected",
      cls: isConnected ? "green" : "" },
  ];

  return (
    <section className="card overview-card" aria-label="Market Overview">
      <div className="section-title">Market Overview</div>
      <div className="overview-list">
        {rows.map((r) => (
          <div className="overview-row" key={r.label}>
            <span className="overview-label">{r.label}</span>
            <span className={`overview-value mono${r.cls ? ` ${r.cls}` : ""}`} id={r.id}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
