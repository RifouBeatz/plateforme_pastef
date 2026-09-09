import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/admin/Login'
import ForgotPassword from './pages/admin/ForgotPassword'
import ResetPassword from './pages/admin/ResetPassword'
import ChangePassword from './pages/admin/ChangePassword'
import AdminLayout from './pages/admin/AdminLayout'
import DashboardHome from './pages/admin/DashboardHome'
import Registrations from './pages/admin/Registrations'
import Exports from './pages/admin/Exports'
import MyAccount from './pages/admin/MyAccount'

function App() {
  return (
    <BrowserRouter>
      <PageTitle />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route path="/admin/change-password" element={<ChangePassword />} />
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="inscriptions" element={<Registrations />} />
          <Route path="exports" element={<Exports />} />
          <Route path="compte" element={<MyAccount />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function PageTitle() {
  const location = useLocation()

  useEffect(() => {
    document.title = location.pathname.startsWith('/admin')
      ? 'PASTEF Section Pologne Admin'
      : 'PASTEF Section Pologne'
  }, [location.pathname])

  return null
}

export default App