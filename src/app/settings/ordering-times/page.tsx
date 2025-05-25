"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, Eye, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { orderingTimesService, type OrderingTimes, type DaySettings } from "@/services/ordering-times.service"
import { toast } from "sonner"

export default function OrderingTimesPage() {
  const router = useRouter()
  const [expandedDay, setExpandedDay] = useState<string | null>("monday")
  const [orderingTimes, setOrderingTimes] = useState<OrderingTimes | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadOrderingTimes()
  }, [])

  const loadOrderingTimes = async () => {
    try {
      setLoading(true)
      const response = await orderingTimesService.getOrderingTimes()
      setOrderingTimes(response.data)
    } catch (error) {
      console.error('Error loading ordering times:', error)
      toast.error('Failed to load ordering times')
    } finally {
      setLoading(false)
    }
  }

  const handleDayToggle = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day)
  }

  const updateDaySettings = async (day: string, updates: Partial<DaySettings>) => {
    if (!orderingTimes) return

    try {
      setSaving(true)
      
      // Get current day settings
      const currentSettings = orderingTimes.weeklySchedule[day as keyof typeof orderingTimes.weeklySchedule]
      
      // Merge updates with current settings
      const updatedSettings: DaySettings = {
        ...currentSettings,
        ...updates,
        // Handle nested objects properly
        defaultTimes: {
          ...currentSettings.defaultTimes,
          ...(updates.defaultTimes || {})
        },
        collection: {
          ...currentSettings.collection,
          ...(updates.collection || {})
        },
        delivery: {
          ...currentSettings.delivery,
          ...(updates.delivery || {}),
          customTimes: {
            ...currentSettings.delivery.customTimes,
            ...(updates.delivery?.customTimes || {})
          }
        },
        tableOrdering: {
          ...currentSettings.tableOrdering,
          ...(updates.tableOrdering || {}),
          customTimes: {
            ...currentSettings.tableOrdering.customTimes,
            ...(updates.tableOrdering?.customTimes || {})
          }
        }
      }

      // Update via API
      await orderingTimesService.updateDaySchedule(day, updatedSettings)
      
      // Update local state
      setOrderingTimes(prev => {
        if (!prev) return prev
        return {
          ...prev,
          weeklySchedule: {
            ...prev.weeklySchedule,
            [day]: updatedSettings
          }
        }
      })

      toast.success(`${orderingTimesService.getDayDisplayName(day)} settings updated`)
    } catch (error) {
      console.error('Error updating day settings:', error)
      toast.error('Failed to update day settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAllChanges = async () => {
    if (!orderingTimes) return

    try {
      setSaving(true)
      await orderingTimesService.updateWeeklySchedule(orderingTimes.weeklySchedule)
      toast.success('All ordering times saved successfully')
    } catch (error) {
      console.error('Error saving all changes:', error)
      toast.error('Failed to save all changes')
    } finally {
      setSaving(false)
    }
  }

  const navigateToClosedDates = () => {
    router.push("/settings/ordering-times/closed-dates")
  }

  const navigateToRestrictions = () => {
    router.push("/settings/ordering-times/restrictions")
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          Loading ordering times...
        </div>
      </PageLayout>
    )
  }

  if (!orderingTimes) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ordering times found</h3>
            <p className="text-gray-500">Failed to load ordering times data.</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-3 border-b bg-white">
        <div className="flex-1"></div>
        <h1 className="text-xl font-medium flex-1 text-center">Admin user</h1>
        <div className="flex justify-end flex-1">
          <button className="flex items-center text-gray-700 font-medium">
            <Eye className="h-5 w-5 mr-1" />
            View Your Store
          </button>
        </div>
      </header>
      
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-medium mb-4">Ordering Times</h1>
          
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <p className="text-gray-600 mb-2">
              Set the times here that your customers can place orders.
            </p>
            <p className="text-gray-600 mb-4">
              First, set the basic times and choose if they're what you want for a collection service. Then, if required, override them for delivery and table ordering.
            </p>
            
            <div className="flex gap-2 mb-4">
              <Button 
                variant="outline" 
                className="text-emerald-600 border-emerald-600"
                onClick={navigateToClosedDates}
              >
                Closed Dates
              </Button>
              <Button 
                variant="outline" 
                className="text-emerald-600 border-emerald-600"
                onClick={navigateToRestrictions}
              >
                Restrictions
              </Button>
            </div>
            
            <Button 
              onClick={handleSaveAllChanges}
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
          
          <div className="space-y-4">
            {Object.entries(orderingTimes.weeklySchedule).map(([day, settings]) => (
              <div key={day} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => handleDayToggle(day)}
                >
                  <div className="flex items-center gap-4">
                    <h3 className="font-medium capitalize">{day}</h3>
                    <div className="flex gap-2">
                      {settings.isCollectionAllowed && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Collection</span>
                      )}
                      {settings.isDeliveryAllowed && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Delivery</span>
                      )}
                      {settings.isTableOrderingAllowed && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Table</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {orderingTimesService.formatTimeRange(settings.defaultTimes.start, settings.defaultTimes.end)}
                    </span>
                  </div>
                  {expandedDay === day ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>

                <div className={cn(
                  "border-t",
                  expandedDay === day ? "block" : "hidden"
                )}>
                  <div className="p-6 space-y-6">
                    {/* Default Times */}
                    <div>
                      <h4 className="font-medium mb-3">Default Times</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`${day}-start`}>Start Time</Label>
                          <Input
                            id={`${day}-start`}
                            type="time"
                            value={settings.defaultTimes.start}
                            onChange={(e) => updateDaySettings(day, {
                              defaultTimes: { ...settings.defaultTimes, start: e.target.value }
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${day}-end`}>End Time</Label>
                          <Input
                            id={`${day}-end`}
                            type="time"
                            value={settings.defaultTimes.end}
                            onChange={(e) => updateDaySettings(day, {
                              defaultTimes: { ...settings.defaultTimes, end: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Collection Settings */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Collection</h4>
                        <Switch
                          checked={settings.isCollectionAllowed}
                          onCheckedChange={(checked) => updateDaySettings(day, {
                            isCollectionAllowed: checked
                          })}
                        />
                      </div>
                      {settings.isCollectionAllowed && (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`${day}-collection-lead`}>Lead Time (minutes)</Label>
                            <Input
                              id={`${day}-collection-lead`}
                              type="number"
                              min="0"
                              value={settings.collection.leadTime}
                              onChange={(e) => updateDaySettings(day, {
                                collection: { ...settings.collection, leadTime: parseInt(e.target.value) || 0 }
                              })}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${day}-collection-display`}>Displayed Time</Label>
                            <Input
                              id={`${day}-collection-display`}
                              type="time"
                              value={settings.collection.displayedTime}
                              onChange={(e) => updateDaySettings(day, {
                                collection: { ...settings.collection, displayedTime: e.target.value }
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delivery Settings */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Delivery</h4>
                        <Switch
                          checked={settings.isDeliveryAllowed}
                          onCheckedChange={(checked) => updateDaySettings(day, {
                            isDeliveryAllowed: checked
                          })}
                        />
                      </div>
                      {settings.isDeliveryAllowed && (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={settings.delivery.useDifferentTimes}
                              onCheckedChange={(checked) => updateDaySettings(day, {
                                delivery: { ...settings.delivery, useDifferentTimes: checked }
                              })}
                            />
                            <Label>Use different times for delivery</Label>
                          </div>
                          
                          {settings.delivery.useDifferentTimes && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`${day}-delivery-start`}>Start Time</Label>
                                <Input
                                  id={`${day}-delivery-start`}
                                  type="time"
                                  value={settings.delivery.customTimes.start}
                                  onChange={(e) => updateDaySettings(day, {
                                    delivery: {
                                      ...settings.delivery,
                                      customTimes: { ...settings.delivery.customTimes, start: e.target.value }
                                    }
                                  })}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`${day}-delivery-end`}>End Time</Label>
                                <Input
                                  id={`${day}-delivery-end`}
                                  type="time"
                                  value={settings.delivery.customTimes.end}
                                  onChange={(e) => updateDaySettings(day, {
                                    delivery: {
                                      ...settings.delivery,
                                      customTimes: { ...settings.delivery.customTimes, end: e.target.value }
                                    }
                                  })}
                                />
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <Label htmlFor={`${day}-delivery-lead`}>Lead Time (minutes)</Label>
                            <Input
                              id={`${day}-delivery-lead`}
                              type="number"
                              min="0"
                              value={settings.delivery.leadTime}
                              onChange={(e) => updateDaySettings(day, {
                                delivery: { ...settings.delivery, leadTime: parseInt(e.target.value) || 0 }
                              })}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${day}-delivery-display`}>Displayed Time</Label>
                            <Input
                              id={`${day}-delivery-display`}
                              type="time"
                              value={settings.delivery.displayedTime}
                              onChange={(e) => updateDaySettings(day, {
                                delivery: { ...settings.delivery, displayedTime: e.target.value }
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Table Ordering Settings */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Table Ordering</h4>
                        <Switch
                          checked={settings.isTableOrderingAllowed}
                          onCheckedChange={(checked) => updateDaySettings(day, {
                            isTableOrderingAllowed: checked
                          })}
                        />
                      </div>
                      {settings.isTableOrderingAllowed && (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={settings.tableOrdering.useDifferentTimes}
                              onCheckedChange={(checked) => updateDaySettings(day, {
                                tableOrdering: { ...settings.tableOrdering, useDifferentTimes: checked }
                              })}
                            />
                            <Label>Use different times for table ordering</Label>
                          </div>
                          
                          {settings.tableOrdering.useDifferentTimes && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`${day}-table-start`}>Start Time</Label>
                                <Input
                                  id={`${day}-table-start`}
                                  type="time"
                                  value={settings.tableOrdering.customTimes.start}
                                  onChange={(e) => updateDaySettings(day, {
                                    tableOrdering: {
                                      ...settings.tableOrdering,
                                      customTimes: { ...settings.tableOrdering.customTimes, start: e.target.value }
                                    }
                                  })}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`${day}-table-end`}>End Time</Label>
                                <Input
                                  id={`${day}-table-end`}
                                  type="time"
                                  value={settings.tableOrdering.customTimes.end}
                                  onChange={(e) => updateDaySettings(day, {
                                    tableOrdering: {
                                      ...settings.tableOrdering,
                                      customTimes: { ...settings.tableOrdering.customTimes, end: e.target.value }
                                    }
                                  })}
                                />
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <Label htmlFor={`${day}-table-lead`}>Lead Time (minutes)</Label>
                            <Input
                              id={`${day}-table-lead`}
                              type="number"
                              min="0"
                              value={settings.tableOrdering.leadTime}
                              onChange={(e) => updateDaySettings(day, {
                                tableOrdering: { ...settings.tableOrdering, leadTime: parseInt(e.target.value) || 0 }
                              })}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${day}-table-display`}>Displayed Time</Label>
                            <Input
                              id={`${day}-table-display`}
                              type="time"
                              value={settings.tableOrdering.displayedTime}
                              onChange={(e) => updateDaySettings(day, {
                                tableOrdering: { ...settings.tableOrdering, displayedTime: e.target.value }
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 