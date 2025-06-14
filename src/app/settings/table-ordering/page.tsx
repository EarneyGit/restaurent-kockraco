"use client"

import { useState, useEffect } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp, Trash2, Edit, Eye, Plus, Loader2, QrCode } from "lucide-react"
import { cn } from "@/lib/utils"
import { tableOrderingService, type TableGroup, type Table } from "@/services/table-ordering.service"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/auth-context'

export default function TableOrderingPage() {
  const { user } = useAuth()
  const displayName = (user?.firstName + " " + user?.lastName) || 'Admin User'
  
  const [groups, setGroups] = useState<TableGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false)
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false)
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false)
  const [isEditTableModalOpen, setIsEditTableModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [editingGroup, setEditingGroup] = useState<TableGroup | null>(null)

  // Load data on component mount
  useEffect(() => {
    loadTableGroups()
  }, [])

  const loadTableGroups = async () => {
    try {
      setLoading(true)
      const response = await tableOrderingService.getTableGroups()
      setGroups(response.data)
    } catch (error) {
      console.error('Error loading table groups:', error)
      toast.error('Failed to load table groups')
    } finally {
      setLoading(false)
    }
  }

  const handleAddGroup = async (groupData: Partial<TableGroup>) => {
    try {
      await tableOrderingService.createTableGroup(groupData)
      toast.success('Table group created successfully')
      setIsAddGroupModalOpen(false)
      loadTableGroups()
    } catch (error) {
      console.error('Error creating table group:', error)
      toast.error('Failed to create table group')
    }
  }

  const handleEditGroup = async (groupData: Partial<TableGroup>) => {
    if (!editingGroup) return
    
    try {
      await tableOrderingService.updateTableGroup(editingGroup._id, groupData)
      toast.success('Table group updated successfully')
      setIsEditGroupModalOpen(false)
      setEditingGroup(null)
      loadTableGroups()
    } catch (error) {
      console.error('Error updating table group:', error)
      toast.error('Failed to update table group')
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this table group? All tables in this group will be deleted.')) return
    
    try {
      await tableOrderingService.deleteTableGroup(groupId)
      toast.success('Table group deleted successfully')
      if (expandedGroup === groupId) {
        setExpandedGroup(null)
      }
      loadTableGroups()
    } catch (error) {
      console.error('Error deleting table group:', error)
      toast.error('Failed to delete table group')
    }
  }

  const handleAddTable = async (tableData: Partial<Table>) => {
    if (!selectedGroup) return

    try {
      await tableOrderingService.addTableToGroup(selectedGroup, tableData)
      toast.success('Table added successfully')
      setIsAddTableModalOpen(false)
      setSelectedGroup(null)
      loadTableGroups()
    } catch (error) {
      console.error('Error adding table:', error)
      toast.error('Failed to add table')
    }
  }

  const handleEditTable = async (tableData: Partial<Table>) => {
    if (!selectedGroup || !selectedTable) return

    try {
      await tableOrderingService.updateTableInGroup(selectedGroup, selectedTable._id, tableData)
      toast.success('Table updated successfully')
      setIsEditTableModalOpen(false)
      setSelectedTable(null)
      setSelectedGroup(null)
      loadTableGroups()
    } catch (error) {
      console.error('Error updating table:', error)
      toast.error('Failed to update table')
    }
  }

  const handleDeleteTable = async (groupId: string, tableId: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return
    
    try {
      await tableOrderingService.removeTableFromGroup(groupId, tableId)
      toast.success('Table deleted successfully')
      loadTableGroups()
    } catch (error) {
      console.error('Error deleting table:', error)
      toast.error('Failed to delete table')
    }
  }

  const handleGenerateQR = async (groupId: string, tableId: string) => {
    try {
      const response = await tableOrderingService.generateTableQR(groupId, tableId)
      toast.success('QR code generated successfully')
      loadTableGroups()
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Failed to generate QR code')
    }
  }

  const toggleGroup = (groupId: string) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId)
  }

  const openEditGroupModal = (group: TableGroup) => {
    setEditingGroup(group)
    setIsEditGroupModalOpen(true)
  }

  const openAddTableModal = (groupId: string) => {
    setSelectedGroup(groupId)
    setIsAddTableModalOpen(true)
  }

  const openEditTableModal = (groupId: string, table: Table) => {
    setSelectedGroup(groupId)
    setSelectedTable(table)
    setIsEditTableModalOpen(true)
  }

  const TableGroupModal = ({ 
    isOpen, 
    onClose, 
    group, 
    onSave,
    title
  }: { 
    isOpen: boolean
    onClose: () => void
    group: TableGroup | null
    onSave: (group: Partial<TableGroup>) => void
    title: string
  }) => {
    const [formData, setFormData] = useState<Partial<TableGroup>>(
      group || {
        name: "",
        displayOrder: 0,
        buttonLabel: "",
        isEnabled: true,
        defaultServiceCharge: 0,
        defaultMinSpend: 0,
        description: ""
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
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Main Dining Area"
              />
            </div>

            <div>
              <Label htmlFor="buttonLabel">Button Label</Label>
              <Input
                id="buttonLabel"
                value={formData.buttonLabel || ""}
                onChange={(e) => setFormData({ ...formData, buttonLabel: e.target.value })}
                placeholder="e.g., Dine In"
              />
            </div>

            <div>
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder || 0}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="defaultServiceCharge">Default Service Charge (£)</Label>
              <Input
                id="defaultServiceCharge"
                type="number"
                step="0.01"
                value={formData.defaultServiceCharge || 0}
                onChange={(e) => setFormData({ ...formData, defaultServiceCharge: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="defaultMinSpend">Default Min Spend (£)</Label>
              <Input
                id="defaultMinSpend"
                type="number"
                step="0.01"
                value={formData.defaultMinSpend || 0}
                onChange={(e) => setFormData({ ...formData, defaultMinSpend: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Tables in the main dining area"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isEnabled"
                checked={formData.isEnabled !== false}
                onCheckedChange={(checked) => setFormData({ ...formData, isEnabled: checked })}
              />
              <Label htmlFor="isEnabled">Enabled</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={() => onSave(formData)}>
              {group ? 'Save Group' : 'Add Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const TableModal = ({ 
    isOpen, 
    onClose, 
    table, 
    onSave,
    title
  }: { 
    isOpen: boolean
    onClose: () => void
    table: Table | null
    onSave: (table: Partial<Table>) => void
    title: string
  }) => {
    const [formData, setFormData] = useState<Partial<Table>>(
      table || {
        name: "",
        serviceCharge: 0,
        minSpend: 0,
        isEnabled: true,
        capacity: 4,
        location: ""
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
              <Label htmlFor="name">Table Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Table 1"
              />
            </div>

            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity || 4}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 4 })}
              />
            </div>

            <div>
              <Label htmlFor="serviceCharge">Service Charge (£)</Label>
              <Input
                id="serviceCharge"
                type="number"
                step="0.01"
                value={formData.serviceCharge || 0}
                onChange={(e) => setFormData({ ...formData, serviceCharge: parseFloat(e.target.value) || 0 })}
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
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Near window"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isEnabled"
                checked={formData.isEnabled !== false}
                onCheckedChange={(checked) => setFormData({ ...formData, isEnabled: checked })}
              />
              <Label htmlFor="isEnabled">Available for ordering</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={() => onSave(formData)}>
              {table ? 'Save Table' : 'Add Table'}
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
        <h1 className="text-xl font-medium flex-1 text-center">{displayName}</h1>
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
            <h1 className="text-2xl font-medium">Table Ordering</h1>
            <Button 
              onClick={() => setIsAddGroupModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading table groups...
            </div>
          ) : (
            <div className="space-y-4">
              {groups.map(group => (
                <div key={group._id} className="bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleGroup(group._id)}
                  >
                    <div className="flex items-center gap-4">
                      <Switch 
                        checked={group.isEnabled} 
                        onClick={(e) => e.stopPropagation()}
                        onCheckedChange={async (checked) => {
                          try {
                            await tableOrderingService.updateTableGroup(group._id, { isEnabled: checked })
                            loadTableGroups()
                          } catch (error) {
                            toast.error('Failed to update group status')
                          }
                        }}
                      />
                      <div>
                        <span className="font-medium">{group.name}</span>
                        <div className="text-sm text-gray-500">
                          {tableOrderingService.getGroupSummary(group)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditGroupModal(group)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteGroup(group._id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {expandedGroup === group._id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  <div className={cn(
                    "border-t",
                    expandedGroup === group._id ? "block" : "hidden"
                  )}>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Tables</h3>
                        <Button
                          size="sm"
                          onClick={() => openAddTableModal(group._id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Table
                        </Button>
                      </div>

                      {group.tables.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left border-b">
                                <th className="pb-2">Name</th>
                                <th className="pb-2">Capacity</th>
                                <th className="pb-2">Service Charge</th>
                                <th className="pb-2">Min Spend</th>
                                <th className="pb-2">Location</th>
                                <th className="pb-2">Available</th>
                                <th className="pb-2">QR Code</th>
                                <th className="pb-2">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.tables.map(table => (
                                <tr key={table._id} className="border-b last:border-b-0">
                                  <td className="py-2">{table.name}</td>
                                  <td className="py-2">{tableOrderingService.getCapacityDisplay(table.capacity)}</td>
                                  <td className="py-2">{tableOrderingService.formatCurrency(table.serviceCharge)}</td>
                                  <td className="py-2">{tableOrderingService.formatCurrency(table.minSpend)}</td>
                                  <td className="py-2">{table.location || '-'}</td>
                                  <td className="py-2">
                                    <Switch 
                                      checked={table.isEnabled}
                                      onCheckedChange={async (checked) => {
                                        try {
                                          await tableOrderingService.updateTableInGroup(group._id, table._id, { isEnabled: checked })
                                          loadTableGroups()
                                        } catch (error) {
                                          toast.error('Failed to update table status')
                                        }
                                      }}
                                    />
                                  </td>
                                  <td className="py-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleGenerateQR(group._id, table._id)}
                                    >
                                      <QrCode className="h-4 w-4" />
                                    </Button>
                                  </td>
                                  <td className="py-2">
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditTableModal(group._id, table)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500"
                                        onClick={() => handleDeleteTable(group._id, table._id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No tables in this group. Add your first table to get started.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {groups.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No table groups found</h3>
                  <p className="text-gray-500 mb-4">Create your first table group to start organizing your tables.</p>
                  <Button 
                    onClick={() => setIsAddGroupModalOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Group
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TableGroupModal
        isOpen={isAddGroupModalOpen}
        onClose={() => setIsAddGroupModalOpen(false)}
        group={null}
        onSave={handleAddGroup}
        title="Add Table Group"
      />

      <TableGroupModal
        isOpen={isEditGroupModalOpen}
        onClose={() => {
          setIsEditGroupModalOpen(false)
          setEditingGroup(null)
        }}
        group={editingGroup}
        onSave={handleEditGroup}
        title="Edit Table Group"
      />

      <TableModal
        isOpen={isAddTableModalOpen}
        onClose={() => {
          setIsAddTableModalOpen(false)
          setSelectedGroup(null)
        }}
        table={null}
        onSave={handleAddTable}
        title="Add Table"
      />

      <TableModal
        isOpen={isEditTableModalOpen}
        onClose={() => {
          setIsEditTableModalOpen(false)
          setSelectedTable(null)
          setSelectedGroup(null)
        }}
        table={selectedTable}
        onSave={handleEditTable}
        title="Edit Table"
      />
    </PageLayout>
  )
} 