import React, { useState, useRef, useEffect } from "react";
import MiniChart from "./MiniChart.jsx";
import { formatPrice, formatChange, formatPercent, formatTimestamp } from "../utils/formatters.js";
import { getPriceHistory } from "../utils/priceHistory.js";

export default function StockCard({ priceData, onUnsubscribe, unsubscribeLoading }) {
  const [flashClass, setFlashClass] = useState("");
  const prevPriceRef = useRef(priceData?.price);
  const [chartData, setChartData] = useState(() => getPriceHistory(priceData?.ticker));

  // Flash animation on price change
  useEffect(() => {
    if (!priceData) return;
    if (prevPriceRef.current !== priceData.price) {
      const dir = priceData.direction;
      if (dir === "up")   setFlashClass("flash-up");
      else if (dir === "down") setFlashClass("flash-down");
      prevPriceRef.current = priceData.price;
      const t = setTimeout(() => setFlashClass(""), 380);
      return () => clearTimeout(t);
    }
  }, [priceData?.price]);

  // Sync chart data
  useEffect(() => {
    if (priceData?.ticker) {
      setChartData([...getPriceHistory(priceData.ticker)]);
    }
  }, [priceData?.price, priceData?.ticker]);

  if (!priceData) return null;

  const { ticker, name, sector, price, change, changePercent, direction, timestamp } = priceData;

  const dirClass = direction === "up" ? "up" : direction === "down" ? "down" : "flat";
  const arrow = direction === "up" ? "+" : direction === "down" ? "-" : "";

  return (
    <article
      id={`stock-card-${ticker}`}
      className={`stock-card ${dirClass} ${flashClass} fade-up`}
      aria-label={`${ticker} live price card`}
    >
      {/* Header row */}
      <div className="card-header">
        <div>
          <div className="card-ticker">{ticker}</div>
          <div className="card-name">{name}</div>
        </div>
        <span className="card-sector">{sector}</span>
      </div>

      {/* Live chart */}
      <MiniChart data={chartData} direction={direction} />

      {/* Price */}
      <div className={`card-price mono ${dirClass}`}>{formatPrice(price)}</div>

      {/* Change */}
      <div className={`card-change mono ${dirClass}`}>
        <span>{arrow}{Math.abs(change).toFixed(2)}</span>
        <span>({arrow}{Math.abs(changePercent).toFixed(2)}%)</span>
      </div>

      {/* Footer */}
      <div className="card-footer">
        <span className="card-time">{formatTimestamp(timestamp)}</span>
        <button
          id={`card-remove-${ticker}`}
          className="btn btn-danger card-remove"
          onClick={() => onUnsubscribe(ticker)}
          disabled={unsubscribeLoading}
          aria-label={`Remove ${ticker}`}
        >
          {unsubscribeLoading
            ? <span className="spinner" style={{ width: 12, height: 12 }} />
            : "Remove"}
        </button>
      </div>
    </article>
  );
}
