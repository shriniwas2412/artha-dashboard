# Artha — The Mathematics of Markets

Artha is a real-time, simulated stock trading and portfolio dashboard designed to demonstrate full-stack architecture, WebSocket integration, and modern frontend design principles. 

This project tracks live algorithmic prices for 10 stocks across NASDAQ (USD) and NSE (INR) and includes a paper-trading module for simulating market executions.

## Features

- Real-Time Price Engine: Algorithmic random-walk simulation running at 1-second intervals.
- Multi-User Isolation: WebSocket rooms ensure users only receive data for their subscribed watchlists.
- Paper Trading Portfolio: Simulated $100,000 portfolio to practice buying and selling tracked assets.
- Live Market Ticker: Memoized, infinite-scrolling ticker component updating in real-time.
- Responsive Design System: Clean, professional interface with native Dark/Light mode support.

## Project Structure

The project is split into two independent modules:
- `/backend`: Node.js, Express, and Socket.IO (Manages price algorithms and WebSocket rooms).
- `/frontend`: React and Vite (Manages UI, state, and WebSocket client connections).

## Local Development Setup

To run this application locally, you must start both the backend and frontend servers.

1. Install Dependencies:
   Navigate to the root directory and install all packages:
   npm install

2. Start the Application:
   Run the root dev script to start both the backend and frontend concurrently:
   npm run dev

3. Access the Dashboard:
   Open your browser and navigate to: http://localhost:5173

## Deployment Architecture

- Backend (API & WebSockets): Deploy the `/backend` directory to a platform that supports long-lived WebSocket connections (e.g., Render, Railway).
- Frontend (UI): Deploy the `/frontend` directory to Vercel or Netlify. Ensure that the API base URL and Socket.IO client in the frontend code are updated to point to your deployed backend URL.

## Contact & Information

Designed and developed by Shriniwas Maheshwari.

- Portfolio: http://shriniwas.net
- Email: shrini2412@gmail.com
