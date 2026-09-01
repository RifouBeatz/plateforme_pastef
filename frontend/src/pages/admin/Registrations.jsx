import { useEffect, useState } from 'react'

const STATUTS = ['Sympathisant', 'Militant']

const formVide = {
  nom: '', prenoms: '', pays: '', ville: '', telephone: '', email: '', statut: '', consentement: false,
}

function Registrations() {
  const [inscriptions, setInscriptions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(formVide)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const token = localStorage.getItem('pastef_admin_token')

  useEffect(() => {
    chargerInscriptions()
  }, [])

  const chargerInscriptions = () => {
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/inscriptions`, {
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
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleAjouter = async (e) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/inscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setFormError(data.error || 'Une erreur est survenue.')
        setSubmitting(false)
        return
      }

      setShowModal(false)
      setForm(formVide)
      setSubmitting(false)
      chargerInscriptions()
    } catch (err) {
      setFormError('Impossible de contacter le serveur.')
      setSubmitting(false)
    }
  }

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
      <div className="bg-white rounded-lg shadow px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-bold text-[#00A651]">Enregistrements</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#00A651] hover:bg-[#008c44] text-white text-sm font-semibold px-4 py-2 rounded-md transition"
        >
          + Ajouter manuellement
        </button>
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
                  <th className="px-4 py-2 whitespace-nowrap">Téléphone</th>
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
                    <td className="px-4 py-2 whitespace-nowrap">{i.telephone}</td>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#00A651]">Ajouter un enregistrement</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            <form onSubmit={handleAjouter} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <ChampModal label="Nom" name="nom" value={form.nom} onChange={handleFormChange} />
                <ChampModal label="Prénom(s)" name="prenoms" value={form.prenoms} onChange={handleFormChange} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ChampModal label="Ville" name="ville" value={form.ville} onChange={handleFormChange} />
                <ChampModal label="Pays" name="pays" value={form.pays} onChange={handleFormChange} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ChampModal label="Téléphone" name="telephone" type="tel" value={form.telephone} onChange={handleFormChange} />
                <ChampModal label="Email" name="email" type="email" value={form.email} onChange={handleFormChange} />
              </div>

              <label className="block">
                <span className="block text-xs font-semibold text-gray-700 mb-1">Statut</span>
                <select
                  name="statut"
                  value={form.statut}
                  onChange={handleFormChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#00A651]"
                >
                  <option value="">-- Sélectionner --</option>
                  {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>

              <label className="flex items-start gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  name="consentement"
                  checked={form.consentement}
                  onChange={handleFormChange}
                  required
                  className="mt-0.5 w-4 h-4 accent-[#00A651]"
                />
                <span>Cette personne a donné son accord pour être enregistrée</span>
              </label>

              {formError && <p className="text-sm text-[#CE1126]">{formError}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#00A651] hover:bg-[#008c44] text-white font-semibold py-2.5 rounded-md text-sm transition disabled:opacity-50"
              >
                {submitting ? 'Ajout en cours...' : 'Ajouter'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function ChampModal({ label, name, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-700 mb-1">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full border-2 border-gray-200 rounded-md px-2.5 py-2 text-sm focus:outline-none focus:border-[#00A651]"
      />
    </label>
  )
}

export default Registrations