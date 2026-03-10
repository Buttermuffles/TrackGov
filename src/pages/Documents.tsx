import { LayoutShell } from '../components/layout/LayoutShell'

export function DocumentsPage() {
  return (
    <LayoutShell>
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Registry
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
            All Documents
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Comprehensive registry of all documents you are allowed to view, with
            advanced filters and multiple views.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm">
          This is a placeholder for the full All Documents table, card grid, and
          calendar views. Filters, column visibility, and exports will be wired to
          real data as the backend is connected.
        </div>
      </div>
    </LayoutShell>
  )
}

