"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, X } from "lucide-react"

export default function TakeOfflinePage() {
  const [searchText, setSearchText] = useState("")

  const handleNavigate = (path: string) => {
    window.location.href = path
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 bg-white border-b">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleNavigate('/orders/live')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <span className="font-medium">Live Orders</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Admin user</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleNavigate('/orders/live/exit')}
          >
            Exit <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="p-6">
        <h1 className="text-2xl font-medium mb-6">Take items offline</h1>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Input
            type="text"
            placeholder="Enter search text here"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="mb-4"
          />

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Search Products
            </Button>
            <Button variant="outline" className="flex-1">
              Search Attributes
            </Button>
          </div>

          <div className="mt-8 text-center text-gray-500">
            No products or attributes Offline
          </div>
        </div>
      </div>
    </div>
  )
} 