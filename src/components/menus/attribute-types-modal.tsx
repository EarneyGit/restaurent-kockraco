'use client'

import { useState, useEffect } from 'react'
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
import { Attribute, AttributeApiResponse } from '@/types/attribute'
import { toast } from 'react-hot-toast'
import api from '@/lib/axios'

interface AttributeTypesModalProps {
  open: boolean
  onClose: () => void
}

export function AttributeTypesModal({ open, onClose }: AttributeTypesModalProps) {
  const [attributeTypes, setAttributeTypes] = useState<Attribute[]>([])
  const [editingType, setEditingType] = useState<Attribute | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Fetch attributes from API
  const fetchAttributes = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/attributes')
      const data: AttributeApiResponse = response.data
      
      if (data.success) {
        const attributes = Array.isArray(data.data) ? data.data : [data.data]
        setAttributeTypes(attributes)
      } else {
        toast.error('Failed to fetch attributes')
      }
    } catch (error) {
      console.error('Error fetching attributes:', error)
      toast.error('Failed to fetch attributes')
    } finally {
      setIsLoading(false)
    }
  }

  // Load attributes when modal opens
  useEffect(() => {
    if (open) {
      fetchAttributes()
    }
  }, [open])

  // Handle delete attribute
  const handleDelete = async (attributeId: string) => {
    if (!confirm('Are you sure you want to delete this attribute type?')) return
    
    setIsDeleting(attributeId)
    try {
      const response = await api.delete(`/attributes/${attributeId}`)
      const data: AttributeApiResponse = response.data
      
      if (data.success) {
        setAttributeTypes(prev => prev.filter(attr => 
          (attr._id || attr.id) !== attributeId
        ))
        toast.success('Attribute type deleted successfully')
      } else {
        toast.error(data.message || 'Failed to delete attribute type')
      }
    } catch (error) {
      console.error('Error deleting attribute:', error)
      toast.error('Failed to delete attribute type')
    } finally {
      setIsDeleting(null)
    }
  }

  // Handle save (create or update)
  const handleSave = async (attributeData: Attribute) => {
    try {
      let response
      let data: AttributeApiResponse
      
      if (attributeData._id || attributeData.id) {
        // Update existing attribute
        const id = attributeData._id || attributeData.id
        response = await api.put(`/attributes/${id}`, attributeData)
        data = response.data
        
        if (data.success) {
          setAttributeTypes(prev => prev.map(attr => 
            (attr._id || attr.id) === id ? data.data as Attribute : attr
          ))
          toast.success('Attribute type updated successfully')
        }
      } else {
        // Create new attribute
        response = await api.post('/attributes', attributeData)
        data = response.data
        
        if (data.success) {
          setAttributeTypes(prev => [...prev, data.data as Attribute])
          toast.success('Attribute type created successfully')
        }
      }
      
      if (!data.success) {
        toast.error(data.message || 'Failed to save attribute type')
      }
    } catch (error) {
      console.error('Error saving attribute:', error)
      toast.error('Failed to save attribute type')
    }
  }

  // Handle reorder attributes
  const handleReorder = async (attributeOrders: { id: string; displayOrder: number }[]) => {
    try {
      const response = await api.put('/attributes/reorder', { attributeOrders })
      const data: AttributeApiResponse = response.data
      
      if (data.success) {
        // Update local state with new order
        const reorderedAttributes = [...attributeTypes].sort((a, b) => {
          const aOrder = attributeOrders.find(order => order.id === (a._id || a.id))?.displayOrder || a.displayOrder
          const bOrder = attributeOrders.find(order => order.id === (b._id || b.id))?.displayOrder || b.displayOrder
          return aOrder - bOrder
        })
        setAttributeTypes(reorderedAttributes)
        toast.success('Attributes reordered successfully')
      } else {
        toast.error(data.message || 'Failed to reorder attributes')
      }
    } catch (error) {
      console.error('Error reordering attributes:', error)
      toast.error('Failed to reorder attributes')
    }
  }

  const filteredTypes = attributeTypes.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const createNewAttribute = (): Attribute => ({
    name: '',
    type: 'single',
    displayOrder: attributeTypes.length + 1,
    requiresSelection: true,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    isActive: true,
    description: ''
  })

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

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
              {filteredTypes.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchQuery ? 'No attributes found matching your search.' : 'No attributes found. Create your first attribute type.'}
                </div>
              ) : (
                filteredTypes.map((type) => (
                  <div
                    key={type._id || type.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4 text-gray-400 cursor-move" />
                      <div>
                        <span className="font-medium">{type.name}</span>
                        <div className="text-sm text-gray-500">
                          Type: {type.type} • Order: {type.displayOrder}
                          {type.description && (
                            <span> • {type.description}</span>
                          )}
                        </div>
                      </div>
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
                        onClick={() => handleDelete(type._id || type.id!)}
                        disabled={isDeleting === (type._id || type.id)}
                      >
                        {isDeleting === (type._id || type.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => setEditingType(createNewAttribute())}>
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
            handleSave(updatedType)
            setEditingType(null)
          }}
        />
      )}
    </Dialog>
  )
} 