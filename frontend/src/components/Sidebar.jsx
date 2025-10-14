import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Building2, DollarSign, MessageSquare, BarChart3, Home, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/agencies', label: 'Agencies', icon: Building2 },
  { path: '/funds', label: 'Fund Tracker', icon: DollarSign },
  { path: '/communication', label: 'Communication', icon: MessageSquare },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
]

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className={`h-[calc(100vh-4rem)] sticky top-16 hidden md:block ${collapsed ? 'w-16' : 'w-64'} transition-[width] duration-200`}>
      <div className="h-full border-r border-gray-200 bg-offwhite">
        <div className="h-12 flex items-center justify-end px-2">
          <button
            className="p-2 rounded-md hover:bg-white text-grayMed"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        <nav className="px-2 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-white text-navy border border-gray-200' : 'text-charcoal hover:text-navy hover:bg-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4" />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar


