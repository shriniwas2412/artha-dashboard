/**
 * Artha — Formatters Utility
 * Handles USD and INR formatting.
 */

export function formatPrice(price, currency = "USD") {
  if (price === null || price === undefined || isNaN(price)) return "—";
  if (currency === "INR") {
    return (
      "₹" +
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price)
    );
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatChange(change, currency = "USD") {
  if (change === null || change === undefined || isNaN(change)) return "0.00";
  const abs = Math.abs(change).toFixed(2);
  const prefix = currency === "INR" ? "₹" : "$";
  const sign = change >= 0 ? "+" : "-";
  return `${sign}${prefix}${abs}`;
}

export function formatPercent(pct) {
  if (pct === null || pct === undefined || isNaN(pct)) return "0.00%";
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function formatTimestamp(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function currencySymbol(currency = "USD") {
  return currency === "INR" ? "₹" : "$";
}
