/**
 * NutriTech - Fitness Streak & Rewards System
 * Gamification engine for engagement and retention
 */

/**
 * In-memory streak store (would be DB in production)
 */
const userStreaks = {};

/**
 * Available achievements/badges
 */
const achievements = [
  { id: "first_log", name: "First Step", icon: "🌱", description: "Logged your first daily intake", threshold: 1 },
  { id: "streak_7", name: "Week Warrior", icon: "🔥", description: "7-day clean eating streak", threshold: 7 },
  { id: "streak_14", name: "Consistency King", icon: "👑", description: "14 days of consistent tracking", threshold: 14 },
  { id: "streak_30", name: "Iron Will", icon: "💎", description: "30-day nutrition streak", threshold: 30 },
  { id: "streak_60", name: "Legendary", icon: "🏆", description: "60-day unbroken streak", threshold: 60 },
  { id: "protein_7", name: "Protein Pro", icon: "💪", description: "Hit protein target 7 days straight", threshold: 7 },
  { id: "protein_30", name: "Muscle Machine", icon: "🏋️", description: "Protein target met for 30 days", threshold: 30 },
  { id: "water_7", name: "Hydration Hero", icon: "💧", description: "Met water goal 7 days in a row", threshold: 7 },
  { id: "energy_80", name: "Peak Performer", icon: "⚡", description: "Energy Score above 80 for 5 days", threshold: 5 },
  { id: "steps_10k", name: "10K Walker", icon: "🚶", description: "10,000+ steps for 7 days", threshold: 7 },
  { id: "early_bird", name: "Early Bird", icon: "🌅", description: "Logged breakfast before 9 AM for 7 days", threshold: 7 },
  { id: "explorer", name: "Food Explorer", icon: "🍽️", description: "Tried 20+ different foods from NutriTech", threshold: 20 },
];

/**
 * Points system
 */
const pointsTable = {
  daily_log: 10,
  protein_target_met: 15,
  calorie_target_met: 10,
  water_target_met: 5,
  exercise_done: 20,
  streak_bonus_7: 50,
  streak_bonus_14: 100,
  streak_bonus_30: 250,
  energy_score_above_80: 25,
  meal_plan_followed: 30,
};

/**
 * Initialize or get user streak data
 */
function getUserStreak(userId) {
  if (!userStreaks[userId]) {
    userStreaks[userId] = {
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      level: 1,
      title: "Beginner",
      proteinStreak: 0,
      waterStreak: 0,
      exerciseStreak: 0,
      energyStreak: 0,
      totalDaysLogged: 0,
      earnedAchievements: [],
      dailyLog: [],
      lastLogDate: null,
    };
  }
  return userStreaks[userId];
}

/**
 * Log a daily entry and update streaks
 */
function logDailyEntry(userId, entry) {
  const streak = getUserStreak(userId);
  const today = new Date().toISOString().split("T")[0];

  // Check if already logged today
  if (streak.lastLogDate === today) {
    // Update today's entry
    streak.dailyLog[streak.dailyLog.length - 1] = { ...entry, date: today };
  } else {
    // New day
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (streak.lastLogDate === yesterday) {
      // Consecutive day — streak continues
      streak.currentStreak += 1;
    } else if (streak.lastLogDate) {
      // Streak broken
      streak.currentStreak = 1;
    } else {
      // First ever log
      streak.currentStreak = 1;
    }

    streak.totalDaysLogged += 1;
    streak.lastLogDate = today;
    streak.dailyLog.push({ ...entry, date: today });

    // Keep only last 90 days
    if (streak.dailyLog.length > 90) {
      streak.dailyLog = streak.dailyLog.slice(-90);
    }
  }

  // Update longest streak
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }

  // Calculate points
  let pointsEarned = pointsTable.daily_log;
  const reasons = ["Daily log: +10 pts"];

  if (entry.proteinTargetMet) {
    streak.proteinStreak += 1;
    pointsEarned += pointsTable.protein_target_met;
    reasons.push("Protein target met: +15 pts");
  } else {
    streak.proteinStreak = 0;
  }

  if (entry.calorieTargetMet) {
    pointsEarned += pointsTable.calorie_target_met;
    reasons.push("Calorie target met: +10 pts");
  }

  if (entry.waterTargetMet) {
    streak.waterStreak += 1;
    pointsEarned += pointsTable.water_target_met;
    reasons.push("Water target met: +5 pts");
  } else {
    streak.waterStreak = 0;
  }

  if (entry.exerciseDone) {
    streak.exerciseStreak += 1;
    pointsEarned += pointsTable.exercise_done;
    reasons.push("Exercise logged: +20 pts");
  } else {
    streak.exerciseStreak = 0;
  }

  if (entry.energyScore >= 80) {
    streak.energyStreak += 1;
    pointsEarned += pointsTable.energy_score_above_80;
    reasons.push("Energy Score 80+: +25 pts");
  } else {
    streak.energyStreak = 0;
  }

  // Streak bonuses
  if (streak.currentStreak === 7) {
    pointsEarned += pointsTable.streak_bonus_7;
    reasons.push("🔥 7-day streak bonus: +50 pts!");
  }
  if (streak.currentStreak === 14) {
    pointsEarned += pointsTable.streak_bonus_14;
    reasons.push("🔥 14-day streak bonus: +100 pts!");
  }
  if (streak.currentStreak === 30) {
    pointsEarned += pointsTable.streak_bonus_30;
    reasons.push("🔥 30-day streak bonus: +250 pts!");
  }

  streak.totalPoints += pointsEarned;

  // Update level
  const levelData = calculateLevel(streak.totalPoints);
  streak.level = levelData.level;
  streak.title = levelData.title;

  // Check achievements
  const newAchievements = checkAchievements(streak);

  return {
    streak: {
      current: streak.currentStreak,
      longest: streak.longestStreak,
      proteinStreak: streak.proteinStreak,
      waterStreak: streak.waterStreak,
      exerciseStreak: streak.exerciseStreak,
    },
    points: {
      earned: pointsEarned,
      total: streak.totalPoints,
      reasons,
    },
    level: levelData,
    newAchievements,
    totalDaysLogged: streak.totalDaysLogged,
  };
}

