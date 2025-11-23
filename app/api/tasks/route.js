
// ==================== app/api/tasks/route.js ====================
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Task from '@/models/Task'
import { getAuthUser } from '@/lib/auth'
import { taskSchema } from '@/lib/validations'

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const tasks = await Task.find()
      .populate('createdBy assignedTo', 'name email')
      .sort({ createdAt: -1 })

    return NextResponse.json({ tasks })
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
    const validatedData = taskSchema.parse(body)

    const task = await Task.create({
      ...validatedData,
      createdBy: authUser.userId,
    })

    await task.populate('createdBy assignedTo', 'name email')

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

