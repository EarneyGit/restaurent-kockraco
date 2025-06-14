"use client"

import { useState, useEffect } from 'react'
import PageLayout from "@/components/layout/page-layout"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, Loader2 } from "lucide-react"
import { outletService, type OutletSettings } from "@/services/outlet.service"
import { toast } from "sonner"
import { useAuth } from '@/contexts/auth-context'

const Tiptap = dynamic(() => import("@/components/ui/tiptap"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
})

export default function OutletsPage() {
  const { user } = useAuth()
  const displayName = (user?.firstName + " " + user?.lastName) || 'Admin User'
  
  const [activeTab, setActiveTab] = useState<'details' | 'opening-hours' | 'delivery-areas' | 'special-notes'>('details')

  const [outletData, setOutletData] = useState<OutletSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aboutUs, setAboutUs] = useState('')

  // Form states
  const [detailsForm, setDetailsForm] = useState({
    name: '',
    email: '',
    contactNumber: '',
    telephone: ''
  })

  const [locationForm, setLocationForm] = useState({
    street: '',
    addressLine2: '',
    city: '',
    county: '',
    state: '',
    postcode: '',
    country: ''
  })

  // Load outlet data on component mount
  useEffect(() => {
    loadOutletData()
  }, [])

  const loadOutletData = async () => {
    try {
      setLoading(true)
      const response = await outletService.getOutletSettings()
      const data = response.data
      setOutletData(data)
      
      // Set form data
      setDetailsForm({
        name: data.name || '',
        email: data.email || '',
        contactNumber: data.contactNumber || '',
        telephone: data.telephone || ''
      })

      setLocationForm({
        street: data.address.street || '',
        addressLine2: data.address.addressLine2 || '',
        city: data.address.city || '',
        county: data.address.county || '',
        state: data.address.state || '',
        postcode: data.address.postcode || '',
        country: data.address.country || ''
      })

      setAboutUs(data.aboutUs || '')
    } catch (error) {
      console.error('Error loading outlet data:', error)
      toast.error('Failed to load outlet data')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDetails = async () => {
    try {
      setSaving(true)
      
      // Validate email
      if (detailsForm.email && !outletService.validateEmail(detailsForm.email)) {
        toast.error('Please enter a valid email address')
        return
      }

      // Validate phone
      if (detailsForm.contactNumber && !outletService.validatePhone(detailsForm.contactNumber)) {
        toast.error('Please enter a valid contact number')
        return
      }

      await outletService.updateOutletDetails({
        ...detailsForm,
        aboutUs
      })
      
      toast.success('Outlet details updated successfully')
      loadOutletData() // Reload to get updated data
    } catch (error) {
      console.error('Error saving outlet details:', error)
      toast.error('Failed to save outlet details')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLocation = async () => {
    try {
      setSaving(true)
      
      // Validate postcode
      if (locationForm.postcode && !outletService.validatePostcode(locationForm.postcode)) {
        toast.error('Please enter a valid UK postcode')
        return
      }

      await outletService.updateOutletLocation(locationForm)
      
      toast.success('Outlet location updated successfully')
      loadOutletData() // Reload to get updated data
    } catch (error) {
      console.error('Error saving outlet location:', error)
      toast.error('Failed to save outlet location')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          Loading outlet settings...
        </div>
      </PageLayout>
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
        {/* Details Section */}
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-4">Details</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 mb-4">Setup the basic contact details for your outlet</p>
            <p className="text-gray-600 mb-4">Email and contact number are displayed on order confirmation emails sent to the customer</p>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="outletName">Outlet Name</Label>
                <Input
                  id="outletName"
                  type="text" 
                  value={detailsForm.name}
                  onChange={(e) => setDetailsForm({ ...detailsForm, name: e.target.value })}
                  placeholder="Enter outlet name"
                />
              </div>
              
              <div>
                <Label htmlFor="aboutUs">About Us</Label>
                <Tiptap
                  content={aboutUs}
                  onChange={setAboutUs}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email" 
                  value={detailsForm.email}
                  onChange={(e) => setDetailsForm({ ...detailsForm, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  type="text"
                  value={detailsForm.contactNumber}
                  onChange={(e) => setDetailsForm({ ...detailsForm, contactNumber: e.target.value })}
                  placeholder="Enter contact number"
                />
              </div>

              <div>
                <Label htmlFor="telephone">Telephone (optional)</Label>
                <Input
                  id="telephone"
                  type="text" 
                  value={detailsForm.telephone}
                  onChange={(e) => setDetailsForm({ ...detailsForm, telephone: e.target.value })}
                  placeholder="Enter telephone number"
                />
              </div>
              
              <Button 
                onClick={handleSaveDetails}
                disabled={saving}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Details'
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Location Section */}
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-4">Location</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 mb-4">Address details for this outlet</p>
            <p className="text-gray-600 mb-4">Postcode is required to calculate distances in relation to delivery charges.</p>
            <p className="text-gray-600 mb-4">Please ensure a valid postcode is supplied.</p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="street">Address Line 1</Label>
                <Input
                  id="street"
                  type="text" 
                  value={locationForm.street}
                  onChange={(e) => setLocationForm({ ...locationForm, street: e.target.value })}
                  placeholder="Enter street address"
                />
              </div>
              
              <div>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  type="text" 
                  value={locationForm.addressLine2}
                  onChange={(e) => setLocationForm({ ...locationForm, addressLine2: e.target.value })}
                  placeholder="Enter address line 2 (optional)"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text" 
                    value={locationForm.city}
                    onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <Label htmlFor="county">County</Label>
                  <Input
                    id="county"
                    type="text" 
                    value={locationForm.county}
                    onChange={(e) => setLocationForm({ ...locationForm, county: e.target.value })}
                    placeholder="Enter county (optional)"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State/Region</Label>
                  <Input
                    id="state"
                  type="text" 
                    value={locationForm.state}
                    onChange={(e) => setLocationForm({ ...locationForm, state: e.target.value })}
                    placeholder="Enter state or region"
                />
              </div>
              
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    type="text"
                    value={locationForm.postcode}
                    onChange={(e) => setLocationForm({ ...locationForm, postcode: e.target.value })}
                    placeholder="Enter postcode"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  value={locationForm.country}
                  onChange={(e) => setLocationForm({ ...locationForm, country: e.target.value })}
                  placeholder="Enter country"
                />
              </div>
              
              <Button 
                onClick={handleSaveLocation}
                disabled={saving}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Location'
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Opening Times Display */}
        {outletData && (
          <div className="mb-10">
            <h2 className="text-xl font-medium mb-4">Opening Times</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 mb-4">
                Opening times are managed in the <strong>Ordering Times</strong> section.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">
                  {outletService.formatOpeningTimes(outletData.openingTimes)}
                </pre>
              </div>
              </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
} 