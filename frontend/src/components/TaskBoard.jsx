import React from 'react'
import { motion } from 'framer-motion'

const statusStyles = {
  Pending: 'bg-offwhite text-charcoal border-gray-200',
  'In Progress': 'bg-amber/20 text-charcoal border-amber/40',
  Completed: 'bg-success/10 text-charcoal border-success/30',
}

const TaskBoard = ({ tasks = [], onUpdate, onDelete }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {['Pending', 'In Progress', 'Completed'].map((status) => (
        <div key={status} className="space-y-3">
          <h3 className="text-sm font-semibold text-navy heading">{status}</h3>
          <div className="space-y-3">
            {tasks.filter((t) => t.status === status).map((task) => (
              <motion.div
                key={task.id}
                className={`p-4 rounded-lg border ${statusStyles[status]}`}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    {task.deadline && (
                      <p className="text-xs text-grayMed mt-1">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                    )}
                    {task.priority && (
                      <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded bg-offwhite border border-gray-200 text-grayMed">{task.priority}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {onUpdate && (
                      <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => onUpdate(task)}>Update</button>
                    )}
                    {onDelete && (
                      <button className="btn-primary text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white" onClick={() => onDelete(task)}>Delete</button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {tasks.filter((t) => t.status === status).length === 0 && (
              <div className="text-sm text-text/60">No tasks</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TaskBoard


