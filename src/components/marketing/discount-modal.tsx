"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DiscountModalProps {
  isOpen: boolean
  onClose: () => void
  discount?: Discount
  onSave: (discount: Discount) => void
}

interface Discount {
  id?: number
  name: string
  code: string
  allowMultipleCoupons: boolean
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minSpend: number
  maxSpend: number
  outlets: {
    dunfermline: boolean
    edinburgh: boolean
    glasgow: boolean
  }
  timeDependent: boolean
  startDate: Date | null
  endDate: Date | null
  maxUses: {
    total: number
    perCustomer: number
    perDay: number
  }
  daysAvailable: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  serviceTypes: {
    collection: boolean
    delivery: boolean
    tableOrdering: boolean
  }
  firstOrderOnly: boolean
}

const defaultDiscount: Discount = {
  name: '',
  code: '',
  allowMultipleCoupons: false,
  discountType: 'percentage',
  discountValue: 0,
  minSpend: 0,
  maxSpend: 0,
  outlets: {
    dunfermline: true,
    edinburgh: true,
    glasgow: true,
  },
  timeDependent: false,
  startDate: null,
  endDate: null,
  maxUses: {
    total: 0,
    perCustomer: 0,
    perDay: 0,
  },
  daysAvailable: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  },
  serviceTypes: {
    collection: true,
    delivery: true,
    tableOrdering: true,
  },
  firstOrderOnly: false,
}

export default function DiscountModal({
  isOpen,
  onClose,
  discount,
  onSave,
}: DiscountModalProps) {
  const [formData, setFormData] = useState<Discount>(defaultDiscount)

  useEffect(() => {
    if (discount) {
      setFormData(discount)
    } else {
      setFormData(defaultDiscount)
    }
  }, [discount, isOpen])

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {discount ? "Edit Discount" : "Add New Discount"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="outlets">Outlets</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter discount name"
                />
              </div>

              <div>
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Enter coupon code"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="allowMultipleCoupons">Allow Multiple Coupons</Label>
                <Switch
                  id="allowMultipleCoupons"
                  checked={formData.allowMultipleCoupons}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowMultipleCoupons: checked }))}
                />
              </div>

              <div>
                <Label htmlFor="discountType">Discount Type</Label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'fixed' }))}
                  className="w-full h-10 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minSpend">Minimum Spend (£)</Label>
                  <Input
                    id="minSpend"
                    type="number"
                    value={formData.minSpend}
                    onChange={(e) => setFormData(prev => ({ ...prev, minSpend: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="maxSpend">Maximum Spend (£)</Label>
                  <Input
                    id="maxSpend"
                    type="number"
                    value={formData.maxSpend}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxSpend: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="discountValue">
                  Discount Value ({formData.discountType === 'percentage' ? '%' : '£'})
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="outlets" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dunfermline">Admin user</Label>
                <Switch
                  id="dunfermline"
                  checked={formData.outlets.dunfermline}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, outlets: { ...prev.outlets, dunfermline: checked } }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edinburgh">Edinburgh</Label>
                <Switch
                  id="edinburgh"
                  checked={formData.outlets.edinburgh}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, outlets: { ...prev.outlets, edinburgh: checked } }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="glasgow">Glasgow</Label>
                <Switch
                  id="glasgow"
                  checked={formData.outlets.glasgow}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, outlets: { ...prev.outlets, glasgow: checked } }))}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="availability" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="timeDependent">Time Dependent</Label>
                <Switch
                  id="timeDependent"
                  checked={formData.timeDependent}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, timeDependent: checked }))}
                />
              </div>

              {formData.timeDependent && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !formData.startDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? (
                            format(formData.startDate, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.startDate || undefined}
                          onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date || null }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !formData.endDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? (
                            format(formData.endDate, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.endDate || undefined}
                          onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date || null }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="maxUsesTotal">Max Total Uses</Label>
                  <Input
                    id="maxUsesTotal"
                    type="number"
                    value={formData.maxUses.total}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxUses: { ...prev.maxUses, total: parseInt(e.target.value) || 0 } }))}
                  />
                </div>

                <div>
                  <Label htmlFor="maxUsesPerCustomer">Max Uses Per Customer</Label>
                  <Input
                    id="maxUsesPerCustomer"
                    type="number"
                    value={formData.maxUses.perCustomer}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxUses: { ...prev.maxUses, perCustomer: parseInt(e.target.value) || 0 } }))}
                  />
                </div>

                <div>
                  <Label htmlFor="maxUsesPerDay">Max Uses Per Day</Label>
                  <Input
                    id="maxUsesPerDay"
                    type="number"
                    value={formData.maxUses.perDay}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxUses: { ...prev.maxUses, perDay: parseInt(e.target.value) || 0 } }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.daysAvailable).map(([day, enabled]) => (
                  <div key={day} className="flex items-center justify-between">
                    <Label htmlFor={day} className="capitalize">
                      {day}
                    </Label>
                    <Switch
                      id={day}
                      checked={enabled}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, daysAvailable: { ...prev.daysAvailable, [day]: checked } }))}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {Object.entries(formData.serviceTypes).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between">
                    <Label htmlFor={type} className="capitalize">
                      {type === 'tableOrdering' ? 'Table Ordering' : type}
                    </Label>
                    <Switch
                      id={type}
                      checked={enabled}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, serviceTypes: { ...prev.serviceTypes, [type]: checked } }))}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="firstOrderOnly">First Order Only</Label>
                <Switch
                  id="firstOrderOnly"
                  checked={formData.firstOrderOnly}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, firstOrderOnly: checked }))}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

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