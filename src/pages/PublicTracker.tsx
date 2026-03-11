import React, { useState } from 'react'
import { useDocumentStore, useOfficeStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DocStatusBadge, PriorityBadge } from '@/components/documents/DocStatusBadge'
import { format } from 'date-fns'
import { Search, FileSearch, Clock, Fingerprint, ArrowRight, ShieldCheck } from 'lucide-react'

export default function PublicTracker() {
  const documents = useDocumentStore(s => s.documents)
  const offices = useOfficeStore(s => s.offices)
  const [trackingCode, setTrackingCode] = useState('')
  const [searched, setSearched] = useState(false)
  const doc = searched ? documents.find(d => d.trackingCode.toLowerCase() === trackingCode.toLowerCase().trim()) : null
  const getOfficeName = (oid: string) => offices.find(o => o.id === oid)?.name || oid
  const getOfficeCode = (oid: string) => offices.find(o => o.id === oid)?.code || oid
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearched(true) }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-navy text-white"><div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4"><div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><ShieldCheck className="w-6 h-6 text-gold" /></div><h1 className="text-2xl sm:text-3xl font-bold tracking-tight">TrackGov</h1></div>
        <p className="text-white/80 text-sm sm:text-base">Government Document Tracking System</p>
        <p className="text-white/60 text-xs mt-1">Track the status of your document using the tracking code provided</p>
      </div></div>
      <div className="max-w-2xl mx-auto px-4 -mt-6"><Card className="shadow-lg"><CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1"><Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" /><Input value={trackingCode} onChange={e => { setTrackingCode(e.target.value); setSearched(false) }} placeholder="Enter tracking code (e.g. DOC-2024-001)" className="pl-11 h-12 text-base" /></div>
          <Button type="submit" className="h-12 px-6"><Search className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Track</span></Button>
        </form>
      </CardContent></Card></div>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {searched && !doc && <Card><CardContent className="py-12 text-center"><FileSearch className="w-16 h-16 text-slate-200 mx-auto mb-4" /><h2 className="text-lg font-bold text-slate-900 mb-1">Document Not Found</h2><p className="text-sm text-slate-500">No document matches "<b>{trackingCode}</b>".</p></CardContent></Card>}
        {doc && <div className="space-y-4">
          <Card><CardHeader><div className="flex flex-wrap gap-2 mb-2"><PriorityBadge priority={doc.priority} /><DocStatusBadge status={doc.status} /></div><CardTitle className="text-lg"><span className="text-blue-700 font-mono">{doc.trackingCode}</span></CardTitle><p className="text-base font-semibold text-slate-900 mt-1">{doc.title}</p></CardHeader><CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-400">Type:</span><br /><b>{doc.documentType}</b></div>
              <div><span className="text-slate-400">Classification:</span><br /><b>{doc.classification}</b></div>
              <div><span className="text-slate-400">Date Received:</span><br /><b>{format(new Date(doc.dateReceived), 'MMMM d, yyyy')}</b></div>
              <div><span className="text-slate-400">Current Location:</span><br /><b>{getOfficeName(doc.currentOfficeId)}</b></div>
            </div>
            {doc.dueDate && <div className="text-xs flex items-center gap-1 text-slate-500"><Clock className="w-3.5 h-3.5" /> Expected: <b>{format(new Date(doc.dueDate), 'MMMM d, yyyy')}</b></div>}
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-semibold">Document Trail</CardTitle></CardHeader><CardContent><div className="space-y-0">
            {doc.routingHistory.map((entry, i) => { const isLast = i === doc.routingHistory.length - 1; return (
              <div key={entry.id} className="flex gap-3"><div className="flex flex-col items-center"><div className={"w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 " + (isLast ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-300')} />{!isLast && <div className="w-px flex-1 bg-slate-200 my-1" />}</div>
                <div className="pb-5 min-w-0 flex-1"><p className="text-[10px] text-slate-400">{format(new Date(entry.timestamp), 'MMMM d, yyyy - h:mm a')}</p><p className="text-xs font-semibold text-slate-900 mt-0.5">{entry.action}</p><p className="text-[11px] text-slate-500 mt-0.5">{getOfficeCode(entry.fromOfficeId)} <ArrowRight className="w-3 h-3 inline" /> {getOfficeCode(entry.toOfficeId)}</p>{entry.isAcknowledged && <p className="text-[10px] text-green-600 mt-0.5">Received</p>}</div></div>
            ) })}
            {!['Completed', 'Cancelled'].includes(doc.status) && <div className="flex gap-3"><div className="flex flex-col items-center"><div className="w-2.5 h-2.5 rounded-full border-2 border-slate-200 mt-1.5" /></div><p className="text-[11px] text-slate-400 mt-1">Processing...</p></div>}
          </div></CardContent></Card>
          {doc.remarks.filter(r => !r.isInternal).length > 0 && <Card><CardHeader><CardTitle className="text-sm font-semibold">Public Notes</CardTitle></CardHeader><CardContent className="space-y-2">{doc.remarks.filter(r => !r.isInternal).map(rem => <div key={rem.id} className="p-2 bg-slate-50 rounded text-xs"><p className="text-slate-600">{rem.content}</p><p className="text-slate-400 mt-1">{format(new Date(rem.createdAt), 'MMM d, yyyy')}</p></div>)}</CardContent></Card>}
        </div>}
        {!searched && <div className="text-center py-12"><FileSearch className="w-20 h-20 text-slate-200 mx-auto mb-4" /><h2 className="text-lg font-bold text-slate-700 mb-1">Track Your Document</h2><p className="text-sm text-slate-500">Enter the tracking code provided when your document was received</p></div>}
      </div>
      <div className="text-center py-6 text-xs text-slate-400">TrackGov - Government Document Tracking System</div>
    </div>
  )
}
