/**
 * NutriTech - Health Risk Predictor
 * Estimates risk probabilities for lifestyle diseases
 * NOT medical diagnosis — risk probability score only
 */

/**
 * Calculate health risk scores
 */
function calculateHealthRisks(data) {
  const {
    age,
    weight,
    height,
    gender,
    bmi,
    waistCircumference, // cm (optional)
    familyHistory,      // { diabetes: bool, hypertension: bool, heartDisease: bool, obesity: bool }
    jobType,
    exerciseFrequency,
    smokingStatus,      // none, occasional, regular
    alcoholStatus,      // none, occasional, regular
    sleepHours,
    stressLevel,        // low, moderate, high, extreme
  } = data;

  const risks = {};

  // ===== DIABETES RISK =====
  let diabetesScore = 0;

  // Age factor
  if (age > 45) diabetesScore += 20;
  else if (age > 35) diabetesScore += 12;
  else if (age > 25) diabetesScore += 5;

  // BMI factor
  const bmiVal = bmi || (weight / Math.pow(height / 100, 2));
  if (bmiVal >= 30) diabetesScore += 25;
  else if (bmiVal >= 27) diabetesScore += 18;
  else if (bmiVal >= 25) diabetesScore += 10;

  // Waist circumference (abdominal fat)
  if (waistCircumference) {
    if (gender === "male" && waistCircumference > 102) diabetesScore += 15;
    else if (gender === "male" && waistCircumference > 94) diabetesScore += 8;
    else if (gender === "female" && waistCircumference > 88) diabetesScore += 15;
    else if (gender === "female" && waistCircumference > 80) diabetesScore += 8;
  }

  // Family history
  if (familyHistory && familyHistory.diabetes) diabetesScore += 15;

  // Sedentary lifestyle
  if (jobType === "desk" && (exerciseFrequency === "none" || exerciseFrequency === "light")) {
    diabetesScore += 12;
  }

  // Stress
  if (stressLevel === "extreme") diabetesScore += 8;
  else if (stressLevel === "high") diabetesScore += 5;

  // South Asian ethnicity bonus (higher baseline risk)
  diabetesScore += 5;

  risks.diabetes = {
    score: Math.min(diabetesScore, 100),
    level: getRiskLevel(diabetesScore),
    label: "Type 2 Diabetes",
    icon: "fa-droplet",
    factors: [],
  };

  if (bmiVal >= 25) risks.diabetes.factors.push("Elevated BMI");
  if (familyHistory?.diabetes) risks.diabetes.factors.push("Family history of diabetes");
  if (jobType === "desk") risks.diabetes.factors.push("Sedentary job type");
  if (age > 35) risks.diabetes.factors.push("Age is a contributing factor");

  // ===== HYPERTENSION RISK =====
  let hyperScore = 0;

  if (age > 50) hyperScore += 20;
  else if (age > 40) hyperScore += 14;
  else if (age > 30) hyperScore += 7;

  if (bmiVal >= 30) hyperScore += 20;
  else if (bmiVal >= 25) hyperScore += 10;

  if (familyHistory && familyHistory.hypertension) hyperScore += 15;

  if (stressLevel === "extreme") hyperScore += 18;
  else if (stressLevel === "high") hyperScore += 12;
  else if (stressLevel === "moderate") hyperScore += 5;

  if (smokingStatus === "regular") hyperScore += 12;
  else if (smokingStatus === "occasional") hyperScore += 6;

  if (alcoholStatus === "regular") hyperScore += 8;

  if (sleepHours < 6) hyperScore += 8;

  hyperScore += 3; // baseline for South Asian

  risks.hypertension = {
    score: Math.min(hyperScore, 100),
    level: getRiskLevel(hyperScore),
    label: "Hypertension",
    icon: "fa-heart-pulse",
    factors: [],
  };

  if (stressLevel === "high" || stressLevel === "extreme") risks.hypertension.factors.push("High stress levels");
  if (bmiVal >= 25) risks.hypertension.factors.push("Elevated BMI");
  if (familyHistory?.hypertension) risks.hypertension.factors.push("Family history");
  if (sleepHours < 6) risks.hypertension.factors.push("Insufficient sleep");

  // ===== OBESITY RISK =====
  let obesityScore = 0;

  if (bmiVal >= 30) obesityScore += 35;
  else if (bmiVal >= 27) obesityScore += 25;
  else if (bmiVal >= 25) obesityScore += 15;
  else if (bmiVal >= 23) obesityScore += 5;

  if (familyHistory && familyHistory.obesity) obesityScore += 15;

  if (exerciseFrequency === "none") obesityScore += 18;
  else if (exerciseFrequency === "light") obesityScore += 10;

  if (jobType === "desk") obesityScore += 10;

  if (stressLevel === "extreme" || stressLevel === "high") obesityScore += 8;

  if (sleepHours < 6) obesityScore += 7;

  risks.obesity = {
    score: Math.min(obesityScore, 100),
    level: getRiskLevel(obesityScore),
    label: "Obesity",
    icon: "fa-weight-scale",
    factors: [],
  };

  if (bmiVal >= 25) risks.obesity.factors.push("Current BMI elevated");
  if (exerciseFrequency === "none") risks.obesity.factors.push("No regular exercise");
  if (jobType === "desk") risks.obesity.factors.push("Desk job — low calorie burn");
  if (familyHistory?.obesity) risks.obesity.factors.push("Genetic predisposition");

  // ===== HEART DISEASE RISK =====
  let heartScore = 0;

  if (age > 55) heartScore += 18;
  else if (age > 45) heartScore += 12;
  else if (age > 35) heartScore += 6;

  if (gender === "male") heartScore += 5;

  if (bmiVal >= 30) heartScore += 15;
  else if (bmiVal >= 25) heartScore += 8;

  if (familyHistory && familyHistory.heartDisease) heartScore += 18;

  if (smokingStatus === "regular") heartScore += 15;
  else if (smokingStatus === "occasional") heartScore += 8;

  if (stressLevel === "extreme") heartScore += 12;
  else if (stressLevel === "high") heartScore += 8;

  if (exerciseFrequency === "none") heartScore += 10;

  if (alcoholStatus === "regular") heartScore += 5;

  risks.heartDisease = {
    score: Math.min(heartScore, 100),
    level: getRiskLevel(heartScore),
    label: "Heart Disease",
    icon: "fa-heart-crack",
    factors: [],
  };

  if (familyHistory?.heartDisease) risks.heartDisease.factors.push("Family history of heart disease");
  if (smokingStatus !== "none") risks.heartDisease.factors.push("Smoking increases risk");
  if (stressLevel === "high" || stressLevel === "extreme") risks.heartDisease.factors.push("Chronic stress");
  if (exerciseFrequency === "none") risks.heartDisease.factors.push("Physical inactivity");

  // ===== FATIGUE / BURNOUT RISK =====
  let fatigueScore = 0;

  if (sleepHours < 5) fatigueScore += 30;
  else if (sleepHours < 6) fatigueScore += 20;
  else if (sleepHours < 7) fatigueScore += 10;

  if (stressLevel === "extreme") fatigueScore += 25;
  else if (stressLevel === "high") fatigueScore += 15;
  else if (stressLevel === "moderate") fatigueScore += 8;

  if (jobType === "desk") fatigueScore += 10;

  if (exerciseFrequency === "none") fatigueScore += 10;

  if (bmiVal >= 30) fatigueScore += 8;

  risks.fatigue = {
    score: Math.min(fatigueScore, 100),
    level: getRiskLevel(fatigueScore),
    label: "Fatigue / Burnout",
    icon: "fa-battery-quarter",
    factors: [],
  };

  if (sleepHours < 7) risks.fatigue.factors.push("Insufficient sleep");
  if (stressLevel === "high" || stressLevel === "extreme") risks.fatigue.factors.push("High work stress");
  if (jobType === "desk") risks.fatigue.factors.push("Prolonged sitting");
  if (exerciseFrequency === "none") risks.fatigue.factors.push("No exercise routine");

  // Overall recommendations
  const recommendations = generateRecommendations(risks, data);

  return { risks, recommendations, bmi: Math.round(bmiVal * 10) / 10 };
}

