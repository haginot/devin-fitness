import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Search, Plus, Trash2, Coffee, Sun, Moon, Cookie } from 'lucide-react'
import { apiService } from '../services/api'
import { Food, FoodEntry, MealType } from '../types'
import { toast } from 'sonner'

interface FoodLoggerProps {
  selectedDate: string
}

const mealTypeIcons = {
  [MealType.BREAKFAST]: Coffee,
  [MealType.LUNCH]: Sun,
  [MealType.DINNER]: Moon,
  [MealType.SNACK]: Cookie,
}

const mealTypeLabels = {
  [MealType.BREAKFAST]: 'Breakfast',
  [MealType.LUNCH]: 'Lunch',
  [MealType.DINNER]: 'Dinner',
  [MealType.SNACK]: 'Snack',
}

export default function FoodLogger({ selectedDate }: FoodLoggerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Food[]>([])
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [quantity, setQuantity] = useState('100')
  const [selectedMealType, setSelectedMealType] = useState<MealType>(MealType.BREAKFAST)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadFoodEntries()
  }, [selectedDate])

  const loadFoodEntries = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.getFoodEntries(selectedDate)
      setFoodEntries(response.entries)
    } catch (error) {
      toast.error('Failed to load food entries')
      console.error('Error loading food entries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const searchFoods = async () => {
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      const response = await apiService.searchFoods(searchQuery)
      setSearchResults(response.foods)
    } catch (error) {
      toast.error('Failed to search foods')
      console.error('Error searching foods:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const addFoodEntry = async () => {
    if (!selectedFood || !quantity) {
      toast.error('Please select a food and enter quantity')
      return
    }

    try {
      const entry = await apiService.createFoodEntry({
        food_id: selectedFood.id,
        quantity_grams: parseFloat(quantity),
        meal_type: selectedMealType,
        date: selectedDate,
      })

      setFoodEntries([...foodEntries, entry])
      setSelectedFood(null)
      setQuantity('100')
      setSearchQuery('')
      setSearchResults([])
      toast.success('Food entry added successfully')
    } catch (error) {
      toast.error('Failed to add food entry')
      console.error('Error adding food entry:', error)
    }
  }

  const deleteFoodEntry = async (entryId: number) => {
    try {
      await apiService.deleteFoodEntry(entryId)
      setFoodEntries(foodEntries.filter(entry => entry.id !== entryId))
      toast.success('Food entry deleted')
    } catch (error) {
      toast.error('Failed to delete food entry')
      console.error('Error deleting food entry:', error)
    }
  }

  const groupedEntries = foodEntries.reduce((acc, entry) => {
    if (!acc[entry.meal_type]) {
      acc[entry.meal_type] = []
    }
    acc[entry.meal_type].push(entry)
    return acc
  }, {} as Record<MealType, FoodEntry[]>)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Foods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search for foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchFoods()}
              />
              <Button onClick={searchFoods} disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((food) => (
                  <div
                    key={food.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedFood?.id === food.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedFood(food)}
                  >
                    <div className="font-medium">{food.name}</div>
                    <div className="text-sm text-gray-500">
                      {Math.round(food.calories_per_100g)} cal per 100g
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Food Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedFood && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="font-medium">{selectedFood.name}</div>
                <div className="text-sm text-gray-600">
                  {Math.round(selectedFood.calories_per_100g)} cal, {selectedFood.protein_per_100g.toFixed(1)}g protein per 100g
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity (grams)</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="meal-type">Meal Type</Label>
                <Select value={selectedMealType} onValueChange={(value) => setSelectedMealType(value as MealType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(MealType).map((mealType) => (
                      <SelectItem key={mealType} value={mealType}>
                        {mealTypeLabels[mealType]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={addFoodEntry} disabled={!selectedFood} className="w-full">
              Add to Log
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Food Log</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : foodEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No food entries for this date. Start by searching and adding foods above.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.values(MealType).map((mealType) => {
                const entries = groupedEntries[mealType] || []
                if (entries.length === 0) return null

                const Icon = mealTypeIcons[mealType]
                const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0)

                return (
                  <div key={mealType}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <h3 className="font-semibold text-lg">{mealTypeLabels[mealType]}</h3>
                      <Badge variant="secondary">{Math.round(totalCalories)} cal</Badge>
                    </div>
                    <div className="space-y-2">
                      {entries.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{entry.food_name}</div>
                            <div className="text-sm text-gray-600">
                              {entry.quantity_grams}g • {Math.round(entry.calories)} cal • 
                              {entry.protein.toFixed(1)}g protein • {entry.carbs.toFixed(1)}g carbs • {entry.fat.toFixed(1)}g fat
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteFoodEntry(entry.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Separator className="mt-4" />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
