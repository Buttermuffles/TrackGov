import React, { useMemo } from 'react'
import { useDocumentStore, useOfficeStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { BarChart3, Download, TrendingUp, Clock, FileText, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts'
import { differenceInDays, subDays, format } from 'date-fns'

const COLORS = ['#1E3A5F', '#1D4ED8', '#CA8A04', '#16A34A', '#DC2626', '#7C3AED', '#0891B2', '#EA580C']

export default function Reports() {
  const documents = useDocumentStore(s => s.documents)
  const offices = useOfficeStore(s => s.offices)

  const byStatus = useMemo(() => { const m: Record<string, number> = {}; documents.forEach(d => { m[d.status] = (m[d.status] || 0) + 1 }); return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value) }, [documents])
  const byOffice = useMemo(() => offices.map(o => ({ name: o.code, count: documents.filter(d => d.currentOfficeId === o.id).length })).sort((a, b) => b.count - a.count), [documents, offices])
  const byType = useMemo(() => { const m: Record<string, number> = {}; documents.forEach(d => { m[d.documentType] = (m[d.documentType] || 0) + 1 }); return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value) }, [documents])
  const volumeTrend = useMemo(() => Array.from({ length: 30 }, (_, i) => { const date = subDays(new Date(), 29 - i); const ds = format(date, 'yyyy-MM-dd'); return { date: format(date, 'MMM d'), count: documents.filter(d => format(new Date(d.dateCreated), 'yyyy-MM-dd') === ds).length } }), [documents])
  const compliance = useMemo(() => { const withDue = documents.filter(d => d.dueDate); const overdue = withDue.filter(d => d.status !== 'Completed' && differenceInDays(new Date(d.dueDate!), new Date()) < 0).length; return [{ name: 'On Time', value: withDue.length - overdue }, { name: 'Overdue', value: overdue }] }, [documents])
  const byPriority = useMemo(() => { const m: Record<string, number> = {}; documents.forEach(d => { m[d.priority] = (m[d.priority] || 0) + 1 }); return Object.entries(m).map(([name, value]) => ({ name, value })) }, [documents])

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div><h1 className="text-xl lg:text-2xl font-bold text-slate-900">Reports & Analytics</h1><p className="text-sm text-slate-500 mt-1">Comprehensive document tracking insights</p></div>
        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export Report</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card><CardContent className="p-4 text-center"><FileText className="w-5 h-5 text-blue-600 mx-auto mb-1" /><p className="text-2xl font-bold">{documents.length}</p><p className="text-xs text-slate-500">Total</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Activity className="w-5 h-5 text-green-600 mx-auto mb-1" /><p className="text-2xl font-bold text-green-600">{documents.filter(d => d.status === 'Completed').length}</p><p className="text-xs text-slate-500">Completed</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" /><p className="text-2xl font-bold text-amber-600">{documents.filter(d => !['Completed', 'Cancelled'].includes(d.status)).length}</p><p className="text-xs text-slate-500">In Progress</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><TrendingUp className="w-5 h-5 text-red-600 mx-auto mb-1" /><p className="text-2xl font-bold text-red-600">{compliance[1]?.value || 0}</p><p className="text-xs text-slate-500">Overdue</p></CardContent></Card>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex flex-wrap"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="offices">By Office</TabsTrigger><TabsTrigger value="types">By Type</TabsTrigger></TabsList>
        <TabsContent value="overview" className="space-y-4"><div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Volume (30 Days)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><LineChart data={volumeTrend}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="date" fontSize={10} /><YAxis fontSize={10} allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="count" stroke="#1D4ED8" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><RPieChart><Pie data={byStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: any) => name + ' ' + ((percent ?? 0) * 100).toFixed(0) + '%'} labelLine={false} fontSize={10}>{byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></RPieChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={byPriority}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={10} allowDecimals={false} /><Tooltip /><Bar dataKey="value" radius={[4, 4, 0, 0]}>{byPriority.map((e, i) => <Cell key={i} fill={e.name === 'Urgent' ? '#DC2626' : e.name === 'High' ? '#EA580C' : e.name === 'Medium' ? '#CA8A04' : '#64748B'} />)}</Bar></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">SLA Compliance</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><RPieChart><Pie data={compliance} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }: any) => name + ': ' + value} fontSize={11}><Cell fill="#16A34A" /><Cell fill="#DC2626" /></Pie><Tooltip /></RPieChart></ResponsiveContainer></CardContent></Card>
        </div></TabsContent>
        <TabsContent value="offices"><Card><CardHeader><CardTitle className="text-sm">Documents by Office</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={350}><BarChart data={byOffice} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis type="number" fontSize={10} /><YAxis type="category" dataKey="name" width={60} fontSize={11} /><Tooltip /><Bar dataKey="count" fill="#1E3A5F" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></CardContent></Card></TabsContent>
        <TabsContent value="types"><Card><CardHeader><CardTitle className="text-sm">Documents by Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={400}><BarChart data={byType}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="name" fontSize={9} angle={-45} textAnchor="end" height={80} /><YAxis fontSize={10} allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#1D4ED8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  )
}
