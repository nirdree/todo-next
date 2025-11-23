
// ==================== lib/validations.js ====================
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).optional().default('user'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
  assignedTo: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
})

export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
})

