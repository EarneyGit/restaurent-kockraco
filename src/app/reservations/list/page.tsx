"use client"

import React, { useState } from "react"
import { Search, Pencil, Trash, Plus, Eye, Filter } from "lucide-react"
import PageLayout from "@/components/layout/page-layout"

export default function ReservationListPage() {
  const [selectedReservations, setSelectedReservations] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState<string>("All")

  // Mock data for reservations
  const reservations = [
    { id: 56, client: "Doniyor Oripov", dateTime: "25-05-2023 19:10", status: "Accepted", guests: 6 },
    { id: 55, client: "Khasan Asatov", dateTime: "25-05-2023 18:10", status: "Accepted", guests: 30 },
    { id: 47, client: "Doniyor Oripov", dateTime: "23-05-2023 17:10", status: "New", guests: 6 },
    { id: 46, client: "Doniyor Oripov", dateTime: "22-05-2023 20:00", status: "New", guests: 6 },
    { id: 43, client: "Owner Githubit", dateTime: "20-05-2023 22:00", status: "New", guests: 9 },
    { id: 42, client: "Doniyor Oripov", dateTime: "20-05-2023 23:00", status: "Accepted", guests: 9 },
    { id: 39, client: "Waiter Waiter", dateTime: "18-05-2023 21:00", status: "Accepted", guests: 9 },
    { id: 38, client: "", dateTime: "24-05-2023 11:00", status: "New", guests: 0 },
    { id: 37, client: "Branch1 Githubit", dateTime: "17-05-2023 23:30", status: "New", guests: 30 },
    { id: 36, client: "Branch1 Githubit", dateTime: "17-05-2023 22:31", status: "New", guests: 30 }
  ]

  const toggleReservationSelection = (id: number) => {
    if (selectedReservations.includes(id)) {
      setSelectedReservations(selectedReservations.filter(reservationId => reservationId !== id))
    } else {
      setSelectedReservations([...selectedReservations, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedReservations.length === filteredReservations.length) {
      setSelectedReservations([])
    } else {
      setSelectedReservations(filteredReservations.map(reservation => reservation.id))
    }
  }

  // Filter reservations based on active tab
  const filteredReservations = activeTab === "All" 
    ? reservations
    : reservations.filter(reservation => reservation.status === activeTab)

  return (
    <PageLayout>
      <div className="w-full px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Reservation list</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">
            <Plus size={18} />
            Add reservation
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b">
            <div className="flex space-x-1">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by title"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-red-600 hover:bg-gray-50">
                Delete selection
              </button>
            </div>
          </div>

          <div className="border-b">
            <div className="flex overflow-x-auto">
              {["All", "New", "Accepted", "Canceled", "Deleted at"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === tab
                      ? "text-blue-600 border-blue-500"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
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
                        checked={selectedReservations.length === filteredReservations.length && filteredReservations.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of guests</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map(reservation => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        checked={selectedReservations.includes(reservation.id)}
                        onChange={() => toggleReservationSelection(reservation.id)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{reservation.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {reservation.client || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{reservation.dateTime}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          reservation.status === "Accepted" 
                            ? "bg-green-100 text-green-800" 
                            : reservation.status === "New" 
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {reservation.status}
                      </span>
                      {reservation.status === "Accepted" || reservation.status === "New" ? (
                        <Pencil size={12} className="inline ml-2 text-gray-400" />
                      ) : null}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{reservation.guests}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1.5 bg-blue-100 rounded-full hover:bg-blue-200"
                          aria-label="View details"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </button>
                        <button 
                          className="p-1.5 bg-red-100 rounded-full hover:bg-red-200"
                          aria-label="Delete"
                        >
                          <Trash size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
                <span className="font-medium">20</span> results
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="relative z-0 inline-flex shadow-sm rounded-md">
                <button
                  type="button"
                  className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-blue-500 hover:bg-gray-50"
                >
                  1
                </button>
                <button
                  type="button"
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  2
                </button>
                <button
                  type="button"
                  className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  3
                </button>
              </span>
              <button
                type="button"
                className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
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