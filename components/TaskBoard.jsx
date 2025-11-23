// ==================== components/TaskBoard.jsx ====================
'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'
import { Plus } from 'lucide-react'

export default function TaskBoard({ socket, users }) {
  const { tasks } = useSelector((state) => state.tasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const tasksByStatus = {
    todo: tasks.filter((task) => task.status === 'todo'),
    'in-progress': tasks.filter((task) => task.status === 'in-progress'),
    done: tasks.filter((task) => task.status === 'done'),
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleTaskSuccess = (task) => {
    if (selectedTask) {
      socket.emit('task:update', task)
    } else {
      socket.emit('task:create', task)
    }
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  const handleDeleteTask = async (taskId) => {

    console.log("Attempting to delete task with ID:", taskId)
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })
      

      if (res.ok) {
        socket.emit('task:delete', taskId)
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100 border-gray-300' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50 border-blue-300' },
    { id: 'done', title: 'Done', color: 'bg-green-50 border-green-300' },
  ]

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Task Board</h2>
          <button
            onClick={handleCreateTask}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Task
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className={`${column.color} border-2 rounded-lg p-4 mb-4`}>
                <h3 className="font-semibold text-gray-800 flex items-center justify-between">
                  {column.title}
                  <span className="bg-white px-2 py-1 rounded text-sm">
                    {tasksByStatus[column.id].length}
                  </span>
                </h3>
              </div>

              <div className="space-y-3 flex-1">
                {tasksByStatus[column.id].length === 0 ? (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    No tasks
                  </div>
                ) : (
                  tasksByStatus[column.id].map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={() => handleEditTask(task)}
                      onDelete={() => handleDeleteTask(task._id)}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          users={users}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedTask(null)
          }}
          onSuccess={handleTaskSuccess}
        />
      )}
    </>
  )
}

