import { useState } from 'react'

const STATUTS = ['Sympathisant', 'Militant', 'Leader Local']

const initialForm = {
  nom: '',
  prenoms: '',
  pays: '',
  ville: '',
  telephone: '',
  email: '',
  statut: '',
  consentement: false,
}

function Register() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      const res = await fetch('http://localhost:5001/api/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Une erreur est survenue.')
        return
      }

      setStatus('success')
      setForm(initialForm)
    } catch (err) {
      setStatus('error')
      setMessage('Impossible de contacter le serveur. Vérifie ta connexion.')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-10 text-white shadow-md bg-gradient-to-r from-[#00A651] to-[#CE1126]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg sm:text-xl">
            <span className="text-2xl">🇸🇳</span>
            <span>PASTEF PATRIOTES</span>
          </div>
          <div className="hidden sm:block bg-white/20 rounded-full px-3 py-1 text-xs">
            🟢 Plateforme Officielle
          </div>
        </div>
      </header>

      <div className="text-white text-center px-4 py-10 sm:py-14 bg-gradient-to-br from-[#00A651] to-[#CE1126]">
        <h1 className="text-2xl sm:text-4xl font-bold mb-3 drop-shadow">PASTEF Pologne et Pays de Juridiction</h1>
        <p className="text-sm sm:text-base max-w-xl mx-auto opacity-95 leading-relaxed">
          Rejoignez notre mouvement patriotique où que vous soyez en Pologne et dans les pays de la juridiction.
        </p>
      </div>

      <main className="flex-1 flex justify-center px-4 -mt-6 sm:-mt-8 pb-10">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl border-t-4 border-[#00A651] p-6 sm:p-8">
          <h2 className="text-xl font-bold mb-1 text-[#00A651]">Adhésion</h2>
          <p className="text-sm text-gray-500 mb-5">Enregistrez-vous en tant que militant ou sympathisant</p>

          {status === 'success' ? (
            <div className="text-center py-6 space-y-3">
              <div className="text-5xl">✅</div>
              <p className="font-semibold text-[#00A651]">Inscription réussie !</p>
              <p className="text-sm text-gray-600">Merci de rejoindre le mouvement. Tu recevras bientôt plus d'informations.</p>
              <button onClick={() => setStatus('idle')} className="text-sm underline text-[#00A651]">
                Inscrire une autre personne
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nom" name="nom" value={form.nom} onChange={handleChange} />
                <Field label="Prénom(s)" name="prenoms" value={form.prenoms} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Ville" name="ville" value={form.ville} onChange={handleChange} />
                <Field label="Pays" name="pays" value={form.pays} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                <Field label="Téléphone" name="telephone" type="tel" value={form.telephone} onChange={handleChange} />
              </div>

              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-1">
                  Statut <span className="text-[#CE1126]">*</span>
                </span>
                <select
                  name="statut"
                  value={form.statut}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-md px-3 py-3 text-base focus:outline-none focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20"
                >
                  <option value="">-- Sélectionner --</option>
                  {STATUTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              <label className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                <input
                  type="checkbox"
                  name="consentement"
                  checked={form.consentement}
                  onChange={handleChange}
                  required
                  className="mt-0.5 w-4 h-4 flex-shrink-0 accent-[#00A651]"
                />
                <span>J'accepte de recevoir des mises à jour de PASTEF Patriotes</span>
              </label>

              {status === 'error' && (
                <p className="text-sm text-[#CE1126]">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full text-white font-bold py-3.5 rounded-md transition active:scale-[0.99] disabled:opacity-50 bg-gradient-to-r from-[#00A651] to-[#00C86B] shadow-md"
              >
                {status === 'submitting' ? 'Envoi en cours...' : "S'enregistrer"}
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="bg-[#333] text-white text-center px-4 py-8 border-t-4 border-[#00A651]">
        <p className="font-bold">🇸🇳 PASTEF PATRIOTES SÉNÉGAL</p>
        <p className="text-sm mt-1 opacity-90">Section Pologne et Pays de Juridiction</p>
        <p className="text-xs mt-6 opacity-70">© 2026 - PASTEF Patriotes. Tous droits réservés.</p>
        <div className="flex justify-center gap-3 mt-4">
          <div className="w-8 h-8 rounded flex items-center justify-center text-[8px] font-bold bg-[#00A651]">VERT</div>
          <div className="w-8 h-8 rounded flex items-center justify-center text-[8px] font-bold bg-white border-2 border-gray-300 text-gray-700">BLANC</div>
          <div className="w-8 h-8 rounded flex items-center justify-center text-[8px] font-bold bg-[#CE1126]">ROUGE</div>
        </div>
      </footer>
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-700 mb-1">
        {label} <span className="text-[#CE1126]">*</span>
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full border-2 border-gray-200 rounded-md px-3 py-3 text-base focus:outline-none focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20"
      />
    </label>
  )
}

export default Register