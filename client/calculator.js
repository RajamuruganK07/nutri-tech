/**
 * NutriTech - Calculator Page Script
 * Step navigation, form submission, results, energy score, health risk,
 * meal scanner, grocery list, streak & rewards
 */

let currentStep = 1;
window.lastFormData = null;
let lastMealPlanData = null;
let lastNutritionData = null;

// ============ STEP NAVIGATION ============

function nextStep(step) {
  if (!validateStep(currentStep)) return;

  document.getElementById(`step-${currentStep}`).classList.remove("active");
  document.getElementById(`step-${step}`).classList.add("active");
  updateStepIndicator(step);
  currentStep = step;
}

function prevStep(step) {
  document.getElementById(`step-${currentStep}`).classList.remove("active");
  document.getElementById(`step-${step}`).classList.add("active");
  updateStepIndicator(step);
  currentStep = step;
}

function updateStepIndicator(activeStep) {
  document.querySelectorAll(".step-indicator .step").forEach((el) => {
    const s = parseInt(el.dataset.step);
    el.classList.remove("active", "completed");
    if (s === activeStep) el.classList.add("active");
    else if (s < activeStep) el.classList.add("completed");
  });
}

function validateStep(step) {
  if (step === 1) {
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const weight = document.getElementById("weight").value;
    const height = document.getElementById("height").value;

    if (!age || !gender || !weight || !height) {
      showToast("Please fill in all fields", "error");
      return false;
    }
    if (age < 15 || age > 80) {
      showToast("Age must be between 15 and 80", "error");
      return false;
    }
    if (weight < 30 || weight > 200) {
      showToast("Weight must be between 30 and 200 kg", "error");
      return false;
    }
    if (height < 120 || height > 230) {
      showToast("Height must be between 120 and 230 cm", "error");
      return false;
    }
  }

  if (step === 2) {
    const jobType = document.getElementById("jobType").value;
    const exerciseFrequency = document.getElementById("exerciseFrequency").value;
    const dietPreference = document.getElementById("dietPreference").value;

    if (!jobType || !exerciseFrequency || !dietPreference) {
      showToast("Please fill in all fields", "error");
      return false;
    }
  }

  return true;
}

// ============ FORM SUBMISSION ============

document.getElementById("nutrition-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const goal = document.querySelector('input[name="goal"]:checked');
  if (!goal) {
    showToast("Please select a fitness goal", "error");
    return;
  }

  const formData = {
    age: document.getElementById("age").value,
    weight: document.getElementById("weight").value,
    height: document.getElementById("height").value,
    gender: document.getElementById("gender").value,
    jobType: document.getElementById("jobType").value,
    exerciseFrequency: document.getElementById("exerciseFrequency").value,
    dietPreference: document.getElementById("dietPreference").value,
    goal: goal.value,
  };

  window.lastFormData = formData;
  await calculateNutrition(formData);
});

