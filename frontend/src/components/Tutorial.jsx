import React, { useState } from "react";

/* ── SVG Icons ── */
const Icon = {
  Welcome: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--accent-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 22 10 22 13 10 19 26 22 16 26 16 30 16" />
      <circle cx="16" cy="4" r="2" fill="var(--accent-text)" stroke="none" />
    </svg>
  ),
  SignIn: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--accent-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="24" height="18" rx="3" />
      <polyline points="4 12 16 20 28 12" />
    </svg>
  ),
  Stocks: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--accent-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="18" width="6" height="10" rx="1" />
      <rect x="13" y="10" width="6" height="18" rx="1" />
      <rect x="22" y="4" width="6" height="24" rx="1" />
    </svg>
  ),
  Live: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--accent-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16a9 9 0 0 1 18 0" />
      <path d="M3 16a13 13 0 0 1 26 0" />
      <circle cx="16" cy="16" r="3" fill="var(--accent-text)" stroke="none" />
    </svg>
  ),
  MultiUser: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--accent-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="10" r="4" />
      <path d="M3 26c0-4.4 3.6-8 8-8" />
      <circle cx="21" cy="10" r="4" />
      <path d="M21 18c4.4 0 8 3.6 8 8" />
      <line x1="16" y1="14" x2="16" y2="22" strokeDasharray="2 2" />
    </svg>
  ),
  Info: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const STEPS = [
  {
    icon: <Icon.Welcome />,
    badge: "Step 1 of 5 — Welcome",
    title: "Welcome to Artha",
    desc: "Artha is a real-time stock subscription platform that tracks live simulated prices from US (NASDAQ) and Indian (NSE) markets. Your personalised dashboard updates every second — no page refresh needed.",
    tip: "Artha is a Sanskrit word meaning wealth, purpose, and prosperity. Markets are more than numbers — they have meaning.",
  },
  {
    icon: <Icon.SignIn />,
    badge: "Step 2 of 5 — Authentication",
    title: "Sign In with Email",
    desc: "Enter any valid email address to create or restore your personal dashboard. No password is required. Your watchlist and preferences are automatically saved and restored on every visit.",
    tip: "Try user1@example.com and user2@example.com in two different browsers to test the multi-user real-time isolation.",
  },
  {
    icon: <Icon.Stocks />,
    badge: "Step 3 of 5 — Stocks",
    title: "Choose Your Stocks",
    desc: "Browse 10 stocks across two markets — 5 from NASDAQ (priced in USD) and 5 from NSE India (priced in INR). Click Watch on any stock to add it to your live watchlist. You can add or remove stocks anytime.",
    tip: "Use the All / US / India tabs in the Watchlist panel to filter by market.",
  },
  {
    icon: <Icon.Live />,
    badge: "Step 4 of 5 — Live Feed",
    title: "Real-Time Price Updates",
    desc: "Your subscribed stocks update every second via WebSocket (Socket.IO). Prices move using a realistic mean-reversion random walk algorithm. Each card shows the current price, session high/low, and a 30-point live chart.",
    tip: "Prices are simulated for this demo — not real market data. The algorithm keeps prices realistic and bounded.",
  },
  {
    icon: <Icon.MultiUser />,
    badge: "Step 5 of 5 — Multi-User",
    title: "Test Two-User Mode",
    desc: "Open Artha in two different browsers simultaneously. Sign in as different users and subscribe to different stocks. Each dashboard updates independently — user1 only receives their stocks, user2 only receives theirs.",
    tip: "This is powered by Socket.IO user rooms. Each user joins room user:<email> and receives only their subscribed stock updates.",
  },
];

export default function Tutorial({ onClose, onSkip }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="tutorial-overlay" role="dialog" aria-modal="true" aria-label="Artha tutorial">
      <div className="tutorial-modal">
        {/* Progress bar */}
        <div className="tutorial-progress-bar">
          <div
            className="tutorial-progress-fill"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="tutorial-body">
          <div className="tutorial-icon-wrap">{current.icon}</div>
          <div className="tutorial-step-badge">{current.badge}</div>
          <h2 className="tutorial-title">{current.title}</h2>
          <p className="tutorial-desc">{current.desc}</p>
          {current.tip && (
            <div className="tutorial-tip">
              <span className="tutorial-tip-icon"><Icon.Info /></span>
              {current.tip}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="tutorial-footer">
          {/* Dots */}
          <div className="tutorial-dots">
            {STEPS.map((_, i) => (
              <button
                key={i}
                className={`tutorial-dot${i === step ? " active" : i < step ? " done" : ""}`}
                onClick={() => setStep(i)}
                style={{ border: "none", cursor: "pointer", padding: 0 }}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="tutorial-nav">
            <button className="btn btn-ghost" style={{ fontSize: "0.8125rem" }} onClick={onSkip}>
              Skip
            </button>
            {step > 0 && (
              <button className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
            <button
              id={isLast ? "tutorial-start-btn" : "tutorial-next-btn"}
              className="btn btn-primary"
              onClick={() => (isLast ? onClose() : setStep((s) => s + 1))}
            >
              {isLast ? "Start Now" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
