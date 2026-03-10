import { Routes, Route, Navigate } from 'react-router-dom'
import { DashboardPage } from './pages/Dashboard'
import { IncomingPage } from './pages/Incoming'
import { DocumentsPage } from './pages/Documents'
import { OutgoingPage } from './pages/Outgoing'
import { RoutingPage } from './pages/Routing'
import { OfficesPage } from './pages/Offices'
import { UsersPage } from './pages/Users'
import { ReportsPage } from './pages/Reports'
import { PublicTrackerPage } from './pages/PublicTracker'
import { SettingsPage } from './pages/Settings'
import { RoutingMapPage } from './pages/RoutingMap'
import { PendingPage } from './pages/Pending'
import { AuditTrailPage } from './pages/AuditTrail'
import { LoginPage } from './pages/Login'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/incoming" element={<IncomingPage />} />
       {/* Documents */}
      <Route path="/outgoing" element={<OutgoingPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/pending" element={<PendingPage />} />
      {/* Routing */}
      <Route path="/routing" element={<RoutingPage />} />
      <Route path="/routing-map" element={<RoutingMapPage />} />
      {/* Management */}
      <Route path="/offices" element={<OfficesPage />} />
      <Route path="/users" element={<UsersPage />} />
      {/* Reports */}
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/audit-trail" element={<AuditTrailPage />} />
      {/* System */}
      <Route path="/settings" element={<SettingsPage />} />
      {/* Public + Auth */}
      <Route path="/track" element={<PublicTrackerPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

