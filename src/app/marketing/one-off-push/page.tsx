"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Eye } from 'lucide-react'
import { OneOffPushModal } from '@/components/marketing/one-off-push-modal'
import PageLayout from "@/components/layout/page-layout"

interface PushMessage {
  id: string
  text: string
  scheduledTime?: Date
  status: 'scheduled' | 'sent' | 'failed'
}

export default function OneOffPushPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messages, setMessages] = useState<PushMessage[]>([])

  const handleSaveMessage = (message: { text: string; scheduledTime?: Date }) => {
    const newMessage: PushMessage = {
      id: Math.random().toString(36).substr(2, 9),
      text: message.text,
      scheduledTime: message.scheduledTime,
      status: message.scheduledTime ? 'scheduled' : 'sent'
    }
    setMessages(prev => [newMessage, ...prev])
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
          <h1 className="text-2xl font-medium">One-Off Push Messages</h1>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No push messages have been created yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Message Text</th>
                    <th className="text-left p-4">Scheduled Time</th>
                    <th className="text-left p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message.id} className="border-b">
                      <td className="p-4">{message.text}</td>
                      <td className="p-4">
                        {message.scheduledTime?.toLocaleString() || 'Immediate'}
                      </td>
                      <td className="p-4">
                        <span className={`capitalize px-2 py-1 rounded-full text-sm ${
                          message.status === 'sent' ? 'bg-green-100 text-green-800' :
                          message.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {message.status}
                        </span>
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