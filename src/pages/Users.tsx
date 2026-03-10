import { LayoutShell } from '../components/layout/LayoutShell'

export function UsersPage() {
  return (
    <LayoutShell>
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Management
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
            Users
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage system users, roles, and office assignments.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm">
          This is a placeholder for the Users table, add/edit user sheet, and role
          permissions matrix.
        </div>
      </div>
    </LayoutShell>
  )
}

