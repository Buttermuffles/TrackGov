import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const login = useAuthStore(s => s.login)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (login(email, password)) {
      navigate('/')
    } else {
      setError('Invalid credentials. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel */}
      <div className="lg:w-[40%] bg-navy relative overflow-hidden flex flex-col items-center justify-center p-8 lg:p-12 min-h-[280px] lg:min-h-screen">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 border-gold bg-navy-light flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 lg:w-12 lg:h-12 text-gold" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2">TrackGov</h1>
          <p className="text-blue-200 text-sm mb-4">Government Document Tracking System</p>
          <div className="h-px w-24 bg-gold mx-auto mb-4" />
          <p className="text-blue-300 text-xs lg:text-sm italic">"Transparency. Accountability. Efficiency."</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="lg:w-[60%] flex items-center justify-center p-6 lg:p-12 bg-white flex-1">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to your account</h2>
            <p className="text-sm text-slate-500 mt-2">Enter your credentials to access the system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Employee ID or Email</Label>
              <Input id="email" type="email" placeholder="your.email@trackgov.gov.ph" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-base">Sign In</Button>
          </form>

          <div className="border-t pt-6">
            <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-widest">Demo Credentials</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Super Admin', email: 'admin@trackgov.gov.ph', pw: 'admin2024' },
                { label: 'Records Officer', email: 'records@trackgov.gov.ph', pw: 'rec2024' },
                { label: 'Department Head', email: 'dept@trackgov.gov.ph', pw: 'dept2024' },
                { label: 'Staff', email: 'staff@trackgov.gov.ph', pw: 'staff2024' },
              ].map(c => (
                <button
                  key={c.email}
                  type="button"
                  onClick={() => { setEmail(c.email); setPassword(c.pw) }}
                  className="text-left p-2.5 rounded-md border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  <span className="font-semibold text-slate-700 block">{c.label}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{c.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
