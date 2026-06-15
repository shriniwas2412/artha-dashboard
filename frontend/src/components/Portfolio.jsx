import React, { useState, useEffect } from "react";
import { formatPrice } from "../utils/formatters";

const BriefcaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default function Portfolio({ stocks, livePrices, addToast }) {
  const [balance, setBalance] = useState(100000); // $100k paper trading start
  const [holdings, setHoldings] = useState({}); // { ticker: { quantity: 10, avgPrice: 150 } }
  const [history, setHistory] = useState([]); // Array of trade objects

  // Helper to get current price (simulated or base)
  const getPrice = (ticker) => {
    if (livePrices[ticker] && livePrices[ticker].price) return livePrices[ticker].price;
    const s = stocks.find(s => s.ticker === ticker);
    return s ? (s.currentPrice || s.basePrice) : 0;
  };

  const handleBuy = (ticker) => {
    const price = getPrice(ticker);
    if (!price || balance < price) {
      addToast("error", "Trade Failed", "Insufficient funds to buy " + ticker);
      return;
    }
    setBalance(prev => prev - price);
    setHoldings(prev => {
      const existing = prev[ticker] || { quantity: 0, avgPrice: 0 };
      const newQty = existing.quantity + 1;
      const newAvg = ((existing.quantity * existing.avgPrice) + price) / newQty;
      return { ...prev, [ticker]: { quantity: newQty, avgPrice: newAvg } };
    });
    setHistory(prev => [{ type: "BUY", ticker, price, time: new Date().toISOString() }, ...prev]);
    addToast("success", "Order Filled", `Bought 1 share of ${ticker} at $${price.toFixed(2)}`);
  };

  const handleSell = (ticker) => {
    const price = getPrice(ticker);
    const existing = holdings[ticker];
    if (!existing || existing.quantity <= 0) {
      addToast("error", "Trade Failed", "You do not own any shares of " + ticker);
      return;
    }
    setBalance(prev => prev + price);
    setHoldings(prev => {
      const newQty = existing.quantity - 1;
      const newAvg = newQty === 0 ? 0 : existing.avgPrice;
      if (newQty === 0) {
        const next = { ...prev };
        delete next[ticker];
        return next;
      }
      return { ...prev, [ticker]: { quantity: newQty, avgPrice: newAvg } };
    });
    setHistory(prev => [{ type: "SELL", ticker, price, time: new Date().toISOString() }, ...prev]);
    addToast("info", "Order Filled", `Sold 1 share of ${ticker} at $${price.toFixed(2)}`);
  };

  const totalValue = balance + Object.entries(holdings).reduce((sum, [ticker, data]) => {
    return sum + (data.quantity * getPrice(ticker));
  }, 0);

  const profitLoss = totalValue - 100000;
  const plClass = profitLoss >= 0 ? "green" : "red";
  const plSign = profitLoss >= 0 ? "+" : "";

  return (
    <div className="portfolio-page fade-up">
      <div className="port-header">
        <div className="port-header-left">
          <div className="port-title"><BriefcaseIcon /> Paper Trading Portfolio</div>
          <div className="port-sub">Practice trading with a $100,000 simulated account. Executions are instantaneous.</div>
        </div>
        <div className="port-balance-card">
          <div className="port-bal-label">Total Account Value</div>
          <div className="port-bal-val mono">{formatPrice(totalValue)}</div>
          <div className={`port-bal-pl mono ${plClass}`}>
            {plSign}{formatPrice(profitLoss)} ({plSign}{((profitLoss / 100000) * 100).toFixed(2)}%) All Time
          </div>
        </div>
      </div>

      <div className="port-grid">
        <div className="port-main">
          <div className="card port-section">
            <h3 className="section-title" style={{ marginBottom: "16px" }}>Your Holdings</h3>
            {Object.keys(holdings).length === 0 ? (
              <div className="empty-state" style={{ minHeight: "140px", padding: "24px" }}>
                <p>You have no open positions. Buy some shares from the market list below.</p>
              </div>
            ) : (
              <div className="holdings-list">
                {Object.entries(holdings).map(([ticker, data]) => {
                  const currentPrice = getPrice(ticker);
                  const val = currentPrice * data.quantity;
                  const pl = val - (data.avgPrice * data.quantity);
                  const plCls = pl >= 0 ? "green" : "red";
                  const pSign = pl >= 0 ? "+" : "";
                  return (
                    <div key={ticker} className="holding-row">
                      <div className="h-left">
                        <div className="h-ticker mono">{ticker}</div>
                        <div className="h-qty">{data.quantity} Shares @ {formatPrice(data.avgPrice)}</div>
                      </div>
                      <div className="h-mid">
                        <div className="h-val mono">{formatPrice(val)}</div>
                        <div className={`h-pl mono ${plCls}`}>{pSign}{formatPrice(pl)}</div>
                      </div>
                      <div className="h-right">
                        <button className="btn btn-danger" onClick={() => handleSell(ticker)}>Sell</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card port-section">
            <h3 className="section-title" style={{ marginBottom: "16px" }}>Market Trade Desk</h3>
            <div className="trade-list">
              {stocks.map(s => {
                const price = getPrice(s.ticker);
                return (
                  <div key={s.ticker} className="trade-row">
                    <div style={{ flex: 1 }}>
                      <div className="t-ticker mono">{s.ticker}</div>
                      <div className="t-name">{s.name}</div>
                    </div>
                    <div className="t-price mono">{formatPrice(price, s.currency)}</div>
                    <div className="t-actions">
                      <button className="btn btn-success" onClick={() => handleBuy(s.ticker)}>Buy</button>
                      <button className="btn btn-danger" onClick={() => handleSell(s.ticker)} disabled={!holdings[s.ticker]}>Sell</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="port-side">
          <div className="card port-section">
            <div className="port-side-header">
              <HistoryIcon /> Trade History
            </div>
            {history.length === 0 ? (
              <div style={{ fontSize: "0.8125rem", color: "var(--text-3)", textAlign: "center", padding: "20px 0" }}>No trades yet.</div>
            ) : (
              <div className="hist-list">
                {history.slice(0, 15).map((h, i) => (
                  <div key={i} className="hist-row">
                    <div className={`hist-type ${h.type.toLowerCase()}`}>{h.type}</div>
                    <div className="hist-mid">
                      <div className="hist-ticker mono">{h.ticker}</div>
                      <div className="hist-time">{new Date(h.time).toLocaleTimeString()}</div>
                    </div>
                    <div className="hist-price mono">${h.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card port-section api-config-card">
            <h3 className="section-title" style={{ marginBottom: "12px" }}>Data Source Settings</h3>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-2)", marginBottom: "14px", lineHeight: "1.5" }}>
              Configure your market data provider. Switch to a live API key for real-world exchange data.
            </div>
            <div className="api-select">
              <label><input type="radio" name="ds" defaultChecked /> Simulated (Artha Algorithmic)</label>
              <label className="muted"><input type="radio" name="ds" disabled /> Finnhub (Live - Pro Only)</label>
              <label className="muted"><input type="radio" name="ds" disabled /> AlphaVantage (Live - Pro Only)</label>
            </div>
            <input type="text" className="input" placeholder="API Key (e.g. sk_live_...)" disabled style={{ marginTop: "12px", opacity: 0.6 }} />
            <button className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }} disabled>Save Configuration</button>
          </div>
        </div>
      </div>
    </div>
  );
}
