import { LayoutShell } from '../components/layout/LayoutShell'

export function OutgoingPage() {
  return (
    <LayoutShell>
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Documents
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
            Outgoing Documents
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            All documents sent from your office, with in-transit and acknowledged
            tracking.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm">
          This is a placeholder for the Outgoing Documents table with status,
          in-transit highlighting, and reminder actions.
        </div>
      </div>
    </LayoutShell>
  )
}

