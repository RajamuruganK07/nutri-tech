/**
 * NutriTech - Corporate Health Dashboard (B2B)
 * Anonymous employee health trends for companies
 * "Your team's health is your company's performance"
 */

// In-memory company data store
const companyData = {};

/**
 * Register a company
 */
function registerCompany(companyId, companyName, industry = "IT") {
  if (!companyData[companyId]) {
    companyData[companyId] = {
      id: companyId,
      name: companyName,
      industry,
      createdAt: new Date().toISOString(),
      employees: {},
      challenges: [],
    };
  }
  return companyData[companyId];
}

/**
 * Add anonymous employee data
 */
function addEmployeeData(companyId, employeeId, data) {
  if (!companyData[companyId]) {
    registerCompany(companyId, `Company ${companyId}`);
  }

  companyData[companyId].employees[employeeId] = {
    id: employeeId,
    bmi: data.bmi || 0,
    energyScore: data.energyScore || 0,
    calories: data.calories || 0,
    protein: data.protein || 0,
    waterIntake: data.waterIntake || 0,
    sleepHours: data.sleepHours || 0,
    stepsPerDay: data.stepsPerDay || 0,
    stressLevel: data.stressLevel || "moderate",
    goal: data.goal || "maintenance",
    lastUpdated: new Date().toISOString(),
  };

  return { success: true, message: "Employee data logged anonymously" };
}

/**
 * Generate company health dashboard
 */
function generateDashboard(companyId) {
  const company = companyData[companyId];
  if (!company || Object.keys(company.employees).length === 0) {
    return generateDemoDashboard(companyId);
  }

  const employees = Object.values(company.employees);
  const count = employees.length;

  const avg = (key) => Math.round(employees.reduce((s, e) => s + (e[key] || 0), 0) / count * 10) / 10;

  const bmiCategories = {
    underweight: employees.filter((e) => e.bmi < 18.5).length,
    normal: employees.filter((e) => e.bmi >= 18.5 && e.bmi < 25).length,
    overweight: employees.filter((e) => e.bmi >= 25 && e.bmi < 30).length,
    obese: employees.filter((e) => e.bmi >= 30).length,
  };

  const goalDistribution = {};
  employees.forEach((e) => {
    goalDistribution[e.goal] = (goalDistribution[e.goal] || 0) + 1;
  });

  const stressDistribution = {};
  employees.forEach((e) => {
    stressDistribution[e.stressLevel] = (stressDistribution[e.stressLevel] || 0) + 1;
  });

  return {
    companyName: company.name,
    totalEmployees: count,
    lastUpdated: new Date().toISOString(),
    overview: {
      avgBMI: avg("bmi"),
      avgEnergyScore: avg("energyScore"),
      avgCalories: avg("calories"),
      avgProtein: avg("protein"),
      avgWaterIntake: avg("waterIntake"),
      avgSleep: avg("sleepHours"),
      avgSteps: avg("stepsPerDay"),
    },
    bmiDistribution: bmiCategories,
    goalDistribution,
    stressDistribution,
    healthScore: calculateCompanyHealthScore(employees),
    insights: generateInsights(employees),
    activeChallenges: company.challenges,
  };
}

/**
 * Generate demo dashboard for companies with no data
 */
function generateDemoDashboard(companyId) {
  return {
    companyName: companyId ? `${companyId} (Demo)` : "Demo Company",
    totalEmployees: 150,
    lastUpdated: new Date().toISOString(),
    isDemo: true,
    overview: {
      avgBMI: 24.3,
      avgEnergyScore: 62,
      avgCalories: 2150,
      avgProtein: 68,
      avgWaterIntake: 2.1,
      avgSleep: 6.4,
      avgSteps: 4200,
    },
    bmiDistribution: {
      underweight: 12,
      normal: 78,
      overweight: 42,
      obese: 18,
    },
    goalDistribution: {
      weight_loss: 45,
      muscle_gain: 38,
      maintenance: 52,
      energy_boost: 15,
    },
    stressDistribution: {
      low: 30,
      moderate: 75,
      high: 35,
      extreme: 10,
    },
    healthScore: {
      overall: 64,
      grade: "B-",
      trend: "improving",
      breakdown: {
        bmiScore: 68,
        energyScore: 62,
        activityScore: 55,
        nutritionScore: 71,
        sleepScore: 58,
      },
    },
    insights: [
      {
        type: "warning",
        icon: "⚠️",
        title: "Low Average Sleep",
        message: "Team average sleep is 6.4 hours. Recommended: 7-8 hours. Poor sleep reduces productivity by 20-30%.",
        action: "Launch a 'Sleep Challenge' to encourage better rest habits.",
      },
      {
        type: "alert",
        icon: "🚨",
        title: "40% Overweight/Obese",
        message: "60 out of 150 employees have BMI ≥ 25. Consider offering healthy meal options at the cafeteria.",
        action: "Partner with NutriTech for personalized meal plans.",
      },
      {
        type: "positive",
        icon: "✅",
        title: "Good Nutrition Awareness",
        message: "71% nutrition score indicates good dietary habits overall.",
        action: "Continue education programs and add more healthy options.",
      },
      {
        type: "info",
        icon: "💡",
        title: "Low Step Count",
        message: "Average 4,200 steps/day vs recommended 8,000-10,000.",
        action: "Organize walking meetings and desk stretch breaks.",
      },
    ],
    activeChallenges: [
      {
        id: 1,
        name: "10K Steps Challenge",
        duration: "30 days",
        participants: 67,
        progress: 45,
      },
      {
        id: 2,
        name: "Protein Power Month",
        duration: "30 days",
        participants: 42,
        progress: 60,
      },
    ],
  };
}

