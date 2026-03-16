import { useAuthStore } from '@/store'
import { usePermissionStore } from '@/store/permissionStore'
import type { ModuleId, CRUDAction } from '@/types'

export function usePermission() {
  const currentUser = useAuthStore(s => s.currentUser)
  const getUserPermission = usePermissionStore(s => s.getUserPermission)
  const roleDefaults = usePermissionStore(s => s.roleDefaults)

  const can = (moduleId: ModuleId, action: CRUDAction): boolean => {
    if (!currentUser) return false

    // Super Admin bypasses everything
    if (currentUser.role === 'Super Admin') return true

    // Check explicit user-level permission first
    const explicit = getUserPermission(currentUser.id, moduleId)
    if (explicit) {
      return explicit.actions[action]
    }

    // Fall back to role default
    const roleDefault = roleDefaults[currentUser.role]?.[moduleId]
    if (roleDefault) {
      return roleDefault[action]
    }

    // Deny by default
    return false
  }

  const canAny = (moduleId: ModuleId, actions: CRUDAction[]): boolean =>
    actions.some(action => can(moduleId, action))

  const canAll = (moduleId: ModuleId, actions: CRUDAction[]): boolean =>
    actions.every(action => can(moduleId, action))

  return { can, canAny, canAll }
}
