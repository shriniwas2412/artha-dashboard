# 📈 PulseTrade — Real-Time Stock Subscription Dashboard

> A polished real-time stock subscription dashboard built with React, Node.js, Express, and Socket.IO.

---

## 🌐 Live Demo

| Link | URL |
|------|-----|
| **Frontend (Vercel)** | _Add after Vercel deployment_ |
| **Backend Health** | _Add after Render/Railway deployment_ |

---

## ✅ Assignment Checklist

| Requirement | Status |
|---|---|
| Email login | ✅ Done |
| 5 supported stocks (GOOG, TSLA, AMZN, META, NVDA) | ✅ Done |
| Subscribe / unsubscribe per user | ✅ Done |
| Real-time price updates every second | ✅ Done |
| No page refresh required | ✅ Done |
| Two-user async support | ✅ Done |
| Simulated realistic price generator | ✅ Done |
| File-based JSON storage | ✅ Done |
| GitHub-ready README | ✅ Done |
| Vercel frontend deployment ready | ✅ Done |
| Render/Railway backend deployment ready | ✅ Done |

---

## ✨ Features

- **Email-based login** — no password required, user created on first login
- **Per-user watchlist** — each user has isolated subscriptions stored in JSON
- **Real-time stock updates** — Socket.IO pushes price updates every 1 second
- **Multi-user isolation** — user1 sees only their stocks, user2 sees only theirs
- **Simulated realistic price movement** — mean-reverting random walk algorithm
- **Mini live charts** — Recharts LineChart with rolling 30-point price history
- **Connection status tracking** — live badge showing Connected / Connecting / Offline
- **Responsive dark fintech UI** — glassmorphism panels, premium typography, animations
- **Toast notifications** — subscribe, unsubscribe, login, error events
- **Session persistence** — localStorage restores login on page refresh
- **Deployment-ready architecture** — Vercel frontend + Render backend

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool + dev server |
| Socket.IO Client | Real-time bidirectional communication |
| Recharts | Live mini price charts |
| Plain CSS | Premium dark fintech design system |
| Vercel | Hosting |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API server |
| Socket.IO | WebSocket server |
| CORS | Cross-origin request handling |
| JSON File Storage | Lightweight user + subscription persistence |
| Render / Railway | Hosting |

---

## 🏗 Architecture

```
[React + Vite Frontend]
        |
        | REST API (login, stocks, subscriptions)
        | Socket.IO (real-time price updates)
        v
[Node.js + Express Backend]
        |
        v
[JSON File Storage (users.json)]
```

### Flow Explanation

1. **User logs in** → `POST /api/auth/login` creates or retrieves user from `users.json`
2. **Frontend connects Socket.IO** → emits `joinUser` → backend joins socket to `user:<email>` room
3. **User subscribes to a stock** → `POST /api/subscriptions` saves to JSON → socket re-joins
4. **Price broadcast loop** runs every 1 second on the backend, emitting `stock:update` only to rooms of users subscribed to each stock
5. **Frontend receives** `stock:update` → updates React state → re-renders StockCard + MiniChart

---

## 🚀 Local Setup (Recommended)

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/shriniwas2412/pulsetrade-stock-dashboard.git
cd pulsetrade-stock-dashboard

# 2. Install all dependencies (root + backend + frontend)
npm run install-all

# 3. Copy the environment file
cp frontend/.env.example frontend/.env

# 4. Start both servers simultaneously
npm run dev
```

This starts:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:5173`

---

## 🔧 Manual Setup (Alternative)

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

### Backend (set in your terminal or `.env` file)

```env
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

## 👥 Two-User Testing Flow

Test the real-time multi-user isolation:

**Step 1:** Open `http://localhost:5173` in your normal browser  
**Step 2:** Login as `user1@example.com`  
**Step 3:** Subscribe to **TSLA** and **NVDA**  
**Step 4:** Open an incognito window (or a different browser)  
**Step 5:** Open the same URL `http://localhost:5173`  
**Step 6:** Login as `user2@example.com`  
**Step 7:** Subscribe to **GOOG** and **META**  

**Expected result:**
- `user1` dashboard shows **only TSLA and NVDA** updating every second
- `user2` dashboard shows **only GOOG and META** updating every second
- Both update independently without any page refresh

---

## 📡 REST API Documentation

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "PulseTrade API is running",
  "timestamp": "2026-06-15T15:30:00.000Z",
  "connectedUsers": 2
}
```

---

### Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "email": "user@example.com",
    "subscriptions": []
  }
}
```

