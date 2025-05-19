"use client"

import React from 'react'

export default function TestPage() {
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-medium mb-6">Test Page</h1>
      <p>If you can see this page, routing is working correctly.</p>
      <p>Try accessing the <a href="/deliveryman-payments/completed" className="text-blue-500 underline">Deliveryman Completed Payments</a> page now.</p>
    </div>
  )
} 