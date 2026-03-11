import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building2, Bell, Clock, FileText, Save } from 'lucide-react'

export default function Settings() {
  const [orgName, setOrgName] = useState('Municipal Government of San Isidro')
  const [orgCode, setOrgCode] = useState('LGU-SI')
  const [orgAddress, setOrgAddress] = useState('Municipal Hall, San Isidro, Nueva Ecija')
  const [orgPhone, setOrgPhone] = useState('(044) 123-4567')
  const [orgEmail, setOrgEmail] = useState('info@sanisidro.gov.ph')
  const [prefix, setPrefix] = useState('DOC')
  const [yearFormat, setYearFormat] = useState('full')
  const [seqDigits, setSeqDigits] = useState('4')
  const [separator, setSep] = useState('-')
  const [slaSimple, setSlaSimple] = useState('3')
  const [slaComplex, setSlaComplex] = useState('7')
  const [slaHighly, setSlaHighly] = useState('20')
  const [slaNotifyDays, setSlaNotifyDays] = useState('1')
  const [emailNotif, setEmailNotif] = useState(true)
  const [notifOverdue, setNotifOverdue] = useState(true)
  const [notifRouted, setNotifRouted] = useState(true)
  const [notifAck, setNotifAck] = useState(true)

  return (
    <div className="space-y-4 lg:space-y-6">
      <div><h1 className="text-xl lg:text-2xl font-bold text-slate-900">System Settings</h1><p className="text-sm text-slate-500 mt-1">Configure system preferences</p></div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex flex-wrap"><TabsTrigger value="general"><Building2 className="w-3.5 h-3.5 mr-1" />General</TabsTrigger><TabsTrigger value="tracking"><FileText className="w-3.5 h-3.5 mr-1" />Tracking Codes</TabsTrigger><TabsTrigger value="sla"><Clock className="w-3.5 h-3.5 mr-1" />SLA</TabsTrigger><TabsTrigger value="notifications"><Bell className="w-3.5 h-3.5 mr-1" />Notifications</TabsTrigger></TabsList>
        <TabsContent value="general"><Card><CardHeader><CardTitle className="text-sm">Organization Profile</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label>Name</Label><Input value={orgName} onChange={e => setOrgName(e.target.value)} /></div><div className="space-y-2"><Label>Code</Label><Input value={orgCode} onChange={e => setOrgCode(e.target.value)} /></div></div>
          <div className="space-y-2"><Label>Address</Label><Textarea value={orgAddress} onChange={e => setOrgAddress(e.target.value)} rows={2} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label>Phone</Label><Input value={orgPhone} onChange={e => setOrgPhone(e.target.value)} /></div><div className="space-y-2"><Label>Email</Label><Input value={orgEmail} onChange={e => setOrgEmail(e.target.value)} type="email" /></div></div>
          <Separator /><div className="flex justify-end"><Button><Save className="w-4 h-4 mr-2" />Save</Button></div>
        </CardContent></Card></TabsContent>
        <TabsContent value="tracking"><Card><CardHeader><CardTitle className="text-sm">Tracking Code Format</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2"><Label>Prefix</Label><Input value={prefix} onChange={e => setPrefix(e.target.value)} /></div>
            <div className="space-y-2"><Label>Year</Label><Select value={yearFormat} onValueChange={setYearFormat}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="full">4-digit</SelectItem><SelectItem value="short">2-digit</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Digits</Label><Select value={seqDigits} onValueChange={setSeqDigits}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="3">3</SelectItem><SelectItem value="4">4</SelectItem><SelectItem value="5">5</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Separator</Label><Select value={separator} onValueChange={setSep}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="-">Dash</SelectItem><SelectItem value="/">Slash</SelectItem><SelectItem value=".">Dot</SelectItem></SelectContent></Select></div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border"><p className="text-xs text-slate-500">Preview:</p><p className="font-mono text-lg text-blue-700 font-bold mt-1">{prefix}{separator}{yearFormat === 'full' ? '2024' : '24'}{separator}{'0'.repeat(parseInt(seqDigits) - 1)}1</p></div>
          <div className="flex justify-end"><Button><Save className="w-4 h-4 mr-2" />Save</Button></div>
        </CardContent></Card></TabsContent>
        <TabsContent value="sla"><Card><CardHeader><CardTitle className="text-sm">SLA Configuration (Processing Days)</CardTitle></CardHeader><CardContent className="space-y-4">
          <p className="text-xs text-slate-500">Maximum working days per RA 11032.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Simple</Label><div className="flex items-center gap-2"><Input type="number" value={slaSimple} onChange={e => setSlaSimple(e.target.value)} className="w-20" /><span className="text-sm text-slate-500">days</span></div></div>
            <div className="space-y-2"><Label>Complex</Label><div className="flex items-center gap-2"><Input type="number" value={slaComplex} onChange={e => setSlaComplex(e.target.value)} className="w-20" /><span className="text-sm text-slate-500">days</span></div></div>
            <div className="space-y-2"><Label>Highly Technical</Label><div className="flex items-center gap-2"><Input type="number" value={slaHighly} onChange={e => setSlaHighly(e.target.value)} className="w-20" /><span className="text-sm text-slate-500">days</span></div></div>
          </div>
          <Separator />
          <div className="space-y-2"><Label>Warning before deadline</Label><div className="flex items-center gap-2"><Input type="number" value={slaNotifyDays} onChange={e => setSlaNotifyDays(e.target.value)} className="w-20" /><span className="text-sm text-slate-500">days</span></div></div>
          <div className="flex justify-end"><Button><Save className="w-4 h-4 mr-2" />Save</Button></div>
        </CardContent></Card></TabsContent>
        <TabsContent value="notifications"><Card><CardHeader><CardTitle className="text-sm">Notification Preferences</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"><div><p className="text-sm font-medium">Email Notifications</p><p className="text-xs text-slate-500">Receive updates via email</p></div>
            <button onClick={() => setEmailNotif(!emailNotif)} className={"w-10 h-6 rounded-full transition relative " + (emailNotif ? 'bg-blue-600' : 'bg-slate-300')}><span className={"absolute top-1 w-4 h-4 rounded-full bg-white transition-transform " + (emailNotif ? 'left-5' : 'left-1')} /></button>
          </div>
          <Separator /><p className="text-xs font-medium text-slate-700">Notify me when:</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={notifOverdue} onChange={e => setNotifOverdue(e.target.checked)} className="rounded" />Document is overdue</label>
            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={notifRouted} onChange={e => setNotifRouted(e.target.checked)} className="rounded" />Document routed to my office</label>
            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={notifAck} onChange={e => setNotifAck(e.target.checked)} className="rounded" />Document acknowledged</label>
          </div>
          <div className="flex justify-end"><Button><Save className="w-4 h-4 mr-2" />Save</Button></div>
        </CardContent></Card></TabsContent>
      </Tabs>
    </div>
  )
}
