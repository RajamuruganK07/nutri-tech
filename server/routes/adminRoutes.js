/**
 * NutriTech - Admin Routes
 * Monitor all users, compliance reports, alerts
 */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const DailyLog = require("../models/DailyLog");
const { protect, adminOnly } = require("../middleware/auth");

// All admin routes require auth + admin role
router.use(protect, adminOnly);

/**
 * GET /api/admin/users
 */
router.get("/users", (req, res) => {
  try {
    const users = User.find({ role: "user" });

    const usersWithCompliance = users.map((user) => {
      const latestLogs = DailyLog.findSorted({ userId: user._id }, "date", -1, 1);
      const latestLog = latestLogs.length > 0 ? latestLogs[0] : null;

      // Get 7-day average
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekStr = weekAgo.toISOString().split("T")[0];

      const weekLogs = DailyLog.find({ userId: user._id, date: { $gte: weekStr } });
      let weeklyAvg = 0;
      if (weekLogs.length > 0) {
        weeklyAvg = Math.round(
          weekLogs.reduce((sum, l) => sum + l.overallCompliance, 0) / weekLogs.length
        );
      }

      return {
        ...User.sanitize(user),
        latestLog,
        weeklyAvgCompliance: weeklyAvg,
        totalLogs: DailyLog.countDocuments({ userId: user._id }),
      };
    });

    res.json({ success: true, users: usersWithCompliance });
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/**
 * GET /api/admin/user/:id
 */
router.get("/user/:id", (req, res) => {
  try {
    const user = User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const logs = DailyLog.findSorted({ userId: user._id }, "date", -1, 30);

    let avgCompliance = 0;
    if (logs.length > 0) {
      avgCompliance = Math.round(
        logs.reduce((sum, l) => sum + l.overallCompliance, 0) / logs.length
      );
    }

    res.json({
      success: true,
      user: User.sanitize(user),
      logs,
      avgCompliance,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

/**
 * GET /api/admin/dashboard
 */
router.get("/dashboard", (req, res) => {
  try {
    const totalUsers = User.countDocuments({ role: "user" });
    const today = new Date().toISOString().split("T")[0];
    const todayLogsData = DailyLog.find({ date: today });
    const todayLogs = todayLogsData.length;

    let todayAvgCompliance = 0;
    if (todayLogsData.length > 0) {
      todayAvgCompliance = Math.round(
        todayLogsData.reduce((sum, l) => sum + l.overallCompliance, 0) / todayLogsData.length
      );
    }

    // Get users with low compliance (< 70% over last 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeStr = threeDaysAgo.toISOString().split("T")[0];

    const allUsers = User.find({ role: "user" });
    const alerts = [];

    for (const user of allUsers) {
      const recentLogs = DailyLog.find({ userId: user._id, date: { $gte: threeStr } });

      if (recentLogs.length >= 2) {
        const avg = Math.round(
          recentLogs.reduce((sum, l) => sum + l.overallCompliance, 0) / recentLogs.length
        );
        if (avg < 70) {
          alerts.push({
            userId: user._id,
            name: user.name,
            email: user.email,
            avgCompliance: avg,
            daysTracked: recentLogs.length,
            message: avg < 60
              ? "Critical: Severely off diet plan"
              : "Warning: Below target compliance",
          });
        }
      }
    }

    res.json({
      success: true,
      dashboard: {
        totalUsers,
        todayLogsCount: todayLogs,
        todayAvgCompliance,
        alerts,
        date: today,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

/**
 * GET /api/admin/compliance-report
 */
router.get("/compliance-report", (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startStr = startDate.toISOString().split("T")[0];

    const users = User.find({ role: "user" });
    const report = [];

    for (const user of users) {
      const logs = DailyLog.findSorted(
        { userId: user._id, date: { $gte: startStr } },
        "date",
        1
      );

      let avgCompliance = 0;
      const statusCounts = { excellent: 0, good: 0, average: 0, poor: 0, critical: 0 };

      if (logs.length > 0) {
        avgCompliance = Math.round(
          logs.reduce((sum, l) => sum + l.overallCompliance, 0) / logs.length
        );
        logs.forEach((l) => {
          if (statusCounts[l.status] !== undefined) statusCounts[l.status]++;
        });
      }

      report.push({
        userId: user._id,
        name: user.name,
        email: user.email,
        recommendedCalories: user.recommendedCalories,
        daysLogged: logs.length,
        avgCompliance,
        statusCounts,
        logs: logs.map((l) => ({
          date: l.date,
          overallCompliance: l.overallCompliance,
          status: l.status,
          caloriesConsumed: l.caloriesConsumed,
        })),
      });
    }

    // Sort by compliance (lowest first)
    report.sort((a, b) => a.avgCompliance - b.avgCompliance);

    res.json({ success: true, report, period: `${days} days` });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate report" });
  }
});

module.exports = router;
