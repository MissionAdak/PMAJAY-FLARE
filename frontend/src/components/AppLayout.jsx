import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { motion, AnimatePresence } from 'framer-motion'

const AppLayout = ({ children }) => {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-cream text-text">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <Sidebar />
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              className="flex-1 py-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default AppLayout


