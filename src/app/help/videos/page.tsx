"use client"

import { useState } from 'react'
import PageLayout from "@/components/layout/page-layout"

interface HelpVideo {
  title: string
  link: string
}

interface VideoCategory {
  title: string
  videos: HelpVideo[]
}

export default function HelpVideosPage() {
  const videoCategories: VideoCategory[] = [
    {
      title: "Orders",
      videos: [
        { title: "Managing your orders", link: "#" }
      ]
    },
    {
      title: "Inventory",
      videos: [
        { title: "Creating a menu category", link: "#" },
        { title: "Creating a menu item", link: "#" },
        { title: "Adding attributes to menu items", link: "#" },
        { title: "Adding images to menu items", link: "#" },
        { title: "Change display order of menu items", link: "#" },
        { title: "Changing the order of menu categories", link: "#" },
        { title: "Managing Stock for menu items", link: "#" },
        { title: "Setting sale prices on menu items", link: "#" }
      ]
    },
    {
      title: "Reports",
      videos: [
        { title: "Running and viewing reports", link: "#" }
      ]
    },
    {
      title: "Marketing",
      videos: [
        { title: "Sending Push Messages", link: "#" },
        { title: "Sending a Marketing Email", link: "#" },
        { title: "Sending a Marketing SMS", link: "#" },
        { title: "Search and view your customers details", link: "#" },
        { title: "Creating Business Offers", link: "#" },
        { title: "Creating a discount", link: "#" }
      ]
    },
    {
      title: "Settings",
      videos: [
        { title: "Creating table groups & tables", link: "#" },
        { title: "Setting up advanced ordering", link: "#" },
        { title: "Setting Opening Times", link: "#" },
        { title: "Setting up Delivery Charges", link: "#" },
        { title: "Changing restaurant details", link: "#" }
      ]
    }
  ]
  
  const handlePlayVideo = (video: HelpVideo) => {
    // Implementation for playing a video
    console.log(`Playing video: ${video.title}`)
  }
  
  return (
    <PageLayout>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-3 border-b bg-white">
        <div className="flex-1"></div>
        <h1 className="text-xl font-medium flex-1 text-center">Admin user</h1>
        <div className="flex justify-end flex-1">
          <button className="flex items-center text-gray-700 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            View Your Store
          </button>
        </div>
      </header>
      
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-xl font-medium mb-6">Help Videos</h1>
        
        {videoCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-10">
            <h2 className="text-lg font-medium mb-4">{category.title}</h2>
            
            <div className="space-y-2">
              {category.videos.map((video, videoIndex) => (
                <div 
                  key={videoIndex} 
                  className="p-3 bg-white hover:bg-gray-50 rounded border border-gray-200 cursor-pointer flex items-center"
                  onClick={() => handlePlayVideo(video)}
                >
                  <div className="mr-3 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>
                  </div>
                  <span>{video.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
} 