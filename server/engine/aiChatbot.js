/**
 * NutriTech - AI Dietitian Chatbot Engine
 * Smart contextual nutrition advice based on user symptoms and habits
 * Not generic chat — intelligent, actionable nutrition guidance
 */

/**
 * Knowledge base of symptoms → nutritional advice
 */
const knowledgeBase = [
  {
    triggers: ["tired", "fatigue", "exhausted", "low energy", "sleepy", "drowsy", "lethargic"],
    category: "Energy",
    responses: [
      {
        condition: "afternoon",
        advice:
          "Afternoon fatigue is usually caused by a carb-heavy lunch with low protein. Try splitting your lunch — eat rice/roti with dal and add a protein source like eggs, chicken, or paneer.",
        foods: ["Banana", "Peanuts (30g)", "Green Tea", "Sprouts Chaat"],
        tip: "Add a small high-protein snack at 3 PM to avoid the energy crash.",
      },
      {
        condition: "morning",
        advice:
          "Morning fatigue often signals poor sleep quality or low iron. Include iron-rich breakfast like ragi dosa, sprouts, or eggs. Avoid heavy coffee on an empty stomach.",
        foods: ["Ragi Dosa", "Boiled Eggs (2)", "Sprouts Salad", "Oats Porridge"],
        tip: "Sleep 7-8 hours and eat breakfast within 1 hour of waking up.",
      },
      {
        condition: "general",
        advice:
          "Chronic fatigue can be caused by: dehydration, low protein intake, poor sleep, or vitamin D deficiency. Ensure you're eating enough calories and protein for your activity level.",
        foods: ["Protein Shake", "Almonds (10 pcs)", "Banana", "Milk"],
        tip: "Track your water intake — dehydration is the #1 hidden cause of fatigue.",
      },
    ],
  },
  {
    triggers: ["bloated", "bloating", "gas", "acidity", "indigestion", "stomach"],
    category: "Digestion",
    responses: [
      {
        condition: "general",
        advice:
          "Bloating after meals usually means eating too fast, or excess dal/legumes without enough water. Try having buttermilk after lunch. Avoid drinking water immediately after eating.",
        foods: ["Buttermilk (1 glass)", "Curd / Yogurt", "Green Tea"],
        tip: "Eat slowly. Chew 20-30 times per bite. Wait 30 min after meal to drink water.",
      },
    ],
  },
  {
    triggers: ["muscle", "gain", "bulk", "build muscle", "gym", "workout", "protein"],
    category: "Muscle Building",
    responses: [
      {
        condition: "general",
        advice:
          "For muscle gain, you need 1.6-2.2g protein per kg body weight. Spread protein intake across 4-5 meals. Post-workout window (within 30 min) is crucial — have a protein shake or eggs.",
        foods: ["Protein Shake", "Boiled Eggs (2)", "Grilled Chicken Breast", "Paneer Tikka"],
        tip: "Don't just focus on protein — you need a calorie surplus of 300-500 kcal above TDEE.",
      },
    ],
  },
  {
    triggers: ["lose weight", "weight loss", "fat loss", "reduce weight", "slim", "diet"],
    category: "Weight Loss",
    responses: [
      {
        condition: "general",
        advice:
          "Weight loss = calorie deficit + high protein + consistent exercise. Aim for 500 kcal deficit from your TDEE. Keep protein high (1.5g/kg) to preserve muscle. Eat more fiber to stay full longer.",
        foods: ["Sprouts Salad", "Dal Fry", "Grilled Fish", "Salad (mixed)", "Green Tea"],
        tip: "Don't crash diet. A 500 kcal daily deficit = ~0.5 kg/week safe weight loss.",
      },
    ],
  },
  {
    triggers: ["headache", "head pain", "migraine"],
    category: "Headache",
    responses: [
      {
        condition: "general",
        advice:
          "Headaches are often caused by: dehydration, skipped meals, or excess screen time. Drink water immediately. If you skipped a meal, eat something with both carbs and protein.",
        foods: ["Banana", "Almonds (10 pcs)", "Milk (1 glass)", "Oats Porridge"],
        tip: "The 20-20-20 rule: Every 20 min, look 20 feet away for 20 seconds. Stay hydrated.",
      },
    ],
  },
  {
    triggers: ["stress", "anxiety", "mental", "focus", "concentrate", "brain fog"],
    category: "Mental Wellness",
    responses: [
      {
        condition: "general",
        advice:
          "Stress and poor focus can be improved through nutrition. Omega-3 (fish, walnuts), magnesium (spinach, almonds), and complex carbs (oats, brown rice) all support brain function.",
        foods: ["Almonds (10 pcs)", "Green Tea", "Fish Curry", "Oats Porridge"],
        tip: "Reduce sugar intake. High sugar causes energy crashes that worsen focus and mood.",
      },
    ],
  },
  {
    triggers: ["sleep", "insomnia", "can't sleep", "poor sleep"],
    category: "Sleep",
    responses: [
      {
        condition: "general",
        advice:
          "For better sleep: eat dinner at least 2 hours before bed. Include tryptophan-rich foods (milk, banana, curd). Avoid heavy or spicy dinner. Magnesium-rich foods like almonds also help.",
        foods: ["Milk (1 glass)", "Banana", "Curd (1 bowl)", "Almonds (10 pcs)"],
        tip: "Warm milk with a pinch of turmeric (haldi doodh) 30 min before bed improves sleep quality.",
      },
    ],
  },
  {
    triggers: ["skin", "acne", "pimple", "glow", "hair", "hair fall"],
    category: "Skin & Hair",
    responses: [
      {
        condition: "general",
        advice:
          "Skin and hair health depend on: adequate protein, vitamins A/C/E, biotin, and hydration. Include colorful vegetables, eggs, fish, and plenty of water in your daily diet.",
        foods: ["Sprouts Salad", "Fruit Salad", "Boiled Eggs (2)", "Almonds (10 pcs)"],
        tip: "Drink 3+ liters of water daily. Vitamin C from amla, lemon, or oranges boosts collagen.",
      },
    ],
  },
  {
    triggers: ["craving", "sugar craving", "junk food", "hungry", "midnight snack"],
    category: "Cravings",
    responses: [
      {
        condition: "general",
        advice:
          "Cravings usually mean your protein or fiber intake is too low. When you crave sugar, eat a banana or dates instead. For salty cravings, try roasted makhana or peanuts.",
        foods: ["Banana", "Makhana (roasted, 30g)", "Peanuts (30g)", "Curd / Yogurt"],
        tip: "Eat enough protein at every meal. Protein is the most satiating macronutrient.",
      },
    ],
  },
  {
    triggers: ["pre workout", "before gym", "before exercise", "pre-workout"],
    category: "Pre-Workout",
    responses: [
      {
        condition: "general",
        advice:
          "Eat a meal with carbs + moderate protein 60-90 min before workout. Quick energy: banana + coffee 30 min before. Avoid fat-heavy foods pre-workout as they slow digestion.",
        foods: ["Banana", "Oats Porridge", "Bread + Peanut Butter", "Coffee"],
        tip: "A banana + black coffee 30 min before training = cheap, effective pre-workout.",
      },
    ],
  },
  {
    triggers: ["post workout", "after gym", "after exercise", "post-workout", "recovery"],
    category: "Post-Workout",
    responses: [
      {
        condition: "general",
        advice:
          "Post-workout (within 30-45 min): prioritize protein + fast carbs. Whey protein shake is ideal. Whole food option: eggs + banana or chicken + rice. This is your recovery window.",
        foods: ["Whey Protein Shake", "Boiled Eggs (2)", "Banana", "Chicken Curry"],
        tip: "Post-workout protein intake is critical for muscle recovery. Don't skip it.",
      },
    ],
  },
  {
    triggers: ["vegetarian", "veg protein", "plant protein", "no meat"],
    category: "Vegetarian Nutrition",
    responses: [
      {
        condition: "general",
        advice:
          "Top vegetarian protein sources in India: Paneer (18g/100g), Dal/Lentils (9g/cup), Sprouts (8g/cup), Curd (5g/cup), Soy chunks (52g/100g), Tofu, Peanuts. Combine grains + legumes for complete protein.",
        foods: ["Paneer Tikka", "Dal Fry", "Sprouts Chaat", "Curd / Yogurt", "Peanuts (30g)"],
        tip: "Rice + Dal = complete amino acid profile. This is as good as animal protein.",
      },
    ],
  },
];

