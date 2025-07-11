'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, X, Clock, Truck, Package, UtensilsCrossed } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { BaseUrl } from '@/lib/config'
import api from '@/lib/axios'
import { useAuth } from '@/contexts/auth-context'
import { Toaster } from 'react-hot-toast'

const timeOptions = [
  '5 mins', '10 mins', '15 mins', '20 mins', '25 mins', '30 mins', 
  '35 mins', '40 mins', '45 mins', '50 mins', '55 mins', '60 mins',
  '65 mins', '70 mins', '75 mins', '80 mins', '85 mins', '90 mins',
  '95 mins', '100 mins', '105 mins', '110 mins', '115 mins', '120 mins',
  '125 mins', '130 mins', '135 mins', '140 mins', '145 mins', '150 mins'
]

interface LeadTimesData {
  collection: string
  delivery: string
  day?: string
  date?: string
}

export default function LeadTimesPage() {
  const { user } = useAuth()
  const displayName = (user?.firstName + " " + user?.lastName) || 'Admin User'
  
  const [collectionTime, setCollectionTime] = useState('20 mins')
  const [deliveryTime, setDeliveryTime] = useState('45 mins')
  const [isLoading, setIsLoading] = useState(false)
  const [leadTimes, setLeadTimes] = useState<LeadTimesData | null>(null)

  // Fetch current lead times on component mount
  useEffect(() => {
    const fetchLeadTimes = async () => {
      try {
        const response = await api.get('/settings/lead-times')
        
        if (response.data.success) {
          const data = response.data.data
          setLeadTimes(data)
          setCollectionTime(data.collection || '20 mins')
          setDeliveryTime(data.delivery || '45 mins')
        } else {
          toast.error(response.data.message || 'Failed to fetch lead times')
        }
      } catch (error: any) {
        console.error('Error fetching lead times:', error)
        
        // Handle specific error cases
        if (error.response?.status === 401) {
          toast.error('Unauthorized access. Please login again.')
        } else if (error.response?.status === 403) {
          toast.error('Access denied. Admin privileges required.')
        } else if (error.response?.status === 404) {
          toast.error('Branch not found')
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message)
        } else {
          toast.error('Failed to fetch lead times. Please try again.')
        }
      }
    }

    fetchLeadTimes()
  }, [])

  const handleSave = async () => {
    console.log(collectionTime, deliveryTime)
    if (!collectionTime || !deliveryTime) {
      toast.error('Please select both collection and delivery times')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.put('/settings/lead-times', {
        collection: collectionTime,
        delivery: deliveryTime
      })

      if (response) {
        setLeadTimes(response.data.data)
        toast.success('Lead times updated successfully')
      } else {
        toast.error(response.data.message || 'Failed to update lead times')
      }
    } catch (error: any) {
      console.error('Error updating lead times:', error)
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error('Unauthorized access. Please login again.')
      } else if (error.response?.status === 403) {
        toast.error('Access denied. You are not authorized to update lead times.')
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid input data')
      } else if (error.response?.status === 404) {
        toast.error('Branch not found')
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An error occurred while updating lead times. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavigate = (path: string) => {
    window.location.href = path
  }

  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
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
          <span className="font-medium">Restaurant Settings</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">{displayName}</span>
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
        <div className="mb-6">
          <h1 className="text-3xl font-semibold mb-2">Change Lead Times</h1>
          {leadTimes && leadTimes.day && (
            <p className="text-gray-600">
              Today's Settings ({formatDayName(leadTimes.day)} - {leadTimes.date})
            </p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label htmlFor="collection-time" className="text-lg font-medium">
                Collection
              </label>
              <div className="w-40">
                <Select value={collectionTime} onValueChange={setCollectionTime} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px] overflow-y-auto">
                    <SelectGroup>
                      {timeOptions.map(time => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="delivery-time" className="text-lg font-medium">
                Delivery
              </label>
              <div className="w-40">
                <Select value={deliveryTime} onValueChange={setDeliveryTime} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px] overflow-y-auto">
                    <SelectGroup>
                      {timeOptions.map(time => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleSave}
                type="button"
                className="bg-emerald-500 hover:bg-emerald-600 text-white w-24"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 