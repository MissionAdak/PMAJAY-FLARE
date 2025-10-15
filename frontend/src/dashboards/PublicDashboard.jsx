import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, Filter, MapPin, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { api } from '../utils/api';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PublicDashboard = () => {
  const [data, setData] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [componentFilter, setComponentFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (data) {
      filterProjects();
    }
  }, [data, searchTerm, componentFilter]);

  const loadDashboard = async () => {
    try {
      const response = await api.dashboard.getPublic();
      setData(response.data);
      setFilteredProjects(response.data.projects);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    if (!data) return;

    let filtered = data.projects;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.state_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (componentFilter !== 'all') {
      filtered = filtered.filter(p => p.component === componentFilter);
    }

    setFilteredProjects(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'stalled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading public dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Failed to load dashboard data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-royal to-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">PM-AJAY Public Dashboard</h1>
          <p className="text-xl text-white/90">Track projects and fund utilization across India</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{data.totalProjects}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm text-gray-600">Total Budget</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  ₹{(data.totalBudget / 10000000).toFixed(2)}Cr
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
                <p className="text-sm text-gray-600">Active Projects</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {data.projects.filter(p => p.status === 'ongoing').length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects by title, state, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal focus:border-transparent"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={componentFilter}
              onChange={(e) => setComponentFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal focus:border-transparent"
            >
              <option value="all">All Components</option>
              <option value="AdarshGram">Adarsh Gram</option>
              <option value="GIA">Grant-in-Aid</option>
              <option value="Hostel">Hostel</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Locations</h3>
            <div className="h-96 rounded-lg overflow-hidden">
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredProjects.map((project) => (
                  <Marker
                    key={project.id}
                    position={[project.latitude, project.longitude]}
                    eventHandlers={{
                      click: () => setSelectedProject(project)
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-semibold text-sm">{project.title}</h4>
                        <p className="text-xs text-gray-600">{project.state_name}</p>
                        <p className="text-xs mt-1">Budget: ₹{(project.budget_total / 10000000).toFixed(2)}Cr</p>
                        <p className="text-xs">Progress: {project.progress_percent}%</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Project List</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="border border-gray-200 rounded-lg p-4 hover:border-royal hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{project.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{project.state_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>₹{(project.budget_total / 10000000).toFixed(2)}Cr</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Progress: {project.progress_percent}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    {selectedProject.component}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">{selectedProject.state_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-semibold">₹{(selectedProject.budget_total / 10000000).toFixed(2)}Cr</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Released</p>
                    <p className="font-semibold">₹{(selectedProject.budget_released / 10000000).toFixed(2)}Cr</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Progress</p>
                    <p className="font-semibold">{selectedProject.progress_percent}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-semibold">{new Date(selectedProject.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-semibold">{new Date(selectedProject.end_date).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedProject.description && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-gray-800">{selectedProject.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-2">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-royal h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedProject.progress_percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicDashboard;
