'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'

interface SmsEmailModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: any) => void
}

interface Restaurant {
  id: string
  name: string
  recipientCount: number
}

const RESTAURANTS: Restaurant[] = [
  { id: '1', name: 'Admin user', recipientCount: 19 },
  { id: '2', name: 'Edinburgh', recipientCount: 25 },
  { id: '3', name: 'Glasgow', recipientCount: 32 }
]

export function SmsEmailModal({ open, onClose, onSave }: SmsEmailModalProps) {
  const [messageType, setMessageType] = useState<string>('')
  const [target, setTarget] = useState<string>('')
  const [template, setTemplate] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [sendNow, setSendNow] = useState(true)
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState('')
  const [overrideGdpr, setOverrideGdpr] = useState(false)
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([])
  const [totalRecipients, setTotalRecipients] = useState(0)

  useEffect(() => {
    const total = selectedRestaurants.reduce((sum, restaurantId) => {
      const restaurant = RESTAURANTS.find(r => r.id === restaurantId)
      return sum + (restaurant?.recipientCount || 0)
    }, 0)
    setTotalRecipients(total)
  }, [selectedRestaurants])

  const handleSubmit = () => {
    onSave({
      messageType,
      target,
      template,
      subject,
      message,
      sendNow,
      date,
      time,
      overrideGdpr,
      selectedRestaurants
    })
    onClose()
  }

  const toggleRestaurant = (restaurantId: string) => {
    setSelectedRestaurants(prev =>
      prev.includes(restaurantId)
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create a Message</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <Label>Message Type</Label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">Select message type</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Target</Label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">Select target</option>
              <option value="ordered">Ordered Only</option>
              <option value="reservation">Reservation Only</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Template</Label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">Select template</option>
              <option value="standard">Standard</option>
            </select>
          </div>

          {messageType === 'email' && (
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={sendNow}
                onCheckedChange={setSendNow}
                id="send-now"
              />
              <Label htmlFor="send-now">
                Tick to send ASAP (Unticked = choose date and time)
              </Label>
            </div>

            {!sendNow && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Send this message on:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>at:</Label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={overrideGdpr}
                onCheckedChange={setOverrideGdpr}
                id="override-gdpr"
              />
              <Label htmlFor="override-gdpr">Override GDPR restrictions</Label>
            </div>
            {overrideGdpr && (
              <div className="text-sm text-gray-500">
                This will send the message to ALL users even if they haven&apos;t opt-ed into receiving messages.
                This CAN ONLY be used for service updates, and NOT for advertisement.
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Restaurants</Label>
            <div className="space-y-2">
              {RESTAURANTS.map(restaurant => (
                <div key={restaurant.id} className="flex items-center space-x-2">
                  <Switch
                    checked={selectedRestaurants.includes(restaurant.id)}
                    onCheckedChange={() => toggleRestaurant(restaurant.id)}
                    id={`restaurant-${restaurant.id}`}
                  />
                  <Label htmlFor={`restaurant-${restaurant.id}`}>{restaurant.name}</Label>
                </div>
              ))}
            </div>
          </div>

          {totalRecipients > 0 && (
            <div className="text-sm text-gray-600">
              This message will be sent to {totalRecipients} recipients
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-emerald-500 hover:bg-emerald-600">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 