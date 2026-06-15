import React, { useState, useRef, useEffect } from "react";

const BotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I am Artha Assistant. I can help you understand market metrics or explain how the dashboard works." }
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: input }]);
    const query = input.toLowerCase();
    setInput("");

    setTimeout(() => {
      let reply = "I am a demo assistant. You can ask me about 'Artha', 'markets', or 'features'.";
      if (query.includes("artha") || query.includes("meaning")) {
        reply = "Artha is a Sanskrit word meaning wealth, purpose, and prosperity. It signifies that markets and wealth generation have a deeper meaning!";
      } else if (query.includes("market") || query.includes("stock")) {
        reply = "This dashboard tracks 10 stocks across NASDAQ (USD) and NSE (INR). Prices update algorithmically every second.";
      } else if (query.includes("feature")) {
        reply = "Features include real-time WebSockets, multi-user isolation, dark/light mode, and simulated random-walk pricing.";
      }
      setMessages(prev => [...prev, { role: "bot", text: reply }]);
    }, 600);
  };

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><BotIcon /> Artha Assistant</span>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "0" }}><CloseIcon /></button>
          </div>
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form className="chat-input-area" onSubmit={handleSend}>
            <input
              type="text"
              className="chat-input"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: "8px" }}><SendIcon /></button>
          </form>
        </div>
      )}
      {!open && (
        <button className="chat-btn" onClick={() => setOpen(true)} title="Chat with Artha Assistant">
          <BotIcon />
        </button>
      )}
    </div>
  );
}
