import { useState } from 'react'

function MyAccount() {
  const [motDePasseActuel, setMotDePasseActuel] = useState('')
  const [nouvelEmail, setNouvelEmail] = useState('')
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!nouvelEmail && !nouveauMotDePasse) {
      setError('Modifie au moins un des deux champs (email ou mot de passe).')
      return
    }
    if (nouveauMotDePasse && nouveauMotDePasse !== confirmation) {
      setError('Les 2 nouveaux mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('pastef_admin_token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/account`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          motDePasseActuel,
          nouvelEmail: nouvelEmail || undefined,
          nouveauMotDePasse: nouveauMotDePasse || undefined,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.')
        setLoading(false)
        return
      }

      setSuccess('Compte mis à jour avec succès.')
      setMotDePasseActuel('')
      setNouvelEmail('')
      setNouveauMotDePasse('')
      setConfirmation('')
      setLoading(false)
    } catch (err) {
      setError('Impossible de contacter le serveur.')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="admin-hero mb-6 px-6 py-7 text-white sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d9efb8]">Préférences</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight">Mon compte</h2>
      </div>

      <div className="admin-card max-w-xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-1">Nouvel email (optionnel)</span>
            <input
              type="email"
              value={nouvelEmail}
              onChange={(e) => setNouvelEmail(e.target.value)}
              placeholder="Laisse vide pour ne pas changer"
              className="w-full border-2 border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#00A651]"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-1">Nouveau mot de passe (optionnel)</span>
            <input
              type="password"
              value={nouveauMotDePasse}
              onChange={(e) => setNouveauMotDePasse(e.target.value)}
              placeholder="Laisse vide pour ne pas changer"
              minLength={8}
              className="w-full border-2 border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#00A651]"
            />
          </label>

          {nouveauMotDePasse && (
            <label className="block">
              <span className="block text-sm font-semibold text-gray-700 mb-1">Confirme le nouveau mot de passe</span>
              <input
                type="password"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                minLength={8}
                className="w-full border-2 border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#00A651]"
              />
            </label>
          )}

          <hr className="border-gray-100" />

          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-1">Ton mot de passe actuel (obligatoire, pour confirmer que c'est bien toi)</span>
            <input
              type="password"
              value={motDePasseActuel}
              onChange={(e) => setMotDePasseActuel(e.target.value)}
              required
              className="w-full border-2 border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#00A651]"
            />
          </label>

          {error && <p className="text-sm text-[#CE1126]">{error}</p>}
          {success && <p className="text-sm text-green-700">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#00A651] hover:bg-[#008c44] text-white font-semibold px-5 py-2.5 rounded-md text-sm transition disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default MyAccount