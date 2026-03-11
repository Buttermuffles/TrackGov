import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentStore, useOfficeStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DocStatusBadge, PriorityBadge } from '@/components/documents/DocStatusBadge'
import { format } from 'date-fns'
import type { DocumentStatus, DocumentType, Priority } from '@/types'
import { Search, ChevronLeft, ChevronRight, FileText, ExternalLink, LayoutGrid, LayoutList, ArrowUpDown, Filter, X, Download } from 'lucide-react'

export default function Documents() {
  const documents = useDocumentStore(s => s.documents)
  const offices = useOfficeStore(s => s.offices)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [officeFilter, setOfficeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [view, setView] = useState<'table' | 'card'>('table')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 20

  const filtered = useMemo(() => {
    let r = [...documents]
    if (search) { const q = search.toLowerCase(); r = r.filter(d => d.trackingCode.toLowerCase().includes(q) || d.title.toLowerCase().includes(q)) }
    if (statusFilter !== 'all') r = r.filter(d => d.status === statusFilter)
    if (typeFilter !== 'all') r = r.filter(d => d.documentType === typeFilter)
    if (priorityFilter !== 'all') r = r.filter(d => d.priority === priorityFilter)
    if (officeFilter !== 'all') r = r.filter(d => d.currentOfficeId === officeFilter)
    r.sort((a, b) => sortBy === 'oldest' ? new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime() : sortBy === 'title' ? a.title.localeCompare(b.title) : new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
    return r
  }, [documents, search, statusFilter, typeFilter, priorityFilter, officeFilter, sortBy])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)
  const getOfficeName = (oid: string) => offices.find(o => o.id === oid)?.code || oid
  const activeCount = [statusFilter, typeFilter, priorityFilter, officeFilter].filter(v => v !== 'all').length
  const statuses: DocumentStatus[] = ['Received','In Review','For Signature','For Routing','In Transit','Action Taken','Returned','Completed','On Hold','Cancelled']
  const docTypes: DocumentType[] = ['Letter','Memorandum','Resolution','Ordinance','Contract','Report','Request','Petition','Certificate','Voucher','Purchase Order','Other']
  const priorities: Priority[] = ['Low','Normal','High','Urgent']

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div><h1 className="text-xl lg:text-2xl font-bold text-slate-900">All Documents</h1><p className="text-sm text-slate-500 mt-1">{filtered.length} of {documents.length} documents</p></div>
        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><Input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search..." className="pl-9" /></div>
        <Button variant={showFilters ? 'default' : 'outline'} size="sm" onClick={() => setShowFilters(!showFilters)}><Filter className="w-4 h-4 mr-1" />Filters{activeCount > 0 && <Badge className="ml-1 text-[10px]" variant="secondary">{activeCount}</Badge>}</Button>
        <div className="flex border rounded-md overflow-hidden"><button onClick={() => setView('table')} className={"p-2 " + (view === 'table' ? 'bg-blue-50 text-blue-700' : 'text-slate-400')}><LayoutList className="w-4 h-4" /></button><button onClick={() => setView('card')} className={"p-2 " + (view === 'card' ? 'bg-blue-50 text-blue-700' : 'text-slate-400')}><LayoutGrid className="w-4 h-4" /></button></div>
        <Select value={sortBy} onValueChange={v => { setSortBy(v); setPage(1) }}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest</SelectItem><SelectItem value="oldest">Oldest</SelectItem><SelectItem value="title">Title</SelectItem></SelectContent></Select>
      </div>
      {showFilters && <Card><CardContent className="p-3"><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1) }}><SelectTrigger className="text-xs h-9"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setPage(1) }}><SelectTrigger className="text-xs h-9"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem>{docTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
        <Select value={priorityFilter} onValueChange={v => { setPriorityFilter(v); setPage(1) }}><SelectTrigger className="text-xs h-9"><SelectValue placeholder="Priority" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
        <Select value={officeFilter} onValueChange={v => { setOfficeFilter(v); setPage(1) }}><SelectTrigger className="text-xs h-9"><SelectValue placeholder="Office" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{offices.map(o => <SelectItem key={o.id} value={o.id}>{o.code}</SelectItem>)}</SelectContent></Select>
      </div>{activeCount > 0 && <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => { setStatusFilter('all'); setTypeFilter('all'); setPriorityFilter('all'); setOfficeFilter('all'); setPage(1) }}><X className="w-3 h-3 mr-1" />Clear</Button>}</CardContent></Card>}

      {view === 'table' && <Card><CardContent className="p-0">
        <div className="hidden md:block overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b bg-slate-50 text-left"><th className="px-4 py-3 text-xs font-semibold text-slate-500">Tracking</th><th className="px-4 py-3 text-xs font-semibold text-slate-500">Title</th><th className="px-4 py-3 text-xs font-semibold text-slate-500">Type</th><th className="px-4 py-3 text-xs font-semibold text-slate-500">Status</th><th className="px-4 py-3 text-xs font-semibold text-slate-500">Priority</th><th className="px-4 py-3 text-xs font-semibold text-slate-500">Office</th><th className="px-4 py-3 text-xs font-semibold text-slate-500">Date</th><th className="px-4 py-3"></th></tr></thead><tbody>
          {paged.map(doc => <tr key={doc.id} className="border-b hover:bg-slate-50"><td className="px-4 py-3 font-mono text-xs text-blue-700 font-semibold">{doc.trackingCode}</td><td className="px-4 py-3 max-w-[260px]"><span className="line-clamp-1 font-medium">{doc.title}</span></td><td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{doc.documentType}</Badge></td><td className="px-4 py-3"><DocStatusBadge status={doc.status} /></td><td className="px-4 py-3"><PriorityBadge priority={doc.priority} /></td><td className="px-4 py-3 text-xs">{getOfficeName(doc.currentOfficeId)}</td><td className="px-4 py-3 text-xs text-slate-500">{format(new Date(doc.dateCreated), 'MMM d, yyyy')}</td><td className="px-4 py-3"><Button asChild variant="ghost" size="icon" className="h-7 w-7"><Link to={'/documents/' + doc.id}><ExternalLink className="w-3.5 h-3.5" /></Link></Button></td></tr>)}
        </tbody></table></div>
        <div className="md:hidden divide-y">{paged.map(doc => <Link key={doc.id} to={'/documents/' + doc.id} className="block p-3 hover:bg-slate-50"><div className="flex items-start justify-between gap-2"><div className="min-w-0 flex-1"><p className="font-mono text-xs text-blue-700 font-semibold">{doc.trackingCode}</p><p className="text-sm font-medium truncate mt-0.5">{doc.title}</p></div><div className="flex flex-col items-end gap-1"><DocStatusBadge status={doc.status} /><PriorityBadge priority={doc.priority} /></div></div></Link>)}</div>
        {paged.length === 0 && <div className="text-center py-12"><FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-400">No documents</p></div>}
      </CardContent></Card>}

      {view === 'card' && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">{paged.map(doc => <Link key={doc.id} to={'/documents/' + doc.id}><Card className="hover:shadow-md transition h-full"><CardContent className="p-4 space-y-2"><div className="flex items-start justify-between"><p className="font-mono text-xs text-blue-700 font-semibold">{doc.trackingCode}</p><PriorityBadge priority={doc.priority} /></div><h3 className="text-sm font-semibold line-clamp-2">{doc.title}</h3><div className="flex flex-wrap gap-1"><DocStatusBadge status={doc.status} /><Badge variant="outline" className="text-[10px]">{doc.documentType}</Badge></div></CardContent></Card></Link>)}</div>}

      {totalPages > 1 && <div className="flex items-center justify-between text-sm"><span className="text-slate-500">{filtered.length} docs</span><div className="flex items-center gap-1"><Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="w-4 h-4" /></Button><span className="px-3 text-xs">{page}/{totalPages}</span><Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="w-4 h-4" /></Button></div></div>}
    </div>
  )
}
