import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Footer from './components/Footer'
import Home from './pages/Home'
import Agencies from './pages/Agencies'
import Funds from './pages/Funds'
import Communication from './pages/Communication'
import Reports from './pages/Reports'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
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
      </div>
    </Router>
  )
}

export default App
