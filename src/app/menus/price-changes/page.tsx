"use client"

import { useState } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface MenuItem {
  id: string
  name: string
  currentPrice: number
  newPrice: number
}

interface Category {
  name: string
  items: MenuItem[]
  isExpanded: boolean
}

export default function PriceChangesPage() {
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [showHiddenCategories, setShowHiddenCategories] = useState(false)
  const [showHiddenItems, setShowHiddenItems] = useState(false)
  const [categories, setCategories] = useState<Category[]>([
    {
      name: "Meal Deals",
      isExpanded: true,
      items: [
        { id: "1", name: "Quarter Chicken Meal", currentPrice: 9.99, newPrice: 9.99 },
        { id: "2", name: "Half Chicken Meal", currentPrice: 13.99, newPrice: 13.99 },
        { id: "3", name: "Charcoal Chicken Pack", currentPrice: 24.99, newPrice: 24.99 },
        { id: "4", name: "Chicken + Rice Meal", currentPrice: 9.99, newPrice: 9.99 }
      ]
    },
    {
      name: "Grilled Chicken",
      isExpanded: false,
      items: []
    },
    // Add more categories as needed
  ])

  const toggleCategory = (categoryName: string) => {
    setCategories(categories.map(category => 
      category.name === categoryName
        ? { ...category, isExpanded: !category.isExpanded }
        : category
    ))
  }

  const updateItemPrice = (categoryName: string, itemId: string, newPrice: number) => {
    setCategories(categories.map(category => 
      category.name === categoryName
        ? {
            ...category,
            items: category.items.map(item =>
              item.id === itemId
                ? { ...item, newPrice }
                : item
            )
          }
        : category
    ))
  }

  const handleSaveChanges = () => {
    // Here you would save the changes to your backend
    console.log("Saving price changes:", {
      startDate,
      endDate,
      showHiddenCategories,
      showHiddenItems,
      categories
    })
  }

  return (
    <PageLayout>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-3 border-b bg-white">
        <div className="flex-1"></div>
        <h1 className="text-xl font-medium flex-1 text-center">Admin user</h1>
        <div className="flex justify-end flex-1">
          <button className="flex items-center text-gray-700 font-medium">
            <Eye className="h-5 w-5 mr-1" />
            View Your Store
          </button>
        </div>
      </header>
      
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-medium mb-4">Add Price Changes</h1>
          
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <p className="text-gray-600 mb-4">
              Setup a sale or temporary price change here.
            </p>
            <p className="text-gray-600 mb-6">
              Choose the dates for the change and change any prices that you want included.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date:
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date:
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={showHiddenCategories}
                  onCheckedChange={setShowHiddenCategories}
                />
                <label className="text-sm text-gray-700">
                  Show Hidden Categories
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={showHiddenItems}
                  onCheckedChange={setShowHiddenItems}
                />
                <label className="text-sm text-gray-700">
                  Show Hidden Items
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button 
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={handleSaveChanges}
              >
                Add Price Changes
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name} className="bg-white rounded-lg shadow-sm">
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => toggleCategory(category.name)}
                >
                  <h3 className="font-medium">{category.name}</h3>
                  <button className="text-gray-500 hover:text-gray-700">
                    {category.isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className={cn(
                  "border-t",
                  category.isExpanded ? "block" : "hidden"
                )}>
                  {category.items.length > 0 ? (
                    <div className="p-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-8">
                          <div className="text-sm font-medium text-gray-500">
                            On start date, change to:
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            On end date, revert to:
                          </div>
                        </div>
                        {category.items.map((item) => (
                          <div key={item.id} className="grid grid-cols-2 gap-8">
                            <div className="flex items-center gap-4">
                              <span className="flex-1">{item.name}</span>
                              <div className="flex items-center gap-1">
                                <span>£</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-24"
                                  value={item.newPrice}
                                  onChange={(e) => updateItemPrice(
                                    category.name,
                                    item.id,
                                    parseFloat(e.target.value) || 0
                                  )}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>£</span>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-24"
                                value={item.currentPrice}
                                disabled
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No items in this category.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 