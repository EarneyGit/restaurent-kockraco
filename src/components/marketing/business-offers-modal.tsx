"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { BusinessOffer } from '@/services/business-offer.service'

// Dynamic import of TipTap editor to avoid SSR issues
const Tiptap = dynamic(() => import("@/components/ui/tiptap"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
})

// Form interface for the modal (uses Date objects for easier handling)
interface BusinessOfferFormData {
  _id?: string
    title: string
    content: string
    startDate: Date | null
    endDate: Date | null
    displayOrder: number
    image?: string
  isActive: boolean
}

interface BusinessOffersModalProps {
  isOpen: boolean
  onClose: () => void
  offer?: BusinessOffer
  onSave: (offer: Partial<BusinessOffer>) => Promise<void>
}

export default function BusinessOffersModal({
  isOpen,
  onClose,
  offer,
  onSave,
}: BusinessOffersModalProps) {
  const [formData, setFormData] = useState<BusinessOfferFormData>({
    title: "",
    content: "",
    startDate: null,
    endDate: null,
    displayOrder: 0,
    image: "",
    isActive: true
  })

  useEffect(() => {
    if (offer) {
      // Convert API format to form format
      setFormData({
        _id: offer._id,
        title: offer.title,
        content: offer.content,
        startDate: offer.startDate ? new Date(offer.startDate) : null,
        endDate: offer.endDate ? new Date(offer.endDate) : null,
        displayOrder: offer.displayOrder,
        image: offer.image || "",
        isActive: offer.isActive
      })
    } else {
      resetForm()
    }
  }, [offer, isOpen])

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      startDate: null,
      endDate: null,
      displayOrder: 0,
      image: "",
      isActive: true
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDateSelect = (date: Date | undefined, setter: (date: Date | null) => void) => {
    setter(date || null)
  }

  const handleSave = async () => {
    // Convert form format to API format
    const apiData: Partial<BusinessOffer> = {
      ...formData,
      startDate: formData.startDate ? formData.startDate.toISOString() : null,
      endDate: formData.endDate ? formData.endDate.toISOString() : null,
    }
    await onSave(apiData)
    onClose()
    resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{offer ? "Edit Offer" : "Add New Offer"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter offer title"
            />
          </div>

          <div className="grid gap-2">
            <Label>Content</Label>
            <Tiptap content={formData.content} onChange={(value) => setFormData(prev => ({ ...prev, content: value }))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate || undefined}
                    onSelect={(date) => handleDateSelect(date, (date) => setFormData(prev => ({ ...prev, startDate: date })))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate || undefined}
                    onSelect={(date) => handleDateSelect(date, (date) => setFormData(prev => ({ ...prev, endDate: date })))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input
              id="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) }))}
              min="0"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Offer preview"
                  className="max-h-40 rounded-md object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 