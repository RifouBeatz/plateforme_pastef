import { useEffect, useState } from 'react'

function BarChart({ title, data, colorClass = 'bg-gradient-to-r from-[#00A651] to-[#00C86B]' }) {
  const max = Math.max(...data.map((d) => d.total), 1)
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h3 className="text-[#00A651] font-semibold text-sm mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <div className="w-28 sm:w-36 text-xs text-gray-600 truncate">{d.label}</div>
            <div className="flex-1 h-8 bg-gray-100 rounded overflow-hidden">
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
      <div className="bg-white rounded-lg shadow px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-xl font-bold text-[#00A651]">Tableau de Bord</h2>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-[#00A651]">
          <div className="text-3xl font-bold text-[#00A651]">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-1">Total Enregistrements</div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-[#CE1126]">
          <div className="text-3xl font-bold text-[#CE1126]">{stats.parPays.length}</div>
          <div className="text-xs text-gray-500 mt-1">Pays Actifs</div>
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