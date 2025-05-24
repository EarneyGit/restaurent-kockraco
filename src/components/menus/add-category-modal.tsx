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
      DAYS_OF_WEEK.map(day => [day, 'All Day' as AvailabilityOption])
    ),
    printers: ['Kitchen (P2)'] as string[],
    items: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('displayOrder', formData.displayOrder.toString())
      formDataToSend.append('hidden', formData.hidden.toString())
      
      // Add availability data
      Object.entries(formData.availability).forEach(([day, value]) => {
        formDataToSend.append(`availability[${day}]`, value)
      })
      
      // Add printers as individual values
      formData.printers.forEach(printer => {
        formDataToSend.append('printers', printer)
      })

      // Add image if exists
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile)
      }

      // Add other fields
      formDataToSend.append('name', formData.name)
      formDataToSend.append('displayOrder', formData.displayOrder.toString())
      formDataToSend.append('hidden', formData.hidden.toString())

      // Log the form data for debugging
      const formDataObject: any = {};
      formDataToSend.forEach((value, key) => {
        formDataObject[key] = value;
      });
      console.log('Form data being sent:', formDataObject);

      const response = await api.post('/categories', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        // Transform the response data to match the Category type
        const newCategory = {
          ...response.data.data,
          id: response.data.data._id || response.data.data.id,
          items: [],
          availability: response.data.data.availability || formData.availability,
          printers: response.data.data.printers || formData.printers
        }
        onAdd(newCategory)
        await onSuccess()
        resetForm()
        onClose()
      }
    } catch (error: any) {
      console.error('Error creating category:', error.response?.data || error)
      toast.error(error.response?.data?.message || 'Error creating category')
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
        DAYS_OF_WEEK.map(day => [day, 'All Day' as AvailabilityOption])
      ),
      printers: ['Kitchen (P2)'],
      items: []
    })
    setActiveTab('settings')
  }

  const updateAvailability = (day: typeof DAYS_OF_WEEK[number], value: AvailabilityOption) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: value
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
                  value={formData.displayOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
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
              <p className="text-sm text-gray-500">Set when this category should be available.</p>
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="flex items-center justify-between">
                  <Label>{day}</Label>
                  <select
                    value={formData.availability[day]}
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
            <Button type="submit" disabled={!formData.name.trim() || isLoading}>
              {isLoading ? 'Creating...' : 'Add Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 