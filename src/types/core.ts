export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Department Head'
  | 'Records Officer'
  | 'Staff'
  | 'Read Only'

export interface Office {
  id: string
  code: string
  name: string
  headId?: string
  parentOfficeId?: string
  staffCount: number
  isActive: boolean
  description?: string
}

export interface User {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  officeId: string
  role: UserRole
  position: string
  signature?: string
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'incoming' | 'action_required' | 'overdue' | 'system'
  title: string
  message: string
  documentId?: string
  isRead: boolean
  createdAt: Date
}

