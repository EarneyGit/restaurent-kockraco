"use client"

import * as React from "react"
import { useState } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type RestrictionType = "None" | "Combined Total" | "Split Total"

interface DaySettings {
  enabled: boolean
  orderTotal: string
  windowSize: string
}

interface DayRestrictions {
  [key: string]: DaySettings
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

const defaultDaySettings: DaySettings = {
  enabled: false,
  orderTotal: "0",
  windowSize: "5"
}

export default function RestrictionsPage() {
  const [restrictionType, setRestrictionType] = useState<RestrictionType>("None")
  const [combinedSettings, setCombinedSettings] = useState<DayRestrictions>(
    DAYS_OF_WEEK.reduce((acc, day) => ({
      ...acc,
      [day]: { ...defaultDaySettings }
    }), {})
  )
  const [collectionSettings, setCollectionSettings] = useState<DayRestrictions>(
    DAYS_OF_WEEK.reduce((acc, day) => ({
      ...acc,
      [day]: { ...defaultDaySettings }
    }), {})
  )
  const [deliverySettings, setDeliverySettings] = useState<DayRestrictions>(
    DAYS_OF_WEEK.reduce((acc, day) => ({
      ...acc,
      [day]: { ...defaultDaySettings }
    }), {})
  )

  const updateSettings = (
    type: "combined" | "collection" | "delivery",
    day: string,
    field: keyof DaySettings,
    value: string | boolean
  ) => {
    const setterMap = {
      combined: setCombinedSettings,
      collection: setCollectionSettings,
      delivery: setDeliverySettings
    }

    setterMap[type](prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }))
  }

  const RestrictionTable = ({
    title,
    type,
    settings
  }: {
    title: string
    type: "combined" | "collection" | "delivery"
    settings: DayRestrictions
  }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-4 py-2">Day</th>
              <th className="text-left px-4 py-2">Enabled</th>
              <th className="text-left px-4 py-2">Order Total</th>
              <th className="text-left px-4 py-2">Window Size</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {DAYS_OF_WEEK.map((day) => (
              <tr key={day}>
                <td className="px-4 py-2">{day}</td>
                <td className="px-4 py-2">
                  <Switch
                    checked={settings[day].enabled}
                    onCheckedChange={(checked) => 
                      updateSettings(type, day, "enabled", checked)
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    value={settings[day].orderTotal}
                    onChange={(e) => 
                      updateSettings(type, day, "orderTotal", e.target.value)
                    }
                    className="w-24"
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    value={settings[day].windowSize}
                    onChange={(e) => 
                      updateSettings(type, day, "windowSize", e.target.value)
                    }
                    className="w-24"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <PageLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-medium mb-4">Order Restrictions</h1>
          
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="space-y-4">
              <div>
                <Label>Restriction Type</Label>
                <select 
                  value={restrictionType} 
                  onChange={(e) => setRestrictionType(e.target.value as RestrictionType)}
                  className="w-full h-10 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="None">None</option>
                  <option value="Combined Total">Combined Total</option>
                  <option value="Split Total">Split Total</option>
                </select>
              </div>

              {restrictionType === "Combined Total" && (
                <RestrictionTable
                  title="Combined"
                  type="combined"
                  settings={combinedSettings}
                />
              )}

              {restrictionType === "Split Total" && (
                <div className="space-y-6">
                  <RestrictionTable
                    title="Collection"
                    type="collection"
                    settings={collectionSettings}
                  />
                  <RestrictionTable
                    title="Delivery"
                    type="delivery"
                    settings={deliverySettings}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-start">
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              Save
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 