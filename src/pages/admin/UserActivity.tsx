import React, { useState, useMemo, useEffect } from 'react'
import { useAuditStore, useUserStore } from '@/store'
import type { AuditEntry } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { Search, Shield } from 'lucide-react'
import PaginationControls from '@/components/shared/PaginationControls'

const actionColors: Record<string, string> = {
  document_created: 'bg-emerald-100 text-emerald-700',
  document_updated: 'bg-sky-100 text-sky-700',
  document_routed: 'bg-purple-100 text-purple-700',
  document_acknowledged: 'bg-teal-100 text-teal-700',
  user_login: 'bg-emerald-50 text-emerald-800',
  user_logout: 'bg-slate-100 text-slate-700',
  settings_changed: 'bg-amber-100 text-amber-700',

  // common values seen in UI
  login: 'bg-emerald-50 text-emerald-800',
  forward_document: 'bg-purple-100 text-purple-700',
  create_document: 'bg-sky-100 text-sky-700',
  add_remark: 'bg-amber-100 text-amber-700',

  // fallback
  default: 'bg-slate-100 text-slate-600',
}

export default function UserActivity() {
  const entries = useAuditStore(s => s.auditTrail)
  const users = useUserStore(s => s.users)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const getUserName = (uid: string) => { const u = users.find(x => x.id === uid); return u ? u.firstName + ' ' + u.lastName : uid }

  const filtered = useMemo(() => {
    let r = [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    if (search) { const q = search.toLowerCase(); r = r.filter(e => e.action.toLowerCase().includes(q) || e.details.toLowerCase().includes(q) || getUserName(e.userId).toLowerCase().includes(q)) }
    if (actionFilter !== 'all') r = r.filter(e => e.action === actionFilter)
    return r
  }, [entries, search, actionFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)
  const actions = [...new Set(entries.map((e: AuditEntry) => e.action))] as string[]

  const normalizeAction = (action: string) => action.toLowerCase().replace(/\s+/g, '_')

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  useEffect(() => {
    setPage(1)
  }, [pageSize])

  return (
    <div className="space-y-4 lg:space-y-6">
      <div><h1 className="text-xl lg:text-2xl font-bold text-slate-900">Activity Log</h1><p className="text-sm text-slate-500 mt-1">User activity log - {entries.length} entries</p></div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><Input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search user activity..." className="pl-9" /></div>
        <Select value={actionFilter} onValueChange={v => { setActionFilter(v); setPage(1) }}><SelectTrigger className="w-full sm:w-52"><SelectValue placeholder="Action" /></SelectTrigger><SelectContent><SelectItem value="all">All Actions</SelectItem>{actions.map(a => <SelectItem key={a} value={a}>{a.replace(/_/g, ' ')}</SelectItem>)}</SelectContent></Select>
      </div>
      <Card><CardContent className="p-0">
        <div className="hidden md:block overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b bg-slate-50 text-left"><th className="px-4 py-3 text-xs font-semibold text-slate-500">Timestamp</th><th className="px-4 py-3 text-xs font-semibold text-slate-500">User</th><th className="px-4 py-3 text-xs font-semibold text-slate-500">Action</th><th className="px-4 py-3 text-xs font-semibold text-slate-500">Details</th></tr></thead><tbody>
          {paged.map(e => {
            const actionKey = normalizeAction(e.action)
            return (
              <tr key={e.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{format(new Date(e.timestamp), 'MMM d, yyyy h:mm:ss a')}</td>
                <td className="px-4 py-3 text-xs font-medium">{getUserName(e.userId)}</td>
                <td className="px-4 py-3">
                  <span className={"text-[10px] px-2 py-0.5 rounded-full font-medium " + (actionColors[actionKey] || actionColors.default)}>
                    {e.action.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600 max-w-75 truncate">{e.details}</td>
              </tr>
            )
          })}
        </tbody></table></div>
        <div className="md:hidden divide-y">{paged.map(e => {
          const actionKey = normalizeAction(e.action)
          return (
            <div key={e.id} className="p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className={"text-[10px] px-2 py-0.5 rounded-full font-medium " + (actionColors[actionKey] || actionColors.default)}>
                  {e.action.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-slate-400">{format(new Date(e.timestamp), 'MMM d, h:mm a')}</span>
              </div>
              <p className="text-xs font-medium">{getUserName(e.userId)}</p>
              <p className="text-xs text-slate-600">{e.details}</p>
            </div>
          )
        })}</div>
        {paged.length === 0 && <div className="text-center py-12"><Shield className="w-12 h-12 text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-400">No entries found</p></div>}
      </CardContent></Card>
      {filtered.length > 0 && (
        <PaginationControls
          totalItems={filtered.length}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="entries"
        />
      )}
    </div>
  )
}
