import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useNotificationStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import PaginationControls from '@/components/shared/PaginationControls'
import { formatDistanceToNow, format } from 'date-fns'
import { ArrowLeft, Check, Trash2 } from 'lucide-react'

export default function Notifications() {

  const navigate = useNavigate()

  const currentUser = useAuthStore(s => s.currentUser)
  const notifications = useNotificationStore(s => s.notifications)

  const markAsRead = useNotificationStore(s => s.markAsRead)
  const markAllAsRead = useNotificationStore(s => s.markAllAsRead)
  const removeNotification = useNotificationStore(s => s.removeNotification)

  const userNotifs = currentUser
    ? notifications.filter(n => n.userId === currentUser.id)
    : []

  const unreadCount = userNotifs.filter(n => !n.isRead).length

  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const totalPages = Math.max(1, Math.ceil(userNotifs.length / pageSize))

  const pagedNotifs = userNotifs.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  return (

    <div className="space-y-6">

      {userNotifs.length > 0 && (
        <PaginationControls
          totalItems={userNotifs.length}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="notifications"
          compact={false}
        />
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-slate-100"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Notifications
            </h1>

            <p className="text-sm text-slate-500">
              {unreadCount} unread messages
            </p>
          </div>

        </div>

        {unreadCount > 0 && (

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            size="sm"
            onClick={() => currentUser && markAllAsRead(currentUser.id)}
          >
            Mark all as read
          </Button>

        )}

      </div>

      {/* CARD */}

      <Card className="border-slate-200 shadow-sm">

        <CardHeader className="bg-slate-50 border-b">

          <CardTitle className="text-sm font-semibold text-slate-700">
            Recent Notifications
          </CardTitle>

        </CardHeader>

        <CardContent className="p-0">

          <ScrollArea className="h-[420px]">

            {userNotifs.length === 0 ? (

              <div className="p-10 text-center text-sm text-slate-400">
                No notifications yet.
              </div>

            ) : (

              <div>

                {pagedNotifs.map(notif => (

                  <div
                    key={notif.id}
                    className={`
                    flex flex-col gap-2 p-4 border-b
                    transition-all duration-200
                    hover:bg-slate-50
                    ${notif.isRead
                        ? 'bg-white'
                        : 'bg-blue-50 border-l-4 border-blue-500'}
                  `}
                  >

                    {/* TITLE + TIME */}

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <p className="text-sm font-semibold text-slate-900">
                          {notif.title}
                        </p>

                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {notif.message}
                        </p>

                      </div>

                      <div className="flex flex-col items-end gap-1">

                        {!notif.isRead && (
                          <Badge className="bg-blue-500 text-white text-[10px] px-2 py-0.5">
                            NEW
                          </Badge>
                        )}

                        <span className="text-[11px] text-slate-400">
                          {format(new Date(notif.createdAt), 'PPP p')}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-2 pt-1">

                      <Button
                        size="sm"
                        className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {

                          if (!notif.isRead)
                            markAsRead(notif.id)

                          if (notif.documentId)
                            navigate(`/documents/${notif.documentId}`)
                        }}
                      >
                        View
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs border-green-300 text-green-600 hover:bg-green-50"
                        onClick={() => markAsRead(notif.id)}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => removeNotification(notif.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </ScrollArea>

        </CardContent>

      </Card>

    </div>
  )
}