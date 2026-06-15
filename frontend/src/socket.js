/**
 * PulseTrade — Socket.IO Client
 * Creates and manages the Socket.IO connection to the backend.
 */

import { io } from "socket.io-client";
import { API_URL } from "./api.js";

let socket = null;

/**
 * Get or create the singleton socket instance.
 * @returns {import("socket.io-client").Socket}
 */
export function getSocket() {
  if (!socket) {
    socket = io(API_URL, {
      transports: ["websocket", "polling"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });
  }
  return socket;
}

/**
 * Connect the socket and join the user's personal room.
 * @param {string} email
 */
export function connectSocket(email) {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  s.emit("joinUser", { email });
}

/**
 * Disconnect and destroy the socket instance (on logout).
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
