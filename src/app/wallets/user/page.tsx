"use client"

import React, { useState } from 'react'
import PageLayout from '@/components/layout/page-layout'
import { Search, ChevronRight } from "lucide-react"

export default function UserWalletsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  
  // Mock data for wallet users to match the screenshot
  const walletUsers = [
    { id: 189, firstName: "darwish", lastName: "mahmoud", wallet: "$0.00", phone: "", role: "User" },
    { id: 188, firstName: "Janarthanan", lastName: "M", wallet: "$0.00", phone: "", role: "User" },
    { id: 187, firstName: "x3", lastName: "N", wallet: "$0.00", phone: "", role: "User" },
    { id: 186, firstName: "nishant", lastName: "kansagra", wallet: "$0.00", phone: "", role: "User" },
    { id: 185, firstName: "Malik", lastName: "Hakim", wallet: "$0.00", phone: "", role: "User" },
    { id: 184, firstName: "aman", lastName: "webkorps", wallet: "$0.00", phone: "", role: "User" },
    { id: 183, firstName: "Moataz", lastName: "", wallet: "$0.00", phone: "", role: "User" },
    { id: 182, firstName: "Jonathan", lastName: "", wallet: "$0.00", phone: "", role: "User" },
    { id: 181, firstName: "Oguz", lastName: "Yildiz", wallet: "$0.00", phone: "", role: "User" },
    { id: 180, firstName: "test", lastName: "test", wallet: "$0.00", phone: "1313131", role: "Cook" },
  ]

  const totalPages = 9
  const renderPageNumbers = () => {
    const pageNumbers = []
    
    // Always show the first page
    pageNumbers.push(
      <button
        key={1}
        className={`relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 ${
          currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
        } text-sm font-medium`}
        onClick={() => setCurrentPage(1)}
      >
        1
      </button>
    )

    // Add other visible page numbers
    for (let i = 2; i <= 5; i++) {
      if (i <= totalPages) {
        pageNumbers.push(
          <button
            key={i}
            className={`relative inline-flex items-center px-3 py-2 border border-gray-300 ${
              currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            } text-sm font-medium`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        )
      }
    }

    // Add the last page if there are many pages
    if (totalPages > 5) {
      // Add ellipsis if needed
      if (totalPages > 6) {
        pageNumbers.push(
          <span key="ellipsis" className="px-3 py-2 text-gray-700">
            ...
          </span>
        )
      }
      pageNumbers.push(
        <button
          key={9}
          className={`relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 ${
            currentPage === 9 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
          } text-sm font-medium`}
          onClick={() => setCurrentPage(9)}
        >
          9
        </button>
      )
    }

    return pageNumbers
  }

  return (
    <PageLayout>
      <div className="w-full p-6">
        <h1 className="text-2xl font-medium mb-4">User wallet history</h1>

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by id, name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 bg-white border border-gray-300 rounded-md text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {walletUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.firstName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.wallet}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
            <div className="text-sm text-gray-700">
              10 / page
            </div>
            <div className="flex justify-between gap-1 items-center">
              <div className="flex gap-1">
                {renderPageNumbers()}
              </div>
              <button
                type="button"
                className="p-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Restroman UK support team <a href="tel:123456789" className="text-blue-500">123456789</a>
        </div>
      </div>
    </PageLayout>
  )
} 