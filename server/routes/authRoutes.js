/**
 * NutriTech - Auth Routes
 * Register, Login, Profile management
 */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { generateToken, protect } = require("../middleware/auth");
const { calculateNutrition } = require("../engine/nutritionCalculator");

/**
 * POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, age, weight, height, gender, jobType, exerciseFrequency, goal, dietPreference } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    // Check if user exists
    const existingUser = User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Calculate recommended nutrition if profile data provided
    let recommended = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    if (age && weight && height && gender && jobType && goal) {
      const nutritionData = calculateNutrition({
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        gender,
        jobType,
        exerciseFrequency: exerciseFrequency || "none",
        goal,
      });
      recommended = {
        calories: nutritionData.targetCalories,
        protein: nutritionData.macros.protein,
        carbs: nutritionData.macros.carbs,
        fat: nutritionData.macros.fat,
      };
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      age: age ? Number(age) : null,
      weight: weight ? Number(weight) : null,
      height: height ? Number(height) : null,
      gender: gender || null,
      jobType: jobType || null,
      exerciseFrequency: exerciseFrequency || "none",
      goal: goal || null,
      dietPreference: dietPreference || "nonveg",
      recommendedCalories: recommended.calories,
      recommendedProtein: recommended.protein,
      recommendedCarbs: recommended.carbs,
      recommendedFat: recommended.fat,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message || "Registration failed" });
  }
});

/**
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: User.sanitize(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

/**
 * GET /api/auth/me
 */
router.get("/me", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

/**
 * PUT /api/auth/profile
 */
router.put("/profile", protect, (req, res) => {
  try {
    const { age, weight, height, gender, jobType, exerciseFrequency, goal, dietPreference } = req.body;
    const user = User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const updates = {};
    if (age) updates.age = Number(age);
    if (weight) updates.weight = Number(weight);
    if (height) updates.height = Number(height);
    if (gender) updates.gender = gender;
    if (jobType) updates.jobType = jobType;
    if (exerciseFrequency) updates.exerciseFrequency = exerciseFrequency;
    if (goal) updates.goal = goal;
    if (dietPreference) updates.dietPreference = dietPreference;

    // Merge with existing to check if we have full profile
    const merged = { ...user, ...updates };

    // Recalculate recommended nutrition
    if (merged.age && merged.weight && merged.height && merged.gender && merged.jobType && merged.goal) {
      const nutritionData = calculateNutrition({
        age: merged.age,
        weight: merged.weight,
        height: merged.height,
        gender: merged.gender,
        jobType: merged.jobType,
        exerciseFrequency: merged.exerciseFrequency || "none",
        goal: merged.goal,
      });
      updates.recommendedCalories = nutritionData.targetCalories;
      updates.recommendedProtein = nutritionData.macros.protein;
      updates.recommendedCarbs = nutritionData.macros.carbs;
      updates.recommendedFat = nutritionData.macros.fat;
    }

    const updated = User.updateById(req.user._id, updates);

    res.json({
      success: true,
      message: "Profile updated",
      user: User.sanitize(updated),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Profile update failed" });
  }
});

module.exports = router;
