# Artha — The Mathematics of Markets

**Live Deployment:** [https://artha-dashboard-sigma.vercel.app](https://artha-dashboard-sigma.vercel.app)  
**Backend API:** [https://artha-dashboard-5vac.onrender.com](https://artha-dashboard-5vac.onrender.com)

Artha is a premium, real-time simulated stock trading platform and dashboard. Designed specifically to demonstrate scalable full-stack architecture, it tracks live algorithmic prices for 10 stocks across the **NASDAQ (USD)** and **NSE (INR)** markets. 

The application utilizes **WebSockets (Socket.IO)** to stream real-time price updates while maintaining strict multi-user isolation through dedicated socket rooms.

---

## Core Features & Technical Highlights

### 1. Real-Time Algorithmic Price Engine
- **Sub-second Updates:** Prices update every 1 second without any page refreshes.
- **Random Walk Simulation:** Custom mean-reversion algorithm creates realistic stock price movements based on calculated volatility metrics for each individual asset.

### 2. Multi-User WebSocket Isolation
- **Room-Based Subscriptions:** The backend maintains isolated `Socket.IO` rooms for every connected user based on their login email. 
- **Concurrent Integrity:** Multiple users can log in simultaneously (e.g., across different browsers or tabs) and will solely receive data for the specific stocks they have subscribed to, ensuring zero data leakage.

### 3. Paper Trading Portfolio Module
- **Mock Trading Engine:** Users are granted a simulated $100,000 balance to practice executing buy and sell orders.
- **Real-Time P&L:** The system automatically calculates Average Cost Basis, Unrealized Profit/Loss, and overall Portfolio Value instantaneously as the live ticker feed updates.

### 4. Advanced Frontend Architecture (React + Vite)
- **Component Memoization:** Heavy components like the infinite-scrolling Market Ticker are optimized using `React.memo` to prevent unnecessary re-renders and eliminate UI jank/flickering when users modify their subscriptions.
- **State Management:** Clean separation of global UI state (Dark Mode, Tutorial Overlays, Active Tabs) and persistent data (LocalStorage for theme and newsletter preferences).
- **Responsive Design System:** Completely custom CSS implementation utilizing CSS Variables for seamless light/dark mode transitions. Completely free of external bloated UI libraries.

---

## System Architecture

The project is structured as a decoupled monorepo containing two discrete applications:

### Backend (`/backend`)
- **Environment:** Node.js, Express
- **Real-time Server:** `Socket.IO`
- **Responsibilities:** Maintains the state of all 10 tracked assets, runs the 1-second interval price simulation, processes user login events, manages user-specific watchlists, and broadcasts delta payloads over WebSockets.
- **Deployment:** Hosted on **Render.com** to support continuous, long-lived WebSocket connections.

### Frontend (`/frontend`)
- **Environment:** React, Vite
- **Responsibilities:** Manages the client-side Socket.IO lifecycle, renders the real-time UI, orchestrates the Paper Trading mock execution, and provides an onboarding tutorial.
- **Deployment:** Hosted on **Vercel** as a high-performance static site connecting to the Render API.

---

## Local Development Setup

To evaluate or run this application locally on your machine, you must run both the backend and frontend servers simultaneously.

**1. Clone the repository and install dependencies:**
```bash
git clone https://github.com/shriniwas2412/artha-dashboard.git
cd artha-dashboard
npm install
```

**2. Start the Application:**
This command uses `concurrently` to boot both the Vite dev server and the Node backend at the same time:
```bash
npm run dev
```

**3. Access the Dashboard:**
Open your browser and navigate to: [http://localhost:5173](http://localhost:5173)

*(For testing multi-user isolation, open a standard browser window and an Incognito window side-by-side, and log in with two different email addresses).*

---

## Contact & Information

Designed, architected, and developed by **Shriniwas Maheshwari** as a demonstration of production-ready full-stack engineering and product design.

- **Portfolio:** [http://shriniwas.net](http://shriniwas.net)
- **Email:** [shrini2412@gmail.com](mailto:shrini2412@gmail.com)
- **GitHub:** [shriniwas2412](https://github.com/shriniwas2412)