async function calculateNutrition(formData) {
  showLoading(true);

  try {
    const response = await fetch(`${API_BASE}/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!data.success) {
      showToast(data.error || "Calculation failed", "error");
      showLoading(false);
      return;
    }

    renderResults(data);
    showLoading(false);

    document.getElementById("results").classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("results").scrollIntoView({ behavior: "smooth" });
    }, 100);

    showToast("Your nutrition plan is ready!", "success");
  } catch (error) {
    console.error("Error:", error);
    showToast("Server error. Make sure the server is running.", "error");
    showLoading(false);
  }
}

// ============ RENDER RESULTS ============

function renderResults(data) {
  const { nutrition, mealPlan } = data;

  // Store for other features
  lastMealPlanData = mealPlan;
  lastNutritionData = nutrition;

  // Overview cards
  document.getElementById("result-calories").textContent = nutrition.targetCalories;
  document.getElementById("result-protein").textContent = nutrition.macros.protein;
  document.getElementById("result-carbs").textContent = nutrition.macros.carbs;
  document.getElementById("result-fat").textContent = nutrition.macros.fat;

  // Body stats
  document.getElementById("result-bmi").textContent = nutrition.bmi.bmi;
  document.getElementById("result-bmi-category").textContent = nutrition.bmi.category;
  document.getElementById("result-bmr").textContent = nutrition.bmr + " kcal";
  document.getElementById("result-tdee").textContent = nutrition.tdee + " kcal";

  // Recommendations
  document.getElementById("result-water").textContent = nutrition.waterIntake + " ml";
  document.getElementById("result-activity").textContent = nutrition.activityMultiplier + "x";

  const proteinPerKg = (nutrition.macros.protein / parseFloat(window.lastFormData.weight)).toFixed(1);
  document.getElementById("result-protein-per-kg").textContent = proteinPerKg + " g/kg";

  // Macro bars
  const totalMacroCal =
    nutrition.macros.proteinCalories + nutrition.macros.carbCalories + nutrition.macros.fatCalories;
  const proteinPct = Math.round((nutrition.macros.proteinCalories / totalMacroCal) * 100);
  const carbsPct = Math.round((nutrition.macros.carbCalories / totalMacroCal) * 100);
  const fatPct = 100 - proteinPct - carbsPct;

  document.getElementById("protein-bar").style.width = proteinPct + "%";
  document.getElementById("protein-bar-value").textContent = proteinPct + "%";
  document.getElementById("carbs-bar").style.width = carbsPct + "%";
  document.getElementById("carbs-bar-value").textContent = carbsPct + "%";
  document.getElementById("fat-bar").style.width = fatPct + "%";
  document.getElementById("fat-bar-value").textContent = fatPct + "%";

  // Meal plan
  renderMeal("breakfast", mealPlan.meals.breakfast);
  renderMeal("lunch", mealPlan.meals.lunch);
  renderMeal("snacks", mealPlan.meals.snacks);
  renderMeal("dinner", mealPlan.meals.dinner);

  // Totals
  document.getElementById("total-calories").textContent = mealPlan.totals.calories + " kcal";
  document.getElementById("total-protein").textContent = mealPlan.totals.protein + "g";
  document.getElementById("total-carbs").textContent = mealPlan.totals.carbs + "g";
  document.getElementById("total-fat").textContent = mealPlan.totals.fat + "g";
}

function renderMeal(mealType, mealData) {
  const itemsContainer = document.getElementById(`${mealType}-items`);
  const calLabel = document.getElementById(`${mealType}-cal`);

  calLabel.textContent = mealData.actualCalories + " kcal";

  itemsContainer.innerHTML = mealData.items
    .map(
      (item) => `
    <li>
      <span class="meal-item-name">${item.name}</span>
      <span class="meal-item-macros">
        <span>${item.calories} kcal</span>
        <span>P:${item.protein}g</span>
        <span>C:${item.carbs}g</span>
        <span>F:${item.fat}g</span>
      </span>
    </li>
  `
    )
    .join("");
}

// ============ REGENERATE ============

document.getElementById("regenerate-btn").addEventListener("click", async function () {
  if (!window.lastFormData) return;

  showLoading(true);

  try {
    const response = await fetch(`${API_BASE}/regenerate-meal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(window.lastFormData),
    });

    const data = await response.json();

    if (data.success) {
      renderMeal("breakfast", data.mealPlan.meals.breakfast);
      renderMeal("lunch", data.mealPlan.meals.lunch);
      renderMeal("snacks", data.mealPlan.meals.snacks);
      renderMeal("dinner", data.mealPlan.meals.dinner);

      document.getElementById("total-calories").textContent = data.mealPlan.totals.calories + " kcal";
      document.getElementById("total-protein").textContent = data.mealPlan.totals.protein + "g";
      document.getElementById("total-carbs").textContent = data.mealPlan.totals.carbs + "g";
      document.getElementById("total-fat").textContent = data.mealPlan.totals.fat + "g";

      // Update stored data
      lastMealPlanData = data.mealPlan;

      showToast("New meal plan generated!", "success");
    }
  } catch (error) {
    showToast("Failed to regenerate", "error");
  }

  showLoading(false);
});

function scrollToCalculator() {
  document.getElementById("calculator").scrollIntoView({ behavior: "smooth" });
}

// ============ AI ENERGY SCORE ============

