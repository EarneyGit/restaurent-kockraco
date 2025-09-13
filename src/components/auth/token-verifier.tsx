'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { usePathname } from 'next/navigation'

export function TokenVerifier() {
  const { verifyToken, isLoading } = useAuth()
  const pathname = usePathname() || '' 

  const authPages = ['/login', '/forgot-password', '/verify-otp', '/reset-password']
  const isAuthPage = authPages.includes(pathname)

  useEffect(() => {
    if (!isAuthPage && !isLoading) {
      verifyToken()
    }
  }, [pathname, isLoading, isAuthPage, verifyToken])

  return null
}
