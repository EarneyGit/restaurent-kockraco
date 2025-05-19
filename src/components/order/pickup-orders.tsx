"use client"

import React, { useState } from "react"
import { Search, Plus, Filter, Check, MoreHorizontal, Eye, MapPin, Printer, Download, Trash, FileDown } from "lucide-react"
import Link from "next/link"

// Board view component for Kanban-style order management
function BoardView({ orders, getStatusBadge, getStatusColor }) {
  // Group orders by status
  const groupedOrders = orders.reduce((acc, order) => {
    const status = order.orderStatus.toLowerCase();
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(order);
    return acc;
  }, {});

  // Define status columns to display
  const statusColumns = [
    { id: 'new', label: 'New', count: groupedOrders['new']?.length || 0 },
    { id: 'accepted', label: 'Accepted', count: groupedOrders['accepted']?.length || 0 },
    { id: 'cooking', label: 'Cooking', count: groupedOrders['cooking']?.length || 0 },
    { id: 'ready', label: 'Ready', count: groupedOrders['ready']?.length || 0 },
    { id: 'canceled', label: 'Canceled', count: groupedOrders['canceled']?.length || 0 },
  ];

  // Function to get column background color based on status
  const getColumnColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-50';
      case 'accepted': return 'bg-green-50';
      case 'cooking': return 'bg-amber-50';
      case 'ready': return 'bg-purple-50';
      case 'canceled': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="overflow-x-auto pb-6">
      <div className="flex space-x-4 min-w-fit">
        {statusColumns.map((column) => (
          <div 
            key={column.id} 
            className={`w-80 flex-shrink-0 rounded-lg ${getColumnColor(column.id)} overflow-hidden flex flex-col`}
          >
            <div className="p-3 border-b font-medium flex items-center justify-between">
              <div className="flex items-center">
                <span>{column.label}</span>
                <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs text-gray-600">
                  {column.count}
                </span>
              </div>
              <button className="p-1 rounded hover:bg-white/50">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <div className="p-2 overflow-y-auto flex-1 max-h-[calc(100vh-240px)]">
              {groupedOrders[column.id]?.map((order) => (
                <div key={order.id} className="bg-white p-3 rounded-lg mb-2 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">#{order.id}</span>
                    <div>{getStatusBadge(order.orderStatus)}</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <div className="flex justify-between">
                      <span>Customer:</span>
                      <span className="font-medium">{order.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Branch:</span>
                      <span>{order.branch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pickup:</span>
                      <span>{order.deliveryDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-medium">{order.totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment:</span>
                      <span className={getStatusColor(order.paymentStatus)}>{order.paymentStatus}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end space-x-1">
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <Eye size={16} className="text-blue-500" />
                    </button>
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <Printer size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PickupOrders() {
  const [viewMode, setViewMode] = useState<"list" | "board">("list")
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // Mock data for orders - filtered for Pickup orders only
  const orders = [
    { 
      id: 1202, 
      deliveryDate: "22-04-2025 22:47", 
      customer: "Branch1 Githubit", 
      branch: "Central Branch", 
      orderType: "Pickup", 
      orderStatus: "New", 
      products: 2, 
      totalPrice: "$ 13.68", 
      paymentType: "N/A", 
      paymentStatus: "N/A" 
    },
    { 
      id: 1201, 
      deliveryDate: "22-04-2025 22:46", 
      customer: "Branch1 Githubit", 
      branch: "Central Branch", 
      orderType: "Pickup", 
      orderStatus: "New", 
      products: 4, 
      totalPrice: "$ 31.98", 
      paymentType: "N/A", 
      paymentStatus: "N/A" 
    },
    { 
      id: 1200, 
      deliveryDate: "21-04-2025 19:20", 
      customer: "Sochima Ugwu", 
      branch: "Main branch", 
      orderType: "Pickup", 
      orderStatus: "New", 
      products: 3, 
      totalPrice: "$ 25.17", 
      paymentType: "Cash", 
      paymentStatus: "Progress" 
    }
  ]

  const tabs = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "accepted", label: "Accepted" },
    { id: "cooking", label: "Cooking" },
    { id: "ready", label: "Ready" },
    { id: "canceled", label: "Canceled" }
  ]

  const toggleOrderSelection = (id: number) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(orderId => orderId !== id))
    } else {
      setSelectedOrders([...selectedOrders, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map(order => order.id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'text-blue-500'
      case 'accepted':
        return 'text-green-500'
      case 'canceled':
        return 'text-red-500'
      case 'progress':
        return 'text-amber-500'
      case 'paid':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusBadge = (status: string) => {
    let bgColor = 'bg-gray-100'
    let textColor = 'text-gray-700'

    switch (status.toLowerCase()) {
      case 'canceled':
        bgColor = 'bg-red-100'
        textColor = 'text-red-700'
        break
      case 'accepted':
        bgColor = 'bg-green-100'
        textColor = 'text-green-700'
        break
      case 'new':
        bgColor = 'bg-blue-100'
        textColor = 'text-blue-700'
        break
      default:
        break
    }

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${bgColor} ${textColor}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="w-full px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Pickup Orders</h1>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md overflow-hidden">
            <button 
              className={`px-4 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
            <button 
              className={`px-4 py-2 text-sm ${viewMode === 'board' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setViewMode('board')}
            >
              Board
            </button>
          </div>
          <button className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md text-sm">
            <Plus size={16} />
            Create order
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 flex flex-wrap gap-3 border-b">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by order id, customer"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="relative min-w-[200px]">
            <select className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>All branches</option>
              <option>Main branch</option>
              <option>Central Branch</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative min-w-[200px]">
            <select className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Select customer</option>
              <option>Branch1 Githubit</option>
              <option>Sochima Ugwu</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-[350px]">
            <div className="flex-1">
              <input
                type="date"
                placeholder="From date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <span className="text-gray-500">→</span>
            <div className="flex-1">
              <input
                type="date"
                placeholder="To date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            Clear
          </button>

          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1">
            <FileDown size={16} />
            Export
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
          <button className="px-3 py-3 text-gray-400 ml-auto">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          {viewMode === 'list' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        checked={selectedOrders.length === orders.length}
                        onChange={toggleSelectAll}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.deliveryDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.branch}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.products}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.totalPrice}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.paymentType}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={getStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <Eye size={18} className="text-blue-500" />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <Printer size={18} className="text-gray-500" />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <Download size={18} className="text-gray-500" />
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
          ) : (
            <BoardView orders={orders} getStatusBadge={getStatusBadge} getStatusColor={getStatusColor} />
          )}
        </div>

        {viewMode === 'list' && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{orders.length}</span> of <span className="font-medium">{orders.length}</span> results
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
        )}
      </div>
    </div>
  )
} 