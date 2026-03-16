import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuthStore, useNotificationStore } from '@/store'
import { useThemeStore } from '@/store/themeStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getInitials } from '@/lib/utils'
import { Search, Bell, LogOut, User, ChevronRight, Clock, Menu } from 'lucide-react'
import { format } from 'date-fns'

const searchableModules = [
  { path: '/dashboard', terms: ['dashboard', 'overview', 'home'] },
  { path: '/incoming', terms: ['incoming', 'receive', 'received'] },
  { path: '/outgoing', terms: ['outgoing', 'sent', 'forwarded'] },
  { path: '/documents', terms: ['documents', 'all documents', 'doc', 'files'] },
  { path: '/pending', terms: ['pending', 'needs ack', 'assigned', 'overdue'] },
  { path: '/routing', terms: ['routing', 'route', 'forward'] },
  { path: '/routing-map', terms: ['routing map', 'map'] },
  { path: '/offices', terms: ['offices', 'departments'] },
  { path: '/users', terms: ['users', 'accounts', 'staff'] },
  { path: '/reports', terms: ['reports', 'analytics'] },
  { path: '/audit', terms: ['audit', 'audit trail', 'logs'] },
  { path: '/settings', terms: ['settings', 'preferences', 'theme'] },
] as const

const queryEnabledModules = new Set(['/incoming', '/outgoing', '/documents', '/pending', '/routing'])

const pathLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/incoming': 'Incoming Documents',
  '/outgoing': 'Outgoing Documents',
  '/documents': 'All Documents',
  '/pending': 'Pending Actions',
  '/routing': 'Route / Forward',
  '/routing-map': 'Routing Map',
  '/offices': 'Offices / Departments',
  '/users': 'Users',
  '/reports': 'Reports & Analytics',
  '/audit': 'Audit Trail',
  '/settings': 'Settings',
}

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = useAuthStore(s => s.currentUser)
  const logout = useAuthStore(s => s.logout)
  // sidebar collapsed state comes from theme store
  const sidebarCollapsed = useThemeStore(s => s.sidebarCompact)
  const setSidebarCollapsed = useThemeStore(s => s.setSidebarCompact)
  const notifications = useNotificationStore(s => s.notifications)
  const markAsRead = useNotificationStore(s => s.markAsRead)
  const markAllAsRead = useNotificationStore(s => s.markAllAsRead)
  const [now, setNow] = useState(new Date())
  const [searchValue, setSearchValue] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const userNotifs = currentUser
    ? notifications.filter(n => n.userId === currentUser.id)
    : []
  const unreadCount = userNotifs.filter(n => !n.isRead).length

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const breadcrumbs = () => {
    const path = location.pathname
    const parts: { label: string; to?: string }[] = [{ label: 'Home', to: '/' }]
    if (path !== '/') {
      const label = pathLabels[path]
      if (label) parts.push({ label })
      else if (path.startsWith('/documents/')) parts.push({ label: 'All Documents', to: '/documents' }, { label: 'Document Detail' })
    }
    return parts
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSearchSubmit = () => {
    const query = searchValue.trim()
    if (!query) {
      navigate('/documents')
      return
    }

    const normalized = query.toLowerCase()
    const matchedModule = searchableModules.find(module =>
      module.terms.some(term => term.includes(normalized) || normalized.includes(term))
    )

    if (matchedModule) {
      navigate(matchedModule.path)
      return
    }

    const activePath = location.pathname === '/' ? '/dashboard' : location.pathname
    if (queryEnabledModules.has(activePath)) {
      navigate(`${activePath}?search=${encodeURIComponent(query)}`)
      return
    }

    navigate(`/documents?search=${encodeURIComponent(query)}`)
  }

  return (
    <header className="h-14 lg:h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-3 sticky top-0 z-30 shadow-sm">
      {/* Sidebar collapse toggle (desktop) */}
      <div className="hidden lg:flex items-center mr-2">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 hover:bg-slate-100 rounded-md"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      {/* Breadcrumbs */}
      <nav className="hidden md:flex items-center gap-1 text-sm text-slate-500 flex-1 ml-0 lg:ml-0 pl-8 lg:pl-0">
        {breadcrumbs().map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
            {crumb.to ? (
              <Link to={crumb.to} className="hover:text-slate-900 transition-colors">{crumb.label}</Link>
            ) : (
              <span className="text-slate-900 font-medium">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Mobile page title */}
      <div className="md:hidden flex-1 pl-10">
        <h2 className="font-semibold text-slate-900 text-sm truncate">{pathLabels[location.pathname] || 'TrackGov'}</h2>
      </div>

      {/* Search */}
      <div className="hidden lg:flex items-center relative">
        <Search className="w-4 h-4 absolute left-3 text-slate-400" />
        <Input
          ref={searchInputRef}
          placeholder="Search documents... (Ctrl+K)"
          className="pl-9 w-64 h-8 text-sm bg-slate-50"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearchSubmit()
            }
          }}
        />
      </div>

      {/* Clock */}
      <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500">
        <Clock className="w-3.5 h-3.5" />
        <span>{format(now, 'MMM d, yyyy')}</span>
        <span className="text-slate-300">|</span>
        <span>{format(now, 'h:mm:ss a')}</span>
      </div>

      {/* Notifications */}
      <DropdownMenu open={notifOpen} onOpenChange={(open) => {
          setNotifOpen(open)
          if (open && currentUser) {
            // when the user opens the list we can clear the unread badge
            markAllAsRead(currentUser.id)
          }
        }}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{unreadCount}</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="h-64">
            {userNotifs.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-400">No notifications</div>
            ) : (
              userNotifs.slice(0, 10).map(notif => (
                <DropdownMenuItem
                  key={notif.id}
                  onClick={() => {
                    markAsRead(notif.id)
                    if (notif.documentId) navigate(`/documents/${notif.documentId}`)
                  }}
                  className={`flex flex-col items-start gap-1 p-3 ${!notif.isRead ? 'bg-blue-50' : ''}`}
                >
                  <span className="font-medium text-xs">{notif.title}</span>
                  <span className="text-[11px] text-slate-500 line-clamp-2">{notif.message}</span>
                  <span className="text-[10px] text-slate-400">{format(new Date(notif.createdAt), 'MMM d, h:mm a')}</span>
                </DropdownMenuItem>
              ))
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User menu */}
      {currentUser && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-slate-50 rounded-md px-2 py-1 transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-navy text-white text-xs font-bold">{getInitials(currentUser.firstName, currentUser.lastName)}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-slate-900">{currentUser.firstName} {currentUser.lastName}</p>
                <p className="text-[10px] text-slate-400">{currentUser.role}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="w-4 h-4 mr-2" />Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="w-4 h-4 mr-2" />Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}
