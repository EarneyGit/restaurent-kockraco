"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  PlusIcon, 
  SearchIcon, 
  EditIcon, 
  TrashIcon, 
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  BuildingIcon,
  ClockIcon,
  CheckIcon,
  XIcon,
  AlertTriangleIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import BranchService, { Branch } from '@/services/branch.service'

export default function BranchManagementPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  // State management
  const [branches, setBranches] = useState<Branch[]>([])
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null)
  const [formData, setFormData] = useState<Partial<Branch>>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Check if user is superadmin
  const isSuperAdmin = user?.role === 'superadmin' || user?.roleDetails?.slug === 'superadmin'

  // Redirect if not superadmin
  useEffect(() => {
    if (!isSuperAdmin) {
      router.push('/')
      return
    }
  }, [isSuperAdmin, router])

  // Load branches
  useEffect(() => {
    if (isSuperAdmin) {
      loadBranches()
    }
  }, [isSuperAdmin])

  // Filter branches based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = branches.filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBranches(filtered)
    } else {
      setFilteredBranches(branches)
    }
  }, [searchTerm, branches])

  const loadBranches = async () => {
    try {
      setLoading(true)
      const response = await BranchService.getBranches()
      setBranches(response.data)
      setFilteredBranches(response.data)
    } catch (error) {
      setError('Failed to load branches')
      console.error('Error loading branches:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBranch = async () => {
    try {
      setError('')
      const response = await BranchService.createBranchAsAdmin(formData)
      setBranches([...branches, response.data])
      setShowCreateModal(false)
      setFormData({})
      setSuccess('Branch created successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create branch')
    }
  }

  const handleEditBranch = async () => {
    if (!currentBranch) return
    
    try {
      setError('')
      const response = await BranchService.updateBranchById(currentBranch._id, formData)
      const updatedBranches = branches.map(branch =>
        branch._id === currentBranch._id ? response.data : branch
      )
      setBranches(updatedBranches)
      setShowEditModal(false)
      setCurrentBranch(null)
      setFormData({})
      setSuccess('Branch updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update branch')
    }
  }

  const handleDeleteBranch = async () => {
    if (!currentBranch) return
    
    try {
      setError('')
      await BranchService.deleteBranchById(currentBranch._id)
      const updatedBranches = branches.filter(branch => branch._id !== currentBranch._id)
      setBranches(updatedBranches)
      setShowDeleteModal(false)
      setCurrentBranch(null)
      setSuccess('Branch deleted successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete branch')
    }
  }

  const openEditModal = (branch: Branch) => {
    setCurrentBranch(branch)
    setFormData(branch)
    setShowEditModal(true)
  }

  const openDeleteModal = (branch: Branch) => {
    setCurrentBranch(branch)
    setShowDeleteModal(true)
  }

  const selectAll = () => {
    if (selectedBranches.length === filteredBranches.length) {
      setSelectedBranches([])
    } else {
      setSelectedBranches(filteredBranches.map(branch => branch._id))
    }
  }

  const selectBranch = (id: string) => {
    if (selectedBranches.includes(id)) {
      setSelectedBranches(selectedBranches.filter(branchId => branchId !== id))
    } else {
      setSelectedBranches([...selectedBranches, id])
    }
  }

  const handleBulkDelete = async () => {
    try {
      await BranchService.bulkDeleteBranches(selectedBranches)
      const updatedBranches = branches.filter(branch => !selectedBranches.includes(branch._id))
      setBranches(updatedBranches)
      setSelectedBranches([])
      setSuccess(`${selectedBranches.length} branches deleted successfully`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete branches')
    }
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Branch Management</h1>
          <p className="text-gray-600 mt-1">Manage all restaurant branches and outlets</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Branch
        </Button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search branches by name, code, city, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-3">
            {selectedBranches.length > 0 && (
              <Button 
                variant="destructive"
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Selected ({selectedBranches.length})
              </Button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{branches.length}</div>
            <div className="text-sm text-blue-600">Total Branches</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {branches.filter(b => b.isActive).length}
            </div>
            <div className="text-sm text-green-600">Active Branches</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {branches.filter(b => !b.isActive).length}
            </div>
            <div className="text-sm text-orange-600">Inactive Branches</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {branches.filter(b => b.isDefault).length}
            </div>
            <div className="text-sm text-purple-600">Default Branch</div>
          </div>
        </div>
      </div>

      {/* Branch Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading branches...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedBranches.length === filteredBranches.length && filteredBranches.length > 0}
                      onChange={selectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBranches.map((branch) => (
                  <tr key={branch._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedBranches.includes(branch._id)}
                        onChange={() => selectBranch(branch._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <BuildingIcon className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{branch.name}</div>
                          <div className="text-sm text-gray-500">Code: {branch.code}</div>
                          {branch.isDefault && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {branch.address.street}
                        </div>
                        <div className="text-gray-500">
                          {branch.address.city}, {branch.address.state} {branch.address.postalCode}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {branch.contact.phone}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <MailIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {branch.contact.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          branch.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        )}
                      >
                        {branch.isActive ? (
                          <>
                            <CheckIcon className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XIcon className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Capacity: {branch.capacity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(branch)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteModal(branch)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredBranches.length === 0 && !loading && (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? (
                  <>
                    No branches found matching "{searchTerm}"
                  </>
                ) : (
                  <>
                    No branches found. Create your first branch to get started.
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Branch Modal */}
      {showCreateModal && (
        <CreateBranchModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false)
            setFormData({})
            setError('')
          }}
          onSubmit={handleCreateBranch}
          formData={formData}
          setFormData={setFormData}
          error={error}
        />
      )}

      {/* Edit Branch Modal */}
      {showEditModal && currentBranch && (
        <EditBranchModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setCurrentBranch(null)
            setFormData({})
            setError('')
          }}
          onSubmit={handleEditBranch}
          formData={formData}
          setFormData={setFormData}
          error={error}
          branch={currentBranch}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentBranch && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setCurrentBranch(null)
          }}
          onConfirm={handleDeleteBranch}
          branchName={currentBranch.name}
          error={error}
        />
      )}
    </div>
  )
}

