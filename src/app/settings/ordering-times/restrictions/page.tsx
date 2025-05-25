"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { orderingTimesService, type OrderingRestrictions, type RestrictionDaySettings } from "@/services/ordering-times.service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const DAYS_OF_WEEK = [
  { key: "sunday", label: "Sunday" },
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" }
]

export default function RestrictionsPage() {
  const [restrictions, setRestrictions] = useState<OrderingRestrictions | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load restrictions on component mount
  useEffect(() => {
    loadRestrictions()
  }, [])

  const loadRestrictions = async () => {
    try {
      setLoading(true)
      const response = await orderingTimesService.getRestrictions()
      setRestrictions(response.data)
    } catch (error) {
      console.error('Error loading restrictions:', error)
      toast.error('Failed to load restrictions')
      // Set default restrictions if loading fails
      setRestrictions(getDefaultRestrictions())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultRestrictions = (): OrderingRestrictions => {
    const defaultDay = orderingTimesService.getDefaultRestrictionSettings()
    return {
      monday: { ...defaultDay },
      tuesday: { ...defaultDay },
      wednesday: { ...defaultDay },
      thursday: { ...defaultDay },
      friday: { ...defaultDay },
      saturday: { ...defaultDay },
      sunday: { ...defaultDay }
    }
  }

  const updateDayRestriction = (
    dayKey: keyof OrderingRestrictions,
    field: keyof RestrictionDaySettings,
    value: string | boolean | number
  ) => {
    if (!restrictions) return

    setRestrictions(prev => ({
      ...prev!,
      [dayKey]: {
        ...prev![dayKey],
        [field]: field === 'enabled' ? value : Number(value)
      }
    }))
  }

  const handleSave = async () => {
    if (!restrictions) {
      toast.error('No restrictions data to save')
      return
    }

    try {
      setSaving(true)
      await orderingTimesService.updateRestrictions(restrictions)
      toast.success('Restrictions updated successfully')
    } catch (error) {
      console.error('Error saving restrictions:', error)
      toast.error('Failed to save restrictions')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          Loading restrictions...
        </div>
      </PageLayout>
    )
  }

  if (!restrictions) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Failed to load restrictions</p>
            <Button onClick={loadRestrictions}>Retry</Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-medium mb-4">Order Restrictions</h1>
          
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <p className="text-gray-600 mb-4">
              Configure order restrictions for each day of the week. When enabled, customers will be limited 
              to the specified order total within the defined time window.
            </p>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-3 font-medium">Day</th>
                    <th className="text-left px-4 py-3 font-medium">Enabled</th>
                    <th className="text-left px-4 py-3 font-medium">Order Total (£)</th>
                    <th className="text-left px-4 py-3 font-medium">Window Size (min)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {DAYS_OF_WEEK.map((day) => (
                    <tr key={day.key} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{day.label}</td>
                      <td className="px-4 py-3">
                        <Switch
                          checked={restrictions[day.key as keyof OrderingRestrictions].enabled}
                          onCheckedChange={(checked) => 
                            updateDayRestriction(day.key as keyof OrderingRestrictions, "enabled", checked)
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={restrictions[day.key as keyof OrderingRestrictions].orderTotal}
                          onChange={(e) => 
                            updateDayRestriction(day.key as keyof OrderingRestrictions, "orderTotal", e.target.value)
                          }
                          className="w-32"
                          disabled={!restrictions[day.key as keyof OrderingRestrictions].enabled}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          min="1"
                          value={restrictions[day.key as keyof OrderingRestrictions].windowSize}
                          onChange={(e) => 
                            updateDayRestriction(day.key as keyof OrderingRestrictions, "windowSize", e.target.value)
                          }
                          className="w-32"
                          disabled={!restrictions[day.key as keyof OrderingRestrictions].enabled}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-start">
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Restrictions'
              )}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 