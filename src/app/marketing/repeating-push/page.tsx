"use client"

import { useState, useEffect } from 'react'
import PageLayout from "@/components/layout/page-layout"
import { Button } from '@/components/ui/button'
import { Plus, Loader2, Eye } from 'lucide-react'
import { RepeatingPushModal } from '@/components/marketing/repeating-push-modal'
import { repeatingPushNotificationService, RepeatingPushNotification } from '@/services/repeating-push-notification.service'
import { toast } from 'sonner'

export default function RepeatingPushPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messages, setMessages] = useState<RepeatingPushNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const response = await repeatingPushNotificationService.getRepeatingPushNotifications()
      if (response.success) {
        setMessages(response.data)
      } else {
        toast.error('Failed to load repeating notifications')
      }
    } catch (error) {
      console.error('Error loading repeating notifications:', error)
      toast.error('Failed to load repeating notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveMessage = async (message: {
    messageText: string
    startRun: string
    endRun: string
    status: 'active' | 'inactive'
  }) => {
    try {
      setCreating(true)
      const response = await repeatingPushNotificationService.createRepeatingPushNotification({
        messageText: message.messageText,
        startRun: message.startRun,
        endRun: message.endRun,
        status: message.status,
        frequency: 'daily',
        interval: 1
      })

      if (response.success) {
        setIsModalOpen(false)
        toast.success('Repeating push notification created successfully!')
        // Refresh the list to show the new notification
        await loadNotifications()
      } else {
        toast.error(response.message || 'Failed to create repeating notification')
      }
    } catch (error: any) {
      console.error('Error creating repeating notification:', error)
      toast.error(error.response?.data?.message || 'Failed to create repeating notification')
    } finally {
      setCreating(false)
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await repeatingPushNotificationService.toggleRepeatingPushNotificationStatus(id)
      if (response.success) {
        toast.success(`Notification ${response.data.status === 'active' ? 'activated' : 'deactivated'} successfully`)
        await loadNotifications()
      } else {
        toast.error('Failed to toggle notification status')
      }
    } catch (error: any) {
      console.error('Error toggling notification status:', error)
      toast.error(error.response?.data?.message || 'Failed to toggle notification status')
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString()
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Repeating Push Messages</h1>
          <Button 
            onClick={() => setIsModalOpen(true)}
            disabled={creating}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Create New
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Loading repeating notifications...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No repeating messages have been created yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Message Text</th>
                    <th className="text-left p-4">Start Run</th>
                    <th className="text-left p-4">End Run</th>
                    <th className="text-left p-4">Last Run</th>
                    <th className="text-left p-4">Next Run</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 max-w-xs">
                        <div className="truncate" title={message.messageText}>
                          {message.messageText}
                        </div>
                      </td>
                      <td className="p-4">{formatDate(message.startRun)}</td>
                      <td className="p-4">{formatDate(message.endRun)}</td>
                      <td className="p-4">{formatDate(message.lastRun)}</td>
                      <td className="p-4">{formatDate(message.nextRun)}</td>
                      <td className="p-4">
                        <span className={`capitalize px-2 py-1 rounded-full text-sm ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(message._id)}
                            className={message.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                          >
                            {message.status === 'active' ? 'Pause' : 'Resume'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <RepeatingPushModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveMessage}
        />
      </div>
    </PageLayout>
  )
} 