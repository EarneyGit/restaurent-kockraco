"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Eye, Trash2, Edit } from 'lucide-react'
import { SmsEmailModal } from '@/components/marketing/sms-email-modal'
import PageLayout from "@/components/layout/page-layout"
import smsEmailMessageService, { SmsEmailMessage, CreateSmsEmailMessageData } from '@/services/sms-email-message.service'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

export default function SmsEmailPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messages, setMessages] = useState<SmsEmailMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any>(null)

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages()
    fetchStats()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await smsEmailMessageService.getSmsEmailMessages()
      if (response.success) {
        setMessages(response.data)
      } else {
        toast.error('Failed to fetch messages')
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await smsEmailMessageService.getSmsEmailMessageStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSave = async (data: CreateSmsEmailMessageData) => {
    console.log('Parent handleSave called with data:', data); // Debug log
    
    try {
      setLoading(true)
      console.log('Calling smsEmailMessageService.createSmsEmailMessage...'); // Debug log
      const response = await smsEmailMessageService.createSmsEmailMessage(data)
      console.log('API response:', response); // Debug log
      
      if (response.success) {
        toast.success('Message created successfully')
        fetchMessages() // Refresh the list
        fetchStats() // Refresh stats
      } else {
        toast.error(response.message || 'Failed to create message')
        throw new Error(response.message || 'Failed to create message')
      }
    } catch (error: any) {
      console.error('Error creating message:', error)
      toast.error(error.response?.data?.message || 'Failed to create message')
      throw error // Re-throw to prevent modal from closing
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return
    }

    try {
      const response = await smsEmailMessageService.deleteSmsEmailMessage(id)
      if (response.success) {
        toast.success('Message deleted successfully')
        fetchMessages() // Refresh the list
        fetchStats() // Refresh stats
      } else {
        toast.error('Failed to delete message')
      }
    } catch (error: any) {
      console.error('Error deleting message:', error)
      toast.error(error.response?.data?.message || 'Failed to delete message')
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPp')
    } catch {
      return dateString
    }
  }

  return (
    <PageLayout>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-3 border-b bg-white">
        <div className="flex-1"></div>
        <h1 className="text-xl font-medium flex-1 text-center">SMS/Email Messages</h1>
        <div className="flex justify-end flex-1">
          <button className="flex items-center text-gray-700 font-medium">
            <Eye className="h-5 w-5 mr-1" />
            View Your Store
          </button>
        </div>
      </header>
      
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Messages</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Sent Messages</h3>
              <p className="text-2xl font-bold text-green-600">{stats.sentMessages}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Scheduled Messages</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.scheduledMessages}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Delivery Rate</h3>
              <p className="text-2xl font-bold text-purple-600">{stats.deliveryRate}%</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">SMS/Email Messages</h1>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No messages have been created yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Target</th>
                    <th className="text-left p-4">Subject</th>
                    <th className="text-left p-4">Message</th>
                    <th className="text-left p-4">Branches</th>
                    <th className="text-left p-4">Recipients</th>
                    <th className="text-left p-4">Scheduled Time</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <span className={`capitalize px-2 py-1 rounded-full text-sm ${
                          message.type === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {message.type}
                        </span>
                      </td>
                      <td className="p-4 capitalize">{message.target}</td>
                      <td className="p-4">{message.subject || '-'}</td>
                      <td className="p-4">
                        <div className="max-w-xs truncate" title={message.message}>
                          {message.message}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {message.targetBranches.map(branch => branch.name).join(', ')}
                        </div>
                      </td>
                      <td className="p-4">{message.metadata.totalRecipients}</td>
                      <td className="p-4">
                        {message.scheduledTime ? formatDate(message.scheduledTime) : 'Immediate'}
                      </td>
                      <td className="p-4">
                        <span className={`capitalize px-2 py-1 rounded-full text-sm ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(message._id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                            title="Delete message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <SmsEmailModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          loading={loading}
        />
      </div>
    </PageLayout>
  )
} 