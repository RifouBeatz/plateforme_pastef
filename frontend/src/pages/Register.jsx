import { useState } from 'react'
import logoPastef from '../assets/pastef-logo-section.png'
import rallyPhoto from '../assets/rally.jpg'
// 👇 Remplace ce texte par le tien — c'est le paragraphe affiché dans la nouvelle section
const texteSection = (
  <>
    PASTEF - Les Patriotes, Section Pologne est une structure du parti PASTEF qui rassemble et accompagne les militantes, militants et sympathisants sénégalais établis dans sa juridiction : <strong>la Pologne</strong>, <strong>la République Tchèque</strong>, <strong>la Slovaquie</strong>, <strong>la Roumanie</strong>, <strong>l’Ukraine</strong>, <strong>l’Estonie</strong>, <strong>la Lettonie</strong> et <strong>la Lituanie</strong>. Fidèle aux valeurs fondatrices du PASTEF, notamment la démocratie, le don de soi pour la Patrie, le panafricanisme, le travail, l’éthique et la fraternité, la Section Pologne entend contribuer, depuis l’étranger, à la dynamique collective portée par les Patriotes. Elle constitue un espace d’engagement, de mobilisation, d’information et de solidarité pour les Sénégalaises et Sénégalais de notre juridiction qui souhaitent participer à la vie du parti et contribuer à la construction d’un Sénégal souverain, juste et prospère. Ensemble, au service de la Patrie 🇸🇳
  </>
)

const STATUTS = ['Sympathisant', 'Militant']
const PAYS = ['Pologne', 'République Tchèque', 'Slovaquie', 'Roumanie', 'Ukraine', 'Estonie', 'Lettonie', 'Lituanie']

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/inscription`, {
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
      <header className="sticky top-0 z-10 text-white shadow-md bg-linear-to-r from-[#00A651] to-[#CE1126]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={logoPastef}
              alt="PASTEF Les Patriotes - Section Pologne"
              className="h-12 sm:h-16 w-auto max-w-[280px] object-contain"
            />
          </div>

  <a href="https://pastef.org/"
  target="_blank"
  rel="noopener noreferrer"
  className="hidden sm:block bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 text-xs transition">

  🟢 Plateforme Officielle
</a>
        </div>
      </header>

     <div className="text-white text-center px-4 py-10 sm:py-14 bg-linear-to-br from-[#00A651] to-[#CE1126]">
        <h1 className="text-2xl sm:text-4xl font-bold mb-3 drop-shadow">PASTEF SECTION POLOGNE & PAYS DE JURIDICTION</h1>
        <p className="text-sm sm:text-base max-w-xl mx-auto opacity-95 leading-relaxed">
          Rejoignez notre mouvement patriotique  que vous résidiez en Pologne ou en République Tchèque, Slovaquie, Roumanie, Ukraine, Estonie, Lettonie ou Lituanie.
        </p>
      </div>
<div className="px-4 py-10 sm:py-16 bg-white">
  <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12 items-stretch">
  <img
    src={rallyPhoto}
    alt="Meeting PASTEF"
    className="w-full h-64 sm:h-80 lg:h-full object-cover rounded-lg shadow-lg"
  />
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="w-8 h-0.5 bg-[#CE1126]"></span>
        <span className="text-[#CE1126] font-bold text-sm tracking-wide uppercase">Notre Section</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#00A651] mb-4">
        PASTEF Pologne et Pays de Juridiction
      </h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        {texteSection}
      </p>
      <div className="flex flex-wrap gap-3">
        
         <a href="https://pastef.org/articles-et-discours/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#CE1126] hover:bg-[#a80e1f] text-white font-semibold px-5 py-3 rounded-md transition"
        >
          → Actualités PASTEF
        </a>
        
         <a href="#adhesion"
          className="inline-flex items-center gap-2 bg-[#00A651] hover:bg-[#008c44] text-white font-semibold px-5 py-3 rounded-md transition"
        >
          → Adhérer 
        </a>
      </div>
    </div>
  </div>
</div>


      <main id="adhesion" className="flex-1 flex justify-center px-4 -mt-6 sm:-mt-8 pb-10">
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
                <label className="block">
  <span className="block text-sm font-semibold text-gray-700 mb-1">
    Pays <span className="text-[#CE1126]">*</span>
  </span>
  <select
    name="pays"
    value={form.pays}
    onChange={handleChange}
    required
    className="w-full border-2 border-gray-200 rounded-md px-3 py-3 text-base focus:outline-none focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20"
  >
    <option value="">-- Sélectionner --</option>
    {PAYS.map((p) => (
      <option key={p} value={p}>{p}</option>
    ))}
  </select>
</label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email (optionnel)" name="email" type="email" value={form.email} onChange={handleChange} required={false} />
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
                  className="mt-0.5 w-4 h-4 shrink-0 accent-[#00A651]"
                />
                <span>J’accepte d’être contacté par un membre de la section </span>
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
          
        </div>
      </footer>
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text', required = true }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-[#CE1126]">*</span>}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border-2 border-gray-200 rounded-md px-3 py-3 text-base focus:outline-none focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20"
      />
    </label>
  )
}

export default Register