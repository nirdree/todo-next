// ==================== app/api/auth/login/route.js ====================
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'
import { loginSchema } from '@/lib/validations'
import { generateToken, setAuthCookie } from '@/lib/auth'

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    const user = await User.findOne({ email: validatedData.email }).select('+password')

    if (!user || !(await user.comparePassword(validatedData.password))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = generateToken(user._id, user.role)

    const response = NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    response.headers.set(...Object.entries(setAuthCookie(token))[0])

    return response
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 400 }
    )
  }
}
