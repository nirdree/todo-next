'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import TaskBoard from '@/components/TaskBoard'
import ChatPanel from '@/components/ChatPanel'
import UserList from '@/components/UserList'
import { setTasks, addTask, updateTask, removeTask } from '@/redux/slices/taskSlice'
import { setMessages, addMessage, setOnlineUsers } from '@/redux/slices/chatSlice'

let socket

export default function DashboardPage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [socketConnected, setSocketConnected] = useState(false)

  useEffect(() => {
    // Initialize Socket.IO
    socketInitializer()

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  const socketInitializer = async () => {
    // Connect to Socket.IO server running on the same server
    socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socket.on('connect', () => {
      console.log('✅ Socket.IO connected:', socket.id)
      setSocketConnected(true)
      if (user?._id) {
        socket.emit('user:online', user._id)
      }
    })

    socket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error)
      setSocketConnected(false)
    })

    socket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected')
      setSocketConnected(false)
    })

    socket.on('task:created', (task) => {
      console.log('📝 Task created event received:', task)
      dispatch(addTask(task))
    })

    socket.on('task:updated', (task) => {
      console.log('✏️ Task updated event received:', task)
      dispatch(updateTask(task))
    })

    socket.on('task:deleted', (taskId) => {
      console.log('🗑️ Task deleted event received:', taskId)
      dispatch(removeTask(taskId))
    })

    socket.on('message:new', (message) => {
      console.log('💬 New message received:', message)
      dispatch(addMessage(message))
    })

    socket.on('users:online', (onlineUserIds) => {
      console.log('👥 Online users updated:', onlineUserIds)
      dispatch(setOnlineUsers(onlineUserIds))
    })

    // Fetch initial data
    await Promise.all([
      fetchTasks(),
      fetchMessages(),
      fetchUsers()
    ])
  }

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      dispatch(setTasks(data.tasks))
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      dispatch(setMessages(data.messages))
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Connection Status Indicator */}
      <div className="mb-4 flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium text-gray-700">
            {socketConnected ? '✅ Real-time Connected' : '❌ Connecting...'}
          </span>
        </div>
        {socketConnected && (
          <span className="text-xs text-gray-500">
            Socket ID: {socket?.id}
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <TaskBoard socket={socket} users={users} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <UserList users={users} />
          <ChatPanel socket={socket} />
        </div>
      </div>
    </div>
  )
}
