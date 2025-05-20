'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, ChevronDown, ChevronUp, Edit, Plus, Settings, ArrowUpDown } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { EditItemModal } from './edit-item-modal'
import { Category, MenuItem } from '@/types/menu'
import { EditCategoryModal } from './edit-category-modal'
import { toast } from 'react-hot-toast'

interface MenuCategoryProps {
  category: Category
  onDelete: (id: string) => void
  onUpdate: (category: Category) => void
  allCategories: Category[]
}

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

const DEFAULT_AVAILABILITY = {
  isAvailable: true,
  type: 'All Day',
  times: []
} as const

export function MenuCategory({ category, onDelete, onUpdate, allCategories }: MenuCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [includeAttributes, setIncludeAttributes] = useState(false)
  const [includeDiscounts, setIncludeDiscounts] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleCloneItem = (itemId: string) => {
    const itemToClone = category.items?.find(item => item.id === itemId)
    if (!itemToClone) return

    const clonedItem: MenuItem = {
      ...itemToClone,
      id: Math.random().toString(36).substr(2, 9),
      name: `Copy of ${itemToClone.name}`
    }

    onUpdate({
      ...category,
      items: [...(category.items || []), clonedItem]
    })
  }

  const handleToggleDelivery = async (item: MenuItem, checked: boolean) => {
    try {
      const formData = new FormData()
      formData.append('delivery', checked.toString())
      
      const response = await fetch(`http://localhost:5000/api/products/${item.id}`, {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to update delivery status')
      }

      onUpdate({
        ...category,
        items: category.items?.map(i => 
          i.id === item.id ? { ...i, delivery: checked } : i
        ) || []
      })
    } catch (error) {
      console.error('Error updating delivery status:', error)
      toast.error('Failed to update delivery status')
    }
  }

  const handleToggleCollection = async (item: MenuItem, checked: boolean) => {
    try {
      const formData = new FormData()
      formData.append('collection', checked.toString())
      
      const response = await fetch(`http://localhost:5000/api/products/${item.id}`, {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to update collection status')
      }

      onUpdate({
        ...category,
        items: category.items?.map(i => 
          i.id === item.id ? { ...i, collection: checked } : i
        ) || []
      })
    } catch (error) {
      console.error('Error updating collection status:', error)
      toast.error('Failed to update collection status')
    }
  }

  const handleToggleDineIn = async (item: MenuItem, checked: boolean) => {
    try {
      const formData = new FormData()
      formData.append('dineIn', checked.toString())
      
      const response = await fetch(`http://localhost:5000/api/products/${item.id}`, {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to update dine in status')
      }

      onUpdate({
        ...category,
        items: category.items?.map(i => 
          i.id === item.id ? { ...i, dineIn: checked } : i
        ) || []
      })
    } catch (error) {
      console.error('Error updating dine in status:', error)
      toast.error('Failed to update dine in status')
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/products/${itemId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete item')
      }

    onUpdate({
      ...category,
        items: category.items?.filter(item => item.id !== itemId) || []
    })
      toast.success('Product deleted successfully')
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Failed to delete item')
    }
  }

  const handleEditItem = async (item: MenuItem) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${item.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product details')
      }
      const data = await response.json()
      if (data.success) {
        // Transform API response to match MenuItem type
        const transformedItem: MenuItem = {
          id: data.data.id || data.data._id,
          name: data.data.name,
          description: data.data.description,
          price: data.data.price,
          weight: data.data.weight,
          calorificValue: data.data.calorificValue,
          calorieDetails: data.data.calorieDetails,
          hideItem: data.data.hideItem,
          delivery: data.data.delivery,
          collection: data.data.collection,
          dineIn: data.data.dineIn,
          category: data.data.category.id || data.data.category._id,
          images: data.data.images || [],
          availability: data.data.availability || DAYS_OF_WEEK.reduce((acc, day) => ({
            ...acc,
            [day]: { ...DEFAULT_AVAILABILITY }
          }), {}),
          allergens: data.data.allergens || {
            contains: [],
            mayContain: []
          },
          priceChanges: data.data.priceChanges || []
        }
        setEditingItem(transformedItem)
      } else {
        throw new Error(data.message || 'Failed to fetch product details')
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
      toast.error('Failed to fetch product details')
    }
  }

  const handleSaveItem = (updatedItem: MenuItem) => {
    onUpdate({
      ...category,
      items: category.items?.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ) || []
    })
    setEditingItem(null)
  }

  const handleAddItem = () => {
    setIsAddModalOpen(true)
  }

  const handleSaveNewItem = (newItem: MenuItem) => {
    onUpdate({
      ...category,
      items: [...(category.items || []), { ...newItem, category: category.id }]
    })
    setIsAddModalOpen(false)
  }

  const handleMoveSelected = (targetCategoryId: string) => {
    const targetCategory = allCategories.find(cat => cat.id === targetCategoryId)
    if (!targetCategory) return

    const itemsToMove = category.items?.filter(item => selectedItems.includes(item.id)) || []
    const remainingItems = category.items?.filter(item => !selectedItems.includes(item.id)) || []

    // Update each moved item's category
    itemsToMove.forEach(async (item) => {
      try {
        const formData = new FormData()
        formData.append('category', targetCategoryId)
        
        await fetch(`http://localhost:5000/api/products/${item.id}`, {
          method: 'PUT',
          body: formData
        })
      } catch (error) {
        console.error(`Error moving item ${item.id}:`, error)
      }
    })

    onUpdate({
      ...category,
      items: remainingItems
    })

    const targetCategoryWithNewItems = {
      ...targetCategory,
      items: [...(targetCategory.items || []), ...itemsToMove]
    }

    onUpdate(targetCategoryWithNewItems)
    setSelectedItems([])
  }

  const handleCloneSelected = () => {
    const clonedItems = selectedItems.map(id => {
      const item = category.items?.find(item => item.id === id)
      if (!item) return null
      return {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        name: `Copy of ${item.name}`
      }
    }).filter((item): item is MenuItem => item !== null)

    onUpdate({
      ...category,
      items: [...(category.items || []), ...clonedItems]
    })
    setSelectedItems([])
  }

  // Calculate availability status based on category availability
  const availabilityStatus = category.hidden ? 'Hidden' : 'Available'
  const availabilityColor = category.hidden ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={category.id} className="border rounded-lg bg-white">
        <div className="flex items-center justify-between p-4 w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <AccordionTrigger className="hover:no-underline">
                {category.name}
              </AccordionTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditModalOpen(true)
                }}
              >
                <Edit className="h-4 w-4 text-emerald-500" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={availabilityColor}>
                {availabilityStatus}
              </Badge>
              {category.hidden && (
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  Hidden
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setShowSettings(!showSettings)
              }}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(category.id)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showSettings && (
          <div className="border-y p-4 space-y-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="w-[200px]">
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => handleMoveSelected(e.target.value)}
                  value=""
                >
                  <option value="" disabled>Move to category</option>
                  {allCategories
                    .filter(cat => cat.id !== category.id)
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  }
                </select>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={selectedItems.length === 0}
                  onClick={handleCloneSelected}
                >
                  Clone Selected
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={includeAttributes}
                  onCheckedChange={setIncludeAttributes}
                />
                <span className="text-sm">Include Attributes?</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={includeDiscounts}
                  onCheckedChange={setIncludeDiscounts}
                />
                <span className="text-sm">Include Discounts?</span>
              </div>
            </div>
          </div>
        )}

        <AccordionContent>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === (category.items?.length || 0)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(category.items?.map(item => item.id) || [])
                        } else {
                          setSelectedItems([])
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-center p-2">Delivery</th>
                  <th className="text-center p-2">Collection</th>
                  <th className="text-center p-2">Dine In</th>
                  <th className="text-right p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {category.items?.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(prev => [...prev, item.id])
                          } else {
                            setSelectedItems(prev => prev.filter(id => id !== item.id))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">£{item.price.toFixed(2)}</td>
                    <td className="text-center p-2">
                      <Switch
                        checked={item.delivery}
                        onCheckedChange={(checked) => handleToggleDelivery(item, checked)}
                      />
                    </td>
                    <td className="text-center p-2">
                      <Switch
                        checked={item.collection}
                        onCheckedChange={(checked) => handleToggleCollection(item, checked)}
                      />
                    </td>
                    <td className="text-center p-2">
                      <Switch
                        checked={item.dineIn}
                        onCheckedChange={(checked) => handleToggleDineIn(item, checked)}
                      />
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCloneItem(item.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between mt-4">
              <Button variant="outline" size="sm" className="text-emerald-500" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              <Button variant="outline" size="sm" className="text-emerald-500">
                <Plus className="h-4 w-4 mr-2" />
                Add Group Item
              </Button>
            </div>

              <EditItemModal
                item={editingItem}
              categoryId={category.id}
              open={!!editingItem}
                onClose={() => setEditingItem(null)}
                onSave={handleSaveItem}
              />

            <EditItemModal
              item={null}
              categoryId={category.id}
              open={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSave={handleSaveNewItem}
            />

            <EditCategoryModal
              category={category}
              open={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSave={(updatedCategory) => {
                onUpdate(updatedCategory)
                setIsEditModalOpen(false)
              }}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
} 