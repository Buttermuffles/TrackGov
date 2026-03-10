import { LayoutShell } from '../components/layout/LayoutShell'

export function ReportsPage() {
  return (
    <LayoutShell>
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Analytics
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
            Reports &amp; Analytics
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Monitor document volumes, office performance, processing time, and
            compliance.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm">
          This is a placeholder for the reports tabs (Document Summary, Office
          Performance, Processing Time, Compliance, Audit Trail) and export
          actions.
        </div>
      </div>
    </LayoutShell>
  )
}

