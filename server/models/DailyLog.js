/**
 * NutriTech - Daily Log Model
 * JSON-file based daily log storage
 */

const { logsDB, generateId } = require("../config/db");
const User = require("./User");

const DailyLog = {
  /**
   * Create a new daily log with compliance calculation
   */
  create(data) {
    const log = {
      _id: generateId(),
      userId: data.userId,
      date: data.date,
      caloriesConsumed: Number(data.caloriesConsumed),
      proteinConsumed: Number(data.proteinConsumed),
      carbsConsumed: Number(data.carbsConsumed),
      fatConsumed: Number(data.fatConsumed),
      meals: data.meals || [],
      notes: data.notes || "",
      calorieCompliance: 0,
      proteinCompliance: 0,
      carbsCompliance: 0,
      fatCompliance: 0,
      overallCompliance: 0,
      status: "average",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Calculate compliance
    DailyLog._calculateCompliance(log);

    logsDB.get("logs").push(log).write();
    return log;
  },

  /**
   * Find one log matching query
   */
  findOne(query) {
    return logsDB.get("logs").find(query).value() || null;
  },

  /**
   * Find logs matching query with optional sort
   */
  find(query = {}) {
    let results = logsDB.get("logs").value() || [];

    // Filter by userId
    if (query.userId) {
      results = results.filter((l) => l.userId === query.userId);
    }

    // Filter by date range
    if (query.date && typeof query.date === "object" && query.date.$gte) {
      results = results.filter((l) => l.date >= query.date.$gte);
    }

    // Filter by exact date
    if (query.date && typeof query.date === "string") {
      results = results.filter((l) => l.date === query.date);
    }

    return results;
  },

  /**
   * Find with sort (1 = asc, -1 = desc) and optional limit
   */
  findSorted(query, sortField = "date", sortDir = -1, limit = 0) {
    let results = DailyLog.find(query);

    results.sort((a, b) => {
      if (sortDir === 1) return a[sortField] > b[sortField] ? 1 : -1;
      return a[sortField] < b[sortField] ? 1 : -1;
    });

    if (limit > 0) {
      results = results.slice(0, limit);
    }

    return results;
  },

  /**
   * Update existing log
   */
  updateOne(query, data) {
    const log = logsDB.get("logs").find(query);
    if (!log.value()) return null;

    data.updatedAt = new Date().toISOString();
    log.assign(data).write();

    // Recalculate compliance
    const updated = log.value();
    DailyLog._calculateCompliance(updated);
    log.assign(updated).write();

    return updated;
  },

  /**
   * Count logs matching query
   */
  countDocuments(query = {}) {
    return DailyLog.find(query).length;
  },

  /**
   * Internal: Calculate compliance scores
   */
  _calculateCompliance(log) {
    const user = User.findById(log.userId);
    if (!user || !user.recommendedCalories || user.recommendedCalories === 0) return;

    log.calorieCompliance = Math.min(
      Math.round((log.caloriesConsumed / user.recommendedCalories) * 100),
      150
    );
    log.proteinCompliance = user.recommendedProtein > 0
      ? Math.min(Math.round((log.proteinConsumed / user.recommendedProtein) * 100), 150)
      : 0;
    log.carbsCompliance = user.recommendedCarbs > 0
      ? Math.min(Math.round((log.carbsConsumed / user.recommendedCarbs) * 100), 150)
      : 0;
    log.fatCompliance = user.recommendedFat > 0
      ? Math.min(Math.round((log.fatConsumed / user.recommendedFat) * 100), 150)
      : 0;

    log.overallCompliance = Math.round(
      (log.calorieCompliance + log.proteinCompliance + log.carbsCompliance + log.fatCompliance) / 4
    );

    // Determine status
    const s = log.overallCompliance;
    if (s >= 90 && s <= 110) log.status = "excellent";
    else if (s >= 80 && s <= 120) log.status = "good";
    else if (s >= 70 && s <= 130) log.status = "average";
    else if (s >= 60) log.status = "poor";
    else log.status = "critical";
  },
};

module.exports = DailyLog;
