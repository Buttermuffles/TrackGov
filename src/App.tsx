import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PageLoader } from '@/components/ui/spinner'
import { useThemeStore } from '@/store/themeStore'
import AppLayout from '@/components/layout/AppLayout'

const Login = lazy(() => import('@/pages/auth/Login'))
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const Incoming = lazy(() => import('@/pages/documents/Incoming'))
const Outgoing = lazy(() => import('@/pages/documents/Outgoing'))
const Documents = lazy(() => import('@/pages/documents/Documents'))
const DocumentDetail = lazy(() => import('@/pages/documents/DocumentDetail'))
const Pending = lazy(() => import('@/pages/routing/Pending'))
const Routing = lazy(() => import('@/pages/routing/Routing'))
const RoutingMap = lazy(() => import('@/pages/routing/RoutingMap'))
const Offices = lazy(() => import('@/pages/admin/Offices'))
const UsersPage = lazy(() => import('@/pages/admin/Users'))
const Reports = lazy(() => import('@/pages/admin/Reports'))
const UserActivity = lazy(() => import('@/pages/admin/UserActivity'))
const Profile = lazy(() => import('@/pages/admin/Profile'))
const PublicTracker = lazy(() => import('@/pages/public/PublicTracker'))
const Settings = lazy(() => import('@/pages/admin/Settings'))
const Permissions = lazy(() => import('@/pages/admin/Permissions'))
const Notifications = lazy(() => import('@/pages/notifications/Notifications'))

export default function App() {
  const applyTheme = useThemeStore(s => s.applyTheme)

  useEffect(() => {
    applyTheme()
  }, [applyTheme])

  return (
    <BrowserRouter>

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
            <Route path="profile" element={<Profile />} />
            <Route path="reports" element={<Reports />} />
            <Route path="user-activity" element={<UserActivity />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="permissions" element={<Permissions />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

    </BrowserRouter>
  )
}
