"use client"

import React, { useState } from 'react'
import PageLayout from '@/components/layout/page-layout'

export default function AddFundsPage() {
  const [user, setUser] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  
  const handleReset = () => {
    setUser('')
    setAmount('')
    setNote('')
  }
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would be an API call
    alert(`Adding $${amount} to user: ${user}\nNote: ${note}`)
  }

  return (
    <PageLayout>
      <div className="w-full p-6">
        <h1 className="text-2xl font-medium mb-6">Add funds</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="user" className="block text-sm font-medium mb-2">
              <span className="text-red-500">*</span> User
            </label>
            <input
              id="user"
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              <span className="text-red-500">*</span> Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                $
              </span>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="note" className="block text-sm font-medium mb-2">
              Note
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={4}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>

        <div className="mt-8 text-sm text-gray-600">
          Restroman UK support team <a href="tel:123456789" className="text-blue-500">123456789</a>
        </div>
      </div>
    </PageLayout>
  )
} 