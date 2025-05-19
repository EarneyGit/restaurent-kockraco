"use client"

import React, { useState } from "react"
import { Search, Eye, Trash, Download, FileDown, Filter } from "lucide-react"

export default function RefundsContent() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedRefunds, setSelectedRefunds] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // Mock data for refunds
  const refunds = [
    { 
      id: 1, 
      orderId: 1134, 
      client: "Dendi 4890", 
      branch: "N/A", 
      orderStatus: "Accepted", 
      createdAt: "06-03-2025 18:45"
    }
  ]

  const tabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "accepted", label: "Accepted" },
    { id: "canceled", label: "Canceled" },
    { id: "deleted", label: "Deleted at" }
  ]

  const toggleRefundSelection = (id: number) => {
    if (selectedRefunds.includes(id)) {
      setSelectedRefunds(selectedRefunds.filter(refundId => refundId !== id))
    } else {
      setSelectedRefunds([...selectedRefunds, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedRefunds.length === refunds.length) {
      setSelectedRefunds([])
    } else {
      setSelectedRefunds(refunds.map(refund => refund.id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'text-green-500'
      case 'canceled':
        return 'text-red-500'
      case 'pending':
        return 'text-amber-500'
      case 'deleted':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="w-full px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Refunds</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 flex flex-wrap gap-3 border-b">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-red-600 hover:bg-gray-50">
            Delete selection
          </button>

          <button className="p-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9.99999H21M9 4.99999V14M4 5.99999H20C20.5523 5.99999 21 5.55228 21 4.99999C21 4.44771 20.5523 3.99999 20 3.99999H4C3.44772 3.99999 3 4.44771 3 4.99999C3 5.55228 3.44772 5.99999 4 5.99999ZM6 9.99999H18V19C18 19.5523 17.5523 20 17 20H7C6.44772 20 6 19.5523 6 19V9.99999Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-6 py-3 text-sm font-medium ${selectedTab === tab.id ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
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
                      checked={selectedRefunds.length === refunds.length && refunds.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created at</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {refunds.map(refund => (
                <tr key={refund.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      checked={selectedRefunds.includes(refund.id)}
                      onChange={() => toggleRefundSelection(refund.id)}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{refund.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{refund.orderId}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{refund.client}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{refund.branch}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={getStatusColor(refund.orderStatus)}>
                      {refund.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{refund.createdAt}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <Eye size={18} className="text-blue-500" />
                      </button>
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <Trash size={18} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{refunds.length}</span> of <span className="font-medium">{refunds.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button className="relative inline-flex items-center rounded-l-md px-2 py-1 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-blue-500 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  1
                </button>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-1 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
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