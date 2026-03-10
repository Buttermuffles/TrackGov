import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Inbox,
  Send,
  Files,
  Timer,
  Repeat,
  Map,
  Building2,
  Users,
  BarChart3,
  ListChecks,
  Settings,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

type Item = {
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
}

type Group = {
  label: string
  items: Item[]
}

const groups: Group[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', to: '/', icon: LayoutDashboard }],
  },
  {
    label: 'Documents',
    items: [
      { label: 'Incoming Documents', to: '/incoming', icon: Inbox, badge: 3 },
      { label: 'Outgoing Documents', to: '/outgoing', icon: Send },
      { label: 'All Documents', to: '/documents', icon: Files },
      { label: 'Pending Action', to: '/pending', icon: Timer, badge: 5 },
    ],
  },
  {
    label: 'Routing',
    items: [
      { label: 'Route / Forward', to: '/routing', icon: Repeat },
      { label: 'Routing Map', to: '/routing-map', icon: Map },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Offices / Departments', to: '/offices', icon: Building2 },
      { label: 'Users', to: '/users', icon: Users },
    ],
  },
  {
    label: 'Reports',
    items: [
      { label: 'Reports & Analytics', to: '/reports', icon: BarChart3 },
      { label: 'Audit Trail', to: '/audit-trail', icon: ListChecks },
    ],
  },
  {
    label: 'System',
    items: [{ label: 'Settings', to: '/settings', icon: Settings }],
  },
]

export function Sidebar() {
  const user = useAuthStore((s) => s.user)

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-slate-800/40 bg-[#1E3A5F] text-slate-100">
      <div className="flex items-center gap-3 px-5 pb-4 pt-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-yellow-500/80 bg-[#10243f] text-xs font-semibold tracking-widest text-yellow-400">
          SEAL
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight text-white">
            TrackGov
          </span>
          <span className="text-[11px] text-slate-200/80">
            City Government of Manila
          </span>
        </div>
      </div>
      <div className="mx-5 mb-4 h-px bg-gradient-to-r from-yellow-500/60 via-yellow-400/80 to-yellow-500/60" />

      <div className="mx-4 mb-4 rounded-lg bg-slate-900/40 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold">
            {user?.name
              ?.split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase() || 'TG'}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">
              {user?.name || 'Demo User'}
            </span>
            <span className="text-[11px] text-slate-300">
              {user?.role || 'Select demo role via login'}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300/70">
              {group.label}
            </p>
            <div className="mt-1 space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'group flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors',
                      isActive
                        ? 'border-l-4 border-yellow-400 bg-blue-900/80 pl-2 text-white shadow-inner'
                        : 'text-slate-200 hover:bg-[#2a4d7a]',
                    ].join(' ')
                  }
                  end={item.to === '/'}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-slate-200/90" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge != null && (
                    <span className="ml-2 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-700/60 px-4 py-3 text-[10px] text-slate-300/70">
        <p>Transparency. Accountability. Efficiency.</p>
      </div>
    </aside>
  )
}

