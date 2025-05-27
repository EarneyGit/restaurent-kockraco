import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from '@/contexts/auth-context'
import { SocketProvider } from '@/contexts/socket-context'
import { Toaster } from 'sonner'
import ClientLayout from '../components/layout/client-layout'

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: "Restaurant Management System",
  description: "Restaurant management dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <SocketProvider>
            <ClientLayout>{children}</ClientLayout>
            <Toaster position="top-right" richColors />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 