/**
 * NutriTech - Smart Grocery Recommendation Engine
 * Generates grocery lists with estimated costs from weekly meal plans
 */

// Indian ingredient database with average prices (INR)
const ingredientPrices = {
  // Grains & Cereals
  rice: { unit: "kg", pricePerUnit: 55, category: "Grains" },
  wheat_flour: { unit: "kg", pricePerUnit: 40, category: "Grains" },
  rava: { unit: "kg", pricePerUnit: 45, category: "Grains" },
  poha: { unit: "kg", pricePerUnit: 50, category: "Grains" },
  oats: { unit: "500g", pricePerUnit: 80, category: "Grains" },
  ragi_flour: { unit: "kg", pricePerUnit: 60, category: "Grains" },
  jowar_flour: { unit: "kg", pricePerUnit: 55, category: "Grains" },
  brown_rice: { unit: "kg", pricePerUnit: 90, category: "Grains" },
  quinoa: { unit: "500g", pricePerUnit: 250, category: "Grains" },
  bread: { unit: "pack", pricePerUnit: 40, category: "Grains" },

  // Pulses & Lentils
  toor_dal: { unit: "kg", pricePerUnit: 120, category: "Pulses" },
  moong_dal: { unit: "kg", pricePerUnit: 130, category: "Pulses" },
  urad_dal: { unit: "kg", pricePerUnit: 110, category: "Pulses" },
  chana_dal: { unit: "kg", pricePerUnit: 100, category: "Pulses" },
  rajma: { unit: "kg", pricePerUnit: 140, category: "Pulses" },
  chole: { unit: "kg", pricePerUnit: 100, category: "Pulses" },
  sprouts: { unit: "250g", pricePerUnit: 30, category: "Pulses" },

  // Proteins
  eggs: { unit: "dozen", pricePerUnit: 80, category: "Protein" },
  chicken: { unit: "kg", pricePerUnit: 200, category: "Protein" },
  fish: { unit: "kg", pricePerUnit: 300, category: "Protein" },
  paneer: { unit: "200g", pricePerUnit: 80, category: "Protein" },
  whey_protein: { unit: "scoop(30g)", pricePerUnit: 50, category: "Protein" },
  protein_bar: { unit: "piece", pricePerUnit: 120, category: "Protein" },

  // Dairy
  milk: { unit: "liter", pricePerUnit: 55, category: "Dairy" },
  curd: { unit: "500g", pricePerUnit: 35, category: "Dairy" },
  butter: { unit: "100g", pricePerUnit: 55, category: "Dairy" },
  ghee: { unit: "200ml", pricePerUnit: 120, category: "Dairy" },
  buttermilk: { unit: "liter", pricePerUnit: 30, category: "Dairy" },

  // Vegetables
  onion: { unit: "kg", pricePerUnit: 35, category: "Vegetables" },
  tomato: { unit: "kg", pricePerUnit: 40, category: "Vegetables" },
  potato: { unit: "kg", pricePerUnit: 30, category: "Vegetables" },
  spinach: { unit: "bunch", pricePerUnit: 20, category: "Vegetables" },
  mixed_vegetables: { unit: "kg", pricePerUnit: 60, category: "Vegetables" },
  capsicum: { unit: "250g", pricePerUnit: 25, category: "Vegetables" },
  cabbage: { unit: "piece", pricePerUnit: 30, category: "Vegetables" },
  beans: { unit: "250g", pricePerUnit: 20, category: "Vegetables" },
  carrot: { unit: "250g", pricePerUnit: 20, category: "Vegetables" },
  brinjal: { unit: "250g", pricePerUnit: 20, category: "Vegetables" },
  drumstick: { unit: "250g", pricePerUnit: 25, category: "Vegetables" },
  coconut: { unit: "piece", pricePerUnit: 30, category: "Vegetables" },

  // Fruits
  banana: { unit: "dozen", pricePerUnit: 50, category: "Fruits" },
  apple: { unit: "kg", pricePerUnit: 150, category: "Fruits" },
  seasonal_fruits: { unit: "kg", pricePerUnit: 80, category: "Fruits" },

  // Dry Fruits & Seeds
  almonds: { unit: "100g", pricePerUnit: 120, category: "Dry Fruits" },
  peanuts: { unit: "250g", pricePerUnit: 40, category: "Dry Fruits" },
  cashews: { unit: "100g", pricePerUnit: 100, category: "Dry Fruits" },
  makhana: { unit: "100g", pricePerUnit: 80, category: "Dry Fruits" },
  mixed_dry_fruits: { unit: "100g", pricePerUnit: 110, category: "Dry Fruits" },

  // Spices & Essentials
  cooking_oil: { unit: "liter", pricePerUnit: 140, category: "Essentials" },
  salt: { unit: "kg", pricePerUnit: 20, category: "Essentials" },
  sugar: { unit: "kg", pricePerUnit: 45, category: "Essentials" },
  tea_powder: { unit: "250g", pricePerUnit: 60, category: "Essentials" },
  green_tea: { unit: "25 bags", pricePerUnit: 120, category: "Essentials" },
  spices_pack: { unit: "combo", pricePerUnit: 200, category: "Essentials" },
};

