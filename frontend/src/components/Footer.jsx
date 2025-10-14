import React from 'react'
import { Building2, Github, Mail, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <motion.footer 
      className="bg-gov-blue text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div 
            className="space-y-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gov-blue" />
              </div>
              <span className="text-xl font-bold">PM-AJAY</span>
            </div>
            <p className="text-gray-300 text-sm">
              Connecting Centre, States, and Agencies — Streamlining PM-AJAY Execution
            </p>
          </motion.div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">Home</a></li>
              <li><a href="/agencies" className="text-gray-300 hover:text-white transition-colors duration-200">Agency Mapping</a></li>
              <li><a href="/funds" className="text-gray-300 hover:text-white transition-colors duration-200">Fund Tracker</a></li>
              <li><a href="/communication" className="text-gray-300 hover:text-white transition-colors duration-200">Communication Hub</a></li>
              <li><a href="/reports" className="text-gray-300 hover:text-white transition-colors duration-200">Reports</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contact@pmajay.gov.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 11 1234 5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span>SIH 2024 Project</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2024 PM-AJAY Agency Mapping System. Built for Smart India Hackathon 2024.</p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
