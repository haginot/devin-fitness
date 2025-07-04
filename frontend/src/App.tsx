import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import FoodLogger from './components/FoodLogger'
import NutritionDashboard from './components/NutritionDashboard'
import NutritionCharts from './components/NutritionCharts'
import { CalendarDays, Utensils, BarChart3 } from 'lucide-react'

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 sm:max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center">
              <Utensils className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-2 sm:mr-3" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">MyFitnessPal</h1>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2 py-1 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 sm:max-w-7xl sm:px-6 lg:px-8 py-4 sm:py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="food-logger" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Utensils className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Food Logger</span>
              <span className="sm:hidden">Food</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Charts</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <NutritionDashboard selectedDate={selectedDate} />
          </TabsContent>

          <TabsContent value="food-logger" className="mt-0">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle>Food Logger</CardTitle>
                <CardDescription>
                  Search and log your meals throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FoodLogger selectedDate={selectedDate} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="mt-0">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle>Nutrition Analysis</CardTitle>
                <CardDescription>
                  Visualize your nutrition data with interactive charts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NutritionCharts selectedDate={selectedDate} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App
