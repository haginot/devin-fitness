# Nutrition Tracker Prototype

A MyFitnessPal-like nutrition tracking application built with React and FastAPI.

## Features Implemented

### 1. Food Logging & Calorie Tracking
- **Food Database Search**: Search from USDA FoodData Central API + local database
- **Custom Food Registration**: Pre-loaded sample foods (Apple, Banana, Chicken Breast, Brown Rice, Broccoli)
- **Meal Time Categorization**: Breakfast, Lunch, Dinner, Snack classification
- **Portion Adjustment**: Flexible gram-based quantity input
- **Quick Add**: Easy food entry with real-time nutrition calculation

### 2. Nutrition Analysis & Macro Tracking
- **Calorie Auto-calculation**: Real-time calorie computation from food entries
- **Macro Tracking**: Detailed protein, carbohydrate, and fat analysis
- **Micronutrient Display**: Fiber, sugar, and sodium tracking
- **Nutrition Balance Visualization**: Progress bars and percentage displays

### 3. Data Visualization & Reports
- **Dashboard**: Daily nutrition overview with goal tracking
- **Nutrition Trends**: Macro distribution pie charts
- **Calorie Balance**: Goals vs actual comparison charts
- **Meal Breakdown**: Calories by meal type visualization

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Recharts** for data visualization
- **Lucide React** for icons
- **Sonner** for toast notifications

### Backend
- **FastAPI** with Python 3.12
- **Pydantic** for data validation
- **USDA FoodData Central API** integration
- **In-memory database** for prototype
- **CORS** enabled for frontend integration

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.12+ and Poetry
- Git

### Backend Setup
```bash
cd backend
poetry install
poetry run fastapi dev app/main.py
```
The backend will run on http://localhost:8000

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on http://localhost:5173

### Environment Variables
- Backend: `.env` file with `USDA_API_KEY=DEMO_KEY`
- Frontend: `.env` file with `VITE_API_BASE_URL=http://localhost:8000`

## Usage

1. **Start both servers** (backend on :8000, frontend on :5173)
2. **Select a date** using the date picker in the header
3. **Search for foods** in the Food Logger tab
4. **Add food entries** with quantity and meal type
5. **View nutrition data** in the Dashboard tab
6. **Analyze trends** in the Charts tab

## API Endpoints

- `GET /api/foods/search?q={query}` - Search foods
- `GET /api/foods/{food_id}` - Get food details
- `POST /api/food-entries` - Create food entry
- `GET /api/food-entries?date={date}` - Get entries by date
- `DELETE /api/food-entries/{entry_id}` - Delete food entry
- `GET /api/nutrition/daily?date={date}` - Get daily nutrition summary

## Sample Data

The prototype includes sample foods:
- Apple (52 cal/100g)
- Banana (89 cal/100g)
- Chicken Breast (165 cal/100g)
- Brown Rice (111 cal/100g)
- Broccoli (34 cal/100g)

## Daily Goals
- Calories: 2000
- Protein: 150g
- Carbohydrates: 250g
- Fat: 65g
- Fiber: 25g

## Limitations

- **In-memory database**: Data is lost when backend restarts
- **DEMO_KEY rate limits**: 1000 requests/hour for USDA API
- **Single user**: No authentication system implemented
- **No data persistence**: Prototype-level data storage

## Future Enhancements

- PostgreSQL database integration
- User authentication and profiles
- Food favorites and recent items
- Barcode scanning capability
- Exercise tracking integration
- Mobile responsive improvements
- Offline data synchronization
