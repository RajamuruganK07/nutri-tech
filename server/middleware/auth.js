/**
 * NutriTech - Authentication Middleware
 * JWT-based auth for protected routes
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "nutritech_void_emperor_secret_2026";

/**
 * Generate JWT token
 */
function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Protect route - requires valid JWT
 */
function protect(req, res, next) {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = User.sanitize(user);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Not authorized, token invalid" });
  }
}

/**
 * Admin-only route guard
 */
function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "Admin access required" });
  }
}

module.exports = { generateToken, protect, adminOnly };
