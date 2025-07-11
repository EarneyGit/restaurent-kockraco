"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, X, Settings, Clock, Bell, Truck } from "lucide-react"
import { toast } from "react-hot-toast"
import api from "@/lib/axios"
import { useAuth } from "@/contexts/auth-context"

interface TodaySettings {
  day: string
  date: string
  isClosed: boolean
  isCollectionEnabled: boolean
  isDeliveryEnabled: boolean
  isTableOrderingEnabled: boolean
  defaultTimes: {
    start: string
    end: string
  }
  collection: {
    useDifferentTimes: boolean
    leadTime: number
    displayedTime: string
    customTimes: {
      start: string
      end: string
    }
  }
  delivery: {
    useDifferentTimes: boolean
    leadTime: number
    displayedTime: string
    customTimes: {
      start: string
      end: string
    }
  }
  tableOrdering: {
    useDifferentTimes: boolean
    leadTime: number
    displayedTime: string
    customTimes: {
      start: string
      end: string
    }
  }
}

interface BranchSettings {
  isCollectionEnabled: boolean
  isDeliveryEnabled: boolean
  isTableOrderingEnabled: boolean
}

interface Branch {
  _id: string
  name: string
  isCollectionEnabled: boolean
  isDeliveryEnabled: boolean
  isTableOrderingEnabled: boolean
  todaySettings?: TodaySettings
}

