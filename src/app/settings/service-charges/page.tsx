"use client"

import { useState, useEffect } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Eye, Edit, Trash2, Plus, Loader2 } from "lucide-react"
import { serviceChargeService, type ServiceCharge } from "@/services/service-charge.service"
import { toast } from "sonner"

export default function ServiceChargesPage() {
  const [charges, setCharges] = useState<ServiceCharge[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCharge, setEditingCharge] = useState<ServiceCharge | null>(null)

  // Load data on component mount
  useEffect(() => {
    loadServiceCharges()
  }, [])

  const loadServiceCharges = async () => {
    try {
      setLoading(true)
      const response = await serviceChargeService.getServiceCharges()
      setCharges(response.data)
    } catch (error) {
      console.error('Error loading service charges:', error)
      toast.error('Failed to load service charges')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingCharge(null)
    setIsAddModalOpen(true)
  }

  const handleEdit = (charge: ServiceCharge) => {
    setEditingCharge(charge)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service charge?')) return
    
    try {
      await serviceChargeService.deleteServiceCharge(id)
      toast.success('Service charge deleted successfully')
      loadServiceCharges()
    } catch (error) {
      console.error('Error deleting service charge:', error)
      toast.error('Failed to delete service charge')
    }
  }

  const handleSaveEdit = async (updatedCharge: Partial<ServiceCharge>) => {
    if (!editingCharge) return
    
    try {
      await serviceChargeService.updateServiceCharge(editingCharge._id, updatedCharge)
      toast.success('Service charge updated successfully')
      setIsEditModalOpen(false)
      loadServiceCharges()
    } catch (error) {
      console.error('Error updating service charge:', error)
      toast.error('Failed to update service charge')
    }
  }

  const handleSaveAdd = async (newCharge: Partial<ServiceCharge>) => {
    try {
      await serviceChargeService.createServiceCharge(newCharge)
      toast.success('Service charge created successfully')
      setIsAddModalOpen(false)
      loadServiceCharges()
    } catch (error) {
      console.error('Error creating service charge:', error)
      toast.error('Failed to create service charge')
    }
  }

  const ServiceChargeModal = ({ 
    isOpen, 
    onClose, 
    charge, 
    onSave,
    title
  }: { 
    isOpen: boolean
    onClose: () => void
    charge: ServiceCharge | null
    onSave: (charge: Partial<ServiceCharge>) => void
    title: string
  }) => {
    const [formData, setFormData] = useState<Partial<ServiceCharge>>(
      charge || {
        orderType: "All",
        chargeType: "Fixed",
        value: 0,
        minSpend: 0,
        maxSpend: 0,
        optional: false,
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
              <Label>Order Type</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.orderType || "All"}
                onChange={(e) => setFormData({ ...formData, orderType: e.target.value as any })}
              >
                <option value="All">All Orders</option>
                <option value="Collection">Collection</option>
                <option value="Delivery">Delivery</option>
                <option value="Table">Table Ordering</option>
              </select>
            </div>

            <div>
              <Label>Charge Type</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.chargeType || "Fixed"}
                onChange={(e) => setFormData({ ...formData, chargeType: e.target.value as any })}
              >
                <option value="Fixed">Fixed Amount</option>
                <option value="Percentage">Percentage</option>
              </select>
            </div>

            <div>
              <Label htmlFor="value">
                Charge Value {formData.chargeType === 'Percentage' ? '(%)' : '(£)'}
              </Label>
              <Input
                id="value"
                type="number"
                step={formData.chargeType === 'Percentage' ? "0.1" : "0.01"}
                value={formData.value || 0}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="minSpend">Min Spend (£)</Label>
              <Input
                id="minSpend"
                type="number"
                step="0.01"
                value={formData.minSpend || 0}
                onChange={(e) => setFormData({ ...formData, minSpend: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="maxSpend">Max Spend (£) - 0 for no limit</Label>
              <Input
                id="maxSpend"
                type="number"
                step="0.01"
                value={formData.maxSpend || 0}
                onChange={(e) => setFormData({ ...formData, maxSpend: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="optional"
                checked={formData.optional || false}
                onCheckedChange={(checked) => setFormData({ ...formData, optional: checked })}
              />
              <Label htmlFor="optional">Optional (customer can choose to add)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive !== false}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
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
            <h1 className="text-2xl font-medium">Service Charges</h1>
            <Button 
              onClick={handleAdd}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service Charge
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Service Charges</h2>
              <p className="text-sm text-gray-600 mt-1">
                Configure service charges for different order types
              </p>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading service charges...
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Order Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Charge Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Value</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Min Spend</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Max Spend</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {charges.map((charge) => (
                      <tr key={charge._id}>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            serviceChargeService.getOrderTypeBadgeColor(charge.orderType)
                          }`}>
                            {charge.orderType === 'All' ? 'All Orders' : charge.orderType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            serviceChargeService.getChargeTypeBadgeColor(charge.chargeType)
                          }`}>
                            {charge.chargeType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {charge.chargeType === 'Percentage' 
                            ? `${charge.value}%` 
                            : serviceChargeService.formatCurrency(charge.value)
                          }
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {serviceChargeService.formatCurrency(charge.minSpend)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {charge.maxSpend > 0 ? serviceChargeService.formatCurrency(charge.maxSpend) : 'No limit'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            serviceChargeService.getOptionalBadgeColor(charge.optional)
                          }`}>
                            {charge.optional ? 'Optional' : 'Mandatory'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            serviceChargeService.getChargeStatusBadgeColor(charge.isActive)
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
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                          No service charges found. Add your first service charge to get started.
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
      <ServiceChargeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        charge={editingCharge}
        onSave={handleSaveEdit}
        title="Edit Service Charge"
      />

      <ServiceChargeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        charge={null}
        onSave={handleSaveAdd}
        title="Add Service Charge"
      />
    </PageLayout>
  )
} 