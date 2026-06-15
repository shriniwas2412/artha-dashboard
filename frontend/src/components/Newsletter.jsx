import React, { useState } from "react";

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(() => !!localStorage.getItem("artha_newsletter"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("artha_newsletter", email.trim());
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="newsletter-section card">
      <div className="newsletter-text">
        <div className="newsletter-title">Stay ahead of the markets</div>
        <div className="newsletter-sub">
          Get weekly insights, market summaries, and updates delivered to your inbox.
        </div>
      </div>

      {submitted ? (
        <div className="newsletter-success">
          <CheckIcon />
          You're subscribed — thank you!
        </div>
      ) : (
        <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <input
              id="newsletter-email"
              type="email"
              className="newsletter-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              disabled={loading}
              autoComplete="email"
            />
            {error && <span style={{ fontSize: "0.75rem", color: "var(--red)", marginTop: 2 }}>{error}</span>}
          </div>
          <button
            id="newsletter-submit"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ height: 38, alignSelf: "flex-start" }}
          >
            {loading ? <span className="spinner" /> : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}
