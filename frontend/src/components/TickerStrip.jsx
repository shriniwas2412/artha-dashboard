import React, { useState, useEffect, useRef } from "react";

/**
 * TickerStrip — scrolling horizontal market ticker showing all 10 stocks.
 * Runs its own local price simulation for display-only purposes.
 */
export default function TickerStrip({ stocks }) {
  const [prices, setPrices] = useState(() => {
    const map = {};
    stocks.forEach((s) => {
      map[s.ticker] = { price: s.currentPrice || s.basePrice, prev: s.currentPrice || s.basePrice };
    });
    return map;
  });

  // Local price simulation for ticker (1s interval, small random walk)
  useEffect(() => {
    if (!stocks.length) return;
    const id = setInterval(() => {
      setPrices((prev) => {
        const next = {};
        stocks.forEach((stock) => {
          const curr = prev[stock.ticker]?.price || stock.basePrice;
          const move = stock.volatility / 100;
          const delta = curr * (Math.random() * move * 2 - move);
          const newPrice = Math.max(
            stock.basePrice * 0.7,
            Math.min(stock.basePrice * 1.3, curr + delta + (stock.basePrice - curr) * 0.001)
          );
          const rounded = Math.round(newPrice * 100) / 100;
          next[stock.ticker] = { price: rounded, prev: curr };
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [stocks]);

  if (!stocks.length) return null;

  const formatTickerPrice = (price, currency) => {
    if (currency === "INR")
      return "₹" + price.toFixed(2);
    return "$" + price.toFixed(2);
  };

  // Duplicate items for seamless scroll loop
  const items = [...stocks, ...stocks];

  return (
    <div className="ticker-wrap" aria-label="Live market ticker" role="marquee">
      <div className="ticker-inner">
        {items.map((stock, idx) => {
          const data = prices[stock.ticker] || { price: stock.basePrice, prev: stock.basePrice };
          const diff = data.price - data.prev;
          const dir = diff > 0.005 ? "up" : diff < -0.005 ? "down" : "flat";
          const pct = data.prev ? ((diff / data.prev) * 100).toFixed(2) : "0.00";
          const sign = dir === "up" ? "+" : dir === "down" ? "" : "";

          return (
            <div key={`${stock.ticker}-${idx}`} className="ticker-item" title={`${stock.name} (${stock.exchange})`}>
              <span className="ticker-sym">{stock.ticker}</span>
              <span className="ticker-price">{formatTickerPrice(data.price, stock.currency)}</span>
              <span className={`ticker-change ${dir}`}>
                {sign}{pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
