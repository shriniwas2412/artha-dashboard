/**
 * PulseTrade — Formatters Utility
 * Number and date formatting helpers.
 */

/**
 * Format a number as a USD price string.
 * @param {number} price
 * @returns {string} e.g. "$245.67"
 */
export function formatPrice(price) {
  if (price === null || price === undefined || isNaN(price)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Format a price change value with sign.
 * @param {number} change
 * @returns {string} e.g. "+1.45" or "-2.30"
 */
export function formatChange(change) {
  if (change === null || change === undefined || isNaN(change)) return "0.00";
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}`;
}

/**
 * Format a percentage change value with sign.
 * @param {number} pct
 * @returns {string} e.g. "+0.59%" or "-1.20%"
 */
export function formatPercent(pct) {
  if (pct === null || pct === undefined || isNaN(pct)) return "0.00%";
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

/**
 * Format an ISO timestamp to a human-readable time string.
 * @param {string} isoString
 * @returns {string} e.g. "03:42:07 PM"
 */
export function formatTimestamp(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
