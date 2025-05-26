'use client'

import { useState } from 'react'
import api from '@/lib/axios'
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
import { BaseUrl } from '@/lib/config'

interface AddCategoryModalProps {
  open: boolean
  onClose: () => void
  onAdd: (category: Category) => void
  onSuccess: () => Promise<void>
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

export function AddCategoryModal({ open, onClose, onAdd, onSuccess }: AddCategoryModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('settings')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    displayOrder: 0,
    hidden: false,
    imageUrl: undefined as string | undefined,
    imageFile: undefined as File | undefined,
    availability: Object.fromEntries(
      DAYS_OF_WEEK.map(day => [day, { type: 'All Day' as AvailabilityOption, startTime: null, endTime: null }])
    ) as Record<string, DayAvailability>,
    printers: ['Kitchen (P2)'] as string[],
    items: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name?.trim()) {
      toast.error('Category name is required')
      return
    }
    
    console.log('Starting category creation...', formData)
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
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile)
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
      console.log('Form data being sent:', formDataObject);

      console.log('Making API call to create category...')
      const response = await api.post('/categories', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('API response received:', response.data)

      if (response.data.success) {
        // Transform the response data to match the Category type
        const newCategory = {
          ...response.data.data,
          id: response.data.data._id || response.data.data.id,
          items: [],
          availability: response.data.data.availability || formData.availability,
          printers: response.data.data.printers || formData.printers
        }
        console.log('Category created successfully:', newCategory)
        onAdd(newCategory)
        await onSuccess()
        resetForm()
        onClose()
        toast.success('Category created successfully')
      } else {
        console.error('API returned success: false', response.data)
        toast.error(response.data.message || 'Failed to create category')
      }
    } catch (error: any) {
      console.error('Error creating category:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      toast.error(error.response?.data?.message || error.message || 'Error creating category')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      displayOrder: 0,
      hidden: false,
      imageUrl: undefined,
      imageFile: undefined,
      availability: Object.fromEntries(
        DAYS_OF_WEEK.map(day => [day, { type: 'All Day' as AvailabilityOption, startTime: null, endTime: null }])
      ) as Record<string, DayAvailability>,
      printers: ['Kitchen (P2)'],
      items: []
    })
    setActiveTab('settings')
  }

  const updateAvailability = (day: typeof DAYS_OF_WEEK[number], type: AvailabilityOption, startTime?: string, endTime?: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          type,
          startTime: startTime || prev.availability[day]?.startTime || null,
          endTime: endTime || prev.availability[day]?.endTime || null
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
          ...prev.availability[day],
          [timeType]: value
        }
      }
    }))
  }

  const togglePrinter = (printer: typeof PRINTERS[number]) => {
    setFormData(prev => ({
      ...prev,
      printers: prev.printers.includes(printer)
        ? prev.printers.filter(p => p !== printer)
        : [...prev.printers, printer]
    }))
  }

  const handleImageChange = (file: File) => {
    setFormData(prev => ({
      ...prev,
      imageFile: file,
      imageUrl: URL.createObjectURL(file) // Create a preview URL
    }))
  }

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: undefined,
      imageUrl: undefined
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <div className="flex border-b mt-4">
            {(['settings', 'availability', 'printers'] as const).map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? 'border-b-2 border-emerald-500 text-emerald-500'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          {activeTab === 'settings' && (
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

          {activeTab === 'availability' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Please select which times the category should be available.</p>
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="w-20">{day}</Label>
                  <select
                      value={formData.availability[day]?.type || 'All Day'}
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
                  
                  {formData.availability[day]?.type === 'Specific Times' && (
                    <div className="flex items-center justify-end space-x-2 ml-20">
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={formData.availability[day]?.startTime || '11:30'}
                          onChange={(e) => updateAvailabilityTime(day, 'startTime', e.target.value)}
                          className="w-24 h-8 text-sm"
                        />
                        <span className="text-sm text-gray-500">to</span>
                        <Input
                          type="time"
                          value={formData.availability[day]?.endTime || '15:00'}
                          onChange={(e) => updateAvailabilityTime(day, 'endTime', e.target.value)}
                          className="w-24 h-8 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'printers' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Select which printers should print items from this category.</p>
              {PRINTERS.map((printer) => (
                <div key={printer} className="flex items-center space-x-2">
                  <Switch
                    id={printer}
                    checked={formData.printers.includes(printer)}
                    onCheckedChange={() => togglePrinter(printer)}
                  />
                  <Label htmlFor={printer}>{printer}</Label>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name?.trim() || isLoading}>
              {isLoading ? 'Creating...' : 'Add Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 