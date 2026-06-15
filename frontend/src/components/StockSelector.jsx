import React from "react";

/**
 * StockSelector — shows all 5 supported stocks with subscribe/unsubscribe buttons.
 */
export default function StockSelector({ stocks, subscriptions, loadingTicker, onSubscribe, onUnsubscribe }) {
  return (
    <section className="glass-card stock-selector" aria-label="Stock Watchlist Selector">
      <div className="stock-selector-header">
        <h3>Watchlist</h3>
        <span className="badge badge-blue">{subscriptions.length} / 5</span>
      </div>

      <div className="stock-selector-list" role="list">
        {stocks.map((stock) => {
          const isSubscribed = subscriptions.includes(stock.ticker);
          const isLoading = loadingTicker === stock.ticker;

          return (
            <div
              key={stock.ticker}
              className={`stock-selector-item${isSubscribed ? " subscribed" : ""}`}
              role="listitem"
              id={`stock-row-${stock.ticker}`}
            >
              <div className="stock-info">
                <div className="stock-ticker-badge">{stock.ticker}</div>
                <div className="stock-name">{stock.name}</div>
                <div className="stock-sector">{stock.sector}</div>
              </div>

              {isSubscribed ? (
                <button
                  id={`unsubscribe-btn-${stock.ticker}`}
                  className="btn btn-danger subscribe-btn"
                  onClick={() => onUnsubscribe(stock.ticker)}
                  disabled={isLoading}
                  title={`Unsubscribe from ${stock.ticker}`}
                  aria-label={`Remove ${stock.ticker} from watchlist`}
                >
                  {isLoading ? <span className="spinner" /> : "✕ Remove"}
                </button>
              ) : (
                <button
                  id={`subscribe-btn-${stock.ticker}`}
                  className="btn btn-success subscribe-btn"
                  onClick={() => onSubscribe(stock.ticker)}
                  disabled={isLoading}
                  title={`Subscribe to ${stock.ticker}`}
                  aria-label={`Add ${stock.ticker} to watchlist`}
                >
                  {isLoading ? <span className="spinner" /> : "+ Watch"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
