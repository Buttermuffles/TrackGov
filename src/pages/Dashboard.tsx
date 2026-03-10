import { mockData } from '../lib/mockData'
import { LayoutShell } from '../components/layout/LayoutShell'
import { BarChart3, Clock4, FileText, Inbox, Timer } from 'lucide-react'

export function DashboardPage() {
  const totalDocs = mockData.documents.length
  const incomingToday = 12
  const forAction = 28
  const completedToday = 7
  const overdue = 5

  const kpis = [
    {
      icon: Inbox,
      label: 'Incoming Today',
      value: incomingToday,
      subtitle: 'vs yesterday',
    },
    {
      icon: Timer,
      label: 'For Action',
      value: forAction,
      subtitle: 'Office-wide',
    },
    {
      icon: FileText,
      label: 'Completed Today',
      value: completedToday,
      subtitle: 'Resolved & archived',
    },
    {
      icon: Clock4,
      label: 'Overdue',
      value: overdue,
      subtitle: 'Past due date',
    },
    {
      icon: BarChart3,
      label: 'Total Documents',
      value: totalDocs,
      subtitle: 'This month',
    },
  ]

  return (
    <LayoutShell>
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Overview
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
            Document Control Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Role-aware summary of incoming, in-process, and completed documents
            across your office.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <kpi.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-medium text-slate-400">
                  Today
                </span>
              </div>
              <div className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {kpi.label}
              </div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {kpi.value}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                {kpi.subtitle}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Document Volume Trend
                </h2>
                <p className="text-xs text-slate-500">
                  Last 30 days – received, completed, overdue
                </p>
              </div>
              <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500">
                Placeholder chart
              </span>
            </div>
            <div className="mt-4 h-56 rounded-lg bg-slate-50/80" />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Documents per Office
                </h2>
                <p className="text-xs text-slate-500">Top 8 offices</p>
              </div>
              <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500">
                Placeholder chart
              </span>
            </div>
            <div className="mt-4 h-56 rounded-lg bg-slate-50/80" />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800">
                Recent Activity
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Timeline of latest routing actions across your office.
              </p>
              <div className="mt-3 h-32 rounded-lg bg-slate-50/80" />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800">
                Documents Awaiting My Action
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Personal queue of items requiring your review, signature, or
                action.
              </p>
              <div className="mt-3 h-32 rounded-lg bg-slate-50/80" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-[10px] font-bold text-red-700">
                  !
                </span>
                Overdue &amp; Urgent Documents
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Items past due date or marked as urgent.
              </p>
              <div className="mt-3 h-32 rounded-lg bg-slate-50/80" />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800">
                Document Type Breakdown
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Distribution of active documents by type.
              </p>
              <div className="mt-3 h-32 rounded-lg bg-slate-50/80" />
            </div>
          </div>
        </div>
      </div>
    </LayoutShell>
  )
}

