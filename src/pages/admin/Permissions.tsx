import React, { useState, useMemo, useCallback } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuthStore, useUserStore, useOfficeStore, useAuditStore } from '@/store'
import { usePermissionStore } from '@/store/permissionStore'
import { useThemeStore } from '@/store/themeStore'
import { SYSTEM_MODULES, MODULE_GROUPS, ROLE_DEFAULT_PERMISSIONS } from '@/lib/modules'
import { getInitials, cn } from '@/lib/utils'
import type { ModuleId, CRUDAction, CRUDActions } from '@/types'
import { toast } from 'sonner'
import {
  Shield, ShieldCheck, Save, RotateCcw, Copy, Search,
  Plus, Eye, Pencil, Trash2, AlertTriangle, Check, X,
  Users, Building2, Filter, FileText, ChevronRight,
} from 'lucide-react'
import { usePermission } from '@/hooks/usePermission'

// ─── Mode-aware style helpers (same pattern as Dashboard) ───────────────────
function useThemeClasses() {
  const mode = useThemeStore(s => s.mode)
  const isDark = mode === 'dark'
  return {
    isDark,
    cardBg:        isDark ? 'bg-slate-900' : 'bg-white',
    cardBorder:    isDark ? 'border-slate-700' : 'border-slate-200',
    headerBg:      isDark ? 'bg-slate-800'       : 'bg-white',
    headerBorder:  isDark ? 'border-slate-700'   : 'border-slate-200',
    textPrimary:   isDark ? 'text-white'         : 'text-slate-900',
    textSecondary: isDark ? 'text-slate-400'     : 'text-slate-500',
    textMuted:     isDark ? 'text-slate-500'     : 'text-slate-400',
    divider:       isDark ? 'border-slate-700'   : 'border-slate-100',
    separator:     isDark ? 'bg-slate-700'       : 'bg-slate-100',
    inputBg:       isDark ? 'bg-slate-800'       : 'bg-slate-100',
    inputBorder:   isDark ? 'border-slate-700'   : 'border-slate-200',
    groupRowBg:    isDark ? 'bg-slate-800'       : 'bg-slate-50',
    groupRowText:  isDark ? 'text-slate-400'     : 'text-slate-500',
    theadBg:       isDark ? 'bg-slate-800'       : 'bg-slate-50',
    theadBorder:   isDark ? 'border-slate-700'   : 'border-slate-200',
    theadText:     isDark ? 'text-slate-300'     : 'text-slate-600',
    rowHover:      isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50',
    rowBorder:     isDark ? 'border-slate-800'   : 'border-slate-100',
    colBorder:     isDark ? 'border-slate-800'   : 'border-slate-100',
    listItemHover: isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100',
    avatarBg:      isDark ? 'bg-slate-700'       : 'bg-slate-200',
    avatarText:    isDark ? 'text-slate-200'     : 'text-slate-600',
    pageHeaderBg:    isDark ? 'bg-slate-800'     : 'bg-indigo-600',
    pageHeaderTitle:  isDark ? 'text-white'       : 'text-white',
    pageHeaderSub:    isDark ? 'text-slate-400'   : 'text-indigo-200',
    toggleOff:        isDark ? 'bg-slate-700'     : 'bg-slate-200',
    btnOutline:       isDark
      ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
    dotSep:           isDark ? 'text-slate-600'   : 'text-slate-300',
    unsavedBg:        isDark ? 'bg-amber-950 border-amber-800 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700',
    chkBorder:        isDark ? 'border-slate-600' : 'border-slate-300',
    dialogBg:         isDark ? 'bg-slate-900'     : 'bg-white',
    dialogBorder:     isDark ? 'border-slate-700' : 'border-slate-200',
    dialogText:       isDark ? 'text-slate-400'   : 'text-slate-600',
    dialogListBg:     isDark ? 'border-slate-800' : 'border-slate-100',
    iconBgIndigo:     isDark ? 'bg-indigo-950'    : 'bg-indigo-100',
    iconBgAmber:      isDark ? 'bg-amber-950'     : 'bg-amber-100',
    iconIndigo:       isDark ? 'text-indigo-400'  : 'text-indigo-600',
    iconAmber:        isDark ? 'text-amber-400'   : 'text-amber-600',
    diffOn:           isDark ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-50 text-emerald-700',
    diffOff:          isDark ? 'bg-red-950 text-red-300'        : 'bg-red-50 text-red-700',
    presetItem:       isDark
      ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-indigo-700'
      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300',
    presetName:       isDark ? 'text-slate-200 group-hover:text-indigo-400' : 'text-slate-800 group-hover:text-indigo-600',
    presetSystem:     isDark ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-slate-100 text-slate-500 border-slate-200',
    presetDesc:       isDark ? 'text-slate-500'   : 'text-slate-400',
    copyLabel:        isDark ? 'text-slate-300'   : 'text-slate-700',
    copyNote:         isDark ? 'text-slate-300'   : 'text-slate-700',
    selectTrigger:    isDark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-800',
  }
}

