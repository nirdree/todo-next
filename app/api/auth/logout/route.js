
// ==================== app/api/auth/logout/route.js ====================
import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.headers.set(...Object.entries(clearAuthCookie())[0])
  return response
}
