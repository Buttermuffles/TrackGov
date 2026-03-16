import React, { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuthStore, useUserStore, useOfficeStore, useAuditStore } from '@/store'
import { usePermissionStore } from '@/store/permissionStore'
import { SYSTEM_MODULES, MODULE_GROUPS, ROLE_DEFAULT_PERMISSIONS } from '@/lib/modules'
import { getInitials } from '@/lib/utils'
import type { ModuleId, CRUDAction, CRUDActions, User } from '@/types'
import { toast } from 'sonner'
import {
  Shield, ShieldCheck, Save, RotateCcw, Copy, Search,
  Plus, Eye, Pencil, Trash2, AlertTriangle, Check, X, Users, Building2, Filter
} from 'lucide-react'

const CRUD_ACTIONS: { key: CRUDAction; label: string; icon: React.ReactNode }[] = [
  { key: 'create', label: 'Create', icon: <Plus className="w-3.5 h-3.5" /> },
  { key: 'read', label: 'Read', icon: <Eye className="w-3.5 h-3.5" /> },
  { key: 'update', label: 'Update', icon: <Pencil className="w-3.5 h-3.5" /> },
  { key: 'delete', label: 'Delete', icon: <Trash2 className="w-3.5 h-3.5" /> },
]

type EditablePermissions = Record<ModuleId, CRUDActions>

function buildPermissionsFromState(
  userId: string,
  userRole: string,
  getAllUserPermissions: (userId: string) => Record<string, any>,
): EditablePermissions {
  const explicit = getAllUserPermissions(userId)
  const roleDefaults = ROLE_DEFAULT_PERMISSIONS[userRole as keyof typeof ROLE_DEFAULT_PERMISSIONS]
  const result: Partial<EditablePermissions> = {}

  for (const mod of SYSTEM_MODULES) {
    const explicitPerm = explicit[mod.id]
    if (explicitPerm && explicitPerm.isActive) {
      result[mod.id] = { ...explicitPerm.actions }
    } else if (roleDefaults) {
      result[mod.id] = { ...roleDefaults[mod.id] }
    } else {
      result[mod.id] = { create: false, read: false, update: false, delete: false }
    }
  }

  return result as EditablePermissions
}

