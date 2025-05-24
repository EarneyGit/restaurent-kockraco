"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, X } from "lucide-react"
import { toast } from "react-hot-toast"
import api from "@/lib/axios"
import { useAuth } from "@/contexts/auth-context"

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
}

export default function RestaurantSettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<BranchSettings>({
    isCollectionEnabled: false,
    isDeliveryEnabled: false,
    isTableOrderingEnabled: false
  })
  const [branchInfo, setBranchInfo] = useState<Branch | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchBranchSettings()
  }, [])

  const fetchBranchSettings = async () => {
    try {
      setIsLoading(true)
      // Use the endpoint that automatically gets admin's assigned branch
      const response = await api.get('/branches/my-branch')
      const data = response.data

      if (data.success) {
        const branch = data.data
        setBranchInfo(branch)
        setSettings({
          isCollectionEnabled: branch.isCollectionEnabled || false,
          isDeliveryEnabled: branch.isDeliveryEnabled || false,
          isTableOrderingEnabled: branch.isTableOrderingEnabled || false
        })
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

        toast.success('Settings updated successfully')
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
            <span className="mr-2">Admin user</span>
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
          <span className="mr-2">Admin user</span>
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
                </div>
                <Switch
                  checked={settings[setting.key]}
                  onCheckedChange={() => toggleSetting(setting.key)}
                  disabled={isSaving}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Important Notes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Changes take effect immediately for new orders</li>
            <li>• Disabling a service will prevent customers from placing new orders of that type</li>
            <li>• Existing orders will not be affected by these changes</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 