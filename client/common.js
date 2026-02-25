/**
 * NutriTech - Common Utilities
 * Shared across all pages: toast, loading, chatbot, nav active state
 */

const API_BASE = window.location.origin + "/api";

// ============ ACTIVE NAV LINK ============
(function setActiveNav() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf("/") + 1) || "index.html";

  const navMap = {
    "index.html": "Home",
    "calculator.html": "Calculator",
    "modes.html": "Modes",
    "features.html": "Features",
    "about.html": "About",
  };

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.remove("active");
    if (link.textContent.trim() === navMap[page]) {
      link.classList.add("active");
    }
  });
})();

// ============ UTILITIES ============

function showLoading(show) {
  const overlay = document.getElementById("loading-overlay");
  if (show) overlay.classList.remove("hidden");
  else overlay.classList.add("hidden");
}

function showToast(message, type = "info") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
    <span>${message}</span>
  `;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    background: type === "success" ? "#059669" : type === "error" ? "#dc2626" : "#2563eb",
    color: "white",
    padding: "0.8rem 1.5rem",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
    fontWeight: "500",
    zIndex: "10000",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    animation: "fadeIn 0.3s ease",
    fontFamily: "Inter, sans-serif",
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============ AI CHATBOT ============

document.getElementById("chatbot-toggle").addEventListener("click", function () {
  document.getElementById("chatbot-panel").classList.toggle("hidden");
});

document.getElementById("chatbot-close").addEventListener("click", function () {
  document.getElementById("chatbot-panel").classList.add("hidden");
});

document.getElementById("chatbot-send").addEventListener("click", sendChatMessage);
document.getElementById("chatbot-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendChatMessage();
});

async function sendChatMessage() {
  const input = document.getElementById("chatbot-input");
  const message = input.value.trim();
  if (!message) return;

  addChatMessage(message, "user");
  input.value = "";

  try {
    const res = await fetch(`${API_BASE}/chatbot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        userContext: window.lastFormData || {},
      }),
    });
    const data = await res.json();
    if (data.success) {
      let reply = data.reply;
      if (data.suggestedFoods && data.suggestedFoods.length > 0) {
        reply += "\n\n🍽️ Try: " + data.suggestedFoods.join(", ");
      }
      if (data.tips && data.tips.length > 0) {
        reply += "\n\n💡 " + data.tips[0];
      }
      addChatMessage(reply, "bot");
    }
  } catch (err) {
    addChatMessage("Sorry, something went wrong. Try again!", "bot");
  }
}

function addChatMessage(text, sender) {
  const container = document.getElementById("chatbot-messages");
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-message ${sender === "bot" ? "bot-message" : "user-message"}`;

  msgDiv.innerHTML = `
    <div class="chat-avatar"><i class="fas ${sender === "bot" ? "fa-robot" : "fa-user"}"></i></div>
    <div class="chat-text">${text.replace(/\n/g, "<br>")}</div>
  `;

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

console.log("%c🥗 NutriTech - Performance Optimization Platform", "color: #10b981; font-size: 16px; font-weight: bold;");
console.log("%cRight Nutrition Today, Stronger Tomorrow.", "color: #f59e0b; font-size: 12px;");
