/**
 * NutriTech - Indian Regional Food Database
 * Region-specific food items for Tamil Nadu, Kerala, North India, and more
 * Localization advantage — massive competitive moat
 */

const regionalFoods = {
  tamilnadu: {
    name: "Tamil Nadu",
    icon: "🏛️",
    breakfast: [
      { name: "Idli + Sambar", calories: 250, protein: 10, carbs: 44, fat: 4, category: "veg" },
      { name: "Pongal + Coconut Chutney", calories: 280, protein: 8, carbs: 38, fat: 12, category: "veg" },
      { name: "Dosa + Podi", calories: 200, protein: 5, carbs: 28, fat: 8, category: "veg" },
      { name: "Rava Upma", calories: 210, protein: 5, carbs: 32, fat: 7, category: "veg" },
      { name: "Adai Dosa", calories: 230, protein: 8, carbs: 30, fat: 9, category: "veg" },
      { name: "Paniyaram (4 pcs)", calories: 180, protein: 5, carbs: 28, fat: 5, category: "veg" },
      { name: "Puttu + Kadala Curry", calories: 300, protein: 10, carbs: 42, fat: 10, category: "veg" },
      { name: "Ragi Koozh", calories: 120, protein: 4, carbs: 24, fat: 1, category: "veg" },
      { name: "Appam + Veg Stew", calories: 260, protein: 6, carbs: 36, fat: 10, category: "veg" },
      { name: "Filter Coffee + Biscuit", calories: 120, protein: 3, carbs: 16, fat: 5, category: "veg" },
    ],
    lunch: [
      { name: "Sambar Rice", calories: 320, protein: 10, carbs: 56, fat: 6, category: "veg" },
      { name: "Rasam Rice + Papad", calories: 280, protein: 6, carbs: 52, fat: 4, category: "veg" },
      { name: "Curd Rice", calories: 250, protein: 8, carbs: 38, fat: 6, category: "veg" },
      { name: "Kootu + Rice", calories: 300, protein: 10, carbs: 48, fat: 8, category: "veg" },
      { name: "Poriyal (dry veg)", calories: 100, protein: 3, carbs: 10, fat: 6, category: "veg" },
      { name: "Kuzhambu + Rice", calories: 310, protein: 8, carbs: 50, fat: 8, category: "veg" },
      { name: "Fish Kulambu + Rice", calories: 380, protein: 24, carbs: 46, fat: 12, category: "nonveg" },
      { name: "Chicken Chettinad + Rice", calories: 450, protein: 28, carbs: 48, fat: 16, category: "nonveg" },
      { name: "Mutton Kuzhambu + Rice", calories: 480, protein: 26, carbs: 46, fat: 20, category: "nonveg" },
      { name: "Paruppu + Nei + Rice", calories: 350, protein: 14, carbs: 50, fat: 10, category: "veg" },
    ],
    snacks: [
      { name: "Murukku (3 pcs)", calories: 150, protein: 3, carbs: 18, fat: 7, category: "veg" },
      { name: "Sundal (1 bowl)", calories: 130, protein: 8, carbs: 18, fat: 3, category: "veg" },
      { name: "Banana Bajji (2)", calories: 160, protein: 2, carbs: 24, fat: 6, category: "veg" },
      { name: "Kothu Parotta (small)", calories: 280, protein: 8, carbs: 32, fat: 14, category: "veg" },
      { name: "Bajji (3 pcs)", calories: 180, protein: 3, carbs: 20, fat: 10, category: "veg" },
    ],
    dinner: [
      { name: "Chapati + Kurma", calories: 320, protein: 10, carbs: 42, fat: 12, category: "veg" },
      { name: "Idiyappam + Coconut Milk", calories: 280, protein: 6, carbs: 40, fat: 10, category: "veg" },
      { name: "Dosa + Chutney", calories: 200, protein: 5, carbs: 28, fat: 8, category: "veg" },
      { name: "Parotta + Salna", calories: 360, protein: 10, carbs: 42, fat: 16, category: "veg" },
      { name: "Egg Parotta", calories: 380, protein: 16, carbs: 38, fat: 18, category: "nonveg" },
      { name: "Chicken 65 (6 pcs)", calories: 300, protein: 24, carbs: 12, fat: 18, category: "nonveg" },
    ],
  },

  kerala: {
    name: "Kerala",
    icon: "🌴",
    breakfast: [
      { name: "Appam + Egg Curry", calories: 300, protein: 14, carbs: 34, fat: 12, category: "nonveg" },
      { name: "Puttu + Kadala Curry", calories: 320, protein: 12, carbs: 44, fat: 10, category: "veg" },
      { name: "Idiyappam + Stew", calories: 280, protein: 8, carbs: 38, fat: 10, category: "veg" },
      { name: "Dosa + Sambar", calories: 240, protein: 8, carbs: 36, fat: 7, category: "veg" },
      { name: "Upma + Banana", calories: 280, protein: 6, carbs: 48, fat: 7, category: "veg" },
      { name: "Parotta + Beef Fry", calories: 450, protein: 26, carbs: 36, fat: 24, category: "nonveg" },
      { name: "Tapioca + Fish Curry", calories: 350, protein: 20, carbs: 40, fat: 12, category: "nonveg" },
    ],
    lunch: [
      { name: "Kerala Meals (Sadya)", calories: 600, protein: 14, carbs: 90, fat: 20, category: "veg" },
      { name: "Rice + Fish Curry + Thoran", calories: 450, protein: 24, carbs: 52, fat: 16, category: "nonveg" },
      { name: "Rice + Sambar + Avial", calories: 400, protein: 12, carbs: 62, fat: 12, category: "veg" },
      { name: "Rice + Chicken Curry + Cabbage Thoran", calories: 480, protein: 28, carbs: 50, fat: 18, category: "nonveg" },
      { name: "Malabar Biryani", calories: 500, protein: 22, carbs: 56, fat: 20, category: "nonveg" },
      { name: "Rice + Olan + Pachadi", calories: 380, protein: 10, carbs: 60, fat: 12, category: "veg" },
    ],
    snacks: [
      { name: "Banana Chips (30g)", calories: 160, protein: 1, carbs: 18, fat: 10, category: "veg" },
      { name: "Unniyappam (3)", calories: 200, protein: 3, carbs: 30, fat: 8, category: "veg" },
      { name: "Pazhampori (2)", calories: 220, protein: 3, carbs: 28, fat: 10, category: "veg" },
      { name: "Sukhiyan (2)", calories: 240, protein: 5, carbs: 30, fat: 12, category: "veg" },
    ],
    dinner: [
      { name: "Chapati + Veg Curry", calories: 300, protein: 10, carbs: 40, fat: 12, category: "veg" },
      { name: "Appam + Stew", calories: 280, protein: 8, carbs: 36, fat: 12, category: "veg" },
      { name: "Porotta + Chicken Curry", calories: 420, protein: 24, carbs: 38, fat: 20, category: "nonveg" },
      { name: "Rice + Fish Fry + Rasam", calories: 400, protein: 22, carbs: 50, fat: 14, category: "nonveg" },
      { name: "Idiyappam + Egg Roast", calories: 320, protein: 16, carbs: 36, fat: 12, category: "nonveg" },
    ],
  },

  northindian: {
    name: "North Indian",
    icon: "🏔️",
    breakfast: [
      { name: "Aloo Paratha + Curd", calories: 350, protein: 10, carbs: 40, fat: 16, category: "veg" },
      { name: "Chole Bhature", calories: 450, protein: 14, carbs: 48, fat: 22, category: "veg" },
      { name: "Poori + Aloo Sabzi", calories: 380, protein: 10, carbs: 42, fat: 18, category: "veg" },
      { name: "Stuffed Paratha + Butter", calories: 320, protein: 8, carbs: 34, fat: 17, category: "veg" },
      { name: "Bread Omelette", calories: 280, protein: 16, carbs: 26, fat: 14, category: "nonveg" },
      { name: "Lassi (1 glass)", calories: 150, protein: 5, carbs: 20, fat: 5, category: "veg" },
      { name: "Besan Chilla (2)", calories: 220, protein: 10, carbs: 24, fat: 10, category: "veg" },
    ],
    lunch: [
      { name: "Dal Makhani + Rice", calories: 420, protein: 14, carbs: 56, fat: 16, category: "veg" },
      { name: "Rajma Chawal", calories: 400, protein: 16, carbs: 58, fat: 10, category: "veg" },
      { name: "Kadhi Chawal", calories: 350, protein: 10, carbs: 52, fat: 10, category: "veg" },
      { name: "Butter Chicken + Naan", calories: 550, protein: 30, carbs: 42, fat: 26, category: "nonveg" },
      { name: "Roti + Paneer + Dal", calories: 450, protein: 20, carbs: 46, fat: 20, category: "veg" },
      { name: "Biryani (Lucknowi)", calories: 480, protein: 22, carbs: 52, fat: 20, category: "nonveg" },
      { name: "Chole + Rice + Raita", calories: 420, protein: 14, carbs: 58, fat: 14, category: "veg" },
    ],
    snacks: [
      { name: "Samosa (2)", calories: 300, protein: 6, carbs: 30, fat: 18, category: "veg" },
      { name: "Pakora (5 pcs)", calories: 250, protein: 5, carbs: 22, fat: 16, category: "veg" },
      { name: "Aloo Tikki (2)", calories: 240, protein: 5, carbs: 28, fat: 12, category: "veg" },
      { name: "Chaat (1 plate)", calories: 200, protein: 5, carbs: 28, fat: 8, category: "veg" },
      { name: "Kulfi (1 pc)", calories: 180, protein: 4, carbs: 22, fat: 10, category: "veg" },
    ],
    dinner: [
      { name: "Roti + Sabzi + Dal", calories: 380, protein: 14, carbs: 48, fat: 14, category: "veg" },
      { name: "Tandoori Roti + Chicken", calories: 420, protein: 30, carbs: 34, fat: 18, category: "nonveg" },
      { name: "Naan + Paneer Tikka", calories: 400, protein: 18, carbs: 38, fat: 20, category: "veg" },
      { name: "Roti + Keema + Raita", calories: 440, protein: 26, carbs: 36, fat: 22, category: "nonveg" },
      { name: "Khichdi + Kadhi", calories: 350, protein: 12, carbs: 50, fat: 10, category: "veg" },
    ],
  },

  karnataka: {
    name: "Karnataka",
    icon: "🏰",
    breakfast: [
      { name: "Bisi Bele Bath", calories: 300, protein: 10, carbs: 44, fat: 10, category: "veg" },
      { name: "Ragi Mudde + Sambar", calories: 280, protein: 8, carbs: 48, fat: 4, category: "veg" },
      { name: "Neer Dosa + Chutney", calories: 180, protein: 4, carbs: 30, fat: 5, category: "veg" },
      { name: "Mangalore Buns (2)", calories: 240, protein: 5, carbs: 34, fat: 10, category: "veg" },
      { name: "Rava Idli + Chutney", calories: 200, protein: 5, carbs: 32, fat: 6, category: "veg" },
      { name: "Akki Roti + Chutney", calories: 220, protein: 5, carbs: 34, fat: 7, category: "veg" },
    ],
    lunch: [
      { name: "Vangi Bath + Raita", calories: 350, protein: 8, carbs: 52, fat: 12, category: "veg" },
      { name: "Rice + Huli + Palya", calories: 380, protein: 10, carbs: 58, fat: 10, category: "veg" },
      { name: "Jolada Roti + Ennegai", calories: 320, protein: 8, carbs: 44, fat: 12, category: "veg" },
      { name: "Chitranna + Curd", calories: 300, protein: 8, carbs: 48, fat: 8, category: "veg" },
      { name: "Chicken Pulao", calories: 420, protein: 22, carbs: 48, fat: 16, category: "nonveg" },
    ],
    snacks: [
      { name: "Mysore Pak (2 pcs)", calories: 220, protein: 3, carbs: 22, fat: 14, category: "veg" },
      { name: "Chiroti (2)", calories: 200, protein: 3, carbs: 24, fat: 10, category: "veg" },
      { name: "Nippattu (4)", calories: 160, protein: 3, carbs: 18, fat: 8, category: "veg" },
    ],
    dinner: [
      { name: "Chapati + Saagu", calories: 300, protein: 8, carbs: 40, fat: 12, category: "veg" },
      { name: "Set Dosa + Veg Kurma", calories: 320, protein: 8, carbs: 42, fat: 14, category: "veg" },
      { name: "Ragi Ball + Chicken Saaru", calories: 380, protein: 22, carbs: 46, fat: 12, category: "nonveg" },
      { name: "Rice + Fish Gassi", calories: 400, protein: 22, carbs: 48, fat: 14, category: "nonveg" },
    ],
  },

  telangana: {
    name: "Telangana / AP",
    icon: "🌶️",
    breakfast: [
      { name: "Pesarattu + Ginger Chutney", calories: 200, protein: 8, carbs: 28, fat: 6, category: "veg" },
      { name: "Upma + Allam Pachadi", calories: 220, protein: 5, carbs: 32, fat: 8, category: "veg" },
      { name: "Idli + Peanut Chutney", calories: 240, protein: 8, carbs: 36, fat: 7, category: "veg" },
      { name: "Dosa + Tomato Chutney", calories: 220, protein: 5, carbs: 30, fat: 8, category: "veg" },
      { name: "Poori + Potato Kurma", calories: 350, protein: 8, carbs: 40, fat: 16, category: "veg" },
    ],
    lunch: [
      { name: "Rice + Pappu + Pachi Pulusu", calories: 380, protein: 12, carbs: 56, fat: 10, category: "veg" },
      { name: "Hyderabadi Biryani", calories: 520, protein: 24, carbs: 54, fat: 22, category: "nonveg" },
      { name: "Rice + Gutti Vankaya + Dal", calories: 400, protein: 12, carbs: 54, fat: 14, category: "veg" },
      { name: "Rice + Chicken Fry + Rasam", calories: 480, protein: 28, carbs: 50, fat: 18, category: "nonveg" },
      { name: "Pulihora + Curd", calories: 320, protein: 8, carbs: 52, fat: 8, category: "veg" },
    ],
    snacks: [
      { name: "Mirchi Bajji (3)", calories: 200, protein: 4, carbs: 20, fat: 12, category: "veg" },
      { name: "Punugulu (5)", calories: 180, protein: 4, carbs: 22, fat: 8, category: "veg" },
      { name: "Sakinalu (3)", calories: 160, protein: 3, carbs: 20, fat: 7, category: "veg" },
    ],
    dinner: [
      { name: "Roti + Gutti Vankaya", calories: 320, protein: 8, carbs: 38, fat: 14, category: "veg" },
      { name: "Rice + Natukodi Pulusu", calories: 420, protein: 26, carbs: 48, fat: 16, category: "nonveg" },
      { name: "Pesarattu + Upma", calories: 300, protein: 10, carbs: 40, fat: 10, category: "veg" },
      { name: "Roti + Paneer Curry", calories: 380, protein: 16, carbs: 36, fat: 18, category: "veg" },
    ],
  },
};

/**
 * Get region-specific foods for meal planning
 */
function getRegionalFoods(region) {
  const regionData = regionalFoods[region];
  if (!regionData) {
    return { error: `Region '${region}' not found. Available: ${Object.keys(regionalFoods).join(", ")}` };
  }
  return regionData;
}

/**
 * Get all available regions
 */
function getAvailableRegions() {
  return Object.entries(regionalFoods).map(([key, val]) => ({
    id: key,
    name: val.name,
    icon: val.icon,
  }));
}

module.exports = { regionalFoods, getRegionalFoods, getAvailableRegions };
