/**
 * PulseTrade — Subscription Routes
 * GET    /api/subscriptions/:email
 * POST   /api/subscriptions
 * DELETE /api/subscriptions
 */

const express = require("express");
const router = express.Router();
const { isValidEmail, isValidTicker } = require("../utils/validators");
const { findUser, getOrCreateUser, addSubscription, removeSubscription } = require("../services/userService");
const { VALID_TICKERS } = require("../config/constants");

/**
 * GET /api/subscriptions/:email
 * Returns the user's current subscriptions.
 */
router.get("/:email", (req, res) => {
  try {
    const { email } = req.params;

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    const user = findUser(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please login first.",
      });
    }

    return res.status(200).json({
      success: true,
      subscriptions: user.subscriptions,
    });
  } catch (err) {
    console.error("[SubscriptionRoutes] GET error:", err.message);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

/**
 * POST /api/subscriptions
 * Body: { email, ticker }
 * Subscribes the user to a stock ticker.
 */
router.post("/", (req, res) => {
  try {
    const { email, ticker } = req.body;

    if (!email || !ticker) {
      return res.status(400).json({
        success: false,
        message: "Email and ticker are required.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    const normalizedTicker = ticker.toUpperCase().trim();
    if (!isValidTicker(normalizedTicker, VALID_TICKERS)) {
      return res.status(400).json({
        success: false,
        message: `Ticker "${normalizedTicker}" is not supported. Supported: ${VALID_TICKERS.join(", ")}`,
      });
    }

    // Ensure user exists before subscribing
    getOrCreateUser(email);
    const updatedSubscriptions = addSubscription(email, normalizedTicker);

    console.log(`[Subscriptions] ${email} subscribed to ${normalizedTicker}`);

    return res.status(200).json({
      success: true,
      message: `Subscribed to ${normalizedTicker}`,
      subscriptions: updatedSubscriptions,
    });
  } catch (err) {
    console.error("[SubscriptionRoutes] POST error:", err.message);
    return res.status(500).json({ success: false, message: err.message || "Internal server error." });
  }
});

/**
 * DELETE /api/subscriptions
 * Body: { email, ticker }
 * Unsubscribes the user from a stock ticker.
 */
router.delete("/", (req, res) => {
  try {
    const { email, ticker } = req.body;

    if (!email || !ticker) {
      return res.status(400).json({
        success: false,
        message: "Email and ticker are required.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    const normalizedTicker = ticker.toUpperCase().trim();
    if (!isValidTicker(normalizedTicker, VALID_TICKERS)) {
      return res.status(400).json({
        success: false,
        message: `Ticker "${normalizedTicker}" is not supported.`,
      });
    }

    const user = findUser(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const updatedSubscriptions = removeSubscription(email, normalizedTicker);

    console.log(`[Subscriptions] ${email} unsubscribed from ${normalizedTicker}`);

    return res.status(200).json({
      success: true,
      message: `Unsubscribed from ${normalizedTicker}`,
      subscriptions: updatedSubscriptions,
    });
  } catch (err) {
    console.error("[SubscriptionRoutes] DELETE error:", err.message);
    return res.status(500).json({ success: false, message: err.message || "Internal server error." });
  }
});

module.exports = router;
