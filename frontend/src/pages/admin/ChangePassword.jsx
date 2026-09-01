import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ChangePassword() {
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (motDePasse !== confirmation) {
      setError('Les 2 mots de passe ne correspondent pas.')
      return
    }
    if (motDePasse.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('pastef_admin_token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nouveauMotDePasse: motDePasse }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.')
        setLoading(false)
        return
      }

      localStorage.setItem('pastef_must_change_password', 'false')
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Impossible de contacter le serveur.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#00A651] to-[#CE1126] px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 sm:p-10">
        <h1 className="text-xl font-bold text-[#00A651] mb-2">Choisis ton mot de passe</h1>
        <p className="text-sm text-gray-500 mb-6">
          Pour ta sécurité, choisis un nouveau mot de passe que toi seul connaîtras.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="block text-sm font-semibold text-gray-700 mb-2">Nouveau mot de passe</span>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              minLength={8}
              autoFocus
              className="w-full border-2 border-gray-200 rounded-md px-3 py-3 text-base focus:outline-none focus:border-[#00A651]"
            />
          </label>

          <label className="block mb-5">
            <span className="block text-sm font-semibold text-gray-700 mb-2">Confirme le mot de passe</span>
            <input
              type="password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              required
              minLength={8}
              className="w-full border-2 border-gray-200 rounded-md px-3 py-3 text-base focus:outline-none focus:border-[#00A651]"
            />
          </label>

          {error && <p className="text-sm text-[#CE1126] mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-3.5 rounded-md bg-linear-to-r from-[#00A651] to-[#00C86B] transition disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Valider'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword