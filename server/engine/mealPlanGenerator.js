/**
 * NutriTech - Meal Plan Generator
 * Generates personalized Indian meal plans based on calorie & macro targets
 */

const indianFoods = require("../data/indianFoods");

/**
 * Filter foods by diet preference
 */
function filterByDiet(foods, dietPreference) {
  if (dietPreference === "veg") {
    return foods.filter((f) => f.category === "veg");
  }
  if (dietPreference === "nonveg") {
    return foods; // non-veg people eat everything
  }
  if (dietPreference === "eggetarian") {
    return foods.filter((f) => f.category === "veg" || f.name.toLowerCase().includes("egg"));
  }
  return foods;
}

/**
 * Smart food selector - picks foods to match target calories and macros
 */
function selectFoods(availableFoods, targetCalories, targetProtein, maxItems = 4) {
  const selected = [];
  let remainingCalories = targetCalories;
  let remainingProtein = targetProtein;
  const usedIndices = new Set();

  // Sort by protein density for better macro matching
  const sortedFoods = availableFoods
    .map((food, index) => ({ ...food, originalIndex: index }))
    .sort((a, b) => b.protein / b.calories - a.protein / a.calories);

  // First, pick a high-protein item if protein target is high
  if (remainingProtein > 15) {
    const highProtein = sortedFoods.find(
      (f) => f.protein >= 10 && f.calories <= remainingCalories && !usedIndices.has(f.originalIndex)
    );
    if (highProtein) {
      selected.push(highProtein);
      remainingCalories -= highProtein.calories;
      remainingProtein -= highProtein.protein;
      usedIndices.add(highProtein.originalIndex);
    }
  }

  // Fill remaining with balanced items
  while (selected.length < maxItems && remainingCalories > 50) {
    const candidates = sortedFoods.filter(
      (f) => f.calories <= remainingCalories + 50 && !usedIndices.has(f.originalIndex)
    );

    if (candidates.length === 0) break;

    // Pick randomly from top candidates for variety
    const topCandidates = candidates.slice(0, Math.max(3, Math.floor(candidates.length / 2)));
    const pick = topCandidates[Math.floor(Math.random() * topCandidates.length)];

    selected.push(pick);
    remainingCalories -= pick.calories;
    remainingProtein -= pick.protein;
    usedIndices.add(pick.originalIndex);
  }

  return selected;
}

/**
 * Generate a complete daily meal plan
 */
function generateMealPlan(nutritionData, dietPreference = "nonveg") {
  const { targetCalories, macros, mealSplit } = nutritionData;

  const breakfastFoods = filterByDiet(indianFoods.breakfast, dietPreference);
  const lunchFoods = filterByDiet(indianFoods.lunch, dietPreference);
  const snackFoods = filterByDiet(indianFoods.snacks, dietPreference);
  const dinnerFoods = filterByDiet(indianFoods.dinner, dietPreference);

  const proteinPerMeal = {
    breakfast: Math.round(macros.protein * 0.25),
    lunch: Math.round(macros.protein * 0.30),
    snacks: Math.round(macros.protein * 0.15),
    dinner: Math.round(macros.protein * 0.30),
  };

  const breakfast = selectFoods(breakfastFoods, mealSplit.breakfast, proteinPerMeal.breakfast, 3);
  const lunch = selectFoods(lunchFoods, mealSplit.lunch, proteinPerMeal.lunch, 4);
  const snacks = selectFoods(snackFoods, mealSplit.snacks, proteinPerMeal.snacks, 2);
  const dinner = selectFoods(dinnerFoods, mealSplit.dinner, proteinPerMeal.dinner, 3);

  // Calculate totals
  const allFoods = [...breakfast, ...lunch, ...snacks, ...dinner];
  const totals = allFoods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    meals: {
      breakfast: {
        items: breakfast.map((f) => ({ name: f.name, calories: f.calories, protein: f.protein, carbs: f.carbs, fat: f.fat })),
        targetCalories: mealSplit.breakfast,
        actualCalories: breakfast.reduce((s, f) => s + f.calories, 0),
      },
      lunch: {
        items: lunch.map((f) => ({ name: f.name, calories: f.calories, protein: f.protein, carbs: f.carbs, fat: f.fat })),
        targetCalories: mealSplit.lunch,
        actualCalories: lunch.reduce((s, f) => s + f.calories, 0),
      },
      snacks: {
        items: snacks.map((f) => ({ name: f.name, calories: f.calories, protein: f.protein, carbs: f.carbs, fat: f.fat })),
        targetCalories: mealSplit.snacks,
        actualCalories: snacks.reduce((s, f) => s + f.calories, 0),
      },
      dinner: {
        items: dinner.map((f) => ({ name: f.name, calories: f.calories, protein: f.protein, carbs: f.carbs, fat: f.fat })),
        targetCalories: mealSplit.dinner,
        actualCalories: dinner.reduce((s, f) => s + f.calories, 0),
      },
    },
    totals,
    targets: {
      calories: targetCalories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
    },
  };
}

/**
 * Generate weekly meal plan (7 days of variety)
 */
function generateWeeklyPlan(nutritionData, dietPreference = "nonveg") {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const weeklyPlan = {};

  days.forEach((day) => {
    weeklyPlan[day] = generateMealPlan(nutritionData, dietPreference);
  });

  return weeklyPlan;
}

module.exports = { generateMealPlan, generateWeeklyPlan };