export default function RestaurantSettingsPage() {
  const { user } = useAuth()
  const displayName = (user?.firstName + " " + user?.lastName) || 'Admin User'
  
  const [settings, setSettings] = useState<BranchSettings>({
    isCollectionEnabled: false,
    isDeliveryEnabled: false,
    isTableOrderingEnabled: false
  })
  const [branchInfo, setBranchInfo] = useState<Branch | null>(null)
  const [todaySettings, setTodaySettings] = useState<TodaySettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchBranchSettings()
  }, [])

  const fetchBranchSettings = async () => {
    try {
      setIsLoading(true)
      // Use the endpoint with date="today" parameter to get today's settings
      const response = await api.get('/branches/my-branch?date=today')
      const data = response.data

      if (data.success) {
        const branch = data.data
        setBranchInfo(branch)
        
        // Use today's settings if available, otherwise fall back to branch settings
        if (branch.todaySettings) {
          setTodaySettings(branch.todaySettings)
          setSettings({
            isCollectionEnabled: branch.todaySettings.isCollectionEnabled,
            isDeliveryEnabled: branch.todaySettings.isDeliveryEnabled,
            isTableOrderingEnabled: branch.todaySettings.isTableOrderingEnabled
          })
        } else {
          // Fallback to branch settings
          setSettings({
            isCollectionEnabled: branch.isCollectionEnabled || false,
            isDeliveryEnabled: branch.isDeliveryEnabled || false,
            isTableOrderingEnabled: branch.isTableOrderingEnabled || false
          })
        }
      } else {
        toast.error('Failed to fetch branch settings')
      }
    } catch (error) {
      console.error('Error fetching branch settings:', error)
      toast.error('Failed to load branch settings')
    } finally {
      setIsLoading(false)
    }
  }

  const updateBranchSettings = async (settingKey: keyof BranchSettings, value: boolean) => {
    try {
      setIsSaving(true)
      
      // Prepare the update payload
      const updatePayload = {
        [settingKey]: value
      }

      // Use the settings endpoint that automatically uses admin's branch
      const response = await api.patch('/branches/settings', updatePayload)
      const data = response.data

      if (data.success) {
        // Update local state
        setSettings(prev => ({
          ...prev,
          [settingKey]: value
        }))
        
        // Update branch info
        setBranchInfo(prev => prev ? {
          ...prev,
          [settingKey]: value
        } : null)

        // Update today settings if available
        if (todaySettings) {
          setTodaySettings(prev => prev ? {
            ...prev,
            [settingKey]: value
          } : null)
        }

        toast.success('Settings updated successfully')
        
        // Refresh the data to ensure we have the latest state
        setTimeout(() => {
          fetchBranchSettings()
        }, 500)
      } else {
        toast.error(data.message || 'Failed to update settings')
        // Revert the change if it failed
        setSettings(prev => ({
          ...prev,
          [settingKey]: !value
        }))
      }
    } catch (error) {
      console.error('Error updating branch settings:', error)
      toast.error('Failed to update settings')
      // Revert the change if it failed
      setSettings(prev => ({
        ...prev,
        [settingKey]: !value
      }))
    } finally {
      setIsSaving(false)
    }
  }

  const handleNavigate = (path: string) => {
    window.location.href = path
  }

  const toggleSetting = async (settingKey: keyof BranchSettings) => {
    const newValue = !settings[settingKey]
    
    // Optimistically update the UI
    setSettings(prev => ({
      ...prev,
      [settingKey]: newValue
    }))

    // Update the backend
    await updateBranchSettings(settingKey, newValue)
  }

  const settingsConfig = [
    {
      key: 'isCollectionEnabled' as keyof BranchSettings,
      name: 'Collection',
      description: 'Allow customers to place collection orders'
    },
    {
      key: 'isDeliveryEnabled' as keyof BranchSettings,
      name: 'Delivery',
      description: 'Allow customers to place delivery orders'
    },
    {
      key: 'isTableOrderingEnabled' as keyof BranchSettings,
      name: 'Table Ordering',
      description: 'Allow customers to order from tables'
    }
  ]

  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  if (isLoading) {
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
            <span className="font-medium">Restaurant Settings</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">{displayName}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavigate('/')}
            >
              Exit <X className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        </div>
      </div>
    )
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
          <span className="font-medium">Restaurant Settings</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">{displayName}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleNavigate('/')}
          >
            Exit <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-medium mb-2">Restaurant Settings</h1>
          {branchInfo && (
            <p className="text-gray-600">Managing settings for {branchInfo.name}</p>
          )}
          {todaySettings && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Today's Settings ({formatDayName(todaySettings.day)})</strong>
              </p>
              {todaySettings.isClosed ? (
                <p className="text-sm text-red-600 mt-1">⚠️ Restaurant is closed today</p>
              ) : (
                <p className="text-sm text-blue-700 mt-1">
                  Operating Hours: {todaySettings.defaultTimes.start} - {todaySettings.defaultTimes.end}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y">
            {settingsConfig.map(setting => (
              <div 
                key={setting.key}
                className="flex items-center justify-between p-6"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{setting.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                  {todaySettings && todaySettings.isClosed && (
                    <p className="text-sm text-red-500 mt-1">
                      ⚠️ Restaurant is closed today - this setting will be disabled
                    </p>
                  )}
                </div>
                <Switch
                  checked={settings[setting.key]}
                  onCheckedChange={() => toggleSetting(setting.key)}
                  disabled={isSaving || (todaySettings?.isClosed || false)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Today's Detailed Settings */}
        {/* {todaySettings && !todaySettings.isClosed && (
          <div className="mt-6 bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">Today's Detailed Settings</h3>
              <p className="text-sm text-gray-500 mt-1">
                {formatDayName(todaySettings.day)} - {todaySettings.date}
              </p>
            </div>
            <div className="divide-y">
              <div className="p-6">
                <h4 className="font-medium text-gray-900 mb-3">Collection</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Lead Time:</span>
                    <span className="ml-2 font-medium">{todaySettings.collection.leadTime} minutes</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Display Time:</span>
                    <span className="ml-2 font-medium">{todaySettings.collection.displayedTime}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Custom Times:</span>
                    <span className="ml-2 font-medium">
                      {todaySettings.collection.customTimes.start} - {todaySettings.collection.customTimes.end}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="font-medium text-gray-900 mb-3">Delivery</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Lead Time:</span>
                    <span className="ml-2 font-medium">{todaySettings.delivery.leadTime} minutes</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Display Time:</span>
                    <span className="ml-2 font-medium">{todaySettings.delivery.displayedTime}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Custom Times:</span>
                    <span className="ml-2 font-medium">
                      {todaySettings.delivery.customTimes.start} - {todaySettings.delivery.customTimes.end}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="font-medium text-gray-900 mb-3">Table Ordering</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Lead Time:</span>
                    <span className="ml-2 font-medium">{todaySettings.tableOrdering.leadTime} minutes</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Display Time:</span>
                    <span className="ml-2 font-medium">
                      {todaySettings.tableOrdering.displayedTime || 'Not set'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Custom Times:</span>
                    <span className="ml-2 font-medium">
                      {todaySettings.tableOrdering.customTimes.start} - {todaySettings.tableOrdering.customTimes.end}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Additional Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Important Notes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Changes take effect immediately for new orders</li>
            <li>• Disabling a service will prevent customers from placing new orders of that type</li>
            <li>• Existing orders will not be affected by these changes</li>
            {todaySettings && todaySettings.isClosed && (
              <li>• Restaurant is closed today - all ordering services are disabled</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
} 