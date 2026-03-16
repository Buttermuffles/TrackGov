import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuthStore, useDocumentStore, useOfficeStore, useUserStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { DocStatusBadge, PriorityBadge, ClassificationBadge } from '@/components/documents/DocStatusBadge'
import { format, differenceInDays } from 'date-fns'
import { formatFileSize } from '@/lib/utils'
import type { RoutingAction } from '@/types'
import { toast } from 'sonner'
import {
  ArrowLeft, ArrowRight, Send, MessageSquare, Upload, Printer,
  QrCode, CheckCircle, Pause, RotateCcw, MoreHorizontal,
  FileText, Clock, MapPin, Paperclip, ChevronDown,
  Download, Lock, Eye
} from 'lucide-react'
import { usePermission } from '@/hooks/usePermission'

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore(s => s.currentUser)
  const { can } = usePermission()
  const canRoute = can('routing_forward', 'create')
  const canUpdateDoc = can('documents_all', 'update')
  const { documents, updateDocument, addRoutingEntry, addRemark } = useDocumentStore()
  const offices = useOfficeStore(s => s.offices)
  const users = useUserStore(s => s.users)

  const doc = documents.find(d => d.id === id)
  const canViewAllDocuments = user?.role === 'Super Admin'
  const hasOfficeAccess = !!doc && !!user && (
    canViewAllDocuments ||
    doc.originOfficeId === user.officeId ||
    doc.currentOfficeId === user.officeId ||
    doc.routingHistory.some(entry => entry.fromOfficeId === user.officeId || entry.toOfficeId === user.officeId)
  )
  const [showForwardDialog, setShowForwardDialog] = useState(false)
  const [showRemarkDialog, setShowRemarkDialog] = useState(false)
  const [remarkText, setRemarkText] = useState('')
  const [remarkInternal, setRemarkInternal] = useState(false)
  const [fwdOffice, setFwdOffice] = useState('')
  const [fwdUser, setFwdUser] = useState('')
  const [fwdAction, setFwdAction] = useState<RoutingAction>('Forwarded')
  const [fwdRemarks, setFwdRemarks] = useState('')

  if (!doc) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Document Not Found</h2>
          <p className="text-sm text-slate-500 mb-4">The requested document could not be found.</p>
          <Button onClick={() => navigate('/documents')}>← Back to Documents</Button>
        </div>
      </div>
    )
  }

  if (!hasOfficeAccess) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Lock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-500 mb-4">You can only view documents from your office or department.</p>
          <Button onClick={() => navigate('/documents')}>← Back to Documents</Button>
        </div>
      </div>
    )
  }

  const getOfficeName = (oid: string) => offices.find(o => o.id === oid)?.name || oid
  const getOfficeCode = (oid: string) => offices.find(o => o.id === oid)?.code || oid
  const getUserName = (uid: string) => { const u = users.find(u => u.id === uid); return u ? `${u.firstName} ${u.lastName}` : uid }
  const daysLeft = doc.dueDate ? differenceInDays(new Date(doc.dueDate), new Date()) : null

  const getRoutingActionMeta = (action: RoutingAction) => {
    switch (action) {
      case 'Forwarded':
      case 'Endorsed':
        return {
          icon: Send,
          iconWrapClass: 'bg-blue-100 text-blue-700',
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        }
      case 'For Review':
      case 'For Information':
      case 'Noted':
      case 'Filed':
        return {
          icon: Eye,
          iconWrapClass: 'bg-slate-100 text-slate-700',
          badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
        }
      case 'For Signature':
      case 'For Action':
        return {
          icon: Clock,
          iconWrapClass: 'bg-amber-100 text-amber-700',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        }
      case 'Approved':
        return {
          icon: CheckCircle,
          iconWrapClass: 'bg-emerald-100 text-emerald-700',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        }
      case 'Returned':
        return {
          icon: RotateCcw,
          iconWrapClass: 'bg-rose-100 text-rose-700',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        }
      case 'Disapproved':
        return {
          icon: Pause,
          iconWrapClass: 'bg-red-100 text-red-700',
          badgeClass: 'bg-red-50 text-red-700 border-red-200',
        }
      default:
        return {
          icon: FileText,
          iconWrapClass: 'bg-slate-100 text-slate-700',
          badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
        }
    }
  }

  const handleForward = () => {
    if (!fwdOffice || !user) return
    addRoutingEntry(doc.id, {
      documentId: doc.id, fromOfficeId: user.officeId, toOfficeId: fwdOffice,
      fromUserId: user.id, toUserId: fwdUser || undefined,
      action: fwdAction, remarks: fwdRemarks, timestamp: new Date(), isAcknowledged: false,
    })
    setShowForwardDialog(false)
    setFwdOffice(''); setFwdUser(''); setFwdAction('Forwarded'); setFwdRemarks('')
    toast.success('Document Routed', { description: `${doc.trackingCode} has been ${fwdAction.toLowerCase()}` })
  }

  const handleAddRemark = () => {
    if (!remarkText || !user) return
    addRemark(doc.id, { documentId: doc.id, userId: user.id, content: remarkText, isInternal: remarkInternal, createdAt: new Date() })
    setShowRemarkDialog(false)
    setRemarkText(''); setRemarkInternal(false)
    toast.success('Remark Added')
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-1" />Back
      </Button>

      {/* Document Header Card */}
      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <PriorityBadge priority={doc.priority} />
            <DocStatusBadge status={doc.status} />
            <ClassificationBadge classification={doc.classification} />
            {doc.isConfidential && <Badge variant="danger"><Lock className="w-3 h-3 mr-1" />Confidential</Badge>}
          </div>
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-lg text-blue-700 font-bold">{doc.trackingCode}</p>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight mt-1">{doc.title}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-slate-600">
                <span>Type: <b>{doc.documentType}</b></span>
                {doc.referenceNumber && <span>Ref#: <b>{doc.referenceNumber}</b></span>}
                <span>Received: <b>{format(new Date(doc.dateReceived), 'MMM d, yyyy')}</b></span>
                {doc.dueDate && (
                  <span>Due: <b className={daysLeft !== null && daysLeft < 0 ? 'text-red-600' : daysLeft !== null && daysLeft <= 3 ? 'text-amber-600' : ''}>
                    {format(new Date(doc.dueDate), 'MMM d, yyyy')} ({daysLeft !== null && daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`})
                  </b></span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />Currently at: <b>{getOfficeName(doc.currentOfficeId)}</b>
                {doc.currentAssigneeId && <> → <b>{getUserName(doc.currentAssigneeId)}</b></>}
              </p>
            </div>
            <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border">
              <QrCode className="w-12 h-12 text-slate-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {canRoute && <Button onClick={() => setShowForwardDialog(true)}><Send className="w-4 h-4 mr-2" />Forward/Route</Button>}
        {canUpdateDoc && <Button variant="outline" onClick={() => setShowRemarkDialog(true)}><MessageSquare className="w-4 h-4 mr-2" />Add Remark</Button>}
        <Button variant="outline"><Printer className="w-4 h-4 mr-2" />Print</Button>
        {canUpdateDoc && !['Completed', 'Cancelled'].includes(doc.status) && (
          <>
            <Button variant="success" size="sm" onClick={() => updateDocument(doc.id, { status: 'Completed' })}><CheckCircle className="w-4 h-4 mr-2" />Mark Complete</Button>
            <Button variant="secondary" size="sm" onClick={() => updateDocument(doc.id, { status: 'On Hold' })}><Pause className="w-4 h-4 mr-2" />On Hold</Button>
          </>
        )}
      </div>

      {/* Main content: two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        {/* Left: Routing Timeline */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-sm font-semibold">Routing Timeline</CardTitle>
                <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                  {doc.routingHistory.length} {doc.routingHistory.length === 1 ? 'step' : 'steps'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {!['Completed', 'Cancelled'].includes(doc.status) && (
                  <div className="flex gap-4 pb-5">
                    <div className="flex flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-slate-300 bg-white text-slate-400 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-400">
                      Awaiting next action...
                    </div>
                  </div>
                )}

                {[...doc.routingHistory]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((entry, i, arr) => {
                  const isLast = i === arr.length - 1
                  const isCurrent = i === 0 && !['Completed', 'Cancelled'].includes(doc.status)
                  const actionMeta = getRoutingActionMeta(entry.action)
                  const ActionIcon = actionMeta.icon
                  return (
                    <div key={entry.id} className="flex gap-4 pb-5 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full border shrink-0 mt-0.5 ${isCurrent ? 'border-blue-200 bg-blue-100 text-blue-700 shadow-sm' : 'border-slate-200 bg-white text-slate-500'}`}>
                          <ActionIcon className="w-4 h-4" />
                        </div>
                        {!isLast && <div className={`w-px flex-1 my-1.5 ${isCurrent ? 'bg-blue-200' : 'bg-slate-200'}`} />}
                      </div>
                      <div className={`min-w-0 flex-1 rounded-xl border p-4 shadow-sm transition-colors ${isCurrent ? 'border-blue-200 bg-blue-50/80' : 'border-slate-200 bg-white'}`}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${actionMeta.badgeClass}`}>
                                <ActionIcon className="w-3 h-3" />
                                {entry.action}
                              </span>
                              {isCurrent && <Badge variant="secondary" className="text-[10px] px-2 py-0.5">Current Step</Badge>}
                            </div>
                            <p className="mt-2 text-sm font-semibold text-slate-900">
                              {getOfficeCode(entry.fromOfficeId)} to {getOfficeCode(entry.toOfficeId)}
                            </p>
                            <p className="mt-1 text-xs text-slate-600">
                              Routed by {getUserName(entry.fromUserId)}
                              {entry.toUserId && ` to ${getUserName(entry.toUserId)}`}
                            </p>
                          </div>
                          <div className="text-right text-[11px] text-slate-400">
                            <p>{format(new Date(entry.timestamp), 'MMM d, yyyy')}</p>
                            <p>{format(new Date(entry.timestamp), 'h:mm a')}</p>
                          </div>
                        </div>

                        {entry.remarks && (
                          <div className="mt-3 rounded-lg bg-white/80 px-3 py-2 text-sm italic text-slate-700 border border-slate-100">
                            "{entry.remarks}"
                          </div>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 font-medium ${entry.isAcknowledged && entry.receivedAt ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {entry.isAcknowledged && entry.receivedAt
                              ? `Acknowledged at ${format(new Date(entry.receivedAt), 'h:mm a')}`
                              : 'Awaiting acknowledgment'}
                          </span>
                          {entry.toUserId && (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                              Assigned to {getUserName(entry.toUserId)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Info Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Details */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Document Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {doc.description && <p className="text-slate-600">{doc.description}</p>}
              <Separator />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-400">Created:</span><br />{format(new Date(doc.dateCreated), 'MMM d, yyyy')}</div>
                <div><span className="text-slate-400">Updated:</span><br />{format(new Date(doc.updatedAt), 'MMM d, yyyy')}</div>
                <div><span className="text-slate-400">Origin:</span><br />{getOfficeCode(doc.originOfficeId)}</div>
                <div><span className="text-slate-400">Originator:</span><br />{getUserName(doc.originatorId)}</div>
              </div>
              {doc.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map(tag => <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Attachments ({doc.attachments.length})</CardTitle></CardHeader>
            <CardContent>
              {doc.attachments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No attachments</p>
              ) : (
                <div className="space-y-2">
                  {doc.attachments.map(att => (
                    <div key={att.id} className="flex items-center gap-2 p-2 rounded border bg-slate-50 text-xs">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{att.filename}</p>
                        <p className="text-slate-400">{formatFileSize(att.fileSize)}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6"><Download className="w-3 h-3" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Remarks */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Remarks ({doc.remarks.length})</CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowRemarkDialog(true)}><MessageSquare className="w-3 h-3 mr-1" />Add</Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-64">
                {doc.remarks.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No remarks yet</p>
                ) : (
                  <div className="space-y-3">
                    {doc.remarks.map(rem => (
                      <div key={rem.id} className={`p-2.5 rounded-lg text-xs ${rem.isInternal ? 'bg-amber-50 border border-amber-100' : 'bg-slate-50 border'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{getUserName(rem.userId)}</span>
                          {rem.isInternal && <Badge variant="warning" className="text-[9px] px-1.5 py-0">Internal</Badge>}
                          <span className="text-slate-400 ml-auto">{format(new Date(rem.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                        <p className="text-slate-700">{rem.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Forward Dialog */}
      <Dialog open={showForwardDialog} onOpenChange={setShowForwardDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Forward / Route Document</DialogTitle>
            <DialogDescription>{doc.trackingCode} — {doc.title}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Route To Office *</Label>
              <Select value={fwdOffice} onValueChange={setFwdOffice}>
                <SelectTrigger><SelectValue placeholder="Select destination office..." /></SelectTrigger>
                <SelectContent>{offices.map(o => <SelectItem key={o.id} value={o.id}>{o.code} — {o.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assign To Person (optional)</Label>
              <Select value={fwdUser || "none"} onValueChange={v => setFwdUser(v === "none" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Select person..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {users.filter(u => u.officeId === fwdOffice && u.isActive).map(u => <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.position}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Action Required *</Label>
              <Select value={fwdAction} onValueChange={v => setFwdAction(v as RoutingAction)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Forwarded', 'For Review', 'For Signature', 'For Action', 'For Information', 'Endorsed', 'Returned', 'Approved', 'Disapproved', 'Noted', 'Filed'].map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Remarks *</Label>
              <Textarea value={fwdRemarks} onChange={e => setFwdRemarks(e.target.value)} placeholder="Instructions or notes..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForwardDialog(false)}>Cancel</Button>
            <Button onClick={handleForward} disabled={!fwdOffice || !fwdRemarks}><Send className="w-4 h-4 mr-2" />Confirm & Forward</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remark Dialog */}
      <Dialog open={showRemarkDialog} onOpenChange={setShowRemarkDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Remark</DialogTitle>
            <DialogDescription>Add a note to this document.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Textarea value={remarkText} onChange={e => setRemarkText(e.target.value)} placeholder="Enter your remark..." rows={4} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="internal" checked={remarkInternal} onChange={e => setRemarkInternal(e.target.checked)} className="rounded" aria-label="Mark remark as internal" />
              <Label htmlFor="internal" className="text-sm">Internal note (not visible in public tracker)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemarkDialog(false)}>Cancel</Button>
            <Button onClick={handleAddRemark} disabled={!remarkText}>Add Remark</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