**Validation:**
- `email` is required
- `email` must be a valid format

---

### Get All Stocks

```
GET /api/stocks
```

**Response:**
```json
{
  "success": true,
  "stocks": [
    {
      "ticker": "GOOG",
      "name": "Alphabet Inc.",
      "sector": "Technology",
      "basePrice": 170,
      "currentPrice": 172.35
    }
  ]
}
```

---

### Get User Subscriptions

```
GET /api/subscriptions/:email
```

**Response:**
```json
{
  "success": true,
  "subscriptions": ["TSLA", "NVDA"]
}
```

---

### Subscribe to Stock

```
POST /api/subscriptions
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "ticker": "TSLA"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscribed to TSLA",
  "subscriptions": ["TSLA"]
}
```

---

### Unsubscribe from Stock

```
DELETE /api/subscriptions
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "ticker": "TSLA"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Unsubscribed from TSLA",
  "subscriptions": []
}
```

---

## 🔌 Socket.IO Event Documentation

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `joinUser` | `{ email: string }` | Join the user's personal Socket.IO room |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `connected` | `{ message, email, room }` | Confirms the user has joined their room |
| `stock:update` | Price data object (see below) | Live price update for a subscribed stock |
| `subscription:updated` | `{ subscriptions: string[] }` | Fired when subscriptions change |

### `stock:update` Payload

```json
{
  "ticker": "TSLA",
  "name": "Tesla Inc.",
  "sector": "Automotive / EV",
  "price": 245.67,
  "previousPrice": 244.22,
  "change": 1.45,
  "changePercent": 0.59,
  "direction": "up",
  "timestamp": "2026-06-15T15:30:00.000Z"
}
```

`direction` values: `"up"` | `"down"` | `"flat"`

---

## ☁️ Deployment Guide

### Backend → Render

1. Push this repository to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Environment:**
     - `CLIENT_URL` = `https://your-vercel-app.vercel.app`
5. Click **Deploy**

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **Import Project**
2. Connect your GitHub repository
3. Configure:
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Environment variable:**
     - `VITE_API_URL` = `https://your-backend-url.onrender.com`
4. Click **Deploy**

> **Note:** After deploying, update `CLIENT_URL` on Render with your actual Vercel URL, and `VITE_API_URL` on Vercel with your actual Render URL.

---

## 🧠 Design Decisions

| Decision | Reason |
|---|---|
| **Socket.IO** | Assignment requires live updates without page refresh. Socket.IO provides the persistent connection and per-room isolation needed for multi-user support. |
| **JSON file storage** | Avoids database setup overhead. Keeps the project runnable with a single `npm run dev`. Sufficient for demo purposes. |
| **Frontend/backend separation** | Vercel is optimized for static/frontend deployments. Socket.IO needs a persistent Node.js server, which Render/Railway provides. |
| **Simulated prices** | Assignment permits random price generation. Mean-reverting random walk creates realistic-looking movement without requiring a paid stock API. |
| **Per-user Socket.IO rooms** | Each user joins `user:<email>` room. Backend broadcasts only to the relevant room, ensuring complete data isolation between users. |
| **localStorage session** | Avoids forcing re-login on page refresh. Email persists in localStorage and socket reconnects automatically on load. |

---

## ⚠️ Known Limitations

- Simulated stock prices only — not real market data
- No real brokerage API integration
- No password authentication — email only
- JSON file storage is not suitable for production scale
- Price history resets on backend restart

---

## 🚀 Future Improvements

- PostgreSQL or MongoDB for persistent, scalable storage
- JWT-based authentication with refresh tokens
- Real-time stock API integration (e.g., Polygon.io, Alpaca)
- Portfolio P&L tracking
- Buy/sell order simulation
- Candlestick charts (OHLC data)
- Mobile app using React Native / Expo
- WebSocket compression and rate limiting
- Redis pub/sub for horizontally scaled backends

---

## 👤 Author

**Shriniwas Maheshwari**

| | |
|---|---|
| 🌐 Portfolio | [www.shriniwas.net](https://www.shriniwas.net) |
| 🐙 GitHub | [github.com/shriniwas2412](https://github.com/shriniwas2412) |
| 💼 LinkedIn | [linkedin.com/in/shriniwas-maheshwari-b39b64247](https://linkedin.com/in/shriniwas-maheshwari-b39b64247/) |

---

## 📄 License

MIT — free to use, modify, and distribute.
