import React from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react"

export default function CurrenciesContent() {
  // Sample data for currencies table
  const currenciesData = [
    { 
      id: 1,
      title: "USD",
      symbol: "$",
      rate: 1
    },
    { 
      id: 2,
      title: "UZS",
      symbol: "UZS",
      rate: 4
    },
    { 
      id: 3,
      title: "INR",
      symbol: "₹",
      rate: 1
    },
    { 
      id: 4,
      title: "AED",
      symbol: "د.إ",
      rate: 1
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Add Currency Button */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Currency list</h1>
        
        <button className="flex items-center space-x-2 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">
          <PlusIcon className="h-5 w-5" />
          <span>Add currency</span>
        </button>
      </div>
      
      {/* Table Actions */}
      <div className="mb-4 flex justify-end">
        <div className="flex space-x-2">
          <button className="px-4 py-2 border rounded-md text-red-500 hover:bg-red-50">
            Delete selection
          </button>
          <button className="p-2 border rounded-md hover:bg-gray-50">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 21V14H11V21H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 21V10H20V21H13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12V3H11V12H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 8V3H20V8H13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Currencies Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-10 px-4 py-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Title</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Symbol</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Rate</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currenciesData.map((currency) => (
                <tr key={currency.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3 text-sm">{currency.title}</td>
                  <td className="px-4 py-3 text-sm">{currency.symbol}</td>
                  <td className="px-4 py-3 text-sm">{currency.rate}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-sm text-center text-gray-500 mb-6">
        <span>Restroman UK support team </span>
        <a href="#" className="text-blue-500">123456789</a>
      </div>
    </div>
  )
} 