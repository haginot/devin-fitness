from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
import requests
import json
from dataclasses import dataclass, asdict
from enum import Enum
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Nutrition Tracker API", version="1.0.0")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

USDA_API_BASE_URL = "https://api.nal.usda.gov/fdc/v1"
USDA_API_KEY = os.getenv("USDA_API_KEY", "DEMO_KEY")

foods_db = {}
food_entries_db = {}
daily_nutrition_db = {}

class MealType(str, Enum):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"

@dataclass
class Food:
    id: int
    name: str
    calories_per_100g: float
    protein_per_100g: float
    carbs_per_100g: float
    fat_per_100g: float
    fiber_per_100g: float = 0.0
    sugar_per_100g: float = 0.0
    sodium_per_100g: float = 0.0

@dataclass
class FoodEntry:
    id: int
    food_id: int
    quantity_grams: float
    meal_type: MealType
    date: str
    user_id: int = 1

@dataclass
class DailyNutrition:
    date: str
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float
    total_fiber: float
    user_id: int = 1

class FoodResponse(BaseModel):
    id: int
    name: str
    calories_per_100g: float
    protein_per_100g: float
    carbs_per_100g: float
    fat_per_100g: float
    fiber_per_100g: float
    sugar_per_100g: float
    sodium_per_100g: float

class FoodEntryCreate(BaseModel):
    food_id: int
    quantity_grams: float
    meal_type: MealType
    date: str

class FoodEntryResponse(BaseModel):
    id: int
    food_id: int
    food_name: str
    quantity_grams: float
    meal_type: MealType
    date: str
    calories: float
    protein: float
    carbs: float
    fat: float

class DailyNutritionResponse(BaseModel):
    date: str
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float
    total_fiber: float
    protein_percentage: float
    carbs_percentage: float
    fat_percentage: float

def search_usda_foods(query: str, page_size: int = 10):
    """Search foods using USDA FoodData Central API"""
    try:
        params = {
            "query": query,
            "dataType": ["Foundation", "SR Legacy"],
            "pageSize": page_size,
            "api_key": USDA_API_KEY
        }
        response = requests.get(f"{USDA_API_BASE_URL}/foods/search", params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"USDA API error: {e}")
        return None

def get_usda_food_details(fdc_id: int):
    """Get detailed food information from USDA API"""
    try:
        params = {"api_key": USDA_API_KEY}
        response = requests.get(f"{USDA_API_BASE_URL}/food/{fdc_id}", params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"USDA API error: {e}")
        return None

def parse_usda_food(usda_food):
    """Parse USDA food data into our Food model"""
    nutrients = {n["nutrientName"]: n["value"] for n in usda_food.get("foodNutrients", [])}
    
    return Food(
        id=usda_food["fdcId"],
        name=usda_food["description"],
        calories_per_100g=nutrients.get("Energy", 0),
        protein_per_100g=nutrients.get("Protein", 0),
        carbs_per_100g=nutrients.get("Carbohydrate, by difference", 0),
        fat_per_100g=nutrients.get("Total lipid (fat)", 0),
        fiber_per_100g=nutrients.get("Fiber, total dietary", 0),
        sugar_per_100g=nutrients.get("Sugars, total including NLEA", 0),
        sodium_per_100g=nutrients.get("Sodium, Na", 0) / 1000  # Convert mg to g
    )

def calculate_daily_nutrition(date_str: str, user_id: int = 1):
    """Calculate daily nutrition totals from food entries"""
    entries = [e for e in food_entries_db.values() if e.date == date_str and e.user_id == user_id]
    
    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fat = 0
    total_fiber = 0
    
    for entry in entries:
        food = foods_db.get(entry.food_id)
        if food:
            multiplier = entry.quantity_grams / 100
            total_calories += food.calories_per_100g * multiplier
            total_protein += food.protein_per_100g * multiplier
            total_carbs += food.carbs_per_100g * multiplier
            total_fat += food.fat_per_100g * multiplier
            total_fiber += food.fiber_per_100g * multiplier
    
    return DailyNutrition(
        date=date_str,
        total_calories=total_calories,
        total_protein=total_protein,
        total_carbs=total_carbs,
        total_fat=total_fat,
        total_fiber=total_fiber,
        user_id=user_id
    )

sample_foods = [
    Food(1, "Apple", 52, 0.3, 14, 0.2, 2.4, 10.4, 0.001),
    Food(2, "Banana", 89, 1.1, 23, 0.3, 2.6, 12.2, 0.001),
    Food(3, "Chicken Breast", 165, 31, 0, 3.6, 0, 0, 0.074),
    Food(4, "Brown Rice", 111, 2.6, 23, 0.9, 1.8, 0.4, 0.005),
    Food(5, "Broccoli", 34, 2.8, 7, 0.4, 2.6, 1.5, 0.033)
]

