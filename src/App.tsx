import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PageLoader } from '@/components/ui/spinner'
import { useThemeStore } from '@/store/themeStore'
import AppLayout from '@/components/layout/AppLayout'

const Login = lazy(() => import('@/pages/Login'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Incoming = lazy(() => import('@/pages/Incoming'))
const Outgoing = lazy(() => import('@/pages/Outgoing'))
const Documents = lazy(() => import('@/pages/Documents'))
const DocumentDetail = lazy(() => import('@/pages/DocumentDetail'))
const Pending = lazy(() => import('@/pages/Pending'))
const Routing = lazy(() => import('@/pages/Routing'))
const RoutingMap = lazy(() => import('@/pages/RoutingMap'))
const Offices = lazy(() => import('@/pages/Offices'))
const UsersPage = lazy(() => import('@/pages/Users'))
const Reports = lazy(() => import('@/pages/Reports'))
const Audit = lazy(() => import('@/pages/Audit'))
const PublicTracker = lazy(() => import('@/pages/PublicTracker'))
const Settings = lazy(() => import('@/pages/Settings'))
const Permissions = lazy(() => import('@/pages/Permissions'))

export default function App() {
  const applyTheme = useThemeStore(s => s.applyTheme)

  useEffect(() => {
    applyTheme()
  }, [applyTheme])

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader message="Loading page..." />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/track" element={<PublicTracker />} />

          {/* Protected routes */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="incoming" element={<Incoming />} />
            <Route path="outgoing" element={<Outgoing />} />
            <Route path="documents" element={<Documents />} />
            <Route path="documents/:id" element={<DocumentDetail />} />
            <Route path="pending" element={<Pending />} />
            <Route path="routing" element={<Routing />} />
            <Route path="routing-map" element={<RoutingMap />} />
            <Route path="offices" element={<Offices />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="reports" element={<Reports />} />
            <Route path="audit" element={<Audit />} />
            <Route path="settings" element={<Settings />} />
            <Route path="permissions" element={<Permissions />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
