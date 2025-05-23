"use client"

import { useState, useEffect } from 'react'
import PageLayout from "@/components/layout/page-layout"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from 'react-hot-toast'
import api from '@/lib/axios'

interface StockItem {
  id: string
  name: string
  isManaged: boolean
  quantity: number
  lowStockThreshold: number
  isLowStock: boolean
}

interface StockCategory {
  id: string
  name: string
  items: StockItem[]
  isExpanded: boolean
}

export default function StockControlPage() {
  const [categories, setCategories] = useState<StockCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Extract data fetching logic into a reusable function
  const fetchData = async () => {
    try {
      // Fetch categories
      const categoriesResponse = await api.get('/categories')
      const productsResponse = await api.get('/products')
      
      if (categoriesResponse.data.success && productsResponse.data.success) {
        const categoriesData = categoriesResponse.data.data
        const productsData = productsResponse.data.data
        
        // Transform products data to match stock interface
        const transformedProducts = productsData.map((product: any) => ({
          id: product.id,
          name: product.name,
          isManaged: product.stockManagement?.isManaged || false,
          quantity: product.stockManagement?.quantity || 0,
          lowStockThreshold: product.stockManagement?.lowStockThreshold || 10,
          isLowStock: (product.stockManagement?.quantity || 0) <= (product.stockManagement?.lowStockThreshold || 10),
          categoryId: product.category?.id || product.category?._id
        }))
        
        // Group products by category
        const categoriesWithProducts = categoriesData.map((category: any) => {
          const categoryProducts = transformedProducts.filter(
            (product: any) => product.categoryId === (category.id || category._id)
          )
          
          return {
            id: category.id || category._id,
            name: category.name,
            items: categoryProducts,
            isExpanded: categoryProducts.some((item: StockItem) => item.isManaged) // Expand if has managed items
          }
        })
        
        setCategories(categoriesWithProducts)
      } else {
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch categories and products')
    }
  }

  // Fetch categories and products with stock information
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await fetchData()
      setIsLoading(false)
    }

    loadData()
  }, [])

  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId 
        ? { ...category, isExpanded: !category.isExpanded }
        : category
    ))
  }

  const toggleItemManaged = (categoryId: string, itemId: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId
        ? {
            ...category,
            items: category.items.map(item =>
              item.id === itemId
                ? { ...item, isManaged: !item.isManaged }
                : item
            )
          }
        : category
    ))
  }

  const updateItemQuantity = (categoryId: string, itemId: string, quantity: number) => {
    setCategories(categories.map(category => 
      category.id === categoryId
        ? {
            ...category,
            items: category.items.map(item =>
              item.id === itemId
                ? { ...item, quantity }
                : item
            )
          }
        : category
    ))
  }

  const getManagedItemsCount = (category: StockCategory) => {
    return category.items.filter(item => item.isManaged).length
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      // Collect all products for bulk update
      const allProducts: any[] = []
      
      categories.forEach(category => {
        category.items.forEach(item => {
          allProducts.push({
            id: item.id,
            isManaged: item.isManaged,
            quantity: item.quantity
          })
        })
      })

      // Call the bulk update API
      const response = await api.put('/products/stock/bulk-update', {
        products: allProducts
      })

      if (response.data.success) {
        const { successCount, errorCount, errors } = response.data.data
        
        if (errorCount > 0) {
          console.warn('Some products failed to update:', errors)
          toast.error(`${successCount} products updated, ${errorCount} failed`)
        } else {
          toast.success(`Stock updated successfylly`);
        }

        // Refetch all data to get updated stock status
        await fetchData()
        
        // Update the last updated timestamp
        setLastUpdated(new Date().toISOString())
      } else {
        throw new Error(response.data.message || 'Failed to update stock')
      }
    } catch (error) {
      console.error('Error saving changes:', error)
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const getTotalManagedItems = () => {
    return categories.reduce((total, category) => total + getManagedItemsCount(category), 0)
  }

  const getTotalItems = () => {
    return categories.reduce((total, category) => total + category.items.length, 0)
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
          <h1 className="text-2xl font-medium mb-4">Stock Control</h1>
          
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <p className="text-gray-600 mb-2">
              Use this page to mark which of your menu items should have their stock managed and to update the number of them in stock.
            </p>
            <p className="text-gray-600 mb-4">
              You don't have to set stock details for your full menu. Doing so will prevent your customers from ordering items that are out of stock.
            </p>
            
            {!isLoading && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <div>Managing {getTotalManagedItems()} of {getTotalItems()} products across {categories.length} categories</div>
                  {lastUpdated && (
                    <div className="text-xs text-gray-500 mt-1">
                      Last updated: {new Date(lastUpdated).toLocaleString()}
                    </div>
                  )}
                </div>
                <Button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <h3 className="font-medium">
                      {category.name} ({getManagedItemsCount(category)} Managed Items)
                    </h3>
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
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr className="text-left text-sm text-gray-500">
                                <th className="px-4 py-2">Item name</th>
                                <th className="px-4 py-2 text-center">Managed?</th>
                                <th className="px-4 py-2 text-center">Quantity</th>
                                <th className="px-4 py-2 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {category.items.map((item) => (
                                <tr key={item.id} className={cn(
                                  item.isLowStock && item.isManaged ? "bg-red-50" : ""
                                )}>
                                  <td className="px-4 py-3 text-sm">
                                    <div>
                                      <div className="font-medium">{item.name}</div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center">
                                      <Switch
                                        checked={item.isManaged}
                                        onCheckedChange={() => toggleItemManaged(category.id, item.id)}
                                      />
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <Input 
                                      type="number"
                                      min="0"
                                      className="w-20 text-center"
                                      value={item.quantity}
                                      onChange={(e) => updateItemQuantity(
                                        category.id,
                                        item.id,
                                        parseInt(e.target.value) || 0
                                      )}
                                      disabled={!item.isManaged}
                                    />
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {item.isManaged ? (
                                      <span className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                        item.isLowStock 
                                          ? "bg-red-100 text-red-800" 
                                          : "bg-green-100 text-green-800"
                                      )}>
                                        {item.isLowStock ? "Low Stock" : "In Stock"}
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Not Managed
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No products found in this category.
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {categories.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500">No categories found. Add some categories in Menu Setup first.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
} 