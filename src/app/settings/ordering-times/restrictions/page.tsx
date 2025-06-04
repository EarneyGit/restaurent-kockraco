"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
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

const RESTRICTION_TYPES = [
  { value: "None", label: "None" },
  { value: "Combined Total", label: "Combined Total" },
  { value: "Split Total", label: "Split Total" }
]

export default function RestrictionsPage() {
  const [restrictions, setRestrictions] = useState<OrderingRestrictions | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [restrictionType, setRestrictionType] = useState<'None' | 'Combined Total' | 'Split Total'>('None')

  // Helper function to get default restrictions
  const getDefaultRestrictions = (): OrderingRestrictions => {
    const defaultDay = orderingTimesService.getDefaultRestrictionSettings();
    
    // Create a default days object
    const defaultDays = {
      sunday: { ...defaultDay },
      monday: { ...defaultDay },
      tuesday: { ...defaultDay },
      wednesday: { ...defaultDay },
      thursday: { ...defaultDay },
      friday: { ...defaultDay },
      saturday: { ...defaultDay }
    };
    
    return {
      type: 'None',
      combined: { ...defaultDays },
      collection: { ...defaultDays },
      delivery: { ...defaultDays }
    };
  }

  // Load restrictions on component mount
  useEffect(() => {
    loadRestrictions()
  }, [])

  const loadRestrictions = async () => {
    try {
      setLoading(true);
      const response = await orderingTimesService.getRestrictions();
      
      // Check if we have valid restrictions data
      if (response.data && Object.keys(response.data).length > 0) {
        // Make sure all days are present, fill in any missing days with defaults
        const defaultSettings = getDefaultRestrictions();
        const completeRestrictions = { ...defaultSettings };
        
        // Copy over any existing settings
        if (response.data.type) {
          completeRestrictions.type = response.data.type;
          setRestrictionType(response.data.type);
        }
        
        // Copy combined settings
        if (response.data.combined) {
          completeRestrictions.combined = {
            ...defaultSettings.combined,
            ...response.data.combined
          };
        }
        
        // Copy collection settings
        if (response.data.collection) {
          completeRestrictions.collection = {
            ...defaultSettings.collection,
            ...response.data.collection
          };
        }
        
        // Copy delivery settings
        if (response.data.delivery) {
          completeRestrictions.delivery = {
            ...defaultSettings.delivery,
            ...response.data.delivery
          };
        }
        
        setRestrictions(completeRestrictions);
      } else {
        // Set default restrictions if data is missing or empty
        const defaultRestrictions = getDefaultRestrictions();
        setRestrictions(defaultRestrictions);
        setRestrictionType(defaultRestrictions.type);
      }
    } catch (error) {
      console.error('Error loading restrictions:', error);
      toast.error('Failed to load restrictions');
      // Set default restrictions if loading fails
      const defaultRestrictions = getDefaultRestrictions();
      setRestrictions(defaultRestrictions);
      setRestrictionType(defaultRestrictions.type);
    } finally {
      setLoading(false);
    }
  }

  const updateDayRestriction = (
    dayKey: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
    field: keyof RestrictionDaySettings,
    value: string | boolean | number,
    section: 'combined' | 'collection' | 'delivery' = 'combined'
  ) => {
    if (!restrictions) return;
    
    setRestrictions(prev => {
      if (!prev) return prev;
      
      // Create a deep copy of the restrictions
      const updated = { ...prev };
      
      // Update the specific field for the specific day in the specific section
      updated[section] = {
        ...updated[section],
        [dayKey]: {
          ...updated[section][dayKey],
          [field]: field === 'enabled' ? value : Number(value)
        }
      };
      
      return updated;
    });
  };

  const handleRestrictionTypeChange = (value: 'None' | 'Combined Total' | 'Split Total') => {
    setRestrictionType(value);
    
    if (restrictions) {
      setRestrictions(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          type: value
        };
      });
    }
  };

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
            <div className="mb-4">
              <Label htmlFor="restriction-behavior" className="text-base font-medium mb-2 block">
                Restriction Behaviour
              </Label>
              <Select
                value={restrictionType}
                onValueChange={(value) => handleRestrictionTypeChange(value as 'None' | 'Combined Total' | 'Split Total')}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select restriction behavior" />
                </SelectTrigger>
                <SelectContent>
                  {RESTRICTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {restrictionType !== 'None' && (
              <p className="text-gray-600 mb-4">
                Configure order restrictions for each day of the week. When enabled, customers will be limited 
                to the specified order total within the defined time window.
              </p>
            )}
            
            {/* Combined Total Restrictions */}
            {restrictionType === 'Combined Total' && (
              <div className="mt-6">
                <h2 className="text-lg font-medium mb-3">Combined</h2>
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
                              checked={restrictions.combined[day.key as keyof typeof restrictions.combined]?.enabled || false}
                              onCheckedChange={(checked) => 
                                updateDayRestriction(day.key as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', "enabled", checked, 'combined')
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={restrictions.combined[day.key as keyof typeof restrictions.combined]?.orderTotal || 0}
                              onChange={(e) => 
                                updateDayRestriction(day.key as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', "orderTotal", e.target.value, 'combined')
                              }
                              className="w-32"
                              disabled={!restrictions.combined[day.key as keyof typeof restrictions.combined]?.enabled}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              min="1"
                              value={restrictions.combined[day.key as keyof typeof restrictions.combined]?.windowSize || 5}
                              onChange={(e) => 
                                updateDayRestriction(day.key as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', "windowSize", e.target.value, 'combined')
                              }
                              className="w-32"
                              disabled={!restrictions.combined[day.key as keyof typeof restrictions.combined]?.enabled}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Split Total Restrictions */}
            {restrictionType === 'Split Total' && (
              <>
                {/* Collection Restrictions */}
                <div className="mt-6">
                  <h2 className="text-lg font-medium mb-3">Collection</h2>
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
                                checked={restrictions.collection[day.key as keyof typeof restrictions.collection]?.enabled || false}
                                onCheckedChange={(checked) => 
                                  updateDayRestriction(day.key as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', "enabled", checked, 'collection')
                                }
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={restrictions.collection[day.key as keyof typeof restrictions.collection]?.orderTotal || 0}
                                onChange={(e) => 
                                  updateDayRestriction(day.key as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', "orderTotal", e.target.value, 'collection')
                                }
                                className="w-32"
                                disabled={!restrictions.collection[day.key as keyof typeof restrictions.collection]?.enabled}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                type="number"
                                min="1"
                                value={restrictions.collection[day.key as keyof typeof restrictions.collection]?.windowSize || 5}
                                onChange={(e) => 
                                  updateDayRestriction(day.key as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', "windowSize", e.target.value, 'collection')
                                }
                                className="w-32"
                                disabled={!restrictions.collection[day.key as keyof typeof restrictions.collection]?.enabled}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Delivery Restrictions */}
                <div className="mt-6">
                  <h2 className="text-lg font-medium mb-3">Delivery</h2>
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
                                checked={restrictions.delivery[day.key as keyof typeof restrictions.delivery]?.enabled || false}
                                onCheckedChange={(checked) => 
                                  updateDayRestriction(day.key as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', "enabled", checked, 'delivery')
                                }
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={restrictions.delivery[day.key as keyof typeof restrictions.delivery]?.orderTotal || 0}
                                onChange={(e) => 
                                  updateDayRestriction(day.key as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', "orderTotal", e.target.value, 'delivery')
                                }
                                className="w-32"
                                disabled={!restrictions.delivery[day.key as keyof typeof restrictions.delivery]?.enabled}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                type="number"
                                min="1"
                                value={restrictions.delivery[day.key as keyof typeof restrictions.delivery]?.windowSize || 5}
                                onChange={(e) => 
                                  updateDayRestriction(day.key as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', "windowSize", e.target.value, 'delivery')
                                }
                                className="w-32"
                                disabled={!restrictions.delivery[day.key as keyof typeof restrictions.delivery]?.enabled}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
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