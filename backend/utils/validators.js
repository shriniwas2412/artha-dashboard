/**
 * PulseTrade — Input Validators
 * Shared validation helpers for API request payloads.
 */

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates that a ticker is one of the supported tickers.
 * @param {string} ticker
 * @param {string[]} validTickers
 * @returns {boolean}
 */
function isValidTicker(ticker, validTickers) {
  if (!ticker || typeof ticker !== "string") return false;
  return validTickers.includes(ticker.toUpperCase().trim());
}

module.exports = { isValidEmail, isValidTicker };
