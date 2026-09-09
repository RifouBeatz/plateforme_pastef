import { useEffect, useState } from 'react'

function BarChart({ title, data, colorClass = 'bg-gradient-to-r from-[#00A651] to-[#00C86B]' }) {
  const max = Math.max(...data.map((d) => d.total), 1)
  return (
    <div className="admin-card p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between"><h3 className="text-sm font-bold text-[#173723]">{title}</h3><span className="text-xs text-[#91a096]">Répartition</span></div>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <div className="w-28 truncate text-xs font-semibold text-[#607166] sm:w-36">{d.label}</div>
            <div className="h-8 flex-1 overflow-hidden rounded-lg bg-[#edf2eb]">
              <div
                className={`h-full ${colorClass} flex items-center justify-end px-2 text-white text-xs font-bold`}
                style={{ width: `${(d.total / max) * 100}%` }}
              >
                {d.total}
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-sm text-gray-400">Aucune donnée pour le moment.</p>}
      </div>
    </div>
  )
}

function DashboardHome() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('pastef_admin_token')
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Impossible de charger les statistiques.')
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="text-gray-500">Chargement...</p>
  if (error) return <p className="text-[#CE1126]">{error}</p>
  if (!stats) return null

  return (
    <div>
      <div className="admin-hero mb-6 flex flex-col justify-between gap-5 px-6 py-7 text-white sm:flex-row sm:items-end sm:px-8">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#d9efb8]">Vue d’ensemble</p><h2 className="mt-2 text-3xl font-black tracking-tight">Tableau de bord</h2></div>
        <span className="text-sm text-white/70">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="admin-card border-l-4 border-[#168449] p-5">
          <div className="text-4xl font-black text-[#168449]">{stats.total}</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-[#829187]">Total enregistrements</div>
        </div>
        <div className="admin-card border-l-4 border-[#ce1126] p-5">
          <div className="text-4xl font-black text-[#ce1126]">{stats.parPays.length}</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-[#829187]">Pays actifs</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarChart
          title="📍 Militants par Pays"
          data={stats.parPays.map((p) => ({ label: p.pays, total: Number(p.total) }))}
        />
        <BarChart
          title="📊 Statuts des Adhérents"
          data={stats.parStatut.map((s) => ({ label: s.statut, total: Number(s.total) }))}
          colorClass="bg-gradient-to-r from-[#CE1126] to-[#E74C3C]"
        />
      </div>
    </div>
  )
}

export default DashboardHome