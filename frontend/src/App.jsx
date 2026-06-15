import React, { useState, useCallback, useEffect } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Tutorial from "./components/Tutorial.jsx";
import Toast from "./components/Toast.jsx";
import Chatbot from "./components/Chatbot.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [toasts, setToasts] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("artha_theme") || "dark");

  // Apply theme attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("artha_theme", theme);
  }, [theme]);

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem("artha_email");
    if (saved) setUser({ email: saved });
  }, []);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  const addToast = useCallback((type, title, message, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const handleLogin = useCallback((loggedInUser) => {
    localStorage.setItem("artha_email", loggedInUser.email);
    setUser(loggedInUser);
    addToast("success", "Signed in", `Welcome, ${loggedInUser.email}`);
    // Show tutorial only on first login
    if (!localStorage.getItem("artha_tutorial_done")) {
      setShowTutorial(true);
    }
  }, [addToast]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("artha_email");
    setUser(null);
    addToast("info", "Signed out", "Session cleared.");
  }, [addToast]);

  const closeTutorial = useCallback(() => {
    localStorage.setItem("artha_tutorial_done", "1");
    setShowTutorial(false);
  }, []);

  const openTutorial = useCallback(() => setShowTutorial(true), []);

  return (
    <>
      {!user ? (
        <Login
          onLogin={handleLogin}
          addToast={addToast}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          addToast={addToast}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenTutorial={openTutorial}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      )}

      {showTutorial && (
        <Tutorial onClose={closeTutorial} onSkip={closeTutorial} />
      )}

      {user && <Chatbot />}
      
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}
