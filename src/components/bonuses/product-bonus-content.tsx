"use client"

import React, { useState } from "react"
import { Search, Pencil, Trash, Plus, List } from "lucide-react"

// Define the bonus type
interface Bonus {
  id: number
  orderAmount: string
  bonusProduct: string
  active: boolean
  expiredAt: string
}

export default function ProductBonusContent() {
  const [selectedBonuses, setSelectedBonuses] = useState<number[]>([])
  const [noData, setNoData] = useState(true)

  // Mock data for product bonuses
  const bonuses: Bonus[] = []

  const toggleBonusSelection = (id: number) => {
    if (selectedBonuses.includes(id)) {
      setSelectedBonuses(selectedBonuses.filter(bonusId => bonusId !== id))
    } else {
      setSelectedBonuses([...selectedBonuses, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedBonuses.length === bonuses.length) {
      setSelectedBonuses([])
    } else {
      setSelectedBonuses(bonuses.map(bonus => bonus.id))
    }
  }

  return (
    <div className="w-full px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Product bonus</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">
          <Plus size={18} />
          Add product bonus
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b">
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-red-600 hover:bg-gray-50">
              Delete selection
            </button>
            <button className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      checked={selectedBonuses.length === bonuses.length && bonuses.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expired at</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bonuses.map(bonus => (
                <tr key={bonus.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      checked={selectedBonuses.includes(bonus.id)}
                      onChange={() => toggleBonusSelection(bonus.id)}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{bonus.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{bonus.orderAmount}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{bonus.bonusProduct}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        value="" 
                        className="sr-only peer" 
                        checked={bonus.active}
                        readOnly
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{bonus.expiredAt}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 bg-blue-100 rounded-full hover:bg-blue-200">
                        <Pencil size={16} className="text-blue-600" />
                      </button>
                      <button className="p-1.5 bg-red-100 rounded-full hover:bg-red-200">
                        <Trash size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {noData && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-gray-300">
                <path d="M40 70C56.5685 70 70 56.5685 70 40C70 23.4315 56.5685 10 40 10C23.4315 10 10 23.4315 10 40C10 56.5685 23.4315 70 40 70Z" stroke="currentColor" strokeWidth="2" />
                <circle cx="32" cy="36" r="4" fill="currentColor" />
                <circle cx="48" cy="36" r="4" fill="currentColor" />
                <path d="M32 50C32 50 35 46 40 46C45 46 48 50 48 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">No results found</p>
            <p className="text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}

        <div className="flex items-center justify-end px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex justify-between gap-2">
            {!noData && (
              <>
                <button className="relative inline-flex items-center px-2 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="inline-flex -space-x-px">
                  <button className="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-500 text-sm font-medium text-white focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    1
                  </button>
                </span>
                <button className="relative inline-flex items-center px-2 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 flex items-center gap-2">
        <span>Restroman UK support team</span>
        <a href="tel:123456789" className="text-blue-500">123456789</a>
      </div>
    </div>
  )
} 