
// ==================== actions/taskActions.js ====================
'use server'

import { revalidatePath } from 'next/cache'
import connectDB from '@/lib/db'
import Task from '@/models/Task'
import { getAuthUser } from '@/lib/auth'
import { taskSchema } from '@/lib/validations'

export async function createTask(formData) {
  try {
    await connectDB()
    
    const authUser = await getAuthUser()
    if (!authUser) {
      return { success: false, error: 'Unauthorized' }
    }

    const validatedData = taskSchema.parse({
      title: formData.get('title'),
      description: formData.get('description'),
      status: formData.get('status') || 'todo',
      priority: formData.get('priority') || 'medium',
      assignedTo: formData.get('assignedTo') || undefined,
    })

    const task = await Task.create({
      ...validatedData,
      createdBy: authUser.userId,
    })

    await task.populate('createdBy assignedTo', 'name email')

    revalidatePath('/dashboard')
    return { success: true, task: JSON.parse(JSON.stringify(task)) }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function updateTask(taskId, formData) {
  try {
    await connectDB()
    
    const authUser = await getAuthUser()
    if (!authUser) {
      return { success: false, error: 'Unauthorized' }
    }

    const validatedData = taskSchema.parse({
      title: formData.get('title'),
      description: formData.get('description'),
      status: formData.get('status'),
      priority: formData.get('priority'),
      assignedTo: formData.get('assignedTo') || undefined,
    })

    const task = await Task.findByIdAndUpdate(
      taskId,
      validatedData,
      { new: true, runValidators: true }
    ).populate('createdBy assignedTo', 'name email')

    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    revalidatePath('/dashboard')
    return { success: true, task: JSON.parse(JSON.stringify(task)) }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function deleteTask(taskId) {
  try {
    await connectDB()
    
    const authUser = await getAuthUser()
    if (!authUser) {
      return { success: false, error: 'Unauthorized' }
    }

    const task = await Task.findByIdAndDelete(taskId)

    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
