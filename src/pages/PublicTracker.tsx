export function PublicTrackerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-xs font-semibold tracking-[0.22em] text-blue-700">
            SEAL
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            TrackGov Public Tracker
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            City Government of Manila · Transparency. Accountability. Efficiency.
          </p>
        </div>
        <div className="mt-5 space-y-3">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Enter Tracking Code
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
            placeholder="e.g. TRK-2024-00145"
          />
          <button className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-[#1E3A5F] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2a4d7a]">
            Track Document
          </button>
        </div>
        <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
          Public-safe tracking results (status, current office, dates, and routing
          history) will appear here. Confidential details will be hidden.
        </div>
      </div>
    </div>
  )
}

