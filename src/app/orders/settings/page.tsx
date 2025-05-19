"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, X } from "lucide-react"

interface Setting {
  id: string
  name: string
  enabled: boolean
}

export default function RestaurantSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([
    { id: 'collection', name: 'Collection', enabled: true },
    { id: 'delivery', name: 'Delivery', enabled: true },
    { id: 'table-ordering', name: 'Table Ordering', enabled: false }
  ])

  const handleNavigate = (path: string) => {
    window.location.href = path
  }

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting =>
      setting.id === id
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ))
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
        <h1 className="text-2xl font-medium mb-6">Restaurant Settings</h1>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y">
            {settings.map(setting => (
              <div 
                key={setting.id}
                className="flex items-center justify-between p-4"
              >
                <span className="font-medium">{setting.name}</span>
                <Switch
                  checked={setting.enabled}
                  onCheckedChange={() => toggleSetting(setting.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 