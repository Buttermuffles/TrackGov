import { LayoutShell } from '../components/layout/LayoutShell'

export function RoutingMapPage() {
  return (
    <LayoutShell>
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Routing
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
            Routing Map
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Visualize how documents flow between offices and spot bottlenecks.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm">
          This is a placeholder for the interactive routing map and linear route
          view for specific documents.
        </div>
      </div>
    </LayoutShell>
  )
}

