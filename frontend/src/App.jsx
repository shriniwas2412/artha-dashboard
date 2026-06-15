import React, { useState, useEffect, useCallback } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Toast from "./components/Toast.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("pulsetrade_email");
    if (savedEmail) {
      setUser({ email: savedEmail });
    }
  }, []);

  const addToast = useCallback((type, title, message, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleLogin = useCallback((loggedInUser) => {
    localStorage.setItem("pulsetrade_email", loggedInUser.email);
    setUser(loggedInUser);
    addToast("success", "Welcome back!", `Logged in as ${loggedInUser.email}`);
  }, [addToast]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("pulsetrade_email");
    setUser(null);
    addToast("info", "Logged out", "Your session has been cleared.");
  }, [addToast]);

  return (
    <>
      {!user ? (
        <Login onLogin={handleLogin} addToast={addToast} />
      ) : (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          addToast={addToast}
        />
      )}
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}
