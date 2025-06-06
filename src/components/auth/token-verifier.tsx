'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { usePathname } from 'next/navigation'

export function TokenVerifier() {
  const { verifyToken, isLoading } = useAuth()
  const pathname = usePathname()
  
  // List of auth pages that don't need token verification
  const authPages = ['/login', '/forgot-password', '/verify-otp', '/reset-password']
  const isAuthPage = authPages.includes(pathname)
  
  useEffect(() => {
    // Skip verification for auth pages and when still loading
    if (!isAuthPage && !isLoading) {
      // Verify token on initial render and when pathname changes
      verifyToken()
    }
  }, [pathname, isLoading, isAuthPage, verifyToken])

  // This is a utility component that doesn't render anything
  return null
} 