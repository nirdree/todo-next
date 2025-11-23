// ==================== components/UserList.jsx ====================
'use client'

import { useSelector } from 'react-redux'
import { Users, Circle } from 'lucide-react'

export default function UserList({ users }) {
  const { onlineUsers } = useSelector((state) => state.chat)

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Team Members</h3>
        <span className="ml-auto text-sm text-gray-500">{users.length}</span>
      </div>

      <div className="space-y-2">
        {users.map((user) => {
          const isOnline = onlineUsers.includes(user._id)

          return (
            <div
              key={user._id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <Circle
                  className={`absolute -bottom-1 -right-1 h-4 w-4 ${
                    isOnline ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>

              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {user.role}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Online</span>
          <span className="font-semibold text-green-600">{onlineUsers.length}</span>
        </div>
      </div>
    </div>
  )
}
