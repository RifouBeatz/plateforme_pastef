import { useState } from 'react'

function Exports() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const telecharger = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('pastef_admin_token')
      const res = await fetch('http://localhost:5001/api/admin/inscriptions', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      const inscriptions = data.inscriptions

      const bom = '\uFEFF'
      let csv = bom + 'Nom,Prénoms,Ville,Pays,Email,Téléphone,Statut,Date\n'
      inscriptions.forEach((i) => {
        const date = new Date(i.created_at).toLocaleDateString('fr-FR')
        csv += `"${i.nom}","${i.prenoms}","${i.ville}","${i.pays}","${i.email}","${i.telephone}","${i.statut}","${date}"\n`
      })

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pastef_enregistrements_${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Impossible de générer le fichier.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow px-6 py-4 mb-6">
        <h2 className="text-xl font-bold text-[#00A651]">Exports</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-[#00A651] font-semibold text-sm mb-4">📤 Exporter les Données</h3>
        <p className="text-sm text-gray-500 mb-4">
          Télécharge la liste complète des enregistrements au format CSV, utilisable dans Excel ou Google Sheets.
        </p>
        <button
          onClick={telecharger}
          disabled={loading}
          className="bg-[#00A651] hover:bg-[#008c44] text-white font-semibold px-5 py-2.5 rounded-md text-sm transition disabled:opacity-50"
        >
          {loading ? 'Préparation...' : '👥 Enregistrements (CSV)'}
        </button>
        {error && <p className="text-sm text-[#CE1126] mt-3">{error}</p>}
      </div>
    </div>
  )
}

export default Exports