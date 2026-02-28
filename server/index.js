/**
 * NutriTech - Server Entry Point
 * AI-powered Personalized Nutrition Platform
 * Real-Time Nutrition Monitoring System
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db").connectDB;
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/authRoutes");
const logRoutes = require("./routes/logRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../client")));

// API Routes
app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/admin", adminRoutes);

// Serve frontend for all other routes
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Connect to MongoDB and start server
async function startServer() {
  const dbConnected = await connectDB();

  app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════════════════╗
  ║                                                  ║
  ║   🥗 NutriTech Server Running                    ║
  ║   Port: ${PORT}                                    ║
  ║   URL: http://localhost:${PORT}                     ║
  ║   Database: ${dbConnected ? "✅ Connected" : "❌ Offline"}                    ║
  ║                                                  ║
  ║   Real-Time Nutrition Monitoring System          ║
  ║   "Right Nutrition Today,                        ║
  ║    Stronger Tomorrow."                           ║
  ║                                                  ║
  ╚══════════════════════════════════════════════════╝
    `);
  });
}

startServer();

module.exports = app;
