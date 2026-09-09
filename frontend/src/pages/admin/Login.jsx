import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

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

      localStorage.setItem('pastef_admin_token', data.token)
      localStorage.setItem('pastef_must_change_password', String(data.mustChangePassword))
      navigate(data.mustChangePassword ? '/admin/change-password' : '/admin/dashboard')
    } catch (err) {
      setError('Impossible de contacter le serveur.')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login min-h-screen flex items-center justify-center bg-[#071d13] px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white p-8 shadow-2xl sm:p-12">
        <div className="absolute left-0 top-0 h-2 w-full bg-linear-to-r from-[#00A651] via-[#d9efb8] to-[#CE1126]" />
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f2df] text-2xl font-black text-[#168449]">P</div>
          <p className="text-xs font-bold uppercase tracking-[.22em] text-[#ce1126]">Espace privé</p>
          <h1 className="mt-2 text-3xl font-black text-[#123622]">PASTEF Admin</h1>
          <p className="mt-2 text-sm text-[#6b7c70]">Accès au tableau de bord de la Section Pologne</p>
        </div>

        <form onSubmit={handleSubmit}>
            <label className="block mb-5">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[.08em] text-[#52665a]">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="form-control w-full border border-[#d6dfd6] bg-[#fbfcfa] px-4 py-3.5 text-base outline-none focus:border-[#168449] focus:ring-4 focus:ring-[#168449]/10"
              />
            </label>

            <label className="block mb-5">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[.08em] text-[#52665a]">Mot de passe</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control w-full border border-[#d6dfd6] bg-[#fbfcfa] px-4 py-3.5 text-base outline-none focus:border-[#168449] focus:ring-4 focus:ring-[#168449]/10"
              />
            </label>

            {error && <p className="text-sm text-[#CE1126] mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#168449] py-3.5 font-bold text-white shadow-[0_10px_25px_rgba(22,132,73,.2)] transition hover:-translate-y-0.5 hover:bg-[#0f6e3c] disabled:opacity-50"
            >
              {loading ? 'Connexion...' : '🔐 Connexion'}
            </button>

            <Link to="/admin/forgot-password" className="block text-center mt-4 text-sm text-gray-500 underline">
              Mot de passe oublié ?
            </Link>
        </form>
      </div>
    </div>
  )
}

export default Login