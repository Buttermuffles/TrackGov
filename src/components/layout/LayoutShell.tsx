import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <Header />
        <main className="flex-1 px-3 pb-6 pt-4 sm:px-5 lg:px-7">
          {children}
        </main>
      </div>
    </div>
  )
}

