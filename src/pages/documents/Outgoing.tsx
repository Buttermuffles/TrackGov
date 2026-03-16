import React, { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore, useDocumentStore, useOfficeStore, useUserStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import DeleteConfirmDialog from '@/components/shared/DeleteConfirmDialog'
import RoutingHistoryDialog from '@/components/shared/RoutingHistoryDialog'
import PaginationControls from '@/components/shared/PaginationControls'
import ReceiveDocumentDialogs, { type PendingAttachment, type ReceiveFormData } from '@/components/documents/ReceiveDocumentDialogs'
import { usePermission } from '@/hooks/usePermission'
import { format } from 'date-fns'
import { recognize } from 'tesseract.js'
import { toast } from 'sonner'
import { Search, Send, Clock, Pencil, Trash2, Plus, Filter, X, LayoutGrid, LayoutList, Eye } from 'lucide-react'
import type { Classification, Document, DocumentType } from '@/types'

export default function Outgoing() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.currentUser)
  const { documents, addDocument, addRoutingEntry, updateDocument, deleteDocument } = useDocumentStore()
  const offices = useOfficeStore(s => s.offices)
  const users = useUserStore(s => s.users)

  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search')?.trim() ?? '')
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') ?? 'all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [toOfficeFilter, setToOfficeFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState('newest')
  const [view, setView] = useState<'table' | 'card'>('table')
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [pageSize, setPageSize] = useState(15)
  const [page, setPage] = useState(() => {
    const parsed = Number(searchParams.get('page') ?? '1')
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
  })
  const [attachments, setAttachments] = useState<PendingAttachment[]>([])
  const [previewAttachment, setPreviewAttachment] = useState<PendingAttachment | null>(null)
  const [formData, setFormData] = useState<ReceiveFormData>({
    title: '', documentType: 'Letter' as DocumentType, referenceNumber: '', classification: 'Routine' as Classification,
    fromOfficeId: '', dateReceived: format(new Date(), 'yyyy-MM-dd'), description: '', tags: '',
    assignToOfficeId: '', assignToUserId: '', remarks: '',
  })

  useEffect(() => {
    const nextSearch = searchParams.get('search')?.trim() ?? ''
    const nextStatus = searchParams.get('status') ?? 'all'
    const parsedPage = Number(searchParams.get('page') ?? '1')
    const nextPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1

    setSearch(nextSearch)
    setStatusFilter(['all', 'acknowledged', 'pending'].includes(nextStatus) ? nextStatus : 'all')
    setPage(nextPage)
  }, [searchParams])

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
    if (typeFilter !== 'all') results = results.filter(d => d.documentType === typeFilter)
    if (toOfficeFilter !== 'all') results = results.filter(d => d.routingHistory[d.routingHistory.length - 1]?.toOfficeId === toOfficeFilter)
    return results.sort((a, b) => {
      const aTime = new Date(a.routingHistory[a.routingHistory.length - 1]?.timestamp ?? a.updatedAt).getTime()
      const bTime = new Date(b.routingHistory[b.routingHistory.length - 1]?.timestamp ?? b.updatedAt).getTime()
      if (sortBy === 'oldest') return aTime - bTime
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      return bTime - aTime
    })
  }, [outgoingDocs, search, statusFilter, typeFilter, toOfficeFilter, sortBy])

  const docsToShow = filtered
  const totalPages = Math.max(1, Math.ceil(docsToShow.length / pageSize))
  const paged = docsToShow.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    const normalizedSearch = search.trim()

    if (normalizedSearch) params.set('search', normalizedSearch)
    else params.delete('search')

    if (statusFilter !== 'all') params.set('status', statusFilter)
    else params.delete('status')

    if (page > 1) params.set('page', String(page))
    else params.delete('page')

    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true })
    }
  }, [search, statusFilter, page, searchParams, setSearchParams])

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(docsToShow.length / pageSize))
    if (page > maxPage) setPage(maxPage)
  }, [docsToShow.length, page, pageSize])

  useEffect(() => {
    setPage(1)
  }, [pageSize])

  useEffect(() => {
    return () => { attachments.forEach(att => URL.revokeObjectURL(att.previewUrl)) }
  }, [attachments])

  const getOfficeName = (oid: string) => offices.find(o => o.id === oid)?.code || oid
  const getUserName = (uid: string) => { const u = users.find(u => u.id === uid); return u ? `${u.firstName} ${u.lastName}` : '' }
  const getOriginatorName = (originatorId: string, originOfficeId: string) => {
    const o = users.find(u => u.id === originatorId)
    if (o) return `${o.firstName} ${o.lastName}`
    return getOfficeName(originOfficeId)
  }
  const getOriginDisplay = (originatorId: string, originOfficeId: string) => {
    const value = user?.role === 'Super Admin' ? getOriginatorName(originatorId, originOfficeId) : getOfficeName(originOfficeId)
    return value.toUpperCase()
  }
  const getProgress = (doc: Document) => {
    const path = [doc.originOfficeId, ...doc.routingHistory.map((rh: any) => rh.toOfficeId)]
    return path.map(id => getOfficeName(id)).join(' → ')
  }
  const [historyDoc, setHistoryDoc] = useState<Document | null>(null)
  const [editingDoc, setEditingDoc] = useState<Document | null>(null)
  const [deletingDoc, setDeletingDoc] = useState<Document | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editType, setEditType] = useState<DocumentType>('Letter')

  const ackCount = outgoingDocs.filter(d => d.routingHistory[d.routingHistory.length - 1]?.isAcknowledged).length
  const pendCount = outgoingDocs.length - ackCount
  const activeCount = [statusFilter, typeFilter, toOfficeFilter].filter(v => v !== 'all').length
  const { can } = usePermission()
  const canCreateDocuments = can('documents_outgoing', 'create')
  const canEditDocuments = can('documents_outgoing', 'update')
  const canDeleteDocuments = can('documents_outgoing', 'delete')
  const DOC_TYPES: DocumentType[] = ['Letter','Memorandum','Resolution','Ordinance','Contract','Report','Request','Petition','Certificate','Voucher','Purchase Order','Other']
  const typeBadgeClasses: Record<DocumentType, string> = {
    Letter: 'bg-blue-200 text-blue-900 border-blue-200 dark:bg-blue-600 dark:text-white dark:border-blue-600',
    Memorandum: 'bg-slate-200 text-slate-900 border-slate-200 dark:bg-slate-600 dark:text-white dark:border-slate-600',
    Resolution: 'bg-emerald-200 text-emerald-900 border-emerald-200 dark:bg-emerald-600 dark:text-white dark:border-emerald-600',
    Ordinance: 'bg-amber-200 text-amber-900 border-amber-200 dark:bg-amber-600 dark:text-white dark:border-amber-600',
    Contract: 'bg-violet-200 text-violet-900 border-violet-200 dark:bg-violet-600 dark:text-white dark:border-violet-600',
    Report: 'bg-amber-200 text-amber-900 border-amber-200 dark:bg-amber-600 dark:text-white dark:border-amber-600',
    Request: 'bg-blue-200 text-blue-900 border-blue-200 dark:bg-blue-600 dark:text-white dark:border-blue-600',
    Petition: 'bg-rose-200 text-rose-900 border-rose-200 dark:bg-rose-600 dark:text-white dark:border-rose-600',
    Certificate: 'bg-emerald-200 text-emerald-900 border-emerald-200 dark:bg-emerald-600 dark:text-white dark:border-emerald-600',
    Voucher: 'bg-amber-200 text-amber-900 border-amber-200 dark:bg-amber-600 dark:text-white dark:border-amber-600',
    'Purchase Order': 'bg-amber-200 text-amber-900 border-amber-200 dark:bg-amber-600 dark:text-white dark:border-amber-600',
    Other: 'bg-slate-200 text-slate-900 border-slate-200 dark:bg-slate-600 dark:text-white dark:border-slate-600',
  }

  const startEdit = (doc: Document) => {
    setEditingDoc(doc)
    setEditTitle(doc.title)
    setEditType(doc.documentType)
  }

  const handleSaveEdit = () => {
    if (!editingDoc || !editTitle.trim()) return
    try {
      updateDocument(editingDoc.id, { title: editTitle.trim(), documentType: editType })
      setEditingDoc(null)
      toast.success('Item updated successfully.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  const handleDelete = () => {
    if (!deletingDoc) return
    try {
      deleteDocument(deletingDoc.id)
      setDeletingDoc(null)
      toast.success('Item deleted successfully.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  const resetCreateForm = () => {
    attachments.forEach(att => URL.revokeObjectURL(att.previewUrl))
    setAttachments([])
    setPreviewAttachment(null)
    setFormData({
      title: '', documentType: 'Letter', referenceNumber: '', classification: 'Routine',
      fromOfficeId: '', dateReceived: format(new Date(), 'yyyy-MM-dd'), description: '', tags: '',
      assignToOfficeId: '', assignToUserId: '', remarks: '',
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

  const canPreviewAttachment = (att: PendingAttachment) =>
    att.file.type.startsWith('image/') || att.file.type === 'application/pdf' || att.file.type.startsWith('text/')

  const runOcr = async (id: string) => {
    const target = attachments.find(att => att.id === id)
    if (!target || !target.file.type.startsWith('image/')) return
    setAttachments(prev => prev.map(att => att.id === id ? { ...att, ocrStatus: 'processing', ocrError: undefined } : att))
    try {
      const { data } = await recognize(target.file, 'eng')
      const text = (data.text ?? '').trim()
      setAttachments(prev => prev.map(att => att.id === id ? { ...att, ocrStatus: 'done', ocrText: text } : att))
    } catch {
      setAttachments(prev => prev.map(att => att.id === id ? { ...att, ocrStatus: 'error', ocrError: 'OCR failed. Please try again.' } : att))
    }
  }

  const runOcrForAllImages = async () => {
    for (const att of attachments.filter(a => a.file.type.startsWith('image/'))) {
      if (att.ocrStatus === 'done') continue
      await runOcr(att.id)
    }
  }

  const handleCreateDocument = () => {
    if (!formData.title || !user) return
    try {
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
        originatorId: user.id,
        originOfficeId: user.officeId,
        currentOfficeId: formData.assignToOfficeId || user.officeId,
        currentAssigneeId: formData.assignToUserId || undefined,
        status: 'Received',
        attachments: attachments.map((att, idx) => ({
          id: `att-${Date.now()}-${idx}`,
          filename: att.file.name,
          fileSize: att.file.size,
          fileType: att.file.type || 'application/octet-stream',
          url: att.previewUrl,
          uploadedBy: user.id,
          uploadedAt: new Date(),
        })),
        routingHistory: [],
        remarks: [],
        dateReceived: new Date(formData.dateReceived),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        referenceNumber: formData.referenceNumber || undefined,
        isConfidential: formData.classification === 'Confidential' || formData.classification === 'Top Secret',
      })

      if (formData.assignToOfficeId && formData.assignToOfficeId !== user.officeId) {
        addRoutingEntry(newDoc.id, {
          documentId: newDoc.id,
          fromOfficeId: user.officeId,
          toOfficeId: formData.assignToOfficeId,
          fromUserId: user.id,
          toUserId: formData.assignToUserId || undefined,
          action: 'For Review',
          remarks: formData.remarks,
          timestamp: new Date(),
          isAcknowledged: false,
        })
      }

      setShowCreateForm(false)
      resetCreateForm()
      toast.success('Item created successfully.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
            <Send className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight leading-tight">Outgoing Documents</h1>
            <p className="text-sm text-slate-500 mt-0.5">Documents forwarded or routed from your office</p>
          </div>
        </div>
        {canCreateDocuments && (
          <Button onClick={() => setShowCreateForm(true)} className="self-start sm:self-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 gap-1.5">
            <Plus className="w-4 h-4" />Create Document
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          {filtered.length} of {outgoingDocs.length} document{outgoingDocs.length !== 1 ? 's' : ''}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
          Acknowledged: {ackCount}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
          Awaiting: {pendCount}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search outgoing by tracking code or title..."
            className="pl-9 h-9 text-sm border-slate-200 bg-white"
          />
        </div>

        <Button variant={showFilters ? 'default' : 'outline'} size="sm" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="w-4 h-4 mr-1" />Filters
          {activeCount > 0 && <Badge className="ml-1 text-[10px]" variant="secondary">{activeCount}</Badge>}
        </Button>

        <div className="flex border rounded-md overflow-hidden">
          <button
            type="button"
            aria-label="Table view"
            title="Table view"
            className={`p-2 ${view === 'table' ? 'bg-blue-50 text-blue-700' : 'text-slate-400'}`}
            onClick={() => setView('table')}
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Card view"
            title="Card view"
            className={`p-2 ${view === 'card' ? 'bg-blue-50 text-blue-700' : 'text-slate-400'}`}
            onClick={() => setView('card')}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        <Select value={sortBy} onValueChange={v => { setSortBy(v); setPage(1) }}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="p-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1) }}>
                <SelectTrigger className="text-xs h-9"><SelectValue placeholder="Acknowledgment" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="pending">Pending Receipt</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setPage(1) }}>
                <SelectTrigger className="text-xs h-9"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={toOfficeFilter} onValueChange={v => { setToOfficeFilter(v); setPage(1) }}>
                <SelectTrigger className="text-xs h-9"><SelectValue placeholder="Sent To Office" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offices</SelectItem>
                  {offices.map(o => <SelectItem key={o.id} value={o.id}>{o.code}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => {
                  setStatusFilter('all')
                  setTypeFilter('all')
                  setToOfficeFilter('all')
                  setPage(1)
                }}
              >
                <X className="w-3 h-3 mr-1" />Clear
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {view === 'table' ? (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 pl-4">Tracking #</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3">Title</TableHead>
                    <TableHead className="hidden lg:table-cell text-xs font-semibold text-slate-500 uppercase tracking-wide py-3">Type</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3">Progress</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3">Sent To</TableHead>
                    <TableHead className="hidden xl:table-cell text-xs font-semibold text-slate-500 uppercase tracking-wide py-3">Date Sent</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3">Origin</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 pr-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-16">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <Send className="w-5 h-5 text-slate-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-600">No outgoing documents found</p>
                          <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paged.map((doc, i) => {
                      const lastRoute = doc.routingHistory[doc.routingHistory.length - 1]!
                      return (
                        <TableRow key={doc.id} className={`group border-b border-slate-100 hover:bg-indigo-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                          <TableCell className="pl-4 py-3">
                            <Link to={`/documents/${doc.id}`} className="font-mono text-xs text-blue-700 font-semibold underline-offset-2">
                              {doc.trackingCode}
                            </Link>
                          </TableCell>
                          <TableCell className="py-3 max-w-64"><span className="line-clamp-1 text-sm text-slate-800">{doc.title}</span></TableCell>
                          <TableCell className="hidden lg:table-cell py-3 text-center">
                            <Badge variant="outline" className={`mx-auto text-[10px] font-medium ${typeBadgeClasses[doc.documentType] ?? 'bg-slate-50 text-slate-700 border-slate-100'}`}>
                              {doc.documentType}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 max-w-52"><button className="text-xs text-slate-600 hover:underline" onClick={() => setHistoryDoc(doc)}>{getProgress(doc)}</button></TableCell>
                          <TableCell className="py-3 text-xs text-slate-700">{getOfficeName(lastRoute.toOfficeId)}{lastRoute.toUserId && <span className="block text-slate-500">{getUserName(lastRoute.toUserId)}</span>}</TableCell>
                          <TableCell className="hidden xl:table-cell py-3 text-xs text-slate-500">{format(new Date(lastRoute.timestamp), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="py-3 text-xs font-semibold text-slate-700">{getOriginDisplay(doc.originatorId, doc.originOfficeId)}</TableCell>
                          <TableCell className="py-3 pr-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button size="sm" className="h-7 px-2.5 text-[11px] font-medium bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={() => navigate(`/documents/${doc.id}`)}>
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" className="h-7 px-2.5 text-[11px] font-medium bg-orange-600 hover:bg-orange-700 text-white border-0" onClick={() => setHistoryDoc(doc)}>
                                <Clock className="w-3 h-3" />
                              </Button>
                              {canEditDocuments && (
                                  <Button size="sm" className="h-7 px-2.5 text-[11px] font-medium bg-cyan-600 hover:bg-cyan-700 text-white border-0" onClick={() => startEdit(doc)}>
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                              )}
                              {canDeleteDocuments && (
                                  <Button size="sm" className="h-7 px-2.5 text-[11px] font-medium bg-red-600 hover:bg-red-700 text-white border-0" onClick={() => setDeletingDoc(doc)}>
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

          </CardContent>
        </Card>
      ) : (
        <>
          {paged.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Send className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">No outgoing documents found</p>
              <p className="text-xs text-slate-400">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {paged.map(doc => {
                const lastRoute = doc.routingHistory[doc.routingHistory.length - 1]!
                return (
                  <Card key={doc.id} className="group h-full border-slate-200 bg-linear-to-b from-white to-slate-50/40 shadow-sm hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{doc.trackingCode}</span>
                        <Badge variant="outline" className={`text-[10px] shrink-0 ${typeBadgeClasses[doc.documentType] ?? 'bg-slate-50 text-slate-700 border-slate-100'}`}>{doc.documentType}</Badge>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">{doc.title}</h3>
                      <div className="space-y-1">
                        <p className="text-[11px] text-slate-500 flex items-center gap-1"><span className="font-medium text-slate-600">Progress:</span> {getProgress(doc)}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1"><span className="font-semibold text-slate-700">From:</span> {getOriginDisplay(doc.originatorId, doc.originOfficeId)}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1"><span className="font-medium text-slate-600">Sent:</span> {format(new Date(lastRoute.timestamp), 'MMM d, yyyy')}</p>
                      </div>
                      <div className="pt-1 border-t border-slate-100 flex items-center gap-1.5">
                        <Button size="sm" variant="outline" className="flex-1 h-7 text-[11px] font-medium border-slate-200 text-slate-600 hover:text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50" onClick={() => navigate(`/documents/${doc.id}`)}>
                          <Eye className="w-3 h-3 mr-1" />View
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => setHistoryDoc(doc)}><Clock className="w-3 h-3" /></Button>
                        {canEditDocuments && (
                            <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => startEdit(doc)}><Pencil className="w-3 h-3" /></Button>
                        )}
                        {canDeleteDocuments && (
                            <Button size="sm" variant="destructive" className="h-7 text-[11px]" onClick={() => setDeletingDoc(doc)}><Trash2 className="w-3 h-3" /></Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

        </>
      )}

      {filtered.length > 0 && (
        <PaginationControls
          totalItems={filtered.length}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="documents"
          compact={view === 'card'}
        />
      )}

      <RoutingHistoryDialog
        open={!!historyDoc}
        document={historyDoc}
        onOpenChange={open => { if (!open) setHistoryDoc(null) }}
        getOfficeName={getOfficeName}
        getUserName={getUserName}
      />

      <Dialog open={!!editingDoc} onOpenChange={open => { if (!open) setEditingDoc(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>Update title and type.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={editType} onValueChange={v => setEditType(v as DocumentType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDoc(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={!editTitle.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deletingDoc}
        itemLabel={deletingDoc?.trackingCode}
        onOpenChange={open => { if (!open) setDeletingDoc(null) }}
        onConfirm={handleDelete}
      />

      <ReceiveDocumentDialogs
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        formData={formData}
        setFormData={setFormData}
        docTypes={DOC_TYPES}
        offices={offices}
        users={users}
        attachments={attachments}
        previewAttachment={previewAttachment}
        setPreviewAttachment={setPreviewAttachment}
        onSelectAttachments={onSelectAttachments}
        canPreviewAttachment={canPreviewAttachment}
        runOcrForAllImages={runOcrForAllImages}
        runOcr={runOcr}
        removeAttachment={removeAttachment}
        onCancel={() => { setShowCreateForm(false); resetCreateForm() }}
        onSubmit={handleCreateDocument}
        canSubmit={!!formData.title}
      />
    </div>
  )
}
