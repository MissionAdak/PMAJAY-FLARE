import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, DollarSign, TrendingUp, Upload, Plus, CheckCircle } from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const StateDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [progressData, setProgressData] = useState({ progress_percent: 0, note: '' });
  const [fundData, setFundData] = useState({ amount: '', type: 'released', note: '' });
  const [reportFile, setReportFile] = useState(null);
  const [reportNotes, setReportNotes] = useState('');

  useEffect(() => {
    if (user && user.state_id) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    try {
      const response = await api.dashboard.getState(user.state_id || 1);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async () => {
    if (!selectedProject) return;
    try {
      await api.projects.updateProgress(
        selectedProject.id,
        progressData.progress_percent,
        progressData.note
      );
      setShowProgressModal(false);
      setProgressData({ progress_percent: 0, note: '' });
      loadDashboard();
    } catch (error) {
      alert('Failed to update progress: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAddFund = async () => {
    if (!selectedProject) return;
    try {
      await api.projects.addFundTransaction(
        selectedProject.id,
        parseFloat(fundData.amount),
        fundData.type,
        fundData.note
      );
      setShowFundModal(false);
      setFundData({ amount: '', type: 'released', note: '' });
      loadDashboard();
    } catch (error) {
      alert('Failed to add fund transaction: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUploadReport = async () => {
    if (!selectedProject || !reportFile) return;
    try {
      const formData = new FormData();
      formData.append('file', reportFile);
      formData.append('project_id', selectedProject.id);
      formData.append('notes', reportNotes);
      await api.reports.upload(formData);
      setShowReportModal(false);
      setReportFile(null);
      setReportNotes('');
      alert('Report uploaded successfully');
    } catch (error) {
      alert('Failed to upload report: ' + (error.response?.data?.error || error.message));
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{stats.state?.name} State Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and monitor projects in your state</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <Building2 className="w-6 h-6 text-blue-600" />
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
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-white"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">State Projects</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.projects && stats.projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.component}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{(project.budget_total / 10000000).toFixed(2)}Cr
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-royal h-2 rounded-full"
                            style={{ width: `${project.progress_percent}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{project.progress_percent}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'stalled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setProgressData({ progress_percent: project.progress_percent, note: '' });
                            setShowProgressModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setShowFundModal(true);
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setShowReportModal(true);
                          }}
                          className="text-orange-600 hover:text-orange-800"
                        >
                          <Upload className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {showProgressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Update Project Progress</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressData.progress_percent}
                    onChange={(e) => setProgressData({ ...progressData, progress_percent: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={progressData.note}
                    onChange={(e) => setProgressData({ ...progressData, note: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal focus:border-transparent"
                    rows="3"
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateProgress}
                    className="flex-1 bg-royal text-white px-4 py-2 rounded-lg hover:bg-navy transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setShowProgressModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showFundModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Add Fund Transaction</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={fundData.amount}
                    onChange={(e) => setFundData({ ...fundData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={fundData.type}
                    onChange={(e) => setFundData({ ...fundData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal focus:border-transparent"
                  >
                    <option value="allocated">Allocated</option>
                    <option value="released">Released</option>
                    <option value="utilized">Utilized</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={fundData.note}
                    onChange={(e) => setFundData({ ...fundData, note: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal focus:border-transparent"
                    rows="3"
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddFund}
                    className="flex-1 bg-royal text-white px-4 py-2 rounded-lg hover:bg-navy transition-colors"
                  >
                    Add Transaction
                  </button>
                  <button
                    onClick={() => setShowFundModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Upload Report</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                  <input
                    type="file"
                    onChange={(e) => setReportFile(e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal focus:border-transparent"
                    rows="3"
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUploadReport}
                    className="flex-1 bg-royal text-white px-4 py-2 rounded-lg hover:bg-navy transition-colors"
                  >
                    Upload
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StateDashboard;
