
// ==================== app/api/auth/register/route.js ====================
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'
import { registerSchema } from '@/lib/validations'
import { generateToken, setAuthCookie } from '@/lib/auth'

export async function POST(request) {
  try {
    await connectDB()
    console.log('Database connected')

    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    const existingUser = await User.findOne({ email: validatedData.email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const user = await User.create(validatedData)

    const token = generateToken(user._id, user.role)

    const response = NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    )

    response.headers.set(...Object.entries(setAuthCookie(token))[0])

    return response
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    )
  }
}

