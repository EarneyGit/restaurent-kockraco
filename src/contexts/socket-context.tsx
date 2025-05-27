'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { BaseUrl } from '@/lib/config'
import { useAuth } from './auth-context'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  onOrderEvent: (callback: (message: any) => void) => void
  offOrderEvent: (callback: (message: any) => void) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (isAuthenticated && token) {
      // Create socket connection
      const socketUrl = BaseUrl.replace(/^http/, 'ws')
      const newSocket = io(socketUrl, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      // Connection event listeners
      newSocket.on('connect', () => {
        console.log('Socket connected')
        setIsConnected(true)
      })

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected')
        setIsConnected(false)
      })

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
        setIsConnected(false)
      })

      // Authentication response handlers
      newSocket.on('joined_restaurant', (data) => {
        console.log('Successfully joined restaurant room:', data)
      })

      newSocket.on('auth_error', (error) => {
        console.error('Socket authentication error:', error)
        setIsConnected(false)
      })

      // Join restaurant room for order updates
      newSocket.emit('join_restaurant', { token })

      setSocket(newSocket)

      // Cleanup on unmount
      return () => {
        newSocket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
    } else {
      // Disconnect socket if not authenticated
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [isAuthenticated, token])

  // Event listener management functions
  const onOrderEvent = useCallback((callback: (message: any) => void) => {
    if (socket) {
      socket.on('order', callback)
    }
  }, [socket])

  const offOrderEvent = useCallback((callback: (message: any) => void) => {
    if (socket) {
      socket.off('order', callback)
    }
  }, [socket])

  const value = {
    socket,
    isConnected,
    onOrderEvent,
    offOrderEvent
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
} 