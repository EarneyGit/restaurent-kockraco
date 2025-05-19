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

interface MenuCategoryProps {
  category: Category
  onDelete: (id: string) => void
  onUpdate: (category: Category) => void
  allCategories: Category[]
}

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
    const itemToClone = category.items.find(item => item.id === itemId)
    if (!itemToClone) return

    const clonedItem: MenuItem = {
      ...itemToClone,
      id: Math.random().toString(36).substr(2, 9),
      name: `Copy of ${itemToClone.name}`
    }

    onUpdate({
      ...category,
      items: [...category.items, clonedItem]
    })
  }

  const handleDeleteItem = (itemId: string) => {
    onUpdate({
      ...category,
      items: category.items.filter(item => item.id !== itemId)
    })
  }

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item)
  }

  const handleSaveItem = (updatedItem: MenuItem) => {
    onUpdate({
      ...category,
      items: category.items.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    })
    setEditingItem(null)
  }

  const handleAddItem = () => {
    setIsAddModalOpen(true)
  }

  const handleSaveNewItem = (newItem: MenuItem) => {
    onUpdate({
      ...category,
      items: [...category.items, newItem]
    })
    setIsAddModalOpen(false)
  }

  const handleMoveSelected = (targetCategoryId: string) => {
    const targetCategory = allCategories.find(cat => cat.id === targetCategoryId)
    if (!targetCategory) return

    const itemsToMove = category.items.filter(item => selectedItems.includes(item.id))
    const remainingItems = category.items.filter(item => !selectedItems.includes(item.id))

    onUpdate({
      ...category,
      items: remainingItems
    })

    const targetCategoryWithNewItems = {
      ...targetCategory,
      items: [...targetCategory.items, ...itemsToMove]
    }

    onUpdate(targetCategoryWithNewItems)
    setSelectedItems([])
  }

  const handleCloneSelected = () => {
    const clonedItems = selectedItems.map(id => {
      const item = category.items.find(item => item.id === id)
      if (!item) return null
      return {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        name: `Copy of ${item.name}`
      }
    }).filter((item): item is MenuItem => item !== null)

    onUpdate({
      ...category,
      items: [...category.items, ...clonedItems]
    })
    setSelectedItems([])
  }

  // Calculate availability status
  const availabilityStatus = 'Available'
  const availabilityColor = 'bg-green-100 text-green-800'

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
                      checked={selectedItems.length === category.items?.length}
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
                        onCheckedChange={(checked) => {
                          onUpdate({
                            ...category,
                            items: category.items?.map(i => 
                              i.id === item.id ? { ...i, delivery: checked } : i
                            )
                          })
                        }}
                      />
                    </td>
                    <td className="text-center p-2">
                      <Switch
                        checked={item.collection}
                        onCheckedChange={(checked) => {
                          onUpdate({
                            ...category,
                            items: category.items?.map(i => 
                              i.id === item.id ? { ...i, collection: checked } : i
                            )
                          })
                        }}
                      />
                    </td>
                    <td className="text-center p-2">
                      <Switch
                        checked={item.dineIn}
                        onCheckedChange={(checked) => {
                          onUpdate({
                            ...category,
                            items: category.items?.map(i => 
                              i.id === item.id ? { ...i, dineIn: checked } : i
                            )
                          })
                        }}
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

            {editingItem && (
              <EditItemModal
                item={editingItem}
                open={true}
                onClose={() => setEditingItem(null)}
                onSave={handleSaveItem}
              />
            )}

            <EditItemModal
              item={null}
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