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

// Dynamic import of TipTap editor to avoid SSR issues
const Tiptap = dynamic(() => import("@/components/ui/tiptap"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
})

interface BusinessOffersModalProps {
  isOpen: boolean
  onClose: () => void
  offer?: {
    id?: number
    title: string
    content: string
    startDate: Date | null
    endDate: Date | null
    displayOrder: number
    image?: string
  }
  onSave: (offer: any) => void
}

export default function BusinessOffersModal({
  isOpen,
  onClose,
  offer,
  onSave,
}: BusinessOffersModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [displayOrder, setDisplayOrder] = useState("0")
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (offer) {
      setTitle(offer.title)
      setContent(offer.content)
      setStartDate(offer.startDate)
      setEndDate(offer.endDate)
      setDisplayOrder(offer.displayOrder.toString())
      setImage(offer.image ?? null)
    } else {
      resetForm()
    }
  }, [offer, isOpen])

  const resetForm = () => {
    setTitle("")
    setContent("")
    setStartDate(null)
    setEndDate(null)
    setDisplayOrder("0")
    setImage(null)
    setImageFile(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDateSelect = (date: Date | undefined, setter: (date: Date | null) => void) => {
    setter(date || null)
  }

  const handleSave = () => {
    onSave({
      id: offer?.id,
      title,
      content,
      startDate,
      endDate,
      displayOrder: parseInt(displayOrder),
      image,
      imageFile,
    })
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter offer title"
            />
          </div>

          <div className="grid gap-2">
            <Label>Content</Label>
            <Tiptap content={content} onChange={setContent} />
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
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate || undefined}
                    onSelect={(date) => handleDateSelect(date, setStartDate)}
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
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate || undefined}
                    onSelect={(date) => handleDateSelect(date, setEndDate)}
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
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
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
            {image && (
              <div className="mt-2">
                <img
                  src={image}
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