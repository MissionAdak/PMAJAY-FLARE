import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Building2, 
  MapPin, 
  Mail, 
  Users,
  Search,
  Filter
} from 'lucide-react'
import axios from 'axios'

const Agencies = () => {
  const [agencies, setAgencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAgency, setEditingAgency] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    role: '',
    contact: ''
  })

  useEffect(() => {
    fetchAgencies()
  }, [])

  const fetchAgencies = async () => {
    try {
      const response = await axios.get('/api/agencies')
      setAgencies(response.data)
    } catch (error) {
      console.error('Error fetching agencies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAgency) {
        await axios.put(`/api/agencies/${editingAgency.id}`, formData)
      } else {
        await axios.post('/api/agencies', formData)
      }
      fetchAgencies()
      resetForm()
    } catch (error) {
      console.error('Error saving agency:', error)
    }
  }

  const handleEdit = (agency) => {
    setEditingAgency(agency)
    setFormData({
      name: agency.name,
      type: agency.type,
      location: agency.location,
      role: agency.role,
      contact: agency.contact || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this agency?')) {
      try {
        await axios.delete(`/api/agencies/${id}`)
        fetchAgencies()
      } catch (error) {
        console.error('Error deleting agency:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      location: '',
      role: '',
      contact: ''
    })
    setEditingAgency(null)
    setShowModal(false)
  }

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'All' || agency.type === filterType
    return matchesSearch && matchesFilter
  })

  const getTypeColor = (type) => {
    switch (type) {
      case 'Implementing': return 'bg-blue-100 text-blue-800'
      case 'Executing': return 'bg-green-100 text-green-800'
      case 'Central Government': return 'bg-purple-100 text-purple-800'
      case 'State Government': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Agency Mapping</h1>
              <p className="text-gray-600">Manage implementing and executing agencies across PM-AJAY components</p>
            </div>
            <motion.button
              onClick={() => setShowModal(true)}
              className="btn-primary mt-4 sm:mt-0 inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Agency
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search agencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field pl-10"
              >
                <option value="All">All Types</option>
                <option value="Implementing">Implementing</option>
                <option value="Executing">Executing</option>
                <option value="Central Government">Central Government</option>
                <option value="State Government">State Government</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Agencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgencies.map((agency, index) => (
            <motion.div
              key={agency.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card group"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gov-blue rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-gov-blue transition-colors duration-200">
                      {agency.name}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(agency.type)}`}>
                      {agency.type}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(agency)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(agency.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{agency.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{agency.role}</span>
                </div>
                {agency.contact && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="truncate">{agency.contact}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAgencies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No agencies found</h3>
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
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingAgency ? 'Edit Agency' : 'Add New Agency'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Agency Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Type</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Type</option>
                  <option value="Implementing">Implementing</option>
                  <option value="Executing">Executing</option>
                  <option value="Central Government">Central Government</option>
                  <option value="State Government">State Government</option>
                  <option value="Non-Governmental">Non-Governmental</option>
                </select>
              </div>
              <div>
                <label className="label">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Role</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Contact Email</label>
                <input
                  type="email"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="input-field"
                />
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
                  {editingAgency ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Agencies
