import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Flame, Zap, Wheat, Droplets } from 'lucide-react'
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

  const caloriesProgress = (nutrition.total_calories / DAILY_GOALS.calories) * 100
  const proteinProgress = (nutrition.total_protein / DAILY_GOALS.protein) * 100
  const carbsProgress = (nutrition.total_carbs / DAILY_GOALS.carbs) * 100
  const fatProgress = (nutrition.total_fat / DAILY_GOALS.fat) * 100
  const fiberProgress = (nutrition.total_fiber / DAILY_GOALS.fiber) * 100

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Flame className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(nutrition.total_calories)}</div>
            <p className="text-xs text-muted-foreground">
              of {DAILY_GOALS.calories} goal
            </p>
            <Progress value={Math.min(caloriesProgress, 100)} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(caloriesProgress)}% complete
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
            <Zap className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutrition.total_protein.toFixed(1)}g</div>
            <p className="text-xs text-muted-foreground">
              of {DAILY_GOALS.protein}g goal
            </p>
            <Progress value={Math.min(proteinProgress, 100)} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(proteinProgress)}% complete
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbs</CardTitle>
            <Wheat className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutrition.total_carbs.toFixed(1)}g</div>
            <p className="text-xs text-muted-foreground">
              of {DAILY_GOALS.carbs}g goal
            </p>
            <Progress value={Math.min(carbsProgress, 100)} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(carbsProgress)}% complete
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fat</CardTitle>
            <Droplets className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutrition.total_fat.toFixed(1)}g</div>
            <p className="text-xs text-muted-foreground">
              of {DAILY_GOALS.fat}g goal
            </p>
            <Progress value={Math.min(fatProgress, 100)} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(fatProgress)}% complete
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Macro Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Protein</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{nutrition.protein_percentage.toFixed(1)}%</Badge>
                  <span className="text-sm text-muted-foreground">
                    {nutrition.total_protein.toFixed(1)}g
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Carbohydrates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{nutrition.carbs_percentage.toFixed(1)}%</Badge>
                  <span className="text-sm text-muted-foreground">
                    {nutrition.total_carbs.toFixed(1)}g
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Fat</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{nutrition.fat_percentage.toFixed(1)}%</Badge>
                  <span className="text-sm text-muted-foreground">
                    {nutrition.total_fat.toFixed(1)}g
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Nutrients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Fiber</span>
                <div className="flex items-center gap-2">
                  <Progress value={Math.min(fiberProgress, 100)} className="w-20" />
                  <span className="text-sm text-muted-foreground">
                    {nutrition.total_fiber.toFixed(1)}g / {DAILY_GOALS.fiber}g
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Calorie Balance</span>
                <div className="text-sm">
                  {nutrition.total_calories < DAILY_GOALS.calories ? (
                    <Badge variant="secondary" className="text-green-700 bg-green-100">
                      -{Math.round(DAILY_GOALS.calories - nutrition.total_calories)} remaining
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-red-700 bg-red-100">
                      +{Math.round(nutrition.total_calories - DAILY_GOALS.calories)} over
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