/**
 * Map food items to grocery ingredients
 */
const foodToIngredients = {
  "idli": ["rice", "urad_dal", "cooking_oil"],
  "dosa": ["rice", "urad_dal", "cooking_oil"],
  "sambar": ["toor_dal", "mixed_vegetables", "spices_pack", "drumstick"],
  "upma": ["rava", "onion", "cooking_oil"],
  "poha": ["poha", "onion", "peanuts"],
  "pongal": ["rice", "moong_dal", "ghee"],
  "paratha": ["wheat_flour", "potato", "butter"],
  "rice": ["rice"],
  "dal": ["toor_dal", "onion", "tomato", "ghee"],
  "chapati": ["wheat_flour", "cooking_oil"],
  "chicken": ["chicken", "onion", "tomato", "spices_pack"],
  "egg": ["eggs", "cooking_oil"],
  "paneer": ["paneer", "onion", "tomato", "spices_pack"],
  "fish": ["fish", "onion", "tomato", "coconut"],
  "curd": ["curd"],
  "milk": ["milk"],
  "banana": ["banana"],
  "oats": ["oats", "milk"],
  "protein": ["whey_protein"],
  "salad": ["mixed_vegetables", "carrot", "onion"],
  "soup": ["mixed_vegetables", "onion"],
  "biryani": ["rice", "onion", "tomato", "spices_pack", "ghee"],
  "rajma": ["rajma", "onion", "tomato"],
  "chole": ["chole", "onion", "tomato"],
  "roti": ["wheat_flour"],
  "quinoa": ["quinoa"],
  "peanuts": ["peanuts"],
  "almonds": ["almonds"],
  "dry_fruits": ["mixed_dry_fruits"],
  "green_tea": ["green_tea"],
  "sprouts": ["sprouts"],
  "makhana": ["makhana"],
  "buttermilk": ["buttermilk"],
};

/**
 * Generate grocery list from a meal plan
 */
function generateGroceryList(mealPlan, days = 7) {
  const groceryMap = {};

  // Collect all food items from meal plan
  const allMeals = mealPlan.meals || mealPlan;
  const allItems = [];

  if (allMeals.breakfast) allItems.push(...allMeals.breakfast.items);
  if (allMeals.lunch) allItems.push(...allMeals.lunch.items);
  if (allMeals.snacks) allItems.push(...allMeals.snacks.items);
  if (allMeals.dinner) allItems.push(...allMeals.dinner.items);

  // Map food items to ingredients
  allItems.forEach((item) => {
    const itemName = item.name.toLowerCase();

    // Find matching ingredient mapping
    for (const [keyword, ingredients] of Object.entries(foodToIngredients)) {
      if (itemName.includes(keyword)) {
        ingredients.forEach((ing) => {
          if (!groceryMap[ing]) {
            groceryMap[ing] = { count: 0, ...ingredientPrices[ing] };
          }
          groceryMap[ing].count += days; // multiply by days in week
        });
        break;
      }
    }
  });

  // Always add essentials
  ["cooking_oil", "salt", "onion", "tomato", "spices_pack"].forEach((essential) => {
    if (!groceryMap[essential]) {
      groceryMap[essential] = { count: 1, ...ingredientPrices[essential] };
    }
  });

  // Build grocery list grouped by category
  const groceryList = {};
  let totalCost = 0;

  Object.entries(groceryMap).forEach(([name, data]) => {
    const quantity = Math.ceil(data.count / 7); // normalize to reasonable quantity
    const cost = quantity * (data.pricePerUnit || 0);
    totalCost += cost;

    const category = data.category || "Other";
    if (!groceryList[category]) {
      groceryList[category] = [];
    }

    groceryList[category].push({
      name: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      quantity,
      unit: data.unit || "unit",
      pricePerUnit: data.pricePerUnit || 0,
      totalPrice: cost,
    });
  });

  return {
    groceryList,
    totalEstimatedCost: totalCost,
    totalItems: Object.values(groceryList).reduce((sum, items) => sum + items.length, 0),
    currency: "INR",
    note: "Prices are approximate averages. Actual prices may vary by location.",
    storePartners: [
      { name: "BigBasket", icon: "🛒", discount: "10% on first order" },
      { name: "Zepto", icon: "⚡", discount: "Free delivery over ₹199" },
      { name: "Swiggy Instamart", icon: "🛵", discount: "Flat ₹50 off" },
      { name: "DMart Ready", icon: "🏪", discount: "Best prices guaranteed" },
    ],
  };
}

module.exports = { generateGroceryList, ingredientPrices };
