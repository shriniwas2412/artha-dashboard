import React from "react";

const BarsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

export default function EmptyState() {
  const tickers = ["GOOG", "TSLA", "AMZN", "META", "NVDA", "RELIANCE", "TCS", "INFY", "HDFCBANK", "WIPRO"];
  return (
    <div className="empty-state" role="status">
      <div className="empty-icon"><BarsIcon /></div>
      <h3>Your watchlist is empty</h3>
      <p>Select stocks from the Watchlist panel on the left to start tracking live prices. Both US and Indian markets are available.</p>
      <div className="empty-tickers">
        {tickers.map((t) => (
          <span key={t} className="empty-tag">{t}</span>
        ))}
      </div>
    </div>
  );
}
