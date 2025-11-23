// ==================== components/TaskCard.jsx ====================
'use client'

import { Edit2, Trash2, User, Clock } from 'lucide-react'
import { format } from 'date-fns'

export default function TaskCard({ task, onEdit, onDelete }) {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900 flex-1 pr-2">{task.title}</h4>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit task"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>

        {task.assignedTo && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <User className="h-3 w-3" />
            <span>{task.assignedTo.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-500 mt-3 pt-3 border-t">
        <Clock className="h-3 w-3" />
        <span>{format(new Date(task.createdAt), 'MMM dd, yyyy')}</span>
      </div>
    </div>
  )
}
