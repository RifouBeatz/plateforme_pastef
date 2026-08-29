import { useEffect, useState } from 'react'

function Registrations() {
  const [inscriptions, setInscriptions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('pastef_admin_token')
    fetch('http://localhost:5001/api/admin/inscriptions', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setInscriptions(data.inscriptions)
        setLoading(false)
      })
      .catch(() => {
        setError('Impossible de charger les inscriptions.')
        setLoading(false)
      })
  }, [])

  const filtered = inscriptions.filter((i) => {
    const q = search.toLowerCase()
    return (
      i.nom.toLowerCase().includes(q) ||
      i.prenoms.toLowerCase().includes(q) ||
      i.pays.toLowerCase().includes(q) ||
      i.ville.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="bg-white rounded-lg shadow px-6 py-4 mb-6">
        <h2 className="text-xl font-bold text-[#00A651]">Enregistrements</h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="font-semibold text-gray-700">📋 Liste des Enregistrements</h3>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:border-[#00A651]"
          />
        </div>

        {loading && <p className="text-gray-500 p-5">Chargement...</p>}
        {error && <p className="text-[#CE1126] p-5">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-2 whitespace-nowrap">#</th>
                  <th className="px-4 py-2 whitespace-nowrap">Nom &amp; Prénoms</th>
                  <th className="px-4 py-2 whitespace-nowrap">Ville</th>
                  <th className="px-4 py-2 whitespace-nowrap">Pays</th>
                  <th className="px-4 py-2 whitespace-nowrap">Statut</th>
                  <th className="px-4 py-2 whitespace-nowrap">Email / Tél</th>
                  <th className="px-4 py-2 whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i, idx) => (
                  <tr key={i.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-800">{i.nom} {i.prenoms}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{i.ville}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{i.pays}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                        {i.statut}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{i.email || i.telephone}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(i.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 py-8 text-sm">Aucun résultat.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Registrations