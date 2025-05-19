"use client"

import React, { useState } from 'react'
import PageLayout from '@/components/layout/page-layout'
import { Calendar, ChevronRight, Folder } from "lucide-react"

export default function DeliverymanPaymentsInfoPage() {
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: "2025-04-02",
    end: "2025-05-02"
  })
  const [selectedBranch, setSelectedBranch] = useState<string>("All branches")
  const [selectedUser, setSelectedUser] = useState<string>("Select user")
  
  // Stats data from the screenshot - all zeros
  const statsCards = [
    { value: "$ 0.00", label: "Commission fee", className: "bg-white" },
    { value: "$ 0.00", label: "Coupon", className: "bg-white" },
    { value: "$ 0.00", label: "Delivery fee", className: "bg-white" },
    { value: "$ 0.00", label: "Point history", className: "bg-white" },
    { value: "$ 0.00", label: "Price", className: "bg-white" },
    { value: "$ 0.00", label: "Seller fee", className: "bg-white" },
    { value: "$ 0.00", label: "Service fee", className: "bg-white" },
    { value: "$ 0.00", label: "Tax", className: "bg-white" }
  ]

  // Empty transactions data
  const transactions = []

  return (
    <PageLayout>
      <div className="w-full p-6">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative">
            <select 
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All branches">All branches</option>
              <option value="Branch 1">Branch 1</option>
              <option value="Branch 2">Branch 2</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronRight size={16} className="transform rotate-90 text-gray-500" />
            </div>
          </div>
          
          <div className="relative">
            <select 
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Select user">Select user</option>
              <option value="User 1">User 1</option>
              <option value="User 2">User 2</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronRight size={16} className="transform rotate-90 text-gray-500" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Calendar size={16} className="text-gray-500" />
              </div>
            </div>
            
            <span className="text-gray-500">→</span>
            
            <div className="relative">
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Calendar size={16} className="text-gray-500" />
              </div>
            </div>
          </div>
          
          <button className="px-6 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">
            Pay
          </button>
        </div>
        
        {/* Stats cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-semibold mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Transactions table with empty state */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-10 px-6 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveryman</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order total price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {/* Transaction row data would go here */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 p-3 rounded-full mb-3">
                          <Folder className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">No Data</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Restroman UK support team <a href="tel:123456789" className="text-blue-500">123456789</a>
        </div>
      </div>
    </PageLayout>
  )
} 