"use client"

import { useState } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

interface ClosedDate {
  date: string
  type: 'single' | 'range'
  endDate?: string
}

export default function ClosedDatesPage() {
  const [closedDates, setClosedDates] = useState<ClosedDate[]>([])
  const [singleDate, setSingleDate] = useState("")
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  })

  const handleAddSingleDate = () => {
    if (!singleDate) return
    setClosedDates(prev => [...prev, { date: singleDate, type: 'single' }])
    setSingleDate("")
  }

  const handleAddDateRange = () => {
    if (!dateRange.start || !dateRange.end) return
    setClosedDates(prev => [...prev, {
      date: dateRange.start,
      endDate: dateRange.end,
      type: 'range'
    }])
    setDateRange({ start: "", end: "" })
  }

  const handleDelete = (index: number) => {
    setClosedDates(prev => prev.filter((_, i) => i !== index))
  }

  const handleDeleteAll = () => {
    setClosedDates([])
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
                  {closedDates.map((date, index) => (
                    <div key={index} className="px-4 py-3 flex justify-between items-center">
                      <span>
                        {date.type === 'single' 
                          ? format(new Date(date.date), 'dd/MM/yyyy')
                          : `${format(new Date(date.date), 'dd/MM/yyyy')} - ${format(new Date(date.endDate!), 'dd/MM/yyyy')}`
                        }
                      </span>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleDeleteAll}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    Delete All
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
                />
              </div>
              <Button
                onClick={handleAddSingleDate}
                className="w-full border border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                variant="outline"
              >
                Add Outlet Closed Date
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
                  />
                </div>
              </div>
              <Button
                onClick={handleAddDateRange}
                className="w-full border border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                variant="outline"
              >
                Add Outlet Closed Range
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 