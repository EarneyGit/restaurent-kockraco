import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/layout/sidebar"

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
        <main className="flex min-h-screen bg-gray-100">
          <div className="w-64 fixed h-screen overflow-hidden">
            <Sidebar />
          </div>
          <div className="flex-1 ml-64 flex flex-col">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
} 