import { create } from 'zustand'
import type { Document, Office, User, Notification, AuditEntry, UserRole, DocumentStatus, RoutingEntry, Remark } from '@/types'
import { documents as mockDocs, offices as mockOffices, users as mockUsers, notifications as mockNotifs, auditTrail as mockAudit } from '@/lib/mockData'
import { generateTrackingCode } from '@/lib/utils'

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const credentials: Record<string, { password: string; userId: string }> = {
  'admin@trackgov.gov.ph': { password: 'admin2024', userId: 'usr-1' },
  'records@trackgov.gov.ph': { password: 'rec2024', userId: 'usr-2' },
  'dept@trackgov.gov.ph': { password: 'dept2024', userId: 'usr-3' },
  'staff@trackgov.gov.ph': { password: 'staff2024', userId: 'usr-4' },
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  login: (email, password) => {
    const cred = credentials[email]
    if (cred && cred.password === password) {
      const user = mockUsers.find(u => u.id === cred.userId)
      if (user) {
        set({ currentUser: user, isAuthenticated: true })
        return true
      }
    }
    return false
  },
  logout: () => set({ currentUser: null, isAuthenticated: false }),
}))

interface DocumentState {
  documents: Document[]
  addDocument: (doc: Omit<Document, 'id' | 'trackingCode' | 'dateCreated' | 'updatedAt'>) => Document
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  addRoutingEntry: (docId: string, entry: Omit<RoutingEntry, 'id'>) => void
  addRemark: (docId: string, remark: Omit<Remark, 'id'>) => void
  acknowledgeDocument: (docId: string, routingEntryId: string) => void
  getDocumentsByOffice: (officeId: string) => Document[]
  getIncomingDocuments: (officeId: string) => Document[]
  getOutgoingDocuments: (officeId: string) => Document[]
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: mockDocs,
  addDocument: (docData) => {
    const newDoc: Document = {
      ...docData,
      id: `doc-${Date.now()}`,
      trackingCode: generateTrackingCode(),
      dateCreated: new Date(),
      updatedAt: new Date(),
    }
    set(state => ({ documents: [newDoc, ...state.documents] }))
    return newDoc
  },
  updateDocument: (id, updates) => {
    set(state => ({
      documents: state.documents.map(doc =>
        doc.id === id ? { ...doc, ...updates, updatedAt: new Date() } : doc
      ),
    }))
  },
  deleteDocument: (id) => {
    set(state => ({ documents: state.documents.filter(doc => doc.id !== id) }))
  },
  addRoutingEntry: (docId, entry) => {
    set(state => ({
      documents: state.documents.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              routingHistory: [...doc.routingHistory, { ...entry, id: `rh-${Date.now()}` }],
              currentOfficeId: entry.toOfficeId,
              currentAssigneeId: entry.toUserId,
              status: mapActionToStatus(entry.action),
              updatedAt: new Date(),
            }
          : doc
      ),
    }))
  },
  addRemark: (docId, remark) => {
    set(state => ({
      documents: state.documents.map(doc =>
        doc.id === docId
          ? { ...doc, remarks: [...doc.remarks, { ...remark, id: `rem-${Date.now()}` }], updatedAt: new Date() }
          : doc
      ),
    }))
  },
  acknowledgeDocument: (docId, routingEntryId) => {
    set(state => ({
      documents: state.documents.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              routingHistory: doc.routingHistory.map(rh =>
                rh.id === routingEntryId ? { ...rh, isAcknowledged: true, receivedAt: new Date() } : rh
              ),
              updatedAt: new Date(),
            }
          : doc
      ),
    }))
  },
  getDocumentsByOffice: (officeId) => {
    return get().documents.filter(doc =>
      doc.currentOfficeId === officeId ||
      doc.originOfficeId === officeId ||
      doc.routingHistory.some(rh => rh.fromOfficeId === officeId || rh.toOfficeId === officeId)
    )
  },
  getIncomingDocuments: (officeId) => {
    return get().documents.filter(doc => doc.currentOfficeId === officeId)
  },
  getOutgoingDocuments: (officeId) => {
    return get().documents.filter(doc =>
      doc.originOfficeId === officeId && doc.currentOfficeId !== officeId
    )
  },
}))

function mapActionToStatus(action: RoutingEntry['action']): DocumentStatus {
  switch (action) {
    case 'For Review': return 'In Review'
    case 'For Signature': return 'For Signature'
    case 'For Action': return 'In Review'
    case 'Forwarded': return 'In Transit'
    case 'Returned': return 'Returned'
    case 'Approved': return 'Action Taken'
    case 'Disapproved': return 'Returned'
    case 'Filed': return 'Completed'
    case 'Endorsed': return 'In Transit'
    case 'For Information': return 'Received'
    case 'Noted': return 'Action Taken'
    default: return 'In Review'
  }
}

interface OfficeState {
  offices: Office[]
  addOffice: (office: Omit<Office, 'id'>) => void
  updateOffice: (id: string, updates: Partial<Office>) => void
  deleteOffice: (id: string) => void
}

export const useOfficeStore = create<OfficeState>((set) => ({
  offices: mockOffices,
  addOffice: (officeData) => {
    set(state => ({
      offices: [...state.offices, { ...officeData, id: `off-${Date.now()}` }],
    }))
  },
  updateOffice: (id, updates) => {
    set(state => ({
      offices: state.offices.map(o => o.id === id ? { ...o, ...updates } : o),
    }))
  },
  deleteOffice: (id) => {
    set(state => ({ offices: state.offices.filter(o => o.id !== id) }))
  },
}))

interface UserState {
  users: User[]
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
}

export const useUserStore = create<UserState>((set) => ({
  users: mockUsers,
  addUser: (userData) => {
    set(state => ({
      users: [...state.users, { ...userData, id: `usr-${Date.now()}`, createdAt: new Date() }],
    }))
  },
  updateUser: (id, updates) => {
    set(state => ({
      users: state.users.map(u => u.id === id ? { ...u, ...updates } : u),
    }))
  },
  deleteUser: (id) => {
    set(state => ({ users: state.users.filter(u => u.id !== id) }))
  },
}))

interface NotificationState {
  notifications: Notification[]
  markAsRead: (id: string) => void
  markAllAsRead: (userId: string) => void
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt'>) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: mockNotifs,
  markAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
    }))
  },
  markAllAsRead: (userId) => {
    set(state => ({
      notifications: state.notifications.map(n => n.userId === userId ? { ...n, isRead: true } : n),
    }))
  },
  addNotification: (notifData) => {
    set(state => ({
      notifications: [{ ...notifData, id: `notif-${Date.now()}`, createdAt: new Date() }, ...state.notifications],
    }))
  },
}))

interface AuditState {
  auditTrail: AuditEntry[]
  addEntry: (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => void
}

export const useAuditStore = create<AuditState>((set) => ({
  auditTrail: mockAudit,
  addEntry: (entryData) => {
    set(state => ({
      auditTrail: [{ ...entryData, id: `audit-${Date.now()}`, timestamp: new Date() }, ...state.auditTrail],
    }))
  },
}))
