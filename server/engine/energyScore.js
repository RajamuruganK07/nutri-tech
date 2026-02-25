/**
 * NutriTech - AI Energy Score Engine
 * Calculates a daily Energy Score out of 100 based on multiple health factors
 */

/**
 * Calculate Energy Score (0-100)
 * Factors: calories adherence, protein adherence, sleep, steps, water, workout
 */
function calculateEnergyScore(data) {
  const {
    caloriesConsumed,
    caloriesTarget,
    proteinConsumed,
    proteinTarget,
    sleepHours,
    stepsCount,
    waterIntakeMl,
    waterTarget,
    workoutMinutes,
    workoutIntensity, // none, light, moderate, intense
  } = data;

  const scores = {};
  const reasons = [];
  const tips = [];

  // 1. Calorie Adherence Score (max 25 pts)
  if (caloriesTarget > 0) {
    const ratio = caloriesConsumed / caloriesTarget;
    if (ratio >= 0.9 && ratio <= 1.1) {
      scores.calories = 25;
    } else if (ratio >= 0.8 && ratio <= 1.2) {
      scores.calories = 20;
    } else if (ratio >= 0.7 && ratio <= 1.3) {
      scores.calories = 15;
    } else if (ratio >= 0.5) {
      scores.calories = 10;
      reasons.push("Calorie intake is significantly off target");
      tips.push("Try to eat closer to your daily calorie goal");
    } else {
      scores.calories = 5;
      reasons.push("Very low calorie intake detected");
      tips.push("You're severely under-eating. Add a proper meal");
    }
  } else {
    scores.calories = 15;
  }

  // 2. Protein Adherence Score (max 20 pts)
  if (proteinTarget > 0) {
    const proteinRatio = proteinConsumed / proteinTarget;
    if (proteinRatio >= 0.9) {
      scores.protein = 20;
    } else if (proteinRatio >= 0.7) {
      scores.protein = 15;
      reasons.push("Protein intake is below target");
      tips.push("Add eggs, dal, chicken, or a protein shake");
    } else if (proteinRatio >= 0.5) {
      scores.protein = 10;
      reasons.push("Low protein — muscle recovery affected");
      tips.push("You need more protein-rich foods throughout the day");
    } else {
      scores.protein = 5;
      reasons.push("Very low protein — energy and recovery impacted");
      tips.push("Urgently increase protein: paneer, eggs, chicken, whey");
    }
  } else {
    scores.protein = 12;
  }

  // 3. Sleep Score (max 20 pts)
  if (sleepHours >= 7 && sleepHours <= 9) {
    scores.sleep = 20;
  } else if (sleepHours >= 6) {
    scores.sleep = 15;
    reasons.push("Slightly less sleep than optimal");
    tips.push("Aim for 7-8 hours of sleep for peak energy");
  } else if (sleepHours >= 5) {
    scores.sleep = 10;
    reasons.push("Poor sleep — fatigue likely");
    tips.push("Sleep deprivation impacts metabolism and focus");
  } else if (sleepHours >= 3) {
    scores.sleep = 5;
    reasons.push("Severe sleep deficit");
    tips.push("Your body needs rest. Prioritize sleep tonight");
  } else {
    scores.sleep = 2;
    reasons.push("Critical sleep deprivation");
    tips.push("This level of sleep loss is dangerous. Rest immediately");
  }

  // 4. Steps Score (max 15 pts)
  if (stepsCount >= 10000) {
    scores.steps = 15;
  } else if (stepsCount >= 7000) {
    scores.steps = 12;
  } else if (stepsCount >= 5000) {
    scores.steps = 9;
    tips.push("Try to walk more — aim for 10,000 steps");
  } else if (stepsCount >= 3000) {
    scores.steps = 6;
    reasons.push("Low activity — too much sitting");
    tips.push("Take walking breaks every hour at your desk");
  } else {
    scores.steps = 3;
    reasons.push("Very sedentary day");
    tips.push("Even a 20-minute walk can boost your energy significantly");
  }

  // 5. Water Score (max 10 pts)
  const effectiveWaterTarget = waterTarget || 2500;
  const waterRatio = waterIntakeMl / effectiveWaterTarget;
  if (waterRatio >= 0.9) {
    scores.water = 10;
  } else if (waterRatio >= 0.7) {
    scores.water = 7;
    tips.push("Drink a bit more water today");
  } else if (waterRatio >= 0.5) {
    scores.water = 5;
    reasons.push("Dehydration risk — low water intake");
    tips.push("Keep a water bottle at your desk. Aim for 3L");
  } else {
    scores.water = 2;
    reasons.push("Severely dehydrated");
    tips.push("Drink water now. Dehydration causes fatigue and headaches");
  }

  // 6. Workout Score (max 10 pts)
  const intensityMultiplier = {
    none: 0,
    light: 0.6,
    moderate: 0.8,
    intense: 1.0,
  };
  const mult = intensityMultiplier[workoutIntensity] || 0;

  if (workoutMinutes >= 45 && mult >= 0.8) {
    scores.workout = 10;
  } else if (workoutMinutes >= 30 && mult >= 0.6) {
    scores.workout = 8;
  } else if (workoutMinutes >= 15) {
    scores.workout = 5;
    tips.push("Great that you moved! Try to extend workout to 30+ min");
  } else if (workoutMinutes > 0) {
    scores.workout = 3;
    tips.push("Short workout detected. Consistency matters more than duration");
  } else {
    scores.workout = 0;
    if (reasons.length < 3) {
      tips.push("No workout today. Even 15 minutes of movement helps");
    }
  }

  // Calculate total
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);

  // Grade
  let grade, gradeColor;
  if (totalScore >= 85) {
    grade = "Excellent";
    gradeColor = "#10b981";
  } else if (totalScore >= 70) {
    grade = "Good";
    gradeColor = "#3b82f6";
  } else if (totalScore >= 55) {
    grade = "Average";
    gradeColor = "#f59e0b";
  } else if (totalScore >= 40) {
    grade = "Below Average";
    gradeColor = "#f97316";
  } else {
    grade = "Poor";
    gradeColor = "#ef4444";
  }

  return {
    totalScore,
    maxScore: 100,
    grade,
    gradeColor,
    breakdown: {
      calories: { score: scores.calories, max: 25, label: "Calorie Adherence" },
      protein: { score: scores.protein, max: 20, label: "Protein Intake" },
      sleep: { score: scores.sleep, max: 20, label: "Sleep Quality" },
      steps: { score: scores.steps, max: 15, label: "Daily Activity" },
      water: { score: scores.water, max: 10, label: "Hydration" },
      workout: { score: scores.workout, max: 10, label: "Workout" },
    },
    reasons: reasons.slice(0, 3),
    tips: tips.slice(0, 4),
  };
}

module.exports = { calculateEnergyScore };
