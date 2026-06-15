import React, { useState, useEffect, useCallback } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Toast from "./components/Toast.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("pulsetrade_theme") || "dark";
  });

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pulsetrade_theme", theme);
  }, [theme]);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("pulsetrade_email");
    if (savedEmail) {
      setUser({ email: savedEmail });
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const addToast = useCallback((type, title, message, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleLogin = useCallback(
    (loggedInUser) => {
      localStorage.setItem("pulsetrade_email", loggedInUser.email);
      setUser(loggedInUser);
      addToast("success", "Signed in", `Welcome, ${loggedInUser.email}`);
    },
    [addToast]
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem("pulsetrade_email");
    setUser(null);
    addToast("info", "Signed out", "Your session has been cleared.");
  }, [addToast]);

  return (
    <>
      {!user ? (
        <Login onLogin={handleLogin} addToast={addToast} theme={theme} onToggleTheme={toggleTheme} />
      ) : (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          addToast={addToast}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}
