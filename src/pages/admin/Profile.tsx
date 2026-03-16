import React from 'react'
import { useAuthStore, useOfficeStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { format } from 'date-fns'

export default function Profile() {
  const user = useAuthStore(s => s.currentUser)
  const offices = useOfficeStore(s => s.offices)
  const office = user ? offices.find(o => o.id === user.officeId) : undefined

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <p className="text-sm text-slate-500">No user information available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Your account details and settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-indigo-600 text-white text-xl font-bold">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-slate-500">{user.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user.email} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Office</Label>
                <Input value={office?.name ?? '—'} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input value={user.position} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={user.phone ?? '—'} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Last Login</Label>
                <Input value={user.lastLogin ? format(new Date(user.lastLogin), 'PPP p') : '—'} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Member Since</Label>
                <Input value={format(new Date(user.createdAt), 'PPP')} readOnly />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
