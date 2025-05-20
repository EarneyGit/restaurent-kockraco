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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useDropzone } from 'react-dropzone'
import { Image as LucideImage, X, Plus, Minus, Percent, PoundSterling, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { MenuItem, DayAvailability, TimeSlot, Allergen, PriceChange } from '@/types/menu'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'

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
        priceChanges: item.priceChanges || []
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
      priceChanges: []
    }
    }
  })

  // Effect to update currentItem when item prop changes
  useEffect(() => {
    if (item) {
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
        priceChanges: item.priceChanges || []
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
      formData.append('branchId', "6829cec57032455faec894ab")
      formData.append('category', categoryId)

      // Add availability, allergens, and priceChanges
      // These are already objects, so we just need to stringify them
      formData.append('availability', JSON.stringify(currentItem.availability))
      formData.append('allergens', JSON.stringify(currentItem.allergens))
      formData.append('priceChanges', JSON.stringify(currentItem.priceChanges))

      // Handle images
      if (currentItem.images) {
        // Handle new image files
        currentItem.images.forEach((image) => {
          if (image instanceof File || image instanceof Blob) {
            formData.append('images', image)
          }
        })

        // Handle existing image URLs
        const existingImages = currentItem.images
          .filter(image => typeof image === 'string' && !image.startsWith('blob:'))
        if (existingImages.length > 0) {
          formData.append('existingImages', JSON.stringify(existingImages))
        }
      }

      const url = currentItem.id ? 
        `http://localhost:5000/api/products/${currentItem.id}` :
        'http://localhost:5000/api/products'

      const method = currentItem.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save item')
      }

      const data = await response.json()
      
      // Transform the response data to match MenuItem type
      const transformedItem = {
        id: data.data.id,
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
        category: data.data.category.id,
        images: data.data.images || [],
        availability: data.data.availability,
        allergens: data.data.allergens,
        priceChanges: data.data.priceChanges || []
      }
      
      onSave(transformedItem)
    onClose()
      toast.success(`Product ${currentItem.id ? 'updated' : 'created'} successfully`)
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

  const savePriceChange = (priceChange: PriceChange) => {
    setCurrentItem(prev => ({
      ...prev,
      priceChanges: [
        ...(prev.priceChanges || []).filter(pc => pc.id !== priceChange.id),
        priceChange
      ]
    }))
    setEditingPriceChange(null)
  }

  const deletePriceChange = (id: string) => {
    setCurrentItem(prev => ({
      ...prev,
      priceChanges: prev.priceChanges?.filter(pc => pc.id !== id) || []
    }))
  }

  const togglePriceChangeActive = (id: string) => {
    setCurrentItem(prev => ({
      ...prev,
      priceChanges: prev.priceChanges?.map(pc =>
        pc.id === id ? { ...pc, active: !pc.active } : pc
      ) || []
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="price-changes">Price Changes</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
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
              {currentItem.priceChanges?.map(priceChange => (
                <div
                  key={priceChange.id}
                  className={`border rounded-lg p-4 ${
                    priceChange.active ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={priceChange.active}
                        onCheckedChange={() => togglePriceChangeActive(priceChange.id)}
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
                              <span>£{priceChange.value.toFixed(2)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPriceChange(priceChange)}
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

          <TabsContent value="items">
            <p>Items content</p>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            {DAYS_OF_WEEK.map(day => {
              const dayAvailability = currentItem.availability?.[day]
              return (
                <div key={day} className="space-y-4 border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={dayAvailability?.isAvailable}
                        onCheckedChange={() => handleAvailabilityToggle(day)}
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeSlot(day, index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(day)}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Time Slot
                      </Button>
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
            <p>Settings content</p>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 