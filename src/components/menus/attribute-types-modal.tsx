'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react'
import { EditAttributeTypeModal } from './edit-attribute-type-modal'

interface AttributeType {
  id: string
  name: string
  type: 'single' | 'multiple' | 'multiple-times'
  displayOrder: number
}

interface AttributeTypesModalProps {
  open: boolean
  onClose: () => void
}

export function AttributeTypesModal({ open, onClose }: AttributeTypesModalProps) {
  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([
    { id: '1', name: 'Choose Chicken Flavour', type: 'single', displayOrder: 1 },
    { id: '2', name: 'Choose Dressing', type: 'single', displayOrder: 2 },
    { id: '3', name: 'Choose Drink', type: 'single', displayOrder: 3 },
    { id: '4', name: 'Choose Drinks', type: 'multiple', displayOrder: 4 },
  ])
  const [editingType, setEditingType] = useState<AttributeType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTypes = attributeTypes.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Attribute Types</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="text"
              placeholder="Filter by type name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>

          <div className="border rounded-lg divide-y">
            {filteredTypes.map((type) => (
              <div
                key={type.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-400 cursor-move" />
                  <span>{type.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingType(type)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => setEditingType({ id: '', name: '', type: 'single', displayOrder: attributeTypes.length + 1 })}>
              Add New
            </Button>
          </div>
        </div>
      </DialogContent>

      {editingType && (
        <EditAttributeTypeModal
          attributeType={editingType}
          open={true}
          onClose={() => setEditingType(null)}
          onSave={(updatedType) => {
            setAttributeTypes(prev => {
              if (updatedType.id) {
                return prev.map(t => t.id === updatedType.id ? updatedType : t)
              }
              return [...prev, { ...updatedType, id: Math.random().toString(36).substr(2, 9) }]
            })
            setEditingType(null)
          }}
        />
      )}
    </Dialog>
  )
} 