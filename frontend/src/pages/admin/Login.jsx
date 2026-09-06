import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [etape, setEtape] = useState('identifiants')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmitIdentifiants = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Connexion impossible.')
        setLoading(false)
        return
      }

      setEtape('code')
      setLoading(false)
    } catch (err) {
      setError('Impossible de contacter le serveur.')
      setLoading(false)
    }
  }

  const handleSubmitCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Code invalide.')
        setLoading(false)
        return
      }

      localStorage.setItem('pastef_admin_token', data.token)
      localStorage.setItem('pastef_must_change_password', String(data.mustChangePassword))
      navigate(data.mustChangePassword ? '/admin/change-password' : '/admin/dashboard')
    } catch (err) {
      setError('Impossible de contacter le serveur.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00A651] to-[#CE1126] px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 sm:p-12">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🇸🇳</div>
          <h1 className="text-2xl font-bold text-[#00A651]">PASTEF ADMIN</h1>
          <p className="text-sm text-gray-500 mt-1">
            {etape === 'identifiants' ? 'Accès au Tableau de Bord Privé' : 'Vérifie ta boîte mail'}
          </p>
        </div>

        {etape === 'identifiants' ? (
          <form onSubmit={handleSubmitIdentifiants}>
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

            <label className="block mb-5">
              <span className="block text-sm font-semibold text-gray-700 mb-2">Mot de Passe</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-2 border-gray-200 rounded-md px-3 py-3 text-base focus:outline-none focus:border-[#00A651]"
              />
            </label>

            {error && <p className="text-sm text-[#CE1126] mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3.5 rounded-md bg-gradient-to-r from-[#00A651] to-[#00C86B] hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Connexion...' : '🔐 Connexion'}
            </button>

            <Link to="/admin/forgot-password" className="block text-center mt-4 text-sm text-gray-500 underline">
              Mot de passe oublié ?
            </Link>
          </form>
        ) : (
          <form onSubmit={handleSubmitCode}>
            <p className="text-sm text-gray-600 mb-5 text-center">
              Un code à 6 chiffres a été envoyé à <strong>{email}</strong>.
            </p>

            <label className="block mb-5">
              <span className="block text-sm font-semibold text-gray-700 mb-2">Code de vérification</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
                className="w-full border-2 border-gray-200 rounded-md px-3 py-3 text-base text-center tracking-[0.5em] font-bold focus:outline-none focus:border-[#00A651]"
              />
            </label>

            {error && <p className="text-sm text-[#CE1126] mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3.5 rounded-md bg-gradient-to-r from-[#00A651] to-[#00C86B] hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>

            <button
              type="button"
              onClick={() => { setEtape('identifiants'); setCode(''); setError('') }}
              className="block w-full text-center mt-4 text-sm text-gray-500 underline"
            >
              Retour
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login