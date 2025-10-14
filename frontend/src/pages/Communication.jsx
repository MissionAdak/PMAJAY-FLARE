import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Search,
  Filter
} from 'lucide-react'
import axios from 'axios'

const Communication = () => {
  const [tasks, setTasks] = useState([])
  const [agencies, setAgencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [formData, setFormData] = useState({
    sender: '',
    receiver: '',
    title: '',
    description: '',
    deadline: '',
    priority: 'Medium'
  })

  useEffect(() => {
    fetchTasks()
    fetchAgencies()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks')
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAgencies = async () => {
    try {
      const response = await axios.get('/api/agencies')
      setAgencies(response.data)
    } catch (error) {
      console.error('Error fetching agencies:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTask) {
        await axios.put(`/api/tasks/${editingTask.id}`, formData)
      } else {
        await axios.post('/api/tasks', formData)
      }
      fetchTasks()
      resetForm()
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      sender: task.sender,
      receiver: task.receiver,
      title: task.title,
      description: task.description || '',
      deadline: task.deadline || '',
      priority: task.priority
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${id}`)
        fetchTasks()
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const task = tasks.find(t => t.id === id)
      await axios.put(`/api/tasks/${id}`, {
        ...task,
        status: newStatus
      })
      fetchTasks()
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      sender: '',
      receiver: '',
      title: '',
      description: '',
      deadline: '',
      priority: 'Medium'
    })
    setEditingTask(null)
    setShowModal(false)
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.receiver.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />
      case 'In Progress': return <Clock className="w-4 h-4" />
      case 'Pending': return <AlertCircle className="w-4 h-4" />
      case 'Overdue': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const isOverdue = (deadline) => {
    if (!deadline) return false
    return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString()
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gov-blue"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Communication Hub</h1>
              <p className="text-gray-600">Task-based communication system for inter-agency coordination</p>
            </div>
            <motion.button
              onClick={() => setShowModal(true)}
              className="btn-primary mt-4 sm:mt-0 inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Task
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field pl-10"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="input-field pl-10"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task, index) => {
            const isTaskOverdue = isOverdue(task.deadline)
            const currentStatus = isTaskOverdue && task.status !== 'Completed' ? 'Overdue' : task.status
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card group"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-gov-blue transition-colors duration-200 mb-2">
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}>
                        {getStatusIcon(currentStatus)}
                        <span className="ml-1">{currentStatus}</span>
                      </span>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {task.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {task.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-medium">From:</span>
                    <span className="ml-1">{task.sender}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-medium">To:</span>
                    <span className="ml-1">{task.receiver}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium">Deadline:</span>
                    <span className={`ml-1 ${isTaskOverdue ? 'text-red-600 font-semibold' : ''}`}>
                      {formatDate(task.deadline)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {task.status !== 'Completed' && (
                    <button
                      onClick={() => handleStatusUpdate(task.id, 'In Progress')}
                      className="flex-1 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                    >
                      Start
                    </button>
                  )}
                  {task.status === 'In Progress' && (
                    <button
                      onClick={() => handleStatusUpdate(task.id, 'Completed')}
                      className="flex-1 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors duration-200"
                    >
                      Complete
                    </button>
                  )}
                  {task.status === 'Pending' && (
                    <button
                      onClick={() => handleStatusUpdate(task.id, 'Completed')}
                      className="flex-1 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors duration-200"
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && resetForm()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Sender</label>
                <select
                  required
                  value={formData.sender}
                  onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Sender</option>
                  {agencies.map(agency => (
                    <option key={agency.id} value={agency.name}>{agency.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Receiver</label>
                <select
                  required
                  value={formData.receiver}
                  onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Receiver</option>
                  {agencies.map(agency => (
                    <option key={agency.id} value={agency.name}>{agency.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Task Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Submit Progress Report"
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Describe the task details..."
                />
              </div>
              <div>
                <label className="label">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Communication
