/**
 * NutriTech - Performance Modes System
 * Not just diet — Performance Optimization Platform
 * Focus Mode | Energy Mode | Muscle Mode | Fat Loss Mode
 */

const performanceModes = {
  focus: {
    id: "focus",
    name: "Focus Mode",
    icon: "🧠",
    tagline: "Sharpen your mind, fuel your brain",
    color: "#3b82f6",
    description: "Optimized nutrition for deep work, coding sessions, and mental clarity.",
    macroAdjustment: {
      proteinRatio: 0.25,
      carbRatio: 0.50, // Brain runs on glucose
      fatRatio: 0.25,  // Omega-3 fats for brain health
    },
    calorieAdjustment: 1.0, // Maintenance
    priorityFoods: [
      "Almonds (10 pcs)", "Green Tea", "Oats Porridge", "Fish Curry",
      "Banana", "Sprouts Salad", "Curd / Yogurt", "Brown Rice",
    ],
    avoidFoods: ["Heavy fried foods", "Excess sugar", "Large meals before deep work"],
    schedule: {
      breakfast: "7:00 AM — Light, brain-fueling breakfast",
      midMorning: "10:00 AM — Green tea + almonds",
      lunch: "12:30 PM — Moderate meal with complex carbs",
      afternoon: "3:00 PM — Light snack to prevent brain fog",
      dinner: "7:30 PM — Balanced, not heavy",
    },
    tips: [
      "Eat smaller, frequent meals to maintain blood sugar",
      "Omega-3 from fish/walnuts boosts cognitive function",
      "Stay hydrated — even 2% dehydration reduces focus by 20%",
      "Avoid sugar crashes — choose complex carbs over refined",
      "Green tea has L-theanine which promotes calm focus",
    ],
  },

  energy: {
    id: "energy",
    name: "Energy Mode",
    icon: "⚡",
    tagline: "Maximum energy, all day long",
    color: "#f59e0b",
    description: "Designed for IT professionals who need sustained energy without crashes.",
    macroAdjustment: {
      proteinRatio: 0.25,
      carbRatio: 0.50,
      fatRatio: 0.25,
    },
    calorieAdjustment: 1.05, // Slight surplus for energy
    priorityFoods: [
      "Banana", "Oats Porridge", "Pongal", "Rice + Dal",
      "Peanuts (30g)", "Milk (1 glass)", "Sprouts Chaat", "Chapati + Dal",
    ],
    avoidFoods: ["Excess caffeine after 3 PM", "Refined sugar", "Skipping meals"],
    schedule: {
      breakfast: "7:30 AM — Carb-rich energizing breakfast",
      midMorning: "10:30 AM — Fruit + nuts",
      lunch: "1:00 PM — Full meal with rice/roti + protein",
      afternoon: "4:00 PM — Light snack + buttermilk",
      dinner: "8:00 PM — Moderate dinner, not too late",
    },
    tips: [
      "Never skip breakfast — it sets your energy for the whole day",
      "Eat every 3-4 hours to maintain steady energy",
      "Complex carbs (oats, brown rice) release energy slowly",
      "Iron-rich foods (spinach, ragi) prevent energy-draining anemia",
      "Morning sunlight + breakfast = optimal cortisol and energy",
    ],
  },

  muscle: {
    id: "muscle",
    name: "Muscle Mode",
    icon: "💪",
    tagline: "Build lean muscle, optimize recovery",
    color: "#ef4444",
    description: "High-protein, calorie-surplus plan for gym-goers and strength training.",
    macroAdjustment: {
      proteinRatio: 0.35,
      carbRatio: 0.40,
      fatRatio: 0.25,
    },
    calorieAdjustment: 1.15, // 15% surplus
    priorityFoods: [
      "Protein Shake", "Boiled Eggs (2)", "Grilled Chicken Breast",
      "Paneer Tikka", "Dal Fry", "Brown Rice", "Banana", "Almonds (10 pcs)",
    ],
    avoidFoods: ["Alcohol", "Empty calories", "Skipping post-workout meal"],
    schedule: {
      breakfast: "7:00 AM — High-protein breakfast (eggs + oats)",
      preworkout: "30 min before gym — Banana + coffee",
      postworkout: "Within 30 min — Protein shake + banana",
      lunch: "1:00 PM — Rice + chicken/paneer + dal",
      snack: "4:30 PM — Peanuts + whey shake",
      dinner: "8:30 PM — Chapati + chicken/eggs + salad",
    },
    tips: [
      "Aim for 1.6-2.2g protein per kg body weight",
      "Spread protein across 4-5 meals (30g per meal max)",
      "Post-workout protein within 30 min is critical",
      "Progressive overload in gym + nutrition = muscle growth",
      "Sleep 7-8 hours — muscles grow during rest, not in the gym",
    ],
  },

  fatloss: {
    id: "fatloss",
    name: "Fat Loss Mode",
    icon: "🔥",
    tagline: "Burn fat, keep muscle, stay strong",
    color: "#10b981",
    description: "Calorie deficit with high protein to lose fat while preserving muscle mass.",
    macroAdjustment: {
      proteinRatio: 0.40,
      carbRatio: 0.30,
      fatRatio: 0.30,
    },
    calorieAdjustment: 0.80, // 20% deficit
    priorityFoods: [
      "Grilled Chicken Breast", "Egg Whites (3)", "Sprouts Salad",
      "Green Tea", "Salad (mixed)", "Dal Fry", "Curd / Yogurt", "Fish Curry",
    ],
    avoidFoods: ["Fried foods", "Sugar/sweets", "White rice (excess)", "Fruit juices"],
    schedule: {
      breakfast: "8:00 AM — Protein-rich, moderate carbs",
      midMorning: "11:00 AM — Green tea + almonds",
      lunch: "1:30 PM — High protein + salad + small portion rice",
      afternoon: "4:30 PM — Sprouts or egg whites",
      dinner: "7:30 PM — Protein + vegetables, minimal carbs",
    },
    tips: [
      "500 kcal daily deficit = ~0.5 kg/week sustainable fat loss",
      "High protein (1.5-2g/kg) prevents muscle loss during deficit",
      "NEVER go below BMR calories — it slows metabolism",
      "Fiber-rich foods (vegetables, dal) keep you full longer",
      "Strength training during fat loss preserves muscle mass",
    ],
  },
};

