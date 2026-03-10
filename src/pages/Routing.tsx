import { LayoutShell } from '../components/layout/LayoutShell'

export function RoutingPage() {
  return (
    <LayoutShell>
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Routing
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
            Route / Forward Document
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Step-by-step wizard to select a document, define routing details, and
            confirm forwarding.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm">
          This is a placeholder for the full routing wizard (select document,
          routing details, review &amp; confirm) and printable routing slip.
        </div>
      </div>
    </LayoutShell>
  )
}

