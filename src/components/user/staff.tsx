"use client"

import React, { useState } from 'react'
import { Search, UserCog, Eye, MessageCircle } from 'lucide-react'

interface Staff {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
}

export default function StaffAdminUsers() {
  const [staff, setStaff] = useState<Staff[]>([
    { id: 103, firstName: 'Owner', lastName: 'Githubit', email: 'owner@githubit.com', role: 'Admin' },
    { id: 101, firstName: 'Admin', lastName: 'Admin', email: 'admin@githubit.com', role: 'Admin' }
  ])
  const [selectedStaff, setSelectedStaff] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('Admin')
  
  const handleSelectAll = () => {
    if (selectedStaff.length === staff.length) {
      setSelectedStaff([])
    } else {
      setSelectedStaff(staff.map(user => user.id))
    }
  }
  
  const handleSelectStaff = (id: number) => {
    if (selectedStaff.includes(id)) {
      setSelectedStaff(selectedStaff.filter(staffId => staffId !== id))
    } else {
      setSelectedStaff([...selectedStaff, id])
    }
  }

  return (
    <div className="w-full px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Staff & admin users</h1>
      </div>
      
      {/* Search */}
      <div className="flex justify-end mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by id, name"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="ml-2 p-2 border border-gray-300 rounded-md text-gray-600">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9H21M9 21V9M15 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap">
          <button
            className={`px-4 py-2 ${activeTab === 'Admin' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveTab('Admin')}
          >
            Admin
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'Seller' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveTab('Seller')}
          >
            Seller
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'Moderator' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveTab('Moderator')}
          >
            Moderator
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'Manager' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveTab('Manager')}
          >
            Manager
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'Cook' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveTab('Cook')}
          >
            Cook
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'Deliveryman' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveTab('Deliveryman')}
          >
            Deliveryman
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'Waiter' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveTab('Waiter')}
          >
            Waiter
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'Deleted at' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveTab('Deleted at')}
          >
            Deleted at
          </button>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      checked={selectedStaff.length === staff.length && staff.length > 0}
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      checked={selectedStaff.includes(user.id)}
                      onChange={() => handleSelectStaff(user.id)}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.firstName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.lastName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 bg-blue-100 rounded-full hover:bg-blue-200">
                        <Eye size={16} className="text-blue-600" />
                      </button>
                      <button className="p-1.5 bg-blue-100 rounded-full hover:bg-blue-200">
                        <MessageCircle size={16} className="text-blue-600" />
                      </button>
                      <button className="p-1.5 bg-blue-100 rounded-full hover:bg-blue-200">
                        <UserCog size={16} className="text-blue-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
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
        </div>
      </div>

      <div className="text-sm text-gray-500 flex items-center gap-2">
        <span>Restroman UK support team</span>
        <a href="tel:123456789" className="text-blue-500">123456789</a>
      </div>
    </div>
  )
} 