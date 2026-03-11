export type DocumentType =
  | 'Letter' | 'Memorandum' | 'Resolution' | 'Ordinance'
  | 'Contract' | 'Report' | 'Request' | 'Petition'
  | 'Certificate' | 'Voucher' | 'Purchase Order' | 'Other'

export type Classification = 'Routine' | 'Priority' | 'Confidential' | 'Top Secret'

export type Priority = 'Low' | 'Normal' | 'High' | 'Urgent'

export type DocumentStatus =
  | 'Received'
  | 'In Review'
  | 'For Signature'
  | 'For Routing'
  | 'In Transit'
  | 'Action Taken'
  | 'Returned'
  | 'Completed'
  | 'On Hold'
  | 'Cancelled'

export type RoutingAction =
  | 'Forwarded' | 'Returned' | 'Endorsed' | 'For Signature'
  | 'For Review' | 'For Action' | 'For Information' | 'Approved'
  | 'Disapproved' | 'Noted' | 'Filed'

export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Department Head'
  | 'Records Officer'
  | 'Staff'
  | 'Read Only'

export interface Attachment {
  id: string
  filename: string
  fileSize: number
  fileType: string
  url: string
  uploadedBy: string
  uploadedAt: Date
}

export interface Remark {
  id: string
  documentId: string
  userId: string
  content: string
  isInternal: boolean
  createdAt: Date
}

export interface RoutingEntry {
  id: string
  documentId: string
  fromOfficeId: string
  toOfficeId: string
  fromUserId: string
  toUserId?: string
  action: RoutingAction
  remarks: string
  attachments?: Attachment[]
  timestamp: Date
  receivedAt?: Date
  dueDate?: Date
  isAcknowledged: boolean
}

export interface Document {
  id: string
  trackingCode: string
  title: string
  description: string
  documentType: DocumentType
  classification: Classification
  priority: Priority
  originatorId: string
  originOfficeId: string
  currentOfficeId: string
  currentAssigneeId?: string
  status: DocumentStatus
  attachments: Attachment[]
  routingHistory: RoutingEntry[]
  remarks: Remark[]
  dueDate?: Date
  dateReceived: Date
  dateCreated: Date
  updatedAt: Date
  tags: string[]
  referenceNumber?: string
  isConfidential: boolean
  qrCode?: string
}

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

export interface AuditEntry {
  id: string
  timestamp: Date
  userId: string
  action: string
  documentId?: string
  officeId?: string
  details: string
  ipAddress: string
}
