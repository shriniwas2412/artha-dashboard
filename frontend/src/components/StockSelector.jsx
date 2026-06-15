import React, { useState } from "react";

export default function StockSelector({ stocks, subscriptions, loadingTicker, onSubscribe, onUnsubscribe }) {
  const [filter, setFilter] = useState("all"); // "all" | "US" | "IN"

  const filtered = stocks.filter((s) => {
    if (filter === "US") return s.flag === "US";
    if (filter === "IN") return s.flag === "IN";
    return true;
  });

  return (
    <section className="card selector-card" aria-label="Stock Watchlist">
      <div className="selector-header">
        <span className="section-title">Watchlist</span>
        <span id="watchlist-count" className="badge badge-gray mono">{subscriptions.length}/{stocks.length}</span>
      </div>

      {/* Exchange filter tabs */}
      <div className="exch-tabs" role="tablist">
        {[["all", "All"], ["US", "US"], ["IN", "India"]].map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={filter === key}
            className={`exch-tab${filter === key ? " active" : ""}`}
            onClick={() => setFilter(key)}
            id={`tab-${key}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div role="list">
        {filtered.map((stock) => {
          const isSubscribed = subscriptions.includes(stock.ticker);
          const isLoading = loadingTicker === stock.ticker;
          const exchClass = stock.exchange === "NASDAQ" ? "exch-nasdaq" : "exch-nse";

          return (
            <div
              key={stock.ticker}
              id={`stock-row-${stock.ticker}`}
              className={`stock-row${isSubscribed ? " active" : ""}`}
              role="listitem"
            >
              <div className="row-info">
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="row-ticker">{stock.ticker}</span>
                  <span className={exchClass}>{stock.exchange}</span>
                </div>
                <div className="row-name">{stock.name}</div>
                <div className="row-sector">{stock.currency === "INR" ? "₹ INR" : "$ USD"} · {stock.sector}</div>
              </div>

              {isSubscribed ? (
                <button
                  id={`unsubscribe-btn-${stock.ticker}`}
                  className="btn btn-danger row-btn"
                  onClick={() => onUnsubscribe(stock.ticker)}
                  disabled={isLoading}
                >
                  {isLoading ? <span className="spinner" style={{ width: 10, height: 10 }} /> : "Remove"}
                </button>
              ) : (
                <button
                  id={`subscribe-btn-${stock.ticker}`}
                  className="btn btn-success row-btn"
                  onClick={() => onSubscribe(stock.ticker)}
                  disabled={isLoading}
                >
                  {isLoading ? <span className="spinner" style={{ width: 10, height: 10 }} /> : "Watch"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
