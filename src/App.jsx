import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Landing from './pages/Landing'
import Hub from './pages/Hub'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/hub" element={<Hub />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