/**
 * Calculate user level from total points
 */
function calculateLevel(totalPoints) {
  const levels = [
    { level: 1, title: "Beginner", minPoints: 0, icon: "🌱" },
    { level: 2, title: "Learner", minPoints: 100, icon: "📗" },
    { level: 3, title: "Consistent", minPoints: 300, icon: "🎯" },
    { level: 4, title: "Dedicated", minPoints: 600, icon: "💪" },
    { level: 5, title: "Warrior", minPoints: 1000, icon: "⚔️" },
    { level: 6, title: "Champion", minPoints: 1800, icon: "🏆" },
    { level: 7, title: "Master", minPoints: 3000, icon: "👑" },
    { level: 8, title: "Legend", minPoints: 5000, icon: "🌟" },
    { level: 9, title: "Elite", minPoints: 8000, icon: "💎" },
    { level: 10, title: "NutriTech Emperor", minPoints: 12000, icon: "🔱" },
  ];

  let currentLevel = levels[0];
  let nextLevel = levels[1];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalPoints >= levels[i].minPoints) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || null;
      break;
    }
  }

  return {
    ...currentLevel,
    totalPoints,
    nextLevel: nextLevel
      ? {
          title: nextLevel.title,
          pointsRequired: nextLevel.minPoints,
          pointsRemaining: nextLevel.minPoints - totalPoints,
          progress: Math.round(
            ((totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
          ),
        }
      : null,
  };
}

/**
 * Check and award achievements
 */
function checkAchievements(streak) {
  const newAchievements = [];

  achievements.forEach((achievement) => {
    if (streak.earnedAchievements.includes(achievement.id)) return;

    let earned = false;

    switch (achievement.id) {
      case "first_log":
        earned = streak.totalDaysLogged >= 1;
        break;
      case "streak_7":
        earned = streak.longestStreak >= 7;
        break;
      case "streak_14":
        earned = streak.longestStreak >= 14;
        break;
      case "streak_30":
        earned = streak.longestStreak >= 30;
        break;
      case "streak_60":
        earned = streak.longestStreak >= 60;
        break;
      case "protein_7":
        earned = streak.proteinStreak >= 7;
        break;
      case "protein_30":
        earned = streak.proteinStreak >= 30;
        break;
      case "water_7":
        earned = streak.waterStreak >= 7;
        break;
      case "energy_80":
        earned = streak.energyStreak >= 5;
        break;
      case "steps_10k":
        earned = streak.exerciseStreak >= 7;
        break;
    }

    if (earned) {
      streak.earnedAchievements.push(achievement.id);
      newAchievements.push(achievement);
    }
  });

  return newAchievements;
}

/**
 * Get leaderboard (for corporate mode)
 */
function getLeaderboard(limit = 10) {
  const entries = Object.entries(userStreaks)
    .map(([userId, data]) => ({
      userId,
      totalPoints: data.totalPoints,
      level: data.level,
      title: data.title,
      currentStreak: data.currentStreak,
      longestStreak: data.longestStreak,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, limit);

  return entries;
}

/**
 * Get all achievements with earned status for a user
 */
function getAllAchievements(userId) {
  const streak = getUserStreak(userId);
  return achievements.map((a) => ({
    ...a,
    earned: streak.earnedAchievements.includes(a.id),
  }));
}

module.exports = {
  getUserStreak,
  logDailyEntry,
  calculateLevel,
  getLeaderboard,
  getAllAchievements,
  achievements,
};
