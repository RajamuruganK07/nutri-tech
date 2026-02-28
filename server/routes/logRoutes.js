/**
 * NutriTech - Daily Log Routes
 * Upload daily food data, get compliance scores
 */

const express = require("express");
const router = express.Router();
const DailyLog = require("../models/DailyLog");
const { protect } = require("../middleware/auth");

/**
 * POST /api/logs/upload
 */
router.post("/upload", protect, (req, res) => {
  try {
    const { date, caloriesConsumed, proteinConsumed, carbsConsumed, fatConsumed, meals, notes } = req.body;

    const logDate = date || new Date().toISOString().split("T")[0];

    // Check if log already exists for this date
    const existingLog = DailyLog.findOne({ userId: req.user._id, date: logDate });

    if (existingLog) {
      // Update existing log
      const updated = DailyLog.updateOne(
        { _id: existingLog._id },
        {
          caloriesConsumed: Number(caloriesConsumed),
          proteinConsumed: Number(proteinConsumed),
          carbsConsumed: Number(carbsConsumed),
          fatConsumed: Number(fatConsumed),
          meals: meals || existingLog.meals,
          notes: notes || existingLog.notes,
        }
      );

      return res.json({
        success: true,
        message: "Daily log updated",
        log: updated,
      });
    }

    // Create new log
    const log = DailyLog.create({
      userId: req.user._id,
      date: logDate,
      caloriesConsumed: Number(caloriesConsumed),
      proteinConsumed: Number(proteinConsumed),
      carbsConsumed: Number(carbsConsumed),
      fatConsumed: Number(fatConsumed),
      meals: meals || [],
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      message: "Daily log saved",
      log,
    });
  } catch (error) {
    console.error("Log upload error:", error);
    res.status(500).json({ error: "Failed to save daily log" });
  }
});

/**
 * GET /api/logs/today
 */
router.get("/today", protect, (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const log = DailyLog.findOne({ userId: req.user._id, date: today });

    res.json({
      success: true,
      log: log || null,
      recommended: {
        calories: req.user.recommendedCalories,
        protein: req.user.recommendedProtein,
        carbs: req.user.recommendedCarbs,
        fat: req.user.recommendedFat,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch today's log" });
  }
});

/**
 * GET /api/logs/history
 */
router.get("/history", protect, (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startStr = startDate.toISOString().split("T")[0];

    const logs = DailyLog.findSorted(
      { userId: req.user._id, date: { $gte: startStr } },
      "date",
      -1
    );

    // Calculate average compliance
    let avgCompliance = 0;
    if (logs.length > 0) {
      avgCompliance = Math.round(
        logs.reduce((sum, log) => sum + log.overallCompliance, 0) / logs.length
      );
    }

    res.json({
      success: true,
      logs,
      summary: {
        totalDays: days,
        loggedDays: logs.length,
        averageCompliance: avgCompliance,
        recommended: {
          calories: req.user.recommendedCalories,
          protein: req.user.recommendedProtein,
          carbs: req.user.recommendedCarbs,
          fat: req.user.recommendedFat,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

/**
 * GET /api/logs/weekly
 */
router.get("/weekly", protect, (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const startStr = startDate.toISOString().split("T")[0];

    const logs = DailyLog.findSorted(
      { userId: req.user._id, date: { $gte: startStr } },
      "date",
      1
    );

    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weekly data" });
  }
});

module.exports = router;
