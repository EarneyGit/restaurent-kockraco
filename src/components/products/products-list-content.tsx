"use client"

import React, { useState } from "react"
import { Search, Eye, Trash, Pencil, Plus } from "lucide-react"

export default function ProductsListContent() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // Mock data for products
  const products = [
    { 
      id: 570, 
      image: "/images/matcha-latte.jpg", 
      title: "Matcha Latte", 
      translations: ["EN", "TR"],
      branch: "Main branch",
      category: "Drinks",
      active: true,
      status: "Pending"
    },
    { 
      id: 568, 
      image: "/images/cake-test.jpg", 
      title: "test", 
      translations: ["EN"],
      branch: "Main branch",
      category: "Cake",
      active: true,
      status: "Pending"
    },
    { 
      id: 560, 
      image: "/images/chili-dog.jpg", 
      title: "Chili Cheese Hot Dog", 
      translations: ["EN"],
      branch: "Central Branch",
      category: "Fast Foods",
      active: true,
      status: "Published"
    },
    { 
      id: 559, 
      image: "/images/pizza-cal.jpg", 
      title: "California-style Pizza", 
      translations: ["EN"],
      branch: "Central Branch",
      category: "Pizza",
      active: true,
      status: "Published"
    },
    { 
      id: 558, 
      image: "/images/french-dip.jpg", 
      title: "French Dip Sandwich", 
      translations: ["EN"],
      branch: "Central Branch",
      category: "Fast Foods",
      active: true,
      status: "Published"
    },
    { 
      id: 557, 
      image: "/images/chili-dog-2.jpg", 
      title: "Chili Cheese Hot Dog", 
      translations: ["EN"],
      branch: "Main branch",
      category: "Fast Foods",
      active: true,
      status: "Published"
    },
    { 
      id: 556, 
      image: "/images/pizza-cal-2.jpg", 
      title: "California-style Pizza", 
      translations: ["EN"],
      branch: "Main branch",
      category: "Pizza",
      active: true,
      status: "Published"
    },
    { 
      id: 555, 
      image: "/images/cobb-salad.jpg", 
      title: "Cobb Salad", 
      translations: ["EN"],
      branch: "Main branch",
      category: "Salads",
      active: true,
      status: "Published"
    },
    { 
      id: 554, 
      image: "/images/california-roll.jpg", 
      title: "California Roll", 
      translations: ["EN"],
      branch: "Main branch",
      category: "Hot dishes",
      active: true,
      status: "Published"
    },
    { 
      id: 553, 
      image: "/images/french-dip-2.jpg", 
      title: "French Dip Sandwich", 
      translations: ["EN"],
      branch: "Main branch",
      category: "Fast Foods",
      active: true,
      status: "Published"
    }
  ]

  const tabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "published", label: "Published" },
    { id: "unpublished", label: "Unpublished" },
    { id: "deleted", label: "Deleted at" }
  ]

  const toggleProductSelection = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(product => product.id))
    }
  }

  const filteredProducts = selectedTab === "all" 
    ? products 
    : products.filter(product => product.status.toLowerCase() === selectedTab)

  return (
    <div className="w-full px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Products</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">
          <Plus size={18} />
          Add product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by id, title"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Select branch</option>
                <option>Main branch</option>
                <option>Central Branch</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                </svg>
              </div>
            </div>

            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Select category</option>
                <option>Drinks</option>
                <option>Cake</option>
                <option>Fast Foods</option>
                <option>Pizza</option>
                <option>Salads</option>
                <option>Hot dishes</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                </svg>
              </div>
            </div>

            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Select brand</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                </svg>
              </div>
            </div>

            <button className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              Clear
            </button>
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
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex border-b overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${selectedTab === tab.id ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-900'}`}
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
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Languages</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                      <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                        {product.id % 2 === 0 ? (
                          <span>🍔</span>
                        ) : (
                          <span>🍕</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{product.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {product.translations.map((lang, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.branch}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <Eye size={18} className="text-blue-500" />
                      </button>
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <Pencil size={18} className="text-amber-500" />
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProducts.length}</span> of <span className="font-medium">{filteredProducts.length}</span> results
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
        <span>Restroman Single support team</span>
        <a href="tel:123456789" className="text-blue-500">123456789</a>
      </div>
    </div>
  )
} 