import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

function AdminLayout() {
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()

    useEffect(() => {
    const token = localStorage.getItem('pastef_admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    if (localStorage.getItem('pastef_must_change_password') === 'true') {
      navigate('/admin/change-password')
      return
    }
    setReady(true)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('pastef_admin_token')
    localStorage.removeItem('pastef_must_change_password')
    navigate('/admin/login')
  }

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-md text-sm mb-1 transition ${
      isActive ? 'bg-[#00A651] font-semibold' : 'hover:bg-[#00A651]/70'
    }`

  if (!ready) return null

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-48 sm:w-60 bg-[#1a1a1a] text-white p-4 sm:p-6 fixed h-screen overflow-y-auto">
        <div className="font-bold text-lg mb-1">🇸🇳 PASTEF</div>
        <div className="text-xs opacity-60 mb-6">Admin Dashboard</div>

        <div className="text-xs uppercase opacity-50 tracking-wide mb-3">Navigation</div>
        <nav className="mb-8">
          <NavLink to="/admin/dashboard" end className={linkClass}>📊 Tableau de Bord</NavLink>
          <NavLink to="/admin/dashboard/inscriptions" className={linkClass}>👥 Enregistrements</NavLink>
          <NavLink to="/admin/dashboard/exports" className={linkClass}>📤 Exports</NavLink>
          <NavLink to="/admin/dashboard/compte" className={linkClass}>👤 Mon Compte</NavLink>
        </nav>

        <div className="text-xs uppercase opacity-50 tracking-wide mb-3">Compte</div>
        <button
          onClick={handleLogout}
          className="w-full bg-[#CE1126] text-white py-2.5 rounded-md text-sm font-semibold"
        >
          🚪 Déconnexion
        </button>
      </aside>

      <div className="flex-1 ml-48 sm:ml-60 p-4 sm:p-6">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout