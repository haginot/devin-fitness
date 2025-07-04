import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { apiService } from '../services/api'
import { DailyNutrition, FoodEntry, MealType } from '../types'

interface NutritionChartsProps {
  selectedDate: string
}

const COLORS = {
  protein: '#ef4444',
  carbs: '#eab308',
  fat: '#3b82f6',
  fiber: '#10b981',
}

const MEAL_COLORS = {
  [MealType.BREAKFAST]: '#f59e0b',
  [MealType.LUNCH]: '#10b981',
  [MealType.DINNER]: '#3b82f6',
  [MealType.SNACK]: '#8b5cf6',
}

const DAILY_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
}

export default function NutritionCharts({ selectedDate }: NutritionChartsProps) {
  const [nutrition, setNutrition] = useState<DailyNutrition | null>(null)
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [selectedDate])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [nutritionData, entriesData] = await Promise.all([
        apiService.getDailyNutrition(selectedDate),
        apiService.getFoodEntries(selectedDate)
      ])
      setNutrition(nutritionData)
      setFoodEntries(entriesData.entries)
    } catch (error) {
      console.error('Error loading data:', error)
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
      setFoodEntries([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading charts...</div>
  }

  if (!nutrition) {
    return <div className="text-center py-8">No data available</div>
  }

  const macroData = [
    {
      name: 'Protein',
      value: nutrition.total_protein,
      percentage: nutrition.protein_percentage,
      color: COLORS.protein,
    },
    {
      name: 'Carbs',
      value: nutrition.total_carbs,
      percentage: nutrition.carbs_percentage,
      color: COLORS.carbs,
    },
    {
      name: 'Fat',
      value: nutrition.total_fat,
      percentage: nutrition.fat_percentage,
      color: COLORS.fat,
    },
  ]

  const goalComparisonData = [
    {
      name: 'Calories',
      actual: Math.round(nutrition.total_calories),
      goal: DAILY_GOALS.calories,
      unit: 'cal',
    },
    {
      name: 'Protein',
      actual: Math.round(nutrition.total_protein),
      goal: DAILY_GOALS.protein,
      unit: 'g',
    },
    {
      name: 'Carbs',
      actual: Math.round(nutrition.total_carbs),
      goal: DAILY_GOALS.carbs,
      unit: 'g',
    },
    {
      name: 'Fat',
      actual: Math.round(nutrition.total_fat),
      goal: DAILY_GOALS.fat,
      unit: 'g',
    },
  ]

  const mealBreakdownData = Object.values(MealType).map((mealType: MealType) => {
    const mealEntries = foodEntries.filter(entry => entry.meal_type === mealType)
    const totalCalories = mealEntries.reduce((sum, entry) => sum + entry.calories, 0)
    return {
      name: mealType.charAt(0).toUpperCase() + mealType.slice(1),
      calories: Math.round(totalCalories),
      color: MEAL_COLORS[mealType],
    }
  }).filter(meal => meal.calories > 0)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.payload?.unit && ` ${entry.payload.unit}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.color }}>
            {data.value.toFixed(1)}g ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Macro Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calories by Meal</CardTitle>
          </CardHeader>
          <CardContent>
            {mealBreakdownData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mealBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, calories }) => `${name} ${calories} cal`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="calories"
                  >
                    {mealBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No meal data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Goals vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={goalComparisonData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="actual" fill="#10b981" name="Actual" />
              <Bar dataKey="goal" fill="#e5e7eb" name="Goal" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {foodEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Food Entries Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {foodEntries.map((entry) => (
                <div key={entry.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{entry.food_name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({entry.meal_type}, {entry.quantity_grams}g)
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{Math.round(entry.calories)} cal</span>
                    <span className="text-gray-500 ml-2">
                      P: {entry.protein.toFixed(1)}g, C: {entry.carbs.toFixed(1)}g, F: {entry.fat.toFixed(1)}g
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
