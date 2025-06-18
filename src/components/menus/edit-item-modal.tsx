'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useDropzone } from 'react-dropzone'
import { Image as LucideImage, X, Plus, Minus, Percent, PoundSterling, Edit, Trash2, Copy } from 'lucide-react'
import Image from 'next/image'
import { MenuItem, DayAvailability, TimeSlot, Allergen, PriceChange } from '@/types/menu'
import { StableSwitch } from '@/components/ui/stable-switch'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'
import { AttributesTab } from './attributes-tab'
import React from 'react'
import { BaseUrl } from '@/lib/config'
import api from '@/lib/axios'
import { priceChangesService, ProductPriceChange } from '@/services/price-changes.service'

interface EditItemModalProps {
  item: MenuItem | null
  categoryId: string
  open: boolean
  onClose: () => void
  onSave: (item: MenuItem) => void
}

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

const DEFAULT_AVAILABILITY: DayAvailability = {
  isAvailable: true,
  type: 'All Day',
  times: []
}

const COMMON_ALLERGENS: Allergen[] = [
  { id: 'celery', name: 'Celery' },
  { id: 'crustaceans', name: 'Crustaceans' },
  { id: 'eggs', name: 'Eggs' },
  { id: 'fish', name: 'Fish' },
  { id: 'gluten', name: 'Gluten' },
  { id: 'lupin', name: 'Lupin' },
  { id: 'milk', name: 'Milk' },
  { id: 'molluscs', name: 'Molluscs' },
  { id: 'mustard', name: 'Mustard' },
  { id: 'nuts', name: 'Nuts' },
  { id: 'peanuts', name: 'Peanuts' },
  { id: 'sesame', name: 'Sesame' },
  { id: 'soya', name: 'Soya' },
  { id: 'sulphites', name: 'Sulphites' }
]

const DEFAULT_PRICE_CHANGE: PriceChange = {
  id: '',
  name: '',
  type: 'increase',
  value: 0,
  startDate: format(new Date(), 'yyyy-MM-dd'),
  endDate: format(new Date(), 'yyyy-MM-dd'),
  daysOfWeek: [],
  active: true
}

