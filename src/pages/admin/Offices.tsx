import React, { useMemo, useState, useEffect } from 'react'
import { useOfficeStore, useDocumentStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import PaginationControls from '@/components/shared/PaginationControls'
import { toast } from 'sonner'
import type { Office } from '@/types'
import { Building2, Plus, Pencil, Users, Search, Filter, X, LayoutGrid, LayoutList } from 'lucide-react'
import { usePermission } from '@/hooks/usePermission'

const officeCodeBadgeClass = 'border border-cyan-200 bg-cyan-50 text-cyan-800 shadow-sm'
const officeActiveStatusClass = 'border border-emerald-200 bg-emerald-50 text-emerald-700'
const officeInactiveStatusClass = 'border border-rose-200 bg-rose-50 text-rose-700'

export default function Offices() {
  const { can } = usePermission()
  const canCreateOffice = can('offices', 'create')
  const canEditOffice = can('offices', 'update')
  const { offices, addOffice, updateOffice } = useOfficeStore()
  const documents = useDocumentStore(s => s.documents)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Office | null>(null)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [staffCount, setStaffCount] = useState('0')
  const [desc, setDesc] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [view, setView] = useState<'table' | 'card'>('table')
  const [statusFilter, setStatusFilter] = useState('all')
  const [docFilter, setDocFilter] = useState('all')
  const [staffFilter, setStaffFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

  const documentCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    documents.forEach(d => { counts[d.currentOfficeId] = (counts[d.currentOfficeId] || 0) + 1 })
    return counts
  }, [documents])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return offices.filter(o => {
      const matchesSearch = !q || o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? o.isActive : !o.isActive)
      const docCount = documentCounts[o.id] || 0
      const matchesDocs = docFilter === 'all' || (docFilter === 'with_docs' ? docCount > 0 : docCount === 0)
      const matchesStaff =
        staffFilter === 'all' ||
        (staffFilter === 'small' && o.staffCount <= 5) ||
        (staffFilter === 'medium' && o.staffCount >= 6 && o.staffCount <= 10) ||
        (staffFilter === 'large' && o.staffCount > 10)
      return matchesSearch && matchesStatus && matchesDocs && matchesStaff
    })
  }, [offices, search, statusFilter, docFilter, staffFilter, documentCounts])

  const activeCount = [statusFilter, docFilter, staffFilter].filter(v => v !== 'all').length

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, docFilter, staffFilter])

  useEffect(() => {
    setPage(1)
  }, [pageSize])

  const openAdd = () => { setEditing(null); setCode(''); setName(''); setStaffCount('0'); setDesc(''); setIsActive(true); setShowForm(true) }
  const openEdit = (o: Office) => { setEditing(o); setCode(o.code); setName(o.name); setStaffCount(String(o.staffCount)); setDesc(o.description || ''); setIsActive(o.isActive); setShowForm(true) }
  const handleSave = () => {
    if (!code || !name) return
    const data = { code, name, staffCount: parseInt(staffCount) || 0, isActive, description: desc || undefined }
    try {
      if (editing) {
        updateOffice(editing.id, data)
        toast.success('Item updated successfully.')
      } else {
        addOffice(data)
        toast.success('Item created successfully.')
      }
      setShowForm(false)
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div><h1 className="text-xl lg:text-2xl font-bold text-slate-900">Offices & Departments</h1><p className="text-sm text-slate-500 mt-1">{offices.length} offices registered</p></div>
        {canCreateOffice && <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Office</Button>}
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search offices..." className="pl-9" />
        </div>
        <Button variant={showFilters ? 'default' : 'outline'} size="sm" onClick={() => setShowFilters(!showFilters)}><Filter className="w-4 h-4 mr-1" />Filters{activeCount > 0 && <Badge className="ml-1 text-[10px]" variant="secondary">{activeCount}</Badge>}</Button>
        <div className="flex border rounded-md overflow-hidden">
          <button
            type="button"
            title="Table view"
            className={`p-2 ${view === 'table' ? 'bg-blue-50 text-blue-700' : 'text-slate-400'}`}
            onClick={() => setView('table')}
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Card view"
            className={`p-2 ${view === 'card' ? 'bg-blue-50 text-blue-700' : 'text-slate-400'}`}
            onClick={() => setView('card')}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
      {showFilters && <Card><CardContent className="p-3"><div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="text-xs h-9"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select>
        <Select value={docFilter} onValueChange={setDocFilter}><SelectTrigger className="text-xs h-9"><SelectValue placeholder="Documents" /></SelectTrigger><SelectContent><SelectItem value="all">All Document Load</SelectItem><SelectItem value="with_docs">With Documents</SelectItem><SelectItem value="no_docs">No Documents</SelectItem></SelectContent></Select>
        <Select value={staffFilter} onValueChange={setStaffFilter}><SelectTrigger className="text-xs h-9"><SelectValue placeholder="Staff Size" /></SelectTrigger><SelectContent><SelectItem value="all">All Team Sizes</SelectItem><SelectItem value="small">Small (0-5)</SelectItem><SelectItem value="medium">Medium (6-10)</SelectItem><SelectItem value="large">Large (11+)</SelectItem></SelectContent></Select>
      </div>{activeCount > 0 && <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => { setStatusFilter('all'); setDocFilter('all'); setStaffFilter('all') }}><X className="w-3 h-3 mr-1" />Clear</Button>}</CardContent></Card>}
      {view === 'table' ? (
        <Card><CardContent className="p-0">
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Code</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Staff</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Description</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Docs</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(office => {
                const docCount = documentCounts[office.id] || 0
                return (
                  <tr key={office.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3"><Badge className={"text-[10px] " + officeCodeBadgeClass}>{office.code}</Badge></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-linear-to-br from-cyan-200 to-blue-200 rounded-lg flex items-center justify-center"><Building2 className="w-4 h-4 text-cyan-800" /></div><div><p className="font-medium text-slate-900">{office.name}</p><span className={(office.isActive ? officeActiveStatusClass : officeInactiveStatusClass) + ' mt-1 inline-flex px-2 py-0.5 rounded-full text-[10px]'}>{office.isActive ? 'Active' : 'Inactive'}</span></div></div></td>
                    <td className="px-4 py-3 text-xs text-slate-600"><div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" />{office.staffCount}</div></td>
                    <td className="px-4 py-3 text-xs text-slate-600 max-w-50 truncate">{office.description || '—'}</td>
                    <td className="px-4 py-3 text-xs"><Badge variant="secondary">{docCount}</Badge></td>
                    {canEditOffice && <td className="px-4 py-3"><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(office)}><Pencil className="w-3.5 h-3.5" /></Button></td>}
                  </tr>
                )
              })}
            </tbody>
          </table></div>
        </CardContent></Card>
      ) : (
        filtered.length === 0 ? (
          <div className="text-center py-12"><Building2 className="w-12 h-12 text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-400">No offices found</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {paginated.map(office => {
              const docCount = documentCounts[office.id] || 0
              return (
                <Card key={office.id} className="group h-full border-slate-200 bg-linear-to-b from-white to-slate-50 shadow-sm hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{office.name}</p>
                        <p className="text-xs text-slate-500">{office.code}</p>
                      </div>
                      {canEditOffice && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(office)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Status</span>
                        <span className={(office.isActive ? officeActiveStatusClass : officeInactiveStatusClass) + ' px-2 py-0.5 rounded-full text-[10px]'}>{office.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Staff</span>
                        <span className="text-slate-700">{office.staffCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Docs</span>
                        <Badge variant="secondary" className="text-xs py-0.5 px-2">{docCount}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-3">{office.description || 'No description'}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )
      )}

      {filtered.length > 0 && (
        <PaginationControls
          totalItems={filtered.length}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="offices"
          compact={view === 'card'}
        />
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{editing ? 'Edit Office' : 'Add New Office'}</DialogTitle><DialogDescription>Fill in the office details.</DialogDescription></DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-3 gap-4"><div className="space-y-2"><Label>Code <span className="text-red-500">*</span></Label><Input value={code} onChange={e => setCode(e.target.value)} placeholder="HRMO" /></div><div className="space-y-2 col-span-2"><Label>Name <span className="text-red-500">*</span></Label><Input value={name} onChange={e => setName(e.target.value)} /></div></div>
          <div className="space-y-2"><Label>Staff Count</Label><Input type="number" value={staffCount} onChange={e => setStaffCount(e.target.value)} /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} /></div>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"><div><Label>Status</Label><p className="text-xs text-slate-500 mt-1">Toggle whether this office is active or inactive.</p></div><div className="flex items-center gap-3"><span className={"text-xs font-medium " + (isActive ? 'text-emerald-700' : 'text-rose-700')}>{isActive ? 'Active' : 'Inactive'}</span><Switch checked={isActive} onCheckedChange={setIsActive} /></div></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={handleSave} disabled={!code || !name}>{editing ? 'Save' : 'Add Office'}</Button></DialogFooter>
      </DialogContent></Dialog>
    </div>
  )
}
