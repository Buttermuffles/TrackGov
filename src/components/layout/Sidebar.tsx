import React, { useState, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuthStore, useDocumentStore } from '@/store'
import { useThemeStore } from '@/store/themeStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getInitials } from '@/lib/utils'
import {
  LayoutDashboard, FileInput, FileOutput, Files, Clock,
  RefreshCw, Map, Building2, Users, BarChart3, ClipboardList,
  Settings, Shield, ChevronLeft, ChevronRight, Menu, X, Search
} from 'lucide-react'
import { differenceInDays } from 'date-fns'

const navGroups = [
  {
    label: 'OVERVIEW',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'DOCUMENTS',
    items: [
      { to: '/incoming', icon: FileInput, label: 'Incoming Documents', badgeKey: 'incoming' as const },
      { to: '/outgoing', icon: FileOutput, label: 'Outgoing Documents' },
      { to: '/documents', icon: Files, label: 'All Documents' },
      { to: '/pending', icon: Clock, label: 'Pending Actions', badgeKey: 'pending' as const },
    ],
  },
  {
    label: 'ROUTING',
    items: [
      { to: '/routing', icon: RefreshCw, label: 'Route / Forward' },
      { to: '/routing-map', icon: Map, label: 'Routing Map' },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { to: '/offices', icon: Building2, label: 'Offices / Departments' },
      { to: '/users', icon: Users, label: 'Users' },
    ],
  },
  {
    label: 'REPORTS',
    items: [
      { to: '/reports', icon: BarChart3, label: 'Reports & Analytics' },
      { to: '/audit', icon: ClipboardList, label: 'User Activity' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { to: '/permissions', icon: Shield, label: 'Module Permissions' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

export default function Sidebar() {
  const currentUser = useAuthStore(s => s.currentUser)
  const documents = useDocumentStore(s => s.documents)
  // collapse state now stored globally so header can control it as well
  const collapsed = useThemeStore(s => s.sidebarCompact)
  const setCollapsed = useThemeStore(s => s.setSidebarCompact)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navSearch, setNavSearch] = useState('')

  // counts shown in the pending page are split into needsAck, assigned, overdue
  // use the same logic here so the sidebar badge matches the actual total pending items
  const incomingCount = currentUser
    ? documents.filter(d => d.currentOfficeId === currentUser.officeId && d.routingHistory.some(rh => !rh.isAcknowledged)).length
    : 0
  const overdueCount = documents.filter(d => d.dueDate && new Date(d.dueDate) < new Date() && !['Completed', 'Cancelled', 'Action Taken'].includes(d.status)).length

  // compute pending breakdown for current user/office
  const pendingCounts = useMemo(() => {
    if (!currentUser) return { needsAck: 0, assigned: 0, overdue: 0 }
    const inMyOffice = documents.filter(d => d.currentOfficeId === currentUser.officeId && !['Completed', 'Cancelled'].includes(d.status))
    const needsAck = inMyOffice.filter(d => {
      const lr = d.routingHistory[d.routingHistory.length - 1]
      return lr && lr.toOfficeId === currentUser.officeId && !lr.isAcknowledged
    }).length
    const assigned = inMyOffice.filter(d => d.currentAssigneeId === currentUser.id).length
    const overdue = inMyOffice.filter(d => d.dueDate && differenceInDays(new Date(d.dueDate), new Date()) < 0).length
    return { needsAck, assigned, overdue }
  // dependencies include documents and currentUser so it re-calculates automatically
  }, [documents, currentUser])

  const badges: Record<string, number> = {
    incoming: incomingCount,
    overdue: overdueCount,
    // we'll use `pending` key for the badge on the pending menu item
    pending: pendingCounts.needsAck + pendingCounts.assigned + pendingCounts.overdue,
  }

  const filteredNavGroups = useMemo(() => {
    const query = navSearch.trim().toLowerCase()
    if (!query) return navGroups
    return navGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item => item.label.toLowerCase().includes(query)),
      }))
      .filter(group => group.items.length > 0)
  }, [navSearch])

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-gold bg-navy-light flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-gold" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-white tracking-tight">TrackGov</h1>
          </div>
        )}
      </div>
      <div className="mx-4 h-px bg-gold/30" />


      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-500/20 hover:scrollbar-thumb-blue-500/40">
        <nav className="space-y-5 py-3">
          {filteredNavGroups.map(group => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[10px] uppercase tracking-widest text-white font-semibold px-3 mb-1.5">{group.label}</p>
              )}
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon
                  const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive
                            ? 'bg-blue-900 text-white font-semibold border-l-4 border-yellow-400 -ml-px'
                            : 'text-white hover:bg-navy-light hover:text-blue-300'
                        } ${collapsed ? 'justify-center px-2' : ''}`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="truncate flex-1">{item.label}</span>
                          {badgeCount > 0 && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              item.badgeKey === 'pending' ? 'bg-blue-600 text-white' :
                              item.badgeKey === 'incoming' ? 'bg-gold text-navy' :
                              'bg-gold text-navy'
                            }`}>
                              {badgeCount}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 bg-navy text-white p-2 rounded-md shadow-lg"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-navy transform transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-500/20 hover:scrollbar-thumb-blue-500/40 no-scrollbar`}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-3 right-3 text-blue-300 hover:text-white" aria-label="Close navigation menu">
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col shrink-0 bg-navy h-screen sticky top-0 transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'} overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-500/20 hover:scrollbar-thumb-blue-500/40 no-scrollbar`}>
        {sidebarContent}
      </aside>
    </>
  )
}
