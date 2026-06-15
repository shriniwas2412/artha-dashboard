/**
 * PulseTrade — Application Constants
 * Defines supported stocks and configuration values.
 */

const SUPPORTED_STOCKS = [
  {
    ticker: "GOOG",
    name: "Alphabet Inc.",
    sector: "Technology",
    basePrice: 170,
    volatility: 3.5,
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    sector: "Automotive / EV",
    basePrice: 250,
    volatility: 7,
  },
  {
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    sector: "E-Commerce / Cloud",
    basePrice: 190,
    volatility: 4,
  },
  {
    ticker: "META",
    name: "Meta Platforms Inc.",
    sector: "Social / AI",
    basePrice: 500,
    volatility: 6,
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Semiconductors / AI",
    basePrice: 950,
    volatility: 12,
  },
];

const VALID_TICKERS = SUPPORTED_STOCKS.map((s) => s.ticker);

const PRICE_UPDATE_INTERVAL_MS = 1000; // 1 second

module.exports = {
  SUPPORTED_STOCKS,
  VALID_TICKERS,
  PRICE_UPDATE_INTERVAL_MS,
};
