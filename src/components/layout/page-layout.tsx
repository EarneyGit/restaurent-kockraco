"use client"

import React, { ReactNode } from "react"

interface PageLayoutProps {
  children: ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="w-full">
      {children}
    </div>
  )
} 