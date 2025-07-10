"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, Eye, Loader2, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { orderingTimesService, type OrderingTimes, type DaySettings, type RestrictionDaySettings } from "@/services/ordering-times.service"
import { toast } from "sonner"

// Days of the week in order
const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" }
] as const

// Default settings for a day
const defaultDaySettings: DaySettings = {
  isCollectionAllowed: false,
  isDeliveryAllowed: false,
  isTableOrderingAllowed: false,
  defaultTimes: {
    start: "11:45",
    end: "21:50"
  },
  breakTime: {
    enabled: false,
    start: "15:00",
    end: "16:00"
  },
  collection: {
    useDifferentTimes: false,
    leadTime: 20,
    displayedTime: "12:10",
    customTimes: {
      start: "11:45",
      end: "21:50"
    }
  },
  delivery: {
    useDifferentTimes: false,
    leadTime: 45,
    displayedTime: "12:30",
    customTimes: {
      start: "11:45",
      end: "21:50"
    }
  },
  tableOrdering: {
    useDifferentTimes: false,
    leadTime: 0,
    displayedTime: "",
    customTimes: {
      start: "11:45",
      end: "21:50"
    }
  }
}

// Default weekly schedule
const defaultWeeklySchedule = {
  monday: { ...defaultDaySettings },
  tuesday: { ...defaultDaySettings },
  wednesday: { ...defaultDaySettings },
  thursday: { ...defaultDaySettings },
  friday: { ...defaultDaySettings },
  saturday: { ...defaultDaySettings },
  sunday: { ...defaultDaySettings }
}

// Default restriction day settings
const defaultRestrictionDaySettings: RestrictionDaySettings = {
  enabled: false,
  orderTotal: 0,
  windowSize: 5
}

