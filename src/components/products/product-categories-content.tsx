"use client"

import React, { useState } from "react"
import { Search, Eye, Trash, Pencil, Plus } from "lucide-react"

export default function ProductCategoriesContent() {
  const [selectedTab, setSelectedTab] = useState("published")
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // Mock data for categories
  const categories = [
    { 
      id: 21, 
      image: "/images/cake.jpg", 
      title: "Cake", 
      translations: "EN",
      active: true
    },
    { 
      id: 17, 
      image: "/images/pies.jpg", 
      title: "Pies", 
      translations: "EN",
      active: true
    },
    { 
      id: 16, 
      image: "/images/dessert.jpg", 
      title: "Dessert", 
      translations: "EN",
      active: true
    },
    { 
      id: 15, 
      image: "/images/drinks.jpg", 
      title: "Drinks", 
      translations: "EN",
      active: true
    },
    { 
      id: 14, 
      image: "/images/fast-foods.jpg", 
      title: "Fast Foods", 
      translations: "EN",
      active: true
    },
    { 
      id: 11, 
      image: "/images/hot-dishes.jpg", 
      title: "Hot dishes", 
      translations: "EN",
      active: true
    },
    { 
      id: 10, 
      image: "/images/salads.jpg", 
      title: "Salads", 
      translations: "EN",
      active: true
    },
    { 
      id: 9, 
      image: "/images/soups.jpg", 
      title: "Soups", 
      translations: "EN",
      active: true
    },
    { 
      id: 8, 
      image: "/images/pizza.jpg", 
      title: "Pizza", 
      translations: "EN",
      active: true
    },
    { 
      id: 1, 
      image: "", 
      title: "no name", 
      translations: "EL",
      active: true
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
        <h1 className="text-2xl font-medium">Categories</h1>
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"></path>
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category.translations}
                    </span>
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

        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">10</span> results
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
                <button className="relative inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-blue-500 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
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
    </div>
  )
} 