'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { CalendarIcon, Clock } from 'lucide-react'

interface OneOffPushModalProps {
  open: boolean
  onClose: () => void
  onSave: (message: {
    text: string
    scheduledTime?: Date
  }) => void
}

export function OneOffPushModal({ open, onClose, onSave }: OneOffPushModalProps) {
  const [message, setMessage] = useState('')
  const [sendNow, setSendNow] = useState(true)
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>('')

  const handleSave = () => {
    if (!message.trim()) return

    const scheduledTime = !sendNow && date && time
      ? (() => {
          const [timeStr, period] = time.split(' ')
          const [hours, minutes] = timeStr.split(':')
          let hour = parseInt(hours)
          
          // Convert to 24-hour format
          if (period === 'PM' && hour !== 12) {
            hour += 12
          } else if (period === 'AM' && hour === 12) {
            hour = 0
          }

          const dateObj = new Date(date)
          dateObj.setHours(hour, parseInt(minutes), 0, 0)
          return dateObj
        })()
      : undefined

    onSave({
      text: message,
      scheduledTime
    })
    
    // Reset form
    setMessage('')
    setSendNow(true)
    setDate(undefined)
    setTime('')
    onClose()
  }

  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? '00' : '30'
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour.toString().padStart(2, '0')}:${minute} ${ampm}`
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a One-off Push Message</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Text</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={sendNow}
              onCheckedChange={setSendNow}
              id="send-now"
            />
            <Label htmlFor="send-now">Send Now</Label>
          </div>

          {!sendNow && (
            <div className="space-y-2">
              <Label>Delay Until</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
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

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[140px] justify-start text-left font-normal',
                        !time && 'text-muted-foreground'
                      )}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {time || <span>Pick time</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <div className="h-[300px] overflow-y-auto p-2">
                      {times.map((t) => (
                        <div
                          key={t}
                          className={cn(
                            'cursor-pointer rounded px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
                            time === t && 'bg-accent text-accent-foreground'
                          )}
                          onClick={() => setTime(t)}
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 