document.getElementById("calc-energy-btn").addEventListener("click", async function () {
  if (!window.lastFormData || !lastNutritionData) {
    showToast("Please calculate your nutrition plan first", "error");
    return;
  }

  const payload = {
    targetCalories: lastNutritionData.targetCalories,
    actualCalories: lastNutritionData.targetCalories,
    targetProtein: lastNutritionData.macros.protein,
    actualProtein: lastNutritionData.macros.protein,
    sleepHours: parseFloat(document.getElementById("es-sleep").value) || 7,
    stepsPerDay: parseInt(document.getElementById("es-steps").value) || 5000,
    waterLiters: parseFloat(document.getElementById("es-water").value) || 2,
    workoutMinutes: parseInt(document.getElementById("es-workout").value) || 0,
  };

  try {
    const res = await fetch(`${API_BASE}/energy-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      renderEnergyScore(data);
    }
  } catch (err) {
    showToast("Failed to calculate energy score", "error");
  }
});

function renderEnergyScore(data) {
  document.getElementById("energy-result").classList.remove("hidden");
  document.getElementById("energy-number").textContent = data.totalScore;

  const gradeEl = document.getElementById("energy-grade");
  gradeEl.textContent = data.grade;
  gradeEl.style.color =
    data.totalScore >= 80 ? "#10b981" : data.totalScore >= 60 ? "#f59e0b" : "#ef4444";

  const breakdownEl = document.getElementById("energy-breakdown");
  breakdownEl.innerHTML = data.breakdown
    .map(
      (b) => `
    <div class="eb-item">
      <span class="eb-label">${b.category}</span>
      <span class="eb-score" style="color: ${b.score >= b.maxScore * 0.7 ? "#10b981" : "#f59e0b"}">${b.score}/${b.maxScore}</span>
    </div>
  `
    )
    .join("");

  const tipsEl = document.getElementById("energy-tips");
  tipsEl.innerHTML =
    "<strong>💡 Tips to improve:</strong><ul>" +
    data.tips.map((t) => `<li>${t}</li>`).join("") +
    "</ul>";
}

// ============ HEALTH RISK PREDICTOR ============

document.getElementById("calc-risk-btn").addEventListener("click", async function () {
  if (!window.lastFormData) {
    showToast("Please calculate your nutrition plan first", "error");
    return;
  }

  const familySelect = document.getElementById("hr-family");
  const familyHistory = Array.from(familySelect.selectedOptions).map((o) => o.value);

  const payload = {
    age: parseInt(window.lastFormData.age),
    gender: window.lastFormData.gender,
    bmi: lastNutritionData ? lastNutritionData.bmi.bmi : 22,
    waistCircumference: parseFloat(document.getElementById("hr-waist").value) || 80,
    jobType: window.lastFormData.jobType,
    exerciseFrequency: window.lastFormData.exerciseFrequency,
    sleepHours: parseFloat(document.getElementById("hr-sleep").value) || 7,
    stressLevel: document.getElementById("hr-stress").value,
    smoking: document.getElementById("hr-smoking").value,
    alcohol: document.getElementById("hr-alcohol").value,
    familyHistory,
  };

  try {
    const res = await fetch(`${API_BASE}/health-risk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      renderHealthRisks(data);
    }
  } catch (err) {
    showToast("Failed to predict health risks", "error");
  }
});

function renderHealthRisks(data) {
  document.getElementById("health-risk-result").classList.remove("hidden");
  const container = document.getElementById("risk-cards");

  const colorMap = { low: "#10b981", moderate: "#f59e0b", high: "#ef4444", "very high": "#dc2626" };

  container.innerHTML = data.risks
    .map(
      (r) => `
    <div class="risk-card risk-${r.level.replace(" ", "-")}">
      <h4>${r.condition}</h4>
      <div class="risk-score-bar">
        <div class="risk-score-fill" style="width: ${r.score}%; background: ${colorMap[r.level] || "#f59e0b"}"></div>
      </div>
      <div class="risk-level" style="color: ${colorMap[r.level]}">${r.level} (${r.score}%)</div>
      <div class="risk-recommendation">${r.recommendations[0] || ""}</div>
    </div>
  `
    )
    .join("");
}

// ============ AI MEAL SCANNER ============

document.getElementById("scan-meal-btn").addEventListener("click", async function () {
  const desc = document.getElementById("scanner-input").value.trim();
  if (!desc) {
    showToast("Please describe your meal", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/meal-scanner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: desc }),
    });
    const data = await res.json();
    if (data.success) {
      renderScanResult(data);
    }
  } catch (err) {
    showToast("Failed to scan meal", "error");
  }
});

function renderScanResult(data) {
  document.getElementById("scanner-result").classList.remove("hidden");
  document.getElementById("scanner-meal-name").textContent = data.mealName;
  document.getElementById("scanner-confidence").textContent = `Confidence: ${data.confidence}% ${data.isEstimated ? "(estimated)" : ""}`;

  document.getElementById("scanner-items").innerHTML = data.items
    .map(
      (i) => `
    <div class="scanner-item">
      <span>${i.name}</span>
      <span>${i.calories} kcal | P:${i.protein}g C:${i.carbs}g F:${i.fat}g</span>
    </div>
  `
    )
    .join("");

  document.getElementById("scanner-totals").innerHTML = `
    <div class="scanner-total-item"><span class="stv">${data.totals.calories}</span><span class="stl">Calories</span></div>
    <div class="scanner-total-item"><span class="stv">${data.totals.protein}g</span><span class="stl">Protein</span></div>
    <div class="scanner-total-item"><span class="stv">${data.totals.carbs}g</span><span class="stl">Carbs</span></div>
    <div class="scanner-total-item"><span class="stv">${data.totals.fat}g</span><span class="stl">Fat</span></div>
  `;

  document.getElementById("scanner-suggestion").textContent = data.suggestion;
}

// ============ SMART GROCERY LIST ============

