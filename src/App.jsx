import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

import Nav from './components/layout/Nav'
import Footer from './components/layout/Footer'
import ToastContainer from './components/ui/Toast'

import Landing from './pages/Landing'
import About from './pages/About'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Hub from './pages/Hub'
import Settings from './pages/Settings'
import History from './pages/History'
import DesignSystem from './pages/DesignSystem'

import Dictionary from './pages/admin/Dictionary'
import Collector from './pages/admin/Collector'
import Dashboard from './pages/admin/Dashboard'

import { useAuthStore } from './stores/authStore'

// Route guard for authenticated users
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />
}

// Route guard for admin-only pages
function AdminRoute() {
  const { isAuthenticated, isAdmin } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return isAdmin ? <Outlet /> : <Navigate to="/hub" replace />
}

// Global layout manager that shows/hides Nav/Footer depending on pathname
function AppLayout() {
  const location = useLocation()
  
  // Clean chrome setup:
  // Hide footer on dashboard-like pages to maximize vertical viewport space
  const hideNav = ['/', '/auth', '/onboarding'].includes(location.pathname)
  const hideFooter = ['/', '/auth', '/onboarding', '/hub', '/settings', '/history', '/admin/dictionary', '/admin/collector', '/admin/dashboard'].includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      {!hideNav && <Nav />}
      
      <main className="flex-1 flex flex-col">
        {/* AnimatePresence expects a unique key on the route level if we want page transition animations */}
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>

      {!hideFooter && <Footer />}
      
      {/* Global toast notifications */}
      <ToastContainer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/design-system" element={<DesignSystem />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/hub" element={<Hub />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/history" element={<History />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dictionary" element={<Dictionary />} />
            <Route path="/admin/collector" element={<Collector />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
