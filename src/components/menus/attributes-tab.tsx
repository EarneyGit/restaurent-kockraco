'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StableSwitch } from '@/components/ui/stable-switch'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Search, Copy, Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/lib/axios'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { BaseUrl } from '@/lib/config'

interface Attribute {
  id: string
  name: string
  type: 'single' | 'multiple'
  requiresSelection: boolean
  description?: string
  displayOrder: number
  isActive: boolean
}

interface AttributeOption {
  id: string
  name: string
  price: number
  description?: string
  displayOrder: number
  isActive: boolean
  attributeId: string
  productId: string
  image?: string
  calorificValue?: number
  weight?: string
  hiddenForToday?: boolean
  fullyHidden?: boolean
}

interface ProductAttribute {
  attribute: Attribute
  options: AttributeOption[]
}

interface AttributesTabProps {
  productId: string
  productName?: string
  categoryId?: string
  onAttributesChange?: (attributes: ProductAttribute[]) => void
}

interface Product {
  id: string
  name: string
  category: string
}

export function AttributesTab({ productId, productName, categoryId, onAttributesChange }: AttributesTabProps) {
  const [productAttributes, setProductAttributes] = useState<ProductAttribute[]>([])
  const [allAttributes, setAllAttributes] = useState<Attribute[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [productAllowAddWithoutChoices, setProductAllowAddWithoutChoices] = useState(false)
  
  // Modal states
  const [showCreateAttributeModal, setShowCreateAttributeModal] = useState(false)
  const [showAddExistingModal, setShowAddExistingModal] = useState(false)
  const [showCopyAttributesModal, setShowCopyAttributesModal] = useState(false)
  const [showProductSelectionModal, setShowProductSelectionModal] = useState(false)
  const [showAttributeOptionsModal, setShowAttributeOptionsModal] = useState(false)
  const [showAddOptionModal, setShowAddOptionModal] = useState(false)
  const [showEditOptionModal, setShowEditOptionModal] = useState(false)
  
  // Current editing states
  const [currentAttribute, setCurrentAttribute] = useState<Attribute | null>(null)
  const [currentOption, setCurrentOption] = useState<AttributeOption | null>(null)
  const [selectedAttributeForOptions, setSelectedAttributeForOptions] = useState<Attribute | null>(null)
  const [copyType, setCopyType] = useState<'from' | 'to' | 'category'>('from')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Form states
  const [newAttribute, setNewAttribute] = useState({
    name: '',
    type: 'single' as 'single' | 'multiple',
    requiresSelection: true,
    description: '',
    displayOrder: 0
  })
  
  const [newOption, setNewOption] = useState({
    name: '',
    price: 0,
    description: '',
    displayOrder: 0,
    calorificValue: 0,
    weight: '',
    image: null as File | null
  })

  // Fetch product attributes
  const fetchProductAttributes = async () => {
    if (!productId) return
    
    setLoading(true)
    try {
      const response = await api.get(`/product-attribute-items/product/${productId}`)
      const data = response.data
      if (data.success) {
        // Transform the API response to match our interface
        const transformedData = data.data.map((item: any) => ({
          attribute: {
            id: item.attribute._id || item.attribute.id,
            name: item.attribute.name,
            type: item.attribute.type,
            requiresSelection: item.attribute.requiresSelection,
            description: item.attribute.description,
            displayOrder: item.attribute.displayOrder,
            isActive: item.attribute.isActive
          },
          options: (item.items || []).map((option: any) => ({
            id: option._id || option.id,
            name: option.name,
            price: option.price || 0,
            description: option.description,
            displayOrder: option.displayOrder,
            isActive: option.isActive,
            attributeId: option.attributeId,
            productId: option.productId,
            image: option.image,
            calorificValue: option.calorificValue,
            weight: option.weight,
            hiddenForToday: option.hiddenForToday || false,
            fullyHidden: option.fullyHidden || false
          }))
        }))
        
        setProductAttributes(transformedData)
        onAttributesChange?.(transformedData)
      }
    } catch (error) {
      console.error('Error fetching product attributes:', error)
      toast.error('Failed to load product attributes')
    } finally {
      setLoading(false)
    }
  }

  // Fetch product's allowAddWithoutChoices setting
  const fetchProductSettings = async () => {
    if (!productId) return
    
    try {
      const response = await api.get(`/products/${productId}`)
      const data = response.data
      
      if (data.success) {
        const allowValue = Boolean(data.data.allowAddWithoutChoices)
        console.log('📥 Fetched allowAddWithoutChoices:', { raw: data.data.allowAddWithoutChoices, boolean: allowValue })
        setProductAllowAddWithoutChoices(allowValue)
      }
    } catch (error) {
      console.error('Error fetching product settings:', error)
    }
  }

  // Update product's allowAddWithoutChoices setting
  const updateProductAllowAddWithoutChoices = async (value: boolean) => {
    if (!productId) return
    
    console.log('🔄 Toggle clicked:', { productId, currentState: productAllowAddWithoutChoices, newValue: value })
    
    // Optimistically update the state first
    setProductAllowAddWithoutChoices(value)
    
    try {
      const formData = new FormData()
      formData.append('allowAddWithoutChoices', value.toString())
      
      const response = await api.put(`/products/${productId}`, formData)
      const data = response.data
      
      console.log('✅ API Response:', { success: data.success, allowAddWithoutChoices: data.data?.allowAddWithoutChoices })
      
      if (data.success) {
        toast.success(`Product setting updated: ${value ? 'Allow' : 'Require'} add without choices`)
        
        // Refresh the product settings to ensure consistency
        await fetchProductSettings()
      } else {
        throw new Error(data.message || 'Failed to update product setting')
      }
    } catch (error) {
      console.error('❌ Error updating product setting:', error)
      toast.error('Failed to update product setting')
      // Revert the state if the API call failed
      setProductAllowAddWithoutChoices(!value)
    }
  }

  // Fetch all available attributes
  const fetchAllAttributes = async () => {
    try {
      const response = await api.get('/attributes')
      const data = response.data
      if (data.success) {
        const transformedAttributes = data.data.map((attr: any) => ({
          id: attr._id || attr.id,
          name: attr.name,
          type: attr.type,
          requiresSelection: attr.requiresSelection,
          description: attr.description,
          displayOrder: attr.displayOrder,
          isActive: attr.isActive
        }))
        setAllAttributes(transformedAttributes)
      }
    } catch (error) {
      console.error('Error fetching attributes:', error)
      toast.error('Failed to load attributes')
    }
  }

  // Fetch all products for copy functionality
  const fetchAllProducts = async () => {
    try {
      const response = await api.get('/products')
      const data = response.data
      if (data.success) {
        const transformedProducts = data.data
          .filter((product: any) => (product._id || product.id) !== productId) // Exclude current product
          .map((product: any) => ({
            id: product._id || product.id,
            name: product.name,
            category: product.category?.name || product.category
          }))
        setAllProducts(transformedProducts)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchProductAttributes()
    fetchProductSettings()
    fetchAllAttributes()
    fetchAllProducts()
  }, [productId])

  // Create new attribute
  const handleCreateAttribute = async () => {
    if (!newAttribute.name.trim()) {
      toast.error('Attribute name is required')
      return
    }

    try {
      // Send data as JSON instead of FormData
      const attributeData = {
        name: newAttribute.name,
        type: newAttribute.type,
        requiresSelection: newAttribute.requiresSelection,
        description: newAttribute.description || '',
        displayOrder: newAttribute.displayOrder
      }

      console.log('🔄 Sending data:', attributeData)
      const response = await api.post('/attributes', attributeData)
      console.log('🔄 Response:', response.data)
      const data = response.data

      if (data.success) {
        toast.success('Attribute created successfully')
        setShowCreateAttributeModal(false)
        setNewAttribute({
          name: '',
          type: 'single',
          requiresSelection: true,
          description: '',
          displayOrder: 0
        })
        fetchAllAttributes()
        
        // Automatically show options modal for the new attribute
        const newAttr = {
          id: data.data._id || data.data.id,
          name: data.data.name,
          type: data.data.type,
          requiresSelection: data.data.requiresSelection,
          description: data.data.description,
          displayOrder: data.data.displayOrder,
          isActive: data.data.isActive
        }
        setSelectedAttributeForOptions(newAttr)
        setShowAttributeOptionsModal(true)
      }
    } catch (error) {
      console.error('Error creating attribute:', error)
      toast.error('Failed to create attribute')
    }
  }

  // Add existing attribute to product
  const handleAddExistingAttribute = async (attributeId: string) => {
    try {
      // Check if attribute is already added
      const existingAttribute = productAttributes.find(pa => pa.attribute.id === attributeId)
      if (existingAttribute) {
        toast.error('This attribute is already added to the product')
        return
      }

      const attribute = allAttributes.find(a => a.id === attributeId)
      if (!attribute) {
        toast.error('Attribute not found')
        return
      }

      // Add attribute to product (initially with no options)
      const newProductAttribute: ProductAttribute = {
        attribute,
        options: []
      }

      setProductAttributes(prev => [...prev, newProductAttribute])
      onAttributesChange?.([...productAttributes, newProductAttribute])
      toast.success(`${attribute.name} attribute added to product`)
      setShowAddExistingModal(false)
      
      // Show options modal for the added attribute
      setSelectedAttributeForOptions(attribute)
      setShowAttributeOptionsModal(true)
    } catch (error) {
      console.error('Error adding attribute to product:', error)
      toast.error('Failed to add attribute to product')
    }
  }

  // Remove attribute from product
  const handleRemoveAttribute = async (attributeId: string) => {
    if (!confirm('Are you sure you want to remove this attribute and all its options from this product?')) return

    try {
      // Remove all attribute options for this attribute from the product
      const attributeToRemove = productAttributes.find(pa => pa.attribute.id === attributeId)
      if (attributeToRemove && attributeToRemove.options.length > 0) {
        await Promise.all(
          attributeToRemove.options.map(option =>
            api.delete(`/product-attribute-items/${option.id}`)
          )
        )
      }

      const updatedProductAttributes = productAttributes.filter(pa => pa.attribute.id !== attributeId)
      setProductAttributes(updatedProductAttributes)
      onAttributesChange?.(updatedProductAttributes)
      toast.success('Attribute removed from product')
    } catch (error) {
      console.error('Error removing attribute from product:', error)
      toast.error('Failed to remove attribute from product')
    }
  }

  // Show attribute options
  const handleShowAttributeOptions = (attribute: Attribute) => {
    setSelectedAttributeForOptions(attribute)
    setShowAttributeOptionsModal(true)
  }

  // Add new option to attribute
  const handleAddOption = () => {
    if (!selectedAttributeForOptions) return
    
    setCurrentOption(null)
    setNewOption({
      name: '',
      price: 0,
      description: '',
      displayOrder: 0,
      calorificValue: 0,
      weight: '',
      image: null
    })
    setShowAddOptionModal(true)
  }

  // Edit existing option
  const handleEditOption = (option: AttributeOption) => {
    setCurrentOption(option)
    setNewOption({
      name: option.name,
      price: option.price,
      description: option.description || '',
      displayOrder: option.displayOrder,
      calorificValue: option.calorificValue || 0,
      weight: option.weight || '',
      image: null
    })
    setShowEditOptionModal(true)
  }

  // Save option (create or update)
  const handleSaveOption = async () => {
    if (!selectedAttributeForOptions) return
    
    if (!newOption.name.trim()) {
      toast.error('Option name is required')
      return
    }

    try {
      const formData = new FormData()
      formData.append('productId', productId)
      formData.append('attributeId', selectedAttributeForOptions.id)
      formData.append('name', newOption.name)
      formData.append('price', newOption.price.toString())
      formData.append('description', newOption.description)
      formData.append('displayOrder', newOption.displayOrder.toString())
      formData.append('calorificValue', newOption.calorificValue.toString())
      formData.append('weight', newOption.weight)
      formData.append('isActive', 'true')

      if (newOption.image) {
        formData.append('image', newOption.image)
      }

      let response
      if (currentOption) {
        // Update existing option
        response = await api.put(`/product-attribute-items/${currentOption.id}`, formData)
      } else {
        // Create new option
        response = await api.post('/product-attribute-items', formData)
      }

      const data = response.data
      if (data.success) {
        toast.success(`Option ${currentOption ? 'updated' : 'created'} successfully`)
        setShowAddOptionModal(false)
        setShowEditOptionModal(false)
        setCurrentOption(null)
        setNewOption({
          name: '',
          price: 0,
          description: '',
          displayOrder: 0,
          calorificValue: 0,
          weight: '',
          image: null
        })
        fetchProductAttributes()
      }
    } catch (error) {
      console.error('Error saving option:', error)
      toast.error('Failed to save option')
    }
  }

  // Delete option
  const handleDeleteOption = async (optionId: string) => {
    if (!confirm('Are you sure you want to delete this option?')) return

    try {
      await api.delete(`/product-attribute-items/${optionId}`)
      toast.success('Option deleted successfully')
      fetchProductAttributes()
    } catch (error) {
      console.error('Error deleting option:', error)
      toast.error('Failed to delete option')
    }
  }

  // Update hidden status for option
  const handleUpdateHiddenStatus = async (optionId: string, field: 'hiddenForToday' | 'fullyHidden', value: boolean) => {
    try {
      // Implement mutual exclusion: if setting one to true, set the other to false
      const updateData: any = { [field]: value }
      if (value) {
        // If setting this field to true, set the other field to false
        const otherField = field === 'hiddenForToday' ? 'fullyHidden' : 'hiddenForToday'
        updateData[otherField] = false
      }
      
      await api.patch(`/product-attribute-items/${optionId}/hidden-status`, updateData)
      
      // Update local state immediately for better UX
      setProductAttributes(prev => 
        prev.map(productAttribute => ({
          ...productAttribute,
          options: productAttribute.options.map(option => 
            option.id === optionId 
              ? { ...option, ...updateData }
              : option
          )
        }))
      )
      
      toast.success(`Option ${field === 'hiddenForToday' ? 'hidden for today' : 'fully hidden'} status updated`)
    } catch (error) {
      console.error('Error updating hidden status:', error)
      toast.error('Failed to update hidden status')
    }
  }

  // Copy attributes functionality
  const handleCopyAttributes = async (type: 'from' | 'to' | 'category', targetProductId?: string) => {
    try {
      let endpoint = ''
      let payload: any = {}

      if (type === 'from') {
        if (!targetProductId) {
          toast.error('Please select a source product')
          return
        }
        // Copy from another product to this product
        endpoint = '/product-attribute-items/copy'
        payload = {
          sourceProductId: targetProductId,
          targetProductId: productId
        }
      } else if (type === 'to') {
        if (!targetProductId) {
          toast.error('Please select a target product')
          return
        }
        // Copy from this product to another product
        endpoint = '/product-attribute-items/copy'
        payload = {
          sourceProductId: productId,
          targetProductId: targetProductId
        }
      } else if (type === 'category') {
        if (!categoryId) {
          toast.error('Category ID is required')
          return
        }
        // Copy from this product to all products in category
        endpoint = '/product-attribute-items/copy-to-category'
        payload = {
          sourceProductId: productId,
          categoryId: categoryId
        }
      }

      const response = await api.post(endpoint, payload)
      const data = response.data

      if (data.success) {
        toast.success(data.message || 'Attributes copied successfully')
        if (type === 'from') {
          fetchProductAttributes()
        }
        setShowCopyAttributesModal(false)
        setShowProductSelectionModal(false)
      }
    } catch (error) {
      console.error('Error copying attributes:', error)
      toast.error('Failed to copy attributes')
    }
  }

  // Handle copy button clicks
  const handleCopyButtonClick = (type: 'from' | 'to' | 'category') => {
    setCopyType(type)
    if (type === 'category') {
      handleCopyAttributes('category')
    } else {
      setShowCopyAttributesModal(false)
      setShowProductSelectionModal(true)
    }
  }

  // Image dropzone for options
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setNewOption(prev => ({ ...prev, image: acceptedFiles[0] }))
      }
    }
  })

  const getImageUrl = (image: string | File): string => {
    if (image instanceof File) {
      return URL.createObjectURL(image)
    }
    if (typeof image === 'string' && image.startsWith('/')) {
      return `${BaseUrl}${image}`
    }
    return image
  }

  // Filter products for search
  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header with action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-medium">Product Attributes</h3>
          <div className="flex items-center space-x-2">
            <StableSwitch
              id="productAllowAddWithoutChoices"
              checked={productAllowAddWithoutChoices}
              onCheckedChange={updateProductAllowAddWithoutChoices}
            />
            <Label htmlFor="productAllowAddWithoutChoices" className="text-sm font-medium">
              Allow add without choices
            </Label>
            <span className="text-xs text-gray-500">
              (Note: Can only be used if there are no mandatory attributes)
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateAttributeModal(true)}
            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
          >
            Create New
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddExistingModal(true)}
            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
          >
            Add Existing
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCopyAttributesModal(true)}
            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy Attributes
          </Button>
        </div>
      </div>

      {/* Product attributes list */}
      {loading ? (
        <div className="text-center py-8">Loading attributes...</div>
      ) : productAttributes.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          <p className="mb-4">No attributes added to this product yet.</p>
          <p className="text-sm">Use the buttons above to create new attributes or add existing ones.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {productAttributes.map((productAttribute) => (
            <div key={productAttribute.attribute.id} className="border rounded-lg bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-lg">{productAttribute.attribute.name}</h4>
                    <Badge variant={productAttribute.attribute.type === 'single' ? 'default' : 'secondary'}>
                      {productAttribute.attribute.type === 'single' ? 'Select a single option' : 'Select multiple options'}
                    </Badge>
                    {productAttribute.attribute.requiresSelection && (
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        Required
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShowAttributeOptions(productAttribute.attribute)}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAttribute(productAttribute.attribute.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete All
                    </Button>
                  </div>
                </div>

                {/* Options preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Options</span>
                    <span className="text-sm text-gray-500">{(productAttribute.options || []).length} options</span>
                  </div>
                  
                  {(productAttribute.options || []).length === 0 ? (
                    <div className="text-center py-4 text-gray-500 border-2 border-dashed rounded">
                      No options added. Click "Edit" to add options.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {(productAttribute.options || []).slice(0, 6).map((option) => (
                        <div key={option.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <span className="font-medium">{option.name}</span>
                          <span className="text-emerald-600 font-medium">£{option.price.toFixed(2)}</span>
                        </div>
                      ))}
                      {(productAttribute.options || []).length > 6 && (
                        <div className="flex items-center justify-center p-2 bg-gray-100 rounded text-sm text-gray-600">
                          +{(productAttribute.options || []).length - 6} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create New Attribute Modal */}
      <Dialog open={showCreateAttributeModal} onOpenChange={setShowCreateAttributeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Attribute</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="attributeName">Name</Label>
              <Input
                id="attributeName"
                value={newAttribute.name}
                onChange={(e) => setNewAttribute(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Choose Drink"
              />
            </div>

            <div>
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={newAttribute.displayOrder}
                onChange={(e) => setNewAttribute(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div>
              <Label>Attribute Type</Label>
              <select
                value={newAttribute.type}
                onChange={(e) => setNewAttribute(prev => ({ ...prev, type: e.target.value as 'single' | 'multiple' }))}
                className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
              >
                <option value="single">Select a single option</option>
                <option value="multiple">Select multiple options</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <StableSwitch
                id="requiresSelection"
                checked={newAttribute.requiresSelection}
                onCheckedChange={(checked) => setNewAttribute(prev => ({ ...prev, requiresSelection: checked }))}
              />
              <Label htmlFor="requiresSelection">Requires a selection</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateAttributeModal(false)}>
              Close
            </Button>
            <Button onClick={handleCreateAttribute} disabled={!newAttribute.name.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Existing Attribute Modal */}
      <Dialog open={showAddExistingModal} onOpenChange={setShowAddExistingModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Existing Attribute</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search attributes..."
                className="pl-10"
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {allAttributes
                .filter(attr => !productAttributes.some(pa => pa.attribute.id === attr.id))
                .map((attribute) => (
                <div key={attribute.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h4 className="font-medium">{attribute.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={attribute.type === 'single' ? 'default' : 'secondary'} className="text-xs">
                        {attribute.type}
                      </Badge>
                      {attribute.requiresSelection && (
                        <Badge variant="outline" className="text-xs text-red-600 border-red-600">
                          Required
                        </Badge>
                      )}
                    </div>
                    {attribute.description && (
                      <p className="text-sm text-gray-600 mt-1">{attribute.description}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddExistingAttribute(attribute.id)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddExistingModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copy Attributes Modal */}
      <Dialog open={showCopyAttributesModal} onOpenChange={setShowCopyAttributesModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Copy Attributes</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">What do you want to copy?</p>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => handleCopyButtonClick('from')}
              >
                <div className="text-left">
                  <div className="font-medium">Copy attributes from another item</div>
                  <div className="text-sm text-gray-500">to '{productName || 'this product'}'</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => handleCopyButtonClick('to')}
              >
                <div className="text-left">
                  <div className="font-medium">Copy attributes from '{productName || 'this product'}'</div>
                  <div className="text-sm text-gray-500">to another item</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => handleCopyButtonClick('category')}
                disabled={!categoryId}
              >
                <div className="text-left">
                  <div className="font-medium">Copy attributes from '{productName || 'this product'}'</div>
                  <div className="text-sm text-gray-500">to all items in a category</div>
                </div>
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCopyAttributesModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Selection Modal */}
      <Dialog open={showProductSelectionModal} onOpenChange={setShowProductSelectionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {copyType === 'from' ? 'Select Source Product' : 'Select Target Product'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCopyAttributes(copyType, product.id)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Select
                  </Button>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No products found
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProductSelectionModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attribute Options Modal */}
      <Dialog open={showAttributeOptionsModal} onOpenChange={setShowAttributeOptionsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Attribute Options for: {selectedAttributeForOptions?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAttributeForOptions && (
            <div className="space-y-4">
              {/* Attribute info */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Badge variant={selectedAttributeForOptions.type === 'single' ? 'default' : 'secondary'}>
                  {selectedAttributeForOptions.type}
                </Badge>
                {selectedAttributeForOptions.requiresSelection && (
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    Required
                  </Badge>
                )}
              </div>

              {/* Options table */}
              <div className="border rounded-lg">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Options</h4>
                    <Button
                      size="sm"
                      onClick={handleAddOption}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Option
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Price Adjustment</th>
                        <th className="text-center p-3 font-medium">Hidden for Today</th>
                        <th className="text-center p-3 font-medium">Fully Hidden</th>
                        <th className="text-right p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productAttributes
                        .find(pa => pa.attribute.id === selectedAttributeForOptions.id)
                        ?.options?.map((option) => (
                        <tr key={option.id} className="border-t hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              {option.image && (
                                <Image
                                  src={getImageUrl(option.image)}
                                  alt={option.name}
                                  width={40}
                                  height={40}
                                  className="rounded object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium">{option.name}</div>
                                {option.description && (
                                  <div className="text-sm text-gray-500">{option.description}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-emerald-600 font-medium">
                              £{option.price.toFixed(2)}
                            </span>
                          </td>
                          <td className="text-center p-3">
                            <StableSwitch
                              checked={option.hiddenForToday || false}
                              onCheckedChange={(checked) => handleUpdateHiddenStatus(option.id, 'hiddenForToday', checked)}
                            />
                          </td>
                          <td className="text-center p-3">
                            <StableSwitch
                              checked={option.fullyHidden || false}
                              onCheckedChange={(checked) => handleUpdateHiddenStatus(option.id, 'fullyHidden', checked)}
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditOption(option)}
                                className="text-emerald-600 hover:text-emerald-700"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteOption(option.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )) || []}
                    </tbody>
                  </table>
                </div>

                {(!productAttributes.find(pa => pa.attribute.id === selectedAttributeForOptions.id)?.options?.length) && (
                  <div className="text-center py-8 text-gray-500">
                    No options added yet. Click "Add Option" to get started.
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAttributeOptionsModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Option Modal */}
      <Dialog open={showAddOptionModal || showEditOptionModal} onOpenChange={(open) => {
        if (!open) {
          setShowAddOptionModal(false)
          setShowEditOptionModal(false)
          setCurrentOption(null)
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentOption ? 'Edit' : 'Add'} Attribute Option for: {selectedAttributeForOptions?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="optionName">Name</Label>
              <Input
                id="optionName"
                value={newOption.name}
                onChange={(e) => setNewOption(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Still Water"
              />
            </div>

            <div>
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={newOption.displayOrder}
                onChange={(e) => setNewOption(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div>
              <Label htmlFor="priceAdjustment">Price Adjustment</Label>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  id="priceAdjustment"
                  type="number"
                  step="0.01"
                  value={newOption.price}
                  onChange={(e) => setNewOption(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="calorificValue">Calorific Value</Label>
              <Input
                id="calorificValue"
                type="number"
                value={newOption.calorificValue}
                onChange={(e) => setNewOption(prev => ({ ...prev, calorificValue: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                value={newOption.weight}
                onChange={(e) => setNewOption(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="e.g., 500ml"
              />
            </div>

            <div>
              <Label>Image Upload (optional)</Label>
              <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-gray-400">
                <input {...getInputProps()} />
                {newOption.image ? (
                  <div className="flex items-center justify-center">
                    <Image
                      src={getImageUrl(newOption.image)}
                      alt="Option preview"
                      width={100}
                      height={100}
                      className="rounded object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm">Click to choose a file or drag it here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddOptionModal(false)
              setShowEditOptionModal(false)
              setCurrentOption(null)
            }}>
              Close
            </Button>
            <Button onClick={handleSaveOption} disabled={!newOption.name.trim()}>
              {currentOption ? 'Save Changes' : 'Add & Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 