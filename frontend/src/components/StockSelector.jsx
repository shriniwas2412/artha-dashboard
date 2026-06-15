import React from "react";

export default function StockSelector({ stocks, subscriptions, loadingTicker, onSubscribe, onUnsubscribe }) {
  return (
    <section className="card selector-card" aria-label="Stock Watchlist">
      <div className="selector-header">
        <div className="section-title" style={{ marginBottom: 0 }}>Watchlist</div>
        <span className="badge badge-gray mono">{subscriptions.length} / 5</span>
      </div>

      <div role="list">
        {stocks.map((stock) => {
          const isSubscribed = subscriptions.includes(stock.ticker);
          const isLoading = loadingTicker === stock.ticker;

          return (
            <div
              key={stock.ticker}
              className={`stock-row${isSubscribed ? " active" : ""}`}
              role="listitem"
              id={`stock-row-${stock.ticker}`}
            >
              <div className="stock-row-info">
                <div className="stock-row-ticker">{stock.ticker}</div>
                <div className="stock-row-name">{stock.name}</div>
                <div className="stock-row-sector">{stock.sector}</div>
              </div>

              {isSubscribed ? (
                <button
                  id={`unsubscribe-btn-${stock.ticker}`}
                  className="btn btn-danger row-btn"
                  onClick={() => onUnsubscribe(stock.ticker)}
                  disabled={isLoading}
                  aria-label={`Remove ${stock.ticker}`}
                >
                  {isLoading ? <span className="spinner" /> : "Remove"}
                </button>
              ) : (
                <button
                  id={`subscribe-btn-${stock.ticker}`}
                  className="btn btn-success row-btn"
                  onClick={() => onSubscribe(stock.ticker)}
                  disabled={isLoading}
                  aria-label={`Watch ${stock.ticker}`}
                >
                  {isLoading ? <span className="spinner" /> : "Watch"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
