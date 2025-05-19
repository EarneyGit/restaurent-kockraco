"use client"

import React, { useState } from "react"
import { PlusIcon } from "lucide-react"
import { BaseUrl } from '@/lib/config'

export default function BranchGalleries() {
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  
  const images = [
    { id: 1, src: "/soup.jpg", alt: "Soup" },
    { id: 2, src: "/pizza.jpg", alt: "Pizza" },
    { id: 3, src: "/salad.jpg", alt: "Salad" },
    { id: 4, src: "/roast.jpg", alt: "Roast" },
    { id: 5, src: "/cake.jpg", alt: "Cake" },
    { id: 6, src: "/pie.jpg", alt: "Pie" },
    { id: 7, src: "/burger.jpg", alt: "Burger" },
    { id: 8, src: "/burger-double.jpg", alt: "Double Burger" }
  ]

  const toggleImageSelection = (id: number) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(imageId => imageId !== id))
    } else {
      setSelectedImages([...selectedImages, id])
    }
  }

  const selectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([])
    } else {
      setSelectedImages(images.map(img => img.id))
    }
  }

  const deleteSelected = () => {
    // In a real application, this would delete the selected images
    console.log("Deleting images:", selectedImages)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Branch galleries</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2 hover:bg-blue-600">
          <PlusIcon className="h-5 w-5" />
          Add image
        </button>
      </div>
      
      <div className="flex justify-end space-x-4 mb-4">
        <button 
          onClick={selectAll}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
        >
          Select all
        </button>
        <button 
          onClick={deleteSelected}
          className={`px-4 py-2 rounded-md ${selectedImages.length > 0 ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          disabled={selectedImages.length === 0}
        >
          Delete all
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map(image => (
          <div 
            key={image.id} 
            className={`relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer aspect-square ${
              selectedImages.includes(image.id) ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => toggleImageSelection(image.id)}
          >
            <img 
              src={`${BaseUrl}${image.src}`} 
              alt={image.alt} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <input 
                type="checkbox" 
                checked={selectedImages.includes(image.id)}
                onChange={() => toggleImageSelection(image.id)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-gray-500 text-sm">
        Restroman support team <span className="text-blue-500">123456789</span>
      </div>
    </div>
  )
} 