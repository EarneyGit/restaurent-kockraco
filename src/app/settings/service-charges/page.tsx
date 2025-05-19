"use client"

import { useState } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Eye } from "lucide-react"

interface ServiceCharge {
  id: string
  orderType: string
  chargeType: string
  value: number
  minSpend: number
  maxSpend: number
  optional: boolean
}

export default function ServiceChargesPage() {
  const [charges, setCharges] = useState<ServiceCharge[]>([
    {
      id: "1",
      orderType: "All",
      chargeType: "Fixed",
      value: 1.00,
      minSpend: 1.00,
      maxSpend: 10.00,
      optional: false
    }
  ])

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCharge, setEditingCharge] = useState<ServiceCharge | null>(null)

  const handleAdd = () => {
    setIsAddModalOpen(true)
  }

  const handleEdit = (charge: ServiceCharge) => {
    setEditingCharge(charge)
    setIsEditModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setCharges(charges.filter(charge => charge.id !== id))
  }

  const handleSaveEdit = (updatedCharge: ServiceCharge) => {
    setCharges(charges.map(charge => 
      charge.id === updatedCharge.id ? updatedCharge : charge
    ))
    setIsEditModalOpen(false)
  }

  const handleSaveAdd = (newCharge: ServiceCharge) => {
    setCharges([...charges, { ...newCharge, id: Math.random().toString() }])
    setIsAddModalOpen(false)
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
    onSave: (charge: ServiceCharge) => void
    title: string
  }) => {
    const [formData, setFormData] = useState<ServiceCharge>(
      charge || {
        id: "",
        orderType: "All",
        chargeType: "Fixed",
        value: 0,
        minSpend: 0,
        maxSpend: 0,
        optional: false
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
                value={formData.orderType}
                onChange={(e) => setFormData({ ...formData, orderType: e.target.value })}
              >
                <option value="All">All</option>
                <option value="Collection">Collection</option>
                <option value="Delivery">Delivery</option>
                <option value="Table">Table</option>
              </select>
            </div>

            <div>
              <Label>Charge Type</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.chargeType}
                onChange={(e) => setFormData({ ...formData, chargeType: e.target.value })}
              >
                <option value="Fixed">Fixed</option>
                <option value="Percentage">Percentage</option>
              </select>
            </div>

            <div>
              <Label htmlFor="value">Charge Value</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
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
                  value={formData.minSpend}
                  onChange={(e) => setFormData({ ...formData, minSpend: parseFloat(e.target.value) || 0 })}
                />
              </div>
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
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="optional"
                checked={formData.optional}
                onCheckedChange={(checked) => setFormData({ ...formData, optional: checked })}
              />
              <Label htmlFor="optional">Optional</Label>
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
            <Button onClick={handleAdd} variant="outline" className="bg-white hover:bg-gray-50">
              Add Service Charge
            </Button>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-2">Order Type</th>
                    <th className="text-left px-4 py-2">Value</th>
                    <th className="text-left px-4 py-2">Min Spend</th>
                    <th className="text-left px-4 py-2">Max Spend</th>
                    <th className="text-left px-4 py-2">Optional</th>
                    <th className="text-right px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {charges.map((charge) => (
                    <tr key={charge.id}>
                      <td className="px-4 py-2">{charge.orderType}</td>
                      <td className="px-4 py-2">
                        {charge.chargeType === 'Fixed' ? 
                          `£${charge.value.toFixed(2)}` : 
                          `${charge.value}%`
                        }
                      </td>
                      <td className="px-4 py-2">£{charge.minSpend.toFixed(2)}</td>
                      <td className="px-4 py-2">£{charge.maxSpend.toFixed(2)}</td>
                      <td className="px-4 py-2">{charge.optional ? 'True' : 'False'}</td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(charge)}
                        >
                          <span className="text-emerald-500">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(charge.id)}
                        >
                          <span className="text-red-500">Delete</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {charges.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No service charges added yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-center">
              <Button 
                variant="outline" 
                onClick={handleAdd}
                className="text-emerald-500 border-emerald-500 hover:bg-emerald-50"
              >
                Add Charge +
              </Button>
            </div>
          </div>
        </div>
      </div>

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