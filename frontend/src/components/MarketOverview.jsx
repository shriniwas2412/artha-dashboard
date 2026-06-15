import React from "react";

export default function MarketOverview({ stocks, subscriptionCount, connectionStatus }) {
  const usCount = stocks.filter((s) => s.flag === "US").length;
  const inCount = stocks.filter((s) => s.flag === "IN").length;
  const isConnected = connectionStatus === "connected";

  const rows = [
    { label: "Status",             value: "Simulated Open",   cls: "g" },
    { label: "Total Stocks",       value: String(stocks.length || 10), cls: "" },
    { label: "NASDAQ (US)",        value: String(usCount || 5),  cls: "b" },
    { label: "NSE (India)",        value: String(inCount || 5),  cls: "b" },
    { label: "Your Watchlist",     value: String(subscriptionCount), cls: "", id: "subscription-count" },
    { label: "Update Interval",    value: "1 second",         cls: "" },
    { label: "WebSocket",          value: isConnected ? "Connected" : connectionStatus === "connecting" ? "Connecting" : "Disconnected",
      cls: isConnected ? "g" : "" },
  ];

  return (
    <section className="card overview-card" aria-label="Market Overview">
      <span className="section-title">Market Overview</span>
      <div className="overview-rows">
        {rows.map((r) => (
          <div className="overview-row" key={r.label}>
            <span className="overview-label">{r.label}</span>
            <span className={`overview-val${r.cls ? ` ${r.cls}` : ""}`} id={r.id}>{r.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
