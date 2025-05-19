"use client"

import React, { useState } from "react"
import { Search, Pencil, Trash, Plus, List } from "lucide-react"
import PageLayout from "@/components/layout/page-layout"

export default function CareerListPage() {
  const [selectedCareers, setSelectedCareers] = useState<number[]>([])

  // Mock data for careers
  const careers = [
    { 
      id: 3, 
      title: "Customer Support Representative", 
      translations: ["EN"],
      category: "Customer Support",
      active: true 
    },
    { 
      id: 2, 
      title: "Delivery Driver", 
      translations: ["EN"],
      category: "Deliveryman",
      active: true 
    },
    { 
      id: 1, 
      title: "Kitchen Staff", 
      translations: ["EN"],
      category: "Kitchen",
      active: true 
    }
  ]

  const toggleCareerSelection = (id: number) => {
    if (selectedCareers.includes(id)) {
      setSelectedCareers(selectedCareers.filter(careerId => careerId !== id))
    } else {
      setSelectedCareers([...selectedCareers, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedCareers.length === careers.length) {
      setSelectedCareers([])
    } else {
      setSelectedCareers(careers.map(career => career.id))
    }
  }

  return (
    <PageLayout>
      <div className="w-full px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Career list</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">
            <Plus size={18} />
            Add Career
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by title"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

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
                        checked={selectedCareers.length === careers.length && careers.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Translations</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {careers.map(career => (
                  <tr key={career.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        checked={selectedCareers.includes(career.id)}
                        onChange={() => toggleCareerSelection(career.id)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{career.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{career.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-1">
                        {career.translations.map((lang, idx) => (
                          <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {career.category}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          value="" 
                          className="sr-only peer" 
                          checked={career.active}
                          readOnly
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button className="p-1.5 bg-blue-100 rounded-full hover:bg-blue-200">
                          <Pencil size={16} className="text-blue-600" />
                        </button>
                        <button className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200">
                          <span className="inline-block w-4 h-4 bg-gray-400 rounded-full"></span>
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

          <div className="flex items-center justify-end px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex justify-between gap-2">
              <div className="relative z-0 inline-flex shadow-sm rounded-md">
                <button className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-blue-500 text-sm font-medium text-white hover:bg-blue-600">
                  1
                </button>
              </div>
              <button
                type="button"
                className="p-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span>Restroman UK support team</span>
          <a href="tel:123456789" className="text-blue-500">123456789</a>
        </div>
      </div>
    </PageLayout>
  )
} 