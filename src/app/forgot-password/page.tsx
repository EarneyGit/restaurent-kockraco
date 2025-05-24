'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import api from '@/lib/axios'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post('/auth/forgot-password-otp', {
        email: email
      })
      const { data } = response

      if (data.success) {
        toast.success('OTP sent to your email successfully')
        // Navigate to OTP verification page with email
        router.push(`/verify-otp?email=${encodeURIComponent(email)}&type=forgot-password`)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred while sending OTP'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Forgot password error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center mb-6">
          <Link href="/login" className="mr-3">
            <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-gray-800" />
          </Link>
          <h1 className="text-2xl font-bold">Forgot Password</h1>
        </div>
        
        <p className="text-gray-600 mb-6">
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email}
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>

        <div className="mt-6 text-center">
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