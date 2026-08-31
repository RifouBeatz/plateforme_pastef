import Exports from './pages/admin/Exports'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/admin/Login'
import AdminLayout from './pages/admin/AdminLayout'
import DashboardHome from './pages/admin/DashboardHome'
import Registrations from './pages/admin/Registrations'
import ChangePassword from './pages/admin/ChangePassword'
import MyAccount from './pages/admin/MyAccount'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/admin/login" element={<Login />} />
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

export default App