// Default ordering times
const defaultOrderingTimes: OrderingTimes = {
  _id: '',
  branchId: '',
  weeklySchedule: defaultWeeklySchedule,
  closedDates: [],
  restrictions: {
    monday: defaultRestrictionDaySettings,
    tuesday: defaultRestrictionDaySettings,
    wednesday: defaultRestrictionDaySettings,
    thursday: defaultRestrictionDaySettings,
    friday: defaultRestrictionDaySettings,
    saturday: defaultRestrictionDaySettings,
    sunday: defaultRestrictionDaySettings
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

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
      // If no data exists, use default schedule
      if (!response.data || !response.data.weeklySchedule) {
        setOrderingTimes(defaultOrderingTimes)
      } else {
        setOrderingTimes(response.data)
      }
    } catch (error) {
      console.error('Error loading ordering times:', error)
      toast.error('Failed to load ordering times')
      // Set default schedule on error
      setOrderingTimes(defaultOrderingTimes)
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
      
      // Get current day settings or use default settings if not found
      const currentSettings = orderingTimes.weeklySchedule[day as keyof typeof orderingTimes.weeklySchedule] || { ...defaultDaySettings }
      
      // Create a new settings object with all required fields
      const updatedSettings: DaySettings = {
        isCollectionAllowed: currentSettings.isCollectionAllowed || false,
        isDeliveryAllowed: currentSettings.isDeliveryAllowed || false,
        isTableOrderingAllowed: currentSettings.isTableOrderingAllowed || false,
        defaultTimes: {
          start: currentSettings.defaultTimes?.start || "11:45",
          end: currentSettings.defaultTimes?.end || "21:50"
        },
        breakTime: {
          enabled: currentSettings.breakTime?.enabled || false,
          start: currentSettings.breakTime?.start || "15:00",
          end: currentSettings.breakTime?.end || "16:00"
        },
        collection: {
          useDifferentTimes: currentSettings.collection?.useDifferentTimes || false,
          leadTime: currentSettings.collection?.leadTime || 20,
          displayedTime: currentSettings.collection?.displayedTime || "12:10",
          customTimes: {
            start: currentSettings.collection?.customTimes?.start || "11:45",
            end: currentSettings.collection?.customTimes?.end || "21:50"
          }
        },
        delivery: {
          useDifferentTimes: currentSettings.delivery?.useDifferentTimes || false,
          leadTime: currentSettings.delivery?.leadTime || 45,
          displayedTime: currentSettings.delivery?.displayedTime || "12:30",
          customTimes: {
            start: currentSettings.delivery?.customTimes?.start || "11:45",
            end: currentSettings.delivery?.customTimes?.end || "21:50"
          }
        },
        tableOrdering: {
          useDifferentTimes: currentSettings.tableOrdering?.useDifferentTimes || false,
          leadTime: currentSettings.tableOrdering?.leadTime || 0,
          displayedTime: currentSettings.tableOrdering?.displayedTime || "",
          customTimes: {
            start: currentSettings.tableOrdering?.customTimes?.start || "11:45",
            end: currentSettings.tableOrdering?.customTimes?.end || "21:50"
          }
        }
      }

      // Apply the updates
      const finalSettings: DaySettings = {
        ...updatedSettings,
        ...updates,
        // Handle nested objects properly
        defaultTimes: {
          ...updatedSettings.defaultTimes,
          ...(updates.defaultTimes || {})
        },
        breakTime: {
          ...updatedSettings.breakTime,
          ...(updates.breakTime || {})
        },
        collection: {
          ...updatedSettings.collection,
          ...(updates.collection || {})
        },
        delivery: {
          ...updatedSettings.delivery,
          ...(updates.delivery || {}),
          customTimes: {
            ...updatedSettings.delivery.customTimes,
            ...(updates.delivery?.customTimes || {})
          }
        },
        tableOrdering: {
          ...updatedSettings.tableOrdering,
          ...(updates.tableOrdering || {}),
          customTimes: {
            ...updatedSettings.tableOrdering.customTimes,
            ...(updates.tableOrdering?.customTimes || {})
          }
        }
      }

      // Update via API
      await orderingTimesService.updateDaySchedule(day, finalSettings)
      
      // Update local state
      setOrderingTimes(prev => {
        if (!prev) return prev
        return {
          ...prev,
          weeklySchedule: {
            ...prev.weeklySchedule,
            [day]: finalSettings
          }
        }
      })

      toast.success(`${orderingTimesService.getDayDisplayName(day)} settings updated`)
      
      // Refresh the data to ensure we have the latest state
      setTimeout(() => {
        loadOrderingTimes()
      }, 500)
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
      
      // Refresh the data to ensure we have the latest state
      setTimeout(() => {
        loadOrderingTimes()
      }, 500)
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

  // if (loading) {
  //   return (
  //     <PageLayout>
  //       <div className="flex items-center justify-center min-h-screen">
  //         <Loader2 className="h-8 w-8 animate-spin mr-2" />
  //         Loading ordering times...
  //       </div>
  //     </PageLayout>
  //   )
  // }

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
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Section - Title and Controls */}
            <div className="lg:col-span-4">
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
                    className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                    onClick={navigateToClosedDates}
                  >
                    Closed Dates
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                    onClick={navigateToRestrictions}
                  >
                    Restrictions
                  </Button>
                </div>
                
                <Button 
                  onClick={handleSaveAllChanges}
                  disabled={saving}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
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
            </div>

            {/* Right Section - Days Configuration */}
            <div className="lg:col-span-8">
              <div className="space-y-4">
                {DAYS_OF_WEEK.map(({ key: day, label }) => {
                  const settings = orderingTimes?.weeklySchedule?.[day] || defaultWeeklySchedule[day]
                  return (
                    <div key={day} className="bg-white rounded-lg shadow-sm">
                      <div 
                        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleDayToggle(day)}
                      >
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">{label}</h3>
                            <div className="flex items-center space-x-4">
                              <div className="text-sm text-gray-500">
                                <div>Col: {orderingTimesService.formatTimeRange(settings.defaultTimes.start, settings.defaultTimes.end)}</div>
                                {settings.isDeliveryAllowed && settings.delivery.useDifferentTimes && (
                                  <div>Del: {orderingTimesService.formatTimeRange(settings.delivery.customTimes.start, settings.delivery.customTimes.end)}</div>
                                )}
                              </div>
                              <button className="text-gray-400 hover:text-gray-600">
                                {expandedDay === day ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={cn(
                        "border-t",
                        expandedDay === day ? "block" : "hidden"
                      )}>
                        <div className="p-6 space-y-6">
                          {/* Default Order Times */}
                          <div>
                            <h4 className="font-medium mb-3">Default Order Times</h4>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label htmlFor={`${day}-start`}>Start Time</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id={`${day}-start`}
                                    type="time"
                                    value={settings.defaultTimes.start}
                                    onChange={(e) => updateDaySettings(day, {
                                      defaultTimes: { ...settings.defaultTimes, start: e.target.value }
                                    })}
                                    className="w-32"
                                  />
                                  <span className="text-gray-500 self-center">to</span>
                                  <Input
                                    id={`${day}-end`}
                                    type="time"
                                    value={settings.defaultTimes.end}
                                    onChange={(e) => updateDaySettings(day, {
                                      defaultTimes: { ...settings.defaultTimes, end: e.target.value }
                                    })}
                                    className="w-32"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>Break Time</Label>
                                <div className="flex items-center gap-4">
                                  <div className="flex gap-2 items-center">
                                    <Input
                                      type="time"
                                      value={settings.breakTime?.start || "15:00"}
                                      onChange={(e) => updateDaySettings(day, {
                                        breakTime: {
                                          enabled: true,
                                          start: e.target.value,
                                          end: settings.breakTime?.end || "16:00"
                                        }
                                      })}
                                      className="w-32"
                                    />
                                    <span className="text-gray-500">to</span>
                                    <Input
                                      type="time"
                                      value={settings.breakTime?.end || "16:00"}
                                      onChange={(e) => updateDaySettings(day, {
                                        breakTime: {
                                          enabled: true,
                                          start: settings.breakTime?.start || "15:00",
                                          end: e.target.value
                                        }
                                      })}
                                      className="w-32"
                                    />
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    className="text-gray-600"
                                    onClick={() => updateDaySettings(day, {
                                      breakTime: {
                                        enabled: false,
                                        start: "15:00",
                                        end: "16:00"
                                      }
                                    })}
                                  >
                                    Remove Break
                                  </Button>
                                  <Info className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Collection Ordering */}
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">Collection Ordering</h4>
                              <Switch
                                checked={settings.isCollectionAllowed}
                                onCheckedChange={(checked) => updateDaySettings(day, {
                                  isCollectionAllowed: checked
                                })}
                              />
                            </div>
                            {settings.isCollectionAllowed && (
                              <>
                                <div className="flex items-center space-x-2 mb-4">
                                  <Switch
                                    checked={settings.collection.useDifferentTimes}
                                    onCheckedChange={(checked) => updateDaySettings(day, {
                                      collection: { ...settings.collection, useDifferentTimes: checked }
                                    })}
                                  />
                                  <Label>Use Different Times to Above</Label>
                                </div>
                                {settings.collection.useDifferentTimes && (
                                  <div className="mb-4 p-3 bg-gray-50 rounded">
                                    <Label className="text-sm font-medium mb-2 block">Collection Times</Label>
                                    <div className="flex gap-2 items-center">
                                      <Input
                                        type="time"
                                        value={settings.collection.customTimes?.start || "11:45"}
                                        onChange={(e) => updateDaySettings(day, {
                                          collection: {
                                            ...settings.collection,
                                            customTimes: {
                                              ...settings.collection.customTimes,
                                              start: e.target.value,
                                              end: settings.collection.customTimes?.end || "21:50"
                                            }
                                          }
                                        })}
                                        className="w-32"
                                      />
                                      <span className="text-gray-500">to</span>
                                      <Input
                                        type="time"
                                        value={settings.collection.customTimes?.end || "21:50"}
                                        onChange={(e) => updateDaySettings(day, {
                                          collection: {
                                            ...settings.collection,
                                            customTimes: {
                                              ...settings.collection.customTimes,
                                              start: settings.collection.customTimes?.start || "11:45",
                                              end: e.target.value
                                            }
                                          }
                                        })}
                                        className="w-32"
                                      />
                                    </div>
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <Label>Collection Lead Times <span className="text-gray-500">(Only in 5-minute intervals)</span></Label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Input
                                        type="number"
                                        min="0"
                                        value={settings.collection.leadTime}
                                        onChange={(e) => updateDaySettings(day, {
                                          collection: { ...settings.collection, leadTime: parseInt(e.target.value) || 0 }
                                        })}
                                        className="w-20"
                                      />
                                      <span className="text-gray-500">mins</span>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Displayed Times</Label>
                                    <Input
                                      type="time"
                                      value={settings.collection.displayedTime}
                                      onChange={(e) => updateDaySettings(day, {
                                        collection: { ...settings.collection, displayedTime: e.target.value }
                                      })}
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Delivery Ordering */}
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">Delivery Ordering</h4>
                              <Switch
                                checked={settings.isDeliveryAllowed}
                                onCheckedChange={(checked) => updateDaySettings(day, {
                                  isDeliveryAllowed: checked
                                })}
                              />
                            </div>
                            {settings.isDeliveryAllowed && (
                              <>
                                <div className="flex items-center space-x-2 mb-4">
                                  <Switch
                                    checked={settings.delivery.useDifferentTimes}
                                    onCheckedChange={(checked) => updateDaySettings(day, {
                                      delivery: { ...settings.delivery, useDifferentTimes: checked }
                                    })}
                                  />
                                  <Label>Use Different Times to Above</Label>
                                </div>
                                {settings.delivery.useDifferentTimes && (
                                  <div className="mb-4 p-3 bg-gray-50 rounded">
                                    <Label className="text-sm font-medium mb-2 block">Delivery Times</Label>
                                    <div className="flex gap-2 items-center">
                                      <Input
                                        type="time"
                                        value={settings.delivery.customTimes?.start || "11:45"}
                                        onChange={(e) => updateDaySettings(day, {
                                          delivery: {
                                            ...settings.delivery,
                                            customTimes: {
                                              ...settings.delivery.customTimes,
                                              start: e.target.value,
                                              end: settings.delivery.customTimes?.end || "21:50"
                                            }
                                          }
                                        })}
                                        className="w-32"
                                      />
                                      <span className="text-gray-500">to</span>
                                      <Input
                                        type="time"
                                        value={settings.delivery.customTimes?.end || "21:50"}
                                        onChange={(e) => updateDaySettings(day, {
                                          delivery: {
                                            ...settings.delivery,
                                            customTimes: {
                                              ...settings.delivery.customTimes,
                                              start: settings.delivery.customTimes?.start || "11:45",
                                              end: e.target.value
                                            }
                                          }
                                        })}
                                        className="w-32"
                                      />
                                    </div>
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <Label>Delivery Lead Times <span className="text-gray-500">(Only in 5-minute intervals)</span></Label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Input
                                        type="number"
                                        min="0"
                                        value={settings.delivery.leadTime}
                                        onChange={(e) => updateDaySettings(day, {
                                          delivery: { ...settings.delivery, leadTime: parseInt(e.target.value) || 0 }
                                        })}
                                        className="w-20"
                                      />
                                      <span className="text-gray-500">mins</span>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Displayed Times</Label>
                                    <Input
                                      type="time"
                                      value={settings.delivery.displayedTime}
                                      onChange={(e) => updateDaySettings(day, {
                                        delivery: { ...settings.delivery, displayedTime: e.target.value }
                                      })}
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Table Ordering */}
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">Table Ordering</h4>
                              <Switch
                                checked={settings.isTableOrderingAllowed}
                                onCheckedChange={(checked) => updateDaySettings(day, {
                                  isTableOrderingAllowed: checked
                                })}
                              />
                            </div>
                            {settings.isTableOrderingAllowed && (
                              <>
                                <div className="flex items-center space-x-2 mb-4">
                                  <Switch
                                    checked={settings.tableOrdering.useDifferentTimes}
                                    onCheckedChange={(checked) => updateDaySettings(day, {
                                      tableOrdering: { ...settings.tableOrdering, useDifferentTimes: checked }
                                    })}
                                  />
                                  <Label>Use Different Times to Above</Label>
                                </div>
                                {settings.tableOrdering.useDifferentTimes && (
                                  <div className="mb-4 p-3 bg-gray-50 rounded">
                                    <Label className="text-sm font-medium mb-2 block">Table Ordering Times</Label>
                                    <div className="flex gap-2 items-center">
                                      <Input
                                        type="time"
                                        value={settings.tableOrdering.customTimes?.start || "11:45"}
                                        onChange={(e) => updateDaySettings(day, {
                                          tableOrdering: {
                                            ...settings.tableOrdering,
                                            customTimes: {
                                              ...settings.tableOrdering.customTimes,
                                              start: e.target.value,
                                              end: settings.tableOrdering.customTimes?.end || "21:50"
                                            }
                                          }
                                        })}
                                        className="w-32"
                                      />
                                      <span className="text-gray-500">to</span>
                                      <Input
                                        type="time"
                                        value={settings.tableOrdering.customTimes?.end || "21:50"}
                                        onChange={(e) => updateDaySettings(day, {
                                          tableOrdering: {
                                            ...settings.tableOrdering,
                                            customTimes: {
                                              ...settings.tableOrdering.customTimes,
                                              start: settings.tableOrdering.customTimes?.start || "11:45",
                                              end: e.target.value
                                            }
                                          }
                                        })}
                                        className="w-32"
                                      />
                                    </div>
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <Label>Table Ordering Lead Times</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Input
                                        type="number"
                                        min="0"
                                        value={settings.tableOrdering.leadTime}
                                        onChange={(e) => updateDaySettings(day, {
                                          tableOrdering: { ...settings.tableOrdering, leadTime: parseInt(e.target.value) || 0 }
                                        })}
                                        className="w-20"
                                      />
                                      <span className="text-gray-500">mins</span>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Displayed Times</Label>
                                    <Input
                                      type="time"
                                      value={settings.tableOrdering.displayedTime}
                                      onChange={(e) => updateDaySettings(day, {
                                        tableOrdering: { ...settings.tableOrdering, displayedTime: e.target.value }
                                      })}
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 