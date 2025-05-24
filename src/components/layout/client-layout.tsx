'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import Sidebar from './sidebar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || ''
  const { isAuthenticated, isLoading } = useAuth()
  const isLoginPage = pathname === '/login'
  const isForgotPasswordPage = pathname === '/forgot-password'
  const isVerifyOtpPage = pathname === '/verify-otp'
  const isResetPasswordPage = pathname === '/reset-password'
  const isAuthPage = isLoginPage || isForgotPasswordPage || isVerifyOtpPage || isResetPasswordPage
  const isLiveOrdersPage = pathname.startsWith('/orders/live') || 
                          pathname.startsWith('/orders/today') || 
                          pathname.startsWith('/orders/search') ||
                          pathname.startsWith('/orders/take-offline') ||
                          pathname.startsWith('/orders/settings') ||
                          pathname.startsWith('/orders/lead-times')

  // Don't show anything until authentication is checked
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-pulse text-lg">Loading...</div>
    </div>
  }

  // Show sidebar only if authenticated, not on auth pages, and not on live orders page
  const showSidebar = isAuthenticated && !isAuthPage && !isLiveOrdersPage

  // Don't render children if not authenticated and not on auth pages
  // This prevents the dashboard from flashing before redirect
  if (!isAuthenticated && !isAuthPage) {
    return null
  }

  return (
    <main className={`min-h-screen bg-gray-100 ${showSidebar ? 'flex' : ''}`}>
      {showSidebar && (
        <div className="w-64 fixed h-screen overflow-hidden">
          <Sidebar />
        </div>
      )}
      <div className={showSidebar ? "flex-1 ml-64 flex flex-col" : "w-full"}>
        {children}
      </div>
    </main>
  )
} 