export default function Permissions() {
  const currentUser = useAuthStore(s => s.currentUser)
  const users = useUserStore(s => s.users)
  const offices = useOfficeStore(s => s.offices)
  const addAuditEntry = useAuditStore(s => s.addEntry)

  const {
    getAllUserPermissions,
    setBulkPermissions,
    resetToRoleDefault,
    copyPermissions,
    applyPreset,
    presets,
  } = usePermissionStore()

  // ── Filters ──────────────────────────────────
  const [userSearch, setUserSearch] = useState('')
  const [officeFilter, setOfficeFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  // ── Selected user ────────────────────────────
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // ── Editable permission state ────────────────
  const [editPerms, setEditPerms] = useState<EditablePermissions | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  // ── Dialogs ──────────────────────────────────
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [copyDialogOpen, setCopyDialogOpen] = useState(false)
  const [presetDialogOpen, setPresetDialogOpen] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [copySourceUser, setCopySourceUser] = useState<string>('')

  // ── Filter active users (exclude Super Admin from targets) ──
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (!u.isActive) return false
      if (u.role === 'Super Admin') return false
      if (officeFilter !== 'all' && u.officeId !== officeFilter) return false
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (userSearch) {
        const q = userSearch.toLowerCase()
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase()
        return fullName.includes(q) || u.employeeId.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      }
      return true
    })
  }, [users, userSearch, officeFilter, roleFilter])

  const selectedUser = useMemo(
    () => users.find(u => u.id === selectedUserId) ?? null,
    [users, selectedUserId]
  )

  const selectedUserOffice = useMemo(
    () => offices.find(o => o.id === selectedUser?.officeId),
    [offices, selectedUser]
  )

  // ── Select a user and load their perms ───────
  const handleSelectUser = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId)
    if (!user) return
    setSelectedUserId(userId)
    const perms = buildPermissionsFromState(userId, user.role, getAllUserPermissions)
    setEditPerms(perms)
    setIsDirty(false)
  }, [users, getAllUserPermissions])

  // ── Toggle a single action ───────────────────
  const toggleAction = useCallback((moduleId: ModuleId, action: CRUDAction) => {
    setEditPerms(prev => {
      if (!prev) return prev
      return {
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          [action]: !prev[moduleId][action],
        },
      }
    })
    setIsDirty(true)
  }, [])

  // ── Toggle all actions for one module ────────
  const toggleModuleRow = useCallback((moduleId: ModuleId) => {
    setEditPerms(prev => {
      if (!prev) return prev
      const current = prev[moduleId]
      const allOn = current.create && current.read && current.update && current.delete
      const newVal = !allOn
      return {
        ...prev,
        [moduleId]: { create: newVal, read: newVal, update: newVal, delete: newVal },
      }
    })
    setIsDirty(true)
  }, [])

  // ── Toggle a column (one action for all modules) ──
  const toggleColumn = useCallback((action: CRUDAction) => {
    setEditPerms(prev => {
      if (!prev) return prev
      const allOn = SYSTEM_MODULES.every(m => prev[m.id][action])
      const newVal = !allOn
      const next = { ...prev }
      for (const mod of SYSTEM_MODULES) {
        next[mod.id] = { ...next[mod.id], [action]: newVal }
      }
      return next
    })
    setIsDirty(true)
  }, [])

  // ── Toggle ALL permissions ───────────────────
  const toggleAll = useCallback(() => {
    setEditPerms(prev => {
      if (!prev) return prev
      const allOn = SYSTEM_MODULES.every(m =>
        prev[m.id].create && prev[m.id].read && prev[m.id].update && prev[m.id].delete
      )
      const newVal = !allOn
      const next: Partial<EditablePermissions> = {}
      for (const mod of SYSTEM_MODULES) {
        next[mod.id] = { create: newVal, read: newVal, update: newVal, delete: newVal }
      }
      return next as EditablePermissions
    })
    setIsDirty(true)
  }, [])

  // ── Compute change diff for save dialog ──────
  const changeDiff = useMemo(() => {
    if (!selectedUser || !editPerms) return []
    const original = buildPermissionsFromState(selectedUser.id, selectedUser.role, getAllUserPermissions)
    const changes: Array<{ moduleId: ModuleId; moduleName: string; action: CRUDAction; from: boolean; to: boolean }> = []
    for (const mod of SYSTEM_MODULES) {
      for (const action of ['create', 'read', 'update', 'delete'] as CRUDAction[]) {
        if (original[mod.id][action] !== editPerms[mod.id][action]) {
          changes.push({
            moduleId: mod.id,
            moduleName: mod.name,
            action,
            from: original[mod.id][action],
            to: editPerms[mod.id][action],
          })
        }
      }
    }
    return changes
  }, [selectedUser, editPerms, getAllUserPermissions])

  // ── Save ─────────────────────────────────────
  const handleSave = useCallback(() => {
    if (!selectedUser || !editPerms || !currentUser) return
    const moduleActions = SYSTEM_MODULES.map(mod => ({
      moduleId: mod.id,
      actions: editPerms[mod.id],
    }))
    setBulkPermissions(selectedUser.id, moduleActions, currentUser.id)
    addAuditEntry({
      userId: currentUser.id,
      action: 'Permission Updated',
      details: `Updated permissions for ${selectedUser.firstName} ${selectedUser.lastName}: ${changeDiff.length} change(s)`,
      ipAddress: '127.0.0.1',
    })
    setIsDirty(false)
    setSaveDialogOpen(false)
    toast.success(`Permissions saved for ${selectedUser.firstName} ${selectedUser.lastName}`)
  }, [selectedUser, editPerms, currentUser, setBulkPermissions, addAuditEntry, changeDiff])

  // ── Reset to Role Default ────────────────────
  const handleResetToDefault = useCallback(() => {
    if (!selectedUser) return
    resetToRoleDefault(selectedUser.id, selectedUser.role)
    const perms = buildPermissionsFromState(selectedUser.id, selectedUser.role, getAllUserPermissions)
    // Reload from role defaults directly to avoid stale state
    const roleDefaults = ROLE_DEFAULT_PERMISSIONS[selectedUser.role as keyof typeof ROLE_DEFAULT_PERMISSIONS]
    const fresh: Partial<EditablePermissions> = {}
    for (const mod of SYSTEM_MODULES) {
      fresh[mod.id] = { ...roleDefaults[mod.id] }
    }
    setEditPerms(fresh as EditablePermissions)
    setIsDirty(false)
    setResetDialogOpen(false)
    toast.success(`Permissions reset to ${selectedUser.role} defaults`)
  }, [selectedUser, resetToRoleDefault, getAllUserPermissions])

  // ── Copy from another user ───────────────────
  const handleCopyFrom = useCallback(() => {
    if (!selectedUser || !copySourceUser || !currentUser) return
    copyPermissions(copySourceUser, selectedUser.id, currentUser.id)
    // Reload
    const perms = buildPermissionsFromState(selectedUser.id, selectedUser.role, getAllUserPermissions)
    setEditPerms(perms)
    setIsDirty(false)
    setCopyDialogOpen(false)
    setCopySourceUser('')
    const source = users.find(u => u.id === copySourceUser)
    toast.success(`Permissions copied from ${source?.firstName} ${source?.lastName}`)
  }, [selectedUser, copySourceUser, currentUser, copyPermissions, getAllUserPermissions, users])

  // ── Apply Preset ─────────────────────────────
  const handleApplyPreset = useCallback((presetId: string) => {
    if (!selectedUser || !currentUser) return
    applyPreset(presetId, selectedUser.id, currentUser.id)
    // Reload
    setTimeout(() => {
      const perms = buildPermissionsFromState(selectedUser.id, selectedUser.role, getAllUserPermissions)
      setEditPerms(perms)
      setIsDirty(false)
      setPresetDialogOpen(false)
      const preset = presets.find(p => p.id === presetId)
      toast.success(`Applied preset: ${preset?.name}`)
    }, 0)
  }, [selectedUser, currentUser, applyPreset, getAllUserPermissions, presets])

  // ── Guard: only Super Admin can access ───────
  if (currentUser?.role !== 'Super Admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <Shield className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Access Restricted</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
          Only Super Admins can manage module permissions. Contact your administrator to request access.
        </p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Module Permission Access</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Assign granular CRUD permissions per user per module</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* ── LEFT PANEL: User Selector ──────────── */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" />
                Select User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <Select value={officeFilter} onValueChange={setOfficeFilter}>
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <Building2 className="w-3 h-3 mr-1" />
                    <SelectValue placeholder="Office" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Offices</SelectItem>
                    {offices.filter(o => o.isActive).map(o => (
                      <SelectItem key={o.id} value={o.id}>{o.code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <Filter className="w-3 h-3 mr-1" />
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {['Admin', 'Department Head', 'Records Officer', 'Staff', 'Read Only'].map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* User List */}
              <ScrollArea className="h-[calc(100vh-420px)] min-h-75">
                <div className="space-y-1 pr-2">
                  {filteredUsers.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">No users found</p>
                  )}
                  {filteredUsers.map(user => {
                    const office = offices.find(o => o.id === user.officeId)
                    const isSelected = selectedUserId === user.id
                    return (
                      <button
                        key={user.id}
                        onClick={() => handleSelectUser(user.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                        }`}
                      >
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className={`text-xs ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            {getInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'}`}>
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {office?.code} · {user.role}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* ── RIGHT PANEL: Permission Matrix ─────── */}
          <div className="space-y-4">
            {!selectedUser ? (
              <Card className="flex flex-col items-center justify-center py-20 text-center">
                <Shield className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Select a user from the left panel</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">to view and manage their module permissions</p>
              </Card>
            ) : (
              <>
                {/* User Info Bar */}
                <Card>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-600 text-white font-semibold">
                            {getInitials(selectedUser.firstName, selectedUser.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            {selectedUser.firstName} {selectedUser.lastName}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {selectedUserOffice?.name} · <Badge variant="outline" className="text-[10px] px-1.5 py-0">{selectedUser.role}</Badge>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPresetDialogOpen(true)}
                        >
                          Apply Preset
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCopyDialogOpen(true)}
                        >
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          Copy From
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setResetDialogOpen(true)}
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1" />
                          Reset Default
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            if (changeDiff.length === 0) {
                              toast.info('No changes to save')
                              return
                            }
                            setSaveDialogOpen(true)
                          }}
                          disabled={!isDirty}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Save className="w-3.5 h-3.5 mr-1" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                    {isDirty && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-md border border-amber-200 dark:border-amber-700">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>You have unsaved changes — {changeDiff.length} permission(s) modified</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Permission Matrix Table */}
                <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-[calc(100vh-350px)]">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 min-w-62.5">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={editPerms ? SYSTEM_MODULES.every(m =>
                                    editPerms[m.id].create && editPerms[m.id].read && editPerms[m.id].update && editPerms[m.id].delete
                                  ) : false}
                                  onCheckedChange={() => toggleAll()}
                                />
                                <span>Module</span>
                              </div>
                            </th>
                            {CRUD_ACTIONS.map(col => (
                              <th key={col.key} className="text-center px-3 py-3 font-semibold text-slate-600 dark:text-slate-300 w-22.5">
                                <div className="flex flex-col items-center gap-1">
                                  <button
                                    onClick={() => toggleColumn(col.key)}
                                    className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                  >
                                    {col.icon}
                                    <span className="text-xs">{col.label}</span>
                                  </button>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {MODULE_GROUPS.map(group => (
                            <React.Fragment key={group}>
                              {/* Group header */}
                              <tr className="bg-slate-100/50 dark:bg-slate-800/50">
                                <td colSpan={5} className="px-4 py-2">
                                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">
                                    {group}
                                  </span>
                                </td>
                              </tr>
                              {/* Module rows */}
                              {SYSTEM_MODULES.filter(m => m.group === group).map(mod => {
                                const perms = editPerms?.[mod.id]
                                const allOn = perms && perms.create && perms.read && perms.update && perms.delete
                                return (
                                  <tr
                                    key={mod.id}
                                    className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                                  >
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          checked={!!allOn}
                                          onCheckedChange={() => toggleModuleRow(mod.id)}
                                        />
                                        <div>
                                          <p className="font-medium text-slate-700 dark:text-slate-200">{mod.name}</p>
                                          <p className="text-[11px] text-slate-400 dark:text-slate-500">{mod.description}</p>
                                        </div>
                                      </div>
                                    </td>
                                    {CRUD_ACTIONS.map(col => (
                                      <td key={col.key} className="text-center px-3 py-3">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className="flex justify-center">
                                              <Switch
                                                checked={perms?.[col.key] ?? false}
                                                onCheckedChange={() => toggleAction(mod.id, col.key)}
                                              />
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent side="top" className="text-xs max-w-50">
                                            <p className="font-medium">{col.label}: {mod.name}</p>
                                            <p className="text-slate-400">{mod.actions[col.key]}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </td>
                                    ))}
                                  </tr>
                                )
                              })}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Save Confirmation Dialog ──────────── */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="w-5 h-5 text-blue-600" />
              Save Permission Changes?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              User: <span className="font-medium text-slate-800 dark:text-slate-200">{selectedUser?.firstName} {selectedUser?.lastName}</span>
              {' '}({selectedUserOffice?.code})
            </p>
            <p className="text-sm text-slate-500">{changeDiff.length} permission(s) modified:</p>
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {changeDiff.map((ch, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded ${
                    ch.to
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}
                >
                  {ch.to ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>{ch.moduleName} → <span className="capitalize">{ch.action}</span>: {ch.from ? 'ON' : 'OFF'} → {ch.to ? 'ON' : 'OFF'}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400">These changes take effect immediately.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Check className="w-4 h-4 mr-1" />
              Save & Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reset Confirmation Dialog ─────────── */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              Reset to Role Defaults?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This will reset all permissions for <span className="font-medium">{selectedUser?.firstName} {selectedUser?.lastName}</span> to
            the default permissions for the <Badge variant="outline" className="mx-1">{selectedUser?.role}</Badge> role.
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400">Any custom permissions will be overwritten.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleResetToDefault} variant="destructive">
              Reset Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Copy From User Dialog ─────────────── */}
      <Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="w-5 h-5 text-blue-600" />
              Copy Permissions From User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label className="text-sm">Select source user:</Label>
            <Select value={copySourceUser} onValueChange={setCopySourceUser}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user..." />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter(u => u.isActive && u.id !== selectedUserId && u.role !== 'Super Admin')
                  .map(u => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} ({u.role})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400">
              All permissions from the selected user will be copied to {selectedUser?.firstName} {selectedUser?.lastName}.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCopyDialogOpen(false); setCopySourceUser('') }}>Cancel</Button>
            <Button onClick={handleCopyFrom} disabled={!copySourceUser} className="bg-blue-600 hover:bg-blue-700 text-white">
              Copy Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Apply Preset Dialog ───────────────── */}
      <Dialog open={presetDialogOpen} onOpenChange={setPresetDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply Permission Preset</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {presets.map(preset => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-slate-700 dark:text-slate-200">{preset.name}</p>
                  {preset.isSystem && (
                    <Badge variant="secondary" className="text-[10px]">System</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{preset.description}</p>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPresetDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
