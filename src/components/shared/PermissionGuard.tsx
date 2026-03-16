import React from 'react'
import { usePermission } from '@/hooks/usePermission'
import type { ModuleId, CRUDAction } from '@/types'

interface PermissionGuardProps {
  module: ModuleId
  action: CRUDAction
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGuard({ module, action, fallback = null, children }: PermissionGuardProps) {
  const { can } = usePermission()
  return can(module, action) ? <>{children}</> : <>{fallback}</>
}
