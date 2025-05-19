"use client"

import { useState } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Plus, Eye } from "lucide-react"

interface DeliveryCharge {
  id: string
  maxDistance: number
  minSpend: number
  maxSpend: number
  charge: number
}

interface PriceOverride {
  id: string
  prefix: string
  postfix: string
  minSpend: number
  charge: number
}

interface PostcodeExclusion {
  id: string
  prefix: string
  postfix: string
}

export default function DeliveryChargesPage() {
  const [charges, setCharges] = useState<DeliveryCharge[]>([
    {
      id: "1",
      maxDistance: 3.5,
      minSpend: 0,
      maxSpend: 0,
      charge: 3.50
    },
    {
      id: "2",
      maxDistance: 2.0,
      minSpend: 0,
      maxSpend: 0,
      charge: 3.00
    }
  ])

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [editingCharge, setEditingCharge] = useState<DeliveryCharge | null>(null)
  const [bulkCharges, setBulkCharges] = useState<DeliveryCharge[]>([])

  const [priceOverrides, setPriceOverrides] = useState<PriceOverride[]>([])
  const [postcodeExclusions, setPostcodeExclusions] = useState<PostcodeExclusion[]>([])
  const [isEditOverrideModalOpen, setIsEditOverrideModalOpen] = useState(false)
  const [isAddOverrideModalOpen, setIsAddOverrideModalOpen] = useState(false)
  const [isBulkOverrideModalOpen, setIsBulkOverrideModalOpen] = useState(false)
  const [editingOverride, setEditingOverride] = useState<PriceOverride | null>(null)
  const [bulkOverrides, setBulkOverrides] = useState<PriceOverride[]>([])
  const [isEditExclusionModalOpen, setIsEditExclusionModalOpen] = useState(false)
  const [isAddExclusionModalOpen, setIsAddExclusionModalOpen] = useState(false)
  const [editingExclusion, setEditingExclusion] = useState<PostcodeExclusion | null>(null)

  const handleEdit = (charge: DeliveryCharge) => {
    setEditingCharge(charge)
    setIsEditModalOpen(true)
  }

  const handleAdd = () => {
    setEditingCharge(null)
    setIsAddModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setCharges(charges.filter(charge => charge.id !== id))
  }

  const handleSaveEdit = (updatedCharge: DeliveryCharge) => {
    setCharges(charges.map(charge => 
      charge.id === updatedCharge.id ? updatedCharge : charge
    ))
    setIsEditModalOpen(false)
  }

  const handleSaveAdd = (newCharge: DeliveryCharge) => {
    setCharges([...charges, { ...newCharge, id: Math.random().toString() }])
    setIsAddModalOpen(false)
  }

  const handleBulkAdd = () => {
    setBulkCharges([
      {
        id: "bulk1",
        maxDistance: 3.5,
        minSpend: 0,
        maxSpend: 0,
        charge: 3.50
      },
      {
        id: "bulk2",
        maxDistance: 2.0,
        minSpend: 0,
        maxSpend: 0,
        charge: 3.00
      }
    ])
    setIsBulkModalOpen(true)
  }

  const handleAddBulkRow = () => {
    setBulkCharges([...bulkCharges, {
      id: `bulk${bulkCharges.length + 1}`,
      maxDistance: 0,
      minSpend: 0,
      maxSpend: 0,
      charge: 0
    }])
  }

  const handleBulkSave = () => {
    setCharges([...charges, ...bulkCharges.map(charge => ({
      ...charge,
      id: Math.random().toString()
    }))])
    setIsBulkModalOpen(false)
  }

  const updateBulkCharge = (id: string, field: keyof DeliveryCharge, value: number) => {
    setBulkCharges(bulkCharges.map(charge =>
      charge.id === id ? { ...charge, [field]: value } : charge
    ))
  }

  // Price Override Handlers
  const handleEditOverride = (override: PriceOverride) => {
    setEditingOverride(override)
    setIsEditOverrideModalOpen(true)
  }

  const handleAddOverride = () => {
    setEditingOverride(null)
    setIsAddOverrideModalOpen(true)
  }

  const handleDeleteOverride = (id: string) => {
    setPriceOverrides(priceOverrides.filter(override => override.id !== id))
  }

  const handleSaveEditOverride = (updatedOverride: PriceOverride) => {
    setPriceOverrides(priceOverrides.map(override => 
      override.id === updatedOverride.id ? updatedOverride : override
    ))
    setIsEditOverrideModalOpen(false)
  }

  const handleSaveAddOverride = (newOverride: PriceOverride) => {
    setPriceOverrides([...priceOverrides, { ...newOverride, id: Math.random().toString() }])
    setIsAddOverrideModalOpen(false)
  }

  const handleBulkAddOverride = () => {
    setBulkOverrides([{
      id: "bulk1",
      prefix: "",
      postfix: "",
      minSpend: 0,
      charge: 0
    }])
    setIsBulkOverrideModalOpen(true)
  }

  const handleAddBulkOverrideRow = () => {
    setBulkOverrides([...bulkOverrides, {
      id: `bulk${bulkOverrides.length + 1}`,
      prefix: "",
      postfix: "",
      minSpend: 0,
      charge: 0
    }])
  }

  const handleBulkOverrideSave = () => {
    setPriceOverrides([...priceOverrides, ...bulkOverrides.map(override => ({
      ...override,
      id: Math.random().toString()
    }))])
    setIsBulkOverrideModalOpen(false)
  }

  const updateBulkOverride = (id: string, field: keyof PriceOverride, value: string | number) => {
    setBulkOverrides(bulkOverrides.map(override =>
      override.id === id ? { ...override, [field]: value } : override
    ))
  }

  // Postcode Exclusion Handlers
  const handleEditExclusion = (exclusion: PostcodeExclusion) => {
    setEditingExclusion(exclusion)
    setIsEditExclusionModalOpen(true)
  }

  const handleAddExclusion = () => {
    setEditingExclusion(null)
    setIsAddExclusionModalOpen(true)
  }

  const handleDeleteExclusion = (id: string) => {
    setPostcodeExclusions(postcodeExclusions.filter(exclusion => exclusion.id !== id))
  }

  const handleSaveEditExclusion = (updatedExclusion: PostcodeExclusion) => {
    setPostcodeExclusions(postcodeExclusions.map(exclusion => 
      exclusion.id === updatedExclusion.id ? updatedExclusion : exclusion
    ))
    setIsEditExclusionModalOpen(false)
  }

  const handleSaveAddExclusion = (newExclusion: PostcodeExclusion) => {
    setPostcodeExclusions([...postcodeExclusions, { ...newExclusion, id: Math.random().toString() }])
    setIsAddExclusionModalOpen(false)
  }

  const DeliveryChargeModal = ({ 
    isOpen, 
    onClose, 
    charge, 
    onSave,
    title
  }: { 
    isOpen: boolean
    onClose: () => void
    charge: DeliveryCharge | null
    onSave: (charge: DeliveryCharge) => void
    title: string
  }) => {
    const [formData, setFormData] = useState<DeliveryCharge>(
      charge || {
        id: "",
        maxDistance: 0,
        minSpend: 0,
        maxSpend: 0,
        charge: 0
      }
    )

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="minSpend">Min Spend</Label>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  id="minSpend"
                  type="number"
                  step="0.01"
                  value={formData.minSpend}
                  onChange={(e) => setFormData({ ...formData, minSpend: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Leave at £0.00 for no minimum spend</p>
            </div>

            <div>
              <Label htmlFor="maxSpend">Max Spend</Label>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  id="maxSpend"
                  type="number"
                  step="0.01"
                  value={formData.maxSpend}
                  onChange={(e) => setFormData({ ...formData, maxSpend: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Leave at £0.00 for no maximum spend</p>
            </div>

            <div>
              <Label htmlFor="charge">Charge</Label>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  id="charge"
                  type="number"
                  step="0.01"
                  value={formData.charge}
                  onChange={(e) => setFormData({ ...formData, charge: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="maxDistance">Max Distance (mi)</Label>
              <Input
                id="maxDistance"
                type="number"
                step="0.1"
                value={formData.maxDistance}
                onChange={(e) => setFormData({ ...formData, maxDistance: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={() => onSave(formData)}>
              {charge ? 'Save Charge' : 'Add Charge'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const BulkEditModal = () => (
    <Dialog open={isBulkModalOpen} onOpenChange={() => setIsBulkModalOpen(false)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Bulk Edit Delivery Charges</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 font-medium">
            <div>Max Distance(mi)</div>
            <div>Min Spend</div>
            <div>Max Spend</div>
            <div>Price</div>
          </div>

          {bulkCharges.map((charge) => (
            <div key={charge.id} className="grid grid-cols-4 gap-4">
              <Input
                type="number"
                step="0.1"
                value={charge.maxDistance}
                onChange={(e) => updateBulkCharge(charge.id, 'maxDistance', parseFloat(e.target.value) || 0)}
              />
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  type="number"
                  step="0.01"
                  value={charge.minSpend}
                  onChange={(e) => updateBulkCharge(charge.id, 'minSpend', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  type="number"
                  step="0.01"
                  value={charge.maxSpend}
                  onChange={(e) => updateBulkCharge(charge.id, 'maxSpend', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  type="number"
                  step="0.01"
                  value={charge.charge}
                  onChange={(e) => updateBulkCharge(charge.id, 'charge', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleAddBulkRow}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsBulkModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const PriceOverrideModal = ({ 
    isOpen, 
    onClose, 
    override, 
    onSave,
    title
  }: { 
    isOpen: boolean
    onClose: () => void
    override: PriceOverride | null
    onSave: (override: PriceOverride) => void
    title: string
  }) => {
    const [formData, setFormData] = useState<PriceOverride>(
      override || {
        id: "",
        prefix: "",
        postfix: "",
        minSpend: 0,
        charge: 0
      }
    )

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="minSpend">Min Spend</Label>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  id="minSpend"
                  type="number"
                  step="0.01"
                  value={formData.minSpend}
                  onChange={(e) => setFormData({ ...formData, minSpend: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="charge">Charge</Label>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  id="charge"
                  type="number"
                  step="0.01"
                  value={formData.charge}
                  onChange={(e) => setFormData({ ...formData, charge: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="prefix">Postcode Prefix</Label>
              <Input
                id="prefix"
                value={formData.prefix}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
              />
              <p className="text-sm text-gray-500 mt-1">You must add a prefix</p>
            </div>

            <div>
              <Label htmlFor="postfix">Postcode Postfix</Label>
              <Input
                id="postfix"
                value={formData.postfix}
                onChange={(e) => setFormData({ ...formData, postfix: e.target.value })}
              />
              <p className="text-sm text-gray-500 mt-1">You may add a full or partial postfix</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={() => onSave(formData)}>
              {override ? 'Save Override' : 'Add Override'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const PostcodeExclusionModal = ({ 
    isOpen, 
    onClose, 
    exclusion, 
    onSave,
    title
  }: { 
    isOpen: boolean
    onClose: () => void
    exclusion: PostcodeExclusion | null
    onSave: (exclusion: PostcodeExclusion) => void
    title: string
  }) => {
    const [formData, setFormData] = useState<PostcodeExclusion>(
      exclusion || {
        id: "",
        prefix: "",
        postfix: ""
      }
    )

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="prefix">Postcode Prefix</Label>
              <Input
                id="prefix"
                value={formData.prefix}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
              />
              <p className="text-sm text-gray-500 mt-1">You must add a prefix</p>
            </div>

            <div>
              <Label htmlFor="postfix">Postcode Postfix</Label>
              <Input
                id="postfix"
                value={formData.postfix}
                onChange={(e) => setFormData({ ...formData, postfix: e.target.value })}
              />
              <p className="text-sm text-gray-500 mt-1">You may add a full or partial postfix</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={() => onSave(formData)}>
              {exclusion ? 'Save Exclusion' : 'Add Exclusion'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const BulkOverrideModal = () => (
    <Dialog open={isBulkOverrideModalOpen} onOpenChange={() => setIsBulkOverrideModalOpen(false)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Bulk Edit Price Overrides</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 font-medium">
            <div>Prefix</div>
            <div>Postfix</div>
            <div>Min Spend</div>
            <div>Price</div>
          </div>

          {bulkOverrides.map((override) => (
            <div key={override.id} className="grid grid-cols-4 gap-4">
              <Input
                value={override.prefix}
                onChange={(e) => updateBulkOverride(override.id, 'prefix', e.target.value)}
              />
              <Input
                value={override.postfix}
                onChange={(e) => updateBulkOverride(override.id, 'postfix', e.target.value)}
              />
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  type="number"
                  step="0.01"
                  value={override.minSpend}
                  onChange={(e) => updateBulkOverride(override.id, 'minSpend', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  type="number"
                  step="0.01"
                  value={override.charge}
                  onChange={(e) => updateBulkOverride(override.id, 'charge', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleAddBulkOverrideRow}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsBulkOverrideModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkOverrideSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <PageLayout>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-3 border-b bg-white">
        <div className="flex-1"></div>
        <h1 className="text-xl font-medium flex-1 text-center">Admin user</h1>
        <div className="flex justify-end flex-1">
          <button className="flex items-center text-gray-700 font-medium">
            <Eye className="h-5 w-5 mr-1" />
            View Your Store
          </button>
        </div>
      </header>
      
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-medium mb-4">Delivery Charges</h1>
          
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <p className="text-gray-600 mb-2">
              Set the delivery charges for delivering to customers based on their distance
            </p>
            <button className="text-blue-600 hover:underline">
              Reposition your outlet on a map
            </button>

            <div className="mt-6">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left px-4 py-2">Max Distance</th>
                      <th className="text-left px-4 py-2">Min Spend</th>
                      <th className="text-left px-4 py-2">Max Spend</th>
                      <th className="text-left px-4 py-2">Charge</th>
                      <th className="text-right px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {charges.map((charge) => (
                      <tr key={charge.id}>
                        <td className="px-4 py-2">{charge.maxDistance} mi</td>
                        <td className="px-4 py-2">
                          {charge.minSpend === 0 ? 'Any' : `£${charge.minSpend.toFixed(2)}`}
                        </td>
                        <td className="px-4 py-2">
                          {charge.maxSpend === 0 ? 'Any' : `£${charge.maxSpend.toFixed(2)}`}
                        </td>
                        <td className="px-4 py-2">£{charge.charge.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(charge)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(charge.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={handleBulkAdd}>
                  Add in Bulk
                </Button>
                <Button onClick={handleAdd}>
                  Add a Delivery Charge
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Price Overrides Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium">Price Overrides</h2>
              <p className="text-gray-600">Override the price for specific postcodes</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleBulkAddOverride}>
              bulk
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-4 py-2">Postcode Prefix</th>
                  <th className="text-left px-4 py-2">Postcode Postfix</th>
                  <th className="text-left px-4 py-2">Minimum Spend</th>
                  <th className="text-left px-4 py-2">Charge</th>
                  <th className="text-right px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {priceOverrides.map((override) => (
                  <tr key={override.id}>
                    <td className="px-4 py-2">{override.prefix}</td>
                    <td className="px-4 py-2">{override.postfix}</td>
                    <td className="px-4 py-2">£{override.minSpend.toFixed(2)}</td>
                    <td className="px-4 py-2">£{override.charge.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditOverride(override)}
                      >
                        <span className="text-emerald-500">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOverride(override.id)}
                      >
                        <span className="text-red-500">Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
                {priceOverrides.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No Price Overrides
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleAddOverride}>
              Add a Price Override
            </Button>
          </div>
        </div>

        {/* Postcode Exclusions Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium">Postcode Exclusions</h2>
              <p className="text-gray-600">
                List the postcodes that you WILL NOT deliver to, even if they qualify in the delivery charges above
              </p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-4 py-2">Postcode Prefix</th>
                  <th className="text-left px-4 py-2">Postcode Postfix</th>
                  <th className="text-right px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {postcodeExclusions.map((exclusion) => (
                  <tr key={exclusion.id}>
                    <td className="px-4 py-2">{exclusion.prefix}</td>
                    <td className="px-4 py-2">{exclusion.postfix}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditExclusion(exclusion)}
                      >
                        <span className="text-emerald-500">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExclusion(exclusion.id)}
                      >
                        <span className="text-red-500">Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
                {postcodeExclusions.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                      No Postcode Exclusions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleAddExclusion}>
              Add a Postcode Exclusion
            </Button>
          </div>
        </div>
      </div>

      <DeliveryChargeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        charge={editingCharge}
        onSave={handleSaveEdit}
        title="Edit Delivery Charge"
      />

      <DeliveryChargeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        charge={null}
        onSave={handleSaveAdd}
        title="Add Delivery Charge"
      />

      <BulkEditModal />

      <PriceOverrideModal
        isOpen={isEditOverrideModalOpen}
        onClose={() => setIsEditOverrideModalOpen(false)}
        override={editingOverride}
        onSave={handleSaveEditOverride}
        title="Edit Price Override"
      />

      <PriceOverrideModal
        isOpen={isAddOverrideModalOpen}
        onClose={() => setIsAddOverrideModalOpen(false)}
        override={null}
        onSave={handleSaveAddOverride}
        title="Add Price Override"
      />

      <PostcodeExclusionModal
        isOpen={isEditExclusionModalOpen}
        onClose={() => setIsEditExclusionModalOpen(false)}
        exclusion={editingExclusion}
        onSave={handleSaveEditExclusion}
        title="Edit an Exclusion"
      />

      <PostcodeExclusionModal
        isOpen={isAddExclusionModalOpen}
        onClose={() => setIsAddExclusionModalOpen(false)}
        exclusion={null}
        onSave={handleSaveAddExclusion}
        title="Add an Exclusion"
      />

      <BulkOverrideModal />
    </PageLayout>
  )
} 