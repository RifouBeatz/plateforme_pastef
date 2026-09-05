import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nouveauMotDePasse: motDePasse }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.')
        setLoading(false)
        return
      }

      navigate('/admin/login')
    } catch (err) {
      setError('Impossible de contacter le serveur.')
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00A651] to-[#CE1126] px-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 sm:p-12 text-center">
          <p className="text-[#CE1126] mb-4">Lien invalide.</p>
          <Link to="/admin/forgot-password" className="text-sm text-[#00A651] underline">
            Refaire une demande
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00A651] to-[#CE1126] px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 sm:p-12">
        <h1 className="text-xl font-bold text-[#00A651] mb-2">Nouveau mot de passe</h1>
        <p className="text-sm text-gray-500 mb-6">Choisis ton nouveau mot de passe.</p>

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
            className="w-full text-white font-bold py-3.5 rounded-md bg-gradient-to-r from-[#00A651] to-[#00C86B] transition disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Réinitialiser'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword