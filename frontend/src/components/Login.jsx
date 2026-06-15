import React, { useState } from "react";
import { loginUser } from "../api.js";

export default function Login({ onLogin, addToast }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (val) => {
    if (!val.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return "Please enter a valid email address.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = await loginUser(email.trim().toLowerCase());
      onLogin(user);
    } catch (err) {
      const msg = err.message || "Failed to connect to the server. Is the backend running?";
      setError(msg);
      addToast("error", "Login Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setError("");
  };

  return (
    <div className="login-wrapper">
      {/* Background orbs */}
      <div className="login-bg-orb login-bg-orb-1" />
      <div className="login-bg-orb login-bg-orb-2" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">📈</div>
          <div className="login-logo-text">
            <h1>PulseTrade</h1>
            <p>Real-Time Stock Subscription Dashboard</p>
          </div>
        </div>

        <div className="login-divider" />

        {/* Form */}
        <div className="login-form">
          <h2>Sign In</h2>
          <p>Enter your email to access your personal stock dashboard.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className={`input${error ? " error" : ""}`}
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                autoComplete="email"
                autoFocus
                disabled={loading}
              />
              {error && (
                <div className="error-text">
                  <span>⚠</span> {error}
                </div>
              )}
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Signing in…
                </>
              ) : (
                <>Sign In →</>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="login-demo-hint">
            <strong>🧪 Multi-user demo:</strong> Open two separate browsers (or one incognito) and login with different accounts:
            <br />
            <br />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
              {["user1@example.com", "user2@example.com"].map((demoEmail) => (
                <button
                  key={demoEmail}
                  type="button"
                  id={`demo-btn-${demoEmail.split("@")[0]}`}
                  onClick={() => handleDemoLogin(demoEmail)}
                  style={{
                    background: "rgba(61, 126, 255, 0.1)",
                    border: "1px solid rgba(61, 126, 255, 0.25)",
                    color: "#3d7eff",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(61, 126, 255, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(61, 126, 255, 0.1)";
                  }}
                >
                  {demoEmail}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
