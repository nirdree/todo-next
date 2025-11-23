// app/api/tasks/[id]/route.js
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Task from '@/models/Task'
import { getAuthUser } from '@/lib/auth'
import { taskSchema } from '@/lib/validations'

// -------------------- UPDATE TASK --------------------
export async function PUT(request, context) {
  try {
    const params = await context.params;  

    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const validatedData = taskSchema.parse(body)

    const task = await Task.findByIdAndUpdate(
      params.id,
      validatedData,
      { new: true, runValidators: true }
    ).populate('createdBy assignedTo', 'name email')

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// -------------------- DELETE TASK --------------------
export async function DELETE(request, context) {
  const params = await context.params;     // <-- REQUIRED IN YOUR CASE
  console.log("Params:", params);

  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    console.log("Deleting task with ID:", params.id);

    const task = await Task.findByIdAndDelete(params.id);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


