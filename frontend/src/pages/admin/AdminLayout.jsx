import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

function AdminLayout() {
  const [ready, setReady] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
    `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition ${
      isActive
        ? 'bg-[#d9efb8] font-bold text-[#123622] shadow-[0_8px_20px_rgba(0,0,0,.12)]'
        : 'text-white/65 hover:bg-white/10 hover:text-white'
    }`

  if (!ready) return null

  return (
    <div className="admin-shell min-h-screen bg-[#f4f6f1] text-[#173723]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-[#071d13]/60 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside className={`fixed z-40 h-screen w-64 overflow-y-auto bg-[#071d13] p-5 text-white shadow-2xl transition-transform duration-300 sm:p-6 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d9efb8] text-lg font-black text-[#123622]">P</span>
            <div>
              <div className="font-black tracking-tight">PASTEF</div>
              <div className="text-[10px] uppercase tracking-[.2em] text-white/45">Section Pologne</div>
            </div>
          </div>
        </div>

        <div className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-white/35">Espace de pilotage</div>
        <nav className="mb-10 space-y-1">
          <NavLink onClick={() => setSidebarOpen(false)} to="/admin/dashboard" end className={linkClass}><span>◈</span> Tableau de bord</NavLink>
          <NavLink onClick={() => setSidebarOpen(false)} to="/admin/dashboard/inscriptions" className={linkClass}><span>◌</span> Enregistrements</NavLink>
          <NavLink onClick={() => setSidebarOpen(false)} to="/admin/dashboard/exports" className={linkClass}><span>↗</span> Exports</NavLink>
          <NavLink onClick={() => setSidebarOpen(false)} to="/admin/dashboard/compte" className={linkClass}><span>◎</span> Mon compte</NavLink>
        </nav>

        <div className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-white/35">Session</div>
        <button
          onClick={handleLogout}
          className="w-full rounded-xl border border-[#ce1126]/40 bg-[#ce1126]/15 px-3 py-3 text-left text-sm font-semibold text-[#ffb1b9] transition hover:bg-[#ce1126]/25"
        >
          ↪ Déconnexion
        </button>
      </aside>

      <div className="min-h-screen p-4 sm:p-6 lg:ml-64 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between border-b border-[#dce4d9] pb-5 lg:mb-8">
            <button
              type="button"
              aria-label="Ouvrir le menu"
              onClick={() => setSidebarOpen(true)}
              className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#071d13] text-lg text-white shadow-lg lg:hidden"
            >
              ☰
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#ce1126]">Administration</p>
              <p className="mt-1 text-sm text-[#6b7c70]">Pilotez la vie de la Section Pologne</p>
            </div>
            <span className="hidden rounded-full bg-white px-4 py-2 text-xs font-bold text-[#168449] shadow-sm sm:block">Session sécurisée</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout