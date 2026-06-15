import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "./Header.jsx";
import MarketOverview from "./MarketOverview.jsx";
import StockSelector from "./StockSelector.jsx";
import StockCard from "./StockCard.jsx";
import EmptyState from "./EmptyState.jsx";
import { fetchStocks, fetchSubscriptions, subscribeToStock, unsubscribeFromStock } from "../api.js";
import { getSocket, connectSocket, disconnectSocket } from "../socket.js";
import { addPricePoint, seedPriceHistory, clearPriceHistory } from "../utils/priceHistory.js";

/**
 * Dashboard — main view after login.
 * Manages:
 *  - REST calls for stocks + subscriptions
 *  - Socket.IO connection + event listeners
 *  - Live price state per ticker
 *  - Subscribe/unsubscribe actions
 */
export default function Dashboard({ user, onLogout, addToast }) {
  const [stocks, setStocks] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [livePrices, setLivePrices] = useState({}); // ticker -> latest price data
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [loadingTicker, setLoadingTicker] = useState(null);
  const [unsubLoadingTicker, setUnsubLoadingTicker] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const socketRef = useRef(null);
  const subscriptionsRef = useRef(subscriptions);
  subscriptionsRef.current = subscriptions;

  // ─── Initial Data Load ──────────────────────────────────────────────────────

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        const [stockList, subs] = await Promise.all([
          fetchStocks(),
          fetchSubscriptions(user.email),
        ]);
        if (!mounted) return;
        setStocks(stockList);
        setSubscriptions(subs);

        // Seed chart history for already-subscribed stocks
        stockList.forEach((s) => {
          if (subs.includes(s.ticker)) {
            seedPriceHistory(s.ticker, s.currentPrice || s.basePrice);
          }
        });
      } catch (err) {
        if (!mounted) return;
        addToast("error", "Connection Error", err.message || "Failed to load dashboard data.");
      } finally {
        if (mounted) setPageLoading(false);
      }
    }

    loadInitialData();
    return () => { mounted = false; };
  }, [user.email]);

  // ─── Socket.IO Setup ─────────────────────────────────────────────────────────

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      setConnectionStatus("connected");
      // (Re)join the user room after connect/reconnect
      socket.emit("joinUser", { email: user.email });
    };

    const handleDisconnect = (reason) => {
      setConnectionStatus("disconnected");
      if (reason !== "io client disconnect") {
        addToast("warning", "Disconnected", "Lost connection to server. Reconnecting…");
      }
    };

    const handleConnectError = () => {
      setConnectionStatus("disconnected");
    };

    const handleReconnectAttempt = () => {
      setConnectionStatus("connecting");
    };

    const handleConnected = (data) => {
      console.log("[Socket] Confirmed:", data.message);
    };

    const handleStockUpdate = (priceData) => {
      const { ticker, price, timestamp } = priceData;
      // Only process if user is still subscribed to this ticker
      if (!subscriptionsRef.current.includes(ticker)) return;

      // Update rolling chart history
      addPricePoint(ticker, price, timestamp);

      // Update live price state
      setLivePrices((prev) => ({
        ...prev,
        [ticker]: priceData,
      }));
    };

    const handleSubscriptionUpdated = (data) => {
      if (data?.subscriptions) {
        setSubscriptions(data.subscriptions);
      }
    };

    // Attach listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("reconnect_attempt", handleReconnectAttempt);
    socket.on("connected", handleConnected);
    socket.on("stock:update", handleStockUpdate);
    socket.on("subscription:updated", handleSubscriptionUpdated);

    // Connect + join room
    connectSocket(user.email);

    return () => {
      // Clean up listeners but keep socket alive (don't disconnect on re-render)
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("reconnect_attempt", handleReconnectAttempt);
      socket.off("connected", handleConnected);
      socket.off("stock:update", handleStockUpdate);
      socket.off("subscription:updated", handleSubscriptionUpdated);
    };
  }, [user.email, addToast]);

  // ─── Logout ──────────────────────────────────────────────────────────────────

  const handleLogout = useCallback(() => {
    disconnectSocket();
    onLogout();
  }, [onLogout]);

  // ─── Subscribe ───────────────────────────────────────────────────────────────

  const handleSubscribe = useCallback(async (ticker) => {
    if (subscriptionsRef.current.includes(ticker)) {
      addToast("warning", "Already Subscribed", `You are already watching ${ticker}.`);
      return;
    }

    setLoadingTicker(ticker);
    try {
      const updatedSubs = await subscribeToStock(user.email, ticker);
      setSubscriptions(updatedSubs);

      // Seed chart history for new subscription
      const stock = stocks.find((s) => s.ticker === ticker);
      if (stock) {
        seedPriceHistory(ticker, stock.currentPrice || stock.basePrice);
      }

      // Notify via socket so all tabs of this user get updated
      if (socketRef.current?.connected) {
        socketRef.current.emit("joinUser", { email: user.email });
      }

      addToast("success", "Subscribed!", `Now watching ${ticker} live updates.`);
    } catch (err) {
      addToast("error", "Subscription Failed", err.message);
    } finally {
      setLoadingTicker(null);
    }
  }, [user.email, stocks, addToast]);

  // ─── Unsubscribe ──────────────────────────────────────────────────────────────

  const handleUnsubscribe = useCallback(async (ticker) => {
    setUnsubLoadingTicker(ticker);
    try {
      const updatedSubs = await unsubscribeFromStock(user.email, ticker);
      setSubscriptions(updatedSubs);

      // Clear chart history + live price for this ticker
      clearPriceHistory(ticker);
      setLivePrices((prev) => {
        const next = { ...prev };
        delete next[ticker];
        return next;
      });

      addToast("info", "Removed", `${ticker} removed from your watchlist.`);
    } catch (err) {
      addToast("error", "Error", err.message);
    } finally {
      setUnsubLoadingTicker(null);
    }
  }, [user.email, addToast]);

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (pageLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 16 }}>
        <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
        <span style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>Loading your dashboard…</span>
      </div>
    );
  }

  return (
    <>
      <Header
        user={user}
        connectionStatus={connectionStatus}
        onLogout={handleLogout}
      />

      <main className="dashboard-wrapper" role="main">
        {/* Disclaimer */}
        <div className="dashboard-disclaimer" role="note">
          ⚠️ <strong>Disclaimer:</strong> Prices are <em>simulated</em> for assignment/demo purposes only. Not real market data.
        </div>

        <div className="dashboard-main-grid">
          {/* Left Column */}
          <div className="dashboard-left-col">
            <MarketOverview
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
          </div>

          {/* Right Column — Live Stock Cards */}
          <div className="stock-cards-section">
            <div className="stock-cards-header">
              <h3>Live Watchlist</h3>
              <span className="stock-cards-count">
                {subscriptions.length > 0
                  ? `${subscriptions.length} stock${subscriptions.length !== 1 ? "s" : ""} tracked`
                  : "No stocks tracked"}
              </span>
            </div>

            {subscriptions.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="stock-cards-grid">
                {subscriptions.map((ticker) => {
                  const stockInfo = stocks.find((s) => s.ticker === ticker);
                  const price = livePrices[ticker];

                  // Build a display object — use live price if available, fallback to stock info
                  const displayData = price || (stockInfo
                    ? {
                        ticker,
                        name: stockInfo.name,
                        sector: stockInfo.sector,
                        price: stockInfo.currentPrice || stockInfo.basePrice,
                        previousPrice: stockInfo.currentPrice || stockInfo.basePrice,
                        change: 0,
                        changePercent: 0,
                        direction: "flat",
                        timestamp: new Date().toISOString(),
                      }
                    : null);

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
      </main>
    </>
  );
}
