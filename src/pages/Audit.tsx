import React, { useState, useMemo } from 'react'
import { useAuditStore, useUserStore } from '@/store'
import type { AuditEntry } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { Search, Shield, ChevronLeft, ChevronRight } from 'lucide-react'

const actionColors: Record<string, string> = {
  document_created: 'bg-green-100 text-green-700', document_updated: 'bg-blue-100 text-blue-700',
  document_routed: 'bg-purple-100 text-purple-700', document_acknowledged: 'bg-teal-100 text-teal-700',
  user_login: 'bg-slate-100 text-slate-700', user_logout: 'bg-slate-100 text-slate-500', settings_changed: 'bg-amber-100 text-amber-700',
}

export default function Audit() {
  const entries = useAuditStore(s => s.auditTrail)
  const users = useUserStore(s => s.users)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 20
  const getUserName = (uid: string) => { const u = users.find(x => x.id === uid); return u ? u.firstName + ' ' + u.lastName : uid }

  const filtered = useMemo(() => {
    let r = [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    if (search) { const q = search.toLowerCase(); r = r.filter(e => e.action.toLowerCase().includes(q) || e.details.toLowerCase().includes(q) || getUserName(e.userId).toLowerCase().includes(q)) }
    if (actionFilter !== 'all') r = r.filter(e => e.action === actionFilter)
    return r
  }, [entries, search, actionFilter])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)
  const actions = [...new Set(entries.map((e: AuditEntry) => e.action))] as string[]

  return (
    <div className="space-y-4 lg:space-y-6">
      <div><h1 className="text-xl lg:text-2xl font-bold text-slate-900">Audit Trail</h1><p className="text-sm text-slate-500 mt-1">System activity log - {entries.length} entries</p></div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><Input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search audit log..." className="pl-9" /></div>
        <Select value={actionFilter} onValueChange={v => { setActionFilter(v); setPage(1) }}><SelectTrigger className="w-full sm:w-52"><SelectValue placeholder="Action" /></SelectTrigger><SelectContent><SelectItem value="all">All Actions</SelectItem>{actions.map(a => <SelectItem key={a} value={a}>{a.replace(/_/g, ' ')}</SelectItem>)}</SelectContent></Select>
      </div>
      <Card><CardContent className="p-0">
        <div className="hidden md:block overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b bg-slate-50 text-left"><th className="px-4 py-3 text-xs font-semibold text-slate-500">Timestamp</th><th className="px-4 py-3 text-xs font-semibold text-slate-500">User</th><th className="px-4 py-3 text-xs font-semibold text-slate-500">Action</th><th className="px-4 py-3 text-xs font-semibold text-slate-500">Details</th><th className="px-4 py-3 text-xs font-semibold text-slate-500">IP</th></tr></thead><tbody>
          {paged.map(e => <tr key={e.id} className="border-b hover:bg-slate-50"><td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{format(new Date(e.timestamp), 'MMM d, yyyy h:mm:ss a')}</td><td className="px-4 py-3 text-xs font-medium">{getUserName(e.userId)}</td><td className="px-4 py-3"><span className={"text-[10px] px-2 py-0.5 rounded-full font-medium " + (actionColors[e.action] || 'bg-slate-100 text-slate-600')}>{e.action.replace(/_/g, ' ')}</span></td><td className="px-4 py-3 text-xs text-slate-600 max-w-[300px] truncate">{e.details}</td><td className="px-4 py-3 text-xs text-slate-400 font-mono">{e.ipAddress || '-'}</td></tr>)}
        </tbody></table></div>
        <div className="md:hidden divide-y">{paged.map(e => <div key={e.id} className="p-3 space-y-1"><div className="flex items-center justify-between"><span className={"text-[10px] px-2 py-0.5 rounded-full font-medium " + (actionColors[e.action] || 'bg-slate-100 text-slate-600')}>{e.action.replace(/_/g, ' ')}</span><span className="text-[10px] text-slate-400">{format(new Date(e.timestamp), 'MMM d, h:mm a')}</span></div><p className="text-xs font-medium">{getUserName(e.userId)}</p><p className="text-xs text-slate-600">{e.details}</p></div>)}</div>
        {paged.length === 0 && <div className="text-center py-12"><Shield className="w-12 h-12 text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-400">No entries found</p></div>}
      </CardContent></Card>
      {totalPages > 1 && <div className="flex items-center justify-between text-sm"><span className="text-slate-500">{filtered.length} entries</span><div className="flex items-center gap-1"><Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="w-4 h-4" /></Button><span className="px-3 text-xs">{page}/{totalPages}</span><Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="w-4 h-4" /></Button></div></div>}
    </div>
  )
}
