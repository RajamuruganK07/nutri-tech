/**
 * NutriTech - Auth Service
 * Handles login, register, token management
 */

const AUTH_API = window.location.origin + "/api/auth";

const NutriAuth = {
  // Get stored token
  getToken() {
    return localStorage.getItem("nutritech_token");
  },

  // Get stored user
  getUser() {
    const data = localStorage.getItem("nutritech_user");
    return data ? JSON.parse(data) : null;
  },

  // Check if logged in
  isLoggedIn() {
    return !!this.getToken();
  },

  // Check if admin
  isAdmin() {
    const user = this.getUser();
    return user && user.role === "admin";
  },

  // Save auth data
  saveAuth(token, user) {
    localStorage.setItem("nutritech_token", token);
    localStorage.setItem("nutritech_user", JSON.stringify(user));
  },

  // Clear auth data
  logout() {
    localStorage.removeItem("nutritech_token");
    localStorage.removeItem("nutritech_user");
    window.location.href = "login.html";
  },

  // Auth header for API calls
  authHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Register
  async register(data) {
    const res = await fetch(`${AUTH_API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Registration failed");
    this.saveAuth(result.token, result.user);
    return result;
  },

  // Login
  async login(email, password) {
    const res = await fetch(`${AUTH_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Login failed");
    this.saveAuth(result.token, result.user);
    return result;
  },

  // Get profile
  async getProfile() {
    const res = await fetch(`${AUTH_API}/me`, {
      headers: { ...this.authHeader() },
    });
    if (!res.ok) {
      this.logout();
      throw new Error("Session expired");
    }
    const result = await res.json();
    localStorage.setItem("nutritech_user", JSON.stringify(result.user));
    return result.user;
  },

  // Update profile
  async updateProfile(data) {
    const res = await fetch(`${AUTH_API}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.authHeader(),
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Update failed");
    localStorage.setItem("nutritech_user", JSON.stringify(result.user));
    return result.user;
  },
};
