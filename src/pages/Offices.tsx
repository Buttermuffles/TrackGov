import React, { useState } from 'react'
import { useOfficeStore, useDocumentStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import type { Office } from '@/types'
import { Building2, Plus, Edit, Users, Search, LayoutGrid, LayoutList } from 'lucide-react'

export default function Offices() {
  const { offices, addOffice, updateOffice } = useOfficeStore()
  const documents = useDocumentStore(s => s.documents)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Office | null>(null)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [staffCount, setStaffCount] = useState('0')
  const [desc, setDesc] = useState('')
  const [viewType, setViewType] = useState<'card' | 'table'>('card')

  const filtered = offices.filter(o => { const q = search.toLowerCase(); return !q || o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q) })
  const openAdd = () => { setEditing(null); setCode(''); setName(''); setStaffCount('0'); setDesc(''); setShowForm(true) }
  const openEdit = (o: Office) => { setEditing(o); setCode(o.code); setName(o.name); setStaffCount(String(o.staffCount)); setDesc(o.description || ''); setShowForm(true) }
  const handleSave = () => { if (!code || !name) return; const data = { code, name, staffCount: parseInt(staffCount) || 0, isActive: true, description: desc || undefined }; if (editing) updateOffice(editing.id, data); else addOffice(data); setShowForm(false) }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div><h1 className="text-xl lg:text-2xl font-bold text-slate-900">Offices & Departments</h1><p className="text-sm text-slate-500 mt-1">{offices.length} offices registered</p></div>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Office</Button>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="flex items-center gap-1">
          <button onClick={() => setViewType('card')} className={viewType === 'card' ? 'text-blue-600' : 'text-slate-400'} title="Card view"><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setViewType('table')} className={viewType === 'table' ? 'text-blue-600' : 'text-slate-400'} title="Table view"><LayoutList className="w-4 h-4" /></button>
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search offices..." className="pl-9" />
        </div>
      </div>
      {viewType === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(office => { const docCount = documents.filter(d => d.currentOfficeId === office.id).length; return (
            <Card key={office.id} className="hover:shadow-md transition group"><CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between"><div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center"><Building2 className="w-5 h-5 text-navy" /></div><Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => openEdit(office)}><Edit className="w-3.5 h-3.5" /></Button></div>
              <div><Badge variant="outline" className="text-[10px] mb-1">{office.code}</Badge><h3 className="text-sm font-semibold line-clamp-2">{office.name}</h3></div>
              <div className="space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-1.5"><Users className="w-3 h-3" />{office.staffCount} staff members</p>
                {office.description && <p className="text-xs text-slate-400">{office.description}</p>}
              </div>
              <div className="pt-2 border-t flex items-center justify-between text-xs"><span className="text-slate-400">Documents held:</span><Badge variant="secondary">{docCount}</Badge></div>
            </CardContent></Card>
          ) })}
        </div>
      ) : (
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
              {filtered.map(office => {
                const docCount = documents.filter(d => d.currentOfficeId === office.id).length
                return (
                  <tr key={office.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3">{office.code}</td>
                    <td className="px-4 py-3">{office.name}</td>
                    <td className="px-4 py-3 text-xs">{office.staffCount}</td>
                    <td className="px-4 py-3 text-xs truncate max-w-[200px]">{office.description}</td>
                    <td className="px-4 py-3 text-xs"><Badge variant="secondary">{docCount}</Badge></td>
                    <td className="px-4 py-3"><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(office)}><Edit className="w-3.5 h-3.5" /></Button></td>
                  </tr>
                )
              })}
            </tbody>
          </table></div>
          {filtered.length === 0 && <div className="text-center py-12"><Building2 className="w-12 h-12 text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-400">No offices found</p></div>}
        </CardContent></Card>
      )}
      {filtered.length === 0 && <div className="text-center py-12"><Building2 className="w-12 h-12 text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-400">No offices found</p></div>}
      <Dialog open={showForm} onOpenChange={setShowForm}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{editing ? 'Edit Office' : 'Add New Office'}</DialogTitle><DialogDescription>Fill in the office details.</DialogDescription></DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-3 gap-4"><div className="space-y-2"><Label>Code <span className="text-red-500">*</span></Label><Input value={code} onChange={e => setCode(e.target.value)} placeholder="HRMO" /></div><div className="space-y-2 col-span-2"><Label>Name <span className="text-red-500">*</span></Label><Input value={name} onChange={e => setName(e.target.value)} /></div></div>
          <div className="space-y-2"><Label>Staff Count</Label><Input type="number" value={staffCount} onChange={e => setStaffCount(e.target.value)} /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={handleSave} disabled={!code || !name}>{editing ? 'Save' : 'Add Office'}</Button></DialogFooter>
      </DialogContent></Dialog>
    </div>
  )
}