function getRiskLevel(score) {
  if (score >= 70) return { text: "High", color: "#ef4444" };
  if (score >= 45) return { text: "Moderate", color: "#f59e0b" };
  if (score >= 25) return { text: "Low-Moderate", color: "#3b82f6" };
  return { text: "Low", color: "#10b981" };
}

function generateRecommendations(risks, data) {
  const recs = [];

  const highRisks = Object.values(risks).filter((r) => r.score >= 45);

  if (highRisks.length === 0) {
    recs.push("Your health risk profile looks good! Keep maintaining your healthy lifestyle.");
  }

  if (risks.diabetes.score >= 40) {
    recs.push("Reduce refined carbs and sugar. Include more fiber-rich foods like dal, vegetables, and whole grains.");
  }

  if (risks.hypertension.score >= 40) {
    recs.push("Manage stress through meditation or yoga. Reduce salt intake and increase potassium-rich foods.");
  }

  if (risks.obesity.score >= 40) {
    recs.push("Start with 30 minutes of daily walking. Create a calorie deficit with NutriTech's meal plans.");
  }

  if (risks.heartDisease.score >= 40) {
    recs.push("Include heart-healthy foods: nuts, fish, olive oil. Regular cardio exercise is essential.");
  }

  if (risks.fatigue.score >= 40) {
    recs.push("Prioritize 7-8 hours of sleep. Take regular breaks during work. Stay hydrated.");
  }

  if (data.exerciseFrequency === "none") {
    recs.push("Start exercising! Even 20 minutes of brisk walking daily can significantly reduce all risk factors.");
  }

  return recs.slice(0, 5);
}

module.exports = { calculateHealthRisks };
