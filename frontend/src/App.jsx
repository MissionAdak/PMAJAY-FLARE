import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './components/AppLayout'
import Footer from './components/Footer'
import Home from './pages/Home'
import Agencies from './pages/Agencies'
import Funds from './pages/Funds'
import Communication from './pages/Communication'
import Reports from './pages/Reports'
import Login from './pages/Login'
import CentralDashboard from './dashboards/CentralDashboard'
import StateDashboard from './dashboards/StateDashboard'
import PublicDashboard from './dashboards/PublicDashboard'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/central" element={<CentralDashboard />} />
            <Route path="/dashboard/state" element={<StateDashboard />} />
            <Route path="/dashboard/public" element={<PublicDashboard />} />
            <Route path="/*" element={
              <>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/agencies" element={<Agencies />} />
                    <Route path="/funds" element={<Funds />} />
                    <Route path="/communication" element={<Communication />} />
                    <Route path="/reports" element={<Reports />} />
                  </Routes>
                </AppLayout>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
