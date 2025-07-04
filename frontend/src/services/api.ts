import { Food, FoodEntry, DailyNutrition, FoodEntryCreate } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  async searchFoods(query: string, limit: number = 10): Promise<{ foods: Food[] }> {
    return this.request(`/api/foods/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  }

  async getFood(foodId: number): Promise<Food> {
    return this.request(`/api/foods/${foodId}`)
  }

  async createFoodEntry(entry: FoodEntryCreate): Promise<FoodEntry> {
    return this.request('/api/food-entries', {
      method: 'POST',
      body: JSON.stringify(entry),
    })
  }

  async getFoodEntries(date: string): Promise<{ entries: FoodEntry[] }> {
    return this.request(`/api/food-entries?date=${date}`)
  }

  async deleteFoodEntry(entryId: number): Promise<{ message: string }> {
    return this.request(`/api/food-entries/${entryId}`, {
      method: 'DELETE',
    })
  }

  async getDailyNutrition(date: string): Promise<DailyNutrition> {
    return this.request(`/api/nutrition/daily?date=${date}`)
  }
}

export const apiService = new ApiService()
