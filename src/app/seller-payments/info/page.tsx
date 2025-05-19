"use client"

import React, { useState } from 'react'
import PageLayout from '@/components/layout/page-layout'
import { Search, Calendar, ChevronRight } from "lucide-react"

export default function SellerPaymentsInfoPage() {
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: "2025-04-02",
    end: "2025-05-02"
  })
  const [selectedBranch, setSelectedBranch] = useState<string>("All branches")
  const [selectedUser, setSelectedUser] = useState<string>("Select user")
  
  // Mock transaction data
  const transactions = [
    { 
      id: 1196, 
      seller: "Owner Githubit", 
      orderTotal: "$ 17.20", 
      couponPrice: "$ 0.00",
      totalCashback: "$ 0.00",
      deliveryFee: "$ 7.34",
      serviceFee: "$ 0.17",
      sellerFee: "$ 0.00",
      paymentType: "Cash",
      paymentStatus: "Paid"
    },
    { 
      id: 1192, 
      seller: "Branch1 Githubit", 
      orderTotal: "$ 16.36", 
      couponPrice: "$ 0.00",
      totalCashback: "$ 0.00",
      deliveryFee: "$ 0.00",
      serviceFee: "$ 0.16",
      sellerFee: "$ 0.00",
      paymentType: "N/A",
      paymentStatus: "N/A"
    }
  ]

  // Stats data from the screenshot
  const statsCards = [
    { value: "$ 0.34", label: "Commission fee", className: "bg-white" },
    { value: "$ 0.00", label: "Coupon", className: "bg-white" },
    { value: "$ 7.34", label: "Delivery fee", className: "bg-white" },
    { value: "$ 0.00", label: "Point history", className: "bg-white" },
    { value: "$ 33.56", label: "Price", className: "bg-white" },
    { value: "$ 25.89", label: "Seller fee", className: "bg-white" },
    { value: "$ 0.00", label: "Service fee", className: "bg-white" },
    { value: "$ 0.26", label: "Tax", className: "bg-white" }
  ]

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
        
        {/* Transactions table */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-10 px-6 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order total price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total cashback</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.seller}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.orderTotal}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.couponPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.totalCashback}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.deliveryFee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.serviceFee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.sellerFee}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.paymentType === "Cash" ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                          {transaction.paymentType}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-700">{transaction.paymentType}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.paymentStatus === "Paid" ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-white bg-green-500 rounded-full">
                          {transaction.paymentStatus}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-700">{transaction.paymentStatus}</span>
                      )}
                    </td>
                  </tr>
                ))}
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