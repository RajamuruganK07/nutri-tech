/**
 * NutriTech - Modes Page Script
 * Performance Modes + Regional Mode
 */

// ============ PERFORMANCE MODES ============

async function selectMode(modeId) {
  document.querySelectorAll(".mode-card").forEach((c) => c.classList.remove("active"));
  document.querySelector(`.mode-card[data-mode="${modeId}"]`).classList.add("active");

  try {
    const res = await fetch(`${API_BASE}/performance-modes/${modeId}`);
    const data = await res.json();
    if (data.success) {
      renderModeDetail(data.mode);
    }
  } catch (err) {
    showToast("Failed to load mode", "error");
  }
}

function renderModeDetail(mode) {
  const panel = document.getElementById("mode-detail");
  panel.classList.remove("hidden");

  document.getElementById("mode-detail-header").innerHTML = `
    <span style="font-size: 2.5rem">${mode.icon}</span>
    <h3>${mode.name}</h3>
    <p style="color: var(--text-secondary)">${mode.description}</p>
  `;

  document.getElementById("mode-detail-body").innerHTML = `
    <div class="mode-info-block">
      <h4>⏰ Meal Schedule</h4>
      <ul>
        ${Object.entries(mode.schedule).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join("")}
      </ul>
    </div>
    <div class="mode-info-block">
      <h4>✅ Priority Foods</h4>
      <ul>
        ${mode.priorityFoods.map((f) => `<li>${f}</li>`).join("")}
      </ul>
    </div>
    <div class="mode-info-block">
      <h4>❌ Avoid</h4>
      <ul>
        ${mode.avoidFoods.map((f) => `<li>${f}</li>`).join("")}
      </ul>
    </div>
    <div class="mode-info-block">
      <h4>💡 Pro Tips</h4>
      <ul>
        ${mode.tips.map((t) => `<li>${t}</li>`).join("")}
      </ul>
    </div>
  `;
}

// ============ REGIONAL MODE ============

async function selectRegion(regionId) {
  document.querySelectorAll(".region-btn").forEach((b) => b.classList.remove("active"));
  document.querySelector(`.region-btn[data-region="${regionId}"]`).classList.add("active");

  try {
    const res = await fetch(`${API_BASE}/regional-foods/${regionId}`);
    const data = await res.json();
    if (data.success) {
      renderRegionalFoods(data.foods);
    }
  } catch (err) {
    showToast("Failed to load regional foods", "error");
  }
}

function renderRegionalFoods(foods) {
  const container = document.getElementById("regional-foods");
  container.classList.remove("hidden");

  const mealTypes = ["breakfast", "lunch", "snacks", "dinner"];
  const icons = { breakfast: "☀️", lunch: "🌤️", snacks: "🍪", dinner: "🌙" };

  document.getElementById("regional-meals-grid").innerHTML = mealTypes
    .map(
      (type) => `
    <div class="regional-meal-card">
      <div class="rmc-header ${type}">${icons[type]} ${type.charAt(0).toUpperCase() + type.slice(1)}</div>
      <ul>
        ${(foods[type] || [])
          .map(
            (item) => `
          <li>
            <span>${item.name}</span>
            <span class="rmc-cal">${item.calories} kcal | P:${item.protein}g</span>
          </li>
        `
          )
          .join("")}
      </ul>
    </div>
  `
    )
    .join("");
}
