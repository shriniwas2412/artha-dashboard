/**
 * PulseTrade — User Service
 * Business logic for user management on top of the file store.
 */

const { readData, writeData } = require("../utils/fileStore");

/**
 * Find a user by email. Returns null if not found.
 * @param {string} email
 */
function findUser(email) {
  const data = readData();
  return data.users.find((u) => u.email === email.toLowerCase()) || null;
}

/**
 * Create or return an existing user.
 * @param {string} email
 * @returns {{ email: string, subscriptions: string[] }}
 */
function getOrCreateUser(email) {
  const normalizedEmail = email.toLowerCase().trim();
  const data = readData();
  let user = data.users.find((u) => u.email === normalizedEmail);

  if (!user) {
    user = { email: normalizedEmail, subscriptions: [] };
    data.users.push(user);
    writeData(data);
    console.log(`[UserService] New user created: ${normalizedEmail}`);
  }

  return user;
}

/**
 * Add a ticker subscription to a user.
 * Returns updated subscriptions array.
 * @param {string} email
 * @param {string} ticker
 * @returns {string[]}
 */
function addSubscription(email, ticker) {
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedTicker = ticker.toUpperCase().trim();
  const data = readData();

  const userIndex = data.users.findIndex((u) => u.email === normalizedEmail);
  if (userIndex === -1) {
    throw new Error(`User not found: ${normalizedEmail}`);
  }

  const user = data.users[userIndex];
  if (!user.subscriptions.includes(normalizedTicker)) {
    user.subscriptions.push(normalizedTicker);
    data.users[userIndex] = user;
    writeData(data);
    console.log(`[UserService] ${normalizedEmail} subscribed to ${normalizedTicker}`);
  }

  return user.subscriptions;
}

/**
 * Remove a ticker subscription from a user.
 * Returns updated subscriptions array.
 * @param {string} email
 * @param {string} ticker
 * @returns {string[]}
 */
function removeSubscription(email, ticker) {
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedTicker = ticker.toUpperCase().trim();
  const data = readData();

  const userIndex = data.users.findIndex((u) => u.email === normalizedEmail);
  if (userIndex === -1) {
    throw new Error(`User not found: ${normalizedEmail}`);
  }

  const user = data.users[userIndex];
  user.subscriptions = user.subscriptions.filter((s) => s !== normalizedTicker);
  data.users[userIndex] = user;
  writeData(data);
  console.log(`[UserService] ${normalizedEmail} unsubscribed from ${normalizedTicker}`);

  return user.subscriptions;
}

module.exports = { findUser, getOrCreateUser, addSubscription, removeSubscription };
