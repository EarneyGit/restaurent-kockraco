"use client"

import { useState, useEffect } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { orderingTimesService, type ClosedDate } from "@/services/ordering-times.service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function ClosedDatesPage() {
  const [closedDates, setClosedDates] = useState<ClosedDate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [singleDate, setSingleDate] = useState("")
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  })

  // Load closed dates on component mount
  useEffect(() => {
    loadClosedDates()
  }, [])

  const loadClosedDates = async () => {
    try {
      setLoading(true)
      const response = await orderingTimesService.getClosedDates()
      setClosedDates(response.data)
    } catch (error) {
      console.error('Error loading closed dates:', error)
      toast.error('Failed to load closed dates')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSingleDate = async () => {
    if (!singleDate) {
      toast.error('Please select a date')
      return
    }

    try {
      setSaving(true)
      const newClosedDate: Omit<ClosedDate, '_id'> = {
        date: singleDate,
        type: 'single',
        reason: 'Closed'
      }

      await orderingTimesService.addClosedDate(newClosedDate)
      toast.success('Closed date added successfully')
      setSingleDate("")
      
      // Reload the closed dates to get the updated list
      await loadClosedDates()
    } catch (error) {
      console.error('Error adding closed date:', error)
      toast.error('Failed to add closed date')
    } finally {
      setSaving(false)
    }
  }

  const handleAddDateRange = async () => {
    if (!dateRange.start || !dateRange.end) {
      toast.error('Please select both start and end dates')
      return
    }

    if (new Date(dateRange.start) > new Date(dateRange.end)) {
      toast.error('Start date must be before end date')
      return
    }

    try {
      setSaving(true)
      const newClosedDate: Omit<ClosedDate, '_id'> = {
        date: dateRange.start,
        endDate: dateRange.end,
        type: 'range',
        reason: 'Closed'
      }

      await orderingTimesService.addClosedDate(newClosedDate)
      toast.success('Closed date range added successfully')
      setDateRange({ start: "", end: "" })
      
      // Reload the closed dates to get the updated list
      await loadClosedDates()
    } catch (error) {
      console.error('Error adding closed date range:', error)
      toast.error('Failed to add closed date range')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (closedDate: ClosedDate) => {
    if (!closedDate._id) {
      toast.error('Cannot delete: Invalid closed date ID')
      return
    }

    try {
      setSaving(true)
      await orderingTimesService.removeClosedDate(closedDate._id)
      toast.success('Closed date deleted successfully')
      
      // Reload the closed dates to get the updated list
      await loadClosedDates()
    } catch (error) {
      console.error('Error deleting closed date:', error)
      toast.error('Failed to delete closed date')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAll = async () => {
    if (closedDates.length === 0) {
      toast.error('No closed dates to delete')
      return
    }

    if (!confirm('Are you sure you want to delete all closed dates? This action cannot be undone.')) {
      return
    }

    try {
      setSaving(true)
      await orderingTimesService.removeAllClosedDates()
      toast.success('All closed dates deleted successfully')
      setClosedDates([])
    } catch (error) {
      console.error('Error deleting all closed dates:', error)
      toast.error('Failed to delete all closed dates')
    } finally {
      setSaving(false)
    }
  }

  const formatClosedDate = (closedDate: ClosedDate): string => {
    try {
      if (closedDate.type === 'single') {
        return format(new Date(closedDate.date), 'dd/MM/yyyy')
      } else {
        const startDate = format(new Date(closedDate.date), 'dd/MM/yyyy')
        const endDate = closedDate.endDate ? format(new Date(closedDate.endDate), 'dd/MM/yyyy') : ''
        return `${startDate} - ${endDate}`
      }
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          Loading closed dates...
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-medium mb-4">Closed Dates</h1>
          
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <p className="text-gray-600 mb-2">
              These are the dates that this restaurant is closed.
            </p>
            <p className="text-gray-600 mb-4">
              Ideal for setting advanced notice of one-off holidays, Christmas, etc.
            </p>
          </div>

          {/* Future Closed Dates Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-lg font-medium mb-4">Future Closed Dates</h2>
            
            {closedDates.length === 0 ? (
              <p className="text-gray-500">None</p>
            ) : (
              <div className="space-y-4">
                <div className="border rounded-lg divide-y">
                  <div className="px-4 py-3 bg-gray-50 text-sm font-medium">
                    Outlet Closed
                  </div>
                  {closedDates.map((closedDate) => (
                    <div key={closedDate._id} className="px-4 py-3 flex justify-between items-center">
                      <div>
                        <span className="font-medium">{formatClosedDate(closedDate)}</span>
                        {closedDate.reason && (
                          <span className="text-gray-500 ml-2">({closedDate.reason})</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(closedDate)}
                        disabled={saving}
                        className="text-red-500 hover:text-red-600 text-sm disabled:opacity-50"
                      >
                        {saving ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleDeleteAll}
                    disabled={saving}
                    className="text-red-500 hover:text-red-600 text-sm disabled:opacity-50"
                  >
                    {saving ? 'Deleting...' : 'Delete All'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add Single Date Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-lg font-medium mb-4">Add a Single Closed Date</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Closed
                </label>
                <Input
                  type="date"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                />
              </div>
              <Button
                onClick={handleAddSingleDate}
                disabled={saving || !singleDate}
                className="w-full border border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                variant="outline"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  'Add Outlet Closed Date'
                )}
              </Button>
            </div>
          </div>

          {/* Add Date Range Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">Add a Closed Date Range</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Date Closed
                  </label>
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Date Closed
                  </label>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    min={dateRange.start || new Date().toISOString().split('T')[0]} // Prevent selecting dates before start date
                  />
                </div>
              </div>
              <Button
                onClick={handleAddDateRange}
                disabled={saving || !dateRange.start || !dateRange.end}
                className="w-full border border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                variant="outline"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  'Add Outlet Closed Range'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 