import { Bell, Clock, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { useAuthStore } from '../../store/authStore'

function useBreadcrumbs() {
  const location = useLocation()
  return useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    const crumbs = [{ label: 'Home', to: '/' }]
    let path = ''
    for (const segment of segments) {
      path += `/${segment}`
      crumbs.push({
        label: segment
          .replace('-', ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        to: path,
      })
    }
    return crumbs
  }, [location.pathname])
}

export function Header() {
  const crumbs = useBreadcrumbs()
  const user = useAuthStore((s) => s.user)

  const now = new Date()
  const time = now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
  const date = now.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur-sm md:px-6">
      <div className="flex flex-1 items-center gap-3">
        <nav className="hidden items-center text-xs text-slate-500 sm:flex">
          {crumbs.map((crumb, index) => (
            <span key={crumb.to} className="flex items-center">
              {index > 0 && <span className="mx-1 text-slate-300">{'>'}</span>}
              {index === crumbs.length - 1 ? (
                <span className="font-medium text-slate-700">{crumb.label}</span>
              ) : (
                <Link to={crumb.to} className="hover:text-slate-700">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
        <div className="flex flex-1 items-center gap-2 sm:justify-center">
          <div className="flex w-full max-w-md items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs shadow-inner">
            <Search className="mr-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by tracking code, title, sender, office, date (Cmd+K)"
              className="h-6 w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />
            <kbd className="ml-2 hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-medium text-slate-500 sm:inline-block">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
      <div className="ml-3 flex items-center gap-3">
        <div className="hidden items-center gap-1 text-right md:flex">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-700">
              {time}
            </span>
            <span className="text-[9px] text-slate-400">{date}</span>
          </div>
        </div>
        <button className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
            3
          </span>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
            {user?.name
              ?.split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase() || 'TG'}
          </div>
          <div className="hidden text-xs leading-tight text-slate-700 md:block">
            <div className="font-medium">{user?.name || 'Demo User'}</div>
            <div className="text-[10px] text-slate-400">
              {user?.role || 'Select demo role via login'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

