import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { useThemeStore } from '@/store/themeStore'
import { FullScreenLoader } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppLayout() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const hasHydrated = useAuthStore(s => s.hasHydrated)
  const mode = useThemeStore(s => s.mode)

  if (!hasHydrated) {
    return (
      <FullScreenLoader
        title="Restoring Secure Session"
        message="Reconnecting your workspace and loading your latest page..."
      />
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className={cn(
      'flex min-h-screen transition-colors duration-200',
      mode === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
    )}>
      <Sidebar />
      <div className={cn(
        'flex-1 flex flex-col min-w-0 transition-colors duration-200',
        mode === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
      )}>
        <Header />
        <main className={cn(
          'flex-1 p-4 lg:p-6 overflow-auto transition-colors duration-200',
          mode === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
        )}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
