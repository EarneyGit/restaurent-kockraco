"use client"

import { useState } from 'react'
import PageLayout from "@/components/layout/page-layout"
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { RepeatingPushModal } from '@/components/marketing/repeating-push-modal'

interface RepeatingMessage {
  id: string
  messageText: string
  startRun: string
  endRun: string
  lastRun: string | null
  nextRun: string | null
  status: 'active' | 'inactive'
}

export default function RepeatingPushPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messages, setMessages] = useState<RepeatingMessage[]>([])

  const handleSaveMessage = (message: RepeatingMessage) => {
    setMessages(prev => [...prev, message])
  }

  return (
    <PageLayout>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-3 border-b bg-white">
        <div className="flex-1"></div>
        <h1 className="text-xl font-medium flex-1 text-center">Admin user</h1>
        <div className="flex justify-end flex-1">
          <button className="flex items-center text-gray-700 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            View Your Store
          </button>
        </div>
      </header>
      
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Repeating Push Messages</h1>
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
                    <tr key={message.id} className="border-b">
                      <td className="p-4">{message.messageText}</td>
                      <td className="p-4">{new Date(message.startRun).toLocaleString()}</td>
                      <td className="p-4">{new Date(message.endRun).toLocaleString()}</td>
                      <td className="p-4">{message.lastRun ? new Date(message.lastRun).toLocaleString() : '-'}</td>
                      <td className="p-4">{message.nextRun ? new Date(message.nextRun).toLocaleString() : '-'}</td>
                      <td className="p-4">
                        <span className={`capitalize px-2 py-1 rounded-full text-sm ${
                          message.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {message.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Handle edit
                          }}
                        >
                          Edit
                        </Button>
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