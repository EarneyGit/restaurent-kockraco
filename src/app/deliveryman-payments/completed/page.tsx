"use client"

import React, { useState } from 'react'
import { Search, Calendar, ChevronRight } from "lucide-react"

export default function DeliverymanCompletedPaymentsPage() {
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: "",
    end: ""
  })
  const [selectedBranch, setSelectedBranch] = useState<string>("Select branch")
  const [selectedUser, setSelectedUser] = useState<string>("Select user")
  const [searchTerm, setSearchTerm] = useState<string>("")
  
  // Mock data for deliveryman completed payments
  const payments = [
    {
      orderId: 1090,
      deliveryman: "Delivery Delivery",
      orderTotalPrice: "$ 3,323.99",
      deliveryFee: "$ 3,298.74",
      paymentType: "-"
    }
  ]

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-medium mb-6">Deliveryman completed payments</h1>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by order id, customer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="relative">
          <select 
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Select branch">Select branch</option>
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
              placeholder="From date"
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
              placeholder="To date"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <Calendar size={16} className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Payments table */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveryman</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order total price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment type</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.orderId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{payment.deliveryman}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{payment.orderTotalPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{payment.deliveryFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{payment.paymentType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center">
        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
          1
        </div>
      </div>

      <div className="text-sm text-gray-600 mt-4">
        Restroman UK support team <a href="tel:123456789" className="text-blue-500">123456789</a>
      </div>
    </div>
  )
} 