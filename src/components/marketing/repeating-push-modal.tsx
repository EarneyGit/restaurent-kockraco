'use client'

import { useState, useEffect } from 'react'
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

interface RepeatingPushModalProps {
  open: boolean
  onClose: () => void
  onSave: (message: {
    messageText: string
    startRun: string
    endRun: string
    status: 'active' | 'inactive'
  }) => void
}

export function RepeatingPushModal({ open, onClose, onSave }: RepeatingPushModalProps) {
  const [messageText, setMessageText] = useState('')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setMessageText('')
      setStartDate(undefined)
      setEndDate(undefined)
      setStartTime('')
      setEndTime('')
      setIsActive(true)
    }
  }, [open])

  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? '00' : '30'
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour.toString().padStart(2, '0')}:${minute} ${ampm}`
  })

  const handleSave = () => {
    if (!messageText.trim() || !startDate || !endDate || !startTime || !endTime) return

    const formatDateTime = (date: Date, time: string) => {
      const [timeStr, period] = time.split(' ')
      const [hours, minutes] = timeStr.split(':')
      let hour = parseInt(hours)
      
      if (period === 'PM' && hour !== 12) {
        hour += 12
      } else if (period === 'AM' && hour === 12) {
        hour = 0
      }

      const dateObj = new Date(date)
      dateObj.setHours(hour, parseInt(minutes), 0, 0)
      return dateObj.toISOString()
    }

    const message = {
      messageText,
      startRun: formatDateTime(startDate, startTime),
      endRun: formatDateTime(endDate, endTime),
      status: isActive ? 'active' as const : 'inactive' as const
    }

    onSave(message)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a Repeating Push Message</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Message Text</Label>
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Enter your message"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Start Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startTime && 'text-muted-foreground'
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {startTime || <span>Pick time</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <div className="h-[300px] overflow-y-auto p-2">
                    {times.map((t) => (
                      <div
                        key={t}
                        className={cn(
                          'cursor-pointer rounded px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
                          startTime === t && 'bg-accent text-accent-foreground'
                        )}
                        onClick={() => setStartTime(t)}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endTime && 'text-muted-foreground'
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {endTime || <span>Pick time</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <div className="h-[300px] overflow-y-auto p-2">
                    {times.map((t) => (
                      <div
                        key={t}
                        className={cn(
                          'cursor-pointer rounded px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
                          endTime === t && 'bg-accent text-accent-foreground'
                        )}
                        onClick={() => setEndTime(t)}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              id="active-status"
            />
            <Label htmlFor="active-status">Active</Label>
          </div>
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