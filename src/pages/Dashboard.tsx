import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore, useDocumentStore, useOfficeStore, useUserStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DocStatusBadge, PriorityBadge } from '@/components/documents/DocStatusBadge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileInput, Clock, CheckCircle, AlertTriangle, FileText, ArrowRight, ChevronRight, Bell } from 'lucide-react'
import { format, isToday, differenceInDays } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'

const CHART_COLORS = ['#1E3A5F', '#CA8A04', '#1D4ED8', '#15803D', '#B91C1C', '#7C3AED', '#0891B2', '#F97316']

export default function Dashboard() {
  const user = useAuthStore(s => s.currentUser)
  const documents = useDocumentStore(s => s.documents)
  const offices = useOfficeStore(s => s.offices)
  const users = useUserStore(s => s.users)

  const isAdmin = user?.role === 'Super Admin' || user?.role === 'Admin'
  const relevantDocs = isAdmin ? documents : documents.filter(d => d.currentOfficeId === user?.officeId || d.originOfficeId === user?.officeId)

  const todayIncoming = relevantDocs.filter(d => isToday(new Date(d.dateReceived))).length
  const forAction = relevantDocs.filter(d => ['In Review', 'For Signature', 'For Routing'].includes(d.status)).length
  const completedToday = relevantDocs.filter(d => d.status === 'Completed' && isToday(new Date(d.updatedAt))).length
  const overdueCount = relevantDocs.filter(d => d.dueDate && new Date(d.dueDate) < new Date() && !['Completed', 'Cancelled', 'Action Taken'].includes(d.status)).length

  const kpis = [
    { label: 'Incoming Today', value: todayIncoming, icon: FileInput, color: 'text-blue-600', bg: 'bg-blue-50', link: '/incoming' },
    { label: 'For Action', value: forAction, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', link: '/pending' },
    { label: 'Completed Today', value: completedToday, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', link: '/documents' },
    { label: 'Overdue', value: overdueCount, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', link: '/pending' },
    { label: 'Total Documents', value: relevantDocs.length, icon: FileText, color: 'text-navy', bg: 'bg-blue-50', link: '/documents' },
  ]

  // Chart data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const dayStr = format(date, 'MMM d')
    const received = relevantDocs.filter(d => format(new Date(d.dateReceived), 'MMM d') === dayStr).length
    const completed = relevantDocs.filter(d => d.status === 'Completed' && format(new Date(d.updatedAt), 'MMM d') === dayStr).length
    return { name: dayStr, received, completed }
  })

  const docsPerOffice = offices.map(o => ({
    name: o.code,
    count: relevantDocs.filter(d => d.currentOfficeId === o.id).length,
  })).sort((a, b) => b.count - a.count).slice(0, 8)

  const typeBreakdown = Object.entries(
    relevantDocs.reduce((acc: Record<string, number>, d) => {
      acc[d.documentType] = (acc[d.documentType] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6)

  const overdueDocsList = relevantDocs
    .filter(d => d.dueDate && new Date(d.dueDate) < new Date() && !['Completed', 'Cancelled', 'Action Taken'].includes(d.status))
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5)

  const recentActivity = relevantDocs
    .flatMap(d => d.routingHistory.map(rh => ({ ...rh, docTitle: d.title, trackingCode: d.trackingCode, docId: d.id })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  const getOfficeName = (id: string) => offices.find(o => o.id === id)?.code || id
  const getUserName = (id: string) => { const u = users.find(u => u.id === id); return u ? `${u.firstName} ${u.lastName}` : id }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back, {user?.firstName}. Here's your document overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon
          return (
            <Link key={kpi.label} to={kpi.link}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${kpi.bg}`}><Icon className={`w-4 h-4 ${kpi.color}`} /></div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-3">{kpi.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{kpi.label}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Document Volume (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={last30Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={4} />
                <YAxis tick={{ fontSize: 10 }} />
                <RechartsTooltip contentStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="received" stroke="#1E3A5F" strokeWidth={2} name="Received" dot={false} />
                <Line type="monotone" dataKey="completed" stroke="#15803D" strokeWidth={2} name="Completed" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Documents per Office</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={docsPerOffice} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={55} />
                <RechartsTooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="count" fill="#1E3A5F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              <div className="space-y-3">
                {recentActivity.map((entry, i) => (
                  <div key={entry.id} className="flex gap-3 text-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-navy mt-1.5" />
                      {i < recentActivity.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                    </div>
                    <div className="pb-3 min-w-0">
                      <p className="text-xs text-slate-400">{format(new Date(entry.timestamp), 'MMM d, h:mm a')}</p>
                      <Link to={`/documents/${entry.docId}`} className="font-mono text-xs text-blue-700 hover:underline">{entry.trackingCode}</Link>
                      <p className="text-xs text-slate-600 mt-0.5">
                        <span className="font-medium">{entry.action}</span> by {getUserName(entry.fromUserId)} → {getOfficeName(entry.toOfficeId)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Overdue & Urgent */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Overdue & Urgent Documents</CardTitle>
              <Badge variant="danger">{overdueDocsList.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              {overdueDocsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <CheckCircle className="w-10 h-10 mb-2" />
                  <p className="text-sm">No overdue documents</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {overdueDocsList.map(doc => (
                    <Link key={doc.id} to={`/documents/${doc.id}`} className="block p-3 rounded-lg border border-red-100 bg-red-50/50 hover:bg-red-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-xs text-blue-700">{doc.trackingCode}</p>
                          <p className="text-sm font-medium text-slate-900 truncate mt-0.5">{doc.title}</p>
                          <p className="text-xs text-slate-500 mt-1">📍 {getOfficeName(doc.currentOfficeId)}</p>
                        </div>
                        <Badge variant="danger" className="ml-2 shrink-0">{Math.abs(differenceInDays(new Date(), new Date(doc.dueDate!)))}d overdue</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* My Queue */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Documents Awaiting My Action</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              {relevantDocs.filter(d => d.currentAssigneeId === user?.id && !['Completed', 'Cancelled'].includes(d.status)).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <CheckCircle className="w-10 h-10 mb-2" />
                  <p className="text-sm">All caught up!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {relevantDocs
                    .filter(d => d.currentAssigneeId === user?.id && !['Completed', 'Cancelled'].includes(d.status))
                    .slice(0, 6)
                    .map(doc => (
                      <Link key={doc.id} to={`/documents/${doc.id}`} className="flex items-center gap-3 p-2.5 rounded-lg border hover:bg-slate-50 transition-colors">
                        <div className={`w-1 h-10 rounded-full ${doc.priority === 'Urgent' ? 'bg-red-500' : doc.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-xs text-blue-700">{doc.trackingCode}</p>
                          <p className="text-sm text-slate-700 truncate">{doc.title}</p>
                        </div>
                        <DocStatusBadge status={doc.status} />
                      </Link>
                    ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Document Type Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Document Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={typeBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={2} label={({ name, percent }: any) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`} labelLine={false} style={{ fontSize: 10 }}>
                  {typeBreakdown.map((_, i) => <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
