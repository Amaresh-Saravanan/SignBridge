import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Nav from './components/layout/Nav'
import ToastContainer from './components/ui/Toast'

import Landing from './pages/Landing'
import Hub from './pages/Hub'

// Global layout manager that shows/hides Nav depending on pathname
function AppLayout() {
  const location = useLocation()
  const hideNav = ['/', '/auth'].includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      {!hideNav && <Nav />}

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>

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
          {/* Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/hub" element={<Hub />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
