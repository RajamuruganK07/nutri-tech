/**
 * NutriTech - API Routes
 * Performance Optimization Platform
 */

const express = require("express");
const router = express.Router();
const { calculateNutrition } = require("../engine/nutritionCalculator");
const { generateMealPlan, generateWeeklyPlan } = require("../engine/mealPlanGenerator");
const { calculateEnergyScore } = require("../engine/energyScore");
const { calculateHealthRisks } = require("../engine/healthRiskPredictor");
const { getRegionalFoods, getAvailableRegions } = require("../data/regionalFoods");
const { generateGroceryList } = require("../engine/groceryGenerator");
const { logDailyEntry, getStreakData, getLeaderboard } = require("../engine/streakSystem");
const { processMessage } = require("../engine/aiChatbot");
const { getAllModes, getPerformanceMode, applyModeToNutrition } = require("../engine/performanceModes");
const { generateDashboard, addEmployeeData, registerCompany, createChallenge } = require("../engine/corporateDashboard");
const { scanMeal, getScannableMeals } = require("../engine/mealScanner");

/**
 * POST /api/calculate
 * Calculate nutrition requirements + generate meal plan
 */
router.post("/calculate", (req, res) => {
  try {
    const { age, weight, height, gender, jobType, exerciseFrequency, goal, dietPreference } = req.body;

    // Validation
    if (!age || !weight || !height || !gender || !jobType || !goal) {
      return res.status(400).json({
        error: "Missing required fields: age, weight, height, gender, jobType, goal",
      });
    }

    if (age < 15 || age > 80) {
      return res.status(400).json({ error: "Age must be between 15 and 80" });
    }
    if (weight < 30 || weight > 200) {
      return res.status(400).json({ error: "Weight must be between 30 and 200 kg" });
    }
    if (height < 120 || height > 230) {
      return res.status(400).json({ error: "Height must be between 120 and 230 cm" });
    }

    // Calculate nutrition
    const nutritionData = calculateNutrition({
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      gender,
      jobType,
      exerciseFrequency: exerciseFrequency || "none",
      goal,
    });

    // Generate meal plan
    const mealPlan = generateMealPlan(nutritionData, dietPreference || "nonveg");

    res.json({
      success: true,
      userData: { age, weight, height, gender, jobType, exerciseFrequency, goal, dietPreference },
      nutrition: nutritionData,
      mealPlan,
    });
  } catch (error) {
    console.error("Calculation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/weekly-plan
 * Generate a 7-day meal plan
 */
router.post("/weekly-plan", (req, res) => {
  try {
    const { age, weight, height, gender, jobType, exerciseFrequency, goal, dietPreference } = req.body;

    if (!age || !weight || !height || !gender || !jobType || !goal) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const nutritionData = calculateNutrition({
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      gender,
      jobType,
      exerciseFrequency: exerciseFrequency || "none",
      goal,
    });

    const weeklyPlan = generateWeeklyPlan(nutritionData, dietPreference || "nonveg");

    res.json({
      success: true,
      nutrition: nutritionData,
      weeklyPlan,
    });
  } catch (error) {
    console.error("Weekly plan error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/regenerate-meal
 * Regenerate a single meal (for variety)
 */
router.post("/regenerate-meal", (req, res) => {
  try {
    const { age, weight, height, gender, jobType, exerciseFrequency, goal, dietPreference } = req.body;

    const nutritionData = calculateNutrition({
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      gender,
      jobType,
      exerciseFrequency: exerciseFrequency || "none",
      goal,
    });

    const mealPlan = generateMealPlan(nutritionData, dietPreference || "nonveg");

    res.json({
      success: true,
      mealPlan,
    });
  } catch (error) {
    console.error("Regenerate error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/health
 */
router.get("/health", (req, res) => {
  res.json({ status: "ok", app: "NutriTech API", version: "2.0.0", features: [
    "nutrition-calculator", "meal-planner", "energy-score", "health-risk",
    "regional-foods", "grocery-list", "streak-system", "ai-chatbot",
    "performance-modes", "corporate-dashboard", "meal-scanner"
  ]});
});

/* =============================================================
   NEW FEATURES — NutriTech Performance Optimization Platform
   ============================================================= */

/**
 * POST /api/energy-score
 * Calculate AI Energy Score (out of 100)
 */
router.post("/energy-score", (req, res) => {
  try {
    const result = calculateEnergyScore(req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Energy Score error:", error);
    res.status(500).json({ error: "Failed to calculate energy score" });
  }
});

/**
 * POST /api/health-risk
 * Predict health risks based on lifestyle data
 */
router.post("/health-risk", (req, res) => {
  try {
    const result = calculateHealthRisks(req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Health Risk error:", error);
    res.status(500).json({ error: "Failed to predict health risks" });
  }
});

/**
 * GET /api/regions
 * Get available Indian regions
 */
router.get("/regions", (req, res) => {
  res.json({ success: true, regions: getAvailableRegions() });
});

/**
 * GET /api/regional-foods/:region
 * Get foods for a specific region
 */
router.get("/regional-foods/:region", (req, res) => {
  try {
    const foods = getRegionalFoods(req.params.region);
    if (!foods) {
      return res.status(404).json({ error: "Region not found" });
    }
    res.json({ success: true, region: req.params.region, foods });
  } catch (error) {
    console.error("Regional foods error:", error);
    res.status(500).json({ error: "Failed to get regional foods" });
  }
});

/**
 * POST /api/grocery-list
 * Generate smart grocery list from meal plan
 */
router.post("/grocery-list", (req, res) => {
  try {
    const { mealPlan, days } = req.body;
    if (!mealPlan) {
      return res.status(400).json({ error: "mealPlan is required" });
    }
    const result = generateGroceryList(mealPlan, days || 7);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Grocery list error:", error);
    res.status(500).json({ error: "Failed to generate grocery list" });
  }
});

/**
 * POST /api/streak/log
 * Log a daily entry for streak tracking
 */
router.post("/streak/log", (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const result = logDailyEntry(userId, req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Streak log error:", error);
    res.status(500).json({ error: "Failed to log streak" });
  }
});

/**
 * GET /api/streak/:userId
 * Get streak data for a user
 */
router.get("/streak/:userId", (req, res) => {
  try {
    const data = getStreakData(req.params.userId);
    res.json({ success: true, ...data });
  } catch (error) {
    console.error("Streak data error:", error);
    res.status(500).json({ error: "Failed to get streak data" });
  }
});

/**
 * GET /api/leaderboard
 * Get the NutriTech leaderboard
 */
router.get("/leaderboard", (req, res) => {
  try {
    const leaderboard = getLeaderboard();
    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "Failed to get leaderboard" });
  }
});

/**
 * POST /api/chatbot
 * AI Dietitian Chatbot
 */
router.post("/chatbot", (req, res) => {
  try {
    const { message, userContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }
    const response = processMessage(message, userContext || {});
    res.json({ success: true, ...response });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Failed to process chatbot message" });
  }
});

/**
 * GET /api/performance-modes
 * Get all available performance modes
 */
router.get("/performance-modes", (req, res) => {
  res.json({ success: true, modes: getAllModes() });
});

/**
 * GET /api/performance-modes/:modeId
 * Get details for a specific performance mode
 */
router.get("/performance-modes/:modeId", (req, res) => {
  const mode = getPerformanceMode(req.params.modeId);
  if (!mode) {
    return res.status(404).json({ error: "Mode not found" });
  }
  res.json({ success: true, mode });
});

/**
 * POST /api/performance-modes/apply
 * Apply a performance mode to nutrition calculation
 */
router.post("/performance-modes/apply", (req, res) => {
  try {
    const { modeId, age, weight, height, gender, jobType, exerciseFrequency, goal } = req.body;
    if (!modeId) {
      return res.status(400).json({ error: "modeId is required" });
    }

    const nutritionData = calculateNutrition({
      age: Number(age), weight: Number(weight), height: Number(height),
      gender, jobType, exerciseFrequency: exerciseFrequency || "none", goal,
    });

    const result = applyModeToNutrition(nutritionData, modeId);
    const mealPlan = generateMealPlan(result, req.body.dietPreference || "nonveg");

    res.json({ success: true, nutrition: result, mealPlan });
  } catch (error) {
    console.error("Performance mode error:", error);
    res.status(500).json({ error: "Failed to apply performance mode" });
  }
});

/**
 * GET /api/corporate/dashboard/:companyId
 * Get corporate health dashboard
 */
router.get("/corporate/dashboard/:companyId", (req, res) => {
  try {
    const dashboard = generateDashboard(req.params.companyId);
    res.json({ success: true, ...dashboard });
  } catch (error) {
    console.error("Corporate dashboard error:", error);
    res.status(500).json({ error: "Failed to generate dashboard" });
  }
});

/**
 * POST /api/corporate/register
 * Register a company
 */
router.post("/corporate/register", (req, res) => {
  try {
    const { companyId, companyName, industry } = req.body;
    if (!companyId || !companyName) {
      return res.status(400).json({ error: "companyId and companyName are required" });
    }
    const company = registerCompany(companyId, companyName, industry);
    res.json({ success: true, company });
  } catch (error) {
    console.error("Company register error:", error);
    res.status(500).json({ error: "Failed to register company" });
  }
});

/**
 * POST /api/corporate/employee
 * Add anonymous employee health data
 */
router.post("/corporate/employee", (req, res) => {
  try {
    const { companyId, employeeId } = req.body;
    if (!companyId || !employeeId) {
      return res.status(400).json({ error: "companyId and employeeId are required" });
    }
    const result = addEmployeeData(companyId, employeeId, req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Employee data error:", error);
    res.status(500).json({ error: "Failed to add employee data" });
  }
});

/**
 * POST /api/corporate/challenge
 * Create a health challenge for a company
 */
router.post("/corporate/challenge", (req, res) => {
  try {
    const { companyId } = req.body;
    if (!companyId) {
      return res.status(400).json({ error: "companyId is required" });
    }
    const challenge = createChallenge(companyId, req.body);
    res.json({ success: true, challenge });
  } catch (error) {
    console.error("Challenge creation error:", error);
    res.status(500).json({ error: "Failed to create challenge" });
  }
});

/**
 * POST /api/meal-scanner
 * Scan/analyze a meal description
 */
router.post("/meal-scanner", (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: "description is required" });
    }
    const result = scanMeal(description);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Meal scanner error:", error);
    res.status(500).json({ error: "Failed to scan meal" });
  }
});

/**
 * GET /api/meal-scanner/meals
 * Get list of scannable/recognizable meals
 */
router.get("/meal-scanner/meals", (req, res) => {
  res.json({ success: true, meals: getScannableMeals() });
});

module.exports = router;
