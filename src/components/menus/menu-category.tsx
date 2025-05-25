'use client'

import { useState, useEffect } from 'react'
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
import { BaseUrl } from '@/lib/config'
import api from '@/lib/axios'

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
  const [includeAttributes, setIncludeAttributes] = useState(category.includeAttributes || false)
  const [includeDiscounts, setIncludeDiscounts] = useState(category.includeDiscounts || false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [products, setProducts] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Debug modal state changes
  useEffect(() => {
    console.log('Edit modal state changed:', isEditModalOpen, 'for category:', category.name)
  }, [isEditModalOpen, category.name])

  // Fetch products when category is expanded
  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/products?category=${category.id}`)
      const data = response.data
      
      if (data.success) {
        // Transform API response to match MenuItem type
        const transformedProducts = data.data.map((product: any) => ({
          id: product._id || product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          weight: product.weight || 0,
          calorificValue: product.calorificValue || '',
          calorieDetails: product.calorieDetails || '',
          hideItem: product.hideItem || false,
          delivery: product.delivery === true,
          collection: product.collection === true,
          dineIn: product.dineIn === true,
          category: product.category._id || product.category.id,
          images: product.images || [],
          availability: product.availability || DAYS_OF_WEEK.reduce((acc, day) => ({
            ...acc,
            [day]: { ...DEFAULT_AVAILABILITY }
          }), {}),
          allergens: product.allergens || {
            contains: [],
            mayContain: []
          },
          priceChanges: product.priceChanges || []
        }))
        setProducts(transformedProducts)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle accordion state change
  const handleAccordionChange = (value: string) => {
    const isOpen = value === category.id
    setIsExpanded(isOpen)
    if (isOpen) {
      fetchProducts()
    }
  }

  const handleCloneItem = async (itemId: string) => {
    try {
      // Find the item to clone in the products array
      const itemToClone = products.find(item => item.id === itemId);
      if (!itemToClone) {
        toast.error('Product not found');
        return;
      }

      // Create a new product based on the cloned item
      const formData = new FormData();
      formData.append('name', `Copy of ${itemToClone.name}`);
      formData.append('price', itemToClone.price.toString());
      formData.append('description', itemToClone.description || '');
      formData.append('weight', (itemToClone.weight || '').toString());
      formData.append('calorificValue', itemToClone.calorificValue || '');
      formData.append('calorieDetails', itemToClone.calorieDetails || '');
      formData.append('hideItem', itemToClone.hideItem.toString());
      formData.append('delivery', itemToClone.delivery.toString());
      formData.append('collection', itemToClone.collection.toString());
      formData.append('dineIn', itemToClone.dineIn.toString());
      formData.append('category', category.id);

      // Add availability, allergens, and priceChanges as JSON strings
      if (itemToClone.availability) {
        formData.append('availability', JSON.stringify(itemToClone.availability));
      }
      if (itemToClone.allergens) {
        formData.append('allergens', JSON.stringify(itemToClone.allergens));
      }
      if (itemToClone.priceChanges) {
        formData.append('priceChanges', JSON.stringify(itemToClone.priceChanges));
      }

      // Make API call to create the new product
      const response = await api.post('/products', formData)
      const data = response.data
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to duplicate product');
      }

      // After successful creation, refresh products
      await fetchProducts();
      toast.success('Product duplicated successfully');
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast.error('Failed to duplicate product');
    }
  }

  const handleToggleDelivery = async (item: MenuItem, checked: boolean) => {
    try {
      const formData = new FormData()
      formData.append('delivery', checked.toString())
      
      const response = await api.put(`/products/${item.id}`, formData)
      const data = response.data
      if (!data.success) {
        throw new Error('Failed to update delivery status')
      }

      // Update the products array with the new delivery status
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === item.id ? { ...p, delivery: checked } : p
        )
      )
      toast.success('Product updated successfully')
    } catch (error) {
      console.error('Error updating delivery status:', error)
      toast.error('Failed to update delivery status')
    }
  }

  const handleToggleCollection = async (item: MenuItem, checked: boolean) => {
    try {
      const formData = new FormData()
      formData.append('collection', checked.toString())
      
      const response = await api.put(`/products/${item.id}`, formData)
      const data = response.data
      if (!data.success) {
        throw new Error('Failed to update collection status')
      }

      // Update the products array with the new collection status
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === item.id ? { ...p, collection: checked } : p
        )
      )
      toast.success('Product updated successfully')
    } catch (error) {
      console.error('Error updating collection status:', error)
      toast.error('Failed to update collection status')
    }
  }

  const handleToggleDineIn = async (item: MenuItem, checked: boolean) => {
    try {
      const formData = new FormData()
      formData.append('dineIn', checked.toString())
      
      const response = await api.put(`/products/${item.id}`, formData)
      const data = response.data
      if (!data.success) {
        throw new Error('Failed to update dine in status')
      }

      // Update the products array with the new dine in status
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === item.id ? { ...p, dineIn: checked } : p
        )
      )
      toast.success('Product updated successfully')
    } catch (error) {
      console.error('Error updating dine in status:', error)
      toast.error('Failed to update dine in status')
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!itemId) {
      toast.error('Invalid product ID')
      return
    }

    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const response = await api.delete(`/products/${itemId}`)
      const data = response.data

      // Remove the item from the products array
      setProducts(products.filter(item => item.id !== itemId))
      toast.success('Product deleted successfully')
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Failed to delete item')
    }
  }

  const handleEditItem = async (item: MenuItem) => {
    if (!item?.id) {
      toast.error('Invalid product ID')
      return
    }

    try {
      console.log("Fetching product details for:", item.id);
      const response = await api.get(`/products/${item.id}`)
      const data = response.data
      if (data.success) {
        console.log("API response for product:", data.data);
        
        // Process item settings with proper boolean conversion
        const itemSettings = {
          showSelectedOnly: Boolean(data.data.itemSettings?.showSelectedOnly),
          showSelectedCategories: Boolean(data.data.itemSettings?.showSelectedCategories),
          limitSingleChoice: Boolean(data.data.itemSettings?.limitSingleChoice),
          addAttributeCharges: Boolean(data.data.itemSettings?.addAttributeCharges),
          useProductPrices: Boolean(data.data.itemSettings?.useProductPrices),
          showChoiceAsDropdown: Boolean(data.data.itemSettings?.showChoiceAsDropdown)
        };
        
        // Log top-level settings from the API response
        console.log("Top-level settings from API:", {
          tillProviderProductId: data.data.tillProviderProductId,
          cssClass: data.data.cssClass,
          freeDelivery: data.data.freeDelivery,
          collectionOnly: data.data.collectionOnly,
          deleted: data.data.deleted,
          hidePrice: data.data.hidePrice
        });
        
        // Process selectedItems to ensure they're in the correct format
        let processedSelectedItems = data.data.selectedItems || [];
        if (processedSelectedItems.length > 0 && typeof processedSelectedItems[0] === 'object') {
          processedSelectedItems = processedSelectedItems.map((item: any) => item._id || item.id);
        }
        
        // Transform API response to match MenuItem type
        const transformedItem: MenuItem = {
          id: data.data._id || data.data.id, // Handle both _id and id
          name: data.data.name,
          description: data.data.description || '',
          price: data.data.price,
          weight: data.data.weight || 0,
          calorificValue: data.data.calorificValue || '',
          calorieDetails: data.data.calorieDetails || '',
          hideItem: data.data.hideItem || false,
          delivery: data.data.delivery || true,
          collection: data.data.collection || true,
          dineIn: data.data.dineIn || true,
          category: data.data.category._id || data.data.category.id, // Handle both _id and id
          images: data.data.images || [],
          availability: data.data.availability || DAYS_OF_WEEK.reduce((acc, day) => ({
            ...acc,
            [day]: { ...DEFAULT_AVAILABILITY }
          }), {}),
          allergens: data.data.allergens || {
            contains: [],
            mayContain: []
          },
          priceChanges: data.data.priceChanges || [],
          selectedItems: processedSelectedItems,
          itemSettings: itemSettings,
          // Explicitly convert all top-level settings to their proper types
          tillProviderProductId: data.data.tillProviderProductId || '',
          cssClass: data.data.cssClass || '',
          freeDelivery: Boolean(data.data.freeDelivery),
          collectionOnly: Boolean(data.data.collectionOnly),
          deleted: Boolean(data.data.deleted),
          hidePrice: Boolean(data.data.hidePrice),
        }
        console.log("Transformed item for edit modal:", transformedItem);
        setEditingItem(transformedItem)
      } else {
        throw new Error(data.message || 'Failed to fetch product details')
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
      toast.error('Failed to fetch product details')
    }
  }

  const handleSaveItem = async (updatedItem: MenuItem) => {
    try {
      // Find the index of the updated item in products array
      const itemIndex = products.findIndex(item => item.id === updatedItem.id)
      if (itemIndex !== -1) {
        // Update the products array with the new item data
        const newProducts = [...products]
        newProducts[itemIndex] = updatedItem
        setProducts(newProducts)
      }
      setEditingItem(null)
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    }
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
        
        await api.put(`/products/${item.id}`, formData)
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

  // Handle change for category's includeAttributes
  const handleIncludeAttributesChange = async (checked: boolean) => {
    try {
      const formData = new FormData()
      formData.append('includeAttributes', checked.toString())
      
      const response = await api.put(`/categories/${category.id}`, formData)
      const data = response.data

      if (!data.success) {
        throw new Error('Failed to update include attributes setting')
      }

      // Update local state only, don't call onUpdate
      setIncludeAttributes(checked)
      
      // Show success message
      toast.success('Category updated successfully')
    } catch (error) {
      console.error('Error updating include attributes setting:', error)
      toast.error('Failed to update include attributes setting')
    }
  }

  // Handle change for category's includeDiscounts  
  const handleIncludeDiscountsChange = async (checked: boolean) => {
    try {
      const formData = new FormData()
      formData.append('includeDiscounts', checked.toString())
      
      const response = await api.put(`/categories/${category.id}`, formData)
      const data = response.data

      if (!data.success) {
        throw new Error('Failed to update include discounts setting')
      }

      // Update local state only, don't call onUpdate
      setIncludeDiscounts(checked)
      
      // Show success message
      toast.success('Category updated successfully')
    } catch (error) {
      console.error('Error updating include discounts setting:', error)
      toast.error('Failed to update include discounts setting')
    }
  }

  // Calculate availability status based on category availability
  const availabilityStatus = category.hidden ? 'Hidden' : 'Available'
  const availabilityColor = category.hidden ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'

  const handleEditCategory = () => {
    console.log('Opening edit modal for category:', category.name)
    console.log('Current modal state:', isEditModalOpen)
    console.log('Category data:', category)
    
    // Use setTimeout to ensure state is properly set
    setTimeout(() => {
      setIsEditModalOpen(true)
      console.log('Modal state set to true')
    }, 0)
  }

  return (
    <Accordion type="single" collapsible onValueChange={handleAccordionChange}>
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
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Edit category button clicked for:', category.name)
                  handleEditCategory()
                }}
                className="hover:bg-gray-100"
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
                  onCheckedChange={handleIncludeAttributesChange}
                />
                <span className="text-sm">Include Attributes?</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={includeDiscounts}
                  onCheckedChange={handleIncludeDiscountsChange}
                />
                <span className="text-sm">Include Discounts?</span>
              </div>
            </div>
          </div>
        )}

        <AccordionContent>
          <div className="p-4">
            {isLoading ? (
              <div className="text-center py-4">Loading products...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === products.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(products.map(item => item.id))
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
                  {products.map((item) => (
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
            )}

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
              onClose={() => {
                console.log('Closing edit category modal')
                setIsEditModalOpen(false)
              }}
              onSave={(updatedCategory) => {
                console.log('Category save handler called with:', updatedCategory)
                onUpdate(updatedCategory)
                setIsEditModalOpen(false)
                console.log('Edit modal closed after save')
              }}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
} 