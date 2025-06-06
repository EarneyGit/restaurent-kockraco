'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/services/auth.service'

interface User {
  id: string
  name: string
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

  // Check if user has authorized role
  const isAuthorized = user ? ALLOWED_ROLES.includes(user.roleDetails?.slug || user.role) : false

  const updateBranchId = (branchId: string) => {
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
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  // Verify token with backend
  const verifyToken = async () => {
    if (!token) return
    
    try {
      await authService.verifyToken()
      // Token is valid, do nothing
    } catch (error) {
      // Token is invalid or expired, logout
      logout()
    }
  }

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        
        setToken(storedToken)
        setUser(parsedUser)
        
        // If user role is not allowed, log them out
        if (!ALLOWED_ROLES.includes(parsedUser.roleDetails?.slug || parsedUser.role)) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
          setUser(null)
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        // Handle JSON parse error
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    
    setIsLoading(false)
  }, [])

  // Verify token on initial load and when token changes
  useEffect(() => {
    if (token && !isLoading) {
      verifyToken()
    }
  }, [token, isLoading])

  useEffect(() => {
    // Protect routes only after loading is complete
    if (!isLoading) {
      const isLoginPage = pathname === '/login'
      const isForgotPasswordPage = pathname === '/forgot-password'
      const isVerifyOtpPage = pathname === '/verify-otp'
      const isResetPasswordPage = pathname === '/reset-password'
      const isAuthPage = isLoginPage || isForgotPasswordPage || isVerifyOtpPage || isResetPasswordPage
      
      if (!token || !isAuthorized) {
        if (!isAuthPage) {
          router.push('/login')
        }
      }
      // Remove the automatic redirect from login page when authenticated
      // This allows users to manually access login page even when logged in
    }
  }, [token, pathname, isLoading, router, isAuthorized])

  const login = (newToken: string, newUser: User) => {
    // Check if user has authorized role
    if (!ALLOWED_ROLES.includes(newUser.roleDetails?.slug || newUser.role)) {
      throw new Error('Unauthorized role. Only admin, manager, and staff are allowed.')
    }

    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isAuthorized,
    isLoading,
    updateBranchId,
    verifyToken
  }

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