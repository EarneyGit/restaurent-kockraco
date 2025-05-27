"use client"

import { useState, useEffect } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp, Eye, Loader2, Clock, Edit, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { priceChangesService, Category, MenuItem } from "@/services/price-changes.service"
import { toast } from "sonner"

interface PriceChange {
  id: string
  itemName: string
  startDate: string
  startPrice: number
  endDate: string
  endPrice: number
  status: 'current' | 'future' | 'expired'
}

interface EditModalProps {
  isOpen: boolean
  priceChange: PriceChange | null
  onClose: () => void
  onSave: (updatedPriceChange: PriceChange) => void
}

function EditPriceChangeModal({ isOpen, priceChange, onClose, onSave }: EditModalProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startPrice, setStartPrice] = useState("")
  const [endPrice, setEndPrice] = useState("")

  useEffect(() => {
    if (priceChange && isOpen) {
      // Convert display date format (29/05/2025) to input format (2025-05-29)
      const convertToInputDate = (displayDate: string) => {
        const [day, month, year] = displayDate.split('/')
        return `${year}-${month}-${day}`
      }
      
      setStartDate(convertToInputDate(priceChange.startDate))
      setEndDate(convertToInputDate(priceChange.endDate))
      setStartPrice(priceChange.startPrice.toString())
      setEndPrice(priceChange.endPrice.toString())
    }
  }, [priceChange, isOpen])

  const handleSave = () => {
    if (!priceChange) return

    // Convert input date format back to display format
    const convertToDisplayDate = (inputDate: string) => {
      const [year, month, day] = inputDate.split('-')
      return `${day}/${month}/${year}`
    }

    const updatedPriceChange: PriceChange = {
      ...priceChange,
      startDate: convertToDisplayDate(startDate),
      endDate: convertToDisplayDate(endDate),
      startPrice: parseFloat(startPrice),
      endPrice: parseFloat(endPrice)
    }

    onSave(updatedPriceChange)
    onClose()
  }

  if (!isOpen || !priceChange) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-6">Edit Price Change: {priceChange.itemName}</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">£</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={startPrice}
                  onChange={(e) => setStartPrice(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">£</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={endPrice}
                  onChange={(e) => setEndPrice(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Close
            </Button>
            <Button
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
            >
              Save Price Change
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PriceChangesPage() {
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [showHiddenCategories, setShowHiddenCategories] = useState(false)
  const [showHiddenItems, setShowHiddenItems] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentChanges, setCurrentChanges] = useState<PriceChange[]>([])
  const [futureChanges, setFutureChanges] = useState<PriceChange[]>([
    {
      id: '1',
      itemName: 'sample chicken',
      startDate: '29/05/2025',
      startPrice: 10.00,
      endDate: '31/05/2025',
      endPrice: 4.00,
      status: 'future'
    }
  ])
  const [historicalChanges, setHistoricalChanges] = useState<PriceChange[]>([
    {
      id: '2',
      itemName: 'sample chicken (Expired)',
      startDate: '25/05/2025',
      startPrice: 4.00,
      endDate: '26/05/2025',
      endPrice: 5.00,
      status: 'expired'
    }
  ])

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPriceChange, setEditingPriceChange] = useState<PriceChange | null>(null)

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

  const handleEdit = (id: string) => {
    const priceChange = futureChanges.find(change => change.id === id) ||
                       currentChanges.find(change => change.id === id)
    
    if (priceChange) {
      setEditingPriceChange(priceChange)
      setIsEditModalOpen(true)
    }
  }

  const handleSaveEdit = (updatedPriceChange: PriceChange) => {
    if (updatedPriceChange.status === 'future') {
      setFutureChanges(futureChanges.map(change =>
        change.id === updatedPriceChange.id ? updatedPriceChange : change
      ))
    } else if (updatedPriceChange.status === 'current') {
      setCurrentChanges(currentChanges.map(change =>
        change.id === updatedPriceChange.id ? updatedPriceChange : change
      ))
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this price change?')) {
      setFutureChanges(futureChanges.filter(change => change.id !== id))
      setCurrentChanges(currentChanges.filter(change => change.id !== id))
    }
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingPriceChange(null)
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
          {/* Page Title and Add Button */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-medium text-gray-900">Temporary Price Changes</h1>
            <Button 
              className="bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-6 py-2"
              onClick={() => window.location.href = '/menus/price-changes/add'}
            >
              Add Price Changes
            </Button>
          </div>

          {/* Current Price Changes Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Price Changes</h2>
            {currentChanges.length === 0 ? (
              <div className="bg-white rounded-lg p-6 border">
                <p className="text-gray-500">There are no current price changes</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-700 text-sm">
                  <div>Item</div>
                  <div>Start Date</div>
                  <div>Start Price</div>
                  <div>End Date</div>
                  <div>End Price</div>
                  <div></div>
                </div>
                {currentChanges.map((change) => (
                  <div key={change.id} className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0 items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-amber-500 mr-2" />
                      {change.itemName}
                    </div>
                    <div className="text-gray-600">{change.startDate}</div>
                    <div className="text-gray-600">£{change.startPrice.toFixed(2)}</div>
                    <div className="text-gray-600">{change.endDate}</div>
                    <div className="text-gray-600">£{change.endPrice.toFixed(2)}</div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-1"
                        onClick={() => handleEdit(change.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                        onClick={() => handleDelete(change.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Future Price Changes Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Future Price Changes</h2>
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-700 text-sm">
                <div>Item</div>
                <div>Start Date</div>
                <div>Start Price</div>
                <div>End Date</div>
                <div>End Price</div>
                <div></div>
              </div>
              {futureChanges.map((change) => (
                <div key={change.id} className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0 items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                    {change.itemName}
                  </div>
                  <div className="text-gray-600">{change.startDate}</div>
                  <div className="text-gray-600">£{change.startPrice.toFixed(2)}</div>
                  <div className="text-gray-600">{change.endDate}</div>
                  <div className="text-gray-600">£{change.endPrice.toFixed(2)}</div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-1"
                      onClick={() => handleEdit(change.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                      onClick={() => handleDelete(change.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Price Changes Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Historical Price Changes</h2>
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-700 text-sm">
                <div>Item</div>
                <div>Start Date</div>
                <div>Start Price</div>
                <div>End Date</div>
                <div>End Price</div>
              </div>
              {historicalChanges.map((change) => (
                <div key={change.id} className="grid grid-cols-5 gap-4 p-4 border-b last:border-b-0 items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    {change.itemName}
                  </div>
                  <div className="text-gray-600">{change.startDate}</div>
                  <div className="text-gray-600">£{change.startPrice.toFixed(2)}</div>
                  <div className="text-gray-600">{change.endDate}</div>
                  <div className="text-gray-600">£{change.endPrice.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditPriceChangeModal
        isOpen={isEditModalOpen}
        priceChange={editingPriceChange}
        onClose={closeEditModal}
        onSave={handleSaveEdit}
      />
    </PageLayout>
  )
} 