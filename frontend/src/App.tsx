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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Utensils className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Nutrition Tracker</h1>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="food-logger" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Food Logger
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Charts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Nutrition Overview</CardTitle>
                <CardDescription>
                  Track your daily calorie intake and macro nutrients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NutritionDashboard selectedDate={selectedDate} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="food-logger" className="mt-6">
            <Card>
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

          <TabsContent value="charts" className="mt-6">
            <Card>
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
