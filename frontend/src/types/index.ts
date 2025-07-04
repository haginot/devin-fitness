export interface Food {
  id: number
  name: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  fiber_per_100g: number
  sugar_per_100g: number
  sodium_per_100g: number
}

export interface FoodEntry {
  id: number
  food_id: number
  food_name: string
  quantity_grams: number
  meal_type: MealType
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface DailyNutrition {
  date: string
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  total_fiber: number
  protein_percentage: number
  carbs_percentage: number
  fat_percentage: number
}

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack'
}

export interface FoodEntryCreate {
  food_id: number
  quantity_grams: number
  meal_type: MealType
  date: string
}
