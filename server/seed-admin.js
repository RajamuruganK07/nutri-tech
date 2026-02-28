/**
 * NutriTech - Admin Seed Script
 * Creates a default admin account
 * Run: node seed-admin.js
 */

require("dotenv").config();
const User = require("./models/User");

const ADMIN_DATA = {
  name: "Admin",
  email: "admin@nutritech.com",
  password: "admin123",
  role: "admin",
  age: 30,
  weight: 75,
  height: 175,
  gender: "male",
  jobType: "desk",
  goal: "maintenance",
};

async function seedAdmin() {
  try {
    // Check if admin exists
    const existing = User.findOne({ email: ADMIN_DATA.email });
    if (existing) {
      console.log("Admin already exists:");
      console.log(`  Email: ${ADMIN_DATA.email}`);
      console.log(`  Password: ${ADMIN_DATA.password}`);
    } else {
      const admin = await User.create(ADMIN_DATA);
      console.log("Admin created successfully!");
      console.log(`  Email: ${ADMIN_DATA.email}`);
      console.log(`  Password: ${ADMIN_DATA.password}`);
      console.log(`  ID: ${admin._id}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seedAdmin();
