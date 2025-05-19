import React from 'react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      background: '#f5f5f5',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>
        Restroman UK
      </h1>
      
      <p style={{ fontSize: '1.2rem', marginBottom: '30px', textAlign: 'center', maxWidth: '600px', color: '#666' }}>
        Restaurant Management Dashboard - A comprehensive solution for restaurant owners and managers
      </p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', maxWidth: '600px' }}>
        <Link 
          href="/dashboard" 
          style={{ 
            padding: '12px 24px', 
            background: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Dashboard
        </Link>
        
        <Link 
          href="/pos" 
          style={{ 
            padding: '12px 24px', 
            background: '#2196F3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          POS System
        </Link>
        
        <Link 
          href="/orders" 
          style={{ 
            padding: '12px 24px', 
            background: '#FF9800', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Orders
        </Link>
        
        <Link 
          href="/products" 
          style={{ 
            padding: '12px 24px', 
            background: '#9C27B0', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Products
        </Link>
      </div>
    </div>
  )
} 