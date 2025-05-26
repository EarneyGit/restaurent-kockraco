'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ImageUpload } from '@/components/ui/image-upload'
import { Category } from '@/types/menu'
import { toast } from 'react-hot-toast'
import api from '@/lib/axios'

interface EditCategoryModalProps {
  category: Category
  open: boolean
  onClose: () => void
  onSave: (category: Category) => void
}

type TabType = 'settings' | 'availability' | 'printers'
type AvailabilityOption = 'All Day' | 'Specific Times' | 'Not Available'

interface DayAvailability {
  type: AvailabilityOption
  startTime: string | null
  endTime: string | null
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
] as const

const AVAILABILITY_OPTIONS: AvailabilityOption[] = [
  'All Day',
  'Specific Times',
  'Not Available'
]

const PRINTERS = [
  'Admin user (P1)',
  'Kitchen (P2)',
  'Bar (P3)'
] as const

export function EditCategoryModal({
  category,
  open,
  onClose,
  onSave,
}: EditCategoryModalProps) {
  const [currentTab, setCurrentTab] = useState<TabType>('settings')
  const [formData, setFormData] = useState<Category>(category)
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | undefined>(undefined)

  // Initialize form data when category changes
  useEffect(() => {
    console.log('useEffect triggered with category:', category)
    console.log('Modal open state:', open)
    
    if (category && open) {
      console.log('Processing category availability data:', category.availability)
      console.log('Category object keys:', Object.keys(category))
      
      // Process availability data to ensure proper structure
      const processedAvailability: Record<string, DayAvailability> = {}
      
      DAYS_OF_WEEK.forEach(day => {
        console.log(`Checking availability for ${day}:`, category.availability?.[day])
        
        if (category.availability && category.availability[day]) {
          const dayData = category.availability[day]
          console.log(`Processing ${day}:`, dayData, 'Type:', typeof dayData)
          
          // Handle both old format (string) and new format (object)
          if (typeof dayData === 'string') {
            // Old format: just a string like "All Day" or "Specific Times"
            console.log(`${day} - Old format (string):`, dayData)
            processedAvailability[day] = {
              type: dayData as AvailabilityOption,
              startTime: null,
              endTime: null
            }
          } else if (typeof dayData === 'object' && dayData !== null) {
            // New format: object with type, startTime, endTime
            console.log(`${day} - New format (object):`, dayData)
            processedAvailability[day] = {
              type: (dayData as any).type || 'All Day',
              startTime: (dayData as any).startTime || null,
              endTime: (dayData as any).endTime || null
            }
          } else {
            // Fallback for any other case
            console.log(`${day} - Fallback case:`, dayData)
            processedAvailability[day] = {
              type: 'All Day',
              startTime: null,
              endTime: null
            }
          }
        } else {
          // No data for this day, set default
          console.log(`${day} - No data, setting default`)
          processedAvailability[day] = {
            type: 'All Day',
            startTime: null,
            endTime: null
          }
        }
      })

      console.log('Final processed availability data:', processedAvailability)

      const newFormData = {
        ...category,
        // Ensure all required fields have proper default values
        name: category.name || '',
        displayOrder: category.displayOrder ?? 0,
        hidden: category.hidden ?? false,
        imageUrl: category.imageUrl || '',
        includeAttributes: category.includeAttributes ?? false,
        includeDiscounts: category.includeDiscounts ?? false,
        availability: processedAvailability,
        printers: category.printers || ['Kitchen (P2)'],
        items: category.items || []
      }
      
      console.log('Setting form data:', newFormData)
      setFormData(newFormData)
    }
  }, [category, open])

  const handleImageChange = (file: File) => {
    setImageFile(file)
    setFormData(prev => ({
      ...prev,
      imageUrl: URL.createObjectURL(file)
    }))
  }

  const handleImageRemove = () => {
    setImageFile(undefined)
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }))
  }

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error('Category name is required')
      return
    }

    console.log('Starting category update...', { categoryId: category.id, formData })
    setIsLoading(true)
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name || '')
      formDataToSend.append('displayOrder', (formData.displayOrder ?? 0).toString())
      formDataToSend.append('hidden', (formData.hidden ?? false).toString())
      
      // Add availability data as JSON string
      formDataToSend.append('availability', JSON.stringify(formData.availability || {}))
      
      // Add printers as individual values
      if (formData.printers && formData.printers.length > 0) {
        formData.printers.forEach(printer => {
          formDataToSend.append('printers', printer)
        })
      }

      // Add image if exists
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      // Log the form data for debugging
      const formDataObject: any = {};
      formDataToSend.forEach((value, key) => {
        if (formDataObject[key]) {
          if (Array.isArray(formDataObject[key])) {
            formDataObject[key].push(value);
          } else {
            formDataObject[key] = [formDataObject[key], value];
          }
        } else {
          formDataObject[key] = value;
        }
      });
      console.log('Form data being sent for update:', formDataObject);

      console.log('Making API call to update category...')
      const response = await api.put(`/categories/${category.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('API response received:', response.data)

      if (response.data.success) {
        // Transform the response data to match the Category type
        const updatedCategory = {
          ...response.data.data,
          id: response.data.data._id || response.data.data.id,
          availability: response.data.data.availability || formData.availability,
          printers: response.data.data.printers || formData.printers
        }
        
        console.log('Category updated successfully, calling onSave...', updatedCategory)
        onSave(updatedCategory)
        toast.success('Category updated successfully')
    onClose()
      } else {
        console.error('API returned success: false', response.data)
        toast.error(response.data.message || 'Failed to update category')
      }
    } catch (error: any) {
      console.error('Error updating category:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      toast.error(error.response?.data?.message || error.message || 'Error updating category')
    } finally {
      setIsLoading(false)
    }
  }

  const updateAvailability = (day: typeof DAYS_OF_WEEK[number], type: AvailabilityOption, startTime?: string, endTime?: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          type,
          startTime: startTime || (prev.availability as any)?.[day]?.startTime || null,
          endTime: endTime || (prev.availability as any)?.[day]?.endTime || null
        }
      }
    }))
  }

  const updateAvailabilityTime = (day: typeof DAYS_OF_WEEK[number], timeType: 'startTime' | 'endTime', value: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...(prev.availability as any)?.[day],
          [timeType]: value
        }
      }
    }))
  }

  const togglePrinter = (printer: typeof PRINTERS[number]) => {
    setFormData(prev => ({
      ...prev,
      printers: prev.printers?.includes(printer)
        ? prev.printers.filter(p => p !== printer)
        : [...(prev.printers || []), printer]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <div className="flex border-b mt-4">
            {(['settings', 'availability', 'printers'] as const).map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${
                  currentTab === tab
                    ? 'border-b-2 border-emerald-500 text-emerald-500'
                    : 'text-gray-500'
                }`}
                onClick={() => setCurrentTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {currentTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder ?? 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                  min="0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="hidden">Hidden</Label>
                <div className="flex items-center mt-1">
                <Switch
                  id="hidden"
                  checked={formData.hidden}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hidden: checked }))}
                />
                </div>
              </div>

              <div>
                <Label>Category Image</Label>
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={handleImageChange}
                  onRemove={handleImageRemove}
                />
              </div>
            </div>
          )}

          {currentTab === 'availability' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Please select which times the category should be available.</p>
              {DAYS_OF_WEEK.map((day) => {
                const dayAvailability = (formData.availability as any)?.[day]
                console.log(`Rendering ${day} availability:`, dayAvailability)
                return (
                  <div key={day} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="w-20">{day}</Label>
                  <select
                        value={dayAvailability?.type || 'All Day'}
                        onChange={(e) => updateAvailability(day, e.target.value as AvailabilityOption)}
                        className="w-[180px] h-10 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                        {AVAILABILITY_OPTIONS.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                  </select>
                </div>
                    
                    {dayAvailability?.type === 'Specific Times' && (
                      <div className="flex items-center justify-end space-x-2 ml-20">
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={dayAvailability?.startTime || '11:30'}
                            onChange={(e) => updateAvailabilityTime(day, 'startTime', e.target.value)}
                            className="w-24 h-8 text-sm"
                          />
                          <span className="text-sm text-gray-500">to</span>
                          <Input
                            type="time"
                            value={dayAvailability?.endTime || '15:00'}
                            onChange={(e) => updateAvailabilityTime(day, 'endTime', e.target.value)}
                            className="w-24 h-8 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {currentTab === 'printers' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Select which printers should print items from this category.</p>
              {PRINTERS.map((printer) => (
                <div key={printer} className="flex items-center space-x-2">
                  <Switch
                    id={printer}
                    checked={formData.printers?.includes(printer) || false}
                    onCheckedChange={() => togglePrinter(printer)}
                  />
                  <Label htmlFor={printer}>{printer}</Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name?.trim() || isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 