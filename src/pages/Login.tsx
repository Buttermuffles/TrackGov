import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function LoginPage() {
  const [email, setEmail] = useState('admin@trackgov.gov.ph')
  const [password, setPassword] = useState('admin2024')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      if (email === 'staff@trackgov.gov.ph') {
        navigate('/incoming')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex w-full items-center justify-center bg-[#1E3A5F] px-6 py-8 md:w-2/5">
        <div className="max-w-sm text-slate-50">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-yellow-500/80 bg-[#10243f] text-xs font-semibold tracking-[0.25em] text-yellow-400">
            SEAL
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            TrackGov
          </h1>
          <p className="mt-1 text-sm text-slate-100">
            City Government of Manila
          </p>
          <p className="mt-3 text-xs text-slate-200">
            Transparency. Accountability. Efficiency.
          </p>
          <div className="mt-6 h-32 rounded-xl border border-blue-400/40 bg-[#10243f] bg-[radial-gradient(circle_at_top,_#1D4ED8_0,_transparent_55%)]" />
        </div>
      </div>
      <div className="flex w-full items-center justify-center bg-slate-50 px-6 py-8 md:w-3/5">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            Staff Login
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Use the demo credentials to explore different roles.
          </p>
          <ul className="mt-3 space-y-1 rounded-md bg-slate-50 p-2 text-[11px] text-slate-600">
            <li>
              <span className="font-semibold">Super Admin:</span>{' '}
              admin@trackgov.gov.ph / admin2024
            </li>
            <li>
              <span className="font-semibold">Records Officer:</span>{' '}
              records@trackgov.gov.ph / rec2024
            </li>
            <li>
              <span className="font-semibold">Department Head:</span>{' '}
              dept@trackgov.gov.ph / dept2024
            </li>
            <li>
              <span className="font-semibold">Staff:</span> staff@trackgov.gov.ph
              / staff2024
            </li>
          </ul>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Employee Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex w-full items-center justify-center rounded-md bg-[#1E3A5F] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#2a4d7a] disabled:opacity-70"
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>
            <button
              type="button"
              className="mt-1 w-full text-left text-[11px] text-blue-700 hover:underline"
            >
              Forgot password?
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

