/**
 * NutriTech - Nutrition Calculation Engine
 * Uses Mifflin-St Jeor Equation for BMR + Activity Level + Goal Adjustment
 */

/**
 * Calculate BMR using Mifflin-St Jeor Equation
 */
function calculateBMR(weight, height, age, gender) {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

/**
 * Activity multiplier based on job type and exercise frequency
 */
function getActivityMultiplier(jobType, exerciseFrequency) {
  const baseMultipliers = {
    desk: 1.2,       // Sedentary desk job
    moderate: 1.55,  // Moderately active job
    active: 1.725,   // Physically active job
    heavy: 1.9,      // Very heavy physical job
  };

  const exerciseBonus = {
    none: 0,
    light: 0.1,      // 1-2 days/week
    moderate: 0.2,   // 3-4 days/week
    intense: 0.3,    // 5-6 days/week
    athlete: 0.4,    // Daily intense training
  };

  const base = baseMultipliers[jobType] || 1.2;
  const bonus = exerciseBonus[exerciseFrequency] || 0;

  return base + bonus;
}

/**
 * Adjust calories based on fitness goal
 */
function adjustForGoal(tdee, goal) {
  switch (goal) {
    case "weight_loss":
      return Math.round(tdee * 0.80); // 20% deficit
    case "mild_weight_loss":
      return Math.round(tdee * 0.90); // 10% deficit
    case "muscle_gain":
      return Math.round(tdee * 1.15); // 15% surplus
    case "bulk":
      return Math.round(tdee * 1.25); // 25% surplus
    case "maintenance":
    case "energy_boost":
    default:
      return Math.round(tdee);
  }
}

/**
 * Calculate macronutrient split based on goal
 * Returns grams per day
 */
function calculateMacros(targetCalories, goal, weight) {
  let proteinRatio, carbRatio, fatRatio;

  switch (goal) {
    case "weight_loss":
    case "mild_weight_loss":
      proteinRatio = 0.35;
      carbRatio = 0.35;
      fatRatio = 0.30;
      break;
    case "muscle_gain":
    case "bulk":
      proteinRatio = 0.30;
      carbRatio = 0.45;
      fatRatio = 0.25;
      break;
    case "energy_boost":
      proteinRatio = 0.25;
      carbRatio = 0.50;
      fatRatio = 0.25;
      break;
    case "maintenance":
    default:
      proteinRatio = 0.25;
      carbRatio = 0.45;
      fatRatio = 0.30;
      break;
  }

  // Protein: 1g = 4 cal, Carbs: 1g = 4 cal, Fat: 1g = 9 cal
  const proteinGrams = Math.round((targetCalories * proteinRatio) / 4);
  const carbGrams = Math.round((targetCalories * carbRatio) / 4);
  const fatGrams = Math.round((targetCalories * fatRatio) / 9);

  // Ensure minimum protein based on body weight (at least 1.2g/kg)
  const minProtein = Math.round(weight * 1.2);
  const adjustedProtein = Math.max(proteinGrams, minProtein);

  return {
    protein: adjustedProtein,
    carbs: carbGrams,
    fat: fatGrams,
    proteinCalories: adjustedProtein * 4,
    carbCalories: carbGrams * 4,
    fatCalories: fatGrams * 9,
  };
}

/**
 * Calculate BMI
 */
function calculateBMI(weight, heightCm) {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  let category;

  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  return { bmi: Math.round(bmi * 10) / 10, category };
}

/**
 * Calculate daily water intake (ml)
 */
function calculateWaterIntake(weight, exerciseFrequency) {
  let base = weight * 35; // 35ml per kg
  const exerciseBonus = {
    none: 0,
    light: 300,
    moderate: 500,
    intense: 800,
    athlete: 1000,
  };
  base += exerciseBonus[exerciseFrequency] || 0;
  return Math.round(base);
}

/**
 * Full nutrition calculation
 */
function calculateNutrition(userData) {
  const { age, weight, height, gender, jobType, exerciseFrequency, goal } = userData;

  // 1. Calculate BMR
  const bmr = calculateBMR(weight, height, age, gender);

  // 2. Calculate TDEE (Total Daily Energy Expenditure)
  const activityMultiplier = getActivityMultiplier(jobType, exerciseFrequency);
  const tdee = Math.round(bmr * activityMultiplier);

  // 3. Adjust for goal
  const targetCalories = adjustForGoal(tdee, goal);

  // 4. Calculate macros
  const macros = calculateMacros(targetCalories, goal, weight);

  // 5. Calculate BMI
  const bmiData = calculateBMI(weight, height);

  // 6. Calculate water intake
  const waterIntake = calculateWaterIntake(weight, exerciseFrequency);

  // 7. Meal split (calories per meal)
  const mealSplit = {
    breakfast: Math.round(targetCalories * 0.25),
    lunch: Math.round(targetCalories * 0.35),
    snacks: Math.round(targetCalories * 0.10),
    dinner: Math.round(targetCalories * 0.30),
  };

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    macros,
    bmi: bmiData,
    waterIntake,
    mealSplit,
    activityMultiplier: Math.round(activityMultiplier * 100) / 100,
  };
}

module.exports = { calculateNutrition, calculateBMR, calculateBMI, calculateMacros };
