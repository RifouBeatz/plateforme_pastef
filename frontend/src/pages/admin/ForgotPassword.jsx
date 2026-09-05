import { useState } from 'react'
import { Link } from 'react-router-dom'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [envoye, setEnvoye] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Une erreur est survenue.')
        setLoading(false)
        return
      }
      setEnvoye(true)
      setLoading(false)
    } catch (err) {
      setError('Impossible de contacter le serveur.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00A651] to-[#CE1126] px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 sm:p-12">
        {envoye ? (
          <div className="text-center">
            <div className="text-5xl mb-3">📧</div>
            <h1 className="text-xl font-bold text-[#00A651] mb-2">Email envoyé</h1>
            <p className="text-sm text-gray-600">
              Si un compte existe avec cette adresse, un lien de réinitialisation vient d'être envoyé. Vérifie ta boîte mail (et les spams).
            </p>
            <Link to="/admin/login" className="inline-block mt-5 text-sm text-[#00A651] underline">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold text-[#00A651]">Mot de passe oublié</h1>
              <p className="text-sm text-gray-500 mt-1">Entre ton email, on t'envoie un lien pour le réinitialiser.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="block mb-5">
                <span className="block text-sm font-semibold text-gray-700 mb-2">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full border-2 border-gray-200 rounded-md px-3 py-3 text-base focus:outline-none focus:border-[#00A651]"
                />
              </label>

              {error && <p className="text-sm text-[#CE1126] mb-4">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-3.5 rounded-md bg-gradient-to-r from-[#00A651] to-[#00C86B] transition disabled:opacity-50"
              >
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </button>

              <Link to="/admin/login" className="block text-center mt-4 text-sm text-gray-500 underline">
                Retour à la connexion
              </Link>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword