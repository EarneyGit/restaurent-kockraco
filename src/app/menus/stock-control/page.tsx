"use client"

import { useState } from 'react'
import PageLayout from "@/components/layout/page-layout"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItem {
  id: number
  name: string
  isManaged: boolean
  quantity: number
}

interface Category {
  name: string
  items: MenuItem[]
  isExpanded: boolean
}

export default function StockControlPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      name: 'Lunch Time Deals',
      isExpanded: true,
      items: [
        { id: 1, name: 'Original Chicken Tex Mex or Veggie Legend Wrap and Drink', isManaged: false, quantity: 0 },
        { id: 2, name: 'Special Wrap and Drink', isManaged: false, quantity: 0 },
        { id: 3, name: 'Quarter Grilled Chicken Meal', isManaged: false, quantity: 0 },
        { id: 4, name: 'Half Grilled Chicken Meal', isManaged: false, quantity: 0 },
        { id: 5, name: 'Chicken Rice and Drink', isManaged: false, quantity: 0 },
        { id: 6, name: 'Quarter Chicken Gravy Fries and Drink', isManaged: false, quantity: 0 }
      ]
    },
    {
      name: 'Meal Deals',
      isExpanded: false,
      items: []
    },
    {
      name: 'Grilled Chicken',
      isExpanded: false,
      items: []
    },
    {
      name: 'Fried Chicken',
      isExpanded: false,
      items: []
    },
    {
      name: 'Chicken Wings',
      isExpanded: false,
      items: []
    },
    {
      name: 'Wraps',
      isExpanded: false,
      items: []
    },
    {
      name: 'Special Wraps',
      isExpanded: false,
      items: []
    },
    {
      name: 'Loaded Feasts',
      isExpanded: false,
      items: []
    },
    {
      name: 'Classic Sides',
      isExpanded: false,
      items: []
    },
    {
      name: 'Special Sides',
      isExpanded: false,
      items: []
    },
    {
      name: 'Salads',
      isExpanded: false,
      items: []
    },
    {
      name: 'Kids',
      isExpanded: false,
      items: []
    },
    {
      name: 'Sauces and Dips',
      isExpanded: false,
      items: []
    },
    {
      name: 'Desserts',
      isExpanded: false,
      items: []
    },
    {
      name: 'Milkshakes',
      isExpanded: false,
      items: []
    },
    {
      name: 'Soft Drinks',
      isExpanded: false,
      items: []
    }
  ])

  const toggleCategory = (categoryName: string) => {
    setCategories(categories.map(category => 
      category.name === categoryName 
        ? { ...category, isExpanded: !category.isExpanded }
        : category
    ))
  }

  const toggleItemManaged = (categoryName: string, itemId: number) => {
    setCategories(categories.map(category => 
      category.name === categoryName
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

  const updateItemQuantity = (categoryName: string, itemId: number, quantity: number) => {
    setCategories(categories.map(category => 
      category.name === categoryName
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

  const getManagedItemsCount = (category: Category) => {
    return category.items.filter(item => item.isManaged).length
  }

  const handleSaveChanges = () => {
    // Here you would typically save the changes to your backend
    console.log('Saving changes:', categories)
  }

  return (
    <PageLayout>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-3 border-b bg-white">
        <div className="flex-1"></div>
        <h1 className="text-xl font-medium flex-1 text-center">Admin user</h1>
        <div className="flex justify-end flex-1">
          <button className="flex items-center text-gray-700 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
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
            
            <Button 
              onClick={handleSaveChanges}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Save Changes
            </Button>
          </div>
          
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => toggleCategory(category.name)}
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
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {category.items.map((item) => (
                              <tr key={item.id}>
                                <td className="px-4 py-3 text-sm">{item.name}</td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex justify-center">
                                    <Switch
                                      checked={item.isManaged}
                                      onCheckedChange={() => toggleItemManaged(category.name, item.id)}
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
                                      category.name,
                                      item.id,
                                      parseInt(e.target.value) || 0
                                    )}
                                    disabled={!item.isManaged}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No items are currently being managed in this category.
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