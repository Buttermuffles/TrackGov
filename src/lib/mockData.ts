import { Document, DocumentStatus, Priority } from '../types/document'
import { Notification, Office, User, UserRole } from '../types/core'

const offices: Office[] = [
  {
    id: 'office-osec',
    code: 'OSEC',
    name: 'Office of the Secretary / Mayor',
    staffCount: 8,
    isActive: true,
    description: 'Head of Agency',
  },
  {
    id: 'office-hrmo',
    code: 'HRMO',
    name: 'Human Resource Management Office',
    staffCount: 12,
    isActive: true,
  },
  {
    id: 'office-bplo',
    code: 'BPLO',
    name: 'Business Permits & Licensing Office',
    staffCount: 18,
    isActive: true,
  },
  {
    id: 'office-enro',
    code: 'ENRO',
    name: 'Environment & Natural Resources Office',
    staffCount: 10,
    isActive: true,
  },
  {
    id: 'office-bfad',
    code: 'BFAD',
    name: 'Budget & Finance Administration Division',
    staffCount: 16,
    isActive: true,
  },
  {
    id: 'office-mpdo',
    code: 'MPDO',
    name: 'Municipal Planning & Development Office',
    staffCount: 9,
    isActive: true,
  },
  {
    id: 'office-cswdo',
    code: 'CSWDO',
    name: 'Community & Social Welfare Development Office',
    staffCount: 14,
    isActive: true,
  },
  {
    id: 'office-records',
    code: 'RECORDS',
    name: 'Office of the Records Officer',
    staffCount: 6,
    isActive: true,
  },
]

const makeUser = (
  id: string,
  opts: {
    employeeId: string
    firstName: string
    lastName: string
    email: string
    officeCode: string
    role: UserRole
    position: string
  },
): User => {
  const office = offices.find((o) => o.code === opts.officeCode)!
  return {
    id,
    employeeId: opts.employeeId,
    firstName: opts.firstName,
    lastName: opts.lastName,
    email: opts.email,
    officeId: office.id,
    role: opts.role,
    position: opts.position,
    isActive: true,
    createdAt: new Date('2024-01-10T08:00:00'),
  }
}

const users: User[] = [
  makeUser('user-admin-1', {
    employeeId: 'ADM-0001',
    firstName: 'Ana',
    lastName: 'Santos',
    email: 'admin@trackgov.gov.ph',
    officeCode: 'OSEC',
    role: 'Super Admin',
    position: 'System Administrator',
  }),
  makeUser('user-admin-2', {
    employeeId: 'ADM-0002',
    firstName: 'Marco',
    lastName: 'Reyes',
    email: 'itadmin@trackgov.gov.ph',
    officeCode: 'RECORDS',
    role: 'Admin',
    position: 'IT Officer',
  }),
  makeUser('user-records-1', {
    employeeId: 'REC-0101',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    email: 'records@trackgov.gov.ph',
    officeCode: 'RECORDS',
    role: 'Records Officer',
    position: 'Records Officer',
  }),
  makeUser('user-records-2', {
    employeeId: 'REC-0102',
    firstName: 'Liza',
    lastName: 'Domingo',
    email: 'records2@trackgov.gov.ph',
    officeCode: 'RECORDS',
    role: 'Records Officer',
    position: 'Senior Records Clerk',
  }),
  makeUser('user-depthead-1', {
    employeeId: 'DH-0201',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'dept@trackgov.gov.ph',
    officeCode: 'BFAD',
    role: 'Department Head',
    position: 'Budget Officer',
  }),
  makeUser('user-depthead-2', {
    employeeId: 'DH-0202',
    firstName: 'Roberto',
    lastName: 'Lim',
    email: 'bplo.head@trackgov.gov.ph',
    officeCode: 'BPLO',
    role: 'Department Head',
    position: 'BPLO Chief',
  }),
  makeUser('user-staff-1', {
    employeeId: 'STF-0301',
    firstName: 'Paolo',
    lastName: 'Garcia',
    email: 'staff@trackgov.gov.ph',
    officeCode: 'BFAD',
    role: 'Staff',
    position: 'Budget Analyst',
  }),
  makeUser('user-staff-2', {
    employeeId: 'STF-0302',
    firstName: 'Jenny',
    lastName: 'Flores',
    email: 'staff2@trackgov.gov.ph',
    officeCode: 'BPLO',
    role: 'Staff',
    position: 'Permit Evaluator',
  }),
  makeUser('user-readonly-1', {
    employeeId: 'RO-0401',
    firstName: 'Carmen',
    lastName: 'Villanueva',
    email: 'read@trackgov.gov.ph',
    officeCode: 'ENRO',
    role: 'Read Only',
    position: 'Planning Assistant',
  }),
  makeUser('user-readonly-2', {
    employeeId: 'RO-0402',
    firstName: 'Luis',
    lastName: 'Castillo',
    email: 'observer@trackgov.gov.ph',
    officeCode: 'MPDO',
    role: 'Read Only',
    position: 'Monitoring Officer',
  }),
]

const notifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-records-1',
    type: 'incoming',
    title: 'New incoming documents',
    message: '3 new documents received for your office.',
    isRead: false,
    createdAt: new Date(),
  },
]

const createDocument = (opts: {
  id: string
  trackingCode: string
  title: string
  documentType: Document['documentType']
  priority: Priority
  status: DocumentStatus
  originOfficeCode: string
  currentOfficeCode: string
  isConfidential?: boolean
  overdue?: boolean
}): Document => {
  const originOffice = offices.find((o) => o.code === opts.originOfficeCode)!
  const currentOffice = offices.find((o) => o.code === opts.currentOfficeCode)!
  const now = new Date()
  const dateReceived = new Date(now)
  dateReceived.setDate(now.getDate() - 5)
  const dueDate = new Date(now)
  if (opts.overdue) {
    dueDate.setDate(now.getDate() - 3)
  } else {
    dueDate.setDate(now.getDate() + 3)
  }

  return {
    id: opts.id,
    trackingCode: opts.trackingCode,
    title: opts.title,
    description: 'Sample description for ' + opts.title,
    documentType: opts.documentType,
    classification: opts.isConfidential ? 'Confidential' : 'Routine',
    priority: opts.priority,
    originatorId: users[2].id,
    originOfficeId: originOffice.id,
    currentOfficeId: currentOffice.id,
    currentAssigneeId: users[6].id,
    status: opts.status,
    attachments: [],
    routingHistory: [],
    remarks: [],
    dateReceived,
    dateCreated: dateReceived,
    updatedAt: now,
    dueDate,
    tags: [],
    referenceNumber: undefined,
    isConfidential: !!opts.isConfidential,
    qrCode: undefined,
  }
}

const documents: Document[] = [
  createDocument({
    id: 'doc-1',
    trackingCode: 'TRK-2024-00145',
    title: 'Request for Budget Allocation FY2025',
    documentType: 'Request',
    priority: 'High',
    status: 'In Review',
    originOfficeCode: 'OSEC',
    currentOfficeCode: 'BFAD',
  }),
  createDocument({
    id: 'doc-2',
    trackingCode: 'TRK-2024-00146',
    title: 'Barangay Infrastructure Improvement Program',
    documentType: 'Resolution',
    priority: 'Urgent',
    status: 'Received',
    originOfficeCode: 'MPDO',
    currentOfficeCode: 'RECORDS',
    overdue: true,
  }),
]

export const mockData = {
  offices,
  users,
  documents,
  notifications,
}

