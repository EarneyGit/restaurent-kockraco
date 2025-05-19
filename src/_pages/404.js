import React from 'react'
import Link from 'next/link'

export default function Custom404() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      background: '#f5f5f5',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#333' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#555' }}>Page Not Found</h2>
      
      <p style={{ fontSize: '1.1rem', marginBottom: '30px', textAlign: 'center', maxWidth: '600px', color: '#666' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link 
        href="/" 
        style={{ 
          padding: '10px 20px', 
          background: '#2196F3', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: 'pointer',
          textDecoration: 'none'
        }}
      >
        Back to Home
      </Link>
    </div>
  )
} 