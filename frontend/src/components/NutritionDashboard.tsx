import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Zap, Edit, Utensils } from 'lucide-react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { apiService } from '../services/api'
import { DailyNutrition } from '../types'

interface NutritionDashboardProps {
  selectedDate: string
}

const DAILY_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
  fiber: 25,
}

export default function NutritionDashboard({ selectedDate }: NutritionDashboardProps) {
  const [nutrition, setNutrition] = useState<DailyNutrition | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadNutrition()
  }, [selectedDate])

  const loadNutrition = async () => {
    try {
      setIsLoading(true)
      const data = await apiService.getDailyNutrition(selectedDate)
      setNutrition(data)
    } catch (error) {
      console.error('Error loading nutrition data:', error)
      setNutrition({
        date: selectedDate,
        total_calories: 0,
        total_protein: 0,
        total_carbs: 0,
        total_fat: 0,
        total_fiber: 0,
        protein_percentage: 0,
        carbs_percentage: 0,
        fat_percentage: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading nutrition data...</div>
  }

  if (!nutrition) {
    return <div className="text-center py-8">No nutrition data available</div>
  }

  const proteinProgress = (nutrition.total_protein / DAILY_GOALS.protein) * 100
  const carbsProgress = (nutrition.total_carbs / DAILY_GOALS.carbs) * 100
  const fatProgress = (nutrition.total_fat / DAILY_GOALS.fat) * 100
  const remainingCalories = Math.max(0, DAILY_GOALS.calories - nutrition.total_calories)

  return (
    <div className="space-y-6 pb-20">
      <Card className="shadow-lg border-0 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Calories</h2>
            <Edit className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            Remaining = Goal - Food + Exercise
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <CircularProgressbar
                value={Math.min((nutrition.total_calories / DAILY_GOALS.calories) * 100, 100)}
                styles={buildStyles({
                  pathColor: nutrition.total_calories > DAILY_GOALS.calories ? '#ef4444' : '#3b82f6',
                  trailColor: '#f3f4f6',
                  strokeLinecap: 'round',
                  pathTransitionDuration: 0.5,
                })}
                strokeWidth={8}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-gray-900">
                  {Math.round(remainingCalories).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Base Goal</span>
              </div>
              <div className="text-lg font-semibold">{DAILY_GOALS.calories.toLocaleString()}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <Utensils className="w-3 h-3 text-blue-600" />
                <span className="text-sm text-gray-600">Food</span>
              </div>
              <div className="text-lg font-semibold">{Math.round(nutrition.total_calories)}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-600">Exercise</span>
              </div>
              <div className="text-lg font-semibold">0</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Macros</h2>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-3">
                <CircularProgressbar
                  value={Math.min(carbsProgress, 100)}
                  text={`${Math.round(nutrition.total_carbs)}`}
                  styles={buildStyles({
                    pathColor: '#14b8a6',
                    textColor: '#14b8a6',
                    trailColor: '#f3f4f6',
                    strokeLinecap: 'round',
                    textSize: '24px',
                    pathTransitionDuration: 0.5,
                  })}
                  strokeWidth={12}
                />
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                  /{DAILY_GOALS.carbs}g
                </div>
              </div>
              <div className="text-sm font-medium text-teal-600 mb-1">Carbohydrates</div>
              <div className="text-xs text-gray-500">
                {Math.max(0, DAILY_GOALS.carbs - nutrition.total_carbs).toFixed(0)}g left
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-3">
                <CircularProgressbar
                  value={Math.min(fatProgress, 100)}
                  text={`${Math.round(nutrition.total_fat)}`}
                  styles={buildStyles({
                    pathColor: '#8b5cf6',
                    textColor: '#8b5cf6',
                    trailColor: '#f3f4f6',
                    strokeLinecap: 'round',
                    textSize: '24px',
                    pathTransitionDuration: 0.5,
                  })}
                  strokeWidth={12}
                />
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                  /{DAILY_GOALS.fat}g
                </div>
              </div>
              <div className="text-sm font-medium text-purple-600 mb-1">Fat</div>
              <div className="text-xs text-gray-500">
                {Math.max(0, DAILY_GOALS.fat - nutrition.total_fat).toFixed(0)}g left
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-3">
                <CircularProgressbar
                  value={Math.min(proteinProgress, 100)}
                  text={`${Math.round(nutrition.total_protein)}`}
                  styles={buildStyles({
                    pathColor: '#f59e0b',
                    textColor: '#f59e0b',
                    trailColor: '#f3f4f6',
                    strokeLinecap: 'round',
                    textSize: '24px',
                    pathTransitionDuration: 0.5,
                  })}
                  strokeWidth={12}
                />
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                  /{DAILY_GOALS.protein}g
                </div>
              </div>
              <div className="text-sm font-medium text-amber-600 mb-1">Protein</div>
              <div className="text-xs text-gray-500">
                {Math.max(0, DAILY_GOALS.protein - nutrition.total_protein).toFixed(0)}g left
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Steps</h3>
              <div className="text-2xl">👟</div>
            </div>
            <div className="text-2xl font-bold mb-1">0</div>
            <div className="text-sm text-gray-500">Goal: 10,000 steps</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Exercise</h3>
              <div className="text-xl">+</div>
            </div>
            <div className="text-lg font-bold mb-1">0 kJ</div>
            <div className="text-sm text-gray-500">0:00 hr</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
