import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "./Header.jsx";
import MarketOverview from "./MarketOverview.jsx";
import StockSelector from "./StockSelector.jsx";
import StockCard from "./StockCard.jsx";
import EmptyState from "./EmptyState.jsx";
import TickerStrip from "./TickerStrip.jsx";
import Newsletter from "./Newsletter.jsx";
import Portfolio from "./Portfolio.jsx";
import { fetchStocks, fetchSubscriptions, subscribeToStock, unsubscribeFromStock } from "../api.js";
import { getSocket, connectSocket, disconnectSocket } from "../socket.js";
import { addPricePoint, seedPriceHistory, clearPriceHistory } from "../utils/priceHistory.js";

const MemoizedTickerStrip = React.memo(TickerStrip);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

export default function Dashboard({ user, onLogout, addToast, theme, onToggleTheme, onOpenTutorial, currentTab, setCurrentTab }) {
  const [stocks, setStocks] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [livePrices, setLivePrices] = useState({});
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [loadingTicker, setLoadingTicker] = useState(null);
  const [unsubLoadingTicker, setUnsubLoadingTicker] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const socketRef = useRef(null);
  const subscriptionsRef = useRef(subscriptions);
  subscriptionsRef.current = subscriptions;

  // ── Initial data load ──────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [stockList, subs] = await Promise.all([
          fetchStocks(),
          fetchSubscriptions(user.email),
        ]);
        if (!mounted) return;
        setStocks(stockList);
        setSubscriptions(subs);
        stockList.forEach((s) => {
          if (subs.includes(s.ticker)) seedPriceHistory(s.ticker, s.currentPrice || s.basePrice);
        });
      } catch (err) {
        if (!mounted) return;
        addToast("error", "Connection error", err.message || "Failed to load dashboard data.");
      } finally {
        if (mounted) setPageLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user.email]);

  // ── Socket.IO ──────────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const onConnect = () => {
      setConnectionStatus("connected");
      socket.emit("joinUser", { email: user.email });
    };
    const onDisconnect = (reason) => {
      setConnectionStatus("disconnected");
      if (reason !== "io client disconnect")
        addToast("warning", "Connection lost", "Reconnecting…");
    };
    const onConnectError = () => setConnectionStatus("disconnected");
    const onReconnectAttempt = () => setConnectionStatus("connecting");

    const onStockUpdate = (priceData) => {
      const { ticker, price, timestamp } = priceData;
      if (!subscriptionsRef.current.includes(ticker)) return;
      addPricePoint(ticker, price, timestamp);
      setLivePrices((prev) => ({ ...prev, [ticker]: priceData }));
    };

    const onSubscriptionUpdated = (data) => {
      if (data?.subscriptions) setSubscriptions(data.subscriptions);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("reconnect_attempt", onReconnectAttempt);
    socket.on("stock:update", onStockUpdate);
    socket.on("subscription:updated", onSubscriptionUpdated);
    connectSocket(user.email);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("reconnect_attempt", onReconnectAttempt);
      socket.off("stock:update", onStockUpdate);
      socket.off("subscription:updated", onSubscriptionUpdated);
    };
  }, [user.email, addToast]);

  const handleLogout = useCallback(() => { disconnectSocket(); onLogout(); }, [onLogout]);

  const handleSubscribe = useCallback(async (ticker) => {
    if (subscriptionsRef.current.includes(ticker)) {
      addToast("warning", "Already watching", `${ticker} is in your watchlist.`);
      return;
    }
    setLoadingTicker(ticker);
    try {
      const updatedSubs = await subscribeToStock(user.email, ticker);
      setSubscriptions(updatedSubs);
      const stock = stocks.find((s) => s.ticker === ticker);
      if (stock) seedPriceHistory(ticker, stock.currentPrice || stock.basePrice);
      socketRef.current?.emit("joinUser", { email: user.email });
      addToast("success", "Watching", `${ticker} added to your watchlist.`);
    } catch (err) {
      addToast("error", "Failed", err.message);
    } finally { setLoadingTicker(null); }
  }, [user.email, stocks, addToast]);

  const handleUnsubscribe = useCallback(async (ticker) => {
    setUnsubLoadingTicker(ticker);
    try {
      const updatedSubs = await unsubscribeFromStock(user.email, ticker);
      setSubscriptions(updatedSubs);
      clearPriceHistory(ticker);
      setLivePrices((prev) => { const n = { ...prev }; delete n[ticker]; return n; });
      addToast("info", "Removed", `${ticker} removed from your watchlist.`);
    } catch (err) {
      addToast("error", "Failed", err.message);
    } finally { setUnsubLoadingTicker(null); }
  }, [user.email, addToast]);

  if (pageLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 14 }}>
        <span className="spinner" style={{ width: 28, height: 28, borderWidth: 2.5 }} />
        <span style={{ fontSize: "0.875rem", color: "var(--text-2)" }}>Loading Artha…</span>
      </div>
    );
  }

  return (
    <>
      <Header
        user={user}
        connectionStatus={connectionStatus}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenTutorial={onOpenTutorial}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {currentTab === "portfolio" ? (
        <Portfolio stocks={stocks} livePrices={livePrices} addToast={addToast} />
      ) : (
        <>
          {/* Scrolling market ticker */}
          {stocks.length > 0 && <MemoizedTickerStrip stocks={stocks} />}

          <main className="dashboard" role="main">
            {/* Disclaimer */}
            <div className="disclaimer">
              <strong>Simulated data only.</strong> All prices are generated algorithmically for demonstration purposes. This is not real market data.
            </div>

            {/* Main grid */}
            <div className="dash-grid">
              {/* Left column */}
              <div className="left-col">
                <MarketOverview
                  stocks={stocks}
                  subscriptionCount={subscriptions.length}
                  connectionStatus={connectionStatus}
                />
                <StockSelector
                  stocks={stocks}
                  subscriptions={subscriptions}
                  loadingTicker={loadingTicker}
                  onSubscribe={handleSubscribe}
                  onUnsubscribe={handleUnsubscribe}
                />
                <div className="artha-meaning-card fade-up">
                  <div className="artha-meaning-title"><InfoIcon /> Meaning of Artha</div>
                  <div className="artha-meaning-text">
                    <strong>Artha</strong> is one of the four aims of human life in Indian philosophy. It implies wealth, purpose, and prosperity. 
                    <br/><br/>
                    Markets aren't just numbers; they represent human endeavor and the pursuit of meaning. Use this dashboard to discover the true mathematics of markets!
                  </div>
                </div>
              </div>

              {/* Right column — live cards */}
          <div>
            <div className="cards-header">
              <span className="section-title">Live Watchlist</span>
              <span className="cards-count">
                {subscriptions.length > 0
                  ? `${subscriptions.length} stock${subscriptions.length !== 1 ? "s" : ""} tracked`
                  : "No stocks tracked"}
              </span>
            </div>

            {subscriptions.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="cards-grid">
                {subscriptions.map((ticker) => {
                  const stockInfo = stocks.find((s) => s.ticker === ticker);
                  const price = livePrices[ticker];

                  const displayData = price || (stockInfo ? {
                    ticker,
                    name: stockInfo.name,
                    sector: stockInfo.sector,
                    exchange: stockInfo.exchange,
                    currency: stockInfo.currency,
                    price: stockInfo.currentPrice || stockInfo.basePrice,
                    change: 0,
                    changePercent: 0,
                    direction: "flat",
                    timestamp: new Date().toISOString(),
                  } : null);

                  return (
                    <StockCard
                      key={ticker}
                      priceData={displayData}
                      onUnsubscribe={handleUnsubscribe}
                      unsubscribeLoading={unsubLoadingTicker === ticker}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Newsletter */}
        <Newsletter />
      </main>
      </>
      )}
    </>
  );
}
