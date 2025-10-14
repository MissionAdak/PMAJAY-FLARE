import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Building2, 
  DollarSign, 
  MessageSquare, 
  BarChart3, 
  ArrowRight, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Target
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Building2,
      title: 'Agency Mapping',
      description: 'Map and manage implementing and executing agencies across PM-AJAY components',
      link: '/agencies',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: DollarSign,
      title: 'Fund Tracker',
      description: 'Track fund allocation and utilization with real-time progress monitoring',
      link: '/funds',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description: 'Task-based communication system for inter-agency coordination',
      link: '/communication',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Reports Dashboard',
      description: 'Comprehensive analytics and performance metrics visualization',
      link: '/reports',
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const stats = [
    { label: 'Total Agencies', value: '50+', icon: Users },
    { label: 'Fund Utilization', value: '85%', icon: TrendingUp },
    { label: 'Active Projects', value: '120+', icon: Target },
    { label: 'Task Completion', value: '92%', icon: CheckCircle }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-saffron to-indiaGreen text-white overflow-hidden">
        <div className="absolute inset-0 bg-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.h1 
                  className="text-5xl lg:text-6xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  PM-AJAY
                  <span className="block text-white/80">Agency Mapping</span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-white/90 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Connecting Centre, States, and Agencies — Streamlining PM-AJAY Execution
                </motion.p>
              </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link 
                  to="/agencies"
                  className="text-lg px-8 py-4 inline-flex items-center justify-center group rounded-lg font-semibold shadow-sm hover:shadow-md bg-royal text-white hover:bg-[#004999]"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link 
                  to="/reports"
                  className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center"
                >
                  View Reports
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="rounded-2xl p-8 bg-gradient-to-br from-royal to-navy text-white shadow-md">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <motion.div
                        key={stat.label}
                        className="text-center space-y-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center mx-auto border border-white/20">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-white/80">{stat.label}</div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Agency Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline coordination between Centre, State/UT, Implementing, and Executing Agencies 
              with our integrated platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  className="card group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={feature.link} className="block">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gov-blue transition-colors duration-200">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-4 flex items-center text-gov-blue font-medium group-hover:translate-x-1 transition-transform duration-200">
                      Learn More
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Streamline PM-AJAY Execution?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join the network of agencies working together to deliver PM-AJAY objectives efficiently
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/agencies"
                className="bg-white text-navy px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center group"
              >
                Start Mapping Agencies
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link 
                to="/communication"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gov-blue transition-colors duration-200 inline-flex items-center justify-center"
              >
                Open Communication Hub
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
