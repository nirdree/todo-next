// ==================== components/DebugAuth.jsx ====================
// Add this temporarily to your login page to debug
'use client'

import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

export default function DebugAuth() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [cookies, setCookies] = useState('')

  useEffect(() => {
    setCookies(document.cookie)
  }, [])

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug Info:</h3>
      <div className="space-y-1">
        <p>Authenticated: {isAuthenticated ? '✅' : '❌'}</p>
        <p>User: {user ? user.name : 'None'}</p>
        <p>Cookies: {cookies || 'None'}</p>
      </div>
    </div>
  )
}

// Usage in login page:
// import DebugAuth from '@/components/DebugAuth'
// Add <DebugAuth /> at the end of your LoginPage component