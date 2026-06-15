/**
 * PulseTrade — Price History Utility
 * Maintains rolling price history per stock for live Recharts charts.
 */

// Maximum number of data points to keep per ticker
const MAX_HISTORY_POINTS = 30;

// In-memory store: ticker -> array of { time, price }
const priceHistory = {};

/**
 * Add a new price point for a ticker.
 * Keeps only the last MAX_HISTORY_POINTS entries.
 * @param {string} ticker
 * @param {number} price
 * @param {string} timestamp - ISO string
 */
export function addPricePoint(ticker, price, timestamp) {
  if (!priceHistory[ticker]) {
    priceHistory[ticker] = [];
  }

  const timeLabel = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  priceHistory[ticker].push({ time: timeLabel, price });

  if (priceHistory[ticker].length > MAX_HISTORY_POINTS) {
    priceHistory[ticker].shift();
  }
}

/**
 * Get the price history for a ticker.
 * Returns an empty array if no data exists yet.
 * @param {string} ticker
 * @returns {{ time: string, price: number }[]}
 */
export function getPriceHistory(ticker) {
  return priceHistory[ticker] || [];
}

/**
 * Clear history for a ticker (e.g. on unsubscribe).
 * @param {string} ticker
 */
export function clearPriceHistory(ticker) {
  delete priceHistory[ticker];
}

/**
 * Seed initial price history for a ticker when first subscribed.
 * Creates a smooth starting baseline using the current price.
 * @param {string} ticker
 * @param {number} currentPrice
 */
export function seedPriceHistory(ticker, currentPrice) {
  if (!priceHistory[ticker] || priceHistory[ticker].length === 0) {
    priceHistory[ticker] = [];
    const now = Date.now();
    for (let i = MAX_HISTORY_POINTS - 1; i >= 0; i--) {
      const t = new Date(now - i * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      // Small variation around current price to avoid flat line
      const variation = currentPrice * (Math.random() * 0.004 - 0.002);
      priceHistory[ticker].push({ time: t, price: Math.round((currentPrice + variation) * 100) / 100 });
    }
  }
}