for food in sample_foods:
    foods_db[food.id] = food

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/api/foods/search")
async def search_foods(q: str, limit: int = 10):
    """Search foods from USDA API and local database"""
    results = []
    
    local_results = [
        food for food in foods_db.values() 
        if q.lower() in food.name.lower()
    ][:limit//2]
    
    for food in local_results:
        results.append(FoodResponse(**asdict(food)))
    
    if len(results) < limit:
        usda_data = search_usda_foods(q, limit - len(results))
        if usda_data and "foods" in usda_data:
            for usda_food in usda_data["foods"]:
                try:
                    food = parse_usda_food(usda_food)
                    foods_db[food.id] = food
                    results.append(FoodResponse(**asdict(food)))
                except Exception as e:
                    print(f"Error parsing USDA food: {e}")
                    continue
    
    return {"foods": results}

@app.get("/api/foods/{food_id}")
async def get_food(food_id: int):
    """Get detailed food information"""
    food = foods_db.get(food_id)
    if not food:
        usda_data = get_usda_food_details(food_id)
        if usda_data:
            food = parse_usda_food(usda_data)
            foods_db[food.id] = food
        else:
            raise HTTPException(status_code=404, detail="Food not found")
    
    return FoodResponse(**asdict(food))

@app.post("/api/food-entries")
async def create_food_entry(entry: FoodEntryCreate):
    """Create a new food entry"""
    food = foods_db.get(entry.food_id)
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    
    entry_id = len(food_entries_db) + 1
    food_entry = FoodEntry(
        id=entry_id,
        food_id=entry.food_id,
        quantity_grams=entry.quantity_grams,
        meal_type=entry.meal_type,
        date=entry.date
    )
    
    food_entries_db[entry_id] = food_entry
    
    multiplier = entry.quantity_grams / 100
    calories = food.calories_per_100g * multiplier
    protein = food.protein_per_100g * multiplier
    carbs = food.carbs_per_100g * multiplier
    fat = food.fat_per_100g * multiplier
    
    return FoodEntryResponse(
        id=food_entry.id,
        food_id=food_entry.food_id,
        food_name=food.name,
        quantity_grams=food_entry.quantity_grams,
        meal_type=food_entry.meal_type,
        date=food_entry.date,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat
    )

@app.get("/api/food-entries")
async def get_food_entries(date: str):
    """Get food entries for a specific date"""
    entries = [e for e in food_entries_db.values() if e.date == date]
    results = []
    
    for entry in entries:
        food = foods_db.get(entry.food_id)
        if food:
            multiplier = entry.quantity_grams / 100
            results.append(FoodEntryResponse(
                id=entry.id,
                food_id=entry.food_id,
                food_name=food.name,
                quantity_grams=entry.quantity_grams,
                meal_type=entry.meal_type,
                date=entry.date,
                calories=food.calories_per_100g * multiplier,
                protein=food.protein_per_100g * multiplier,
                carbs=food.carbs_per_100g * multiplier,
                fat=food.fat_per_100g * multiplier
            ))
    
    return {"entries": results}

@app.delete("/api/food-entries/{entry_id}")
async def delete_food_entry(entry_id: int):
    """Delete a food entry"""
    if entry_id not in food_entries_db:
        raise HTTPException(status_code=404, detail="Food entry not found")
    
    del food_entries_db[entry_id]
    return {"message": "Food entry deleted successfully"}

@app.get("/api/nutrition/daily")
async def get_daily_nutrition(date: str):
    """Get daily nutrition summary"""
    daily_nutrition = calculate_daily_nutrition(date)
    daily_nutrition_db[date] = daily_nutrition
    
    total_calories = daily_nutrition.total_calories
    if total_calories > 0:
        protein_percentage = (daily_nutrition.total_protein * 4 / total_calories) * 100
        carbs_percentage = (daily_nutrition.total_carbs * 4 / total_calories) * 100
        fat_percentage = (daily_nutrition.total_fat * 9 / total_calories) * 100
    else:
        protein_percentage = carbs_percentage = fat_percentage = 0
    
    return DailyNutritionResponse(
        date=daily_nutrition.date,
        total_calories=daily_nutrition.total_calories,
        total_protein=daily_nutrition.total_protein,
        total_carbs=daily_nutrition.total_carbs,
        total_fat=daily_nutrition.total_fat,
        total_fiber=daily_nutrition.total_fiber,
        protein_percentage=protein_percentage,
        carbs_percentage=carbs_percentage,
        fat_percentage=fat_percentage
    )
