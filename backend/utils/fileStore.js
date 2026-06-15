/**
 * PulseTrade — File Store Utility
 * Safe read/write helpers for JSON file-based storage.
 * Handles missing files, invalid JSON, and prevents server crashes.
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

/**
 * Ensure the data directory and users file exist.
 * If the file is missing or corrupted, recreate it with defaults.
 */
function ensureFileExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2), "utf8");
      console.log("[FileStore] Created users.json with default structure.");
    }
  } catch (err) {
    console.error("[FileStore] Failed to ensure file exists:", err.message);
  }
}

/**
 * Read and parse users.json.
 * Returns { users: [] } as a safe fallback on any error.
 */
function readData() {
  try {
    ensureFileExists();
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.users)) {
      throw new Error("Invalid JSON structure");
    }
    return parsed;
  } catch (err) {
    console.error("[FileStore] Read error, recovering with empty store:", err.message);
    // Attempt to recover by resetting the file
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2), "utf8");
    } catch (writeErr) {
      console.error("[FileStore] Could not reset file:", writeErr.message);
    }
    return { users: [] };
  }
}

/**
 * Write data object to users.json.
 * @param {Object} data - The data object to persist.
 */
function writeData(data) {
  try {
    ensureFileExists();
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("[FileStore] Write error:", err.message);
  }
}

module.exports = { readData, writeData };
