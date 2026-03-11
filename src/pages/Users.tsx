import React, { useState, useMemo } from 'react'
import { useUserStore, useOfficeStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import type { User, UserRole } from '@/types'
import { Search, Plus, Edit, Users as UsersIcon, Mail } from 'lucide-react'

const roleColors: Record<string, string> = { 'Super Admin': 'bg-red-100 text-red-700', 'Admin': 'bg-red-100 text-red-700', 'Records Officer': 'bg-blue-100 text-blue-700', 'Department Head': 'bg-purple-100 text-purple-700', 'Staff': 'bg-slate-100 text-slate-700', 'Read Only': 'bg-gray-100 text-gray-500' }

export default function UsersPage() {
  const { users: allUsers, addUser, updateUser } = useUserStore()
  const offices = useOfficeStore(s => s.offices)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [officeFilter, setOfficeFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('Staff')
  const [officeId, setOfficeId] = useState('')
  const [position, setPosition] = useState('')

  const filtered = useMemo(() => {
    let r = [...allUsers]
    if (search) { const q = search.toLowerCase(); r = r.filter(u => (u.firstName + ' ' + u.lastName).toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) }
    if (roleFilter !== 'all') r = r.filter(u => u.role === roleFilter)
    if (officeFilter !== 'all') r = r.filter(u => u.officeId === officeFilter)
    return r
  }, [allUsers, search, roleFilter, officeFilter])

  const openAdd = () => { setEditing(null); setFirstName(''); setLastName(''); setEmail(''); setRole('Staff'); setOfficeId(''); setPosition(''); setShowForm(true) }
  const openEdit = (u: User) => { setEditing(u); setFirstName(u.firstName); setLastName(u.lastName); setEmail(u.email); setRole(u.role); setOfficeId(u.officeId); setPosition(u.position); setShowForm(true) }
  const handleSave = () => { if (!firstName || !lastName || !email || !officeId || !position) return; const data = { firstName, lastName, email, role, officeId, position, employeeId: `EMP-${Date.now()}` }; if (editing) updateUser(editing.id, data); else addUser({ ...data, isActive: true }); setShowForm(false) }
  const getOfficeName = (oid: string) => offices.find(o => o.id === oid)?.code || oid
  const roles: UserRole[] = ['Super Admin', 'Admin', 'Records Officer', 'Department Head', 'Staff', 'Read Only']

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div><h1 className="text-xl lg:text-2xl font-bold text-slate-900">User Management</h1><p className="text-sm text-slate-500 mt-1">{allUsers.length} users - {allUsers.filter(u => u.isActive).length} active</p></div>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add User</Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-9" /></div>
        <Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Role" /></SelectTrigger><SelectContent><SelectItem value="all">All Roles</SelectItem>{roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
        <Select value={officeFilter} onValueChange={setOfficeFilter}><SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Office" /></SelectTrigger><SelectContent><SelectItem value="all">All Offices</SelectItem>{offices.map(o => <SelectItem key={o.id} value={o.id}>{o.code}</SelectItem>)}</SelectContent></Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map(user => (
          <Card key={user.id} className="hover:shadow-md transition group"><CardContent className="p-4">
            <div className="flex items-start gap-3"><Avatar className="h-10 w-10 shrink-0"><AvatarFallback className="bg-navy text-white text-xs">{getInitials(user.firstName, user.lastName)}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1"><div className="flex items-start justify-between"><div><h3 className="text-sm font-semibold">{user.firstName} {user.lastName}</h3><p className="text-xs text-slate-500">{user.position}</p></div><Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => openEdit(user)}><Edit className="w-3 h-3" /></Button></div></div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2"><span className={"text-[10px] px-2 py-0.5 rounded-full font-medium " + (roleColors[user.role] || 'bg-slate-100 text-slate-600')}>{user.role}</span><Badge variant="outline" className="text-[10px]">{getOfficeName(user.officeId)}</Badge></div>
              <p className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3" />{user.email}</p>
            </div>
            <div className="mt-2 pt-2 border-t text-xs"><span className={user.isActive ? 'text-green-600' : 'text-slate-400'}>{user.isActive ? 'Active' : 'Inactive'}</span></div>
          </CardContent></Card>
        ))}
      </div>
      {filtered.length === 0 && <div className="text-center py-12"><UsersIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-400">No users found</p></div>}
      <Dialog open={showForm} onOpenChange={setShowForm}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{editing ? 'Edit User' : 'Add New User'}</DialogTitle><DialogDescription>Fill in user details.</DialogDescription></DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>First Name *</Label><Input value={firstName} onChange={e => setFirstName(e.target.value)} /></div><div className="space-y-2"><Label>Last Name *</Label><Input value={lastName} onChange={e => setLastName(e.target.value)} /></div></div>
          <div className="space-y-2"><Label>Email *</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Role *</Label><Select value={role} onValueChange={v => setRole(v as UserRole)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Office *</Label><Select value={officeId} onValueChange={setOfficeId}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{offices.map(o => <SelectItem key={o.id} value={o.id}>{o.code}</SelectItem>)}</SelectContent></Select></div></div>
          <div className="space-y-2"><Label>Position *</Label><Input value={position} onChange={e => setPosition(e.target.value)} /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={handleSave} disabled={!firstName || !lastName || !email || !officeId || !position}>{editing ? 'Save' : 'Add User'}</Button></DialogFooter>
      </DialogContent></Dialog>
    </div>
  )
}
