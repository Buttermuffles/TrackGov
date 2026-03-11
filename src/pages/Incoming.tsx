import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore, useDocumentStore, useOfficeStore, useUserStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DocStatusBadge, PriorityBadge } from '@/components/documents/DocStatusBadge'
import { Plus, Search, Check, ArrowRight, MessageSquare, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import type { Document, DocumentType, Priority, Classification, RoutingAction } from '@/types'
import { generateTrackingCode } from '@/lib/utils'

export default function Incoming() {
  const user = useAuthStore(s => s.currentUser)
  const { documents, addDocument, acknowledgeDocument, addRoutingEntry } = useDocumentStore()
  const offices = useOfficeStore(s => s.offices)
  const users = useUserStore(s => s.users)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [showReceiveForm, setShowReceiveForm] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 10

  const incomingDocs = useMemo(() => {
    let docs = documents.filter(d => d.currentOfficeId === user?.officeId)
    if (search) {
      const s = search.toLowerCase()
      docs = docs.filter(d => d.trackingCode.toLowerCase().includes(s) || d.title.toLowerCase().includes(s))
    }
    if (typeFilter !== 'all') docs = docs.filter(d => d.documentType === typeFilter)
    if (priorityFilter !== 'all') docs = docs.filter(d => d.priority === priorityFilter)
    return docs.sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime())
  }, [documents, user, search, typeFilter, priorityFilter])

  const totalPages = Math.ceil(incomingDocs.length / perPage)
  const paginatedDocs = incomingDocs.slice((page - 1) * perPage, page * perPage)
  const getOfficeName = (id: string) => offices.find(o => o.id === id)?.code || id
  const getUserName = (id: string) => { const u = users.find(u => u.id === id); return u ? `${u.firstName} ${u.lastName}` : '—' }

  const isOverdue = (d: Document) => d.dueDate && new Date(d.dueDate) < new Date() && !['Completed', 'Cancelled', 'Action Taken'].includes(d.status)
  const isUnacknowledged = (d: Document) => d.routingHistory.some(rh => rh.toOfficeId === user?.officeId && !rh.isAcknowledged)

  // Receive form state
  const [formData, setFormData] = useState({
    title: '', documentType: 'Letter' as DocumentType, referenceNumber: '', classification: 'Routine' as Classification, priority: 'Normal' as Priority,
    fromOfficeId: '', dateReceived: format(new Date(), 'yyyy-MM-dd'), dueDate: '', description: '', tags: '',
    assignToOfficeId: '', assignToUserId: '', action: 'For Review' as RoutingAction, remarks: '',
  })

  const handleReceive = () => {
    if (!formData.title || !user) return
    const newDoc = addDocument({
      title: formData.title, description: formData.description, documentType: formData.documentType, classification: formData.classification, priority: formData.priority,
      originatorId: user.id, originOfficeId: user.officeId, currentOfficeId: formData.assignToOfficeId || user.officeId,
      currentAssigneeId: formData.assignToUserId || undefined, status: 'Received',
      attachments: [], routingHistory: [], remarks: [],
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      dateReceived: new Date(formData.dateReceived), tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      referenceNumber: formData.referenceNumber || undefined, isConfidential: formData.classification === 'Confidential' || formData.classification === 'Top Secret',
    })

    if (formData.assignToOfficeId && formData.assignToOfficeId !== user.officeId) {
      addRoutingEntry(newDoc.id, {
        documentId: newDoc.id, fromOfficeId: user.officeId, toOfficeId: formData.assignToOfficeId,
        fromUserId: user.id, toUserId: formData.assignToUserId || undefined,
        action: formData.action, remarks: formData.remarks, timestamp: new Date(), isAcknowledged: false,
      })
    }

    setShowReceiveForm(false)
    setFormData({ title: '', documentType: 'Letter', referenceNumber: '', classification: 'Routine', priority: 'Normal', fromOfficeId: '', dateReceived: format(new Date(), 'yyyy-MM-dd'), dueDate: '', description: '', tags: '', assignToOfficeId: '', assignToUserId: '', action: 'For Review', remarks: '' })
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">Incoming Documents</h1>
          <p className="text-sm text-slate-500 mt-1">Documents routed to your office</p>
        </div>
        <Button onClick={() => setShowReceiveForm(true)}><Plus className="w-4 h-4 mr-2" />Receive New Document</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search by tracking code or title..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {['Letter', 'Memorandum', 'Resolution', 'Ordinance', 'Contract', 'Report', 'Request', 'Petition', 'Certificate', 'Voucher', 'Purchase Order', 'Other'].map(t => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Priorities" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {['Low', 'Normal', 'High', 'Urgent'].map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking Code</TableHead>
                  <TableHead className="hidden md:table-cell">Title</TableHead>
                  <TableHead className="hidden lg:table-cell">Type</TableHead>
                  <TableHead className="hidden sm:table-cell">From</TableHead>
                  <TableHead className="hidden xl:table-cell">Date Received</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden xl:table-cell">Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">No incoming documents found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDocs.map(doc => (
                    <TableRow key={doc.id} className={`${isOverdue(doc) ? 'bg-red-50 border-l-4 border-red-500' : ''} ${isUnacknowledged(doc) ? 'bg-blue-50 font-medium' : ''}`}>
                      <TableCell>
                        <Link to={`/documents/${doc.id}`} className="font-mono text-xs text-blue-700 hover:underline font-bold">{doc.trackingCode}</Link>
                        <p className="md:hidden text-xs text-slate-500 mt-0.5 truncate max-w-[150px]">{doc.title}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px]"><p className="truncate text-sm">{doc.title}</p></TableCell>
                      <TableCell className="hidden lg:table-cell"><Badge variant="secondary" className="text-[10px]">{doc.documentType}</Badge></TableCell>
                      <TableCell className="hidden sm:table-cell text-xs">{getOfficeName(doc.originOfficeId)}</TableCell>
                      <TableCell className="hidden xl:table-cell text-xs">{format(new Date(doc.dateReceived), 'MMM d, yyyy')}</TableCell>
                      <TableCell><PriorityBadge priority={doc.priority} /></TableCell>
                      <TableCell><DocStatusBadge status={doc.status} /></TableCell>
                      <TableCell className="hidden xl:table-cell text-xs">{doc.dueDate ? format(new Date(doc.dueDate), 'MMM d, yyyy') : '—'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Link to={`/documents/${doc.id}`}><Button variant="ghost" size="sm" className="h-7 text-xs">View</Button></Link>
                          {isUnacknowledged(doc) && (
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => {
                              const entry = doc.routingHistory.find(rh => rh.toOfficeId === user?.officeId && !rh.isAcknowledged)
                              if (entry) acknowledgeDocument(doc.id, entry.id)
                            }}><Check className="w-3 h-3 mr-1" />Ack</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t p-3">
              <p className="text-xs text-slate-500">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, incomingDocs.length)} of {incomingDocs.length}</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receive Document Dialog */}
      <Dialog open={showReceiveForm} onOpenChange={setShowReceiveForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Receive New Document</DialogTitle>
            <DialogDescription>Enter document details and initial routing information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <Label>Document Title *</Label>
                <Input value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} placeholder="Enter document title" />
              </div>
              <div className="space-y-2">
                <Label>Document Type *</Label>
                <Select value={formData.documentType} onValueChange={v => setFormData(f => ({ ...f, documentType: v as DocumentType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Letter', 'Memorandum', 'Resolution', 'Ordinance', 'Contract', 'Report', 'Request', 'Petition', 'Certificate', 'Voucher', 'Purchase Order', 'Other'].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Reference Number</Label>
                <Input value={formData.referenceNumber} onChange={e => setFormData(f => ({ ...f, referenceNumber: e.target.value }))} placeholder="e.g. LGU-2026-089" />
              </div>
              <div className="space-y-2">
                <Label>Classification *</Label>
                <Select value={formData.classification} onValueChange={v => setFormData(f => ({ ...f, classification: v as Classification }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Routine', 'Priority', 'Confidential', 'Top Secret'].map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority Level *</Label>
                <Select value={formData.priority} onValueChange={v => setFormData(f => ({ ...f, priority: v as Priority }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Low', 'Normal', 'High', 'Urgent'].map(p => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Received *</Label>
                <Input type="date" value={formData.dateReceived} onChange={e => setFormData(f => ({ ...f, dateReceived: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" value={formData.dueDate} onChange={e => setFormData(f => ({ ...f, dueDate: e.target.value }))} />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} placeholder="Enter description..." rows={3} />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input value={formData.tags} onChange={e => setFormData(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. budget, urgent, fy2026" />
              </div>
            </div>
            <div className="border-t pt-4 mt-2">
              <h4 className="font-semibold text-sm mb-3">Initial Routing</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assign to Office</Label>
                  <Select value={formData.assignToOfficeId} onValueChange={v => setFormData(f => ({ ...f, assignToOfficeId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select office..." /></SelectTrigger>
                    <SelectContent>
                      {offices.map(o => (<SelectItem key={o.id} value={o.id}>{o.code} — {o.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Action Required</Label>
                  <Select value={formData.action} onValueChange={v => setFormData(f => ({ ...f, action: v as RoutingAction }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['For Review', 'For Signature', 'For Action', 'For Information'].map(a => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Remarks / Instructions</Label>
                  <Textarea value={formData.remarks} onChange={e => setFormData(f => ({ ...f, remarks: e.target.value }))} placeholder="Instructions for receiving office..." rows={2} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReceiveForm(false)}>Cancel</Button>
            <Button onClick={handleReceive} disabled={!formData.title}><Check className="w-4 h-4 mr-2" />Receive & Route</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
