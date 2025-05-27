"use client"

import { useState, useEffect } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp, Eye, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface MenuItem {
  id: string
  name: string
  currentPrice: number
  newPrice: number
}

interface Category {
  id: string
  name: string
  items: MenuItem[]
  isExpanded: boolean
}

export default function AddPriceChangesPage() {
  const [startDate, setStartDate] = useState("2025-05-28")
  const [endDate, setEndDate] = useState("2025-05-29")
  const [showHiddenCategories, setShowHiddenCategories] = useState(false)
  const [showHiddenItems, setShowHiddenItems] = useState(false)
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Meal Deals',
      isExpanded: true,
      items: [
        { id: '1', name: 'Quarter Chicken Meal', currentPrice: 9.99, newPrice: 9.99 },
        { id: '2', name: 'Half Chicken Meal', currentPrice: 13.99, newPrice: 13.99 },
        { id: '3', name: 'Charcoal Chicken Pack', currentPrice: 24.99, newPrice: 24.99 },
        { id: '4', name: 'Chicken + Rice Meal', currentPrice: 9.99, newPrice: 9.99 }
      ]
    },
    {
      id: '2',
      name: 'Grilled Chicken',
      isExpanded: false,
      items: [
        { id: '5', name: 'Grilled Chicken Breast', currentPrice: 12.99, newPrice: 12.99 },
        { id: '6', name: 'Grilled Chicken Thigh', currentPrice: 8.99, newPrice: 8.99 }
      ]
    }
  ])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId
        ? { ...category, isExpanded: !category.isExpanded }
        : category
    ))
  }

  const updateItemPrice = (categoryId: string, itemId: string, newPrice: number) => {
    setCategories(categories.map(category => 
      category.id === categoryId
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

  const handleSaveChanges = async () => {
    try {
      setSaving(true)

      // Validate dates
      if (!startDate || !endDate) {
        alert('Please select both start and end dates')
        return
      }

      if (new Date(startDate) >= new Date(endDate)) {
        alert('End date must be after start date')
        return
      }

      // Check if any prices have been changed
      const hasChanges = categories.some(category =>
        category.items.some(item => item.newPrice !== item.currentPrice)
      )

      if (!hasChanges) {
        alert('No price changes detected. Please modify at least one product price.')
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Price changes applied successfully!')
      
      // Redirect back to main page
      window.location.href = '/menus/price-changes'
      
    } catch (error: any) {
      console.error('Error applying price changes:', error)
      alert('Failed to apply price changes')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    window.location.href = '/menus/price-changes'
  }

  return (
    <PageLayout>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b bg-white">
        <div className="flex-1"></div>
        <h1 className="text-xl font-semibold flex-1 text-center">Dunfermline</h1>
        <div className="flex justify-end flex-1">
          <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
            <Eye className="h-4 w-4 mr-2" />
            View Your Store
          </button>
        </div>
      </header>
      
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-4">Add Price Changes</h1>
            
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <p className="text-gray-600 mb-4">
                Setup a sale or temporary price change here.
              </p>
              <p className="text-gray-600 mb-8">
                Choose the dates for the change and change any prices that you want included.
              </p>

              {/* Date inputs and toggles row */}
              <div className="flex items-center gap-8 mb-8">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Start Date:
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    End Date:
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-40"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={showHiddenCategories}
                    onCheckedChange={setShowHiddenCategories}
                  />
                  <label className="text-sm text-gray-700 whitespace-nowrap">
                    Show Hidden Categories
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showHiddenItems}
                    onCheckedChange={setShowHiddenItems}
                  />
                  <label className="text-sm text-gray-700 whitespace-nowrap">
                    Show Hidden Items
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
                  onClick={handleSaveChanges}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding Price Changes...
                    </>
                  ) : (
                    'Add Price Changes'
                  )}
                </Button>
              </div>
            </div>

            {/* Categories and Items */}
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-sm border">
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <h3 className="font-medium text-lg">{category.name}</h3>
                    <button className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
                      <span className="text-sm">
                        {category.isExpanded ? 'Collapse' : 'Expand'}
                      </span>
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
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-8 mb-6">
                          <div className="text-sm font-medium text-gray-500">
                            On start date, change to:
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            On end date, revert to:
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {category.items.map((item) => (
                            <div key={item.id} className="grid grid-cols-2 gap-8">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{item.name}</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-600">£</span>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="w-20 text-center"
                                    value={item.newPrice}
                                    onChange={(e) => updateItemPrice(
                                      category.id,
                                      item.id,
                                      parseFloat(e.target.value) || 0
                                    )}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center justify-end">
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-600">£</span>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="w-20 text-center bg-gray-50"
                                    value={item.currentPrice}
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        No items in this category.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 