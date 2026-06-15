/**
 * PulseTrade — Stock Routes
 * GET /api/stocks
 */

const express = require("express");
const router = express.Router();
const { SUPPORTED_STOCKS } = require("../config/constants");
const { currentPrices } = require("../services/stockPriceService");

/**
 * GET /api/stocks
 * Returns all supported stocks with their current simulated prices.
 */
router.get("/", (req, res) => {
  try {
    const stocks = SUPPORTED_STOCKS.map((stock) => {
      const priceData = currentPrices[stock.ticker];
      return {
        ticker: stock.ticker,
        name: stock.name,
        sector: stock.sector,
        exchange: stock.exchange,
        currency: stock.currency,
        flag: stock.flag,
        basePrice: stock.basePrice,
        currentPrice: priceData ? priceData.price : stock.basePrice,
      };
    });

    return res.status(200).json({
      success: true,
      stocks,
    });
  } catch (err) {
    console.error("[StockRoutes] Error fetching stocks:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stock list.",
    });
  }
});

module.exports = router;
