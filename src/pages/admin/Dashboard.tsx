import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore, useDocumentStore, useOfficeStore, useUserStore } from '@/store'
import { useThemeStore } from '@/store/themeStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DocStatusBadge } from '@/components/documents/DocStatusBadge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  FileInput, Clock, CheckCircle2, AlertTriangle, FileText,
  ArrowUpRight, Activity, LayoutDashboard, CalendarDays,
  ListTodo, TrendingUp, Moon, Sun,
} from 'lucide-react'
import { format, isToday, differenceInDays, subDays } from 'date-fns'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts'
import { cn } from '@/lib/utils'

// ─── Palette ──────────────────────────────────────────────────────────────────
const PIE_COLORS   = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4']
const PIE_SWATCHES = ['bg-blue-500','bg-amber-500','bg-emerald-500','bg-red-500','bg-violet-500','bg-cyan-500']
const RANGE_OPTIONS = [{ label:'7d', days:7 },{ label:'14d', days:14 },{ label:'30d', days:30 }]

// ─── Mode-aware style helpers ─────────────────────────────────────────────────
function useThemeClasses() {
  const mode = useThemeStore(s => s.mode)
  const isDark = mode === 'dark'

  return {
    isDark,
    // Surfaces
    cardBg:        isDark ? 'bg-slate-900 border-slate-700/60'      : 'bg-white border-slate-200',
    // Text
    textPrimary:   isDark ? 'text-white'                            : 'text-slate-900',
    textSecondary: isDark ? 'text-slate-400'                        : 'text-slate-500',
    textMuted:     isDark ? 'text-slate-500'                        : 'text-slate-400',
    // Borders & dividers
    divider:       isDark ? 'border-slate-700/50'                   : 'border-slate-100',
    separator:     isDark ? 'bg-slate-700/50'                       : 'bg-slate-200',
    // Pill toggle
    pillBg:        isDark ? 'bg-slate-800 border-slate-700'         : 'bg-slate-100 border-slate-200',
    pillActive:    isDark ? 'bg-slate-700 text-white shadow'        : 'bg-white text-slate-900 shadow-sm',
    pillInactive:  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                           : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200',
    // Row hover
    rowHover:      isDark ? 'hover:bg-slate-800'                    : 'hover:bg-slate-100',
    // Recharts
    axisColor:     isDark ? 'rgba(255,255,255,0.3)'                 : 'rgba(0,0,0,0.35)',
    gridColor:     isDark ? 'rgba(255,255,255,0.06)'                : 'rgba(0,0,0,0.06)',
    // Tooltip
    tooltipBg:     isDark ? '#1e293b'                               : '#ffffff',
    tooltipBorder: isDark ? '#334155'                               : '#e2e8f0',
    tooltipText:   isDark ? '#f1f5f9'                               : '#0f172a',
    tooltipMuted:  isDark ? '#94a3b8'                               : '#64748b',
    // Progress track
    progressTrack: isDark ? 'bg-slate-700'                          : 'bg-slate-100',
    // Date pill
    datePillBg:    isDark ? 'bg-slate-800 border-slate-700 text-slate-300'
                           : 'bg-slate-100 border-slate-200 text-slate-500',
    // Header icon
    headerIcon:    isDark ? 'text-slate-500'                        : 'text-slate-400',
    // Timeline connector
    timelineConnector: isDark ? 'bg-slate-700'                      : 'bg-slate-200',
  }
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
interface KpiDef {
  label: string
  value: number
  icon: React.ElementType
  iconBg: string
  iconBgDark: string
  iconColor: string
  accent: string
  link: string
}

function KpiCard({ label, value, icon: Icon, iconBg, iconBgDark, iconColor, accent, link }: KpiDef) {
  const t = useThemeClasses()
  return (
    <Link to={link} className="block group">
      <Card className={cn(
        'relative overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border',
        t.cardBg,
      )}>
        <div className={cn('absolute top-0 left-0 right-0 h-1 rounded-t-xl z-10', accent)} />
        <CardContent className="relative pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className={cn('p-2.5 rounded-xl', t.isDark ? iconBgDark : iconBg)}>
              <Icon className={cn('w-5 h-5', iconColor)} strokeWidth={2} />
            </div>
            <ArrowUpRight className={cn(
              'w-4 h-4 transition-all duration-150 opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
              iconColor,
            )} />
          </div>
          <p className={cn('text-3xl font-extrabold tracking-tight tabular-nums', t.textPrimary)}>
            {value}
          </p>
          <p className={cn('text-sm font-semibold mt-1', t.textSecondary)}>{label}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

// ─── Chart Tooltip (inline styled for recharts) ───────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  const t = useThemeClasses()
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: t.tooltipBg,
      border: `1px solid ${t.tooltipBorder}`,
      borderRadius: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      padding: '10px 14px',
      fontSize: 12,
    }}>
      <p style={{ fontWeight: 700, marginBottom: 8, color: t.tooltipText }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ color: t.tooltipMuted }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: t.tooltipText, marginLeft: 'auto', paddingLeft: 12 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, description, iconBg, iconBgDark, iconColor, badge }: {
  icon: React.ElementType; title: string; description?: string
  iconBg: string; iconBgDark: string; iconColor: string; badge?: React.ReactNode
}) {
  const t = useThemeClasses()
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className={cn('p-2 rounded-lg shrink-0', t.isDark ? iconBgDark : iconBg)}>
          <Icon className={cn('w-3.5 h-3.5', iconColor)} strokeWidth={2} />
        </div>
        <div>
          <p className={cn('text-sm font-bold leading-none', t.textPrimary)}>{title}</p>
          {description && <p className={cn('text-xs mt-0.5', t.textSecondary)}>{description}</p>}
        </div>
      </div>
      {badge}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ icon: Icon, message, color = 'text-slate-300' }: {
  icon: React.ElementType; message: string; color?: string
}) {
  const t = useThemeClasses()
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-2.5">
      <Icon className={cn('w-10 h-10', t.isDark ? 'text-slate-600' : color)} strokeWidth={1.5} />
      <p className={cn('text-xs font-medium', t.textSecondary)}>{message}</p>
    </div>
  )
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { mode, toggleMode } = useThemeStore()
  const isDark = mode === 'dark'

  return (
    <button
      onClick={toggleMode}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold',
        'transition-all duration-200 hover:scale-105 active:scale-95 select-none outline-none',
        isDark
          ? 'bg-slate-800 border-slate-600 text-amber-400 hover:bg-slate-700 hover:border-slate-500'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
      )}
    >
      {/* Pill track */}
      <span
        style={{ width: 32, height: 18, position: 'relative', display: 'inline-flex', alignItems: 'center' }}
        className={cn(
          'rounded-full border transition-colors duration-300',
          isDark ? 'bg-slate-600 border-slate-500' : 'bg-slate-200 border-slate-300',
        )}
      >
        {/* Thumb */}
        <span
          className={cn(
            'rounded-full transition-all duration-300 shadow-sm',
            isDark
              ? 'bg-amber-400'
              : 'bg-white border border-slate-300',
          )}
          style={{
            width: 14,
            height: 14,
            position: 'absolute',
            transform: isDark ? 'translateX(14px)' : 'translateX(2px)',
            transition: 'transform 0.25s ease',
            borderRadius: '50%',
            backgroundColor: isDark ? '#fbbf24' : '#ffffff',
            border: isDark ? 'none' : '1px solid #cbd5e1',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          }}
        />
      </span>
      {isDark
        ? <Moon className="w-3.5 h-3.5" />
        : <Sun  className="w-3.5 h-3.5 text-amber-500" />
      }
      <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const user      = useAuthStore(s => s.currentUser)
  const documents = useDocumentStore(s => s.documents)
  const offices   = useOfficeStore(s => s.offices)
  const users     = useUserStore(s => s.users)

  const [range, setRange] = useState(30)

  const t = useThemeClasses()

  const isAdmin = user?.role === 'Super Admin' || user?.role === 'Admin'
  const relevantDocs = isAdmin
    ? documents
    : documents.filter(d =>
        d.currentOfficeId === user?.officeId || d.originOfficeId === user?.officeId
      )

  // ── KPIs ──
  const todayIncoming  = relevantDocs.filter(d => isToday(new Date(d.dateReceived))).length
  const forAction      = relevantDocs.filter(d => ['In Review','For Signature','For Routing'].includes(d.status)).length
  const completedToday = relevantDocs.filter(d => d.status === 'Completed' && isToday(new Date(d.updatedAt))).length
  const overdueCount   = relevantDocs.filter(d =>
    d.dueDate && new Date(d.dueDate) < new Date() &&
    !['Completed','Cancelled','Action Taken'].includes(d.status)).length

  const kpis: KpiDef[] = [
    {
      label: 'Incoming Today', value: todayIncoming, icon: FileInput,
      iconBg: 'bg-blue-100', iconBgDark: 'bg-blue-900/30',
      iconColor: 'text-blue-600', accent: 'bg-blue-600', link: '/incoming',
    },
    {
      label: 'For Action', value: forAction, icon: Clock,
      iconBg: 'bg-amber-100', iconBgDark: 'bg-amber-900/30',
      iconColor: 'text-amber-600', accent: 'bg-amber-500', link: '/pending',
    },
    {
      label: 'Completed Today', value: completedToday, icon: CheckCircle2,
      iconBg: 'bg-emerald-100', iconBgDark: 'bg-emerald-900/30',
      iconColor: 'text-emerald-600', accent: 'bg-emerald-500', link: '/documents',
    },
    {
      label: 'Overdue', value: overdueCount, icon: AlertTriangle,
      iconBg: 'bg-rose-100', iconBgDark: 'bg-rose-900/30',
      iconColor: 'text-rose-600', accent: 'bg-rose-500', link: '/pending',
    },
    {
      label: 'Total Documents', value: relevantDocs.length, icon: FileText,
      iconBg: 'bg-violet-100', iconBgDark: 'bg-violet-900/30',
      iconColor: 'text-violet-600', accent: 'bg-violet-500', link: '/documents',
    },
  ]

  // ── Chart data ──
  const chartData = Array.from({ length: range }, (_, i) => {
    const date   = subDays(new Date(), range - 1 - i)
    const dayStr = format(date, 'MMM d')
    return {
      name:      range <= 7 ? dayStr : format(date, 'MM/dd'),
      Received:  relevantDocs.filter(d => format(new Date(d.dateReceived), 'MMM d') === dayStr).length,
      Completed: relevantDocs.filter(d => d.status === 'Completed' && format(new Date(d.updatedAt), 'MMM d') === dayStr).length,
    }
  })

  const docsPerOffice = offices
    .map(o => ({ name: o.code, value: relevantDocs.filter(d => d.currentOfficeId === o.id).length }))
    .sort((a, b) => b.value - a.value).slice(0, 6)

  const typeBreakdown = Object.entries(
    relevantDocs.reduce((acc: Record<string, number>, d) => {
      acc[d.documentType] = (acc[d.documentType] || 0) + 1; return acc
    }, {})
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5)

  const typeTotal = typeBreakdown.reduce((s, item) => s + item.value, 0)

  const overdueList = relevantDocs
    .filter(d => d.dueDate && new Date(d.dueDate) < new Date() && !['Completed','Cancelled','Action Taken'].includes(d.status))
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()).slice(0, 8)

  const myQueue = relevantDocs
    .filter(d => d.currentAssigneeId === user?.id && !['Completed','Cancelled'].includes(d.status))
    .slice(0, 8)

  const recentActivity = relevantDocs
    .flatMap(d => d.routingHistory.map(rh => ({ ...rh, docTitle: d.title, trackingCode: d.trackingCode, docId: d.id })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 12)

  const getOfficeName = (id: string) => offices.find(o => o.id === id)?.code || id
  const getUserName   = (id: string) => {
    const u = users.find(u => u.id === id); return u ? `${u.firstName} ${u.lastName}` : id
  }
  const priorityBar = (p: string) =>
    p === 'Urgent' ? 'bg-rose-500' : p === 'High' ? 'bg-amber-500' : 'bg-blue-500'

  const axisTick = { fontSize: 11, fill: t.axisColor }
  const panelClass = cn('border shadow-sm', t.cardBg)

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className={cn('w-4 h-4', t.headerIcon)} />
            <h1 className={cn('text-xl font-bold tracking-tight', t.textPrimary)}>Dashboard</h1>
          </div>
          <p className={cn('text-sm', t.textSecondary)}>
            Welcome back,{' '}
            <span className={cn('font-semibold', t.textPrimary)}>{user?.firstName}</span>.
            {' '}Here's your document overview.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <ThemeToggle />
          <div className={cn(
            'flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-2 border',
            t.datePillBg,
          )}>
            <CalendarDays className="w-3.5 h-3.5" />
            {format(new Date(), 'MMMM d, yyyy')}
          </div>
        </div>
      </div>

      <Separator className={t.separator} />

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* ── Volume Chart ── */}
      <Card className={panelClass}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className={cn('text-sm font-bold flex items-center gap-2', t.textPrimary)}>
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Document Volume
              </CardTitle>
              <CardDescription className={cn('text-xs mt-0.5', t.textSecondary)}>
                Received vs. completed over selected period
              </CardDescription>
            </div>
            <div className={cn('flex items-center gap-0.5 rounded-lg border p-0.5', t.pillBg)}>
              {RANGE_OPTIONS.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setRange(opt.days)}
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-md font-semibold transition-all duration-150',
                    range === opt.days ? t.pillActive : t.pillInactive,
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-5 pt-1">
            {[{ label: 'Received', color: '#3b82f6' }, { label: 'Completed', color: '#10b981' }].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-2 text-xs font-medium" style={{ color: t.axisColor }}>
                <span className="w-3 h-0.5 rounded inline-block" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ left: -12, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#3b82f6" stopOpacity={t.isDark ? 0.4 : 0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#10b981" stopOpacity={t.isDark ? 0.4 : 0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={t.gridColor} vertical={false} />
              <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false}
                interval={range <= 7 ? 0 : range <= 14 ? 1 : 4} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
              <RechartsTooltip content={<ChartTooltip />}
                cursor={{ stroke: t.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }} />
              <Area type="monotone" dataKey="Received"  stroke="#3b82f6" strokeWidth={2.5} fill="url(#gR)" dot={false} activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} />
              <Area type="monotone" dataKey="Completed" stroke="#10b981" strokeWidth={2.5} fill="url(#gC)" dot={false} activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Mid Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Active by Office */}
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <CardTitle className={cn('text-sm font-bold', t.textPrimary)}>Active by Office</CardTitle>
            <CardDescription className={cn('text-xs', t.textSecondary)}>Current document load per office</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={docsPerOffice} layout="vertical" margin={{ left: -8, right: 12, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.gridColor} horizontal={false} />
                <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={axisTick} axisLine={false} tickLine={false} width={50} />
                <RechartsTooltip content={<ChartTooltip />}
                  cursor={{ fill: t.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }} />
                <Bar dataKey="value" name="Documents" fill="#3b82f6" radius={[0, 5, 5, 0]} maxBarSize={13} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Document Types */}
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <CardTitle className={cn('text-sm font-bold', t.textPrimary)}>Document Types</CardTitle>
            <CardDescription className={cn('text-xs', t.textSecondary)}>Distribution by document type</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                <ResponsiveContainer width={170} height={170}>
                  <PieChart>
                    <Pie data={typeBreakdown} cx="50%" cy="50%"
                      innerRadius={48} outerRadius={78}
                      dataKey="value" paddingAngle={3} strokeWidth={0}>
                      {typeBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3 min-w-0">
                {typeBreakdown.map((item, i) => {
                  const pct = typeTotal ? Math.round((item.value / typeTotal) * 100) : 0
                  return (
                    <div key={item.name} className="min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={cn('w-2 h-2 rounded-full shrink-0', PIE_SWATCHES[i % PIE_SWATCHES.length])} />
                          <span className={cn('text-xs font-semibold truncate', t.textPrimary)}>{item.name}</span>
                        </div>
                        <span className={cn('text-xs font-bold shrink-0', t.textPrimary)}>{pct}%</span>
                      </div>
                      <div className={cn('h-1.5 rounded-full overflow-hidden', t.progressTrack)}>
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      </div>
                      <p className={cn('text-[11px] mt-0.5', t.textSecondary)}>{item.value} documents</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Activity */}
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <SectionHeader icon={Activity} title="Recent Activity" description="Latest routing actions"
              iconBg="bg-violet-100" iconBgDark="bg-violet-900/30" iconColor="text-violet-600" />
          </CardHeader>
          <CardContent className="pt-0 px-4">
            <ScrollArea className="h-72 no-scrollbar">
              {recentActivity.length === 0
                ? <EmptyState icon={Activity} message="No recent activity" />
                : recentActivity.map((entry, idx) => (
                  <div key={entry.id} className={cn(
                    'flex gap-3 py-3',
                    idx < recentActivity.length - 1 && cn('border-b', t.divider),
                  )}>
                    <div className="flex flex-col items-center pt-1.5 shrink-0">
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full bg-violet-500 ring-2',
                        t.isDark ? 'ring-violet-800' : 'ring-violet-200',
                      )} />
                      {idx < recentActivity.length - 1 && (
                        <div className={cn('w-px flex-1 mt-1.5 min-h-[14px]', t.timelineConnector)} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <p className={cn('text-[11px] tabular-nums', t.textSecondary)}>
                        {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                      </p>
                      <Link to={`/documents/${entry.docId}`}
                        className="font-mono text-[11px] font-semibold text-blue-500 hover:underline block mt-0.5">
                        {entry.trackingCode}
                      </Link>
                      <p className={cn('text-xs font-semibold mt-0.5', t.textPrimary)}>{entry.action}</p>
                      <p className={cn('text-[11px] mt-0.5', t.textSecondary)}>
                        {getUserName(entry.fromUserId)} → {getOfficeName(entry.toOfficeId)}
                      </p>
                    </div>
                  </div>
                ))
              }
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Overdue */}
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <SectionHeader icon={AlertTriangle} title="Overdue" description="Past due date"
              iconBg="bg-rose-100" iconBgDark="bg-rose-900/30" iconColor="text-rose-600"
              badge={overdueList.length > 0
                ? <Badge className="bg-rose-500 hover:bg-rose-600 text-white text-[11px] h-5 px-1.5 rounded-full font-bold border-0">
                    {overdueList.length}
                  </Badge>
                : undefined}
            />
          </CardHeader>
          <CardContent className="pt-0 px-4">
            <ScrollArea className="h-72 no-scrollbar">
              {overdueList.length === 0
                ? <EmptyState icon={CheckCircle2} message="No overdue documents" color="text-emerald-500" />
                : overdueList.map((doc, idx) => {
                  const daysOver = Math.abs(differenceInDays(new Date(), new Date(doc.dueDate!)))
                  return (
                    <Link key={doc.id} to={`/documents/${doc.id}`}
                      className={cn(
                        'flex items-center justify-between gap-3 py-3 -mx-1 px-1.5 rounded-lg transition-colors duration-150',
                        t.rowHover,
                        idx < overdueList.length - 1 && cn('border-b', t.divider),
                      )}>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[11px] font-semibold text-blue-500">{doc.trackingCode}</p>
                        <p className={cn('text-xs font-semibold truncate mt-0.5', t.textPrimary)}>{doc.title}</p>
                        <p className={cn('text-[11px] mt-0.5', t.textSecondary)}>{getOfficeName(doc.currentOfficeId)}</p>
                      </div>
                      <span className={cn(
                        'shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap border',
                        t.isDark
                          ? 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                          : 'bg-rose-50 text-rose-600 border-rose-200',
                      )}>
                        {daysOver}d over
                      </span>
                    </Link>
                  )
                })
              }
            </ScrollArea>
          </CardContent>
        </Card>

        {/* My Queue */}
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <SectionHeader icon={ListTodo} title="My Queue" description="Assigned to me"
              iconBg="bg-amber-100" iconBgDark="bg-amber-900/30" iconColor="text-amber-600"
              badge={myQueue.length > 0
                ? <Badge className={cn(
                    'text-[11px] h-5 px-1.5 rounded-full font-bold border-0',
                    t.isDark ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-100 text-amber-700',
                  )}>
                    {myQueue.length}
                  </Badge>
                : undefined}
            />
          </CardHeader>
          <CardContent className="pt-0 px-4">
            <ScrollArea className="h-72 no-scrollbar">
              {myQueue.length === 0
                ? <EmptyState icon={CheckCircle2} message="All caught up!" color="text-emerald-500" />
                : myQueue.map((doc, idx) => (
                  <Link key={doc.id} to={`/documents/${doc.id}`}
                    className={cn(
                      'flex items-center gap-3 py-3 -mx-1 px-1.5 rounded-lg transition-colors duration-150',
                      t.rowHover,
                      idx < myQueue.length - 1 && cn('border-b', t.divider),
                    )}>
                    <div className={cn('w-1 h-10 rounded-full shrink-0', priorityBar(doc.priority))} />
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[11px] font-semibold text-blue-500">{doc.trackingCode}</p>
                      <p className={cn('text-xs font-semibold truncate mt-0.5', t.textPrimary)}>{doc.title}</p>
                      <p className={cn('text-[11px] mt-0.5', t.textSecondary)}>{doc.priority} priority</p>
                    </div>
                    <DocStatusBadge status={doc.status} />
                  </Link>
                ))
              }
            </ScrollArea>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}