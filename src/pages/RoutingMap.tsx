import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore, useDocumentStore, useOfficeStore, useUserStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DocStatusBadge, PriorityBadge } from '@/components/documents/DocStatusBadge'
import { format } from 'date-fns'
import {
  Map, Search, Building2, ArrowRight, FileText, Eye,
  ChevronRight, Clock, ExternalLink, ZoomIn, ZoomOut
} from 'lucide-react'

export default function RoutingMap() {
  const user = useAuthStore(s => s.currentUser)
  const documents = useDocumentStore(s => s.documents)
  const offices = useOfficeStore(s => s.offices)
  const users = useUserStore(s => s.users)

  const [selectedOffice, setSelectedOffice] = useState<string | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [zoom, setZoom] = useState(1)

  const getOfficeCode = (oid: string) => offices.find(o => o.id === oid)?.code || oid

  // Build office -> document mapping
  const officeDocMap = useMemo(() => {
    const map: Record<string, { incoming: number; current: number; outgoing: number }> = {}
    offices.forEach(o => { map[o.id] = { incoming: 0, current: 0, outgoing: 0 } })
    documents.forEach(doc => {
      if (!['Completed', 'Cancelled'].includes(doc.status)) {
        if (map[doc.currentOfficeId]) map[doc.currentOfficeId].current++
      }
      doc.routingHistory.forEach(rh => {
        if (map[rh.toOfficeId]) map[rh.toOfficeId].incoming++
        if (map[rh.fromOfficeId]) map[rh.fromOfficeId].outgoing++
      })
    })
    return map
  }, [offices, documents])

  // Build routing connections between offices (edges)
  const routingEdges = useMemo(() => {
    const edges: { from: string; to: string; count: number; recent: string }[] = []
    const edgeMap: Record<string, { count: number; recent: Date }> = {}
    documents.forEach(doc => {
      doc.routingHistory.forEach(rh => {
        const key = `${rh.fromOfficeId}→${rh.toOfficeId}`
        const ts = new Date(rh.timestamp)
        if (edgeMap[key]) {
          edgeMap[key].count++
          if (ts > edgeMap[key].recent) edgeMap[key].recent = ts
        } else {
          edgeMap[key] = { count: 1, recent: ts }
        }
      })
    })
    Object.entries(edgeMap).forEach(([key, val]) => {
      const [from, to] = key.split('→')
      edges.push({ from, to, count: val.count, recent: format(val.recent, 'MMM d') })
    })
    return edges.sort((a, b) => b.count - a.count)
  }, [documents])

  // Documents at selected office
  const officeDocsList = useMemo(() => {
    if (!selectedOffice) return []
    return documents.filter(d =>
      d.currentOfficeId === selectedOffice && !['Completed', 'Cancelled'].includes(d.status)
    )
  }, [documents, selectedOffice])

  // Document route trail
  const docTrail = useMemo(() => {
    if (!selectedDoc) return null
    return documents.find(d => d.id === selectedDoc)
  }, [documents, selectedDoc])

  // Filtered offices
  const filteredOffices = useMemo(() => {
    if (!search) return offices
    const q = search.toLowerCase()
    return offices.filter(o => o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q))
  }, [offices, search])

  const sortedFilteredOffices = useMemo(() => {
    return [...filteredOffices].sort((a, b) => {
      const aCurrent = officeDocMap[a.id]?.current || 0
      const bCurrent = officeDocMap[b.id]?.current || 0
      if (bCurrent !== aCurrent) return bCurrent - aCurrent
      return a.code.localeCompare(b.code)
    })
  }, [filteredOffices, officeDocMap])

  const activeOfficeCount = useMemo(() => {
    return sortedFilteredOffices.filter(o => (officeDocMap[o.id]?.current || 0) > 0).length
  }, [sortedFilteredOffices, officeDocMap])

  // office hex grid positions
  const officePositions = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(offices.length))
    return offices.map((o, i) => {
      const row = Math.floor(i / cols)
      const col = i % cols
      const offsetX = row % 2 === 1 ? 75 : 0
      return {
        id: o.id,
        code: o.code,
        name: o.name,
        x: col * 150 + offsetX + 80,
        y: row * 130 + 60,
      }
    })
  }, [offices])

  const svgWidth = useMemo(() => {
    const maxX = Math.max(...officePositions.map(p => p.x))
    return maxX + 160
  }, [officePositions])

  const svgHeight = useMemo(() => {
    const maxY = Math.max(...officePositions.map(p => p.y))
    return maxY + 120
  }, [officePositions])

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Routing Map</h1>
          <p className="text-sm text-slate-500 mt-1">Visual overview of document flow between offices</p>
        </div>
        <div className="flex items-center gap-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Left: Visual Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold"><Map className="w-4 h-4 inline mr-1" />Office Routing Network</CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}><ZoomOut className="w-3.5 h-3.5" /></Button>
                  <span className="text-xs text-slate-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(2, z + 0.1))}><ZoomIn className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-auto">
              <svg
                width={svgWidth * zoom}
                height={svgHeight * zoom}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full min-h-75"
              >
                <defs>
                  <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
                  </marker>
                  <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#1D4ED8" />
                  </marker>
                </defs>

                {/* Edges */}
                {routingEdges.map((edge, i) => {
                  const from = officePositions.find(p => p.id === edge.from)
                  const to = officePositions.find(p => p.id === edge.to)
                  if (!from || !to) return null
                  const isHighlighted = selectedOffice && (edge.from === selectedOffice || edge.to === selectedOffice)
                  const dx = to.x - from.x
                  const dy = to.y - from.y
                  const len = Math.sqrt(dx * dx + dy * dy)
                  const offsetX = (dx / len) * 40
                  const offsetY = (dy / len) * 40
                  return (
                    <g key={i}>
                      <line
                        x1={from.x + offsetX}
                        y1={from.y + offsetY}
                        x2={to.x - offsetX}
                        y2={to.y - offsetY}
                        stroke={isHighlighted ? '#1D4ED8' : '#cbd5e1'}
                        strokeWidth={isHighlighted ? 2 : 1}
                        markerEnd={isHighlighted ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                        opacity={isHighlighted ? 1 : 0.5}
                      />
                      {isHighlighted && (
                        <text
                          x={(from.x + to.x) / 2}
                          y={(from.y + to.y) / 2 - 8}
                          textAnchor="middle"
                          className="text-[9px] fill-blue-700 font-medium"
                        >
                          {edge.count}x
                        </text>
                      )}
                    </g>
                  )
                })}

                {/* Nodes */}
                {officePositions.map(pos => {
                  const stats = officeDocMap[pos.id] || { incoming: 0, current: 0, outgoing: 0 }
                  const isSelected = selectedOffice === pos.id
                  const hasActive = stats.current > 0
                  return (
                    <g
                      key={pos.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedOffice(isSelected ? null : pos.id)}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isSelected ? 42 : 36}
                        fill={isSelected ? '#1E3A5F' : hasActive ? '#EFF6FF' : '#f8fafc'}
                        stroke={isSelected ? '#CA8A04' : hasActive ? '#1D4ED8' : '#e2e8f0'}
                        strokeWidth={isSelected ? 3 : 2}
                      />
                      <text
                        x={pos.x}
                        y={pos.y - 4}
                        textAnchor="middle"
                        className={`text-[11px] font-bold ${isSelected ? 'fill-white' : 'fill-slate-900'}`}
                      >
                        {pos.code}
                      </text>
                      <text
                        x={pos.x}
                        y={pos.y + 10}
                        textAnchor="middle"
                        className={`text-[8px] ${isSelected ? 'fill-blue-200' : 'fill-slate-500'}`}
                      >
                        {stats.current} docs
                      </text>
                      {stats.current > 0 && !isSelected && (
                        <circle cx={pos.x + 28} cy={pos.y - 28} r={9} fill="#EF4444" stroke="white" strokeWidth={2} />
                      )}
                      {stats.current > 0 && !isSelected && (
                        <text x={pos.x + 28} y={pos.y - 24} textAnchor="middle" className="text-[9px] font-bold fill-white">
                          {stats.current}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </CardContent>
          </Card>

          {/* Top Routing Connections */}
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Top Routing Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {routingEdges.slice(0, 8).map((edge, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded border text-xs">
                    <Badge variant="secondary" className="text-[10px] shrink-0">{getOfficeCode(edge.from)}</Badge>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    <Badge variant="secondary" className="text-[10px] shrink-0">{getOfficeCode(edge.to)}</Badge>
                    <span className="text-slate-500 ml-auto">{edge.count} routes · {edge.recent}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Detail Panel */}
        <div className="space-y-4">
          {/* Office Search */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Offices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input placeholder="Search offices..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
              </div>
              <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>{sortedFilteredOffices.length} offices</span>
                <span>{activeOfficeCount} with active docs</span>
              </div>
              <div className="h-72 sm:h-80 overflow-y-auto rounded-md border border-slate-200 bg-slate-50/40 p-1 pr-2">
                <div className="space-y-1 min-h-full">
                  {sortedFilteredOffices.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-400">No offices found.</div>
                  )}
                  {sortedFilteredOffices.map(o => {
                    const stats = officeDocMap[o.id] || { incoming: 0, current: 0, outgoing: 0 }
                    return (
                      <button
                        key={o.id}
                        onClick={() => { setSelectedOffice(selectedOffice === o.id ? null : o.id); setSelectedDoc(null) }}
                        className={`w-full flex items-center gap-2 p-2 rounded-md text-left text-xs border transition-colors ${selectedOffice === o.id ? 'bg-navy text-white border-navy' : 'bg-white border-transparent hover:bg-slate-100 hover:border-slate-200'}`}
                      >
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate">{o.code}</p>
                          <p className={`truncate ${selectedOffice === o.id ? 'text-blue-200' : 'text-slate-500'}`}>{o.name}</p>
                        </div>
                        {stats.current > 0 && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${selectedOffice === o.id ? 'bg-gold text-navy' : 'bg-blue-100 text-blue-700'}`}>
                            {stats.current}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Office Detail */}
          {selectedOffice && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  <Building2 className="w-4 h-4 inline mr-1" />{getOfficeCode(selectedOffice)} Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {officeDocsList.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No active documents</p>
                ) : (
                  <ScrollArea className="max-h-64">
                    <div className="space-y-1.5">
                      {officeDocsList.map(doc => (
                        <button
                          key={doc.id}
                          onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
                          className={`w-full text-left p-2 rounded text-xs border transition-colors ${selectedDoc === doc.id ? 'border-blue-300 bg-blue-50' : 'hover:bg-slate-50'}`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-blue-700 font-bold">{doc.trackingCode}</span>
                            <PriorityBadge priority={doc.priority} />
                          </div>
                          <p className="text-slate-900 font-medium mt-0.5 truncate">{doc.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <DocStatusBadge status={doc.status} />
                            <span className="text-slate-400 text-[10px]">{doc.routingHistory.length} hops</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          )}

          {/* Document Route Trail */}
          {docTrail && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Route Trail</CardTitle>
                  <Link to={`/documents/${docTrail.id}`}>
                    <Button variant="ghost" size="sm" className="h-6 text-xs"><ExternalLink className="w-3 h-3 mr-1" />Open</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-xs text-blue-700 font-bold mb-2">{docTrail.trackingCode}</p>
                <div className="space-y-0">
                  {docTrail.routingHistory.map((entry, i) => {
                    const isLast = i === docTrail.routingHistory.length - 1
                    return (
                      <div key={entry.id} className="flex gap-2">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1 ${isLast ? 'bg-blue-600 ring-2 ring-blue-100' : 'bg-navy'}`} />
                          {!isLast && <div className="w-px flex-1 bg-slate-200 my-0.5" />}
                        </div>
                        <div className="pb-3 text-[10px]">
                          <p className="font-semibold text-slate-900">{entry.action}</p>
                          <p className="text-slate-500">
                            {getOfficeCode(entry.fromOfficeId)} → {getOfficeCode(entry.toOfficeId)} · {format(new Date(entry.timestamp), 'MMM d')}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

    </div>
  )
}
