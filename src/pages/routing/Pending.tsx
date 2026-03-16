import React, { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuthStore, useDocumentStore, useOfficeStore, useUserStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DocStatusBadge, PriorityBadge } from '@/components/documents/DocStatusBadge'
import { format, differenceInDays } from 'date-fns'
import { Clock, CheckCircle, AlertTriangle, FileText, Eye, ArrowRight, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { usePermission } from '@/hooks/usePermission'

export default function Pending() {
  const { can } = usePermission()
  const canAcknowledge = can('routing_forward', 'update')
  const user = useAuthStore(s => s.currentUser)
  const { documents, acknowledgeDocument } = useDocumentStore()
  const offices = useOfficeStore(s => s.offices)
  const users = useUserStore(s => s.users)
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search')?.trim() ?? '')
  const getOfficeCode = (oid: string) => offices.find(o => o.id === oid)?.code || oid
  const getUserName = (uid: string) => { const u = users.find(x => x.id === uid); return u ? u.firstName + ' ' + u.lastName : '' }

  useEffect(() => {
    setSearch(searchParams.get('search')?.trim() ?? '')
  }, [searchParams])

  const matchesSearch = (title: string, trackingCode: string) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return title.toLowerCase().includes(q) || trackingCode.toLowerCase().includes(q)
  }

  const myPending = useMemo(() => {
    if (!user) return { needsAck: [] as typeof documents, assigned: [] as typeof documents, overdue: [] as typeof documents }
    const inMyOffice = documents.filter(d => d.currentOfficeId === user.officeId && !['Completed', 'Cancelled'].includes(d.status))
    const needsAck = inMyOffice.filter(d => {
      const lr = d.routingHistory[d.routingHistory.length - 1]
      return lr && lr.toOfficeId === user.officeId && !lr.isAcknowledged && matchesSearch(d.title, d.trackingCode)
    })
    const assigned = inMyOffice.filter(d => d.currentAssigneeId === user.id && matchesSearch(d.title, d.trackingCode))
    const overdue = inMyOffice.filter(d => d.dueDate && differenceInDays(new Date(d.dueDate), new Date()) < 0 && matchesSearch(d.title, d.trackingCode))
    return { needsAck, assigned, overdue }
  }, [documents, user, search])

  return (
    <div className="space-y-4 lg:space-y-6">
      <div><h1 className="text-xl lg:text-2xl font-bold text-slate-900">Pending Actions</h1><p className="text-sm text-slate-500 mt-1">Items requiring your attention</p></div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pending documents..." className="pl-9" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="p-3 text-center"><Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" /><p className="text-2xl font-bold text-amber-600">{myPending.needsAck.length}</p><p className="text-xs text-slate-500">Need Ack</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><FileText className="w-5 h-5 text-blue-600 mx-auto mb-1" /><p className="text-2xl font-bold text-blue-600">{myPending.assigned.length}</p><p className="text-xs text-slate-500">Assigned</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><AlertTriangle className="w-5 h-5 text-red-600 mx-auto mb-1" /><p className="text-2xl font-bold text-red-600">{myPending.overdue.length}</p><p className="text-xs text-slate-500">Overdue</p></CardContent></Card>
      </div>
      <Tabs defaultValue="needsAck" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full sm:w-auto sm:inline-grid">
          <TabsTrigger value="needsAck">Needs Ack ({myPending.needsAck.length})</TabsTrigger>
          <TabsTrigger value="assigned">Assigned ({myPending.assigned.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({myPending.overdue.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="needsAck"><div className="space-y-2">
          {myPending.needsAck.length === 0 && <Card><CardContent className="py-8 text-center text-sm text-slate-400"><CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-300" />All caught up!</CardContent></Card>}
          {myPending.needsAck.map(doc => { const lr = doc.routingHistory[doc.routingHistory.length - 1]!; return (
            <Card key={doc.id} className="hover:shadow-md transition"><CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap"><p className="font-mono text-xs text-blue-700 font-semibold">{doc.trackingCode}</p><PriorityBadge priority={doc.priority} /><DocStatusBadge status={doc.status} /></div>
                <p className="text-sm font-medium mt-1 truncate">{doc.title}</p>
                <p className="text-xs text-slate-500 mt-1">From: {getOfficeCode(lr.fromOfficeId)} ({getUserName(lr.fromUserId)}) - {format(new Date(lr.timestamp), 'MMM d, h:mm a')}</p>
                {lr.remarks && <p className="text-xs text-slate-600 italic mt-1">"{lr.remarks}"</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {canAcknowledge && <Button size="sm" onClick={() => user && acknowledgeDocument(doc.id, user.id)}><CheckCircle className="w-4 h-4 mr-1" />Acknowledge</Button>}
                <Button asChild variant="outline" size="sm"><Link to={'/documents/' + doc.id}><Eye className="w-4 h-4 mr-1" />View</Link></Button>
              </div>
            </CardContent></Card>
          ) })}
        </div></TabsContent>
        <TabsContent value="assigned"><div className="space-y-2">
          {myPending.assigned.length === 0 && <Card><CardContent className="py-8 text-center text-sm text-slate-400">No documents assigned to you.</CardContent></Card>}
          {myPending.assigned.map(doc => (
            <Card key={doc.id} className="hover:shadow-md transition"><CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap"><p className="font-mono text-xs text-blue-700 font-semibold">{doc.trackingCode}</p><PriorityBadge priority={doc.priority} /><DocStatusBadge status={doc.status} /></div>
                <p className="text-sm font-medium mt-1 truncate">{doc.title}</p>
                <p className="text-xs text-slate-500 mt-1">{doc.dueDate && <>Due: {format(new Date(doc.dueDate), 'MMM d, yyyy')} - </>}Type: {doc.documentType}</p>
              </div>
              <Button asChild size="sm"><Link to={'/documents/' + doc.id}><ArrowRight className="w-4 h-4 mr-1" />Open</Link></Button>
            </CardContent></Card>
          ))}
        </div></TabsContent>
        <TabsContent value="overdue"><div className="space-y-2">
          {myPending.overdue.length === 0 && <Card><CardContent className="py-8 text-center text-sm text-slate-400"><CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-300" />No overdue documents!</CardContent></Card>}
          {myPending.overdue.map(doc => { const daysOver = Math.abs(differenceInDays(new Date(doc.dueDate!), new Date())); return (
            <Card key={doc.id} className="border-red-200 bg-red-50/50 hover:shadow-md transition"><CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap"><p className="font-mono text-xs text-blue-700 font-semibold">{doc.trackingCode}</p><Badge variant="danger" className="text-[10px]">{daysOver}d overdue</Badge><PriorityBadge priority={doc.priority} /></div>
                <p className="text-sm font-medium mt-1 truncate">{doc.title}</p>
              </div>
              <Button asChild variant="destructive" size="sm"><Link to={'/documents/' + doc.id}><AlertTriangle className="w-4 h-4 mr-1" />Resolve</Link></Button>
            </CardContent></Card>
          ) })}
        </div></TabsContent>
      </Tabs>
    </div>
  )
}
