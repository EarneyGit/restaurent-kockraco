"use client"

import { useState, useEffect } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp, Eye, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { priceChangesService, Category, MenuItem } from "@/services/price-changes.service"
import { toast } from "sonner"

export default function PriceChangesPage() {
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [showHiddenCategories, setShowHiddenCategories] = useState(false)
  const [showHiddenItems, setShowHiddenItems] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load categories and products on component mount and when filters change
  useEffect(() => {
    loadCategoriesWithProducts()
  }, [showHiddenCategories, showHiddenItems])

  const loadCategoriesWithProducts = async () => {
    try {
      setLoading(true)
      const response = await priceChangesService.getCategoriesWithProducts(
        showHiddenCategories,
        showHiddenItems
      )
      
      if (response.success) {
        setCategories(response.data)
      } else {
        toast.error('Failed to load categories and products')
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories and products')
    } finally {
      setLoading(false)
    }
  }

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
        toast.error('Please select both start and end dates')
        return
      }

      if (new Date(startDate) >= new Date(endDate)) {
        toast.error('End date must be after start date')
        return
      }

      // Check if any prices have been changed
      const hasChanges = categories.some(category =>
        category.items.some(item => item.newPrice !== item.currentPrice)
      )

      if (!hasChanges) {
        toast.error('No price changes detected. Please modify at least one product price.')
        return
      }

      const response = await priceChangesService.applyPriceChanges({
        startDate,
        endDate,
        showHiddenCategories,
        showHiddenItems,
        categories
      })

      if (response.success) {
        toast.success(response.message || 'Price changes applied successfully!')
        
        // Reload the data to reflect changes
        await loadCategoriesWithProducts()
      } else {
        toast.error(response.message || 'Failed to apply price changes')
      }
    } catch (error: any) {
      console.error('Error applying price changes:', error)
      const errorMessage = error.response?.data?.message || 'Failed to apply price changes'
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading categories and products...</span>
          </div>
        </div>
      </PageLayout>
    )
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
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Applying Changes...
                  </>
                ) : (
                  'Add Price Changes'
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {categories.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-500">No categories found. Please check your filters or add some categories first.</p>
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-sm">
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => toggleCategory(category.id)}
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
                                      category.id,
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
              ))
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 