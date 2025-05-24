'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import api from '@/lib/axios'

export default function VerifyOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState('')

  useEffect(() => {
    const emailParam = searchParams?.get('email')
    const typeParam = searchParams?.get('type')
    
    if (!emailParam || !typeParam) {
      router.push('/login')
      return
    }
    
    setEmail(emailParam)
    setType(typeParam)
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post('/auth/verify-otp', {
        email: email,
        otp: otp
      })
      const { data } = response

      if (data.success) {
        toast.success('OTP verified successfully')
        // Navigate to reset password page with token
        router.push(`/reset-password?token=${encodeURIComponent(data.token)}`)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid or expired OTP'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('OTP verification error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true)
    setError(null)

    try {
      const response = await api.post('/auth/forgot-password-otp', {
        email: email
      })
      const { data } = response

      if (data.success) {
        toast.success('New OTP sent to your email')
        setOtp('') // Clear the current OTP input
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Resend OTP error:', error)
    } finally {
      setIsResending(false)
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6) // Only numbers, max 6 digits
    setOtp(value)
  }

  if (!email || !type) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center mb-6">
          <Link href="/forgot-password" className="mr-3">
            <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-gray-800" />
          </Link>
          <h1 className="text-2xl font-bold">Verify OTP</h1>
        </div>
        
        <p className="text-gray-600 mb-2">
          We've sent a 6-digit verification code to:
        </p>
        <p className="text-gray-800 font-medium mb-6">{email}</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Didn't receive the code?
          </p>
          <Button
            variant="ghost"
            onClick={handleResendOtp}
            disabled={isResending}
            className="text-blue-600 hover:text-blue-800"
          >
            {isResending ? 'Resending...' : 'Resend OTP'}
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Link 
            href="/login" 
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
} 