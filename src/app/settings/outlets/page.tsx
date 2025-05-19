"use client"

import { useState } from 'react'
import PageLayout from "@/components/layout/page-layout"
import dynamic from 'next/dynamic'

const Tiptap = dynamic(() => import("@/components/ui/tiptap"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
})

export default function OutletsPage() {
  const [aboutUs, setAboutUs] = useState(`Admin user
Address
26 Bruce Street
Admin user
KY12 7AG
United Kingdom
Telephone
01383223409
Opening Times
Monday
11:45-14:30
16:30-22:00
Tuesday
16:30-22:00
Wednesday
16:30-22:00
Thursday
11:45-14:30
16:30-22:00
Friday
11:45-14:30
16:30-22:00
Saturday
11:45-14:30
16:30-23:00
Sunday
11:45-14:30
16:30-22:00

EDINBURGH
Address
27 Nicolson Road
Edinburgh
EH8 9BZ
United Kingdom
Telephone
01312375516
Opening Times
Monday
16:30-22:00
Tuesday
16:30-22:00
Wednesday
16:30-22:00
Thursday
16:30-22:00
Friday
16:30-23:00
Saturday
16:30-23:00
Sunday
16:30-22:00`)

  // Sample outlet data
  const outletData = {
    name: 'Admin user',
    aboutUs: '',
    address: {
      street: '26 Bruce Street',
      city: 'Admin user',
      postcode: 'KY12 7AG',
      country: 'United Kingdom',
      telephone: '01383223409'
    },
    openingTimes: {
      Monday: ['11:45-14:30', '16:30-22:00'],
      Tuesday: ['16:30-22:00'],
      Wednesday: ['16:30-22:00'],
      Thursday: ['11:45-14:30', '16:30-22:00'],
      Friday: ['11:45-14:30', '16:30-23:00'],
      Saturday: ['11:45-14:30', '16:30-23:00'],
      Sunday: ['11:45-14:30', '16:30-22:00']
    },
    email: 'kockraco@gmail.com',
    contactNumber: '+44383623409'
  }

  // Second outlet data (Edinburgh)
  const edinburghData = {
    name: 'EDINBURGH',
    address: {
      street: '27 Nicolson Road',
      city: 'Edinburgh',
      postcode: 'EH8 9BZ',
      country: 'United Kingdom',
      telephone: '01312375516'
    },
    openingTimes: {
      Monday: ['16:30-22:00'],
      Tuesday: ['16:30-22:00'],
      Wednesday: ['16:30-22:00'],
      Thursday: ['16:30-22:00'],
      Friday: ['16:30-23:00'],
      Saturday: ['16:30-23:00'],
      Sunday: ['16:30-22:00']
    }
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
        {/* Details Section */}
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-4">Details</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 mb-4">Setup the basic contact details for your outlet</p>
            <p className="text-gray-600 mb-4">Email and contact number are displayed on order confirmation emails sent to the customer</p>
            
            <form>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Outlet Name</label>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  defaultValue={outletData.name}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">About Us</label>
                <Tiptap
                  content={aboutUs}
                  onChange={setAboutUs}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  defaultValue={outletData.email}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Contact Number</label>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  defaultValue={outletData.contactNumber}
                />
              </div>
              
              <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md">
                Save all Changes
              </button>
            </form>
          </div>
        </div>
        
        {/* Location Section */}
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-4">Location</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 mb-4">Address details for this outlet</p>
            <p className="text-gray-600 mb-4">Postcode is required to calculate distances in relation to delivery charges.</p>
            <p className="text-gray-600 mb-4">Please ensure a valid postcode is supplied.</p>
            
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Address Line 1</label>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  defaultValue={outletData.address.street}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Address Line 2</label>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">City</label>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  defaultValue={outletData.address.city}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">County</label>
                  <input 
                    type="text" 
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    defaultValue="Fife"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Postcode</label>
                  <input 
                    type="text" 
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    defaultValue={outletData.address.postcode}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Country</label>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  defaultValue={outletData.address.country}
                />
              </div>
              
              <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md">
                Save all Changes
              </button>
            </form>
          </div>
        </div>
        
        {/* Ordering Options Section */}
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-4">Ordering Options</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 mb-4">Choose how the ordering times are shown.</p>
            
            <form>
              <div className="mb-6">
                <h3 className="font-medium mb-3">Collection Ordering</h3>
                <div className="flex items-center mb-3">
                  <label className="text-sm font-medium mr-4">Display Format</label>
                  <div className="flex items-center">
                    <input type="radio" name="collection-format" className="mr-2" defaultChecked />
                    <span>TimeOnly</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="text-sm font-medium mr-4">Length of Timeslot</label>
                  <div className="flex items-center">
                    <input type="text" className="border border-gray-300 rounded-md px-3 py-1 w-12 mr-2" defaultValue="15" />
                    <span>minutes</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3">Delivery Ordering</h3>
                <div className="flex items-center mb-3">
                  <label className="text-sm font-medium mr-4">Display Format</label>
                  <div className="flex items-center">
                    <input type="radio" name="delivery-format" className="mr-2" defaultChecked />
                    <span>TimeOnly</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="text-sm font-medium mr-4">Length of Timeslot</label>
                  <div className="flex items-center">
                    <input type="text" className="border border-gray-300 rounded-md px-3 py-1 w-12 mr-2" defaultValue="15" />
                    <span>minutes</span>
                  </div>
                </div>
              </div>
              
              <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md">
                Save all Changes
              </button>
            </form>
          </div>
        </div>
        
        {/* Pre-Ordering Section */}
        <div>
          <h2 className="text-xl font-medium mb-4">Pre-Ordering</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 mb-4">Choose if your customers can place pre-orders for collection or delivery.</p>
            
            <form>
              <div className="flex items-center mb-4">
                <label className="flex items-center cursor-pointer">
                  <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out bg-gray-200 rounded-full">
                    <input type="checkbox" className="absolute w-5 h-5 opacity-0 z-10 cursor-pointer" />
                    <span className="absolute left-0 w-5 h-5 transition duration-100 ease-in-out transform bg-white border-2 border-gray-200 rounded-full"></span>
                  </div>
                  <span className="ml-3">Allow Pre-Ordering for Collection</span>
                </label>
              </div>
              
              <div className="flex items-center mb-6">
                <label className="flex items-center cursor-pointer">
                  <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out bg-gray-200 rounded-full">
                    <input type="checkbox" className="absolute w-5 h-5 opacity-0 z-10 cursor-pointer" />
                    <span className="absolute left-0 w-5 h-5 transition duration-100 ease-in-out transform bg-white border-2 border-gray-200 rounded-full"></span>
                  </div>
                  <span className="ml-3">Allow Pre-Ordering for Delivery</span>
                </label>
              </div>
              
              <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md">
                Save all Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 