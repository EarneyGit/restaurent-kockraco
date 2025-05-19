"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface DaySettings {
  isCollectionAllowed: boolean
  isDeliveryAllowed: boolean
  isTableOrderingAllowed: boolean
  defaultTimes: {
    start: string
    end: string
  }
  collection: {
    leadTime: number
    displayedTime: string
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

interface OrderingTimes {
  [key: string]: DaySettings
}

const defaultDaySettings: DaySettings = {
  isCollectionAllowed: false,
  isDeliveryAllowed: false,
  isTableOrderingAllowed: false,
  defaultTimes: {
    start: "11:45",
    end: "21:50"
  },
  collection: {
    leadTime: 20,
    displayedTime: "12:10"
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

export default function OrderingTimesPage() {
  const router = useRouter()
  const [expandedDay, setExpandedDay] = useState<string | null>("monday")
  const [orderingTimes, setOrderingTimes] = useState<OrderingTimes>({
    monday: { ...defaultDaySettings },
    tuesday: { ...defaultDaySettings },
    wednesday: { ...defaultDaySettings },
    thursday: { ...defaultDaySettings },
    friday: { ...defaultDaySettings },
    saturday: { ...defaultDaySettings },
    sunday: { ...defaultDaySettings }
  })

  const handleDayToggle = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day)
  }

  const updateDaySettings = (day: string, updates: Partial<DaySettings>) => {
    setOrderingTimes(prev => {
      const currentSettings = prev[day]
      
      // Handle delivery customTimes
      if (updates.delivery?.customTimes) {
        updates.delivery = {
          ...currentSettings.delivery,
          ...updates.delivery,
          customTimes: {
            ...currentSettings.delivery.customTimes,
            ...updates.delivery.customTimes
          }
        }
      }
      
      // Handle table ordering customTimes
      if (updates.tableOrdering?.customTimes) {
        updates.tableOrdering = {
          ...currentSettings.tableOrdering,
          ...updates.tableOrdering,
          customTimes: {
            ...currentSettings.tableOrdering.customTimes,
            ...updates.tableOrdering.customTimes
          }
        }
      }
      
      return {
        ...prev,
        [day]: {
          ...currentSettings,
          ...updates
        }
      }
    })
  }

  const navigateToClosedDates = () => {
    router.push("/settings/ordering-times/closed-dates")
  }

  const navigateToRestrictions = () => {
    router.push("/settings/ordering-times/restrictions")
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
            
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              Save Changes
            </Button>
                    </div>
          
          <div className="space-y-4">
            {Object.entries(orderingTimes).map(([day, settings]) => (
              <div key={day} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => handleDayToggle(day)}
                >
                  <h3 className="font-medium capitalize">{day}</h3>
                  <div className="flex items-center gap-2">
                    {settings.defaultTimes && (
                      <span className="text-sm text-gray-500">
                        Col: {settings.defaultTimes.start}-{settings.defaultTimes.end}
                      </span>
                    )}
                    {expandedDay === day ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
                
                <div className={cn(
                  "border-t transition-all",
                  expandedDay === day ? "block" : "hidden"
                )}>
                  <div className="p-4 space-y-6">
                    {/* Default Order Times */}
                    <div className="space-y-4">
                      <Label>Default Order Times</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={settings.defaultTimes.start}
                          onChange={(e) => updateDaySettings(day, {
                            defaultTimes: {
                              ...settings.defaultTimes,
                              start: e.target.value
                            }
                          })}
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={settings.defaultTimes.end}
                          onChange={(e) => updateDaySettings(day, {
                            defaultTimes: {
                              ...settings.defaultTimes,
                              end: e.target.value
                            }
                          })}
                        />
                </div>
              </div>
              
                    {/* Collection Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Collection Ordering</Label>
                        <Switch
                          checked={settings.isCollectionAllowed}
                          onCheckedChange={(checked) => updateDaySettings(day, {
                            isCollectionAllowed: checked
                          })}
                        />
                </div>
                
                      {settings.isCollectionAllowed && (
                        <div className="space-y-4 pl-4">
                          <div className="grid grid-cols-2 gap-4">
                  <div>
                              <Label>Collection Lead Times</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={settings.collection.leadTime}
                                  onChange={(e) => updateDaySettings(day, {
                                    collection: {
                                      ...settings.collection,
                                      leadTime: parseInt(e.target.value) || 0
                                    }
                                  })}
                                />
                                <span>mins</span>
                    </div>
                  </div>
                  <div>
                              <Label>Displayed Times</Label>
                              <Input
                                type="time"
                                value={settings.collection.displayedTime}
                                onChange={(e) => updateDaySettings(day, {
                                  collection: {
                                    ...settings.collection,
                                    displayedTime: e.target.value
                                  }
                                })}
                              />
                  </div>
                </div>
                        </div>
                      )}
              </div>
              
                    {/* Delivery Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Delivery Ordering</Label>
                        <Switch
                          checked={settings.isDeliveryAllowed}
                          onCheckedChange={(checked) => updateDaySettings(day, {
                            isDeliveryAllowed: checked
                          })}
                    />
                  </div>

                      {settings.isDeliveryAllowed && (
                        <div className="space-y-4 pl-4">
                          <div className="flex items-center justify-between">
                            <Label>Use Different Times to Above</Label>
                            <Switch
                              checked={settings.delivery.useDifferentTimes}
                              onCheckedChange={(checked) => updateDaySettings(day, {
                                delivery: {
                                  ...settings.delivery,
                                  useDifferentTimes: checked
                                }
                              })}
                            />
                </div>
                
                          {settings.delivery.useDifferentTimes && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={settings.delivery.customTimes?.start || settings.defaultTimes.start}
                                onChange={(e) => updateDaySettings(day, {
                                  delivery: {
                                    ...settings.delivery,
                                    customTimes: {
                                      ...settings.delivery.customTimes,
                                      start: e.target.value
                                    }
                                  }
                                })}
                              />
                              <span>to</span>
                              <Input
                                type="time"
                                value={settings.delivery.customTimes?.end || settings.defaultTimes.end}
                                onChange={(e) => updateDaySettings(day, {
                                  delivery: {
                                    ...settings.delivery,
                                    customTimes: {
                                      ...settings.delivery.customTimes,
                                      end: e.target.value
                                    }
                                  }
                                })}
                    />
                  </div>
                          )}
                
                          <div className="grid grid-cols-2 gap-4">
                  <div>
                              <Label>Delivery Lead Times</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={settings.delivery.leadTime}
                                  onChange={(e) => updateDaySettings(day, {
                                    delivery: {
                                      ...settings.delivery,
                                      leadTime: parseInt(e.target.value) || 0
                                    }
                                  })}
                                />
                                <span>mins</span>
                    </div>
                  </div>
                  <div>
                              <Label>Displayed Times</Label>
                              <Input
                                type="time"
                                value={settings.delivery.displayedTime}
                                onChange={(e) => updateDaySettings(day, {
                                  delivery: {
                                    ...settings.delivery,
                                    displayedTime: e.target.value
                                  }
                                })}
                              />
                  </div>
                </div>
              </div>
                      )}
          </div>
          
                    {/* Table Ordering Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Table Ordering</Label>
                        <Switch
                          checked={settings.isTableOrderingAllowed}
                          onCheckedChange={(checked) => updateDaySettings(day, {
                            isTableOrderingAllowed: checked
                          })}
                        />
          </div>
          
                      {settings.isTableOrderingAllowed && (
                        <div className="space-y-4 pl-4">
                          <div className="flex items-center justify-between">
                            <Label>Use Different Times to Above</Label>
                            <Switch
                              checked={settings.tableOrdering.useDifferentTimes}
                              onCheckedChange={(checked) => updateDaySettings(day, {
                                tableOrdering: {
                                  ...settings.tableOrdering,
                                  useDifferentTimes: checked
                                }
                              })}
                            />
          </div>
          
                          {settings.tableOrdering.useDifferentTimes && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={settings.tableOrdering.customTimes?.start || settings.defaultTimes.start}
                                onChange={(e) => updateDaySettings(day, {
                                  tableOrdering: {
                                    ...settings.tableOrdering,
                                    customTimes: {
                                      ...settings.tableOrdering.customTimes,
                                      start: e.target.value
                                    }
                                  }
                                })}
                              />
                              <span>to</span>
                              <Input
                                type="time"
                                value={settings.tableOrdering.customTimes?.end || settings.defaultTimes.end}
                                onChange={(e) => updateDaySettings(day, {
                                  tableOrdering: {
                                    ...settings.tableOrdering,
                                    customTimes: {
                                      ...settings.tableOrdering.customTimes,
                                      end: e.target.value
                                    }
                                  }
                                })}
                              />
              </div>
                          )}
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