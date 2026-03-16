import React, { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuthStore, useDocumentStore, useOfficeStore, useUserStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DocStatusBadge, PriorityBadge } from '@/components/documents/DocStatusBadge'
import { Spinner } from '@/components/ui/spinner'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type { RoutingAction } from '@/types'
import {
  Send, RefreshCw, Search, FileText, ArrowRight, CheckCircle,
  Clock, AlertTriangle, Filter, MailOpen, MapPin, Eye
} from 'lucide-react'

export default function Routing() {
  const user = useAuthStore(s => s.currentUser)
  const { documents, addRoutingEntry, acknowledgeDocument } = useDocumentStore()
  const offices = useOfficeStore(s => s.offices)
  const users = useUserStore(s => s.users)
  const [searchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search')?.trim() ?? '')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showRouteDialog, setShowRouteDialog] = useState(false)
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [routing, setRouting] = useState(false)

  // Forward form state
  const [fwdOffice, setFwdOffice] = useState('')
  const [fwdUser, setFwdUser] = useState('')
  const [fwdAction, setFwdAction] = useState<RoutingAction>('Forwarded')
  const [fwdRemarks, setFwdRemarks] = useState('')

  useEffect(() => {
    setSearch(searchParams.get('search')?.trim() ?? '')
  }, [searchParams])

  const myOfficeId = user?.officeId || ''

  // Documents that are at the user's office (incoming / currently assigned)
  const myDocs = useMemo(() => {
    return documents.filter(d => {
      if (d.currentOfficeId !== myOfficeId) return false
      if (['Completed', 'Cancelled'].includes(d.status)) return false
      const matchesSearch = !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.trackingCode.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filterStatus === 'all' || d.status === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [documents, myOfficeId, search, filterStatus])

  // Pending acknowledgments
  const pendingAck = useMemo(() => {
    return documents.filter(d =>
      d.currentOfficeId === myOfficeId &&
      d.routingHistory.some(rh => rh.toOfficeId === myOfficeId && !rh.isAcknowledged)
    )
  }, [documents, myOfficeId])

  // Recently routed outgoing
  const recentOutgoing = useMemo(() => {
    return documents
      .filter(d =>
        d.routingHistory.some(rh => rh.fromOfficeId === myOfficeId)
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
  }, [documents, myOfficeId])

  const getOfficeName = (oid: string) => offices.find(o => o.id === oid)?.name || oid
  const getOfficeCode = (oid: string) => offices.find(o => o.id === oid)?.code || oid
  const getUserName = (uid: string) => {
    const u = users.find(u => u.id === uid)
    return u ? `${u.firstName} ${u.lastName}` : uid
  }

  const openRouteDialog = (docId: string) => {
    setSelectedDocId(docId)
    setFwdOffice('')
    setFwdUser('')
    setFwdAction('Forwarded')
    setFwdRemarks('')
    setShowRouteDialog(true)
  }

  const handleRoute = () => {
    if (!selectedDocId || !fwdOffice || !fwdRemarks || !user) return
    setRouting(true)
    // Simulate brief processing
    setTimeout(() => {
      addRoutingEntry(selectedDocId, {
        documentId: selectedDocId,
        fromOfficeId: user.officeId,
        toOfficeId: fwdOffice,
        fromUserId: user.id,
        toUserId: fwdUser || undefined,
        action: fwdAction,
        remarks: fwdRemarks,
        timestamp: new Date(),
        isAcknowledged: false,
      })
      setRouting(false)
      setShowRouteDialog(false)
      const doc = documents.find(d => d.id === selectedDocId)
      toast.success('Document Routed', {
        description: `${doc?.trackingCode} ${fwdAction.toLowerCase()} to ${getOfficeCode(fwdOffice)}`,
      })
    }, 600)
  }

  const handleAcknowledge = (docId: string, entryId: string) => {
    acknowledgeDocument(docId, entryId)
    const doc = documents.find(d => d.id === docId)
    toast.success('Document Acknowledged', {
      description: `${doc?.trackingCode} has been acknowledged`,
    })
  }

  const selectedDoc = documents.find(d => d.id === selectedDocId)

  const statusOptions = ['Received', 'In Review', 'For Signature', 'For Routing', 'In Transit', 'Action Taken', 'Returned', 'On Hold']
  const actions: RoutingAction[] = ['Forwarded', 'For Review', 'For Signature', 'For Action', 'For Information', 'Endorsed', 'Returned', 'Approved', 'Disapproved', 'Noted', 'Filed']

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Route / Forward Documents</h1>
          <p className="text-sm text-slate-500 mt-1">Route, forward, and acknowledge documents between offices</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" className="text-xs">
            <MailOpen className="w-3 h-3 mr-1" />{pendingAck.length} Pending Acknowledgment
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><FileText className="w-5 h-5 text-blue-700" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{myDocs.length}</p><p className="text-xs text-slate-500">At My Office</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-700" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{pendingAck.length}</p><p className="text-xs text-slate-500">Pending Ack.</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Send className="w-5 h-5 text-green-700" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{recentOutgoing.length}</p><p className="text-xs text-slate-500">Recently Routed</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-700" /></div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {myDocs.filter(d => d.dueDate && new Date(d.dueDate) < new Date()).length}
              </p>
              <p className="text-xs text-slate-500">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="route" className="space-y-4">
        <TabsList>
          <TabsTrigger value="route"><Send className="w-3.5 h-3.5 mr-1" />Route Documents</TabsTrigger>
          <TabsTrigger value="acknowledge"><MailOpen className="w-3.5 h-3.5 mr-1" />Acknowledge ({pendingAck.length})</TabsTrigger>
          <TabsTrigger value="outgoing"><ArrowRight className="w-3.5 h-3.5 mr-1" />Recently Routed</TabsTrigger>
        </TabsList>

        {/* Route Tab */}
        <TabsContent value="route">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="Search by title or tracking code..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-44">
                    <Filter className="w-3.5 h-3.5 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {myDocs.length === 0 ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-700">No documents to route</h3>
                  <p className="text-sm text-slate-500 mt-1">All documents at your office have been routed or completed.</p>
                </div>
              ) : (
                <ScrollArea className="max-h-125">
                  <div className="space-y-2">
                    {myDocs.map(doc => {
                      const lastEntry = doc.routingHistory[doc.routingHistory.length - 1]
                      const isOverdue = doc.dueDate && new Date(doc.dueDate) < new Date()
                      return (
                        <div
                          key={doc.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-slate-50 ${isOverdue ? 'border-red-200 bg-red-50/50' : ''}`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs text-blue-700 font-bold">{doc.trackingCode}</span>
                              <PriorityBadge priority={doc.priority} />
                              <DocStatusBadge status={doc.status} />
                              {isOverdue && <Badge variant="danger" className="text-[10px]">Overdue</Badge>}
                            </div>
                            <p className="text-sm font-medium text-slate-900 mt-1 truncate">{doc.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              From: {lastEntry ? `${getOfficeCode(lastEntry.fromOfficeId)} (${getUserName(lastEntry.fromUserId)})` : 'Origin'} — {lastEntry?.action || 'Received'}
                              {doc.dueDate && <> · Due: {format(new Date(doc.dueDate), 'MMM d')}</>}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Link to={`/documents/${doc.id}`}>
                              <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                            </Link>
                            <Button size="sm" onClick={() => openRouteDialog(doc.id)}>
                              <Send className="w-3.5 h-3.5 mr-1" />Route
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Acknowledge Tab */}
        <TabsContent value="acknowledge">
          <Card>
            <CardContent className="pt-6">
              {pendingAck.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-700">All caught up!</h3>
                  <p className="text-sm text-slate-500 mt-1">No documents pending acknowledgment.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingAck.map(doc => {
                    const pendingEntry = doc.routingHistory.find(rh => rh.toOfficeId === myOfficeId && !rh.isAcknowledged)
                    if (!pendingEntry) return null
                    return (
                      <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50/50">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-blue-700 font-bold">{doc.trackingCode}</span>
                            <Badge variant="warning" className="text-[10px]">{pendingEntry.action}</Badge>
                          </div>
                          <p className="text-sm font-medium text-slate-900 mt-1 truncate">{doc.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            From: {getOfficeCode(pendingEntry.fromOfficeId)} ({getUserName(pendingEntry.fromUserId)}) · {format(new Date(pendingEntry.timestamp), 'MMM d, h:mm a')}
                          </p>
                          {pendingEntry.remarks && <p className="text-xs text-slate-600 mt-1 italic">"{pendingEntry.remarks}"</p>}
                        </div>
                        <Button size="sm" variant="success" onClick={() => handleAcknowledge(doc.id, pendingEntry.id)}>
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />Acknowledge
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recently Routed Tab */}
        <TabsContent value="outgoing">
          <Card>
            <CardContent className="pt-6">
              {recentOutgoing.length === 0 ? (
                <div className="text-center py-12">
                  <Send className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-700">No outgoing documents</h3>
                  <p className="text-sm text-slate-500 mt-1">You haven't routed any documents yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentOutgoing.map(doc => {
                    const lastOut = [...doc.routingHistory].reverse().find(rh => rh.fromOfficeId === myOfficeId)
                    if (!lastOut) return null
                    return (
                      <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-blue-700 font-bold">{doc.trackingCode}</span>
                            <DocStatusBadge status={doc.status} />
                            {lastOut.isAcknowledged ? (
                              <Badge variant="success" className="text-[10px]">Acknowledged</Badge>
                            ) : (
                              <Badge variant="warning" className="text-[10px]">Awaiting Ack.</Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium text-slate-900 mt-1 truncate">{doc.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {lastOut.action} → {getOfficeCode(lastOut.toOfficeId)}
                            {lastOut.toUserId && ` (${getUserName(lastOut.toUserId)})`} · {format(new Date(lastOut.timestamp), 'MMM d, h:mm a')}
                          </p>
                        </div>
                        <Link to={`/documents/${doc.id}`}>
                          <Button variant="ghost" size="sm"><Eye className="w-4 h-4 mr-1" />View</Button>
                        </Link>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Route Dialog */}
      <Dialog open={showRouteDialog} onOpenChange={setShowRouteDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Route Document</DialogTitle>
            <DialogDescription>
              {selectedDoc && <>{selectedDoc.trackingCode} — {selectedDoc.title}</>}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {selectedDoc && (
              <div className="p-3 rounded-lg bg-slate-50 border text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <DocStatusBadge status={selectedDoc.status} />
                  <PriorityBadge priority={selectedDoc.priority} />
                </div>
                <p className="text-slate-600"><MapPin className="w-3 h-3 inline mr-1" />Currently at: <b>{getOfficeName(selectedDoc.currentOfficeId)}</b></p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Route To Office <span className="text-red-500">*</span></Label>
              <Select value={fwdOffice} onValueChange={v => { setFwdOffice(v); setFwdUser('') }}>
                <SelectTrigger><SelectValue placeholder="Select destination office..." /></SelectTrigger>
                <SelectContent>{offices.filter(o => o.id !== myOfficeId).map(o => <SelectItem key={o.id} value={o.id}>{o.code} — {o.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {fwdOffice && (
              <div className="space-y-2">
                <Label>Assign To Person (optional)</Label>
                <Select value={fwdUser || "none"} onValueChange={v => setFwdUser(v === "none" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="Auto-assign to office..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {users.filter(u => u.officeId === fwdOffice && u.isActive).map(u => <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.position}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Routing Action <span className="text-red-500">*</span></Label>
              <Select value={fwdAction} onValueChange={v => setFwdAction(v as RoutingAction)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {actions.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Remarks / Instructions <span className="text-red-500">*</span></Label>
              <Textarea value={fwdRemarks} onChange={e => setFwdRemarks(e.target.value)} placeholder="Add routing instructions..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRouteDialog(false)}>Cancel</Button>
            <Button onClick={handleRoute} disabled={!fwdOffice || !fwdRemarks || routing}>
              {routing ? <><Spinner size="sm" className="mr-2 text-white" />Routing...</> : <><Send className="w-4 h-4 mr-2" />Confirm & Route</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
