# NutriTech - Your Personal Nutrition Guide

> "Right Nutrition Today, Stronger Tomorrow."

AI-powered Personalized Nutrition Platform for IT Professionals & Gym Enthusiasts

## Features

- **Calorie Calculator** - BMR + TDEE calculation using Mifflin-St Jeor equation
- **Macro Tracking** - Protein, Carbs, Fat breakdown based on your goal
- **Indian Food Database** - 100+ Indian food items with accurate nutrition data
- **Job-Type Adaptation** - Desk job vs Active job calorie adjustment
- **Goal-Based Plans** - Weight loss / Muscle gain / Energy boost / Maintenance
- **Smart Meal Plans** - Auto-generated personalized Indian meal plans
- **BMI Calculator** - Body Mass Index with category
- **Water Intake** - Daily water recommendation

## Quick Start

```bash
cd server
npm install
npm start
```

Open http://localhost:5000 in your browser.

## Team

- **Rajamurugan** - Co-Founder
- **Shyam Sundar** - Co-Founder
- **Yogeshwaran** - Co-Founder

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + JavaScript
- **API**: RESTful JSON API
- **Algorithm**: Mifflin-St Jeor + Activity Multiplier + Goal Adjustment

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/calculate` | Calculate nutrition + generate meal plan |
| POST | `/api/weekly-plan` | Generate 7-day meal plan |
| POST | `/api/regenerate-meal` | Regenerate meal plan for variety |
| GET | `/api/health` | Health check |

## License

MIT
