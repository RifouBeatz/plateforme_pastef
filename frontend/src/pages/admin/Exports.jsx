import { useState } from 'react'

function Exports() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const telecharger = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('pastef_admin_token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/inscriptions`, {
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
      <div className="admin-hero mb-6 px-6 py-7 text-white sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d9efb8]">Données</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight">Exports</h2>
      </div>

      <div className="admin-card max-w-2xl p-6 sm:p-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f2df] text-xl text-[#168449]">↗</div>
        <h3 className="text-xl font-black text-[#173723]">Exporter les données</h3>
        <p className="mb-6 mt-2 max-w-lg text-sm leading-6 text-[#6b7c70]">
          Télécharge la liste complète des enregistrements au format CSV, utilisable dans Excel ou Google Sheets.
        </p>
        <button
          onClick={telecharger}
          disabled={loading}
          className="rounded-full bg-[#168449] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0f6e3c] disabled:opacity-50"
        >
          {loading ? 'Préparation...' : '👥 Enregistrements (CSV)'}
        </button>
        {error && <p className="text-sm text-[#CE1126] mt-3">{error}</p>}
      </div>
    </div>
  )
}

export default Exports