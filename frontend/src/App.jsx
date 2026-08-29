import Exports from './pages/admin/Exports'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/admin/Login'
import AdminLayout from './pages/admin/AdminLayout'
import DashboardHome from './pages/admin/DashboardHome'
import Registrations from './pages/admin/Registrations'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="inscriptions" element={<Registrations />} />
          <Route path="exports" element={<Exports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App