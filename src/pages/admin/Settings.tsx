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
import { usePermission } from '@/hooks/usePermission'

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
  const { can } = usePermission()
  const canEditGeneral = can('settings_general', 'update')
  const canEditTracking = can('settings_tracking', 'update')
  const canEditSla = can('settings_sla', 'update')
  const canEditNotifications = can('settings_notifications', 'update')

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

  function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
        <div className="min-w-[120px] text-sm font-semibold text-slate-700 md:text-right">{label}</div>
        <div className="flex-1">{children}</div>
      </div>
    )
  }

return (
  <div className="p-6 space-y-6">

    {/* Header */}
    <div className="space-y-1">
      <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
      <p className="text-sm text-slate-500">
        Manage system configuration and preferences
      </p>
    </div>

    <div className="flex flex-col lg:flex-row gap-6">

      {/* Sidebar */}
      <nav className="w-full lg:w-60 bg-white border border-slate-200 rounded-xl shadow-sm p-2">
        <div role="tablist" className="grid grid-cols-2 gap-1 lg:flex lg:flex-col">

          {tabs.map(tab => {

            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`
                flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition
                ${isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"}
                w-full justify-center lg:justify-start
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )

          })}

        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 space-y-6">

        {/* GENERAL */}
        {activeTab === "general" && (
          <Card className="border border-slate-200 shadow-sm rounded-xl">

            <CardHeader className="px-6 py-4 border-b bg-slate-50 rounded-t-xl">
              <CardTitle className="text-base font-semibold">
                Organization Profile
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldRow label="Name">
                  <Input
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    disabled={!canEditGeneral}
                  />
                </FieldRow>

                <FieldRow label="Code">
                  <Input
                    value={orgCode}
                    onChange={(e) => setOrgCode(e.target.value)}
                    disabled={!canEditGeneral}
                  />
                </FieldRow>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  rows={2}
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  disabled={!canEditGeneral}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldRow label="Phone">
                  <Input
                    value={orgPhone}
                    onChange={(e) => setOrgPhone(e.target.value)}
                    disabled={!canEditGeneral}
                  />
                </FieldRow>

                <FieldRow label="Email">
                  <Input
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    disabled={!canEditGeneral}
                  />
                </FieldRow>
              </div>

              <Separator />

              <div className="flex justify-end pt-2">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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

            <CardHeader className="px-6 py-4 border-b bg-slate-50">
              <CardTitle>Appearance</CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">

              {/* Font Family */}
              <div className="space-y-3">
                <Label>Font Family</Label>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {fontFamilies.map(font => (

                    <button
                      key={font.value}
                      onClick={() => setFontFamily(font.value)}
                      className={`
                      p-3 border rounded-lg text-center transition
                      ${fontFamily === font.value
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-blue-400"}
                      `}
                    >
                      <p style={{ fontFamily: font.value }} className="text-lg">
                        Aa
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {font.label}
                      </p>

                    </button>

                  ))}
                </div>

              </div>

              <Separator />

              {/* Font Size */}
              <div className="space-y-3">

                <Label>Font Size</Label>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                  {fontSizes.map(sz => (

                    <button
                      key={sz.value}
                      onClick={() => setFontSize(sz.value)}
                      className={`
                      p-3 border rounded-lg text-center transition
                      ${fontSize === sz.value
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-blue-400"}
                      `}
                    >
                      <p className="text-lg">Aa</p>

                      <p className="text-xs text-slate-500 mt-1">
                        {sz.label}
                      </p>

                    </button>

                  ))}

                </div>

              </div>

              <Separator />

              {/* Dark Mode */}
              <div className="space-y-3">

                <Label>Display Mode</Label>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">

                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">

                    {mode === "dark"
                      ? <Moon className="w-4 h-4" />
                      : <Sun className="w-4 h-4" />}

                    {mode === "dark" ? "Dark Mode" : "Light Mode"}

                  </div>

                  <Switch
                    checked={mode === "dark"}
                    onCheckedChange={(checked) => {
                      if ((checked && mode === "light") || (!checked && mode === "dark")) {
                        toggleMode()
                      }
                    }}
                  />

                </div>

              </div>

            </CardContent>

          </Card>
        )}

        {/* TRACKING */}
        {activeTab === "tracking" && (
          <Card className="border border-slate-200 shadow-sm rounded-xl">

            <CardHeader className="px-6 py-4 border-b bg-slate-50">
              <CardTitle>Tracking Code Format</CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FieldRow label="Prefix">
                  <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
                </FieldRow>

                <FieldRow label="Year">
                  <Select value={yearFormat} onValueChange={setYearFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">4 digit</SelectItem>
                      <SelectItem value="short">2 digit</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>

                <FieldRow label="Digits">
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
                </FieldRow>

                <FieldRow label="Separator">
                  <Select value={separator} onValueChange={setSeparator}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">Dash</SelectItem>
                      <SelectItem value="/">Slash</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>

              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-slate-500">Preview</p>
                <p className="font-mono text-xl font-bold text-blue-700 mt-1">
                  {prefix}-{yearFormat === "full" ? "2024" : "24"}-0001
                </p>
              </div>

              {canEditTracking && (
                <div className="flex justify-end pt-2">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>
        )}

        {/* SLA */}
        {activeTab === "sla" && (
          <Card className="border border-slate-200 shadow-sm rounded-xl">

            <CardHeader className="px-6 py-4 border-b bg-slate-50">
              <CardTitle>SLA Configuration</CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FieldRow label="Simple">
                  <Input type="number" value={slaSimple} onChange={(e) => setSlaSimple(e.target.value)} />
                </FieldRow>

                <FieldRow label="Complex">
                  <Input type="number" value={slaComplex} onChange={(e) => setSlaComplex(e.target.value)} />
                </FieldRow>

                <FieldRow label="Highly Technical">
                  <Input type="number" value={slaHighly} onChange={(e) => setSlaHighly(e.target.value)} />
                </FieldRow>

              </div>

              <FieldRow label="Warning before deadline">
                <Input type="number" value={slaNotifyDays} onChange={(e) => setSlaNotifyDays(e.target.value)} />
              </FieldRow>

              {canEditSla && (
                <div className="flex justify-end pt-2">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}

            </CardContent>

          </Card>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <Card className="border border-slate-200 shadow-sm rounded-xl">

            <CardHeader className="px-6 py-4 border-b bg-slate-50">
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-4">

              <div className="flex items-center justify-between p-4 bg-slate-50 border rounded-lg">

                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-slate-500">
                    Receive updates by email
                  </p>
                </div>

                <Switch
                  checked={emailNotif}
                  onCheckedChange={() => setEmailNotif(!emailNotif)}
                />

              </div>

              <Separator />

              <div className="space-y-3 text-sm">

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

              {canEditNotifications && (
                <div className="flex justify-end pt-2">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}

            </CardContent>

          </Card>
        )}

      </div>

    </div>

  </div>
)


}