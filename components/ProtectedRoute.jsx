
// ==================== components/ProtectedRoute.jsx ====================
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '@/redux/slices/authSlice'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        try {
          const res = await fetch('/api/auth/me')
          if (res.ok) {
            const data = await res.json()
            dispatch(setUser(data.user))
          } else {
            router.push('/login')
          }
        } catch (error) {
          router.push('/login')
        }
      }
    }

    checkAuth()
  }, [isAuthenticated, router, dispatch])

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
