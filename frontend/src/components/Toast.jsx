import React from "react";

// Indicator colors per toast type
const TYPES = {
  success: { title: "Success" },
  error:   { title: "Error" },
  info:    { title: "Info" },
  warning: { title: "Warning" },
};

function ToastItem({ toast, onRemove }) {
  return (
    <div className={`toast toast-${toast.type}`} role="alert" aria-live="assertive" id={toast.id}>
      <div className="toast-body">
        <div className="toast-title">{toast.title || TYPES[toast.type]?.title}</div>
        {toast.message && <div className="toast-msg">{toast.message}</div>}
      </div>
      <button className="toast-close" onClick={() => onRemove(toast.id)} aria-label="Dismiss">
        &times;
      </button>
    </div>
  );
}

export default function Toast({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