export function EditItemModal({ item, categoryId, open, onClose, onSave }: EditItemModalProps) {
  const [currentItem, setCurrentItem] = useState<MenuItem>(() => {
    if (item) {
      // If item exists, we're in edit mode
      return {
        id: item.id,
        name: item.name || '',
        description: item.description || '',
        price: item.price || 0,
        weight: item.weight || 0,
        calorificValue: item.calorificValue || '',
        calorieDetails: item.calorieDetails || '',
        hideItem: item.hideItem || false,
        delivery: item.delivery || true,
        collection: item.collection || true,
        dineIn: item.dineIn || true,
        category: categoryId,
        images: item.images || [],
        availability: item.availability || DAYS_OF_WEEK.reduce((acc, day) => ({
          ...acc,
          [day]: { ...DEFAULT_AVAILABILITY }
        }), {}),
        allergens: item.allergens || {
          contains: [],
          mayContain: []
        },
        priceChanges: [], // Will be loaded from API
        selectedItems: item.selectedItems || [],
        itemSettings: item.itemSettings || {
          showSelectedOnly: false,
          showSelectedCategories: false,
          limitSingleChoice: false,
          addAttributeCharges: false,
          useProductPrices: false,
          showChoiceAsDropdown: false,
        },
        tillProviderProductId: item.tillProviderProductId || '',
        cssClass: item.cssClass || '',
        freeDelivery: item.freeDelivery || false,
        collectionOnly: item.collectionOnly || false,
        deleted: item.deleted || false,
        hidePrice: item.hidePrice || false,
        allowAddWithoutChoices: item.allowAddWithoutChoices || false,
      }
    } else {
      // If no item, we're in add new mode
      return {
        id: '',
        name: '',
        price: 0,
        hideItem: false,
        delivery: true,
        collection: true,
        dineIn: true,
        category: categoryId,
        availability: DAYS_OF_WEEK.reduce((acc, day) => ({
          ...acc,
          [day]: { ...DEFAULT_AVAILABILITY }
        }), {}),
        allergens: {
          contains: [],
          mayContain: []
        },
        priceChanges: [],
        selectedItems: [],
        itemSettings: {
          showSelectedOnly: false,
          showSelectedCategories: false,
          limitSingleChoice: false,
          addAttributeCharges: false,
          useProductPrices: false,
          showChoiceAsDropdown: false,
        },
        tillProviderProductId: '',
        cssClass: '',
        freeDelivery: false,
        collectionOnly: false,
        deleted: false,
        hidePrice: false,
        allowAddWithoutChoices: false,
      }
    }
  })
  
  const [currentTab, setCurrentTab] = useState('details');
  const [apiPriceChanges, setApiPriceChanges] = useState<ProductPriceChange[]>([]);
  const [loadingPriceChanges, setLoadingPriceChanges] = useState(false);

  // Helper function to convert ProductPriceChange to PriceChange
  const convertToPriceChange = (apiPriceChange: ProductPriceChange): PriceChange => {
    return {
      id: apiPriceChange.id,
      name: apiPriceChange.name,
      type: apiPriceChange.type as 'increase' | 'decrease' | 'fixed',
      value: apiPriceChange.value,
      startDate: format(new Date(apiPriceChange.startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(apiPriceChange.endDate), 'yyyy-MM-dd'),
      daysOfWeek: apiPriceChange.daysOfWeek,
      timeStart: apiPriceChange.timeStart,
      timeEnd: apiPriceChange.timeEnd,
      active: apiPriceChange.active
    };
  };

  // Load price changes from API when modal opens with an existing item
  useEffect(() => {
    const loadPriceChanges = async () => {
      if (!item?.id || !open) return;
      
      setLoadingPriceChanges(true);
      try {
        const response = await priceChangesService.getProductPriceChanges(item.id);
        if (response.success) {
          setApiPriceChanges(response.data);
        } else {
          console.error('Failed to load price changes:', response);
        }
      } catch (error) {
        console.error('Error loading price changes:', error);
      } finally {
        setLoadingPriceChanges(false);
      }
    };

    loadPriceChanges();
  }, [item?.id, open]);

  // Effect to update currentItem when item prop changes
  useEffect(() => {
    if (item) {
      // Ensure itemSettings is properly processed from the API response
      const itemSettings = {
        showSelectedOnly: Boolean(item.itemSettings?.showSelectedOnly),
        showSelectedCategories: Boolean(item.itemSettings?.showSelectedCategories),
        limitSingleChoice: Boolean(item.itemSettings?.limitSingleChoice),
        addAttributeCharges: Boolean(item.itemSettings?.addAttributeCharges),
        useProductPrices: Boolean(item.itemSettings?.useProductPrices),
        showChoiceAsDropdown: Boolean(item.itemSettings?.showChoiceAsDropdown)
      };
      
      console.log("Raw itemSettings from API:", item.itemSettings);
      console.log("Processed itemSettings:", itemSettings);
      
      // Log top-level settings to debug
      console.log("Top-level settings from API:", {
        tillProviderProductId: item.tillProviderProductId,
        cssClass: item.cssClass,
        freeDelivery: item.freeDelivery,
        collectionOnly: item.collectionOnly,
        deleted: item.deleted,
        hidePrice: item.hidePrice
      });
      
      setCurrentItem({
        id: item.id,
        name: item.name || '',
        description: item.description || '',
        price: item.price || 0,
        weight: item.weight || 0,
        calorificValue: item.calorificValue || '',
        calorieDetails: item.calorieDetails || '',
        hideItem: item.hideItem || false,
        delivery: item.delivery || true,
        collection: item.collection || true,
        dineIn: item.dineIn || true,
        category: categoryId,
        images: item.images || [],
        availability: item.availability || DAYS_OF_WEEK.reduce((acc, day) => ({
          ...acc,
          [day]: { ...DEFAULT_AVAILABILITY }
        }), {}),
        allergens: item.allergens || {
          contains: [],
          mayContain: []
        },
        priceChanges: [],
        selectedItems: item.selectedItems || [],
        itemSettings: itemSettings,
        // Explicitly convert all top-level settings to their proper types
        tillProviderProductId: item.tillProviderProductId || '',
        cssClass: item.cssClass || '',
        freeDelivery: Boolean(item.freeDelivery),
        collectionOnly: Boolean(item.collectionOnly),
        deleted: Boolean(item.deleted),
        hidePrice: Boolean(item.hidePrice),
        allowAddWithoutChoices: item.allowAddWithoutChoices || false,
      })
    }
  }, [item, categoryId])

  const [editingPriceChange, setEditingPriceChange] = useState<PriceChange | null>(null)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    onDrop: (acceptedFiles) => {
      const imageUrls = acceptedFiles.map(file => URL.createObjectURL(file))
      setCurrentItem(prev => ({
        ...prev,
        images: [...(prev.images || []), ...acceptedFiles]
      }))
    }
  })

  const getImageUrl = (image: string | File | Blob): string => {
    if (image instanceof File || image instanceof Blob) {
      return URL.createObjectURL(image)
    }
    // For server-side images, add the base URL if the path is relative
    if (typeof image === 'string' && image.startsWith('/')) {
      return `${BaseUrl}${image}`
    }
    return image
  }

  const handleSave = async () => {
    try {
      const formData = new FormData()

      // Add all current item data to formData
      formData.append('name', currentItem.name)
      formData.append('price', currentItem.price.toString())
      formData.append('description', currentItem.description || '')
      formData.append('weight', (currentItem.weight || '').toString())
      formData.append('calorificValue', currentItem.calorificValue || '')
      formData.append('calorieDetails', currentItem.calorieDetails || '')
      formData.append('hideItem', currentItem.hideItem.toString())
      formData.append('delivery', currentItem.delivery.toString())
      formData.append('collection', currentItem.collection.toString())
      formData.append('dineIn', currentItem.dineIn.toString())
      formData.append('category', categoryId)
      
      // Add new fields with proper boolean to string conversion
      formData.append('tillProviderProductId', currentItem.tillProviderProductId || '')
      formData.append('cssClass', currentItem.cssClass || '')
      formData.append('freeDelivery', Boolean(currentItem.freeDelivery).toString())
      formData.append('collectionOnly', Boolean(currentItem.collectionOnly).toString())
      formData.append('deleted', Boolean(currentItem.deleted).toString())
      formData.append('hidePrice', Boolean(currentItem.hidePrice).toString())
      
      // Fetch the current allowAddWithoutChoices value from the product instead of using currentItem
      let allowAddWithoutChoicesValue = currentItem.allowAddWithoutChoices;
      
      // If this is an existing product, get the current value from the server
      if (currentItem.id) {
        try {
          const productResponse = await api.get(`/products/${currentItem.id}`)
          if (productResponse.data.success) {
            allowAddWithoutChoicesValue = Boolean(productResponse.data.data.allowAddWithoutChoices)
          }
        } catch (error) {
          console.error('Error fetching current product settings:', error)
        }
      }
      
      formData.append('allowAddWithoutChoices', Boolean(allowAddWithoutChoicesValue).toString())
      
      // Mark this as a regular item (not a group item)
      formData.append('isGroupItem', 'false')

      // Log top-level settings being sent to the server
      console.log("Sending top-level settings to server:", {
        freeDelivery: Boolean(currentItem.freeDelivery),
        collectionOnly: Boolean(currentItem.collectionOnly),
        deleted: Boolean(currentItem.deleted),
        hidePrice: Boolean(currentItem.hidePrice),
        allowAddWithoutChoices: Boolean(currentItem.allowAddWithoutChoices)
      });

      // Add availability, allergens, and priceChanges as JSON strings
      formData.append('availability', JSON.stringify(currentItem.availability))
      formData.append('allergens', JSON.stringify(currentItem.allergens))
      formData.append('priceChanges', JSON.stringify([]))
      
      // For regular items, we don't need selectedItems and itemSettings
      // These are only for group items
      formData.append('selectedItems', JSON.stringify([]))
      formData.append('itemSettings', JSON.stringify({
        showSelectedOnly: false,
        showSelectedCategories: false,
        limitSingleChoice: false,
        addAttributeCharges: false,
        useProductPrices: false,
        showChoiceAsDropdown: false,
      }))

      // Handle images
      if (currentItem.images) {
        // Handle new image files (those added in the current session)
        const newImages = currentItem.images.filter(image => image instanceof File || image instanceof Blob)
        newImages.forEach((image) => {
          formData.append('images', image)
        })

        // Handle existing image URLs (those loaded from the server)
        const existingImages = currentItem.images
          .filter(image => typeof image === 'string')
          .filter(image => typeof image === 'string' && !image.startsWith('blob:'))
          
        if (existingImages.length > 0) {
          // Tell the backend to keep these existing images
          formData.append('existingImages', JSON.stringify(existingImages))
        } else if (currentItem.id && newImages.length === 0) {
          // If we're updating an item, and there are no new or existing images,
          // send an empty array to indicate all images should be removed
          formData.append('existingImages', JSON.stringify([]))
        }
      }

      // Get the correct ID for the API call
      const productId = currentItem.id || item?.id
      
      const url = productId ? 
        `/products/${productId}` : 
        `/products`

      const method = productId ? 'PUT' : 'POST'

      const response = await api[method.toLowerCase()](url, formData)
      const data = response.data
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to save item')
      }

      // Transform the response data to match MenuItem type
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
        selectedItems: data.data.selectedItems?.map(item => typeof item === 'object' ? item._id || item.id : item) || [],
        itemSettings: data.data.itemSettings || {
          showSelectedOnly: false,
          showSelectedCategories: false,
          limitSingleChoice: false,
          addAttributeCharges: false,
          useProductPrices: false,
          showChoiceAsDropdown: false,
        },
        // Explicitly convert top-level settings to ensure proper types
        tillProviderProductId: data.data.tillProviderProductId || '',
        cssClass: data.data.cssClass || '',
        freeDelivery: Boolean(data.data.freeDelivery),
        collectionOnly: Boolean(data.data.collectionOnly),
        deleted: Boolean(data.data.deleted),
        hidePrice: Boolean(data.data.hidePrice),
        allowAddWithoutChoices: Boolean(data.data.allowAddWithoutChoices),
      }
      
      toast.success(`Item ${productId ? 'updated' : 'created'} successfully`);
      onSave(transformedItem)
      onClose()
    } catch (error) {
      console.error('Error saving item:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save item')
    }
  }

  const removeImage = (index: number) => {
    setCurrentItem(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }))
  }

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof MenuItem
  ) => {
    setCurrentItem(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof MenuItem
  ) => {
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value)
    setCurrentItem(prev => ({ ...prev, [field]: value }))
  }

  const handleAvailabilityTypeChange = (day: typeof DAYS_OF_WEEK[number], type: DayAvailability['type']) => {
    setCurrentItem(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability?.[day],
          type,
          times: type === 'Specific Times' ? [{ start: '09:00', end: '17:00' }] : []
        }
      }
    }))
  }

  const handleAvailabilityToggle = (day: typeof DAYS_OF_WEEK[number]) => {
    setCurrentItem(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability?.[day],
          isAvailable: !prev.availability?.[day]?.isAvailable
        }
      }
    }))
  }

  const addTimeSlot = (day: typeof DAYS_OF_WEEK[number]) => {
    setCurrentItem(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability?.[day],
          times: [...(prev.availability?.[day]?.times || []), { start: '09:00', end: '17:00' }]
        }
      }
    }))
  }

  const removeTimeSlot = (day: typeof DAYS_OF_WEEK[number], index: number) => {
    setCurrentItem(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability?.[day],
          times: prev.availability?.[day]?.times?.filter((_, i) => i !== index)
        }
      }
    }))
  }

  const updateTimeSlot = (
    day: typeof DAYS_OF_WEEK[number],
    index: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    setCurrentItem(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability?.[day],
          times: prev.availability?.[day]?.times?.map((slot, i) =>
            i === index ? { ...slot, [field]: value } : slot
          )
        }
      }
    }))
  }

  const toggleAllergen = (allergenId: string, type: 'contains' | 'mayContain') => {
    setCurrentItem(prev => {
      const allergens = prev.allergens || { contains: [], mayContain: [] }
      const currentList = allergens[type]
      const updatedList = currentList.includes(allergenId)
        ? currentList.filter(id => id !== allergenId)
        : [...currentList, allergenId]

      // If an allergen is added to 'contains', remove it from 'mayContain' and vice versa
      const otherType = type === 'contains' ? 'mayContain' : 'contains'
      const otherList = allergens[otherType].filter(id => id !== allergenId)

      return {
        ...prev,
        allergens: {
          ...allergens,
          [type]: updatedList,
          [otherType]: otherList
        }
      }
    })
  }

  const addPriceChange = () => {
    const newPriceChange: PriceChange = {
      ...DEFAULT_PRICE_CHANGE,
      id: new Date().getTime().toString()
    }
    setEditingPriceChange(newPriceChange)
  }

  const savePriceChange = async (priceChange: PriceChange) => {
    if (!currentItem.id) {
      toast.error('Please save the item first before adding price changes');
      return;
    }

    try {
      if (priceChange.id && apiPriceChanges.find(pc => pc.id === priceChange.id)) {
        // Update existing price change
        const response = await priceChangesService.updatePriceChange(priceChange.id, {
          name: priceChange.name,
          startDate: priceChange.startDate,
          endDate: priceChange.endDate,
          startPrice: currentItem.price,
          endPrice: priceChange.value,
          active: priceChange.active,
          daysOfWeek: priceChange.daysOfWeek || [],
          timeStart: priceChange.timeStart,
          timeEnd: priceChange.timeEnd
        });
        
        if (response.success) {
          toast.success('Price change updated successfully');
          // Reload price changes
          const updatedResponse = await priceChangesService.getProductPriceChanges(currentItem.id);
          if (updatedResponse.success) {
            setApiPriceChanges(updatedResponse.data);
          }
        } else {
          toast.error('Failed to update price change');
        }
      } else {
        // Create new price change
        const response = await priceChangesService.createIndividualPriceChange({
          productId: currentItem.id,
          name: priceChange.name,
          type: priceChange.type,
          value: priceChange.value,
          startDate: priceChange.startDate,
          endDate: priceChange.endDate,
          daysOfWeek: priceChange.daysOfWeek || [],
          timeStart: priceChange.timeStart,
          timeEnd: priceChange.timeEnd,
          active: priceChange.active
        });
        
        if (response.success) {
          toast.success('Price change created successfully');
          // Reload price changes
          const updatedResponse = await priceChangesService.getProductPriceChanges(currentItem.id);
          if (updatedResponse.success) {
            setApiPriceChanges(updatedResponse.data);
          }
        } else {
          toast.error('Failed to create price change');
        }
      }
    } catch (error) {
      console.error('Error saving price change:', error);
      toast.error('Failed to save price change');
    }
    
    setEditingPriceChange(null)
  }

  const deletePriceChange = async (id: string) => {
    if (!confirm('Are you sure you want to delete this price change?')) {
      return;
    }

    try {
      const response = await priceChangesService.deletePriceChange(id);
      
      if (response.success) {
        toast.success('Price change deleted successfully');
        // Reload price changes
        if (currentItem.id) {
          const updatedResponse = await priceChangesService.getProductPriceChanges(currentItem.id);
          if (updatedResponse.success) {
            setApiPriceChanges(updatedResponse.data);
          }
        }
      } else {
        toast.error('Failed to delete price change');
      }
    } catch (error) {
      console.error('Error deleting price change:', error);
      toast.error('Failed to delete price change');
    }
  }

  const togglePriceChangeActive = useCallback(async (id: string) => {
    try {
      const response = await priceChangesService.togglePriceChange(id);
      
      if (response.success) {
        toast.success('Price change status updated');
        // Reload price changes
        if (currentItem.id) {
          const updatedResponse = await priceChangesService.getProductPriceChanges(currentItem.id);
          if (updatedResponse.success) {
            setApiPriceChanges(updatedResponse.data);
          }
        }
      } else {
        toast.error('Failed to update price change status');
      }
    } catch (error) {
      console.error('Error toggling price change:', error);
      toast.error('Failed to update price change status');
    }
  }, [currentItem.id]);
  
  // Memoize Switch handlers to prevent infinite loops
  const handleAvailabilityToggleCallback = useCallback((day: typeof DAYS_OF_WEEK[number]) => {
    setCurrentItem(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability?.[day],
          isAvailable: !prev.availability?.[day]?.isAvailable
        }
      }
    }));
  }, []);

  // Use useMemo instead of useEffect for callbacksRef to prevent unnecessary updates
  const callbacks = useMemo(() => {
    // Create callbacks for price changes
    const priceChangeCallbacks: Record<string, () => void> = {};
    apiPriceChanges.forEach(priceChange => {
      priceChangeCallbacks[priceChange.id] = () => {
        togglePriceChangeActive(priceChange.id);
      };
    });
    
    // Create callbacks for days
    const dayCallbacks: Record<string, () => void> = {};
    DAYS_OF_WEEK.forEach(day => {
      dayCallbacks[day] = () => {
        handleAvailabilityToggleCallback(day);
      };
    });
    
    return {
      priceChanges: priceChangeCallbacks,
      days: dayCallbacks
    };
  }, [apiPriceChanges, togglePriceChangeActive, handleAvailabilityToggleCallback]);

  // Replace callbacksRef.current with callbacks from useMemo
  const callbacksRef = React.useRef(callbacks);
  
  // Update ref only when callbacks change
  React.useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Function to duplicate the current product
  const handleDuplicate = async () => {
    if (!item?.id) {
      toast.error('Cannot duplicate an unsaved item');
      return;
    }

    try {
      // Create a new formData with all the current item data
      const formData = new FormData();
      
      // Set a new name with "(Copy)" suffix
      formData.append('name', `${currentItem.name} (Copy)`);
      formData.append('price', currentItem.price.toString());
      formData.append('description', currentItem.description || '');
      formData.append('weight', (currentItem.weight || '').toString());
      formData.append('calorificValue', currentItem.calorificValue || '');
      formData.append('calorieDetails', currentItem.calorieDetails || '');
      formData.append('hideItem', currentItem.hideItem.toString());
      formData.append('delivery', currentItem.delivery.toString());
      formData.append('collection', currentItem.collection.toString());
      formData.append('dineIn', currentItem.dineIn.toString());
      formData.append('category', categoryId);
      
      // Add new fields with proper boolean conversion
      formData.append('tillProviderProductId', currentItem.tillProviderProductId || '');
      formData.append('cssClass', currentItem.cssClass || '');
      formData.append('freeDelivery', Boolean(currentItem.freeDelivery).toString());
      formData.append('collectionOnly', Boolean(currentItem.collectionOnly).toString());
      formData.append('deleted', Boolean(currentItem.deleted).toString());
      formData.append('hidePrice', Boolean(currentItem.hidePrice).toString());
      
      // Fetch the current allowAddWithoutChoices value from the product
      let allowAddWithoutChoicesValue = currentItem.allowAddWithoutChoices;
      
      try {
        const productResponse = await api.get(`/products/${item.id}`)
        if (productResponse.data.success) {
          allowAddWithoutChoicesValue = Boolean(productResponse.data.data.allowAddWithoutChoices)
        }
      } catch (error) {
        console.error('Error fetching current product settings:', error)
      }
      
      formData.append('allowAddWithoutChoices', Boolean(allowAddWithoutChoicesValue).toString());
      
      // Mark this as a regular item (not a group item)
      formData.append('isGroupItem', 'false');

      // Add availability, allergens, and priceChanges as JSON strings
      formData.append('availability', JSON.stringify(currentItem.availability));
      formData.append('allergens', JSON.stringify(currentItem.allergens));
      formData.append('priceChanges', JSON.stringify([]));
      formData.append('selectedItems', JSON.stringify([]));
      formData.append('itemSettings', JSON.stringify({
        showSelectedOnly: false,
        showSelectedCategories: false,
        limitSingleChoice: false,
        addAttributeCharges: false,
        useProductPrices: false,
        showChoiceAsDropdown: false,
      }));
      
      // Log what we're sending to the server
      console.log("Duplicating item with settings:", {
        freeDelivery: Boolean(currentItem.freeDelivery),
        collectionOnly: Boolean(currentItem.collectionOnly),
        deleted: Boolean(currentItem.deleted),
        hidePrice: Boolean(currentItem.hidePrice),
        allowAddWithoutChoices: Boolean(currentItem.allowAddWithoutChoices)
      });

      // Handle existing images - we'll reference them as URLs
      if (currentItem.images && currentItem.images.length > 0) {
        const existingImages = currentItem.images
          .filter(image => typeof image === 'string')
          .filter(image => typeof image === 'string' && !image.startsWith('blob:'));
          
        if (existingImages.length > 0) {
          formData.append('existingImages', JSON.stringify(existingImages));
        }
        
        // Also handle any new image files that have been added but not saved yet
        const newImages = currentItem.images.filter(image => image instanceof File || image instanceof Blob);
        newImages.forEach((image) => {
          formData.append('images', image);
        });
      }

      // Create the new product
      const response = await api.post('/products', formData);
      const data = response.data;
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to duplicate item');
      }

      toast.success('Item duplicated successfully');
      
      // Transform the response data to match MenuItem type
      const duplicatedItem: MenuItem = {
        id: data.data._id || data.data.id,
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
        category: data.data.category._id || data.data.category.id,
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
        selectedItems: data.data.selectedItems?.map(item => typeof item === 'object' ? item._id || item.id : item) || [],
        itemSettings: data.data.itemSettings || {
          showSelectedOnly: false,
          showSelectedCategories: false,
          limitSingleChoice: false,
          addAttributeCharges: false,
          useProductPrices: false,
          showChoiceAsDropdown: false,
        },
        // Explicitly convert top-level settings to ensure proper types
        tillProviderProductId: data.data.tillProviderProductId || '',
        cssClass: data.data.cssClass || '',
        freeDelivery: Boolean(data.data.freeDelivery),
        collectionOnly: Boolean(data.data.collectionOnly),
        deleted: Boolean(data.data.deleted),
        hidePrice: Boolean(data.data.hidePrice),
        allowAddWithoutChoices: Boolean(data.data.allowAddWithoutChoices),
      };
      
      // Save the duplicated item
      onSave(duplicatedItem);
      onClose();
    } catch (error) {
      console.error('Error duplicating item:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to duplicate item');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="price-changes">Price Changes</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="allergens">Allergens</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={currentItem.name}
                  onChange={(e) => handleTextChange(e, 'name')}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={currentItem.description || ''}
                  onChange={(e) => handleTextChange(e, 'description')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (£)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={currentItem.price}
                    onChange={(e) => handleNumberChange(e, 'price')}
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Weight (g)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={currentItem.weight || ''}
                    onChange={(e) => handleNumberChange(e, 'weight')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="calorificValue">Calorific Value</Label>
                <Input
                  id="calorificValue"
                  value={currentItem.calorificValue || ''}
                  onChange={(e) => handleTextChange(e, 'calorificValue')}
                />
              </div>

              <div>
                <Label htmlFor="calorieDetails">Calorie Details</Label>
                <Textarea
                  id="calorieDetails"
                  value={currentItem.calorieDetails || ''}
                  onChange={(e) => handleTextChange(e, 'calorieDetails')}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-gray-400">
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <LucideImage className="h-12 w-12 text-gray-400" />
                <p className="mt-2">Drag & drop images here, or click to select files</p>
                <p className="text-sm text-gray-500">Supports: JPG, PNG, WebP</p>
              </div>
            </div>

            {currentItem.images && currentItem.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {currentItem.images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={getImageUrl(image)}
                      alt={`Menu item image ${index + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="price-changes" className="space-y-6">
            <div className="space-y-4">
              {apiPriceChanges.map(priceChange => (
                <div
                  key={priceChange.id}
                  className={`border rounded-lg p-4 ${
                    priceChange.active ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <StableSwitch
                        checked={priceChange.active}
                        onCheckedChange={callbacksRef.current.priceChanges[priceChange.id]}
                      />
                      <div>
                        <h4 className="font-medium">{priceChange.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {priceChange.type === 'increase' && (
                            <>
                              <Percent className="h-4 w-4" />
                              <span>+{priceChange.value}%</span>
                            </>
                          )}
                          {priceChange.type === 'decrease' && (
                            <>
                              <Percent className="h-4 w-4" />
                              <span>-{priceChange.value}%</span>
                            </>
                          )}
                          {priceChange.type === 'fixed' && (
                            <>
                              <PoundSterling className="h-4 w-4" />
                              <span>£{priceChange.tempPrice?.toFixed(2) || priceChange.value.toFixed(2)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPriceChange(convertToPriceChange(priceChange))}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => deletePriceChange(priceChange.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <div>
                      {format(new Date(priceChange.startDate), 'dd MMM yyyy')} -
                      {format(new Date(priceChange.endDate), 'dd MMM yyyy')}
                    </div>
                    {priceChange.daysOfWeek.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {priceChange.daysOfWeek.map(day => (
                          <Badge key={day} variant="secondary" className="capitalize">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {priceChange.timeStart && priceChange.timeEnd && (
                      <div className="mt-1">
                        {priceChange.timeStart} - {priceChange.timeEnd}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={addPriceChange}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Price Change
              </Button>
            </div>

            {editingPriceChange && (
              <Dialog open={true} onOpenChange={() => setEditingPriceChange(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingPriceChange.id ? 'Edit Price Change' : 'Add Price Change'}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editingPriceChange.name}
                        onChange={(e) => setEditingPriceChange(prev => ({
                          ...prev!,
                          name: e.target.value
                        }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Type</Label>
                        <select
                          value={editingPriceChange.type}
                          onChange={(e) => 
                            setEditingPriceChange(prev => ({
                              ...prev!,
                              type: e.target.value as PriceChange['type']
                            }))
                          }
                          className="w-full h-10 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <option value="increase">Increase (%)</option>
                          <option value="decrease">Decrease (%)</option>
                          <option value="fixed">Fixed Price (£)</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="value">Value</Label>
                        <Input
                          id="value"
                          type="number"
                          step={editingPriceChange.type === 'fixed' ? '0.01' : '1'}
                          value={editingPriceChange.value}
                          onChange={(e) => setEditingPriceChange(prev => ({
                            ...prev!,
                            value: parseFloat(e.target.value) || 0
                          }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={editingPriceChange.startDate}
                          onChange={(e) => setEditingPriceChange(prev => ({
                            ...prev!,
                            startDate: e.target.value
                          }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={editingPriceChange.endDate}
                          onChange={(e) => setEditingPriceChange(prev => ({
                            ...prev!,
                            endDate: e.target.value
                          }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Days of Week</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {DAYS_OF_WEEK.map(day => (
                          <Badge
                            key={day}
                            variant={editingPriceChange.daysOfWeek.includes(day) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              setEditingPriceChange(prev => {
                                const daysOfWeek = prev!.daysOfWeek.includes(day)
                                  ? prev!.daysOfWeek.filter(d => d !== day)
                                  : [...prev!.daysOfWeek, day]
                                return { ...prev!, daysOfWeek }
                              })
                            }}
                          >
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timeStart">Start Time (Optional)</Label>
                        <Input
                          id="timeStart"
                          type="time"
                          value={editingPriceChange.timeStart || ''}
                          onChange={(e) => setEditingPriceChange(prev => ({
                            ...prev!,
                            timeStart: e.target.value
                          }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="timeEnd">End Time (Optional)</Label>
                        <Input
                          id="timeEnd"
                          type="time"
                          value={editingPriceChange.timeEnd || ''}
                          onChange={(e) => setEditingPriceChange(prev => ({
                            ...prev!,
                            timeEnd: e.target.value
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditingPriceChange(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => savePriceChange(editingPriceChange)}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          <TabsContent value="attributes">
            {currentItem.id ? (
              <AttributesTab 
                productId={currentItem.id}
                productName={currentItem.name}
                categoryId={categoryId}
                onAttributesChange={(attributes) => {
                  console.log('Product attributes updated:', attributes)
                }}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Please save the item first before adding attributes.
              </div>
            )}
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            {DAYS_OF_WEEK.map(day => {
              const dayAvailability = currentItem.availability?.[day]
              return (
                <div key={day} className="space-y-4 border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <StableSwitch
                        checked={dayAvailability?.isAvailable ?? false}
                        onCheckedChange={callbacksRef.current.days[day]}
                      />
                      <Label className="capitalize">{day}</Label>
                    </div>
                    <select
                      value={dayAvailability?.type}
                      onChange={(e) => 
                        handleAvailabilityTypeChange(day, e.target.value as DayAvailability['type'])
                      }
                      disabled={!dayAvailability?.isAvailable}
                      className="w-[180px] rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="All Day">All Day</option>
                      <option value="Specific Times">Specific Times</option>
                      <option value="Not Available">Not Available</option>
                    </select>
                  </div>

                  {dayAvailability?.isAvailable && dayAvailability.type === 'Specific Times' && (
                    <div className="space-y-2 pl-10">
                      {dayAvailability.times?.map((timeSlot, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <Input
                            type="time"
                            value={timeSlot.start}
                            onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                            className="w-32"
                          />
                          <span>to</span>
                          <Input
                            type="time"
                            value={timeSlot.end}
                            onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                            className="w-32"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </TabsContent>

          <TabsContent value="allergens" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Contains</h3>
                <div className="flex flex-wrap gap-2">
                  {COMMON_ALLERGENS.map(allergen => {
                    const isContains = currentItem.allergens?.contains.includes(allergen.id)
                    const isMayContain = currentItem.allergens?.mayContain.includes(allergen.id)
                    
                    return (
                      <Badge
                        key={allergen.id}
                        variant={isContains ? "default" : "outline"}
                        className={`cursor-pointer ${
                          isContains ? 'bg-red-500 hover:bg-red-600' : 
                          isMayContain ? 'text-amber-500 border-amber-500' : ''
                        }`}
                        onClick={() => toggleAllergen(allergen.id, 'contains')}
                      >
                        {allergen.name}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">May Contain</h3>
                <div className="flex flex-wrap gap-2">
                  {COMMON_ALLERGENS.map(allergen => {
                    const isContains = currentItem.allergens?.contains.includes(allergen.id)
                    const isMayContain = currentItem.allergens?.mayContain.includes(allergen.id)
                    
                    return (
                      <Badge
                        key={allergen.id}
                        variant={isMayContain ? "default" : "outline"}
                        className={`cursor-pointer ${
                          isMayContain ? 'bg-amber-500 hover:bg-amber-600' : 
                          isContains ? 'text-red-500 border-red-500' : ''
                        }`}
                        onClick={() => toggleAllergen(allergen.id, 'mayContain')}
                      >
                        {allergen.name}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-500">
                  Click on an allergen to toggle its status. An allergen cannot be both "Contains" and "May Contain" at the same time.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-4">
              <div>
                <Label htmlFor="tillProviderProductId">Till Provider Product ID</Label>
                <Input
                  id="tillProviderProductId"
                  value={currentItem.tillProviderProductId || ''}
                  onChange={(e) => handleTextChange(e, 'tillProviderProductId')}
                />
              </div>

              <div>
                <Label htmlFor="cssClass">CSS Class</Label>
                <Input
                  id="cssClass"
                  value={currentItem.cssClass || ''}
                  onChange={(e) => handleTextChange(e, 'cssClass')}
                />
              </div>

              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <StableSwitch
                    id="hidePrice"
                    checked={Boolean(currentItem.hidePrice)}
                    onCheckedChange={(checked) => setCurrentItem(prev => ({ ...prev, hidePrice: checked }))}
                  />
                  <Label htmlFor="hidePrice">Hide Price</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <StableSwitch
                    id="hideItem"
                    checked={Boolean(currentItem.hideItem)}
                    onCheckedChange={(checked) => setCurrentItem(prev => ({ ...prev, hideItem: checked }))}
                  />
                  <Label htmlFor="hideItem">Hide Item</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <StableSwitch
                    id="freeDelivery"
                    checked={Boolean(currentItem.freeDelivery)}
                    onCheckedChange={(checked) => setCurrentItem(prev => ({ ...prev, freeDelivery: checked }))}
                  />
                  <Label htmlFor="freeDelivery">Free Delivery</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between gap-2 mt-4">
          {item && currentTab !== "attributes" && (
            <Button variant="outline" onClick={handleDuplicate} className="flex items-center">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
          )}
          <div className={`flex justify-end gap-2 ${currentTab !== "attributes" || !item ? "" : "w-full"} ml-auto`}>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 