document.getElementById("generate-grocery-btn").addEventListener("click", async function () {
  if (!lastMealPlanData) {
    showToast("Please generate a meal plan first", "error");
    return;
  }

  const days = parseInt(document.getElementById("grocery-days").value) || 7;

  try {
    const res = await fetch(`${API_BASE}/grocery-list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mealPlan: lastMealPlanData, days }),
    });
    const data = await res.json();
    if (data.success) {
      renderGroceryList(data);
    }
  } catch (err) {
    showToast("Failed to generate grocery list", "error");
  }
});

function renderGroceryList(data) {
  document.getElementById("grocery-result").classList.remove("hidden");

  const catContainer = document.getElementById("grocery-categories");
  catContainer.innerHTML = data.categories
    .map(
      (cat) => `
    <div class="grocery-category">
      <h4>${cat.category}</h4>
      ${cat.items
        .map(
          (item) => `
        <div class="grocery-item">
          <span>${item.name} (${item.quantity})</span>
          <span>₹${item.price}</span>
        </div>
      `
        )
        .join("")}
    </div>
  `
    )
    .join("");

  document.getElementById("grocery-total").innerHTML = `Estimated Total: <span>₹${data.totalCost}</span> for ${data.days} days`;

  document.getElementById("grocery-stores").innerHTML = data.stores
    .map((s) => `<div class="grocery-store-badge">${s.name}</div>`)
    .join("");
}

// ============ STREAK & REWARDS ============

document.getElementById("log-streak-btn").addEventListener("click", async function () {
  const userId = document.getElementById("streak-user-id").value.trim();
  if (!userId) {
    showToast("Please enter a username", "error");
    return;
  }

  const payload = {
    userId,
    caloriesLogged: lastNutritionData ? lastNutritionData.targetCalories : 2000,
    proteinHit: true,
    workoutDone: parseInt(document.getElementById("es-workout")?.value || 0) > 0,
    waterGoalMet: parseFloat(document.getElementById("es-water")?.value || 0) >= 2,
  };

  try {
    const res = await fetch(`${API_BASE}/streak/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Day logged! Streak: ${data.streak.currentStreak} days 🔥`, "success");
      loadStreakData(userId);
    }
  } catch (err) {
    showToast("Failed to log streak", "error");
  }
});

document.getElementById("view-streak-btn").addEventListener("click", function () {
  const userId = document.getElementById("streak-user-id").value.trim();
  if (!userId) {
    showToast("Please enter a username", "error");
    return;
  }
  loadStreakData(userId);
});

async function loadStreakData(userId) {
  try {
    const [streakRes, lbRes] = await Promise.all([
      fetch(`${API_BASE}/streak/${userId}`),
      fetch(`${API_BASE}/leaderboard`),
    ]);
    const streakData = await streakRes.json();
    const lbData = await lbRes.json();

    if (streakData.success) {
      renderStreakData(streakData, lbData.leaderboard || []);
    }
  } catch (err) {
    showToast("Failed to load streak data", "error");
  }
}

function renderStreakData(data, leaderboard) {
  document.getElementById("streak-result").classList.remove("hidden");

  document.getElementById("streak-stats").innerHTML = `
    <div class="streak-stat-card">
      <div class="ss-icon">🔥</div>
      <span class="ss-value">${data.streak.currentStreak}</span>
      <span class="ss-label">Current Streak</span>
    </div>
    <div class="streak-stat-card">
      <div class="ss-icon">⭐</div>
      <span class="ss-value">${data.streak.longestStreak}</span>
      <span class="ss-label">Best Streak</span>
    </div>
    <div class="streak-stat-card">
      <div class="ss-icon">🏆</div>
      <span class="ss-value">${data.streak.totalPoints}</span>
      <span class="ss-label">Total Points</span>
    </div>
    <div class="streak-stat-card">
      <div class="ss-icon">📊</div>
      <span class="ss-value">${data.level.name}</span>
      <span class="ss-label">Level ${data.level.level}</span>
    </div>
  `;

  document.getElementById("streak-achievements").innerHTML =
    "<h4>🏅 Achievements</h4><div class='achievements-grid'>" +
    data.achievements
      .map(
        (a) => `
      <div class="achievement-badge ${a.unlocked ? "unlocked" : ""}">
        <span class="ab-icon">${a.icon}</span>
        <div>
          <div class="ab-name">${a.name}</div>
          <div class="ab-desc">${a.description}</div>
        </div>
      </div>
    `
      )
      .join("") +
    "</div>";

  if (leaderboard.length > 0) {
    document.getElementById("streak-leaderboard").innerHTML =
      "<h4>🏆 Leaderboard</h4><table class='leaderboard-table'><thead><tr><th>#</th><th>User</th><th>Points</th><th>Streak</th><th>Level</th></tr></thead><tbody>" +
      leaderboard
        .slice(0, 10)
        .map(
          (u, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${u.userId}</td>
          <td>${u.totalPoints}</td>
          <td>${u.currentStreak} 🔥</td>
          <td>${u.levelName}</td>
        </tr>
      `
        )
        .join("") +
      "</tbody></table>";
  }
}
