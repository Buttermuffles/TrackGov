import { LayoutShell } from '../components/layout/LayoutShell'

export function SettingsPage() {
  return (
    <LayoutShell>
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            System
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
            Settings
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Configure agency information, tracking codes, notifications, SLAs, and
            email/backup settings.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm">
          This is a placeholder for Settings tabs: General, Tracking Codes,
          Notifications, SLA / Deadlines, Email, Backup &amp; Archive.
        </div>
      </div>
    </LayoutShell>
  )
}

