import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, DollarSign, FileText, Download } from 'lucide-react';
import { api } from '../utils/api';

const CentralDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.dashboard.getCentral();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!stats || !stats.stateWiseData) return;

    const headers = ['State', 'Projects', 'Budget', 'Progress'];
    const rows = stats.stateWiseData.map(s => [
      s.name,
      s.project_count,
      s.total_budget || 0,
      (s.avg_progress || 0).toFixed(2)
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pmajay-state-report.csv';
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Failed to load dashboard data</div>
      </div>
    );
  }

  const COLORS = ['#0057A3', '#FF8042', '#00C49F', '#FFBB28'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Central Government Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive overview of PM-AJAY implementation across India</p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-royal text-white rounded-lg hover:bg-navy transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProjects}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget Allocated</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  ₹{(stats.totalBudget / 10000000).toFixed(2)}Cr
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilization Rate</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.utilizationRate}%</h3>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">SLA Breaches</p>
                <h3 className="text-3xl font-bold text-red-600 mt-1">{stats.slabr || 0}</h3>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-white"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">State-wise Project Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.stateWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="code" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="project_count" fill="#0057A3" name="Projects" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card bg-white"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Component-wise Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.componentWiseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={entry => entry.component}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.componentWiseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card bg-white"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">State-wise Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Progress</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.stateWiseData.map((state, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{state.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{state.project_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{((state.total_budget || 0) / 10000000).toFixed(2)}Cr
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-royal h-2 rounded-full"
                            style={{ width: `${state.avg_progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{(state.avg_progress || 0).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CentralDashboard;
