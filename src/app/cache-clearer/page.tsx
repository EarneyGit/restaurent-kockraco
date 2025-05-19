"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CacheClearer() {
  const router = useRouter()
  
  useEffect(() => {
    // Clear any browser cache for the target page
    fetch('/clear-cache')
      .then(res => res.json())
      .then(data => {
        // Wait briefly to ensure cache headers take effect
        setTimeout(() => {
          // Use router.push to navigate with a timestamp to bust cache
          router.push(`/deliveryman-payments/completed?t=${Date.now()}`)
        }, 500)
      })
  }, [router])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-medium mb-6">Clearing browser cache...</h1>
      <p>You will be redirected in a moment.</p>
    </div>
  )
} 