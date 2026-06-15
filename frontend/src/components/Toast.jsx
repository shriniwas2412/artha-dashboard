import React from "react";

const TOAST_CONFIG = {
  success: { icon: "✅", title: "Success" },
  error: { icon: "❌", title: "Error" },
  info: { icon: "ℹ️", title: "Info" },
  warning: { icon: "⚠️", title: "Warning" },
};

/**
 * Toast — single notification item.
 */
function ToastItem({ toast, onRemove }) {
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;

  return (
    <div
      className={`toast toast-${toast.type}`}
      role="alert"
      aria-live="assertive"
      id={toast.id}
    >
      <span className="toast-icon" aria-hidden="true">{config.icon}</span>
      <div className="toast-content">
        <div className="toast-title">{toast.title || config.title}</div>
        {toast.message && <div className="toast-message">{toast.message}</div>}
      </div>
      <button
        className="toast-close"
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

/**
 * Toast container — renders all active toast notifications.
 */
export default function Toast({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
