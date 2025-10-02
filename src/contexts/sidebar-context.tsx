"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  isMobile: boolean;
  isTablet: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Check screen size and auto-shrink on mobile/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;

      setIsMobile(mobile);
      setIsTablet(tablet);

      // Auto-collapse on mobile/tablet
      if (mobile || tablet) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobile,
        isTablet,
        setIsCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
