import { LayoutShell } from '../components/layout/LayoutShell'

export function PendingPage() {
  return (
    <LayoutShell>
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Queue
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
            Pending Action
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Centralized list of documents that require action and may be overdue.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm">
          This is a placeholder for the Pending Action queue with overdue
          highlighting and quick actions.
        </div>
      </div>
    </LayoutShell>
  )
}

