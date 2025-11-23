const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const onlineUsers = new Map()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id)

    socket.on('user:online', (userId) => {
      onlineUsers.set(userId, socket.id)
      io.emit('users:online', Array.from(onlineUsers.keys()))
      console.log('👤 User online:', userId)
    })

    socket.on('task:create', (task) => {
      console.log('📝 Task created:', task.title)
      io.emit('task:created', task)
    })

    socket.on('task:update', (task) => {
      console.log('✏️ Task updated:', task.title)
      io.emit('task:updated', task)
    })

    socket.on('task:delete', (taskId) => {
      console.log('🗑️ Task deleted:', taskId)
      io.emit('task:deleted', taskId)
    })

    socket.on('message:send', (message) => {
      console.log('💬 Message sent:', message.content)
      io.emit('message:new', message)
    })

    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId)
          io.emit('users:online', Array.from(onlineUsers.keys()))
          console.log('👋 User offline:', userId)
          break
        }
      }
      console.log('❌ User disconnected:', socket.id)
    })
  })

  server
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`🚀 Server ready on http://${hostname}:${port}`)
      console.log(`⚡ Socket.IO server is running`)
    })
})