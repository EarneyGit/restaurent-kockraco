'use client'

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/services/auth.service'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  roleDetails?: {
    id: string
    name: string
    slug: string
  }
  branchId?: string
  branch?: {
    id: string
    name: string | undefined
    address: any
  }
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
  isAuthorized: boolean
  isLoading: boolean
  updateBranchId: (branchId: string) => void
  verifyToken: () => Promise<void>
}

const ALLOWED_ROLES = ['admin', 'manager', 'staff', 'superadmin']

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Check if user has authorized role - memoized
  const isAuthorized = useMemo(() => {
    return user ? ALLOWED_ROLES.includes(user.roleDetails?.slug || user.role) : false
  }, [user])

  const updateBranchId = useCallback((branchId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        branchId,
        branch: {
          id: branchId,
          name: user.branch?.name,
          address: user.branch?.address
        }
      }
      setUser(updatedUser)
      
      // Async localStorage update to avoid blocking UI
      setTimeout(() => {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }, 0)
    }
  }, [user])

  // Verify token with backend - memoized and throttled
  const verifyToken = useCallback(async () => {
    if (!token || !hasInitialized) return
    
    try {
      await authService.verifyToken()
      // Token is valid, do nothing
    } catch (error) {
      // Token is invalid or expired, logout
      logout()
    }
  }, [token, hasInitialized])

  // Initialize auth from localStorage - only once
  useEffect(() => {
    if (hasInitialized) return

    // Use setTimeout to avoid blocking the initial render
    setTimeout(() => {
      try {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser)
          
          // If user role is not allowed, clear storage immediately
          if (!ALLOWED_ROLES.includes(parsedUser.roleDetails?.slug || parsedUser.role)) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          } else {
            setToken(storedToken)
            setUser(parsedUser)
          }
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        // Handle JSON parse error by clearing storage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
        setHasInitialized(true)
      }
    }, 0)
  }, [hasInitialized])

  // Verify token periodically, not on every change
  useEffect(() => {
    if (!hasInitialized || !token) return

    // Initial verification
    verifyToken()

    // Set up periodic token verification (every 5 minutes)
    const interval = setInterval(verifyToken, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [token, hasInitialized, verifyToken])

  // Route protection - optimized to reduce redirects
  useEffect(() => {
    // Only run after initialization is complete
    if (!hasInitialized || isLoading) return

    const isLoginPage = pathname === '/login'
    const isForgotPasswordPage = pathname === '/forgot-password'
    const isVerifyOtpPage = pathname === '/verify-otp'
    const isResetPasswordPage = pathname === '/reset-password'
    const isAuthPage = isLoginPage || isForgotPasswordPage || isVerifyOtpPage || isResetPasswordPage
    
    // Only redirect if user is not authenticated/authorized and not on auth pages
    if ((!token || !isAuthorized) && !isAuthPage) {
      // Use replace instead of push to avoid history pollution
      router.replace('/login')
    }
  }, [token, pathname, hasInitialized, isLoading, router, isAuthorized])

  const login = useCallback((newToken: string, newUser: User) => {
    // Check if user has authorized role
    if (!ALLOWED_ROLES.includes(newUser.roleDetails?.slug || newUser.role)) {
      throw new Error('Unauthorized role. Only admin, manager, and staff are allowed.')
    }

    setToken(newToken)
    setUser(newUser)
    
    // Async localStorage update to avoid blocking UI
    setTimeout(() => {
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
    }, 0)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    
    // Async localStorage cleanup
    setTimeout(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }, 0)
    
    router.replace('/login')
  }, [router])

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isAuthorized,
    isLoading,
    updateBranchId,
    verifyToken
  }), [user, token, login, logout, isAuthorized, isLoading, updateBranchId, verifyToken])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 