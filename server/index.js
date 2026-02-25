/**
 * NutriTech - Server Entry Point
 * AI-powered Personalized Nutrition Platform
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./routes/api");

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

// Serve frontend for all other routes
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║   🥗 NutriTech Server Running            ║
  ║   Port: ${PORT}                            ║
  ║   URL: http://localhost:${PORT}             ║
  ║                                          ║
  ║   Your Personal Nutrition Guide          ║
  ║   "Right Nutrition Today,               ║
  ║    Stronger Tomorrow."                   ║
  ║                                          ║
  ╚══════════════════════════════════════════╝
  `);
});

module.exports = app;
