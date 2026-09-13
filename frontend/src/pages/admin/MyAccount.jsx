import { useEffect, useState } from 'react'

function MyAccount() {
  const [admins, setAdmins] = useState([])
  const [motDePasseActuel, setMotDePasseActuel] = useState('')
  const [nouvelEmail, setNouvelEmail] = useState('')
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [nouvelAdminEmail, setNouvelAdminEmail] = useState('')
  const [nouvelAdminMotDePasse, setNouvelAdminMotDePasse] = useState('')
  const [confirmationAdmin, setConfirmationAdmin] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [adminError, setAdminError] = useState('')
  const [adminSuccess, setAdminSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)

  const chargerAdmins = async () => {
    try {
      const token = localStorage.getItem('pastef_admin_token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) setAdmins(data.admins)
    } catch (err) {
      setAdminError('Impossible de charger les comptes admin.')
    }
  }

  useEffect(() => {
    chargerAdmins()
  }, [])

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

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setAdminError('')
    setAdminSuccess('')

    if (nouvelAdminMotDePasse !== confirmationAdmin) {
      setAdminError('Les 2 mots de passe ne correspondent pas.')
      return
    }

    setAdminLoading(true)
    try {
      const token = localStorage.getItem('pastef_admin_token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: nouvelAdminEmail, motDePasse: nouvelAdminMotDePasse }),
      })
      const data = await res.json()

      if (!res.ok) {
        setAdminError(data.error || 'Impossible de créer le compte admin.')
        setAdminLoading(false)
        return
      }

      setAdminSuccess(`Le compte ${data.admin.email} a été créé. Il devra changer son mot de passe à sa première connexion.`)
      chargerAdmins()
      setNouvelAdminEmail('')
      setNouvelAdminMotDePasse('')
      setConfirmationAdmin('')
    } catch (err) {
      setAdminError('Impossible de contacter le serveur.')
    } finally {
      setAdminLoading(false)
    }
  }

  const handleDeleteAdmin = async (admin) => {
    if (!window.confirm(`Supprimer le compte admin ${admin.email} ? Cette action est irréversible.`)) return

    setAdminError('')
    setAdminSuccess('')
    try {
      const token = localStorage.getItem('pastef_admin_token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/admins/${admin.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (!res.ok) {
        setAdminError(data.error || 'Impossible de supprimer ce compte admin.')
        return
      }

      setAdminSuccess('Compte admin supprimé avec succès.')
      chargerAdmins()
    } catch (err) {
      setAdminError('Impossible de contacter le serveur.')
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

      <div className="admin-card mt-6 max-w-xl p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#ce1126]">Gestion des accès</p>
        <h3 className="mt-2 text-xl font-black text-[#173723]">Créer un compte admin</h3>
        <p className="mt-2 text-sm leading-6 text-[#6b7c70]">Le compte sera créé directement dans la base de données. Aucun accès à Neon n’est nécessaire.</p>

        <form onSubmit={handleCreateAdmin} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[.08em] text-[#52665a]">Email du nouvel admin</span>
            <input type="email" value={nouvelAdminEmail} onChange={(e) => setNouvelAdminEmail(e.target.value)} required className="form-control w-full border border-[#d6dfd6] bg-[#fbfcfa] px-4 py-3 text-sm outline-none focus:border-[#168449] focus:ring-4 focus:ring-[#168449]/10" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[.08em] text-[#52665a]">Mot de passe temporaire</span>
            <input type="password" value={nouvelAdminMotDePasse} onChange={(e) => setNouvelAdminMotDePasse(e.target.value)} required minLength={8} className="form-control w-full border border-[#d6dfd6] bg-[#fbfcfa] px-4 py-3 text-sm outline-none focus:border-[#168449] focus:ring-4 focus:ring-[#168449]/10" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[.08em] text-[#52665a]">Confirmer le mot de passe</span>
            <input type="password" value={confirmationAdmin} onChange={(e) => setConfirmationAdmin(e.target.value)} required minLength={8} className="form-control w-full border border-[#d6dfd6] bg-[#fbfcfa] px-4 py-3 text-sm outline-none focus:border-[#168449] focus:ring-4 focus:ring-[#168449]/10" />
          </label>
          {adminError && <p className="rounded-lg bg-[#fff0ed] px-4 py-3 text-sm font-semibold text-[#b7281f]">{adminError}</p>}
          {adminSuccess && <p className="rounded-lg bg-[#e4f4df] px-4 py-3 text-sm font-semibold text-[#168449]">{adminSuccess}</p>}
          <button type="submit" disabled={adminLoading} className="rounded-full bg-[#168449] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0f6e3c] disabled:opacity-50">
            {adminLoading ? 'Création...' : 'Créer le compte admin'}
          </button>
        </form>
      </div>

      <div className="admin-card mt-6 max-w-xl p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#ce1126]">Comptes autorisés</p>
        <h3 className="mt-2 text-xl font-black text-[#173723]">Administrateurs</h3>
        <div className="mt-5 space-y-3">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between gap-4 rounded-xl border border-[#e1e9de] bg-[#fbfcfa] px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#173723]">{admin.email}</p>
                <p className="text-xs text-[#829187]">Créé le {new Date(admin.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
              <button type="button" onClick={() => handleDeleteAdmin(admin)} title="Supprimer cet admin" aria-label={`Supprimer ${admin.email}`} className="shrink-0 text-lg transition hover:scale-110">🗑️</button>
            </div>
          ))}
          {admins.length === 0 && <p className="text-sm text-[#829187]">Aucun compte admin chargé.</p>}
        </div>
      </div>
    </div>
  )
}

export default MyAccount