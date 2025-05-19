import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse(
    JSON.stringify({ 
      redirect: '/deliveryman-payments/completed',
      timestamp: Date.now()
    }), 
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    }
  )
} 