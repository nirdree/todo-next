// ==================== middleware.js ====================
import { NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

export function middleware(request) {

  const token = request.cookies.get('token').value


  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))

  }

  const decoded = verifyToken(token)

  if (!decoded) {
    return NextResponse.redirect(new URL('/login', request.url))
    console.log('Invalid token, redirecting to /login')
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
   runtime: 'nodejs'
}

export function proxy() {

  return NextResponse.next()
}