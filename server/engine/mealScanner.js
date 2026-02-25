/**
 * NutriTech - AI Meal Scanner (Simulated)
 * "Scan your plate, know your nutrition"
 * Simulates food photo analysis for calorie/macro estimation
 */

// Common Indian meal database for simulated recognition
const recognizableMeals = {
  "rice_dal": {
    name: "Rice + Dal",
    items: [
      { name: "White Rice (1 cup)", calories: 200, protein: 4, carbs: 45, fat: 0.5 },
      { name: "Dal Fry (1 bowl)", calories: 180, protein: 12, carbs: 22, fat: 5 },
    ],
    confidence: 94,
  },
  "roti_sabzi": {
    name: "Roti + Sabzi",
    items: [
      { name: "Wheat Roti (2 pcs)", calories: 200, protein: 6, carbs: 38, fat: 3 },
      { name: "Mixed Veg Sabzi (1 bowl)", calories: 120, protein: 4, carbs: 15, fat: 5 },
    ],
    confidence: 91,
  },
  "idli_sambar": {
    name: "Idli + Sambar",
    items: [
      { name: "Idli (3 pcs)", calories: 195, protein: 6, carbs: 39, fat: 1.5 },
      { name: "Sambar (1 bowl)", calories: 130, protein: 8, carbs: 18, fat: 3 },
    ],
    confidence: 96,
  },
  "dosa_chutney": {
    name: "Dosa + Chutney",
    items: [
      { name: "Masala Dosa (1 pc)", calories: 250, protein: 6, carbs: 30, fat: 12 },
      { name: "Coconut Chutney", calories: 50, protein: 1, carbs: 3, fat: 4 },
    ],
    confidence: 93,
  },
  "chicken_rice": {
    name: "Chicken Biryani",
    items: [
      { name: "Chicken Biryani (1 plate)", calories: 490, protein: 28, carbs: 55, fat: 18 },
      { name: "Raita (1 bowl)", calories: 60, protein: 3, carbs: 5, fat: 3 },
    ],
    confidence: 89,
  },
  "egg_curry": {
    name: "Egg Curry + Rice",
    items: [
      { name: "Egg Curry (2 eggs)", calories: 260, protein: 16, carbs: 8, fat: 18 },
      { name: "White Rice (1 cup)", calories: 200, protein: 4, carbs: 45, fat: 0.5 },
    ],
    confidence: 90,
  },
  "paneer_butter": {
    name: "Paneer Butter Masala + Naan",
    items: [
      { name: "Paneer Butter Masala (1 bowl)", calories: 380, protein: 18, carbs: 14, fat: 28 },
      { name: "Butter Naan (2 pcs)", calories: 320, protein: 8, carbs: 48, fat: 10 },
    ],
    confidence: 87,
  },
  "poha": {
    name: "Poha (Flattened Rice)",
    items: [
      { name: "Poha (1 plate)", calories: 250, protein: 5, carbs: 42, fat: 8 },
      { name: "Peanuts garnish", calories: 60, protein: 3, carbs: 2, fat: 5 },
    ],
    confidence: 92,
  },
  "pongal": {
    name: "Ven Pongal",
    items: [
      { name: "Pongal (1 plate)", calories: 300, protein: 9, carbs: 40, fat: 12 },
      { name: "Coconut Chutney", calories: 50, protein: 1, carbs: 3, fat: 4 },
    ],
    confidence: 91,
  },
  "paratha": {
    name: "Aloo Paratha + Curd",
    items: [
      { name: "Aloo Paratha (2 pcs)", calories: 400, protein: 10, carbs: 52, fat: 18 },
      { name: "Curd (1 bowl)", calories: 60, protein: 4, carbs: 5, fat: 3 },
    ],
    confidence: 88,
  },
  "omelette": {
    name: "Egg Omelette + Toast",
    items: [
      { name: "Omelette (2 eggs)", calories: 180, protein: 12, carbs: 2, fat: 14 },
      { name: "Wheat Toast (2 pcs)", calories: 140, protein: 4, carbs: 26, fat: 2 },
    ],
    confidence: 95,
  },
  "salad": {
    name: "Mixed Salad",
    items: [
      { name: "Mixed Vegetables", calories: 45, protein: 2, carbs: 8, fat: 0.5 },
      { name: "Paneer cubes (50g)", calories: 130, protein: 9, carbs: 2, fat: 10 },
      { name: "Olive Oil Dressing", calories: 90, protein: 0, carbs: 0, fat: 10 },
    ],
    confidence: 85,
  },
  "fruit_bowl": {
    name: "Fresh Fruit Bowl",
    items: [
      { name: "Banana (1)", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
      { name: "Apple (1)", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
      { name: "Grapes (small bunch)", calories: 60, protein: 0.6, carbs: 16, fat: 0.2 },
    ],
    confidence: 92,
  },
  "samosa": {
    name: "Samosa + Chai",
    items: [
      { name: "Samosa (2 pcs)", calories: 300, protein: 6, carbs: 32, fat: 18 },
      { name: "Masala Chai (1 cup)", calories: 80, protein: 2, carbs: 12, fat: 3 },
    ],
    confidence: 94,
  },
  "protein_shake": {
    name: "Protein Shake",
    items: [
      { name: "Whey Protein (1 scoop)", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
      { name: "Banana (1)", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
      { name: "Milk (200ml)", calories: 100, protein: 6, carbs: 10, fat: 4 },
    ],
    confidence: 88,
  },
};

/**
 * Simulate scanning a meal from text description
 */
function scanMeal(description) {
  const desc = description.toLowerCase();

  // Try to match known meals
  let bestMatch = null;
  let bestScore = 0;

  for (const [key, meal] of Object.entries(recognizableMeals)) {
    const keywords = key.split("_");
    const nameWords = meal.name.toLowerCase().split(/\s+/);
    const allKeywords = [...keywords, ...nameWords];

    let matchScore = 0;
    for (const kw of allKeywords) {
      if (desc.includes(kw)) matchScore++;
    }

    if (matchScore > bestScore) {
      bestScore = matchScore;
      bestMatch = meal;
    }
  }

  if (!bestMatch || bestScore === 0) {
    // Estimate from description words
    return estimateFromDescription(description);
  }

  const totalCalories = bestMatch.items.reduce((s, i) => s + i.calories, 0);
  const totalProtein = bestMatch.items.reduce((s, i) => s + i.protein, 0);
  const totalCarbs = bestMatch.items.reduce((s, i) => s + i.carbs, 0);
  const totalFat = bestMatch.items.reduce((s, i) => s + i.fat, 0);

  let healthRating;
  if (totalProtein / totalCalories > 0.12) healthRating = "High Protein";
  else if (totalFat / totalCalories > 0.35) healthRating = "High Fat";
  else if (totalCalories > 500) healthRating = "Heavy Meal";
  else healthRating = "Balanced";

  return {
    success: true,
    mealName: bestMatch.name,
    confidence: bestMatch.confidence,
    items: bestMatch.items,
    totals: {
      calories: totalCalories,
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
    },
    healthRating,
    suggestion: generateMealSuggestion(totalCalories, totalProtein, totalFat),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Estimate nutrition from unknown description
 */
function estimateFromDescription(description) {
  const words = description.toLowerCase().split(/\s+/);
  let estimatedCalories = 300; // Base estimate
  let estimatedProtein = 10;
  let estimatedCarbs = 40;
  let estimatedFat = 10;

  // Rough keyword-based estimation
  const modifiers = {
    large: 1.5, big: 1.5, double: 2, extra: 1.3,
    small: 0.6, half: 0.5, light: 0.7, mini: 0.5,
    fried: 1.4, deep: 1.5, grilled: 0.9, boiled: 0.8, baked: 0.9,
  };

  let multiplier = 1;
  for (const word of words) {
    if (modifiers[word]) multiplier *= modifiers[word];
  }

  estimatedCalories = Math.round(estimatedCalories * multiplier);
  estimatedProtein = Math.round(estimatedProtein * multiplier);
  estimatedCarbs = Math.round(estimatedCarbs * multiplier);
  estimatedFat = Math.round(estimatedFat * multiplier);

  return {
    success: true,
    mealName: description,
    confidence: 55,
    items: [
      {
        name: description,
        calories: estimatedCalories,
        protein: estimatedProtein,
        carbs: estimatedCarbs,
        fat: estimatedFat,
      },
    ],
    totals: {
      calories: estimatedCalories,
      protein: estimatedProtein,
      carbs: estimatedCarbs,
      fat: estimatedFat,
    },
    healthRating: "Estimated",
    suggestion: "For better accuracy, try describing specific Indian dishes like 'rice dal', 'idli sambar', 'chicken biryani', etc.",
    timestamp: new Date().toISOString(),
    isEstimated: true,
  };
}

/**
 * Generate meal improvement suggestion
 */
function generateMealSuggestion(calories, protein, fat) {
  const suggestions = [];

  if (calories > 600) {
    suggestions.push("This is a high-calorie meal. Consider smaller portions or splitting into two sittings.");
  }
  if (protein < 15) {
    suggestions.push("Low protein detected. Add dal, paneer, eggs, or chicken to boost protein.");
  }
  if (fat > 25) {
    suggestions.push("High fat content. Try grilled/baked alternatives instead of fried.");
  }
  if (protein > 25 && calories < 400) {
    suggestions.push("Great high-protein, moderate-calorie meal! Perfect for muscle building.");
  }

  return suggestions.length > 0
    ? suggestions.join(" ")
    : "This looks like a well-balanced meal. Keep it up!";
}

/**
 * Get list of scannable meals
 */
function getScannableMeals() {
  return Object.entries(recognizableMeals).map(([key, meal]) => ({
    id: key,
    name: meal.name,
    items: meal.items.length,
    totalCalories: meal.items.reduce((s, i) => s + i.calories, 0),
  }));
}

module.exports = { scanMeal, getScannableMeals };
