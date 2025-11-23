// ==================== lib/socket.js ====================
'use client'

import { io } from 'socket.io-client'

let socket

export const initSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
      transports: ['websocket'],
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
    })
  }
  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
