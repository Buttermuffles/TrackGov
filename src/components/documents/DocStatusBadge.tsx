import React from 'react'
import { Badge } from '@/components/ui/badge'
import type { DocumentStatus, DocumentType, Priority, Classification } from '@/types'

const statusConfig: Record<DocumentStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'purple'; label: string }> = {
  'Received': { variant: 'info', label: 'Received' },
  'In Review': { variant: 'gold', label: 'In Review' },
  'For Signature': { variant: 'purple', label: 'For Signature' },
  'For Routing': { variant: 'secondary', label: 'For Routing' },
  'In Transit': { variant: 'warning', label: 'In Transit' },
  'Action Taken': { variant: 'success', label: 'Action Taken' },
  'Returned': { variant: 'danger', label: 'Returned' },
  'Completed': { variant: 'success', label: 'Completed' },
  'On Hold': { variant: 'secondary', label: 'On Hold' },
  'Cancelled': { variant: 'danger', label: 'Cancelled' },
}

const priorityConfig: Record<Priority, { variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'purple'; label: string }> = {
  'Low': { variant: 'secondary', label: 'Low' },
  'Normal': { variant: 'info', label: 'Normal' },
  'High': { variant: 'warning', label: 'High' },
  'Urgent': { variant: 'danger', label: 'Urgent' },
}

const classificationConfig: Record<Classification, { variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'purple'; label: string }> = {
  'Routine': { variant: 'secondary', label: 'Routine' },
  'Priority': { variant: 'gold', label: 'Priority' },
  'Confidential': { variant: 'danger', label: 'Confidential' },
  'Top Secret': { variant: 'destructive', label: 'Top Secret' },
}

export function DocStatusBadge({ status }: { status: DocumentStatus }) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = priorityConfig[priority]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function ClassificationBadge({ classification }: { classification: Classification }) {
  const config = classificationConfig[classification]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

const typeBadgeClasses: Record<DocumentType, string> = {
  Letter: 'bg-blue-200 text-blue-900 border-blue-200 dark:bg-blue-600 dark:text-white dark:border-blue-600',
  Memorandum: 'bg-slate-200 text-slate-900 border-slate-200 dark:bg-slate-600 dark:text-white dark:border-slate-600',
  Resolution: 'bg-emerald-200 text-emerald-900 border-emerald-200 dark:bg-emerald-600 dark:text-white dark:border-emerald-600',
  Ordinance: 'bg-amber-200 text-amber-900 border-amber-200 dark:bg-amber-600 dark:text-white dark:border-amber-600',
  Contract: 'bg-violet-200 text-violet-900 border-violet-200 dark:bg-violet-600 dark:text-white dark:border-violet-600',
  Report: 'bg-amber-200 text-amber-900 border-amber-200 dark:bg-amber-600 dark:text-white dark:border-amber-600',
  Request: 'bg-blue-200 text-blue-900 border-blue-200 dark:bg-blue-600 dark:text-white dark:border-blue-600',
  Petition: 'bg-rose-200 text-rose-900 border-rose-200 dark:bg-rose-600 dark:text-white dark:border-rose-600',
  Certificate: 'bg-emerald-200 text-emerald-900 border-emerald-200 dark:bg-emerald-600 dark:text-white dark:border-emerald-600',
  Voucher: 'bg-amber-200 text-amber-900 border-amber-200 dark:bg-amber-600 dark:text-white dark:border-amber-600',
  'Purchase Order': 'bg-amber-200 text-amber-900 border-amber-200 dark:bg-amber-600 dark:text-white dark:border-amber-600',
  Other: 'bg-slate-200 text-slate-900 border-slate-200 dark:bg-slate-600 dark:text-white dark:border-slate-600',
}

export function DocTypeBadge({ type }: { type: DocumentType }) {
  return <Badge variant="outline" className={`text-[10px] font-medium ${typeBadgeClasses[type] ?? 'bg-slate-50 text-slate-700 border-slate-100'}`}>{type}</Badge>
}
