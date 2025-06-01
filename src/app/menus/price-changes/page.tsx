"use client"

import { useState, useEffect } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp, Eye, Loader2, Clock, Edit, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { priceChangesService, Category, MenuItem, TemporaryPriceChange } from "@/services/price-changes.service"
import { toast } from "sonner"

interface EditModalProps {
  isOpen: boolean
  priceChange: TemporaryPriceChange | null
  onClose: () => void
  onSave: (updatedPriceChange: TemporaryPriceChange) => void
}

function EditPriceChangeModal({ isOpen, priceChange, onClose, onSave }: EditModalProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startPrice, setStartPrice] = useState("")
  const [endPrice, setEndPrice] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (priceChange && isOpen) {
      setStartDate(convertToInputDate(priceChange.startDate))
      setEndDate(convertToInputDate(priceChange.endDate))
      setStartPrice(priceChange.startPrice.toString())
      setEndPrice(priceChange.endPrice.toString())
    }
  }, [priceChange, isOpen])

  const handleSave = async () => {
    if (!priceChange) return

    try {
      setSaving(true)

      const response = await priceChangesService.updatePriceChange(priceChange.id, {
        startDate: startDate,
        endDate: endDate,
        startPrice: parseFloat(startPrice),
        endPrice: parseFloat(endPrice)
      })

      if (response.success) {
        toast.success('Price change updated successfully')
        
        const updatedPriceChange: TemporaryPriceChange = {
          ...priceChange,
          startDate: convertToDisplayDate(startDate),
          endDate: convertToDisplayDate(endDate),
          startPrice: parseFloat(startPrice),
          endPrice: parseFloat(endPrice)
        }

        onSave(updatedPriceChange)
        onClose()
      } else {
        toast.error(response.message || 'Failed to update price change')
      }
    } catch (error: any) {
      console.error('Error updating price change:', error)
      toast.error(error.response?.data?.message || 'Failed to update price change')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen || !priceChange) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-6">Edit Price Change: {priceChange.productName}</h2>
          
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
                disabled={saving}
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
                  disabled={saving}
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
                disabled={saving}
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
                  disabled={saving}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6"
              disabled={saving}
            >
              Close
            </Button>
            <Button
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Price Change'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to format dates consistently
const formatDisplayDate = (dateString: string) => {
  try {
    // If it's already in DD/MM/YYYY format, return as is
    if (dateString.includes('/')) {
      return dateString
    }
    // If it's in ISO format (YYYY-MM-DD), convert to DD/MM/YYYY
    const date = new Date(dateString)
    return format(date, 'dd/MM/yyyy')
  } catch (error) {
    return dateString // Return original if parsing fails
  }
}

// Helper function to convert display date to input date
const convertToInputDate = (dateString: string) => {
  try {
    // Handle different date formats
    if (dateString.includes('/')) {
      // DD/MM/YYYY format
      const [day, month, year] = dateString.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    } else if (dateString.includes('T') || dateString.includes('-')) {
      // ISO format (YYYY-MM-DDTHH:mm:ss.sssZ) or YYYY-MM-DD format
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    // If it's already in YYYY-MM-DD format, return as is
    return dateString
  } catch (error) {
    console.error('Error converting date:', error)
    return dateString
  }
}

// Helper function to convert input date back to display format
const convertToDisplayDate = (inputDate: string) => {
  try {
    if (inputDate.includes('-') && inputDate.length === 10) {
      const [year, month, day] = inputDate.split('-')
      return `${day}/${month}/${year}`
    }
    return inputDate
  } catch (error) {
    return inputDate
  }
}

export default function PriceChangesPage() {
  const [loading, setLoading] = useState(true)
  const [currentChanges, setCurrentChanges] = useState<TemporaryPriceChange[]>([])
  const [futureChanges, setFutureChanges] = useState<TemporaryPriceChange[]>([])
  const [historicalChanges, setHistoricalChanges] = useState<TemporaryPriceChange[]>([])
  const [deletedChanges, setDeletedChanges] = useState<TemporaryPriceChange[]>([])
  const [counts, setCounts] = useState({
    current: 0,
    future: 0,
    historical: 0,
    deleted: 0,
    total: 0
  })
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPriceChange, setEditingPriceChange] = useState<TemporaryPriceChange | null>(null)

  // Load temporary price changes on component mount
  useEffect(() => {
    loadTemporaryPriceChanges()
  }, [])

  const loadTemporaryPriceChanges = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await priceChangesService.getTemporaryPriceChanges()
      
      console.log('API Response:', response) // Debug log
      
      if (response.success) {
        console.log('Current changes:', response.data.current) // Debug log
        console.log('Future changes:', response.data.future) // Debug log
        console.log('Historical changes:', response.data.historical) // Debug log
        console.log('Deleted changes:', response.data.deleted) // Debug log
        
        setCurrentChanges(response.data.current)
        setFutureChanges(response.data.future)
        setHistoricalChanges(response.data.historical)
        setDeletedChanges(response.data.deleted)
        setCounts(response.data.counts)
        setLastUpdated(new Date())
        setError(null)
      } else {
        const errorMsg = 'Failed to load temporary price changes'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (error: any) {
      console.error('Error loading temporary price changes:', error)
      const errorMsg = `API Error: ${error.response?.data?.message || error.message || 'Unknown error'}`
      setError(errorMsg)
      toast.error('Failed to load temporary price changes')
    } finally {
      setLoading(false)
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

  const handleSaveEdit = (updatedPriceChange: TemporaryPriceChange) => {
    // Update the local state
    setFutureChanges(futureChanges.map(change =>
      change.id === updatedPriceChange.id ? updatedPriceChange : change
    ))
    setCurrentChanges(currentChanges.map(change =>
      change.id === updatedPriceChange.id ? updatedPriceChange : change
    ))

    // Refresh data from server to ensure consistency
    loadTemporaryPriceChanges()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this price change?')) {
      return
    }

    try {
      const response = await priceChangesService.deletePriceChange(id)
      
      if (response.success) {
        toast.success('Price change deleted successfully')
        
        // Refresh data from server to get updated lists including deleted items
        loadTemporaryPriceChanges()
      } else {
        toast.error(response.message || 'Failed to delete price change')
      }
    } catch (error: any) {
      console.error('Error deleting price change:', error)
      toast.error(error.response?.data?.message || 'Failed to delete price change')
    }
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingPriceChange(null)
  }

  const handleRevertExpiredChanges = async () => {
    try {
      const response = await priceChangesService.revertExpiredPriceChanges()
      
      if (response.success) {
        toast.success(response.message || 'Expired price changes reverted successfully')
        loadTemporaryPriceChanges()
      } else {
        toast.error(response.message || 'Failed to revert expired price changes')
      }
    } catch (error: any) {
      console.error('Error reverting expired price changes:', error)
      toast.error(error.response?.data?.message || 'Failed to revert expired price changes')
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading temporary price changes...</span>
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
          {/* Page Title and Actions */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-medium text-gray-900">Temporary Price Changes</h1>
              <p className="text-gray-600 mt-1">
                Total: {counts.total} | Current: {counts.current} | Future: {counts.future} | Historical: {counts.historical} | Deleted: {counts.deleted}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={loadTemporaryPriceChanges}
                disabled={loading}
                className="px-4 py-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Refresh'
                )}
              </Button>
              {counts.historical > 0 && (
                <Button 
                  variant="outline"
                  onClick={handleRevertExpiredChanges}
                  className="px-4 py-2 text-orange-600 border-orange-500 hover:bg-orange-50"
                >
                  Revert Expired
                </Button>
              )}
              <Button 
                className="bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-6 py-2"
                onClick={() => window.location.href = '/menus/price-changes/add'}
              >
                Add Price Changes
              </Button>
            </div>
          </div>

          {/* Current Price Changes Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Current Price Changes
              {counts.current > 0 && (
                <span className="ml-2 bg-amber-100 text-amber-800 text-sm px-2 py-1 rounded-full">
                  {counts.current}
                </span>
              )}
            </h2>
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
                      <div>
                        <div className="font-medium">{change.productName}</div>
                        <div className="text-sm text-gray-500">{change.category}</div>
                      </div>
                    </div>
                    <div className="text-gray-600">{formatDisplayDate(change.startDate)}</div>
                    <div className="text-gray-600">£{change.startPrice.toFixed(2)}</div>
                    <div className="text-gray-600">{formatDisplayDate(change.endDate)}</div>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Future Price Changes
              {counts.future > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                  {counts.future}
                </span>
              )}
            </h2>
            {futureChanges.length === 0 ? (
              <div className="bg-white rounded-lg p-6 border">
                <p className="text-gray-500">There are no future price changes</p>
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
                {futureChanges.map((change) => (
                  <div key={change.id} className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0 items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-500 mr-2" />
                      <div>
                        <div className="font-medium">{change.productName}</div>
                        <div className="text-sm text-gray-500">{change.category}</div>
                      </div>
                    </div>
                    <div className="text-gray-600">{formatDisplayDate(change.startDate)}</div>
                    <div className="text-gray-600">£{change.startPrice.toFixed(2)}</div>
                    <div className="text-gray-600">{formatDisplayDate(change.endDate)}</div>
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
            )}
          </div>

          {/* Historical Price Changes Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Historical Price Changes
              {counts.historical > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full">
                  {counts.historical}
                </span>
              )}
            </h2>
            {historicalChanges.length === 0 ? (
              <div className="bg-white rounded-lg p-6 border">
                <p className="text-gray-500">There are no historical price changes</p>
              </div>
            ) : (
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
                      <div>
                        <div className="font-medium text-gray-700">{change.productName}</div>
                        <div className="text-sm text-gray-500">{change.category}</div>
                        {!change.active && (
                          <div className="text-xs text-red-500 mt-1">Expired</div>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-600">{formatDisplayDate(change.startDate)}</div>
                    <div className="text-gray-600">£{change.startPrice.toFixed(2)}</div>
                    <div className="text-gray-600">{formatDisplayDate(change.endDate)}</div>
                    <div className="text-gray-600">£{change.endPrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deleted Price Changes Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Deleted Price Changes
              {counts.deleted > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full">
                  {counts.deleted}
                </span>
              )}
            </h2>
            {deletedChanges.length === 0 ? (
              <div className="bg-white rounded-lg p-6 border">
                <p className="text-gray-500">There are no deleted price changes</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-700 text-sm">
                  <div>Item</div>
                  <div>Start Date</div>
                  <div>Start Price</div>
                  <div>End Date</div>
                  <div>End Price</div>
                </div>
                {deletedChanges.map((change) => (
                  <div key={change.id} className="grid grid-cols-5 gap-4 p-4 border-b last:border-b-0 items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium text-gray-700">{change.productName}</div>
                        <div className="text-sm text-gray-500">{change.category}</div>
                        {!change.active && (
                          <div className="text-xs text-red-500 mt-1">Expired</div>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-600">{formatDisplayDate(change.startDate)}</div>
                    <div className="text-gray-600">£{change.startPrice.toFixed(2)}</div>
                    <div className="text-gray-600">{formatDisplayDate(change.endDate)}</div>
                    <div className="text-gray-600">£{change.endPrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-800 mb-2">⚠️ Connection Error</h3>
              <p className="text-sm text-red-700">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadTemporaryPriceChanges}
                className="mt-3 text-red-600 border-red-300 hover:bg-red-50"
              >
                Retry Connection
              </Button>
            </div>
          )}
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