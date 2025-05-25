"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Eye, Loader2 } from 'lucide-react'
import { OneOffPushModal } from '@/components/marketing/one-off-push-modal'
import PageLayout from "@/components/layout/page-layout"
import { pushNotificationService, PushNotification } from '@/services/push-notification.service'
import { toast } from 'sonner'

export default function OneOffPushPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messages, setMessages] = useState<PushNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const response = await pushNotificationService.getPushNotifications()
      if (response.success) {
        setMessages(response.data)
      } else {
        toast.error('Failed to load notifications')
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveMessage = async (message: { text: string; scheduledTime?: Date }) => {
    try {
      setCreating(true)
      const response = await pushNotificationService.createPushNotification({
      text: message.text,
        title: 'New Notification',
      scheduledTime: message.scheduledTime,
        targetAudience: 'all'
      })

      if (response.success) {
        setIsModalOpen(false)
        toast.success('Push notification created successfully!')
        // Refresh the list to show the new notification
        await loadNotifications()
      } else {
        toast.error(response.message || 'Failed to create notification')
      }
    } catch (error: any) {
      console.error('Error creating notification:', error)
      toast.error(error.response?.data?.message || 'Failed to create notification')
    } finally {
      setCreating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Immediate'
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
          <div>
          <h1 className="text-2xl font-medium">One-Off Push Messages</h1>
          </div>
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
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No push messages have been created yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Message Text</th>
                    <th className="text-left p-4">Title</th>
                    <th className="text-left p-4">Scheduled Time</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Target Audience</th>
                    <th className="text-left p-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 max-w-xs">
                        <div className="truncate" title={message.text}>
                          {message.text}
                        </div>
                      </td>
                      <td className="p-4">{message.title}</td>
                      <td className="p-4">
                        {formatDate(message.scheduledTime?.toString())}
                      </td>
                      <td className="p-4">
                        <span className={`capitalize px-2 py-1 rounded-full text-sm ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                      </td>
                      <td className="p-4 capitalize">
                        {message.targetAudience.replace('_', ' ')}
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {formatDate(message.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <OneOffPushModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveMessage}
        />
      </div>
    </PageLayout>
  )
} 