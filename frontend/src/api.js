/**
 * PulseTrade — API Helper
 * Centralized REST API calls to the backend.
 */

const API_URL = import.meta.env.VITE_API_URL || "https://artha-dashboard.onrender.com";

/**
 * Login with email. Creates user if new.
 * @param {string} email
 */
export async function loginUser(email) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Login failed.");
  return data.user;
}

/**
 * Fetch the list of all supported stocks.
 */
export async function fetchStocks() {
  const res = await fetch(`${API_URL}/api/stocks`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to fetch stocks.");
  return data.stocks;
}

/**
 * Fetch subscriptions for a given user email.
 * @param {string} email
 */
export async function fetchSubscriptions(email) {
  const res = await fetch(`${API_URL}/api/subscriptions/${encodeURIComponent(email)}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to fetch subscriptions.");
  return data.subscriptions;
}

/**
 * Subscribe a user to a stock ticker.
 * @param {string} email
 * @param {string} ticker
 */
export async function subscribeToStock(email, ticker) {
  const res = await fetch(`${API_URL}/api/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, ticker }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Subscription failed.");
  return data.subscriptions;
}

/**
 * Unsubscribe a user from a stock ticker.
 * @param {string} email
 * @param {string} ticker
 */
export async function unsubscribeFromStock(email, ticker) {
  const res = await fetch(`${API_URL}/api/subscriptions`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, ticker }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Unsubscription failed.");
  return data.subscriptions;
}

/**
 * Check backend health.
 */
export async function checkHealth() {
  const res = await fetch(`${API_URL}/health`);
  return res.ok;
}

export { API_URL };