/**
 * Quick tips for common scenarios
 */
const quickTips = [
  "💡 Drink a glass of water as soon as you wake up. It kickstarts metabolism.",
  "💡 Eating protein at every meal keeps hunger and cravings in check.",
  "💡 Don't skip breakfast. It affects your energy and focus all day.",
  "💡 Buttermilk after lunch aids digestion and prevents bloating.",
  "💡 A handful of almonds (10 pcs) is one of the best desk snacks.",
  "💡 Replace one cup of tea/coffee with green tea for antioxidant benefits.",
  "💡 Walking 10 minutes after meals improves digestion and blood sugar.",
  "💡 Your body can absorb only ~30g protein per meal. Spread it out.",
  "💡 Swap white rice with brown rice for more fiber and slower carbs.",
  "💡 Haldi doodh (turmeric milk) before bed reduces inflammation and improves sleep.",
  "💡 Ragi is a superfood — high in calcium and iron. Great for South Indians.",
  "💡 Desk workers should stand and stretch every 45 minutes.",
  "💡 Cooking with coconut oil is healthier than refined oil for Indian food.",
];

/**
 * Process user message and return AI advice
 */
function processMessage(userMessage, userContext = {}) {
  const message = userMessage.toLowerCase().trim();

  // Find matching knowledge entries
  let bestMatch = null;
  let maxScore = 0;

  knowledgeBase.forEach((entry) => {
    let score = 0;
    entry.triggers.forEach((trigger) => {
      if (message.includes(trigger)) {
        score += trigger.split(" ").length; // longer matches = more specific
      }
    });

    if (score > maxScore) {
      maxScore = score;
      bestMatch = entry;
    }
  });

  if (bestMatch) {
    // Determine condition (time-based if applicable)
    let response = bestMatch.responses.find((r) => r.condition === "general");

    if (message.includes("afternoon") || message.includes("after lunch") || message.includes("evening")) {
      const specific = bestMatch.responses.find((r) => r.condition === "afternoon");
      if (specific) response = specific;
    }

    if (message.includes("morning") || message.includes("wake up")) {
      const specific = bestMatch.responses.find((r) => r.condition === "morning");
      if (specific) response = specific;
    }

    if (!response) response = bestMatch.responses[0];

    return {
      matched: true,
      category: bestMatch.category,
      advice: response.advice,
      suggestedFoods: response.foods || [],
      tip: response.tip || "",
      quickTip: quickTips[Math.floor(Math.random() * quickTips.length)],
    };
  }

  // Greeting or unknown
  if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    return {
      matched: true,
      category: "Greeting",
      advice:
        "Hello! I'm your NutriTech AI Dietitian. Ask me about:\n• Fatigue or low energy\n• Weight loss or muscle gain\n• Pre/post workout nutrition\n• Sleep improvement\n• Cravings management\n• Vegetarian protein sources\n\nTell me how you're feeling, and I'll suggest the right foods!",
      suggestedFoods: [],
      tip: "",
      quickTip: quickTips[Math.floor(Math.random() * quickTips.length)],
    };
  }

  // Default response
  return {
    matched: false,
    category: "General",
    advice:
      "I can help you with nutrition advice! Try asking me about:\n• 'I feel tired in the afternoon'\n• 'How to gain muscle'\n• 'Best pre-workout food'\n• 'I have sugar cravings'\n• 'Vegetarian protein sources'\n• 'Food for better sleep'",
    suggestedFoods: [],
    tip: quickTips[Math.floor(Math.random() * quickTips.length)],
    quickTip: "",
  };
}

module.exports = { processMessage, quickTips };
