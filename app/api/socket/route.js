import { Server } from 'socket.io'

let io

export async function GET(req) {
  if (!io) {
    const httpServer = req.socket.server
    
    if (!httpServer.io) {
      io = new Server(httpServer, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
          origin: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
          methods: ['GET', 'POST'],
        },
      })

      const onlineUsers = new Map()

      io.on('connection', (socket) => {
        console.log('User connected:', socket.id)

        socket.on('user:online', (userId) => {
          onlineUsers.set(userId, socket.id)
          io.emit('users:online', Array.from(onlineUsers.keys()))
        })

        socket.on('task:create', (task) => {
          io.emit('task:created', task)
        })

        socket.on('task:update', (task) => {
          io.emit('task:updated', task)
        })

        socket.on('task:delete', (taskId) => {
          io.emit('task:deleted', taskId)
        })

        socket.on('message:send', (message) => {
          io.emit('message:new', message)
        })

        socket.on('disconnect', () => {
          for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
              onlineUsers.delete(userId)
              io.emit('users:online', Array.from(onlineUsers.keys()))
              break
            }
          }
          console.log('User disconnected:', socket.id)
        })
      })

      httpServer.io = io
    } else {
      io = httpServer.io
    }
  }

  return new Response('Socket.IO server is running', { status: 200 })
}