import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ModulePermission, ModuleId, CRUDActions, PermissionPreset, RoleDefaultPermissions, UserRole } from '@/types'
import { ROLE_DEFAULT_PERMISSIONS, DEFAULT_PRESETS, SYSTEM_MODULES } from '@/lib/modules'

interface PermissionState {
  permissions: Record<string, Record<string, ModulePermission>>
  presets: PermissionPreset[]
  roleDefaults: RoleDefaultPermissions

  getUserPermission: (userId: string, moduleId: ModuleId) => ModulePermission | null
  getAllUserPermissions: (userId: string) => Record<string, ModulePermission>
  setPermission: (
    userId: string,
    moduleId: ModuleId,
    actions: CRUDActions,
    grantedBy: string,
    notes?: string,
    expiresAt?: Date
  ) => void
  setBulkPermissions: (
    userId: string,
    moduleActions: Array<{ moduleId: ModuleId; actions: CRUDActions }>,
    grantedBy: string,
    notes?: string
  ) => void
  revokePermission: (userId: string, moduleId: ModuleId) => void
  resetToRoleDefault: (userId: string, role: UserRole) => void
  copyPermissions: (fromUserId: string, toUserId: string, grantedBy: string) => void
  applyPreset: (presetId: string, userId: string, grantedBy: string) => void
  savePreset: (name: string, description: string, userId: string, createdBy: string) => void
}

export const usePermissionStore = create<PermissionState>()(
  persist(
    (set, get) => ({
      permissions: {},
      presets: DEFAULT_PRESETS,
      roleDefaults: ROLE_DEFAULT_PERMISSIONS,

      getUserPermission: (userId, moduleId) => {
        const userPerms = get().permissions[userId]
        if (!userPerms) return null
        const perm = userPerms[moduleId]
        if (!perm || !perm.isActive) return null
        if (perm.expiresAt && new Date() > new Date(perm.expiresAt)) return null
        return perm
      },

      getAllUserPermissions: (userId) => {
        return get().permissions[userId] || {}
      },

      setPermission: (userId, moduleId, actions, grantedBy, notes, expiresAt) => {
        set(state => ({
          permissions: {
            ...state.permissions,
            [userId]: {
              ...state.permissions[userId],
              [moduleId]: {
                id: `perm_${userId}_${moduleId}`,
                userId,
                moduleId,
                actions,
                grantedBy,
                grantedAt: new Date(),
                updatedAt: new Date(),
                notes,
                expiresAt,
                isActive: true,
              },
            },
          },
        }))
      },

      setBulkPermissions: (userId, moduleActions, grantedBy, notes) => {
        set(state => {
          const existing = state.permissions[userId] || {}
          const updated = { ...existing }
          const now = new Date()
          for (const { moduleId, actions } of moduleActions) {
            updated[moduleId] = {
              id: `perm_${userId}_${moduleId}`,
              userId,
              moduleId,
              actions,
              grantedBy,
              grantedAt: now,
              updatedAt: now,
              notes,
              isActive: true,
            }
          }
          return {
            permissions: {
              ...state.permissions,
              [userId]: updated,
            },
          }
        })
      },

      revokePermission: (userId, moduleId) => {
        set(state => {
          const userPerms = state.permissions[userId]
          if (!userPerms || !userPerms[moduleId]) return state
          return {
            permissions: {
              ...state.permissions,
              [userId]: {
                ...userPerms,
                [moduleId]: {
                  ...userPerms[moduleId],
                  isActive: false,
                  updatedAt: new Date(),
                },
              },
            },
          }
        })
      },

      resetToRoleDefault: (userId, role) => {
        set(state => {
          const newPerms: Record<string, ModulePermission> = {}
          const defaults = ROLE_DEFAULT_PERMISSIONS[role]
          const now = new Date()
          for (const mod of SYSTEM_MODULES) {
            newPerms[mod.id] = {
              id: `perm_${userId}_${mod.id}`,
              userId,
              moduleId: mod.id,
              actions: { ...defaults[mod.id] },
              grantedBy: 'role_default',
              grantedAt: now,
              updatedAt: now,
              isActive: true,
            }
          }
          return {
            permissions: {
              ...state.permissions,
              [userId]: newPerms,
            },
          }
        })
      },

      copyPermissions: (fromUserId, toUserId, grantedBy) => {
        const fromPerms = get().permissions[fromUserId] || {}
        const now = new Date()
        set(state => ({
          permissions: {
            ...state.permissions,
            [toUserId]: Object.fromEntries(
              Object.entries(fromPerms).map(([moduleId, perm]) => [
                moduleId,
                {
                  ...perm,
                  id: `perm_${toUserId}_${moduleId}`,
                  userId: toUserId,
                  grantedBy,
                  grantedAt: now,
                  updatedAt: now,
                },
              ])
            ),
          },
        }))
      },

      applyPreset: (presetId, userId, grantedBy) => {
        const preset = get().presets.find(p => p.id === presetId)
        if (!preset) return
        const now = new Date()
        set(state => {
          const updated: Record<string, ModulePermission> = {}
          for (const entry of preset.permissions) {
            updated[entry.moduleId] = {
              id: `perm_${userId}_${entry.moduleId}`,
              userId,
              moduleId: entry.moduleId,
              actions: { ...entry.actions },
              grantedBy,
              grantedAt: now,
              updatedAt: now,
              notes: `Applied preset: ${preset.name}`,
              isActive: true,
            }
          }
          return {
            permissions: {
              ...state.permissions,
              [userId]: updated,
            },
          }
        })
      },

      savePreset: (name, description, userId, createdBy) => {
        const userPerms = get().permissions[userId] || {}
        const permissions = SYSTEM_MODULES.map(mod => {
          const perm = userPerms[mod.id]
          return {
            moduleId: mod.id,
            actions: perm?.isActive
              ? { ...perm.actions }
              : { create: false, read: false, update: false, delete: false },
          }
        })
        set(state => ({
          presets: [
            ...state.presets,
            {
              id: `preset-${Date.now()}`,
              name,
              description,
              permissions,
              createdBy,
              createdAt: new Date(),
              isSystem: false,
            },
          ],
        }))
      },
    }),
    { name: 'trackgov-permissions' }
  )
)