/**
 * Calculate company health score
 */
function calculateCompanyHealthScore(employees) {
  const count = employees.length;
  const avg = (key) => employees.reduce((s, e) => s + (e[key] || 0), 0) / count;

  const avgBMI = avg("bmi");
  const avgEnergy = avg("energyScore");
  const avgSleep = avg("sleepHours");
  const avgSteps = avg("stepsPerDay");

  // BMI Score: closer to 22 is better
  const bmiScore = Math.max(0, 100 - Math.abs(avgBMI - 22) * 10);
  const energyScoreVal = Math.min(100, avgEnergy);
  const sleepScore = Math.min(100, (avgSleep / 8) * 100);
  const activityScore = Math.min(100, (avgSteps / 8000) * 100);
  const nutritionScore = 70; // Baseline estimate

  const overall = Math.round(
    bmiScore * 0.2 + energyScoreVal * 0.25 + sleepScore * 0.2 + activityScore * 0.15 + nutritionScore * 0.2
  );

  let grade;
  if (overall >= 90) grade = "A+";
  else if (overall >= 80) grade = "A";
  else if (overall >= 70) grade = "B+";
  else if (overall >= 60) grade = "B";
  else if (overall >= 50) grade = "B-";
  else if (overall >= 40) grade = "C";
  else grade = "D";

  return {
    overall,
    grade,
    trend: "stable",
    breakdown: {
      bmiScore: Math.round(bmiScore),
      energyScore: Math.round(energyScoreVal),
      activityScore: Math.round(activityScore),
      nutritionScore,
      sleepScore: Math.round(sleepScore),
    },
  };
}

/**
 * Generate health insights from employee data
 */
function generateInsights(employees) {
  const insights = [];
  const count = employees.length;
  const avg = (key) => employees.reduce((s, e) => s + (e[key] || 0), 0) / count;

  const avgSleep = avg("sleepHours");
  if (avgSleep < 7) {
    insights.push({
      type: "warning",
      icon: "⚠️",
      title: "Low Average Sleep",
      message: `Team average sleep is ${avgSleep.toFixed(1)} hours. Recommended: 7-8 hours.`,
      action: "Launch a 'Sleep Challenge' to improve rest habits.",
    });
  }

  const overweightPct = (employees.filter((e) => e.bmi >= 25).length / count) * 100;
  if (overweightPct > 30) {
    insights.push({
      type: "alert",
      icon: "🚨",
      title: `${Math.round(overweightPct)}% Overweight/Obese`,
      message: `${Math.round(overweightPct)}% of employees have BMI ≥ 25.`,
      action: "Consider offering healthy meal options and NutriTech plans.",
    });
  }

  const avgSteps = avg("stepsPerDay");
  if (avgSteps < 6000) {
    insights.push({
      type: "info",
      icon: "💡",
      title: "Low Physical Activity",
      message: `Average ${Math.round(avgSteps)} steps/day vs recommended 8,000-10,000.`,
      action: "Organize walking meetings and desk stretch breaks.",
    });
  }

  const highStress = employees.filter((e) => e.stressLevel === "high" || e.stressLevel === "extreme").length;
  if (highStress / count > 0.25) {
    insights.push({
      type: "alert",
      icon: "🧘",
      title: "High Stress Levels",
      message: `${Math.round((highStress / count) * 100)}% of employees report high/extreme stress.`,
      action: "Consider wellness programs, meditation sessions, flexible hours.",
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "positive",
      icon: "✅",
      title: "Healthy Team!",
      message: "Your team's health metrics look good. Keep it up!",
      action: "Continue monitoring and reward healthy habits.",
    });
  }

  return insights;
}

/**
 * Create a health challenge
 */
function createChallenge(companyId, challenge) {
  if (!companyData[companyId]) {
    registerCompany(companyId, `Company ${companyId}`);
  }

  const newChallenge = {
    id: Date.now(),
    name: challenge.name || "Health Challenge",
    description: challenge.description || "",
    duration: challenge.duration || "30 days",
    type: challenge.type || "general",
    participants: 0,
    progress: 0,
    createdAt: new Date().toISOString(),
  };

  companyData[companyId].challenges.push(newChallenge);
  return newChallenge;
}

module.exports = {
  registerCompany,
  addEmployeeData,
  generateDashboard,
  createChallenge,
};
