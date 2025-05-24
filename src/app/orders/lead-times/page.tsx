'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { BaseUrl } from '@/lib/config'
import api from '@/lib/axios'

const timeOptions = [
  '5 mins', '10 mins', '15 mins', '20 mins', '25 mins', '30 mins', 
  '35 mins', '40 mins', '45 mins', '50 mins', '55 mins', '60 mins',
  '65 mins', '70 mins', '75 mins', '80 mins', '85 mins', '90 mins',
  '95 mins', '100 mins', '105 mins', '110 mins', '115 mins', '120 mins',
  '125 mins', '130 mins', '135 mins', '140 mins', '145 mins', '150 mins'
]

export default function LeadTimesPage() {
  const [collectionTime, setCollectionTime] = useState('20 mins')
  const [deliveryTime, setDeliveryTime] = useState('45 mins')
  const [isLoading, setIsLoading] = useState(false)
  const [leadTimes, setLeadTimes] = useState({})

  // Fetch current lead times on component mount
  useEffect(() => {
    const fetchLeadTimes = async () => {
      setIsLoading(true)
      try {
        const response = await api.get('/settings/lead-times')
        const data = response.data
        if (data.success) {
          setLeadTimes(data.data)
          setCollectionTime(data.data.collection || '20 mins')
          setDeliveryTime(data.data.delivery || '45 mins')
        } else {
          toast.error(data.message || 'Failed to fetch lead times')
        }
      } catch (error) {
        console.error('Error fetching lead times:', error)
        toast.error('Failed to fetch lead times')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeadTimes()
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await api.put('/settings/lead-times', {
        collection: collectionTime,
        delivery: deliveryTime
      })
      const data = response.data

      if (data.success) {
        toast.success('Lead times updated successfully')
      } else {
        toast.error(data.message || 'Failed to update lead times')
      }
    } catch (error) {
      console.error('Error updating lead times:', error)
      toast.error('An error occurred while updating lead times')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-3xl font-semibold mb-8">Change Lead Times</h1>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label htmlFor="collection-time" className="text-lg font-medium">
            Collection
          </label>
          <div className="w-40">
            <Select value={collectionTime} onValueChange={setCollectionTime}>
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
            <Select value={deliveryTime} onValueChange={setDeliveryTime}>
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
            className="bg-emerald-500 hover:bg-emerald-600 text-white w-24"
            disabled={isLoading}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
} 