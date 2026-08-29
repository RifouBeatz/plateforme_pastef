import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5001/api/admin/login', {
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

      localStorage.setItem('pastef_admin_token', data.token)
      navigate('/admin/dashboard')
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
          <p className="text-sm text-gray-500 mt-1">Accès au Tableau de Bord Privé</p>
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
        </form>
      </div>
    </div>
  )
}

export default Login