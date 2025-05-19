"use client"

import { useState } from "react"
import PageLayout from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp, Trash2, Edit, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface Table {
  id: string
  name: string
  serviceCharge: number
  minSpend: number
  isEnabled: boolean
}

interface TableGroup {
  id: string
  name: string
  displayOrder: number
  buttonLabel: string
  isEnabled: boolean
  tables: Table[]
}

export default function TableOrderingPage() {
  const [groups, setGroups] = useState<TableGroup[]>([])
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false)
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false)
  const [isEditTableModalOpen, setIsEditTableModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [newGroup, setNewGroup] = useState<Omit<TableGroup, "id" | "tables">>({
    name: "",
    displayOrder: 0,
    buttonLabel: "",
    isEnabled: true
  })
  const [newTable, setNewTable] = useState<Omit<Table, "id">>({
    name: "",
    serviceCharge: 0,
    minSpend: 0,
    isEnabled: true
  })

  const handleAddGroup = () => {
    const group: TableGroup = {
      id: Math.random().toString(36).substr(2, 9),
      ...newGroup,
      tables: []
    }
    setGroups([...groups, group])
    setNewGroup({ name: "", displayOrder: 0, buttonLabel: "", isEnabled: true })
    setIsAddGroupModalOpen(false)
  }

  const handleAddTable = () => {
    if (!selectedGroup) return

    const table: Table = {
      id: Math.random().toString(36).substr(2, 9),
      ...newTable
    }

    setGroups(groups.map(group => 
      group.id === selectedGroup
        ? { ...group, tables: [...group.tables, table] }
        : group
    ))

    setNewTable({ name: "", serviceCharge: 0, minSpend: 0, isEnabled: true })
    setIsAddTableModalOpen(false)
  }

  const handleEditTable = () => {
    if (!selectedGroup || !selectedTable) return

    setGroups(groups.map(group => 
      group.id === selectedGroup
        ? {
            ...group,
            tables: group.tables.map(table =>
              table.id === selectedTable.id
                ? { ...table, ...newTable }
                : table
            )
          }
        : group
    ))

    setIsEditTableModalOpen(false)
    setSelectedTable(null)
  }

  const handleDeleteTable = (groupId: string, tableId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId
        ? { ...group, tables: group.tables.filter(table => table.id !== tableId) }
        : group
    ))
  }

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId))
    if (expandedGroup === groupId) {
      setExpandedGroup(null)
    }
  }

  const toggleGroup = (groupId: string) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId)
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
            <h1 className="text-2xl font-medium">Table Ordering</h1>
            <Button 
              onClick={() => setIsAddGroupModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Add Group
            </Button>
          </div>

          <div className="space-y-4">
            {groups.map(group => (
              <div key={group.id} className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleGroup(group.id)}
                >
                  <div className="flex items-center gap-4">
                    <Switch checked={group.isEnabled} />
                    <span>{group.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteGroup(group.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {expandedGroup === group.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>

                <div className={cn(
                  "border-t",
                  expandedGroup === group.id ? "block" : "hidden"
                )}>
                  <div className="p-4">
                    <div className="mb-4">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left border-b">
                            <th className="pb-2">Name</th>
                            <th className="pb-2">Charge</th>
                            <th className="pb-2">Min Spend</th>
                            <th className="pb-2">Available</th>
                            <th className="pb-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.tables.map(table => (
                            <tr key={table.id} className="border-b last:border-b-0">
                              <td className="py-2">{table.name}</td>
                              <td className="py-2">£{table.serviceCharge.toFixed(2)}</td>
                              <td className="py-2">£{table.minSpend.toFixed(2)}</td>
                              <td className="py-2">
                                <Switch checked={table.isEnabled} />
                              </td>
                              <td className="py-2 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-emerald-500 mr-2"
                                  onClick={() => {
                                    setSelectedGroup(group.id)
                                    setSelectedTable(table)
                                    setNewTable(table)
                                    setIsEditTableModalOpen(true)
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => handleDeleteTable(group.id, table.id)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Button
                      variant="outline"
                      className="text-emerald-500"
                      onClick={() => {
                        setSelectedGroup(group.id)
                        setIsAddTableModalOpen(true)
                      }}
                    >
                      Add a Table +
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Group Modal */}
      <Dialog open={isAddGroupModalOpen} onOpenChange={setIsAddGroupModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Table Ordering Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Group Name</Label>
              <Input
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                value={newGroup.displayOrder}
                onChange={(e) => setNewGroup({ ...newGroup, displayOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Button Label</Label>
              <Input
                value={newGroup.buttonLabel}
                onChange={(e) => setNewGroup({ ...newGroup, buttonLabel: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={newGroup.isEnabled}
                onCheckedChange={(checked) => setNewGroup({ ...newGroup, isEnabled: checked })}
              />
              <Label>Is Enabled</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddGroupModalOpen(false)}>
              Close
            </Button>
            <Button onClick={handleAddGroup}>
              Add Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Table Modal */}
      <Dialog open={isAddTableModalOpen} onOpenChange={setIsAddTableModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Table</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Name</Label>
              <Input
                value={newTable.name}
                onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Service Charge per Order</Label>
              <div className="flex items-center gap-2">
                <span>£</span>
                <Input
                  type="number"
                  step="0.01"
                  value={newTable.serviceCharge}
                  onChange={(e) => setNewTable({ ...newTable, serviceCharge: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <Label>Minimum Spend Required</Label>
              <div className="flex items-center gap-2">
                <span>£</span>
                <Input
                  type="number"
                  step="0.01"
                  value={newTable.minSpend}
                  onChange={(e) => setNewTable({ ...newTable, minSpend: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={newTable.isEnabled}
                onCheckedChange={(checked) => setNewTable({ ...newTable, isEnabled: checked })}
              />
              <Label>Is Enabled</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTableModalOpen(false)}>
              Close
            </Button>
            <Button onClick={handleAddTable}>
              Add Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Table Modal */}
      <Dialog open={isEditTableModalOpen} onOpenChange={setIsEditTableModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Table Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Name</Label>
              <Input
                value={newTable.name}
                onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Service Charge per Order</Label>
              <div className="flex items-center gap-2">
                <span>£</span>
                <Input
                  type="number"
                  step="0.01"
                  value={newTable.serviceCharge}
                  onChange={(e) => setNewTable({ ...newTable, serviceCharge: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <Label>Minimum Spend Required</Label>
              <div className="flex items-center gap-2">
                <span>£</span>
                <Input
                  type="number"
                  step="0.01"
                  value={newTable.minSpend}
                  onChange={(e) => setNewTable({ ...newTable, minSpend: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={newTable.isEnabled}
                onCheckedChange={(checked) => setNewTable({ ...newTable, isEnabled: checked })}
              />
              <Label>Is Enabled</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTableModalOpen(false)}>
              Close
            </Button>
            <Button onClick={handleEditTable}>
              Save Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
} 