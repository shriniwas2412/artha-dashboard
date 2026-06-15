/**
 * Artha — Application Constants
 * 10 stocks: 5 NASDAQ (US) + 5 NSE (India)
 */

const SUPPORTED_STOCKS = [
  // ── US Markets (NASDAQ) ────────────────────────────────
  {
    ticker: "GOOG",
    name: "Alphabet Inc.",
    sector: "Technology",
    exchange: "NASDAQ",
    currency: "USD",
    flag: "US",
    basePrice: 170,
    volatility: 3.5,
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    sector: "Electric Vehicles",
    exchange: "NASDAQ",
    currency: "USD",
    flag: "US",
    basePrice: 250,
    volatility: 7,
  },
  {
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    sector: "E-Commerce / Cloud",
    exchange: "NASDAQ",
    currency: "USD",
    flag: "US",
    basePrice: 190,
    volatility: 4,
  },
  {
    ticker: "META",
    name: "Meta Platforms Inc.",
    sector: "Social Media / AI",
    exchange: "NASDAQ",
    currency: "USD",
    flag: "US",
    basePrice: 500,
    volatility: 6,
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Semiconductors / AI",
    exchange: "NASDAQ",
    currency: "USD",
    flag: "US",
    basePrice: 950,
    volatility: 12,
  },

  // ── Indian Markets (NSE) ───────────────────────────────
  {
    ticker: "RELIANCE",
    name: "Reliance Industries Ltd.",
    sector: "Energy / Conglomerate",
    exchange: "NSE",
    currency: "INR",
    flag: "IN",
    basePrice: 2850,
    volatility: 5,
  },
  {
    ticker: "TCS",
    name: "Tata Consultancy Services",
    sector: "Technology",
    exchange: "NSE",
    currency: "INR",
    flag: "IN",
    basePrice: 3650,
    volatility: 4,
  },
  {
    ticker: "INFY",
    name: "Infosys Limited",
    sector: "Technology",
    exchange: "NSE",
    currency: "INR",
    flag: "IN",
    basePrice: 1580,
    volatility: 5,
  },
  {
    ticker: "HDFCBANK",
    name: "HDFC Bank Limited",
    sector: "Banking / Finance",
    exchange: "NSE",
    currency: "INR",
    flag: "IN",
    basePrice: 1720,
    volatility: 4,
  },
  {
    ticker: "WIPRO",
    name: "Wipro Limited",
    sector: "Technology",
    exchange: "NSE",
    currency: "INR",
    flag: "IN",
    basePrice: 480,
    volatility: 6,
  },
];

const VALID_TICKERS = SUPPORTED_STOCKS.map((s) => s.ticker);
const PRICE_UPDATE_INTERVAL_MS = 1000;

module.exports = { SUPPORTED_STOCKS, VALID_TICKERS, PRICE_UPDATE_INTERVAL_MS };
