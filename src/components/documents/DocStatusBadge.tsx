import React from 'react'
import { Badge } from '@/components/ui/badge'
import type { DocumentStatus, Priority, Classification } from '@/types'

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