// ─── CRUD config ───────────────────────────────────────────────────────────────
type CRUDConf = {
  key: CRUDAction; label: string; icon: React.ReactNode
  headText: string   // colour inside the always-dark thead
  toggleOn: string   // bg when switch is ON
  pill: string       // legend pill in page header
}

const CRUD: CRUDConf[] = [
  {
    key: 'create', label: 'Create', icon: <Plus className="w-3.5 h-3.5" />,
    headText: 'text-emerald-400', toggleOn: 'bg-emerald-500',
    pill: 'bg-emerald-600 text-white ring-1 ring-emerald-300 dark:bg-emerald-500 dark:text-white dark:ring-emerald-400',
  },
  {
    key: 'read', label: 'Read', icon: <Eye className="w-3.5 h-3.5" />,
    headText: 'text-sky-400', toggleOn: 'bg-sky-500',
    pill: 'bg-sky-600 text-white ring-1 ring-sky-300 dark:bg-sky-500 dark:text-white dark:ring-sky-400',
  },
  {
    key: 'update', label: 'Update', icon: <Pencil className="w-3.5 h-3.5" />,
    headText: 'text-amber-400', toggleOn: 'bg-amber-500',
    pill: 'bg-amber-600 text-white ring-1 ring-amber-300 dark:bg-amber-500 dark:text-white dark:ring-amber-400',
  },
  {
    key: 'delete', label: 'Delete', icon: <Trash2 className="w-3.5 h-3.5" />,
    headText: 'text-red-400', toggleOn: 'bg-red-500',
    pill: 'bg-rose-600 text-white ring-1 ring-rose-300 dark:bg-rose-500 dark:text-white dark:ring-rose-400',
  },
]

const ROLE_BADGE: Record<string, string> = {
  'Admin':           'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  'Department Head': 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  'Records Officer': 'bg-sky-100    text-sky-700    dark:bg-sky-950    dark:text-sky-300',
  'Staff':           'bg-slate-100  text-slate-600  dark:bg-slate-800  dark:text-slate-300',
  'Read Only':       'bg-gray-100   text-gray-600   dark:bg-gray-800   dark:text-gray-400',
}

// ─── Tiny btn helper ───────────────────────────────────────────────────────────
function Btn({
  children, onClick, variant = 'outline', disabled = false, className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'outline' | 'primary' | 'danger'
  disabled?: boolean
  className?: string
}) {
  const t = useThemeClasses()
  const base = 'inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    outline: t.btnOutline,
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 font-semibold',
    danger:  'bg-red-600 text-white hover:bg-red-700 font-semibold',
  }
  return (
    <button onClick={onClick} disabled={disabled} className={cn(base, variants[variant], className)}>
      {children}
    </button>
  )
}

// ─── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, onBg, offBg }: { checked: boolean; onChange: () => void; onBg: string; offBg: string }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} onClick={onChange}
      className={cn(
        'relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer rounded-full',
        'border-2 border-transparent transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        checked ? onBg : offBg,
      )}
    >
      <span className={cn(
        'pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow',
        'transition-transform duration-150',
        checked ? 'translate-x-[18px]' : 'translate-x-0',
      )} />
    </button>
  )
}

// ─── Types / helpers ───────────────────────────────────────────────────────────
type EditPerms = Record<ModuleId, CRUDActions>

