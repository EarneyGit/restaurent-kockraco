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

export default function AddPriceChangesPage() {
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(format(new Date(Date.now() + 24 * 60 * 60 * 1000), "yyyy-MM-dd"))
  const [showHiddenCategories, setShowHiddenCategories] = useState(false)
  const [showHiddenItems, setShowHiddenItems] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load categories and products on component mount and when filters change
  useEffect(() => {
    loadCategoriesWithProducts()
  }, [showHiddenCategories, showHiddenItems])

  const loadCategoriesWithProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await priceChangesService.getCategoriesWithProducts(
        showHiddenCategories,
        showHiddenItems
      )
      
      if (response.success) {
        // Update categories to include tempPrice for the UI
        const categoriesWithTempPrices = response.data.map(category => ({
          ...category,
          items: category.items.map(item => ({
            ...item,
            tempPrice: item.effectivePrice || item.currentPrice, // Use effective price as starting point
          }))
        }))
        setCategories(categoriesWithTempPrices)
      } else {
        const errorMsg = 'Failed to load categories and products'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (error: any) {
      console.error('Error loading categories:', error)
      const errorMsg = `API Error: ${error.response?.data?.message || error.message || 'Unknown error'}`
      setError(errorMsg)
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
                ? { ...item, tempPrice: newPrice }
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
        category.items.some(item => item.tempPrice !== item.currentPrice)
      )

      if (!hasChanges) {
        toast.error('No price changes detected. Please modify at least one product price.')
        return
      }

      const response = await priceChangesService.applyPriceChanges({
        startDate,
        endDate,
        categories
      })

      if (response.success) {
        toast.success(response.message || 'Price changes applied successfully!')
        
        // Redirect back to main page after a short delay
        setTimeout(() => {
          window.location.href = '/menus/price-changes'
        }, 1000)
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

  const handleCancel = () => {
    window.location.href = '/menus/price-changes'
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
          {/* Error Display */}
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-800 mb-2">⚠️ Connection Error</h3>
              <p className="text-sm text-red-700">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadCategoriesWithProducts}
                className="mt-3 text-red-600 border-red-300 hover:bg-red-50"
              >
                Retry Connection
              </Button>
            </div>
          )}

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
                    disabled={saving}
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
                    disabled={saving}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={showHiddenCategories}
                    onCheckedChange={setShowHiddenCategories}
                    disabled={loading || saving}
                  />
                  <label className="text-sm text-gray-700 whitespace-nowrap">
                    Show Hidden Categories
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showHiddenItems}
                    onCheckedChange={setShowHiddenItems}
                    disabled={loading || saving}
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
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
                  onClick={handleSaveChanges}
                  disabled={saving || categories.length === 0}
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
            {categories.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-4">No categories or products found.</p>
                <p className="text-sm text-gray-400 mb-4">
                  Try adjusting the "Show Hidden" settings or check your connection.
                </p>
                <Button 
                  variant="outline" 
                  onClick={loadCategoriesWithProducts}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Reload Categories'
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white rounded-lg shadow-sm border">
                    <div 
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <h3 className="font-medium text-lg">
                        {category.name}
                        <span className="ml-2 text-sm text-gray-500">
                          ({category.items?.length || 0} items)
                        </span>
                      </h3>
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
                      {category.items && category.items.length > 0 ? (
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
                                  <div>
                                    <span className="font-medium">{item.name}</span>
                                    {item.hasActiveChange && (
                                      <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                        Active Change
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-600">£</span>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      className="w-20 text-center"
                                      value={item.tempPrice}
                                      onChange={(e) => updateItemPrice(
                                        category.id,
                                        item.id,
                                        parseFloat(e.target.value) || 0
                                      )}
                                      disabled={saving}
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
                                      value={item.revertPrice || item.currentPrice}
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
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 