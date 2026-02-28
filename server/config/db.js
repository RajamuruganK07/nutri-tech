/**
 * NutriTech - Database Configuration
 * Lightweight JSON-file database (no MongoDB required!)
 * Data persists in server/data/db/ directory
 */

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");
const fs = require("fs");

// Ensure data directory exists
const dataDir = path.join(__dirname, "../data/db");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database files
const usersAdapter = new FileSync(path.join(dataDir, "users.json"));
const logsAdapter = new FileSync(path.join(dataDir, "logs.json"));

const usersDB = low(usersAdapter);
const logsDB = low(logsAdapter);

// Set defaults
usersDB.defaults({ users: [] }).write();
logsDB.defaults({ logs: [] }).write();

/**
 * Simple ID generator
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

const connectDB = async () => {
  console.log("  ✅ JSON File Database Ready (no MongoDB needed)");
  console.log(`  📁 Data stored in: ${dataDir}`);
  return true;
};

module.exports = { connectDB, usersDB, logsDB, generateId };
