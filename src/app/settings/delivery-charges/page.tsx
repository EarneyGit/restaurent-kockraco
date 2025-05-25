"use client"

import { useState, useEffect } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Plus, Eye, Loader2 } from "lucide-react"
import { deliveryChargeService, type DeliveryCharge, type PriceOverride, type PostcodeExclusion } from "@/services/delivery-charge.service"
import { toast } from "sonner"

export default function DeliveryChargesPage() {
  // Delivery Charges State
  const [charges, setCharges] = useState<DeliveryCharge[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [editingCharge, setEditingCharge] = useState<DeliveryCharge | null>(null)
  const [bulkCharges, setBulkCharges] = useState<Partial<DeliveryCharge>[]>([])

  // Price Overrides State
  const [priceOverrides, setPriceOverrides] = useState<PriceOverride[]>([])
  const [overridesLoading, setOverridesLoading] = useState(true)
  const [isEditOverrideModalOpen, setIsEditOverrideModalOpen] = useState(false)
  const [isAddOverrideModalOpen, setIsAddOverrideModalOpen] = useState(false)
  const [editingOverride, setEditingOverride] = useState<PriceOverride | null>(null)

  // Postcode Exclusions State
  const [postcodeExclusions, setPostcodeExclusions] = useState<PostcodeExclusion[]>([])
  const [exclusionsLoading, setExclusionsLoading] = useState(true)
  const [isEditExclusionModalOpen, setIsEditExclusionModalOpen] = useState(false)
  const [isAddExclusionModalOpen, setIsAddExclusionModalOpen] = useState(false)
  const [editingExclusion, setEditingExclusion] = useState<PostcodeExclusion | null>(null)

  // Load data on component mount
  useEffect(() => {
    loadDeliveryCharges()
    loadPriceOverrides()
    loadPostcodeExclusions()
  }, [])

  const loadDeliveryCharges = async () => {
    try {
      setLoading(true)
      const response = await deliveryChargeService.getDeliveryCharges()
      setCharges(response.data)
    } catch (error) {
      console.error('Error loading delivery charges:', error)
      toast.error('Failed to load delivery charges')
    } finally {
      setLoading(false)
    }
  }

  const loadPriceOverrides = async () => {
    try {
      setOverridesLoading(true)
      const response = await deliveryChargeService.getPriceOverrides()
      setPriceOverrides(response.data)
    } catch (error) {
      console.error('Error loading price overrides:', error)
      toast.error('Failed to load price overrides')
    } finally {
      setOverridesLoading(false)
    }
  }

  const loadPostcodeExclusions = async () => {
    try {
      setExclusionsLoading(true)
      const response = await deliveryChargeService.getPostcodeExclusions()
      setPostcodeExclusions(response.data)
    } catch (error) {
      console.error('Error loading postcode exclusions:', error)
      toast.error('Failed to load postcode exclusions')
    } finally {
      setExclusionsLoading(false)
    }
  }

  // Delivery Charges Handlers
  const handleEdit = (charge: DeliveryCharge) => {
    setEditingCharge(charge)
    setIsEditModalOpen(true)
  }

  const handleAdd = () => {
    setEditingCharge(null)
    setIsAddModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this delivery charge?')) return
    
    try {
      await deliveryChargeService.deleteDeliveryCharge(id)
      toast.success('Delivery charge deleted successfully')
      loadDeliveryCharges()
    } catch (error) {
      console.error('Error deleting delivery charge:', error)
      toast.error('Failed to delete delivery charge')
    }
  }

  const handleSaveEdit = async (updatedCharge: Partial<DeliveryCharge>) => {
    if (!editingCharge) return
    
    try {
      await deliveryChargeService.updateDeliveryCharge(editingCharge._id, updatedCharge)
      toast.success('Delivery charge updated successfully')
      setIsEditModalOpen(false)
      loadDeliveryCharges()
    } catch (error) {
      console.error('Error updating delivery charge:', error)
      toast.error('Failed to update delivery charge')
    }
  }

  const handleSaveAdd = async (newCharge: Partial<DeliveryCharge>) => {
    try {
      await deliveryChargeService.createDeliveryCharge(newCharge)
      toast.success('Delivery charge created successfully')
      setIsAddModalOpen(false)
      loadDeliveryCharges()
    } catch (error) {
      console.error('Error creating delivery charge:', error)
      toast.error('Failed to create delivery charge')
    }
  }

  const handleBulkAdd = () => {
    setBulkCharges([
      {
        maxDistance: 3.5,
        minSpend: 0,
        maxSpend: 0,
        charge: 3.50
      },
      {
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
      maxDistance: 0,
      minSpend: 0,
      maxSpend: 0,
      charge: 0
    }])
  }

  const handleBulkSave = async () => {
    try {
      await deliveryChargeService.createBulkDeliveryCharges(bulkCharges)
      toast.success('Bulk delivery charges created successfully')
      setIsBulkModalOpen(false)
      setBulkCharges([])
      loadDeliveryCharges()
    } catch (error) {
      console.error('Error creating bulk delivery charges:', error)
      toast.error('Failed to create bulk delivery charges')
    }
  }

  const updateBulkCharge = (index: number, field: keyof DeliveryCharge, value: number) => {
    setBulkCharges(bulkCharges.map((charge, i) =>
      i === index ? { ...charge, [field]: value } : charge
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

  const handleDeleteOverride = async (id: string) => {
    if (!confirm('Are you sure you want to delete this price override?')) return
    
    try {
      await deliveryChargeService.deletePriceOverride(id)
      toast.success('Price override deleted successfully')
      loadPriceOverrides()
    } catch (error) {
      console.error('Error deleting price override:', error)
      toast.error('Failed to delete price override')
    }
  }

  const handleSaveEditOverride = async (updatedOverride: Partial<PriceOverride>) => {
    if (!editingOverride) return
    
    try {
      await deliveryChargeService.updatePriceOverride(editingOverride._id, updatedOverride)
      toast.success('Price override updated successfully')
      setIsEditOverrideModalOpen(false)
      loadPriceOverrides()
    } catch (error) {
      console.error('Error updating price override:', error)
      toast.error('Failed to update price override')
    }
  }

  const handleSaveAddOverride = async (newOverride: Partial<PriceOverride>) => {
    try {
      await deliveryChargeService.createPriceOverride(newOverride)
      toast.success('Price override created successfully')
      setIsAddOverrideModalOpen(false)
      loadPriceOverrides()
    } catch (error) {
      console.error('Error creating price override:', error)
      toast.error('Failed to create price override')
    }
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

  const handleDeleteExclusion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this postcode exclusion?')) return
    
    try {
      await deliveryChargeService.deletePostcodeExclusion(id)
      toast.success('Postcode exclusion deleted successfully')
      loadPostcodeExclusions()
    } catch (error) {
      console.error('Error deleting postcode exclusion:', error)
      toast.error('Failed to delete postcode exclusion')
    }
  }

  const handleSaveEditExclusion = async (updatedExclusion: Partial<PostcodeExclusion>) => {
    if (!editingExclusion) return
    
    try {
      await deliveryChargeService.updatePostcodeExclusion(editingExclusion._id, updatedExclusion)
      toast.success('Postcode exclusion updated successfully')
      setIsEditExclusionModalOpen(false)
      loadPostcodeExclusions()
    } catch (error) {
      console.error('Error updating postcode exclusion:', error)
      toast.error('Failed to update postcode exclusion')
    }
  }

  const handleSaveAddExclusion = async (newExclusion: Partial<PostcodeExclusion>) => {
    try {
      await deliveryChargeService.createPostcodeExclusion(newExclusion)
      toast.success('Postcode exclusion created successfully')
      setIsAddExclusionModalOpen(false)
      loadPostcodeExclusions()
    } catch (error) {
      console.error('Error creating postcode exclusion:', error)
      toast.error('Failed to create postcode exclusion')
    }
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
    onSave: (charge: Partial<DeliveryCharge>) => void
    title: string
  }) => {
    const [formData, setFormData] = useState<Partial<DeliveryCharge>>(
      charge || {
        maxDistance: 0,
        minSpend: 0,
        maxSpend: 0,
        charge: 0,
        isActive: true
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
              <Label htmlFor="maxDistance">Max Distance (miles)</Label>
              <Input
                id="maxDistance"
                type="number"
                step="0.1"
                value={formData.maxDistance || 0}
                onChange={(e) => setFormData({ ...formData, maxDistance: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="minSpend">Min Spend</Label>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  id="minSpend"
                  type="number"
                  step="0.01"
                  value={formData.minSpend || 0}
                  onChange={(e) => setFormData({ ...formData, minSpend: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="maxSpend">Max Spend (0 for no limit)</Label>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  id="maxSpend"
                  type="number"
                  step="0.01"
                  value={formData.maxSpend || 0}
                  onChange={(e) => setFormData({ ...formData, maxSpend: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="charge">Delivery Charge</Label>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  id="charge"
                  type="number"
                  step="0.01"
                  value={formData.charge || 0}
                  onChange={(e) => setFormData({ ...formData, charge: parseFloat(e.target.value) || 0 })}
                />
              </div>
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
    <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Bulk Add Delivery Charges</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">Max Distance</th>
                  <th className="border border-gray-300 p-2 text-left">Min Spend</th>
                  <th className="border border-gray-300 p-2 text-left">Max Spend</th>
                  <th className="border border-gray-300 p-2 text-left">Charge</th>
                </tr>
              </thead>
              <tbody>
                {bulkCharges.map((charge, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={charge.maxDistance || 0}
                        onChange={(e) => updateBulkCharge(index, 'maxDistance', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={charge.minSpend || 0}
                        onChange={(e) => updateBulkCharge(index, 'minSpend', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={charge.maxSpend || 0}
                        onChange={(e) => updateBulkCharge(index, 'maxSpend', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={charge.charge || 0}
                        onChange={(e) => updateBulkCharge(index, 'charge', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button onClick={handleAddBulkRow} variant="outline">
            Add Row
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsBulkModalOpen(false)}>Close</Button>
          <Button onClick={handleBulkSave}>Save All Charges</Button>
        </DialogFooter>
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
    onSave: (override: Partial<PriceOverride>) => void
    title: string
  }) => {
    const [formData, setFormData] = useState<Partial<PriceOverride>>(
      override || {
        prefix: "",
        postfix: "",
        minSpend: 0,
        charge: 0,
        isActive: true
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
                type="text"
                value={formData.prefix || ""}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value.toUpperCase() })}
                placeholder="e.g., SW1"
              />
            </div>

            <div>
              <Label htmlFor="postfix">Postcode Postfix (optional)</Label>
              <Input
                id="postfix"
                type="text"
                value={formData.postfix || ""}
                onChange={(e) => setFormData({ ...formData, postfix: e.target.value.toUpperCase() })}
                placeholder="e.g., 1AA"
              />
            </div>

            <div>
              <Label htmlFor="minSpend">Min Spend</Label>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  id="minSpend"
                  type="number"
                  step="0.01"
                  value={formData.minSpend || 0}
                  onChange={(e) => setFormData({ ...formData, minSpend: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="charge">Override Charge</Label>
              <div className="flex items-center">
                <span className="mr-2">£</span>
                <Input
                  id="charge"
                  type="number"
                  step="0.01"
                  value={formData.charge || 0}
                  onChange={(e) => setFormData({ ...formData, charge: parseFloat(e.target.value) || 0 })}
                />
              </div>
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
    onSave: (exclusion: Partial<PostcodeExclusion>) => void
    title: string
  }) => {
    const [formData, setFormData] = useState<Partial<PostcodeExclusion>>(
      exclusion || {
        prefix: "",
        postfix: "",
        reason: "Area not served",
        isActive: true
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
                type="text"
                value={formData.prefix || ""}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value.toUpperCase() })}
                placeholder="e.g., SW1"
              />
            </div>

            <div>
              <Label htmlFor="postfix">Postcode Postfix (optional)</Label>
              <Input
                id="postfix"
                type="text"
                value={formData.postfix || ""}
                onChange={(e) => setFormData({ ...formData, postfix: e.target.value.toUpperCase() })}
                placeholder="e.g., 1AA"
              />
            </div>

            <div>
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                type="text"
                value={formData.reason || ""}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="e.g., Area not served"
              />
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-medium">Delivery Charges</h1>
            <div className="flex gap-2">
              <Button 
                onClick={handleBulkAdd}
                variant="outline"
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              >
                Bulk Add
              </Button>
              <Button 
                onClick={handleAdd}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Charge
              </Button>
            </div>
          </div>

          {/* Delivery Charges Table */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Distance-Based Charges</h2>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading delivery charges...
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Max Distance</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Min Spend</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Max Spend</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Charge</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {charges.map((charge) => (
                      <tr key={charge._id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{charge.maxDistance} miles</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {deliveryChargeService.formatCurrency(charge.minSpend)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {charge.maxSpend > 0 ? deliveryChargeService.formatCurrency(charge.maxSpend) : 'No limit'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {deliveryChargeService.formatCurrency(charge.charge)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            deliveryChargeService.getChargeStatusBadgeColor(charge.isActive)
                          }`}>
                            {charge.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
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
                              className="text-red-500"
                              onClick={() => handleDelete(charge._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {charges.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No delivery charges found. Add your first charge to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Price Overrides Table */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-medium">Postcode Price Overrides</h2>
              <Button 
                onClick={handleAddOverride}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Override
              </Button>
            </div>
            <div className="overflow-x-auto">
              {overridesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading price overrides...
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Postcode</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Min Spend</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Override Charge</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {priceOverrides.map((override) => (
                      <tr key={override._id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{override.fullPostcode}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {deliveryChargeService.formatCurrency(override.minSpend)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {deliveryChargeService.formatCurrency(override.charge)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            deliveryChargeService.getChargeStatusBadgeColor(override.isActive)
                          }`}>
                            {override.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditOverride(override)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => handleDeleteOverride(override._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {priceOverrides.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No price overrides found. Add overrides for specific postcodes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Postcode Exclusions Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-medium">Postcode Exclusions</h2>
              <Button 
                onClick={handleAddExclusion}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exclusion
              </Button>
            </div>
            <div className="overflow-x-auto">
              {exclusionsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading postcode exclusions...
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Postcode</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Reason</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {postcodeExclusions.map((exclusion) => (
                      <tr key={exclusion._id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{exclusion.fullPostcode}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{exclusion.reason}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            deliveryChargeService.getChargeStatusBadgeColor(exclusion.isActive)
                          }`}>
                            {exclusion.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditExclusion(exclusion)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => handleDeleteExclusion(exclusion._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {postcodeExclusions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                          No postcode exclusions found. Add exclusions for areas you don't serve.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
        title="Edit Postcode Exclusion"
      />

      <PostcodeExclusionModal
        isOpen={isAddExclusionModalOpen}
        onClose={() => setIsAddExclusionModalOpen(false)}
        exclusion={null}
        onSave={handleSaveAddExclusion}
        title="Add Postcode Exclusion"
      />
    </PageLayout>
  )
} 