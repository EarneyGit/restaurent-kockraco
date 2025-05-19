"use client"

import React, { useState } from "react"
import { Search, Eye, Trash, Pencil, Plus } from "lucide-react"

export default function RecipeCategoriesContent() {
  const [selectedTab, setSelectedTab] = useState("published")
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  // Mock data for recipe categories
  const categories = [
    { 
      id: 53, 
      image: "/images/matcha-latte.jpg", 
      title: "Matcha Latte", 
      translations: ["EN", "TR"],
      active: true
    },
    { 
      id: 51, 
      image: "/images/dessert.jpg", 
      title: "Dessert", 
      translations: ["EN"],
      active: false
    }
  ]

  const tabs = [
    { id: "published", label: "Published" },
    { id: "deleted", label: "Deleted at" }
  ]

  const toggleCategorySelection = (id: number) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(categoryId => categoryId !== id))
    } else {
      setSelectedCategories([...selectedCategories, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([])
    } else {
      setSelectedCategories(categories.map(category => category.id))
    }
  }

  return (
    <div className="w-full px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Recipe categories</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">
          <Plus size={18} />
          Add category
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
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export
              </div>
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Import
              </div>
            </button>
            <button className="p-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
          </div>
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
                      checked={selectedCategories.length === categories.length && categories.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Translations</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map(category => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => toggleCategorySelection(category.id)}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{category.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.title} 
                        className="h-10 w-10 rounded-md object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='%23D1D5DB'/%3E%3Ctext x='50%25' y='50%25' font-size='12' text-anchor='middle' dy='.3em' fill='%236B7280'%3E40×40%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        40×40
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{category.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      {category.translations.map((lang, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <label className="inline-flex items-center">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={category.active}
                        onChange={() => {}}
                      />
                      <div className={`relative inline-block w-10 h-5 rounded-full transition-colors ease-in-out duration-200 ${category.active ? 'bg-blue-500' : 'bg-gray-200'}`}>
                        <span className={`inline-block w-4 h-4 transform transition ease-in-out duration-200 rounded-full bg-white shadow-md ${category.active ? 'translate-x-5' : 'translate-x-1'}`}></span>
                      </div>
                    </label>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <Eye size={18} className="text-blue-500" />
                      </button>
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <Pencil size={18} className="text-gray-500" />
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
      </div>

      <div className="text-sm text-gray-500 flex items-center gap-2">
        <span>Restroman UK support team</span>
        <a href="tel:123456789" className="text-blue-500">123456789</a>
      </div>
    </div>
  )
} 