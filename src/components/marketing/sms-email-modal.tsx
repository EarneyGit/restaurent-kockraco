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
import branchService, { Branch } from '@/services/branch.service'
import { toast } from 'react-hot-toast'

interface SmsEmailModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: any) => void
}

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
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  const [totalRecipients, setTotalRecipients] = useState(0)
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await branchService.getBranches()
        if (response.success) {
          setBranches(response.data)
        } else {
          toast.error('Failed to fetch branches')
        }
      } catch (error: any) {
        console.error('Error fetching branches:', error)
        toast.error(error.response?.data?.message || 'Failed to fetch branches')
      }
    }

    if (open) {
      fetchBranches()
    }
  }, [open])

  // Calculate total recipients (rough estimate)
  useEffect(() => {
    const total = selectedBranches.length * 25 // Rough estimate of 25 recipients per branch
    setTotalRecipients(total)
  }, [selectedBranches])

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setMessageType('')
      setTarget('')
      setTemplate('')
      setSubject('')
      setMessage('')
      setSendNow(true)
      setDate(undefined)
      setTime('')
      setOverrideGdpr(false)
      setSelectedBranches([])
      setTotalRecipients(0)
    }
  }, [open])

  const handleSubmit = () => {
    // Validation
    if (!messageType) {
      toast.error('Please select a message type')
      return
    }
    if (!target) {
      toast.error('Please select a target audience')
      return
    }
    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }
    if (messageType === 'email' && !subject.trim()) {
      toast.error('Please enter a subject for email messages')
      return
    }
    if (selectedBranches.length === 0) {
      toast.error('Please select at least one branch')
      return
    }
    if (!sendNow && (!date || !time)) {
      toast.error('Please select a date and time for scheduled messages')
      return
    }

    // Prepare scheduled time
    let scheduledTime: string | undefined = undefined
    if (!sendNow && date && time) {
      const scheduledDate = new Date(date)
      const [hours, minutes] = time.split(':')
      scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      scheduledTime = scheduledDate.toISOString()
    }

    const data: any = {
      type: messageType,
      target,
      template: template || 'standard',
      subject: messageType === 'email' ? subject : undefined,
      message: message.trim(),
      scheduledTime,
      targetBranches: selectedBranches,
      overrideGdpr
    }

    onSave(data)
    onClose()
  }

  const toggleBranch = (branchId: string) => {
    setSelectedBranches(prev =>
      prev.includes(branchId)
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
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
              <option value="all">All Customers</option>
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
            <Label>Branches</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {branches.map(branch => (
                <div key={branch._id} className="flex items-center space-x-2">
                  <Switch
                    checked={selectedBranches.includes(branch._id)}
                    onCheckedChange={() => toggleBranch(branch._id)}
                    id={`branch-${branch._id}`}
                  />
                  <Label htmlFor={`branch-${branch._id}`}>{branch.name}</Label>
                </div>
              ))}
            </div>
          </div>

          {totalRecipients > 0 && (
            <div className="text-sm text-gray-600">
              This message will be sent to approximately {totalRecipients} recipients
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-emerald-500 hover:bg-emerald-600"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 