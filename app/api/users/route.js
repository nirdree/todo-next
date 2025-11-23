
// ==================== app/api/users/route.js ====================
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const users = await User.find().select('name email role')

    return NextResponse.json({ users })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
