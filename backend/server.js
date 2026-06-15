/**
 * PulseTrade — Main Express + Socket.IO Server
 * Entry point for the backend application.
 */

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const { startPriceBroadcast } = require("./services/stockPriceService");
const { findUser } = require("./services/userService");

// ─── App Setup ───────────────────────────────────────────────────────────────

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3001;

// ─── CORS Configuration ──────────────────────────────────────────────────────

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow any Vercel preview deployment
    if (origin.endsWith(".vercel.app")) return callback(null, true);
    callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Socket.IO Setup ─────────────────────────────────────────────────────────

const io = new Server(httpServer, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

// In-memory map: email -> Set of socket IDs currently connected for that user
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log(`[Socket.IO] Connected: ${socket.id}`);

  /**
   * Client emits "joinUser" with { email } to join their personal room.
   * Server joins the socket to room "user:<email>" and confirms.
   */
  socket.on("joinUser", ({ email }) => {
    if (!email) {
      socket.emit("error", { message: "Email is required to join." });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const room = `user:${normalizedEmail}`;

    socket.join(room);
    socket.data.email = normalizedEmail;

    // Track connected sockets for this user
    if (!connectedUsers.has(normalizedEmail)) {
      connectedUsers.set(normalizedEmail, new Set());
    }
    connectedUsers.get(normalizedEmail).add(socket.id);

    console.log(`[Socket.IO] User joined room: ${room} (socket: ${socket.id})`);

    // Confirm connection to this socket
    socket.emit("connected", {
      message: `Connected as ${normalizedEmail}`,
      email: normalizedEmail,
      room,
    });

    // Send current subscriptions to the joining user
    const user = findUser(normalizedEmail);
    if (user) {
      socket.emit("subscription:updated", {
        subscriptions: user.subscriptions,
      });
    }
  });

  socket.on("disconnect", (reason) => {
    const email = socket.data.email;
    if (email && connectedUsers.has(email)) {
      connectedUsers.get(email).delete(socket.id);
      if (connectedUsers.get(email).size === 0) {
        connectedUsers.delete(email);
      }
    }
    console.log(`[Socket.IO] Disconnected: ${socket.id} | Reason: ${reason}`);
  });

  socket.on("error", (err) => {
    console.error(`[Socket.IO] Socket error on ${socket.id}:`, err.message);
  });
});

// ─── REST Routes ──────────────────────────────────────────────────────────────

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "PulseTrade API is running",
    timestamp: new Date().toISOString(),
    connectedUsers: connectedUsers.size,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[Server] Unhandled error:", err.message);
  res.status(500).json({ success: false, message: "Internal server error." });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

httpServer.listen(PORT, () => {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║     PulseTrade Backend Server            ║");
  console.log(`║     Running on port ${PORT}                ║`);
  console.log(`║     ENV: ${process.env.NODE_ENV || "development"}                   ║`);
  console.log("╚══════════════════════════════════════════╝");
  console.log(`[Server] Health check: http://localhost:${PORT}/health`);

  // Start broadcasting price updates to all connected users
  startPriceBroadcast(io, connectedUsers);
});

module.exports = { app, io };
