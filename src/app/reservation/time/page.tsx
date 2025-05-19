"use client"

import React, { useState } from "react"
import { Search, Pencil, Trash, Plus } from "lucide-react"
import PageLayout from "@/components/layout/page-layout"

export default function ReservationTimePage() {
  const [selectedTimes, setSelectedTimes] = useState<number[]>([])

  // Mock data for reservation times
  const times = [
    { id: 3, branch: "N/A", createdAt: "06-03-2025 18:32" },
    { id: 2, branch: "Main branch", createdAt: "04-05-2023 12:01" },
    { id: 1, branch: "Central Branch", createdAt: "01-05-2023 16:22" }
  ]

  const toggleTimeSelection = (id: number) => {
    if (selectedTimes.includes(id)) {
      setSelectedTimes(selectedTimes.filter(timeId => timeId !== id))
    } else {
      setSelectedTimes([...selectedTimes, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedTimes.length === times.length) {
      setSelectedTimes([])
    } else {
      setSelectedTimes(times.map(time => time.id))
    }
  }

  return (
    <PageLayout>
      <div className="w-full px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Reservation times</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">
            <Plus size={18} />
            Add reservation time
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by branch"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-red-600 hover:bg-gray-50">
                Delete selection
              </button>
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created at
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {times.map((time) => (
                <tr key={time.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {time.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {time.branch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {time.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="p-1.5 bg-blue-100 rounded-full hover:bg-blue-200"
                        aria-label="Edit"
                      >
                        <Pencil size={16} className="text-blue-600" />
                      </button>
                      <button 
                        className="p-1.5 bg-red-100 rounded-full hover:bg-red-200"
                        aria-label="Delete"
                      >
                        <Trash size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {times.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No reservation times found</p>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span>Restroman UK support team</span>
          <a href="tel:123456789" className="text-blue-500">123456789</a>
        </div>
      </div>
    </PageLayout>
  )
} 