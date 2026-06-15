/**
 * PulseTrade — Stock Price Service
 * Generates realistic simulated stock price movements.
 * Maintains in-memory current prices and emits updates via Socket.IO.
 */

const { SUPPORTED_STOCKS, PRICE_UPDATE_INTERVAL_MS } = require("../config/constants");
const { findUser } = require("./userService");

// In-memory price state for all stocks
const currentPrices = {};

// Initialize prices from base values
SUPPORTED_STOCKS.forEach((stock) => {
  currentPrices[stock.ticker] = {
    ...stock,
    price: stock.basePrice,
    previousPrice: stock.basePrice,
    change: 0,
    changePercent: 0,
    direction: "flat",
    timestamp: new Date().toISOString(),
  };
});

/**
 * Generate next price for a stock using small random walk.
 * Keeps price near the base with bounded volatility.
 * @param {string} ticker
 * @returns {Object} Updated price data object
 */
function generateNextPrice(ticker) {
  const current = currentPrices[ticker];
  const stock = SUPPORTED_STOCKS.find((s) => s.ticker === ticker);

  // Random walk: small percentage change within volatility bounds
  const maxMovement = stock.volatility / 100; // e.g., 3.5% max swing
  const randomFactor = (Math.random() * 2 - 1) * maxMovement; // -volatility% to +volatility%

  // Mean-reversion: gently pull price back towards base price
  const meanReversionStrength = 0.002;
  const meanReversionPull = (stock.basePrice - current.price) * meanReversionStrength;

  const newPrice = Math.max(
    stock.basePrice * 0.7, // floor: never below 70% of base
    Math.min(
      stock.basePrice * 1.3, // ceiling: never above 130% of base
      current.price * (1 + randomFactor) + meanReversionPull
    )
  );

  const roundedPrice = Math.round(newPrice * 100) / 100;
  const change = Math.round((roundedPrice - current.price) * 100) / 100;
  const changePercent =
    Math.round(((roundedPrice - current.price) / current.price) * 10000) / 100;

  let direction = "flat";
  if (change > 0.001) direction = "up";
  else if (change < -0.001) direction = "down";

  const updated = {
    ticker: stock.ticker,
    name: stock.name,
    sector: stock.sector,
    price: roundedPrice,
    previousPrice: current.price,
    change,
    changePercent,
    direction,
    timestamp: new Date().toISOString(),
  };

  currentPrices[ticker] = {
    ...current,
    ...updated,
  };

  return updated;
}

/**
 * Get current price data for a specific ticker.
 * @param {string} ticker
 * @returns {Object}
 */
function getCurrentPrice(ticker) {
  return currentPrices[ticker] || null;
}

/**
 * Start the price broadcast loop.
 * Every second, generates updated prices and emits to each user's room
 * only the stocks they are subscribed to.
 * @param {Object} io - Socket.IO server instance
 * @param {Map} connectedUsers - Map of email -> Set of socket IDs
 */
function startPriceBroadcast(io, connectedUsers) {
  console.log("[StockPriceService] Starting price broadcast every 1 second...");

  setInterval(() => {
    // Generate updated prices for ALL stocks
    const updatedPrices = {};
    SUPPORTED_STOCKS.forEach((stock) => {
      updatedPrices[stock.ticker] = generateNextPrice(stock.ticker);
    });

    // For each connected user, send only their subscribed stocks
    connectedUsers.forEach((socketIds, email) => {
      if (socketIds.size === 0) return;

      const user = findUser(email);
      if (!user || !user.subscriptions || user.subscriptions.length === 0) return;

      user.subscriptions.forEach((ticker) => {
        const priceData = updatedPrices[ticker];
        if (priceData) {
          io.to(`user:${email}`).emit("stock:update", priceData);
        }
      });
    });
  }, PRICE_UPDATE_INTERVAL_MS);
}

module.exports = { startPriceBroadcast, getCurrentPrice, currentPrices };
