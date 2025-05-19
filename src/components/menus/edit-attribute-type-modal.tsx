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

interface AttributeType {
  id: string
  name: string
  type: 'single' | 'multiple' | 'multiple-times'
  displayOrder: number
}

interface EditAttributeTypeModalProps {
  attributeType: AttributeType
  open: boolean
  onClose: () => void
  onSave: (attributeType: AttributeType) => void
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
type DayOfWeek = typeof DAYS_OF_WEEK[number]

export function EditAttributeTypeModal({
  attributeType,
  open,
  onClose,
  onSave,
}: EditAttributeTypeModalProps) {
  const [formData, setFormData] = useState<AttributeType>(attributeType)
  const [requiresSelection, setRequiresSelection] = useState(true)
  const [availableDays, setAvailableDays] = useState<DayOfWeek[]>([...DAYS_OF_WEEK])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const toggleDay = (day: DayOfWeek) => {
    setAvailableDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      type: e.target.value as AttributeType['type']
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {attributeType.id ? 'Edit Attribute Type' : 'Add Attribute Type'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter attribute type name"
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

          <div>
            <Label>Attribute Type</Label>
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
              checked={requiresSelection}
              onCheckedChange={setRequiresSelection}
            />
            <Label htmlFor="requiresSelection">Requires a selection</Label>
          </div>

          <div>
            <Label>Can Order On</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="flex items-center gap-2">
                  <Switch
                    id={day}
                    checked={availableDays.includes(day)}
                    onCheckedChange={() => toggleDay(day)}
                  />
                  <Label htmlFor={day}>{day}</Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 