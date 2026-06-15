/**
 * PulseTrade — Auth Routes
 * POST /api/auth/login
 */

const express = require("express");
const router = express.Router();
const { isValidEmail } = require("../utils/validators");
const { getOrCreateUser } = require("../services/userService");

/**
 * POST /api/auth/login
 * Body: { email: string }
 * Returns the user object with their current subscriptions.
 */
router.post("/login", (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const user = getOrCreateUser(email);

    console.log(`[Auth] Login: ${user.email}`);

    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        subscriptions: user.subscriptions,
      },
    });
  } catch (err) {
    console.error("[Auth] Login error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
});

module.exports = router;
