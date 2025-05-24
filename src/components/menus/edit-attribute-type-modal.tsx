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
import { Textarea } from '@/components/ui/textarea'
import { Attribute, DAYS_OF_WEEK, DayOfWeek } from '@/types/attribute'

interface EditAttributeTypeModalProps {
  attributeType: Attribute
  open: boolean
  onClose: () => void
  onSave: (attributeType: Attribute) => void
}

export function EditAttributeTypeModal({
  attributeType,
  open,
  onClose,
  onSave,
}: EditAttributeTypeModalProps) {
  const [formData, setFormData] = useState<Attribute>(attributeType)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update form data when attributeType changes
  useEffect(() => {
    setFormData(attributeType)
    setErrors({})
  }, [attributeType])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name cannot be more than 100 characters'
    }

    if (formData.displayOrder < 0) {
      newErrors.displayOrder = 'Display order must be at least 0'
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot be more than 500 characters'
    }

    if (formData.availableDays.length === 0) {
      newErrors.availableDays = 'At least one day must be selected'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onSave(formData)
  }

  const toggleDay = (day: DayOfWeek) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }))
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      type: e.target.value as Attribute['type']
    }))
  }

  const isEditing = !!(formData._id || formData.id)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Attribute Type' : 'Add Attribute Type'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter attribute type name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description (optional)"
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <Label htmlFor="displayOrder">
              Display Order <span className="text-red-500">*</span>
            </Label>
            <Input
              id="displayOrder"
              type="number"
              min="0"
              value={formData.displayOrder}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                displayOrder: parseInt(e.target.value) || 0 
              }))}
              className={errors.displayOrder ? 'border-red-500' : ''}
            />
            {errors.displayOrder && (
              <p className="text-sm text-red-500 mt-1">{errors.displayOrder}</p>
            )}
          </div>

          <div>
            <Label>
              Attribute Type <span className="text-red-500">*</span>
            </Label>
            <select
              value={formData.type}
              onChange={handleTypeChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="single">Select a single option</option>
              <option value="multiple">Select multiple options</option>
              <option value="multiple-times">Select multiple options multiple times</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="requiresSelection"
              checked={formData.requiresSelection}
              onCheckedChange={(checked) => setFormData(prev => ({ 
                ...prev, 
                requiresSelection: checked 
              }))}
            />
            <Label htmlFor="requiresSelection">Requires a selection</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ 
                ...prev, 
                isActive: checked 
              }))}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div>
            <Label>
              Available Days <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="flex items-center gap-2">
                  <Switch
                    id={day}
                    checked={formData.availableDays.includes(day)}
                    onCheckedChange={() => toggleDay(day)}
                  />
                  <Label htmlFor={day}>{day}</Label>
                </div>
              ))}
            </div>
            {errors.availableDays && (
              <p className="text-sm text-red-500 mt-1">{errors.availableDays}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name.trim()}>
              {isEditing ? 'Update' : 'Create'} Attribute Type
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 