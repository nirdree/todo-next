
// ==================== redux/slices/chatSlice.js ====================
'use client'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: [],
  onlineUsers: [],
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    },
  },
})

export const { setMessages, addMessage, setOnlineUsers } = chatSlice.actions
export default chatSlice.reducer

