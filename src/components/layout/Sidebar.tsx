import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuthStore, useDocumentStore } from '@/store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getInitials } from '@/lib/utils'
import {
  LayoutDashboard, FileInput, FileOutput, Files, Clock,
  RefreshCw, Map, Building2, Users, BarChart3, ClipboardList,
  Settings, Shield, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react'

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
      { to: '/pending', icon: Clock, label: 'Pending Action', badgeKey: 'overdue' as const },
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
      { to: '/audit', icon: ClipboardList, label: 'Audit Trail' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

export default function Sidebar() {
  const currentUser = useAuthStore(s => s.currentUser)
  const documents = useDocumentStore(s => s.documents)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const incomingCount = currentUser
    ? documents.filter(d => d.currentOfficeId === currentUser.officeId && d.routingHistory.some(rh => !rh.isAcknowledged)).length
    : 0
  const overdueCount = documents.filter(d => d.dueDate && new Date(d.dueDate) < new Date() && !['Completed', 'Cancelled', 'Action Taken'].includes(d.status)).length

  const badges: Record<string, number> = { incoming: incomingCount, overdue: overdueCount }

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
            <p className="text-blue-300 text-[10px] truncate">City Government of Manila</p>
          </div>
        )}
      </div>
      <div className="mx-4 h-px bg-gold/30" />

      {/* User card */}
      {currentUser && !collapsed && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-2.5 p-2 rounded-md bg-navy-light/50">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gold text-navy text-xs font-bold">{getInitials(currentUser.firstName, currentUser.lastName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{currentUser.firstName} {currentUser.lastName}</p>
              <p className="text-blue-300 text-[10px] truncate">{currentUser.position}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-5 py-3">
          {navGroups.map(group => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[10px] uppercase tracking-widest text-blue-300/60 font-semibold px-3 mb-1.5">{group.label}</p>
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
                            : 'text-blue-200 hover:bg-navy-light hover:text-white'
                        } ${collapsed ? 'justify-center px-2' : ''}`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="truncate flex-1">{item.label}</span>
                          {badgeCount > 0 && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeKey === 'overdue' ? 'bg-red-500 text-white' : 'bg-gold text-navy'}`}>
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

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:block p-3 border-t border-blue-400/10">
        <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center gap-2 text-blue-300 hover:text-white text-xs py-1.5 rounded hover:bg-navy-light transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 bg-navy text-white p-2 rounded-md shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-navy transform transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-3 right-3 text-blue-300 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col shrink-0 bg-navy h-screen sticky top-0 transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}>
        {sidebarContent}
      </aside>
    </>
  )
}
