import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Incoming from '@/pages/Incoming'
import Outgoing from '@/pages/Outgoing'
import Documents from '@/pages/Documents'
import DocumentDetail from '@/pages/DocumentDetail'
import Pending from '@/pages/Pending'
import Offices from '@/pages/Offices'
import UsersPage from '@/pages/Users'
import Reports from '@/pages/Reports'
import Audit from '@/pages/Audit'
import PublicTracker from '@/pages/PublicTracker'
import Settings from '@/pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/track" element={<PublicTracker />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="incoming" element={<Incoming />} />
          <Route path="outgoing" element={<Outgoing />} />
          <Route path="documents" element={<Documents />} />
          <Route path="documents/:id" element={<DocumentDetail />} />
          <Route path="pending" element={<Pending />} />
          <Route path="offices" element={<Offices />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="reports" element={<Reports />} />
          <Route path="audit" element={<Audit />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
