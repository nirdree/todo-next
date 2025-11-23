
// ==================== app/api/messages/route.js ====================
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Message from '@/models/Message'
import { getAuthUser } from '@/lib/auth'
import { messageSchema } from '@/lib/validations'

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const messages = await Message.find()
      .populate('sender', 'name email')
      .sort({ createdAt: 1 })
      .limit(100)

    return NextResponse.json({ messages })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const validatedData = messageSchema.parse(body)

    const message = await Message.create({
      content: validatedData.content,
      sender: authUser.userId,
    })

    await message.populate('sender', 'name email')

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
