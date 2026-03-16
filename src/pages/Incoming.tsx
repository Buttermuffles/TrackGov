import React, { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuthStore, useDocumentStore, useOfficeStore, useUserStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Search, Check, FileText, ChevronLeft, ChevronRight, Eye, LayoutGrid, LayoutList } from 'lucide-react'
import { format } from 'date-fns'
import { recognize } from 'tesseract.js'
import type { Document, DocumentType, Classification } from '@/types'
import { formatFileSize } from '@/lib/utils'

type PendingAttachment = {
  id: string
  file: File
  previewUrl: string
  ocrStatus: 'idle' | 'processing' | 'done' | 'error'
  ocrText: string
  ocrError?: string
}

export default function Incoming() {
  const user = useAuthStore(s => s.currentUser)
  const { documents, addDocument, addRoutingEntry } = useDocumentStore()
  const offices = useOfficeStore(s => s.offices)
  const users = useUserStore(s => s.users)
  const currentOffice = offices.find(o => o.id === user?.officeId)
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search')?.trim() ?? '')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [view, setView] = useState<'table' | 'card'>('table')
  const [showReceiveForm, setShowReceiveForm] = useState(false)
  const [page, setPage] = useState(1)
  const [attachments, setAttachments] = useState<PendingAttachment[]>([])
  const [previewAttachment, setPreviewAttachment] = useState<PendingAttachment | null>(null)
  const perPage = 10

  useEffect(() => {
    setSearch(searchParams.get('search')?.trim() ?? '')
    if (searchParams.get('create') === '1') {
      setShowReceiveForm(true)
    }
    setPage(1)
  }, [searchParams])

  const incomingDocs = useMemo(() => {
    let docs = documents.filter(d => d.currentOfficeId === user?.officeId)
    if (search) {
      const s = search.toLowerCase()
      docs = docs.filter(d => d.trackingCode.toLowerCase().includes(s) || d.title.toLowerCase().includes(s))
    }
    if (typeFilter !== 'all') docs = docs.filter(d => d.documentType === typeFilter)
    return docs.sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime())
  }, [documents, user, search, typeFilter])

  const totalPages = Math.ceil(incomingDocs.length / perPage)
  const paginatedDocs = incomingDocs.slice((page - 1) * perPage, page * perPage)
  const getOfficeName = (id: string) => offices.find(o => o.id === id)?.code || id
  const getUserName = (id: string) => { const u = users.find(u => u.id === id); return u ? `${u.firstName} ${u.lastName}` : '—' }
  const getOriginDisplay = (d: Document) => {
    if (user?.role === 'Super Admin') return getUserName(d.originatorId)
    return getOfficeName(d.originOfficeId)
  }
  // Receive form state
  const [formData, setFormData] = useState({
    title: '', documentType: 'Letter' as DocumentType, referenceNumber: '', classification: 'Routine' as Classification,
    fromOfficeId: '', dateReceived: format(new Date(), 'yyyy-MM-dd'), description: '', tags: '',
    assignToOfficeId: '', assignToUserId: '', remarks: '',
  })

  useEffect(() => {
    return () => {
      attachments.forEach(att => URL.revokeObjectURL(att.previewUrl))
    }
  }, [attachments])

  const resetReceiveForm = () => {
    attachments.forEach(att => URL.revokeObjectURL(att.previewUrl))
    setAttachments([])
    setFormData({
      title: '',
      documentType: 'Letter',
      referenceNumber: '',
      classification: 'Routine',
      fromOfficeId: '',
      dateReceived: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      tags: '',
      assignToOfficeId: '',
      assignToUserId: '',
      remarks: '',
    })
  }

  const onSelectAttachments = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    if (!selected.length) return

    setAttachments(prev => {
      const existingKeys = new Set(prev.map(att => `${att.file.name}-${att.file.size}-${att.file.lastModified}`))
      const next = [...prev]

      selected.forEach(file => {
        const key = `${file.name}-${file.size}-${file.lastModified}`
        if (existingKeys.has(key)) return
        next.push({
          id: `pending-att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          ocrStatus: 'idle',
          ocrText: '',
        })
      })

      return next
    })

    e.target.value = ''
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => {
      const target = prev.find(att => att.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      if (previewAttachment?.id === id) setPreviewAttachment(null)
      return prev.filter(att => att.id !== id)
    })
  }

  const canPreviewAttachment = (att: PendingAttachment) => {
    return att.file.type.startsWith('image/') || att.file.type === 'application/pdf' || att.file.type.startsWith('text/')
  }

  const runOcr = async (id: string) => {
    const target = attachments.find(att => att.id === id)
    if (!target || !target.file.type.startsWith('image/')) return

    setAttachments(prev => prev.map(att =>
      att.id === id ? { ...att, ocrStatus: 'processing', ocrError: undefined } : att
    ))

    try {
      const { data } = await recognize(target.file, 'eng')
      const text = (data.text ?? '').trim()
      setAttachments(prev => prev.map(att =>
        att.id === id ? { ...att, ocrStatus: 'done', ocrText: text } : att
      ))
    } catch {
      setAttachments(prev => prev.map(att =>
        att.id === id ? { ...att, ocrStatus: 'error', ocrError: 'OCR failed. Please try again.' } : att
      ))
    }
  }

  const runOcrForAllImages = async () => {
    const imageAttachments = attachments.filter(att => att.file.type.startsWith('image/'))
    for (const att of imageAttachments) {
      if (att.ocrStatus === 'done') continue
      await runOcr(att.id)
    }
  }

  const handleReceive = () => {
    if (!formData.title || !user) return
    const ocrSummary = attachments
      .filter(att => att.ocrText.trim())
      .map(att => `[${att.file.name}]\n${att.ocrText.trim()}`)
      .join('\n\n')

    const newDoc = addDocument({
      title: formData.title,
      description: formData.description || ocrSummary,
      documentType: formData.documentType,
      classification: formData.classification,
      priority: 'Normal',
      originatorId: user.id, originOfficeId: user.officeId, currentOfficeId: formData.assignToOfficeId || user.officeId,
      currentAssigneeId: formData.assignToUserId || undefined, status: 'Received',
      attachments: attachments.map((att, idx) => ({
        id: `att-${Date.now()}-${idx}`,
        filename: att.file.name,
        fileSize: att.file.size,
        fileType: att.file.type || 'application/octet-stream',
        url: att.previewUrl,
        uploadedBy: user.id,
        uploadedAt: new Date(),
      })),
      routingHistory: [], remarks: [],
      dateReceived: new Date(formData.dateReceived), tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      referenceNumber: formData.referenceNumber || undefined, isConfidential: formData.classification === 'Confidential' || formData.classification === 'Top Secret',
    })

    if (formData.assignToOfficeId && formData.assignToOfficeId !== user.officeId) {
      addRoutingEntry(newDoc.id, {
        documentId: newDoc.id, fromOfficeId: user.officeId, toOfficeId: formData.assignToOfficeId,
        fromUserId: user.id, toUserId: formData.assignToUserId || undefined,
        action: 'For Review', remarks: formData.remarks, timestamp: new Date(), isAcknowledged: false,
      })
    }

    setShowReceiveForm(false)
    resetReceiveForm()
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">Incoming Documents</h1>
          <p className="text-sm text-slate-500 mt-1">
            Documents routed to your office{currentOffice ? ` — ${currentOffice.code} / ${currentOffice.name}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowReceiveForm(true)}><Plus className="w-4 h-4 mr-2" />Receive New Document</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by tracking code or title..."
            className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md bg-purple-50 ring-1 ring-purple-200 overflow-hidden">
            <button
              type="button"
              className={"p-2 " + (view === 'table' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:bg-slate-100')}
              onClick={() => setView('table')}
              aria-label="Table view"
              title="Table view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              className={"p-2 " + (view === 'card' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:bg-slate-100')}
              onClick={() => setView('card')}
              aria-label="Card view"
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
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
      </div>

      {/* Documents list */}
      {view === 'table' ? (
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
                    <TableHead>Origin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDocs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">No incoming documents found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedDocs.map(doc => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <Link to={`/documents/${doc.id}`} className="font-mono text-xs text-sky-700 hover:underline font-bold">{doc.trackingCode}</Link>
                          <p className="md:hidden text-xs text-slate-500 mt-0.5 truncate max-w-37.5">{doc.title}</p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-50"><p className="truncate text-sm">{doc.title}</p></TableCell>
                        <TableCell className="hidden lg:table-cell"><Badge variant="purple" className="text-[10px]">{doc.documentType}</Badge></TableCell>
                        <TableCell className="hidden sm:table-cell text-xs">{getOfficeName(doc.originOfficeId)}</TableCell>
                        <TableCell className="hidden xl:table-cell text-xs">{format(new Date(doc.dateReceived), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-xs">{getOriginDisplay(doc)}</TableCell>
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
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {paginatedDocs.map(doc => (
              <Link key={doc.id} to={`/documents/${doc.id}`} className="block">
                <Card className="h-full hover:shadow-md transition">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <p className="font-mono text-xs text-sky-700 font-semibold">{doc.trackingCode}</p>
                      <Badge variant="purple" className="text-[10px]">{doc.documentType}</Badge>
                    </div>
                    <h3 className="text-sm font-semibold line-clamp-2">{doc.title}</h3>
                    <p className="text-xs text-slate-500">From: {getOriginDisplay(doc)}</p>
                    <p className="text-xs text-slate-500">Received: {format(new Date(doc.dateReceived), 'MMM d, yyyy')}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {paginatedDocs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No incoming documents found</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t p-3">
              <p className="text-xs text-slate-500">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, incomingDocs.length)} of {incomingDocs.length}</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </>
      )}

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
                <Label>Document Title <span className="text-red-500">*</span></Label>
                <Input value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} placeholder="Enter document title" />
              </div>
              <div className="space-y-2">
                <Label>Document Type <span className="text-red-500">*</span></Label>
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
                <Label>Classification <span className="text-red-500">*</span></Label>
                <Select value={formData.classification} onValueChange={v => setFormData(f => ({ ...f, classification: v as Classification }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Routine', 'Priority', 'Confidential', 'Top Secret'].map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Received <span className="text-red-500">*</span></Label>
                <Input type="date" value={formData.dateReceived} onChange={e => setFormData(f => ({ ...f, dateReceived: e.target.value }))} />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} placeholder="Enter description..." rows={3} />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input value={formData.tags} onChange={e => setFormData(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. budget, urgent, fy2026" />
              </div>

              <div className="sm:col-span-2 space-y-3 border rounded-lg p-3 bg-slate-50/80">
                <div className="flex items-center justify-between gap-2">
                  <Label>Attachments (multiple files)</Label>
                  <Button type="button" size="sm" variant="accent" onClick={runOcrForAllImages} disabled={!attachments.some(att => att.file.type.startsWith('image/'))}>
                    Scan OCR for Images
                  </Button>
                </div>
                <Input
                  type="file"
                  multiple
                  onChange={onSelectAttachments}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                />
                <p className="text-[11px] text-slate-500">Supports image, PDF, Word, spreadsheet, and text files. OCR scanning is currently available for images.</p>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map(att => (
                      <div key={att.id} className="rounded-md border bg-white p-2.5 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">{att.file.name}</p>
                            <p className="text-[11px] text-slate-500">{formatFileSize(att.file.size)} · {att.file.type || 'Unknown type'}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="accent"
                              className="h-7 text-[11px]"
                              onClick={() => setPreviewAttachment(att)}
                              disabled={!canPreviewAttachment(att)}
                            >
                              <Eye className="w-3 h-3 mr-1" />Preview
                            </Button>
                            {att.file.type.startsWith('image/') && (
                              <Button
                                type="button"
                                size="sm"
                                variant={att.ocrStatus === 'done' ? 'success' : 'gold'}
                                className="h-7 text-[11px]"
                                onClick={() => runOcr(att.id)}
                                disabled={att.ocrStatus === 'processing'}
                              >
                                {att.ocrStatus === 'processing' ? 'Scanning...' : att.ocrStatus === 'done' ? 'OCR Done' : 'Run OCR'}
                              </Button>
                            )}
                            <Button type="button" size="sm" variant="destructive" className="h-7 text-[11px]" onClick={() => removeAttachment(att.id)}>Remove</Button>
                          </div>
                        </div>

                        {att.ocrStatus === 'done' && att.ocrText && (
                          <Textarea readOnly value={att.ocrText.slice(0, 1000)} rows={4} className="text-xs" />
                        )}
                        {att.ocrStatus === 'done' && !att.ocrText && <p className="text-[11px] text-amber-600">No readable text found from OCR.</p>}
                        {att.ocrStatus === 'error' && <p className="text-[11px] text-red-600">{att.ocrError}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="border-t pt-4 mt-2">
              <h4 className="font-semibold text-sm mb-3">Initial Routing</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assign to Office</Label>
                  <Select value={formData.assignToOfficeId} onValueChange={v => setFormData(f => ({ ...f, assignToOfficeId: v, assignToUserId: '' }))}>
                    <SelectTrigger><SelectValue placeholder="Select office..." /></SelectTrigger>
                    <SelectContent>
                      {offices.map(o => (<SelectItem key={o.id} value={o.id}>{o.code} — {o.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.assignToOfficeId && (
                  <div className="space-y-2">
                    <Label>Assign to Person (optional)</Label>
                    <Select value={formData.assignToUserId || "none"} onValueChange={v => setFormData(f => ({ ...f, assignToUserId: v === "none" ? "" : v }))}>
                      <SelectTrigger><SelectValue placeholder="Auto-assign to office..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
                        {users
                          .filter(u => u.officeId === formData.assignToOfficeId && u.isActive)
                          .map(u => <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.position}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="sm:col-span-2 space-y-2">
                  <Label>Remarks / Instructions</Label>
                  <Textarea value={formData.remarks} onChange={e => setFormData(f => ({ ...f, remarks: e.target.value }))} placeholder="Instructions for receiving office..." rows={2} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowReceiveForm(false); resetReceiveForm() }}>Cancel</Button>
            <Button onClick={handleReceive} disabled={!formData.title}><Check className="w-4 h-4 mr-2" />Receive & Route</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewAttachment} onOpenChange={open => { if (!open) setPreviewAttachment(null) }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Attachment Preview</DialogTitle>
            <DialogDescription>{previewAttachment?.file.name}</DialogDescription>
          </DialogHeader>

          {previewAttachment && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">{formatFileSize(previewAttachment.file.size)} · {previewAttachment.file.type || 'Unknown type'}</p>
              {previewAttachment.file.type.startsWith('image/') && (
                <div className="rounded-lg border bg-slate-50 p-2">
                  <img src={previewAttachment.previewUrl} alt={previewAttachment.file.name} className="max-h-[60vh] w-full object-contain rounded" />
                </div>
              )}
              {previewAttachment.file.type === 'application/pdf' && (
                <iframe src={previewAttachment.previewUrl} title={previewAttachment.file.name} className="h-[60vh] w-full rounded border" />
              )}
              {previewAttachment.file.type.startsWith('text/') && (
                <iframe src={previewAttachment.previewUrl} title={previewAttachment.file.name} className="h-[50vh] w-full rounded border bg-white" />
              )}
              {!canPreviewAttachment(previewAttachment) && (
                <div className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-600">
                  Preview is not available for this file type. You can still keep it attached.
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {previewAttachment && (
              <Button asChild variant="outline">
                <a href={previewAttachment.previewUrl} target="_blank" rel="noreferrer">Open in New Tab</a>
              </Button>
            )}
            <Button onClick={() => setPreviewAttachment(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
