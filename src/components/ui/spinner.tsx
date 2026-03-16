import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2, ShieldCheck, FileText, Building2 } from 'lucide-react'

export function Spinner({ className, size = 'default' }: { className?: string; size?: 'sm' | 'default' | 'lg' }) {
  const sizeClasses = { sm: 'w-4 h-4', default: 'w-6 h-6', lg: 'w-10 h-10' }
  return <Loader2 className={cn('animate-spin text-navy', sizeClasses[size], className)} />
}

export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-slate-500 animate-pulse">{message}</p>
    </div>
  )
}

export function FullScreenLoader({
  title = 'Preparing Workspace',
  message = 'Loading page and restoring context...',
}: {
  title?: string
  message?: string
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_90%_80%,rgba(16,185,129,0.16),transparent_40%)]" />
      <div className="absolute -left-24 top-14 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -right-24 bottom-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-blue-300/30">
              <ShieldCheck className="h-6 w-6 text-blue-200" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200/90">TrackGov</p>
              <h1 className="text-lg font-semibold text-white">{title}</h1>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center gap-3">
              <Spinner size="default" className="text-blue-300" />
              <p className="text-sm text-slate-100">{message}</p>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-linear-to-r from-blue-400 to-emerald-300" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-300 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"><Building2 className="h-3.5 w-3.5 text-blue-200" />Office context</div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"><FileText className="h-3.5 w-3.5 text-emerald-200" />Document state</div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"><ShieldCheck className="h-3.5 w-3.5 text-cyan-200" />Access verified</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex gap-2">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-8 bg-slate-200 rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-2">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-10 bg-slate-100 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-white p-6 animate-pulse space-y-4">
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
      </div>
      <div className="h-8 bg-slate-100 rounded w-1/4" />
    </div>
  )
}
