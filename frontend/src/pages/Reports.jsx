import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle,
  AlertCircle,
  Clock,
  Target
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import axios from 'axios'

const Reports = () => {
  const [stats, setStats] = useState({})
  const [funds, setFunds] = useState([])
  const [tasks, setTasks] = useState([])
  const [agencies, setAgencies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, fundsRes, tasksRes, agenciesRes] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get('/api/funds'),
        axios.get('/api/tasks'),
        axios.get('/api/agencies')
      ])
      
      setStats(statsRes.data)
      setFunds(fundsRes.data)
      setTasks(tasksRes.data)
      setAgencies(agenciesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Prepare data for charts
  const fundUtilizationData = funds.map(fund => ({
    name: fund.component,
    allocated: fund.amount_allocated,
    used: fund.amount_used,
    utilization: fund.amount_allocated > 0 ? (fund.amount_used / fund.amount_allocated) * 100 : 0
  }))

  const taskStatusData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, color: '#10B981' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, color: '#3B82F6' },
    { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length, color: '#F59E0B' },
    { name: 'Overdue', value: tasks.filter(t => t.status === 'Overdue').length, color: '#EF4444' }
  ]

  const agencyTypeData = agencies.reduce((acc, agency) => {
    const type = agency.type
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const agencyTypeChartData = Object.entries(agencyTypeData).map(([type, count]) => ({
    name: type,
    value: count
  }))

  const stateWiseFunds = funds.reduce((acc, fund) => {
    const state = fund.state
    if (!acc[state]) {
      acc[state] = { allocated: 0, used: 0 }
    }
    acc[state].allocated += fund.amount_allocated
    acc[state].used += fund.amount_used
    return acc
  }, {})

  const stateWiseData = Object.entries(stateWiseFunds).map(([state, data]) => ({
    state,
    allocated: data.allocated,
    used: data.used,
    utilization: data.allocated > 0 ? (data.used / data.allocated) * 100 : 0
  }))

  const COLORS = ['#0057A3', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports Dashboard</h1>
          <p className="text-gray-600">Comprehensive analytics and performance metrics for PM-AJAY execution</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Agencies</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAgencies || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fund Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{(stats.utilizationRate || 0).toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Allocated</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAllocated || 0)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Task Completion</p>
                <p className="text-2xl font-bold text-gray-900">{(stats.completionRate || 0).toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Fund Utilization by Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fund Utilization by Component</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fundUtilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'allocated' ? formatCurrency(value) : 
                      name === 'used' ? formatCurrency(value) : 
                      `${value.toFixed(1)}%`,
                      name === 'allocated' ? 'Allocated' : 
                      name === 'used' ? 'Used' : 'Utilization'
                    ]}
                  />
                  <Bar dataKey="allocated" fill="#0057A3" name="allocated" />
                  <Bar dataKey="used" fill="#10B981" name="used" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Task Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Agency Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agency Type Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agencyTypeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0057A3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* State-wise Fund Utilization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="card mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">State-wise Fund Utilization</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stateWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    formatCurrency(value),
                    name === 'allocated' ? 'Allocated' : 'Used'
                  ]}
                />
                <Area type="monotone" dataKey="allocated" stackId="1" stroke="#0057A3" fill="#0057A3" fillOpacity={0.6} />
                <Area type="monotone" dataKey="used" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fund Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Allocated</span>
                <span className="font-semibold">{formatCurrency(stats.totalAllocated || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Used</span>
                <span className="font-semibold">{formatCurrency(stats.totalUsed || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Utilization Rate</span>
                <span className="font-semibold text-green-600">{(stats.utilizationRate || 0).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Tasks</span>
                <span className="font-semibold">{stats.totalTasks || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">{stats.completedTasks || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="font-semibold text-green-600">{(stats.completionRate || 0).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agency Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Agencies</span>
                <span className="font-semibold">{stats.totalAgencies || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Implementing</span>
                <span className="font-semibold">{agencies.filter(a => a.type === 'Implementing').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Executing</span>
                <span className="font-semibold">{agencies.filter(a => a.type === 'Executing').length}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Reports
