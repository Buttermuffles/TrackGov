import React, { useState, useMemo, useEffect } from 'react'
import { useUserStore, useOfficeStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import PaginationControls from '@/components/shared/PaginationControls'
import { Switch } from '@/components/ui/switch'
import { getInitials } from '@/lib/utils'
import { toast } from 'sonner'
import type { User, UserRole } from '@/types'
import { Search, Plus, Pencil, Users as UsersIcon, Mail, Filter, X, LayoutGrid, LayoutList } from 'lucide-react'
import { usePermission } from '@/hooks/usePermission'

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-rose-100 text-rose-700 border border-rose-200',
  'Admin': 'bg-orange-100 text-orange-700 border border-orange-200',
  'Records Officer': 'bg-sky-100 text-sky-700 border border-sky-200',
  'Department Head': 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  'Staff': 'bg-slate-100 text-slate-700 border border-slate-200',
  'Read Only': 'bg-gray-100 text-gray-600 border border-gray-200',
}

const officeBadgeClass = 'border border-sky-200 bg-sky-50 text-sky-800 shadow-sm'
const activeStatusClass = 'border border-emerald-200 bg-emerald-50 text-emerald-700'
const inactiveStatusClass = 'border border-rose-200 bg-rose-50 text-rose-700'

export default function UsersPage() {
  const { can } = usePermission()
  const canCreateUser = can('users', 'create')
  const canEditUser = can('users', 'update')
  const { users: allUsers, addUser, updateUser } = useUserStore()
  const offices = useOfficeStore(s => s.offices)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [officeFilter, setOfficeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [view, setView] = useState<'table' | 'card'>('table')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('Staff')
  const [officeId, setOfficeId] = useState('')
  const [position, setPosition] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

  const filtered = useMemo(() => {
    let r = [...allUsers]
    if (search) { const q = search.toLowerCase(); r = r.filter(u => (u.firstName + ' ' + u.lastName).toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) }
    if (roleFilter !== 'all') r = r.filter(u => u.role === roleFilter)
    if (officeFilter !== 'all') r = r.filter(u => u.officeId === officeFilter)
    if (statusFilter !== 'all') r = r.filter(u => statusFilter === 'active' ? u.isActive : !u.isActive)
    return r
  }, [allUsers, search, roleFilter, officeFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  useEffect(() => {
    setPage(1)
  }, [search, roleFilter, officeFilter, statusFilter])

  useEffect(() => {
    setPage(1)
  }, [pageSize])

  const openAdd = () => { setEditing(null); setFirstName(''); setLastName(''); setEmail(''); setRole('Staff'); setOfficeId(''); setPosition(''); setIsActive(true); setShowForm(true) }
  const openEdit = (u: User) => { setEditing(u); setFirstName(u.firstName); setLastName(u.lastName); setEmail(u.email); setRole(u.role); setOfficeId(u.officeId); setPosition(u.position); setIsActive(u.isActive); setShowForm(true) }
  const handleSave = () => {
    if (!firstName || !lastName || !email || !officeId || !position) return
    const data = { firstName, lastName, email, role, officeId, position, isActive, employeeId: editing?.employeeId || `EMP-${Date.now()}` }
    try {
      if (editing) {
        updateUser(editing.id, data)
        toast.success('Item updated successfully.')
      } else {
        addUser(data)
        toast.success('Item created successfully.')
      }
      setShowForm(false)
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }
  const getOfficeName = (oid: string) => offices.find(o => o.id === oid)?.code || oid
  const roles: UserRole[] = ['Super Admin', 'Admin', 'Records Officer', 'Department Head', 'Staff', 'Read Only']
  const activeCount = [roleFilter, officeFilter, statusFilter].filter(v => v !== 'all').length

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div><h1 className="text-xl lg:text-2xl font-bold text-slate-900">User Management</h1><p className="text-sm text-slate-500 mt-1">{allUsers.length} users - {allUsers.filter(u => u.isActive).length} active</p></div>
        {canCreateUser && <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add User</Button>}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-9" /></div>
        <Button variant={showFilters ? 'default' : 'outline'} size="sm" onClick={() => setShowFilters(!showFilters)}><Filter className="w-4 h-4 mr-1" />Filters{activeCount > 0 && <Badge className="ml-1 text-[10px]" variant="secondary">{activeCount}</Badge>}</Button>
        <div className="flex border rounded-md overflow-hidden">
          <button
            type="button"
            title="Table view"
            className={`p-2 ${view === 'table' ? 'bg-blue-50 text-blue-700' : 'text-slate-400'}`}
            onClick={() => setView('table')}
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Card view"
            className={`p-2 ${view === 'card' ? 'bg-blue-50 text-blue-700' : 'text-slate-400'}`}
            onClick={() => setView('card')}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
      {showFilters && <Card><CardContent className="p-3"><div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger className="text-xs h-9"><SelectValue placeholder="Role" /></SelectTrigger><SelectContent><SelectItem value="all">All Roles</SelectItem>{roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
        <Select value={officeFilter} onValueChange={setOfficeFilter}><SelectTrigger className="text-xs h-9"><SelectValue placeholder="Office" /></SelectTrigger><SelectContent><SelectItem value="all">All Offices</SelectItem>{offices.map(o => <SelectItem key={o.id} value={o.id}>{o.code}</SelectItem>)}</SelectContent></Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="text-xs h-9"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select>
      </div>{activeCount > 0 && <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => { setRoleFilter('all'); setOfficeFilter('all'); setStatusFilter('all') }}><X className="w-3 h-3 mr-1" />Clear</Button>}</CardContent></Card>}
      {view === 'table' ? (
        <Card><CardContent className="p-0">
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Email</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Role</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Office</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Position</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(user => (
                <tr key={user.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="bg-linear-to-br from-indigo-600 to-sky-600 text-white text-[10px]">{getInitials(user.firstName, user.lastName)}</AvatarFallback></Avatar><div><p className="font-medium text-slate-900">{user.firstName} {user.lastName}</p></div></div></td>
                  <td className="px-4 py-3 text-sm text-slate-600"><div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" />{user.email}</div></td>
                  <td className="px-4 py-3"><span className={"text-[10px] px-2 py-0.5 rounded-full font-medium " + (roleColors[user.role] || 'bg-slate-100 text-slate-600')}>{user.role}</span></td>
                  <td className="px-4 py-3 text-xs"><Badge className={"text-[10px] " + officeBadgeClass}>{getOfficeName(user.officeId)}</Badge></td>
                  <td className="px-4 py-3 text-xs text-slate-600">{user.position}</td>
                  <td className="px-4 py-3 text-xs"><span className={(user.isActive ? activeStatusClass : inactiveStatusClass) + ' px-2 py-0.5 rounded-full'}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                  {canEditUser && <td className="px-4 py-3"><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(user)}><Pencil className="w-3 h-3" /></Button></td>}
                </tr>
              ))}
            </tbody>
          </table></div>
        </CardContent></Card>
      ) : (
        filtered.length === 0 ? (
          <div className="text-center py-12"><UsersIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-400">No users found</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {paginated.map(user => (
              <Card key={user.id} className="group h-full border-slate-200 bg-linear-to-b from-white to-slate-50 shadow-sm hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0"><AvatarFallback className="bg-linear-to-br from-indigo-600 to-sky-600 text-white text-[10px]">{getInitials(user.firstName, user.lastName)}</AvatarFallback></Avatar>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    {canEditUser && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(user)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Role</span>
                      <span className={"text-[10px] px-2 py-0.5 rounded-full font-medium " + (roleColors[user.role] || 'bg-slate-100 text-slate-600')}>{user.role}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Office</span>
                      <Badge className={"text-[10px] " + officeBadgeClass}>{getOfficeName(user.officeId)}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Position</span>
                      <span className="text-slate-700">{user.position}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Status</span>
                      <span className={(user.isActive ? activeStatusClass : inactiveStatusClass) + ' px-2 py-0.5 rounded-full'}>{user.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}

      {filtered.length > 0 && (
        <PaginationControls
          totalItems={filtered.length}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="users"
          compact={view === 'card'}
        />
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{editing ? 'Edit User' : 'Add New User'}</DialogTitle><DialogDescription>Fill in user details.</DialogDescription></DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>First Name <span className="text-red-500">*</span></Label><Input value={firstName} onChange={e => setFirstName(e.target.value)} /></div><div className="space-y-2"><Label>Last Name <span className="text-red-500">*</span></Label><Input value={lastName} onChange={e => setLastName(e.target.value)} /></div></div>
          <div className="space-y-2"><Label>Email <span className="text-red-500">*</span></Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Role <span className="text-red-500">*</span></Label><Select value={role} onValueChange={v => setRole(v as UserRole)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Office <span className="text-red-500">*</span></Label><Select value={officeId} onValueChange={setOfficeId}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{offices.map(o => <SelectItem key={o.id} value={o.id}>{o.code}</SelectItem>)}</SelectContent></Select></div></div>
          <div className="space-y-2"><Label>Position <span className="text-red-500">*</span></Label><Input value={position} onChange={e => setPosition(e.target.value)} /></div>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"><div><Label>Status</Label><p className="text-xs text-slate-500 mt-1">Control whether this user appears as active or inactive.</p></div><div className="flex items-center gap-3"><span className={"text-xs font-medium " + (isActive ? 'text-emerald-700' : 'text-rose-700')}>{isActive ? 'Active' : 'Inactive'}</span><Switch checked={isActive} onCheckedChange={setIsActive} /></div></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={handleSave} disabled={!firstName || !lastName || !email || !officeId || !position}>{editing ? 'Save' : 'Add User'}</Button></DialogFooter>
      </DialogContent></Dialog>
    </div>
  )
}
