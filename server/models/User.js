/**
 * NutriTech - User Model
 * JSON-file based user storage (no MongoDB required)
 */

const bcrypt = require("bcryptjs");
const { usersDB, generateId } = require("../config/db");

const User = {
  /**
   * Create a new user
   */
  async create(data) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = {
      _id: generateId(),
      name: data.name,
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      role: data.role || "user",
      age: data.age || null,
      weight: data.weight || null,
      height: data.height || null,
      gender: data.gender || null,
      jobType: data.jobType || null,
      exerciseFrequency: data.exerciseFrequency || "none",
      goal: data.goal || null,
      dietPreference: data.dietPreference || "nonveg",
      recommendedCalories: data.recommendedCalories || 0,
      recommendedProtein: data.recommendedProtein || 0,
      recommendedCarbs: data.recommendedCarbs || 0,
      recommendedFat: data.recommendedFat || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usersDB.get("users").push(user).write();
    return User.sanitize(user);
  },

  /**
   * Find user by email
   */
  findOne(query) {
    const user = usersDB.get("users").find(query).value();
    return user || null;
  },

  /**
   * Find user by ID
   */
  findById(id) {
    const user = usersDB.get("users").find({ _id: id }).value();
    return user || null;
  },

  /**
   * Find all users matching query
   */
  find(query = {}) {
    let chain = usersDB.get("users");
    if (query.role) {
      chain = chain.filter({ role: query.role });
    }
    return chain.value() || [];
  },

  /**
   * Update user by ID
   */
  updateById(id, data) {
    data.updatedAt = new Date().toISOString();
    usersDB.get("users").find({ _id: id }).assign(data).write();
    return User.findById(id);
  },

  /**
   * Count users matching query
   */
  countDocuments(query = {}) {
    if (query.role) {
      return usersDB.get("users").filter(query).size().value();
    }
    return usersDB.get("users").size().value();
  },

  /**
   * Compare password
   */
  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  /**
   * Remove password from user object
   */
  sanitize(user) {
    if (!user) return null;
    const clean = { ...user };
    delete clean.password;
    return clean;
  },
};

module.exports = User;
