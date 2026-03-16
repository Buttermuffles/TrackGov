import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useThemeStore, type FontFamily, type FontSize } from "@/store/themeStore"
import { useAuthStore } from "@/store"

import {
  Building2,
  Bell,
  Clock,
  FileText,
  Save,
  Palette,
  Type,
  Sun,
  Moon
} from "lucide-react"

export default function Settings() {

  const currentUser = useAuthStore(s => s.currentUser)
  const isSuperAdmin = currentUser?.role === 'Super Admin'

  const [activeTab, setActiveTab] = useState("general")

  const [orgName, setOrgName] = useState("Municipal Government of San Isidro")
  const [orgCode, setOrgCode] = useState("LGU-SI")
  const [orgAddress, setOrgAddress] = useState("Municipal Hall, San Isidro, Nueva Ecija")
  const [orgPhone, setOrgPhone] = useState("(044) 123-4567")
  const [orgEmail, setOrgEmail] = useState("info@sanisidro.gov.ph")

  const [prefix, setPrefix] = useState("DOC")
  const [yearFormat, setYearFormat] = useState("full")
  const [seqDigits, setSeqDigits] = useState("4")
  const [separator, setSeparator] = useState("-")

  const [slaSimple, setSlaSimple] = useState("3")
  const [slaComplex, setSlaComplex] = useState("7")
  const [slaHighly, setSlaHighly] = useState("20")
  const [slaNotifyDays, setSlaNotifyDays] = useState("1")

  const [emailNotif, setEmailNotif] = useState(true)
  const [notifOverdue, setNotifOverdue] = useState(true)
  const [notifRouted, setNotifRouted] = useState(true)
  const [notifAck, setNotifAck] = useState(true)

  const { fontFamily, fontSize, mode, setFontFamily, setFontSize, toggleMode } = useThemeStore()

  const tabs = [
    { id: "general", label: "General", icon: Building2 },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "tracking", label: "Tracking Codes", icon: FileText },
    { id: "sla", label: "SLA", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell }
  ]

  const fontFamilies: { value: FontFamily; label: string }[] = [
    { value: "Inter", label: "Inter" },
    { value: "Poppins", label: "Poppins" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Lato", label: "Lato" }
  ]

  const fontSizes: { value: FontSize; label: string }[] = [
    { value: "small", label: "Small" },
    { value: "default", label: "Default" },
    { value: "large", label: "Large" },
    { value: "x-large", label: "Extra Large" }
  ]

  return (
    <div className="space-y-6">

      {/* Page Header */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="text-sm text-slate-500">Manage system configuration and preferences</p>
      </div>

      <div className="flex gap-6">

        {/* Sidebar */}

        <nav className="w-56 bg-white border border-slate-200 rounded-xl shadow-sm p-2 space-y-1">

          {tabs.map(tab => {

            const Icon = tab.icon

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition
                ${activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"}
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* Content */}

        <div className="flex-1 space-y-6">

          {/* GENERAL */}

          {activeTab === "general" && (

            <Card className="border border-slate-200 shadow-sm rounded-xl">

              <CardHeader className="border-b bg-slate-50 rounded-t-xl">
                <CardTitle className="text-base font-semibold">
                  Organization Profile
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} disabled={!isSuperAdmin} />
                  </div>

                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input value={orgCode} onChange={(e) => setOrgCode(e.target.value)} disabled={!isSuperAdmin} />
                  </div>

                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea rows={2} value={orgAddress} onChange={(e) => setOrgAddress(e.target.value)} disabled={!isSuperAdmin} />
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)} disabled={!isSuperAdmin} />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} disabled={!isSuperAdmin} />
                  </div>

                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!isSuperAdmin}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>

              </CardContent>
            </Card>
          )}

          {/* APPEARANCE */}

          {activeTab === "appearance" && (

            <Card className="border border-slate-200 shadow-sm rounded-xl">

              <CardHeader className="border-b bg-slate-50">
                <CardTitle>Appearance</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">

                  <Label>Font Family</Label>

                  <div className="grid grid-cols-3 gap-3">

                    {fontFamilies.map(font => (

                      <button
                        key={font.value}
                        onClick={() => setFontFamily(font.value)}
                        className={`
                        p-3 border rounded-lg text-center
                        ${fontFamily === font.value
                            ? "border-blue-600"
                            : "border-slate-200 hover:border-blue-400"}
                        `}
                      >

                        <p style={{ fontFamily: font.value }} className="text-lg">
                          Aa
                        </p>

                        <p className="text-xs text-slate-500">
                          {font.label}
                        </p>

                      </button>

                    ))}

                  </div>

                </div>

                <Separator />

                <div className="space-y-3">

                  <Label>Font Size</Label>

                  <div className="grid grid-cols-3 gap-3">

                    {fontSizes.map(sz => (
                      <button
                        key={sz.value}
                        onClick={() => setFontSize(sz.value)}
                        className={`
                        p-3 border rounded-lg text-center
                        ${fontSize === sz.value
                            ? "border-blue-600"
                            : "border-slate-200 hover:border-blue-400"}
                        `}
                      >
                        <p className="text-lg" style={{ fontSize: sz.value === 'small' ? '0.75rem' : sz.value === 'large' ? '1.25rem' : sz.value === 'x-large' ? '1.5rem' : '1rem' }}>
                          Aa
                        </p>
                        <p className="text-xs text-slate-500">
                          {sz.label}
                        </p>
                      </button>
                    ))}

                  </div>

                </div>

                <Separator />

                <div className="space-y-3">

                  <Label>Display Mode</Label>

                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      {mode === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      {mode === "dark" ? "Dark" : "Light"} Mode
                    </div>
                    <Switch
                      checked={mode === "dark"}
                      onCheckedChange={(checked) => {
                        if ((checked && mode === "light") || (!checked && mode === "dark")) {
                          toggleMode()
                        }
                      }}
                      aria-label="Toggle display mode"
                    />
                  </div>

                </div>

              </CardContent>
            </Card>
          )}

          {/* TRACKING */}

          {activeTab === "tracking" && (

            <Card className="border border-slate-200 shadow-sm rounded-xl">

              <CardHeader className="border-b bg-slate-50">
                <CardTitle>Tracking Code Format</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">

                <div className="grid grid-cols-4 gap-4">

                  <div className="space-y-2">
                    <Label>Prefix</Label>
                    <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Year</Label>

                    <Select value={yearFormat} onValueChange={setYearFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="full">4 digit</SelectItem>
                        <SelectItem value="short">2 digit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Digits</Label>

                    <Select value={seqDigits} onValueChange={setSeqDigits}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Separator</Label>

                    <Select value={separator} onValueChange={setSeparator}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="-">Dash</SelectItem>
                        <SelectItem value="/">Slash</SelectItem>
                      </SelectContent>
                    </Select>

                  </div>

                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">

                  <p className="text-xs text-slate-500">
                    Preview
                  </p>

                  <p className="font-mono text-xl font-bold text-blue-700 mt-1">
                    {prefix}-{yearFormat === "full" ? "2024" : "24"}-0001
                  </p>

                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>

              </CardContent>
            </Card>
          )}

          {/* SLA */}

          {activeTab === "sla" && (

            <Card className="border border-slate-200 shadow-sm rounded-xl">

              <CardHeader className="border-b bg-slate-50">
                <CardTitle>SLA Configuration</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">

                <div className="grid grid-cols-3 gap-4">

                  <div className="space-y-2">
                    <Label>Simple</Label>
                    <Input type="number" value={slaSimple} onChange={(e) => setSlaSimple(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Complex</Label>
                    <Input type="number" value={slaComplex} onChange={(e) => setSlaComplex(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Highly Technical</Label>
                    <Input type="number" value={slaHighly} onChange={(e) => setSlaHighly(e.target.value)} />
                  </div>

                </div>

                <div className="space-y-2">
                  <Label>Warning before deadline</Label>
                  <Input type="number" value={slaNotifyDays} onChange={(e) => setSlaNotifyDays(e.target.value)} />
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>

              </CardContent>
            </Card>
          )}

          {/* NOTIFICATIONS */}

          {activeTab === "notifications" && (

            <Card className="border border-slate-200 shadow-sm rounded-xl">

              <CardHeader className="border-b bg-slate-50">
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                <div className="flex items-center justify-between p-3 bg-slate-50 border rounded-lg">

                  <div>
                    <p className="text-sm font-medium">
                      Email Notifications
                    </p>
                    <p className="text-xs text-slate-500">
                      Receive updates by email
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={emailNotif}
                    onChange={() => setEmailNotif(!emailNotif)}
                  />

                </div>

                <Separator />

                <div className="space-y-2 text-sm">

                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={notifOverdue} onChange={(e) => setNotifOverdue(e.target.checked)} />
                    Document overdue
                  </label>

                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={notifRouted} onChange={(e) => setNotifRouted(e.target.checked)} />
                    Routed to my office
                  </label>

                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={notifAck} onChange={(e) => setNotifAck(e.target.checked)} />
                    Document acknowledged
                  </label>

                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>

              </CardContent>
            </Card>
          )}

        </div>

      </div>

    </div>
  )
}