// ==================== lib/auth.js ====================
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function generateToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
  
    return null

  }
}

export async function getAuthUser(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) return null

    const decoded = verifyToken(token)
    if (!decoded) return null

    return decoded
  } catch (error) {
    return null
  }
}

export function setAuthCookie(token) {
  return {
    'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
      process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    }`,
  }
}

export function clearAuthCookie() {
  return {
    'Set-Cookie': 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict;',
  }
}