// Create Branch Modal Component
interface CreateBranchModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  formData: Partial<Branch>
  setFormData: (data: Partial<Branch>) => void
  error: string
}

function CreateBranchModal({ isOpen, onClose, onSubmit, formData, setFormData, error }: CreateBranchModalProps) {
  if (!isOpen) return null

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof Branch] as any),
          [child]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [field]: value
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Create New Branch</h2>
        </div>
        
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name *
              </label>
              <Input
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter branch name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Code *
              </label>
              <Input
                value={formData.code || ''}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Enter branch code"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
              placeholder="Enter branch description"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <Input
                value={formData.address?.street || ''}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                placeholder="Enter street address"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <Input
                  value={formData.address?.city || ''}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province *
                </label>
                <Input
                  value={formData.address?.state || ''}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  placeholder="Enter state/province"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code *
                </label>
                <Input
                  value={formData.address?.postalCode || ''}
                  onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                  placeholder="Enter postal code"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <Input
                  value={formData.address?.country || 'United Kingdom'}
                  onChange={(e) => handleInputChange('address.country', e.target.value)}
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <Input
                  value={formData.contact?.phone || ''}
                  onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.contact?.email || ''}
                  onChange={(e) => handleInputChange('contact.email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <Input
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                placeholder="Enter branch capacity"
              />
            </div>
            
            <div className="flex items-center space-x-4 pt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive !== false}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isDefault || false}
                  onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Default Branch</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
            Create Branch
          </Button>
        </div>
      </div>
    </div>
  )
}

// Edit Branch Modal Component (similar to create but with pre-filled data)
interface EditBranchModalProps extends CreateBranchModalProps {
  branch: Branch
}

function EditBranchModal({ isOpen, onClose, onSubmit, formData, setFormData, error, branch }: EditBranchModalProps) {
  if (!isOpen) return null

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof Branch] as any),
          [child]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [field]: value
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Edit Branch: {branch.name}</h2>
        </div>
        
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {/* Similar form fields as Create Modal but with edit context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name *
              </label>
              <Input
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter branch name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Code *
              </label>
              <Input
                value={formData.code || ''}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Enter branch code"
              />
            </div>
          </div>

          {/* Add all other form fields similar to CreateBranchModal */}
        </div>
        
        <div className="p-6 border-t flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
            Update Branch
          </Button>
        </div>
      </div>
    </div>
  )
}

// Delete Confirmation Modal Component
interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  branchName: string
  error: string
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, branchName, error }: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertTriangleIcon className="h-8 w-8 text-red-500 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the branch <strong>"{branchName}"</strong>? 
            This action cannot be undone and will permanently remove all branch data.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Branch
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 