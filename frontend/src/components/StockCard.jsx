import React, { useState, useRef, useEffect } from "react";
import MiniChart from "./MiniChart.jsx";
import { formatPrice, formatTimestamp } from "../utils/formatters.js";
import { getPriceHistory } from "../utils/priceHistory.js";

export default function StockCard({ priceData, onUnsubscribe, unsubscribeLoading }) {
  const [flashClass, setFlashClass] = useState("");
  const prevPriceRef = useRef(priceData?.price);
  const [chartData, setChartData] = useState(() => getPriceHistory(priceData?.ticker));

  useEffect(() => {
    if (!priceData) return;
    if (prevPriceRef.current !== undefined && prevPriceRef.current !== priceData.price) {
      const dir = priceData.direction;
      if (dir === "up") setFlashClass("flash-up");
      else if (dir === "down") setFlashClass("flash-down");
      prevPriceRef.current = priceData.price;
      const t = setTimeout(() => setFlashClass(""), 350);
      return () => clearTimeout(t);
    }
    prevPriceRef.current = priceData.price;
  }, [priceData?.price]);

  useEffect(() => {
    if (priceData?.ticker) setChartData([...getPriceHistory(priceData.ticker)]);
  }, [priceData?.price, priceData?.ticker]);

  if (!priceData) return null;

  const { ticker, name, sector, price, change, changePercent, direction, timestamp, currency, exchange } = priceData;
  const dirClass = direction === "up" ? "up" : direction === "down" ? "down" : "flat";
  const sign = direction === "up" ? "+" : direction === "down" ? "-" : "";

  // Session high/low/avg from price history
  const prices = chartData.map((d) => d.price);
  const sessionHigh = prices.length ? Math.max(...prices) : price;
  const sessionLow  = prices.length ? Math.min(...prices) : price;
  const sessionAvg  = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : price;

  const cur = currency || "USD";
  const exchClass = (exchange || "NASDAQ") === "NASDAQ" ? "exch-nasdaq" : "exch-nse";

  return (
    <article
      id={`stock-card-${ticker}`}
      className={`stock-card ${dirClass} ${flashClass} fade-up`}
      aria-label={`${ticker} live price`}
    >
      {/* Top row */}
      <div className="card-top">
        <div>
          <div className="card-ticker">{ticker}</div>
          <div className="card-name">{name}</div>
        </div>
        <div className="card-badges">
          <span className={exchClass}>{exchange || "NASDAQ"}</span>
          <span className="badge badge-gray" style={{ fontSize: "0.6rem" }}>{sector}</span>
        </div>
      </div>

      {/* Mini chart */}
      <MiniChart data={chartData} direction={direction} />

      {/* Price */}
      <div className={`card-price mono ${dirClass}`}>{formatPrice(price, cur)}</div>

      {/* Change */}
      <div className={`card-change mono ${dirClass}`}>
        <span>{sign}{Math.abs(change ?? 0).toFixed(2)}</span>
        <span>({sign}{Math.abs(changePercent ?? 0).toFixed(2)}%)</span>
      </div>

      {/* Session stats */}
      <div className="session-row">
        <div className="session-item">
          <div className="session-lbl">High</div>
          <div className="session-val mono green">{formatPrice(sessionHigh, cur)}</div>
        </div>
        <div className="session-item">
          <div className="session-lbl">Low</div>
          <div className="session-val mono red">{formatPrice(sessionLow, cur)}</div>
        </div>
        <div className="session-item">
          <div className="session-lbl">Avg</div>
          <div className="session-val mono">{formatPrice(sessionAvg, cur)}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="card-footer">
        <span className="card-time">{formatTimestamp(timestamp)}</span>
        <button
          id={`card-remove-${ticker}`}
          className="btn btn-danger card-rm-btn"
          onClick={() => onUnsubscribe(ticker)}
          disabled={unsubscribeLoading}
        >
          {unsubscribeLoading ? <span className="spinner" style={{ width: 10, height: 10 }} /> : "Remove"}
        </button>
      </div>
    </article>
  );
}
