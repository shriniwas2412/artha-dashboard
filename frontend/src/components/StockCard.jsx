import React, { useState, useRef, useEffect } from "react";
import MiniChart from "./MiniChart.jsx";
import { formatPrice, formatChange, formatPercent, formatTimestamp } from "../utils/formatters.js";
import { getPriceHistory } from "../utils/priceHistory.js";

/**
 * StockCard — displays live data for a single subscribed stock.
 * Flashes green/red on price change.
 */
export default function StockCard({ priceData, onUnsubscribe, unsubscribeLoading }) {
  const [flashClass, setFlashClass] = useState("");
  const prevPriceRef = useRef(priceData?.price);
  const [chartData, setChartData] = useState(() => getPriceHistory(priceData?.ticker));

  // Flash animation on price update
  useEffect(() => {
    if (!priceData) return;
    if (prevPriceRef.current !== priceData.price) {
      const dir = priceData.direction;
      if (dir === "up") setFlashClass("flash-up");
      else if (dir === "down") setFlashClass("flash-down");
      prevPriceRef.current = priceData.price;

      const t = setTimeout(() => setFlashClass(""), 450);
      return () => clearTimeout(t);
    }
  }, [priceData?.price]);

  // Update chart data when history changes
  useEffect(() => {
    if (priceData?.ticker) {
      setChartData([...getPriceHistory(priceData.ticker)]);
    }
  }, [priceData?.price, priceData?.ticker]);

  if (!priceData) return null;

  const { ticker, name, sector, price, change, changePercent, direction, timestamp } = priceData;

  const changeArrow = direction === "up" ? "↑" : direction === "down" ? "↓" : "→";
  const priceColorClass = direction === "up" ? "up" : direction === "down" ? "down" : "";

  return (
    <article
      id={`stock-card-${ticker}`}
      className={`stock-card glass-card ${direction || "flat"} ${flashClass} fade-in-up`}
      aria-label={`${ticker} stock card`}
    >
      {/* Card header */}
      <div className="stock-card-header">
        <div>
          <div className="stock-card-ticker">{ticker}</div>
          <div className="stock-card-name">{name}</div>
        </div>
        <span className="stock-card-sector-badge">{sector}</span>
      </div>

      {/* Price row */}
      <div className="stock-card-price-row">
        <span className={`stock-card-price text-mono ${priceColorClass}`}>
          {formatPrice(price)}
        </span>
        <div className={`stock-card-change ${direction || "flat"}`}>
          <span className="change-arrow" aria-hidden="true">{changeArrow}</span>
          <span>{formatChange(change)}</span>
          <span>({formatPercent(changePercent)})</span>
        </div>
      </div>

      {/* Meta row */}
      <div className="stock-card-meta">
        <span className="stock-card-timestamp" title="Last updated">
          ⏱ {formatTimestamp(timestamp)}
        </span>
        <button
          id={`card-unsubscribe-btn-${ticker}`}
          className="btn btn-danger stock-card-unsubscribe"
          onClick={() => onUnsubscribe(ticker)}
          disabled={unsubscribeLoading}
          title={`Remove ${ticker} from watchlist`}
          aria-label={`Unsubscribe from ${ticker}`}
        >
          {unsubscribeLoading ? <span className="spinner" style={{ width: 12, height: 12 }} /> : "✕ Remove"}
        </button>
      </div>

      {/* Live mini chart */}
      <MiniChart data={chartData} direction={direction} />
    </article>
  );
}
