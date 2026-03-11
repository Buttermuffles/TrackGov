import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore, useDocumentStore, useOfficeStore, useUserStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DocStatusBadge, PriorityBadge } from '@/components/documents/DocStatusBadge'
import { format } from 'date-fns'
import { Search, Send, ChevronLeft, ChevronRight, ExternalLink, Check, Clock } from 'lucide-react'

export default function Outgoing() {
  const user = useAuthStore(s => s.currentUser)
  const documents = useDocumentStore(s => s.documents)
  const offices = useOfficeStore(s => s.offices)
  const users = useUserStore(s => s.users)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const perPage = 15

  // Outgoing: documents routed FROM the current user's office (most recent routing entry)
  const outgoingDocs = useMemo(() => {
    if (!user) return []
    return documents.filter(doc => {
      const lastRoute = doc.routingHistory[doc.routingHistory.length - 1]
      if (!lastRoute) return false
      return lastRoute.fromOfficeId === user.officeId && lastRoute.toOfficeId !== user.officeId
    })
  }, [documents, user])

  const filtered = useMemo(() => {
    let results = outgoingDocs
    if (search) {
      const q = search.toLowerCase()
      results = results.filter(d => d.trackingCode.toLowerCase().includes(q) || d.title.toLowerCase().includes(q))
    }
    if (statusFilter === 'acknowledged') results = results.filter(d => d.routingHistory[d.routingHistory.length - 1]?.isAcknowledged)
    if (statusFilter === 'pending') results = results.filter(d => !d.routingHistory[d.routingHistory.length - 1]?.isAcknowledged)
    return results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [outgoingDocs, search, statusFilter])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  const getOfficeName = (oid: string) => offices.find(o => o.id === oid)?.code || oid
  const getUserName = (uid: string) => { const u = users.find(u => u.id === uid); return u ? `${u.firstName} ${u.lastName}` : '' }

  const ackCount = outgoingDocs.filter(d => d.routingHistory[d.routingHistory.length - 1]?.isAcknowledged).length
  const pendCount = outgoingDocs.length - ackCount

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Outgoing Documents</h1>
        <p className="text-sm text-slate-500 mt-1">Documents forwarded or routed from your office</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => setStatusFilter('all')}>
          <CardContent className="p-3 text-center">
            <Send className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-slate-900">{outgoingDocs.length}</p>
            <p className="text-xs text-slate-500">Total Sent</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => setStatusFilter('acknowledged')}>
          <CardContent className="p-3 text-center">
            <Check className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-600">{ackCount}</p>
            <p className="text-xs text-slate-500">Acknowledged</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => setStatusFilter('pending')}>
          <CardContent className="p-3 text-center">
            <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-amber-600">{pendCount}</p>
            <p className="text-xs text-slate-500">Awaiting</p>
          </CardContent>
        </Card>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search outgoing..." className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Acknowledgment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="pending">Pending Receipt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-xs text-slate-500">Tracking Code</th>
                  <th className="px-4 py-3 font-semibold text-xs text-slate-500">Title</th>
                  <th className="px-4 py-3 font-semibold text-xs text-slate-500">Sent To</th>
                  <th className="px-4 py-3 font-semibold text-xs text-slate-500">Action</th>
                  <th className="px-4 py-3 font-semibold text-xs text-slate-500">Date Sent</th>
                  <th className="px-4 py-3 font-semibold text-xs text-slate-500">Status</th>
                  <th className="px-4 py-3 font-semibold text-xs text-slate-500">Receipt</th>
                  <th className="px-4 py-3 font-semibold text-xs text-slate-500"></th>
                </tr>
              </thead>
              <tbody>
                {paged.map(doc => {
                  const lastRoute = doc.routingHistory[doc.routingHistory.length - 1]!
                  return (
                    <tr key={doc.id} className="border-b hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-mono text-xs text-blue-700 font-semibold">{doc.trackingCode}</td>
                      <td className="px-4 py-3 max-w-[240px]"><span className="line-clamp-1">{doc.title}</span></td>
                      <td className="px-4 py-3 text-xs">{getOfficeName(lastRoute.toOfficeId)}{lastRoute.toUserId && <span className="block text-slate-400">{getUserName(lastRoute.toUserId)}</span>}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{lastRoute.action}</Badge></td>
                      <td className="px-4 py-3 text-xs text-slate-500">{format(new Date(lastRoute.timestamp), 'MMM d, h:mm a')}</td>
                      <td className="px-4 py-3"><DocStatusBadge status={doc.status} /></td>
                      <td className="px-4 py-3">
                        {lastRoute.isAcknowledged
                          ? <Badge variant="success" className="text-[10px]"><Check className="w-3 h-3 mr-1" />Received</Badge>
                          : <Badge variant="warning" className="text-[10px]"><Clock className="w-3 h-3 mr-1" />Pending</Badge>}
                      </td>
                      <td className="px-4 py-3">
                        <Button asChild variant="ghost" size="icon" className="h-7 w-7"><Link to={`/documents/${doc.id}`}><ExternalLink className="w-3.5 h-3.5" /></Link></Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y">
            {paged.map(doc => {
              const lastRoute = doc.routingHistory[doc.routingHistory.length - 1]!
              return (
                <Link key={doc.id} to={`/documents/${doc.id}`} className="block p-3 hover:bg-slate-50 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-blue-700 font-semibold">{doc.trackingCode}</p>
                      <p className="text-sm font-medium truncate mt-0.5">{doc.title}</p>
                      <p className="text-xs text-slate-500 mt-1">→ {getOfficeName(lastRoute.toOfficeId)} · {format(new Date(lastRoute.timestamp), 'MMM d')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <DocStatusBadge status={doc.status} />
                      {lastRoute.isAcknowledged ? <Badge variant="success" className="text-[9px]">Received</Badge> : <Badge variant="warning" className="text-[9px]">Pending</Badge>}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {paged.length === 0 && (
            <div className="text-center py-12"><Send className="w-12 h-12 text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-400">No outgoing documents found</p></div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">{filtered.length} document{filtered.length !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="w-4 h-4" /></Button>
            <span className="px-3 text-xs text-slate-600">{page} / {totalPages}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      )}
    </div>
  )
}