/**
 * Get mode details
 */
function getPerformanceMode(modeId) {
  return performanceModes[modeId] || null;
}

/**
 * Get all available modes
 */
function getAllModes() {
  return Object.values(performanceModes).map((mode) => ({
    id: mode.id,
    name: mode.name,
    icon: mode.icon,
    tagline: mode.tagline,
    color: mode.color,
    description: mode.description,
  }));
}

/**
 * Apply performance mode to nutrition calculation
 */
function applyModeToNutrition(nutritionData, modeId) {
  const mode = performanceModes[modeId];
  if (!mode) return nutritionData;

  const adjustedCalories = Math.round(nutritionData.tdee * mode.calorieAdjustment);

  const protein = Math.round((adjustedCalories * mode.macroAdjustment.proteinRatio) / 4);
  const carbs = Math.round((adjustedCalories * mode.macroAdjustment.carbRatio) / 4);
  const fat = Math.round((adjustedCalories * mode.macroAdjustment.fatRatio) / 9);

  return {
    ...nutritionData,
    targetCalories: adjustedCalories,
    macros: {
      protein,
      carbs,
      fat,
      proteinCalories: protein * 4,
      carbCalories: carbs * 4,
      fatCalories: fat * 9,
    },
    mealSplit: {
      breakfast: Math.round(adjustedCalories * 0.25),
      lunch: Math.round(adjustedCalories * 0.35),
      snacks: Math.round(adjustedCalories * 0.10),
      dinner: Math.round(adjustedCalories * 0.30),
    },
    appliedMode: {
      id: mode.id,
      name: mode.name,
      icon: mode.icon,
      tips: mode.tips,
      schedule: mode.schedule,
      priorityFoods: mode.priorityFoods,
      avoidFoods: mode.avoidFoods,
    },
  };
}

module.exports = { getPerformanceMode, getAllModes, applyModeToNutrition, performanceModes };
