import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useNotificationStore } from '@/store'
import type { Notification } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow, format } from 'date-fns'
import { Bell, Check, ArrowRight, Mail, AlertTriangle, Clock, Settings } from 'lucide-react'

export default function NotificationBell() {
  const navigate = useNavigate()
  const currentUser = useAuthStore(s => s.currentUser)
  const notifications = useNotificationStore(s => s.notifications)
  const markAsRead = useNotificationStore(s => s.markAsRead)
  const markAllAsRead = useNotificationStore(s => s.markAllAsRead)

  const userNotifs = currentUser ? notifications.filter(n => n.userId === currentUser.id) : []
  const unreadCount = userNotifs.filter(n => !n.isRead).length
  const recentNotifs = userNotifs.slice(0, 6)

  const typeInfo: Record<
    Notification['type'],
    { icon: React.ComponentType<{ className?: string }>; color: string; label: string }
  > = {
    incoming: { icon: Mail, color: 'bg-blue-100 text-blue-700', label: 'Incoming' },
    action_required: { icon: AlertTriangle, color: 'bg-orange-100 text-orange-700', label: 'Action Required' },
    overdue: { icon: Clock, color: 'bg-rose-100 text-rose-700', label: 'Overdue' },
    system: { icon: Settings, color: 'bg-slate-100 text-slate-700', label: 'System' },
  }

  const newestUnreadType = userNotifs.find(n => !n.isRead)?.type
  const bellBadgeColor = newestUnreadType ? typeInfo[newestUnreadType].color : 'bg-rose-500'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className={`absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 rounded-full ${bellBadgeColor} text-[10px] font-bold`}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <button
              className="text-[11px] text-slate-500 hover:text-slate-700"
              onClick={() => currentUser && markAllAsRead(currentUser.id)}
            >
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea className="h-64">
          {recentNotifs.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400">No notifications</div>
          ) : (
            <div className="space-y-1 px-1">
              {recentNotifs.map((n) => {
                const info = typeInfo[n.type]
                const Icon = info.icon
                return (
                  <DropdownMenuItem
                    key={n.id}
                    className={`flex flex-col gap-2 p-3 rounded-lg ${n.isRead ? 'bg-white' : 'bg-blue-50'} border border-slate-100`}
                    onClick={() => {
                      markAsRead(n.id)
                      if (n.documentId) navigate(`/documents/${n.documentId}`)
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${info.color}`}>
                          <Icon className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{n.message}</p>
                        </div>
                      </div>
                      {!n.isRead && <Badge className="text-[10px]">New</Badge>}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>
                        {format(new Date(n.createdAt), 'PPP p')} • {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </DropdownMenuItem>
                )
              })}
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/notifications')} className="justify-between">
          View all
          <Check className="w-4 h-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