function buildPerms(userId: string, role: string, getAll: (id: string) => Record<string, any>): EditPerms {
  const exp  = getAll(userId)
  const def  = ROLE_DEFAULT_PERMISSIONS[role as keyof typeof ROLE_DEFAULT_PERMISSIONS]
  const out: Partial<EditPerms> = {}
  for (const m of SYSTEM_MODULES) {
    const e = exp[m.id]
    out[m.id] = e?.isActive ? { ...e.actions } : def ? { ...def[m.id] } : { create: false, read: false, update: false, delete: false }
  }
  return out as EditPerms
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function Permissions() {
  const currentUser   = useAuthStore(s => s.currentUser)
  const users         = useUserStore(s => s.users)
  const offices       = useOfficeStore(s => s.offices)
  const addAudit      = useAuditStore(s => s.addEntry)
  const { getAllUserPermissions, setBulkPermissions, resetToRoleDefault, copyPermissions, applyPreset, presets } = usePermissionStore()

  const [isMobile, setIsMobile] = useState(false)
  React.useEffect(() => {
    const m = window.matchMedia('(max-width: 768px)')
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(m.matches)
    m.addEventListener('change', onChange)
    return () => m.removeEventListener('change', onChange)
  }, [])

  const [search,     setSearch]     = useState('')
  const [officeF,    setOfficeF]    = useState('all')
  const [roleF,      setRoleF]      = useState('all')
  const [selId,      setSelId]      = useState<string | null>(null)
  const [editPerms,  setEditPerms]  = useState<EditPerms | null>(null)
  const [dirty,      setDirty]      = useState(false)
  const [saveOpen,   setSaveOpen]   = useState(false)
  const [copyOpen,   setCopyOpen]   = useState(false)
  const [presetOpen, setPresetOpen] = useState(false)
  const [resetOpen,  setResetOpen]  = useState(false)
  const [copySrc,    setCopySrc]    = useState('')

  const filtered = useMemo(() => users.filter(u => {
    if (!u.isActive || u.role === 'Super Admin') return false
    if (officeF !== 'all' && u.officeId !== officeF) return false
    if (roleF   !== 'all' && u.role     !== roleF)   return false
    if (search) {
      const q = search.toLowerCase()
      return `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
        || u.employeeId.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    }
    return true
  }), [users, search, officeF, roleF])

  const selUser   = useMemo(() => users.find(u => u.id === selId) ?? null,          [users, selId])
  const selOffice = useMemo(() => offices.find(o => o.id === selUser?.officeId),    [offices, selUser])

  const diff = useMemo(() => {
    if (!selUser || !editPerms) return []
    const orig = buildPerms(selUser.id, selUser.role, getAllUserPermissions)
    return SYSTEM_MODULES.flatMap(m =>
      (['create','read','update','delete'] as CRUDAction[])
        .filter(a => orig[m.id][a] !== editPerms[m.id][a])
        .map(a => ({ name: m.name, action: a, from: orig[m.id][a], to: editPerms[m.id][a] }))
    )
  }, [selUser, editPerms, getAllUserPermissions])

  const allSel = !!editPerms && SYSTEM_MODULES.every(m =>
    editPerms[m.id].create && editPerms[m.id].read && editPerms[m.id].update && editPerms[m.id].delete)

  const pick = useCallback((id: string) => {
    const u = users.find(x => x.id === id); if (!u) return
    setSelId(id); setEditPerms(buildPerms(id, u.role, getAllUserPermissions)); setDirty(false)
  }, [users, getAllUserPermissions])

  const togAction = useCallback((mid: ModuleId, a: CRUDAction) => {
    setEditPerms(p => p && ({ ...p, [mid]: { ...p[mid], [a]: !p[mid][a] } })); setDirty(true)
  }, [])

  const togRow = useCallback((mid: ModuleId) => {
    setEditPerms(p => {
      if (!p) return p
      const c = p[mid]; const nv = !(c.create && c.read && c.update && c.delete)
      return { ...p, [mid]: { create: nv, read: nv, update: nv, delete: nv } }
    }); setDirty(true)
  }, [])

  const togCol = useCallback((a: CRUDAction) => {
    setEditPerms(p => {
      if (!p) return p
      const nv = !SYSTEM_MODULES.every(m => p[m.id][a])
      const nx = { ...p }; SYSTEM_MODULES.forEach(m => { nx[m.id] = { ...nx[m.id], [a]: nv } }); return nx
    }); setDirty(true)
  }, [])

  const togAll = useCallback(() => {
    setEditPerms(p => {
      if (!p) return p
      const nv = !SYSTEM_MODULES.every(m => p[m.id].create && p[m.id].read && p[m.id].update && p[m.id].delete)
      const nx: Partial<EditPerms> = {}
      SYSTEM_MODULES.forEach(m => { nx[m.id] = { create: nv, read: nv, update: nv, delete: nv } })
      return nx as EditPerms
    }); setDirty(true)
  }, [])

  const doSave = useCallback(() => {
    if (!selUser || !editPerms || !currentUser) return
    setBulkPermissions(selUser.id, SYSTEM_MODULES.map(m => ({ moduleId: m.id, actions: editPerms[m.id] })), currentUser.id)
    addAudit({ userId: currentUser.id, action: 'Permission Updated', details: `${diff.length} change(s) for ${selUser.firstName} ${selUser.lastName}`, ipAddress: '127.0.0.1' })
    setDirty(false); setSaveOpen(false)
    toast.success(`Saved for ${selUser.firstName} ${selUser.lastName}`)
  }, [selUser, editPerms, currentUser, setBulkPermissions, addAudit, diff])

  const doReset = useCallback(() => {
    if (!selUser) return
    resetToRoleDefault(selUser.id, selUser.role)
    const d = ROLE_DEFAULT_PERMISSIONS[selUser.role as keyof typeof ROLE_DEFAULT_PERMISSIONS]
    const f: Partial<EditPerms> = {}; SYSTEM_MODULES.forEach(m => { f[m.id] = { ...d[m.id] } })
    setEditPerms(f as EditPerms); setDirty(false); setResetOpen(false)
    toast.success(`Reset to ${selUser.role} defaults`)
  }, [selUser, resetToRoleDefault])

  const doCopy = useCallback(() => {
    if (!selUser || !copySrc || !currentUser) return
    copyPermissions(copySrc, selUser.id, currentUser.id)
    setEditPerms(buildPerms(selUser.id, selUser.role, getAllUserPermissions))
    setDirty(false); setCopyOpen(false); setCopySrc('')
    const s = users.find(u => u.id === copySrc)
    toast.success(`Copied from ${s?.firstName} ${s?.lastName}`)
  }, [selUser, copySrc, currentUser, copyPermissions, getAllUserPermissions, users])

  const doPreset = useCallback((pid: string) => {
    if (!selUser || !currentUser) return
    applyPreset(pid, selUser.id, currentUser.id)
    setTimeout(() => {
      setEditPerms(buildPerms(selUser.id, selUser.role, getAllUserPermissions))
      setDirty(false); setPresetOpen(false)
      toast.success(`Applied: ${presets.find(p => p.id === pid)?.name}`)
    }, 0)
  }, [selUser, currentUser, applyPreset, getAllUserPermissions, presets])

  const { canAny } = usePermission()
  const t = useThemeClasses()
  if (!canAny('permissions', ['update'])) return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
      <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4">
        <Shield className="w-7 h-7 text-slate-400" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Access Restricted</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">Only Super Admins can manage module permissions.</p>
    </div>
  )

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-5">

        {/* ── Page header ── */}
        <div className={cn('flex items-center justify-between flex-wrap gap-3 rounded-xl px-5 py-4 border', t.pageHeaderBg, t.cardBorder)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={cn('text-[17px] font-bold leading-tight', t.pageHeaderTitle)}>Module Permission Access</h1>
              <p className={cn('text-[12px] mt-0.5', t.pageHeaderSub)}>Assign granular CRUD permissions per user per module</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {CRUD.map(a => (
              <span key={a.key} className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide', a.pill)}>
                {a.icon}{a.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">

          {/* ── LEFT panel ──────────────────────────────────────────── */}
          <div className={cn('rounded-xl overflow-hidden border', t.cardBg, t.cardBorder)}>

            <div className={cn('px-4 pt-4 pb-3 border-b', t.divider)}>
              <span className={cn('flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest', t.textSecondary)}>
                <Users className="w-3.5 h-3.5" />Select User
              </span>
            </div>

            <div className="px-3 pt-3 pb-3 space-y-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className={cn(
                    'w-full pl-8 pr-3 h-8 rounded-lg text-[13px] outline-none transition-colors border',
                    'focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                    'placeholder:text-slate-400',
                    t.inputBg, t.inputBorder, t.textPrimary,
                  )}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <Select value={officeF} onValueChange={setOfficeF}>
                  <SelectTrigger className={cn('h-8 text-[12px] flex-1 focus:ring-indigo-500', t.inputBg, t.inputBorder, t.textSecondary)}>
                    <Building2 className={cn('w-3 h-3 mr-1 shrink-0', t.textMuted)} />
                    <SelectValue placeholder="All Offices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Offices</SelectItem>
                    {offices.filter(o => o.isActive).map(o => <SelectItem key={o.id} value={o.id}>{o.code}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={roleF} onValueChange={setRoleF}>
                  <SelectTrigger className={cn('h-8 text-[12px] flex-1 focus:ring-indigo-500', t.inputBg, t.inputBorder, t.textSecondary)}>
                    <Filter className={cn('w-3 h-3 mr-1 shrink-0', t.textMuted)} />
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {['Admin','Department Head','Records Officer','Staff','Read Only'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className={cn('h-px', t.separator)} />

              {/* User list */}
              <ScrollArea className="h-[calc(100vh-390px)] min-h-64">
                <div className="space-y-0.5 pr-1">
                  {filtered.length === 0 && (
                    <p className={cn('text-center text-[13px] py-8', t.textMuted)}>No users found</p>
                  )}
                  {filtered.map(user => {
                    const off = offices.find(o => o.id === user.officeId)
                    const sel = selId === user.id
                    return (
                      <button key={user.id} onClick={() => pick(user.id)}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors',
                          sel ? 'bg-indigo-600' : t.listItemHover,
                        )}
                      >
                        <Avatar className="w-8 h-8 shrink-0 rounded-lg">
                          <AvatarFallback className={cn(
                            'text-[11px] font-bold rounded-lg',
                            sel ? 'bg-indigo-500 text-white' : cn(t.avatarBg, t.avatarText),
                          )}>
                            {getInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className={cn('text-[13px] font-semibold truncate', sel ? 'text-white' : t.textPrimary)}>
                            {user.firstName} {user.lastName}
                          </p>
                          <p className={cn('text-[11px] truncate', sel ? 'text-indigo-200' : t.textMuted)}>
                            {off?.code} · {user.role}
                          </p>
                        </div>
                        {sel && <ChevronRight className="w-4 h-4 text-indigo-200 shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* ── RIGHT panel ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Empty state */}
            {!selUser && (
              <div className={cn('flex flex-col items-center justify-center py-24 text-center rounded-xl border-2 border-dashed', t.cardBg, t.cardBorder)}>
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-4', t.inputBg)}>
                  <Shield className={cn('w-7 h-7', t.textMuted)} />
                </div>
                <p className={cn('font-semibold', t.textPrimary)}>Select a user to manage</p>
                <p className={cn('text-[13px] mt-1.5 max-w-[260px] leading-relaxed', t.textSecondary)}>
                  Choose a user from the left panel to view and edit their module permissions
                </p>
              </div>
            )}

            {selUser && (
              <>
                {/* User info bar */}
                <div className={cn('rounded-xl border', t.cardBg, t.cardBorder)}>
                  <div className="py-3.5 px-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 rounded-xl shrink-0">
                          <AvatarFallback className="rounded-xl bg-indigo-600 text-white font-bold text-[13px]">
                            {getInitials(selUser.firstName, selUser.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className={cn('font-bold text-[14px] leading-tight', t.textPrimary)}>
                            {selUser.firstName} {selUser.lastName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={cn('text-[12px]', t.textSecondary)}>{selOffice?.name}</span>
                            <span className={t.dotSep}>·</span>
                            <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-md', ROLE_BADGE[selUser.role] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')}>
                              {selUser.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Btn onClick={() => setPresetOpen(true)}><FileText className="w-3.5 h-3.5" />Apply Preset</Btn>
                        <Btn onClick={() => setCopyOpen(true)}><Copy className="w-3.5 h-3.5" />Copy From</Btn>
                        <Btn onClick={() => setResetOpen(true)}><RotateCcw className="w-3.5 h-3.5" />Reset Default</Btn>
                        <Btn
                          variant="primary" disabled={!dirty}
                          onClick={() => { if (diff.length === 0) { toast.info('No changes'); return } setSaveOpen(true) }}
                        >
                          <Save className="w-3.5 h-3.5" />Save Changes
                        </Btn>
                      </div>
                    </div>

                    {dirty && (
                      <div className={cn('mt-3 flex items-center gap-2 text-[12px] font-medium px-3 py-2 rounded-lg border', t.unsavedBg)}>
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        Unsaved changes — <strong className="mx-0.5">{diff.length}</strong> permission{diff.length !== 1 ? 's' : ''} modified
                      </div>
                    )}
                  </div>
                </div>

            {/* Permission table */}
                <div className={cn('rounded-xl border overflow-hidden', t.cardBg, t.cardBorder)}>
                  {isMobile ? (
                    <div className="space-y-3 p-3">
                      {MODULE_GROUPS.map(group => (
                        <div key={group} className="space-y-2">
                          <div className={cn('text-[10px] font-extrabold uppercase tracking-[1.2px] px-2 py-1 rounded-lg', t.groupRowBg, t.divider, t.groupRowText)}>
                            {group}
                          </div>
                          {SYSTEM_MODULES.filter(m => m.group === group).map(mod => {
                            const p = editPerms?.[mod.id]
                            const rowAll = p && p.create && p.read && p.update && p.delete
                            return (
                              <div key={mod.id} className={cn('p-3 rounded-xl border', t.cardBg, t.cardBorder)}>
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className={cn('text-[13px] font-semibold truncate', t.textPrimary)}>{mod.name}</p>
                                    <p className={cn('text-[11px] mt-0.5 truncate', t.textMuted)}>{mod.description}</p>
                                  </div>
                                  <Checkbox
                                    checked={!!rowAll} onCheckedChange={() => togRow(mod.id)}
                                    className={cn('data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500', t.chkBorder)}
                                  />
                                </div>
                                <div className="mt-3 grid grid-cols-4 gap-2">
                                  {CRUD.map(col => (
                                    <div key={col.key} className="flex flex-col items-center gap-1">
                                      <span className={cn('text-[10px] font-semibold uppercase tracking-wide', col.headText)}>{col.label}</span>
                                      <Toggle
                                        checked={p?.[col.key] ?? false}
                                        onChange={() => togAction(mod.id, col.key)}
                                        onBg={col.toggleOn}
                                        offBg={t.toggleOff}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[580px] lg:min-w-[900px] text-sm border-collapse">
      {/* ── Column widths ── module takes remaining space, each CRUD col is fixed */}
      <colgroup>
        <col />                          {/* module — flex fill */}
        <col className="w-[90px] md:w-[110px]" />   {/* Create  */}
        <col className="w-[90px] md:w-[110px]" />   {/* Read    */}
        <col className="w-[90px] md:w-[110px]" />   {/* Update  */}
        <col className="w-[90px] md:w-[110px]" />   {/* Delete  */}
      </colgroup>

      <thead className="sticky top-0 z-10">
        <tr className={cn(t.theadBg)}>

          {/* Module column header */}
          <th className={cn(
            'text-left px-5 py-3.5 border-b',
            t.theadBorder,
          )}>
            <div className="flex items-center gap-2.5">
              <Checkbox
                checked={allSel}
                onCheckedChange={togAll}
                className={cn(
                  'data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500',
                  t.isDark ? 'border-slate-500' : 'border-slate-400',
                )}
              />
              <span className={cn(
                'text-[10px] font-extrabold uppercase tracking-[1.2px]',
                t.theadText,
              )}>
                Module
              </span>
            </div>
          </th>

          {/* CRUD column headers */}
          {CRUD.map(col => (
            <th
              key={col.key}
              onClick={() => togCol(col.key)}
              className={cn(
                'px-4 py-3.5 text-center cursor-pointer select-none',
                'border-l border-b transition-colors',
                t.theadBorder,
                t.isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200',
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    'flex flex-col items-center gap-1.5 mx-auto',
                    col.headText,
                  )}>
                    {col.icon}
                    <span className="text-[10px] font-bold uppercase tracking-[0.8px] whitespace-nowrap">
                      {col.label}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Toggle all {col.label}
                </TooltipContent>
              </Tooltip>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {MODULE_GROUPS.map(group => (
          <React.Fragment key={group}>

            {/* ── Group separator row ── */}
            <tr>
              <td
                colSpan={5}
                className={cn(
                  'px-5 py-2 border-y',
                  'text-[10px] font-extrabold uppercase tracking-[1.2px]',
                  t.groupRowBg,
                  t.divider,
                  t.groupRowText,
                )}
              >
                {group}
              </td>
            </tr>

            {/* ── Module rows ── */}
            {SYSTEM_MODULES.filter(m => m.group === group).map(mod => {
              const p      = editPerms?.[mod.id]
              const rowAll = p && p.create && p.read && p.update && p.delete

              return (
                <tr
                  key={mod.id}
                  className={cn(
                    'border-b transition-colors',
                    t.cardBg,
                    t.rowBorder,
                    t.rowHover,
                  )}
                >
                  {/* Module name + description */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={!!rowAll}
                        onCheckedChange={() => togRow(mod.id)}
                        className={cn(
                          'mt-0.5 shrink-0',
                          'data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500',
                          t.chkBorder,
                        )}
                      />
                      <div className="min-w-0">
                        <p className={cn(
                          'text-[13px] font-semibold leading-tight truncate',
                          t.textPrimary,
                        )}>
                          {mod.name}
                        </p>
                        <p className={cn(
                          'text-[11px] mt-0.5 leading-snug line-clamp-2',
                          t.textMuted,
                        )}>
                          {mod.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Toggle cells — one per CRUD action */}
                  {CRUD.map(col => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3.5 text-center border-l align-middle whitespace-nowrap',
                        t.colBorder,
                      )}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-center">
                            <Toggle
                              checked={p?.[col.key] ?? false}
                              onChange={() => togAction(mod.id, col.key)}
                              onBg={col.toggleOn}
                              offBg={t.toggleOff}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs max-w-[200px]">
                          <p className="font-semibold">{col.label}: {mod.name}</p>
                          <p className="text-slate-400 mt-0.5">{mod.actions[col.key]}</p>
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
  </div>
)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Dialogs ─────────────────────────────────────────────────────── */}

      {/* Save */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className={cn('max-w-md border', t.dialogBg, t.dialogBorder)}>
          <DialogHeader>
            <DialogTitle className={cn('flex items-center gap-2 text-[15px]', t.textPrimary)}>
              <span className={cn('w-7 h-7 rounded-lg flex items-center justify-center', t.iconBgIndigo)}>
                <Save className={cn('w-3.5 h-3.5', t.iconIndigo)} />
              </span>
              Save Permission Changes?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-1">
            <p className={cn('text-[13px]', t.dialogText)}>
              Updating for <span className={cn('font-semibold', t.textPrimary)}>{selUser?.firstName} {selUser?.lastName}</span> ({selOffice?.code})
            </p>
            <p className={cn('text-[11px] font-bold uppercase tracking-wide', t.textMuted)}>{diff.length} change{diff.length !== 1 ? 's' : ''}</p>
            <div className={cn('max-h-44 overflow-y-auto space-y-1 rounded-lg border p-2', t.dialogListBg)}>
              {diff.map((ch, i) => (
                <div key={i} className={cn(
                  'flex items-center gap-2 text-[12px] font-medium px-2.5 py-1.5 rounded-md',
                  ch.to ? t.diffOn : t.diffOff,
                )}>
                  {ch.to ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                  <span>{ch.name} → <span className="capitalize">{ch.action}</span>: <span className="opacity-50">{ch.from ? 'ON' : 'OFF'}</span> → <strong>{ch.to ? 'ON' : 'OFF'}</strong></span>
                </div>
              ))}
            </div>
            <p className={cn('text-[11px]', t.textMuted)}>Changes take effect immediately.</p>
          </div>
          <DialogFooter>
            <Btn onClick={() => setSaveOpen(false)}>Cancel</Btn>
            <Btn variant="primary" onClick={doSave}><Check className="w-3.5 h-3.5" />Save &amp; Apply</Btn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className={cn('max-w-sm border', t.dialogBg, t.dialogBorder)}>
          <DialogHeader>
            <DialogTitle className={cn('flex items-center gap-2 text-[15px]', t.textPrimary)}>
              <span className={cn('w-7 h-7 rounded-lg flex items-center justify-center', t.iconBgAmber)}>
                <RotateCcw className={cn('w-3.5 h-3.5', t.iconAmber)} />
              </span>
              Reset to Role Defaults?
            </DialogTitle>
          </DialogHeader>
          <p className={cn('text-[13px] mt-1 leading-relaxed', t.dialogText)}>
            All permissions for <span className={cn('font-semibold', t.textPrimary)}>{selUser?.firstName} {selUser?.lastName}</span> will reset to{' '}
            <span className={cn('inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold mx-0.5', ROLE_BADGE[selUser?.role ?? ''] ?? (t.isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'))}>
              {selUser?.role}
            </span>{' '}defaults. Custom permissions will be overwritten.
          </p>
          <DialogFooter className="mt-4">
            <Btn onClick={() => setResetOpen(false)}>Cancel</Btn>
            <Btn variant="danger" onClick={doReset}>Reset Permissions</Btn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copy from */}
      <Dialog open={copyOpen} onOpenChange={setCopyOpen}>
        <DialogContent className={cn('max-w-sm border', t.dialogBg, t.dialogBorder)}>
          <DialogHeader>
            <DialogTitle className={cn('flex items-center gap-2 text-[15px]', t.textPrimary)}>
              <span className={cn('w-7 h-7 rounded-lg flex items-center justify-center', t.iconBgIndigo)}>
                <Copy className={cn('w-3.5 h-3.5', t.iconIndigo)} />
              </span>
              Copy Permissions From User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-1">
            <Label className={cn('text-[13px] font-semibold', t.copyLabel)}>Source user</Label>
            <Select value={copySrc} onValueChange={setCopySrc}>
              <SelectTrigger className={cn('text-[13px]', t.selectTrigger)}>
                <SelectValue placeholder="Choose a user…" />
              </SelectTrigger>
              <SelectContent>
                {users.filter(u => u.isActive && u.id !== selId && u.role !== 'Super Admin').map(u => (
                  <SelectItem key={u.id} value={u.id} className="text-[13px]">
                    {u.firstName} {u.lastName} <span className={t.textMuted}>({u.role})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className={cn('text-[12px] leading-relaxed', t.dialogText)}>
              All permissions will be copied to <span className={cn('font-medium', t.copyNote)}>{selUser?.firstName} {selUser?.lastName}</span>.
            </p>
          </div>
          <DialogFooter className="mt-2">
            <Btn onClick={() => { setCopyOpen(false); setCopySrc('') }}>Cancel</Btn>
            <Btn variant="primary" disabled={!copySrc} onClick={doCopy}>Copy Permissions</Btn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply preset */}
      <Dialog open={presetOpen} onOpenChange={setPresetOpen}>
        <DialogContent className={cn('max-w-md border', t.dialogBg, t.dialogBorder)}>
          <DialogHeader>
            <DialogTitle className={cn('text-[15px]', t.textPrimary)}>Apply Permission Preset</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 mt-1">
            {presets.map(p => (
              <button key={p.id} onClick={() => doPreset(p.id)}
                      className={cn('w-full text-left px-4 py-3 rounded-lg transition-colors group border', t.presetItem)}>
                <div className="flex items-center justify-between">
                  <p className={cn('text-[13px] font-semibold', t.presetName)}>
                    {p.name}
                  </p>
                  {p.isSystem && (
                    <span className={cn('text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border', t.presetSystem)}>
                      System
                    </span>
                  )}
                </div>
                <p className={cn('text-[12px] mt-0.5', t.presetDesc)}>{p.description}</p>
              </button>
            ))}
          </div>
          <DialogFooter className="mt-2">
            <Btn onClick={() => setPresetOpen(false)}>Cancel</Btn>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}