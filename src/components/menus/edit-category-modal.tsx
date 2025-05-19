'use client'

import { useState } from 'react'
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

interface EditCategoryModalProps {
  category: Category
  open: boolean
  onClose: () => void
  onSave: (category: Category) => void
}

type TabType = 'settings' | 'availability' | 'printers'

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
] as const

const AVAILABILITY_OPTIONS = [
  'All Day',
  'Specific Times',
  'Not Available'
] as const

const PRINTERS = [
  'Dunfermline (P1)',
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

  const handleImageChange = (file: File) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: URL.createObjectURL(file)
    }))
  }

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }))
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const updateAvailability = (day: typeof DAYS_OF_WEEK[number], value: typeof AVAILABILITY_OPTIONS[number]) => {
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {category.id ? 'Edit Category' : 'Add Category'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${currentTab === 'settings' ? 'border-b-2 border-emerald-500' : ''}`}
            onClick={() => setCurrentTab('settings')}
          >
            Settings
          </button>
          <button
            className={`px-4 py-2 ${currentTab === 'availability' ? 'border-b-2 border-emerald-500' : ''}`}
            onClick={() => setCurrentTab('availability')}
          >
            Availability
          </button>
          <button
            className={`px-4 py-2 ${currentTab === 'printers' ? 'border-b-2 border-emerald-500' : ''}`}
            onClick={() => setCurrentTab('printers')}
          >
            Printers
          </button>
        </div>

        <div className="py-4">
          {currentTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="hidden"
                  checked={formData.hidden}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hidden: checked }))}
                />
                <Label htmlFor="hidden">Hidden</Label>
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
              {Object.entries(formData.availability || {}).map(([day, value]) => (
                <div key={day} className="flex items-center gap-4">
                  <Label className="w-24 capitalize">{day}</Label>
                  <select
                    value={value}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      availability: {
                        ...prev.availability,
                        [day]: e.target.value as "All Day" | "Specific Times" | "Not Available"
                      }
                    }))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="All Day">All Day</option>
                    <option value="Not Available">Not Available</option>
                    <option value="Specific Times">Specific Times</option>
                  </select>
                </div>
              ))}
            </div>
          )}

          {currentTab === 'printers' && (
            <div className="space-y-4">
              {formData.printers?.map((printer, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={printer}
                    onChange={(e) => {
                      const newPrinters = [...(formData.printers || [])]
                      newPrinters[index] = e.target.value
                      setFormData(prev => ({ ...prev, printers: newPrinters }))
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => {
                      const newPrinters = formData.printers?.filter((_, i) => i !== index)
                      setFormData(prev => ({ ...prev, printers: newPrinters }))
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newPrinters = [...(formData.printers || []), '']
                  setFormData(prev => ({ ...prev, printers: newPrinters }))
                }}
              >
                Add Printer
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 