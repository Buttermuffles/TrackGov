import type { Office, User, Document, Notification, AuditEntry } from '@/types'

export const offices: Office[] = [
  { id: 'off-1', code: 'OSEC', name: 'Office of the Secretary/Mayor', headId: 'usr-1', staffCount: 8, isActive: true, description: 'Executive office of the local chief executive' },
  { id: 'off-2', code: 'HRMO', name: 'Human Resource Management Office', headId: 'usr-3', staffCount: 6, isActive: true, description: 'Manages personnel and employee welfare' },
  { id: 'off-3', code: 'BPLO', name: 'Business Permits & Licensing Office', headId: 'usr-5', staffCount: 10, isActive: true, description: 'Processes business permits and licenses' },
  { id: 'off-4', code: 'ENRO', name: 'Environment & Natural Resources Office', headId: 'usr-7', staffCount: 5, isActive: true, description: 'Manages environmental compliance and resources' },
  { id: 'off-5', code: 'BFAD', name: 'Budget & Finance Administration Division', headId: 'usr-8', staffCount: 7, isActive: true, description: 'Manages budget allocation and financial operations' },
  { id: 'off-6', code: 'MPDO', name: 'Municipal/City Planning & Development Office', headId: 'usr-9', staffCount: 6, isActive: true, description: 'Urban planning and development oversight' },
  { id: 'off-7', code: 'CSWDO', name: 'Community & Social Welfare Development Office', headId: 'usr-10', staffCount: 8, isActive: true, description: 'Social welfare programs and community services' },
  { id: 'off-8', code: 'RECORDS', name: 'Office of the Records Officer', headId: 'usr-2', parentOfficeId: 'off-1', staffCount: 4, isActive: true, description: 'Central records management and document tracking' },
]

export const users: User[] = [
  { id: 'usr-1', employeeId: 'EMP-001', firstName: 'Ricardo', lastName: 'Santos', email: 'admin@trackgov.gov.ph', officeId: 'off-1', role: 'Super Admin', position: 'City Mayor', isActive: true, lastLogin: new Date('2026-03-11T08:30:00'), createdAt: new Date('2024-01-15') },
  { id: 'usr-2', employeeId: 'EMP-002', firstName: 'Maria', lastName: 'Dela Cruz', email: 'records@trackgov.gov.ph', officeId: 'off-8', role: 'Records Officer', position: 'Chief Records Officer', isActive: true, lastLogin: new Date('2026-03-11T07:45:00'), createdAt: new Date('2024-01-15') },
  { id: 'usr-3', employeeId: 'EMP-003', firstName: 'Jose', lastName: 'Reyes', email: 'dept@trackgov.gov.ph', officeId: 'off-2', role: 'Department Head', position: 'HR Director', isActive: true, lastLogin: new Date('2026-03-10T16:00:00'), createdAt: new Date('2024-02-01') },
  { id: 'usr-4', employeeId: 'EMP-004', firstName: 'Ana', lastName: 'Garcia', email: 'staff@trackgov.gov.ph', officeId: 'off-2', role: 'Staff', position: 'HR Assistant', isActive: true, lastLogin: new Date('2026-03-10T09:00:00'), createdAt: new Date('2024-03-01') },
  { id: 'usr-5', employeeId: 'EMP-005', firstName: 'Pedro', lastName: 'Mendoza', email: 'pedro.mendoza@trackgov.gov.ph', officeId: 'off-3', role: 'Department Head', position: 'BPLO Chief', isActive: true, lastLogin: new Date('2026-03-09T14:30:00'), createdAt: new Date('2024-01-20') },
  { id: 'usr-6', employeeId: 'EMP-006', firstName: 'Elena', lastName: 'Villanueva', email: 'elena.v@trackgov.gov.ph', officeId: 'off-3', role: 'Staff', position: 'Licensing Officer', isActive: true, lastLogin: new Date('2026-03-11T08:00:00'), createdAt: new Date('2024-04-01') },
  { id: 'usr-7', employeeId: 'EMP-007', firstName: 'Carlos', lastName: 'Ramos', email: 'carlos.r@trackgov.gov.ph', officeId: 'off-4', role: 'Department Head', position: 'ENRO Director', isActive: true, lastLogin: new Date('2026-03-10T10:00:00'), createdAt: new Date('2024-02-15') },
  { id: 'usr-8', employeeId: 'EMP-008', firstName: 'Lucia', lastName: 'Torres', email: 'lucia.t@trackgov.gov.ph', officeId: 'off-5', role: 'Department Head', position: 'Budget Officer', isActive: true, lastLogin: new Date('2026-03-11T07:30:00'), createdAt: new Date('2024-01-15') },
  { id: 'usr-9', employeeId: 'EMP-009', firstName: 'Miguel', lastName: 'Aquino', email: 'miguel.a@trackgov.gov.ph', officeId: 'off-6', role: 'Department Head', position: 'City Planner', isActive: true, lastLogin: new Date('2026-03-08T13:00:00'), createdAt: new Date('2024-03-01') },
  { id: 'usr-10', employeeId: 'EMP-010', firstName: 'Sofia', lastName: 'Cruz', email: 'sofia.c@trackgov.gov.ph', officeId: 'off-7', role: 'Department Head', position: 'Social Welfare Officer', isActive: true, lastLogin: new Date('2026-03-11T08:15:00'), createdAt: new Date('2024-02-01') },
  { id: 'usr-11', employeeId: 'EMP-011', firstName: 'Roberto', lastName: 'Lim', email: 'roberto.l@trackgov.gov.ph', officeId: 'off-8', role: 'Staff', position: 'Records Clerk', isActive: true, lastLogin: new Date('2026-03-11T07:50:00'), createdAt: new Date('2024-05-01') },
  { id: 'usr-12', employeeId: 'EMP-012', firstName: 'Teresa', lastName: 'Bautista', email: 'teresa.b@trackgov.gov.ph', officeId: 'off-5', role: 'Staff', position: 'Finance Analyst', isActive: true, lastLogin: new Date('2026-03-10T15:00:00'), createdAt: new Date('2024-06-01') },
  { id: 'usr-13', employeeId: 'EMP-013', firstName: 'Fernando', lastName: 'Gonzales', email: 'fernando.g@trackgov.gov.ph', officeId: 'off-1', role: 'Admin', position: 'Executive Assistant', isActive: true, lastLogin: new Date('2026-03-11T08:00:00'), createdAt: new Date('2024-01-15') },
  { id: 'usr-14', employeeId: 'EMP-014', firstName: 'Carmen', lastName: 'Perez', email: 'carmen.p@trackgov.gov.ph', officeId: 'off-6', role: 'Staff', position: 'Planning Assistant', isActive: false, lastLogin: new Date('2026-01-15T10:00:00'), createdAt: new Date('2024-07-01') },
  // demo users for UI previews
  { id: 'usr-demo1', employeeId: 'EMP-999', firstName: 'Demo', lastName: 'UserA', email: 'demo1@trackgov.gov.ph', officeId: 'off-2', role: 'Staff', position: 'Demo Assistant', isActive: true, createdAt: new Date() },
  { id: 'usr-demo2', employeeId: 'EMP-998', firstName: 'Demo', lastName: 'UserB', email: 'demo2@trackgov.gov.ph', officeId: 'off-5', role: 'Staff', position: 'Demo Clerk', isActive: true, createdAt: new Date() },
]

const d = (s: string) => new Date(s)

export const documents: Document[] = [
  {
    id: 'doc-1', trackingCode: 'TRK-2026-00001', title: 'Request for Budget Allocation FY2026', description: 'Annual budget request for operating expenses of all departments for fiscal year 2026.', documentType: 'Request', classification: 'Priority', priority: 'High', originatorId: 'usr-8', originOfficeId: 'off-5', currentOfficeId: 'off-1', currentAssigneeId: 'usr-1', status: 'For Signature',
    attachments: [{ id: 'att-1', filename: 'budget_proposal_fy2026.pdf', fileSize: 2456789, fileType: 'application/pdf', url: '#', uploadedBy: 'usr-8', uploadedAt: d('2026-03-01T09:00:00') }],
    routingHistory: [
      { id: 'rh-1', documentId: 'doc-1', fromOfficeId: 'off-5', toOfficeId: 'off-8', fromUserId: 'usr-8', toUserId: 'usr-2', action: 'For Review', remarks: 'Please review and forward to the Mayor for approval.', timestamp: d('2026-03-01T09:00:00'), receivedAt: d('2026-03-01T09:30:00'), isAcknowledged: true },
      { id: 'rh-2', documentId: 'doc-1', fromOfficeId: 'off-8', toOfficeId: 'off-1', fromUserId: 'usr-2', toUserId: 'usr-1', action: 'For Signature', remarks: 'Reviewed. Forwarded to OSEC for approval and signature.', timestamp: d('2026-03-02T10:15:00'), receivedAt: d('2026-03-02T10:30:00'), isAcknowledged: true },
    ],
    remarks: [
      { id: 'rem-1', documentId: 'doc-1', userId: 'usr-8', content: 'This covers all departments including the new ENRO programs.', isInternal: false, createdAt: d('2026-03-01T09:00:00') },
      { id: 'rem-2', documentId: 'doc-1', userId: 'usr-2', content: 'Documents are in order. Budget figures verified.', isInternal: true, createdAt: d('2026-03-02T10:00:00') },
    ],
    dueDate: d('2026-03-15'), dateReceived: d('2026-03-01'), dateCreated: d('2026-03-01'), updatedAt: d('2026-03-02'), tags: ['budget', 'fy2026', 'urgent'], referenceNumber: 'BFAD-2026-001', isConfidential: false,
  },
  {
    id: 'doc-2', trackingCode: 'TRK-2026-00002', title: 'Memorandum: New Office Working Hours', description: 'Directive regarding the implementation of new working hours for all city government employees.', documentType: 'Memorandum', classification: 'Routine', priority: 'Normal', originatorId: 'usr-1', originOfficeId: 'off-1', currentOfficeId: 'off-2', currentAssigneeId: 'usr-3', status: 'In Review',
    attachments: [{ id: 'att-2', filename: 'memo_working_hours.pdf', fileSize: 345678, fileType: 'application/pdf', url: '#', uploadedBy: 'usr-13', uploadedAt: d('2026-02-25T08:00:00') }],
    routingHistory: [
      { id: 'rh-3', documentId: 'doc-2', fromOfficeId: 'off-1', toOfficeId: 'off-2', fromUserId: 'usr-13', toUserId: 'usr-3', action: 'For Review', remarks: 'Please review the new working hours proposal for feasibility.', timestamp: d('2026-02-25T08:30:00'), receivedAt: d('2026-02-25T09:00:00'), isAcknowledged: true },
    ],
    remarks: [{ id: 'rem-3', documentId: 'doc-2', userId: 'usr-3', content: 'Need to check with department heads on shift schedules.', isInternal: true, createdAt: d('2026-02-26T10:00:00') }],
    dueDate: d('2026-03-10'), dateReceived: d('2026-02-25'), dateCreated: d('2026-02-25'), updatedAt: d('2026-02-26'), tags: ['memo', 'working-hours'], isConfidential: false,
  },
  {
    id: 'doc-3', trackingCode: 'TRK-2026-00003', title: 'Business Permit Application – ABC Trading Corp', description: 'Application for new business permit for ABC Trading Corporation, retail goods.', documentType: 'Certificate', classification: 'Routine', priority: 'Normal', originatorId: 'usr-6', originOfficeId: 'off-3', currentOfficeId: 'off-3', currentAssigneeId: 'usr-5', status: 'In Review',
    attachments: [
      { id: 'att-3', filename: 'business_permit_app.pdf', fileSize: 1234567, fileType: 'application/pdf', url: '#', uploadedBy: 'usr-6', uploadedAt: d('2026-03-05T10:00:00') },
      { id: 'att-4', filename: 'dti_registration.jpg', fileSize: 456789, fileType: 'image/jpeg', url: '#', uploadedBy: 'usr-6', uploadedAt: d('2026-03-05T10:00:00') },
    ],
    routingHistory: [
      { id: 'rh-4', documentId: 'doc-3', fromOfficeId: 'off-8', toOfficeId: 'off-3', fromUserId: 'usr-2', toUserId: 'usr-6', action: 'For Action', remarks: 'New business permit application received. Please process.', timestamp: d('2026-03-05T10:00:00'), receivedAt: d('2026-03-05T10:30:00'), isAcknowledged: true },
    ],
    remarks: [{ id: 'rem-4', documentId: 'doc-3', userId: 'usr-6', content: 'DTI registration verified. Checking zoning compliance.', isInternal: true, createdAt: d('2026-03-06T11:00:00') }],
    dueDate: d('2026-03-20'), dateReceived: d('2026-03-05'), dateCreated: d('2026-03-05'), updatedAt: d('2026-03-06'), tags: ['business-permit', 'new-application'], referenceNumber: 'BP-2026-0091', isConfidential: false,
  },
  {
    id: 'doc-4', trackingCode: 'TRK-2026-00004', title: 'Resolution Authorizing Emergency Purchase of Medical Supplies', description: 'Emergency resolution for the procurement of medical supplies for the City Health Office due to dengue outbreak.', documentType: 'Resolution', classification: 'Priority', priority: 'Urgent', originatorId: 'usr-1', originOfficeId: 'off-1', currentOfficeId: 'off-5', currentAssigneeId: 'usr-8', status: 'For Signature',
    attachments: [{ id: 'att-5', filename: 'resolution_medical_supplies.pdf', fileSize: 567890, fileType: 'application/pdf', url: '#', uploadedBy: 'usr-13', uploadedAt: d('2026-03-08T09:00:00') }],
    routingHistory: [
      { id: 'rh-5', documentId: 'doc-4', fromOfficeId: 'off-1', toOfficeId: 'off-5', fromUserId: 'usr-13', toUserId: 'usr-8', action: 'For Signature', remarks: 'URGENT: Please sign and release funds immediately.', timestamp: d('2026-03-08T09:15:00'), receivedAt: d('2026-03-08T09:30:00'), isAcknowledged: true },
    ],
    remarks: [{ id: 'rem-5', documentId: 'doc-4', userId: 'usr-8', content: 'Checking available emergency funds.', isInternal: true, createdAt: d('2026-03-08T10:00:00') }],
    dueDate: d('2026-03-10'), dateReceived: d('2026-03-08'), dateCreated: d('2026-03-08'), updatedAt: d('2026-03-08'), tags: ['emergency', 'medical', 'resolution'], isConfidential: false,
  },
  {
    id: 'doc-5', trackingCode: 'TRK-2026-00005', title: 'Environmental Compliance Certificate – Metro Construction', description: 'Request for ECC clearance for Metro Construction project in Barangay San Jose.', documentType: 'Certificate', classification: 'Routine', priority: 'High', originatorId: 'usr-7', originOfficeId: 'off-4', currentOfficeId: 'off-4', currentAssigneeId: 'usr-7', status: 'In Review',
    attachments: [{ id: 'att-6', filename: 'ecc_application.pdf', fileSize: 3456789, fileType: 'application/pdf', url: '#', uploadedBy: 'usr-7', uploadedAt: d('2026-02-28T14:00:00') }],
    routingHistory: [
      { id: 'rh-6', documentId: 'doc-5', fromOfficeId: 'off-8', toOfficeId: 'off-4', fromUserId: 'usr-2', toUserId: 'usr-7', action: 'For Action', remarks: 'ECC application forwarded for evaluation.', timestamp: d('2026-02-28T14:30:00'), receivedAt: d('2026-02-28T15:00:00'), isAcknowledged: true },
    ],
    remarks: [], dueDate: d('2026-03-14'), dateReceived: d('2026-02-28'), dateCreated: d('2026-02-28'), updatedAt: d('2026-02-28'), tags: ['ecc', 'construction', 'environment'], referenceNumber: 'ECC-2026-015', isConfidential: false,
  },
  {
    id: 'doc-6', trackingCode: 'TRK-2026-00006', title: 'Petition for Street Light Installation – Brgy. San Miguel', description: 'Residents of Barangay San Miguel petition for installation of street lights along the main road.', documentType: 'Petition', classification: 'Routine', priority: 'Normal', originatorId: 'usr-2', originOfficeId: 'off-8', currentOfficeId: 'off-6', currentAssigneeId: 'usr-9', status: 'In Review',
    attachments: [{ id: 'att-7', filename: 'petition_streetlights.pdf', fileSize: 789012, fileType: 'application/pdf', url: '#', uploadedBy: 'usr-2', uploadedAt: d('2026-02-20T10:00:00') }],
    routingHistory: [
      { id: 'rh-7', documentId: 'doc-6', fromOfficeId: 'off-8', toOfficeId: 'off-1', fromUserId: 'usr-2', toUserId: 'usr-13', action: 'For Review', remarks: 'Petition received from Brgy San Miguel residents.', timestamp: d('2026-02-20T10:30:00'), receivedAt: d('2026-02-20T11:00:00'), isAcknowledged: true },
      { id: 'rh-8', documentId: 'doc-6', fromOfficeId: 'off-1', toOfficeId: 'off-6', fromUserId: 'usr-13', toUserId: 'usr-9', action: 'For Action', remarks: 'Please evaluate feasibility and prepare cost estimates.', timestamp: d('2026-02-21T08:00:00'), receivedAt: d('2026-02-21T08:30:00'), isAcknowledged: true },
    ],
    remarks: [{ id: 'rem-6', documentId: 'doc-6', userId: 'usr-9', content: 'Site inspection scheduled for March 12.', isInternal: true, createdAt: d('2026-03-01T09:00:00') }],
    dueDate: d('2026-03-07'), dateReceived: d('2026-02-20'), dateCreated: d('2026-02-20'), updatedAt: d('2026-03-01'), tags: ['petition', 'infrastructure', 'streetlights'], isConfidential: false,
  },
  {
    id: 'doc-7', trackingCode: 'TRK-2026-00007', title: 'Purchase Order – Office Equipment for HRMO', description: 'Purchase order for 10 desktop computers and 5 printers for the HRMO.', documentType: 'Purchase Order', classification: 'Routine', priority: 'Normal', originatorId: 'usr-3', originOfficeId: 'off-2', currentOfficeId: 'off-5', currentAssigneeId: 'usr-12', status: 'In Review',
    attachments: [{ id: 'att-8', filename: 'po_office_equipment.xlsx', fileSize: 123456, fileType: 'application/vnd.ms-excel', url: '#', uploadedBy: 'usr-3', uploadedAt: d('2026-03-03T11:00:00') }],
    routingHistory: [
      { id: 'rh-9', documentId: 'doc-7', fromOfficeId: 'off-2', toOfficeId: 'off-8', fromUserId: 'usr-3', toUserId: 'usr-2', action: 'Forwarded', remarks: 'PO for HRMO equipment. Please forward to BFAD.', timestamp: d('2026-03-03T11:00:00'), receivedAt: d('2026-03-03T11:30:00'), isAcknowledged: true },
      { id: 'rh-10', documentId: 'doc-7', fromOfficeId: 'off-8', toOfficeId: 'off-5', fromUserId: 'usr-2', toUserId: 'usr-12', action: 'For Review', remarks: 'Purchase order forwarded for budget verification.', timestamp: d('2026-03-03T14:00:00'), receivedAt: d('2026-03-03T14:30:00'), isAcknowledged: true },
    ],
    remarks: [], dueDate: d('2026-03-17'), dateReceived: d('2026-03-03'), dateCreated: d('2026-03-03'), updatedAt: d('2026-03-03'), tags: ['purchase-order', 'equipment'], referenceNumber: 'PO-2026-042', isConfidential: false,
  },
  {
    id: 'doc-8', trackingCode: 'TRK-2026-00008', title: 'Confidential Personnel Report – Disciplinary Case #2026-01', description: 'Investigation report on personnel misconduct allegation.', documentType: 'Report', classification: 'Confidential', priority: 'High', originatorId: 'usr-3', originOfficeId: 'off-2', currentOfficeId: 'off-1', currentAssigneeId: 'usr-1', status: 'In Review',
    attachments: [{ id: 'att-9', filename: 'confidential_report.pdf', fileSize: 890123, fileType: 'application/pdf', url: '#', uploadedBy: 'usr-3', uploadedAt: d('2026-03-06T16:00:00') }],
    routingHistory: [
      { id: 'rh-11', documentId: 'doc-8', fromOfficeId: 'off-2', toOfficeId: 'off-1', fromUserId: 'usr-3', toUserId: 'usr-1', action: 'For Review', remarks: 'Confidential. For the Mayor\'s review and decision.', timestamp: d('2026-03-06T16:30:00'), receivedAt: d('2026-03-07T08:00:00'), isAcknowledged: true },
    ],
    remarks: [{ id: 'rem-7', documentId: 'doc-8', userId: 'usr-3', content: 'All witness statements attached. Recommending suspension.', isInternal: true, createdAt: d('2026-03-06T16:00:00') }],
    dueDate: d('2026-03-13'), dateReceived: d('2026-03-06'), dateCreated: d('2026-03-06'), updatedAt: d('2026-03-07'), tags: ['confidential', 'disciplinary'], isConfidential: true,
  },
  {
    id: 'doc-9', trackingCode: 'TRK-2026-00009', title: 'Letter of Commendation – City Clean-Up Drive Volunteers', description: 'Letter recognizing the outstanding efforts of volunteers during the city-wide clean-up drive.', documentType: 'Letter', classification: 'Routine', priority: 'Low', originatorId: 'usr-10', originOfficeId: 'off-7', currentOfficeId: 'off-1', status: 'Completed',
    attachments: [{ id: 'att-10', filename: 'commendation_letter.pdf', fileSize: 234567, fileType: 'application/pdf', url: '#', uploadedBy: 'usr-10', uploadedAt: d('2026-02-15T10:00:00') }],
    routingHistory: [
      { id: 'rh-12', documentId: 'doc-9', fromOfficeId: 'off-7', toOfficeId: 'off-8', fromUserId: 'usr-10', toUserId: 'usr-2', action: 'Forwarded', remarks: 'For records and forwarding to OSEC for the Mayor\'s signature.', timestamp: d('2026-02-15T10:00:00'), receivedAt: d('2026-02-15T10:30:00'), isAcknowledged: true },
      { id: 'rh-13', documentId: 'doc-9', fromOfficeId: 'off-8', toOfficeId: 'off-1', fromUserId: 'usr-2', toUserId: 'usr-1', action: 'For Signature', remarks: 'For the Mayor\'s signature on the commendation letter.', timestamp: d('2026-02-15T14:00:00'), receivedAt: d('2026-02-15T14:30:00'), isAcknowledged: true },
      { id: 'rh-14', documentId: 'doc-9', fromOfficeId: 'off-1', toOfficeId: 'off-7', fromUserId: 'usr-13', toUserId: 'usr-10', action: 'Approved', remarks: 'Signed by the Mayor. Returned to CSWDO for distribution.', timestamp: d('2026-02-16T09:00:00'), receivedAt: d('2026-02-16T09:30:00'), isAcknowledged: true },
    ],
    remarks: [
      { id: 'rem-8', documentId: 'doc-9', userId: 'usr-10', content: 'List of 45 volunteers attached.', isInternal: false, createdAt: d('2026-02-15T10:00:00') },
      { id: 'rem-9', documentId: 'doc-9', userId: 'usr-1', content: 'Excellent initiative. Approved.', isInternal: false, createdAt: d('2026-02-16T08:45:00') },
    ],
    dateReceived: d('2026-02-15'), dateCreated: d('2026-02-15'), updatedAt: d('2026-02-16'), tags: ['commendation', 'volunteers'], isConfidential: false,
  },
  {
    id: 'doc-10', trackingCode: 'TRK-2026-00010', title: 'Ordinance Draft: Plastic Bag Ban Implementation Guidelines', description: 'Draft ordinance providing guidelines for the implementation of the city-wide plastic bag ban.', documentType: 'Ordinance', classification: 'Priority', priority: 'High', originatorId: 'usr-7', originOfficeId: 'off-4', currentOfficeId: 'off-1', currentAssigneeId: 'usr-13', status: 'For Signature',
    attachments: [
      { id: 'att-11', filename: 'ordinance_plastic_ban.pdf', fileSize: 1567890, fileType: 'application/pdf', url: '#', uploadedBy: 'usr-7', uploadedAt: d('2026-02-10T09:00:00') },
      { id: 'att-12', filename: 'environmental_impact_study.pdf', fileSize: 4567890, fileType: 'application/pdf', url: '#', uploadedBy: 'usr-7', uploadedAt: d('2026-02-10T09:00:00') },
    ],
    routingHistory: [
      { id: 'rh-15', documentId: 'doc-10', fromOfficeId: 'off-4', toOfficeId: 'off-8', fromUserId: 'usr-7', toUserId: 'usr-2', action: 'Forwarded', remarks: 'Draft ordinance for records filing and routing.', timestamp: d('2026-02-10T09:30:00'), receivedAt: d('2026-02-10T10:00:00'), isAcknowledged: true },
      { id: 'rh-16', documentId: 'doc-10', fromOfficeId: 'off-8', toOfficeId: 'off-6', fromUserId: 'usr-2', toUserId: 'usr-9', action: 'For Review', remarks: 'Please review for zoning and implementation feasibility.', timestamp: d('2026-02-10T14:00:00'), receivedAt: d('2026-02-11T08:00:00'), isAcknowledged: true },
      { id: 'rh-17', documentId: 'doc-10', fromOfficeId: 'off-6', toOfficeId: 'off-3', fromUserId: 'usr-9', toUserId: 'usr-5', action: 'For Review', remarks: 'MPDO review complete. Forwarded to BPLO for business impact assessment.', timestamp: d('2026-02-14T10:00:00'), receivedAt: d('2026-02-14T10:30:00'), isAcknowledged: true },
      { id: 'rh-18', documentId: 'doc-10', fromOfficeId: 'off-3', toOfficeId: 'off-1', fromUserId: 'usr-5', toUserId: 'usr-13', action: 'For Signature', remarks: 'All reviews complete. Ready for the Mayor\'s endorsement.', timestamp: d('2026-02-20T11:00:00'), receivedAt: d('2026-02-20T11:30:00'), isAcknowledged: true },
    ],
    remarks: [
      { id: 'rem-10', documentId: 'doc-10', userId: 'usr-7', content: 'Environmental impact study supports the ban.', isInternal: false, createdAt: d('2026-02-10T09:00:00') },
      { id: 'rem-11', documentId: 'doc-10', userId: 'usr-9', content: 'Zoning review OK. No conflicts.', isInternal: true, createdAt: d('2026-02-14T09:00:00') },
      { id: 'rem-12', documentId: 'doc-10', userId: 'usr-5', content: 'Business impact is manageable with 6-month transition period.', isInternal: true, createdAt: d('2026-02-20T10:00:00') },
    ],
    dueDate: d('2026-03-01'), dateReceived: d('2026-02-10'), dateCreated: d('2026-02-10'), updatedAt: d('2026-02-20'), tags: ['ordinance', 'plastic-ban', 'environment'], isConfidential: false,
  },
  // More documents for volume
  ...generateAdditionalDocuments(),
]

function generateAdditionalDocuments(): Document[] {
  const titles = [
    'Voucher: Payment for Road Repair – Purok 3',
    'Contract Renewal – Janitorial Services 2026',
    'Report on City Revenue Collection Q1 2026',
    'Request for Personnel Detail – CSWDO to HRMO',
    'Letter from Provincial Governor – Disaster Preparedness',
    'Memorandum: Year-End Audit Schedule',
    'Certificate of Clearance – Retiring Employee',
    'Petition for Market Renovation – Vendors Association',
    'Purchase Order – Street Cleaning Equipment',
    'Resolution: Donation of Lot for Public Park',
    'Letter of Intent – Sister City Agreement with Osaka',
    'Report: Q4 2025 Financial Statement',
    'Ordinance Amendment: Curfew Hours for Minors',
    'Request for Equipment Repair – MPDO Office',
    'Contract: IT Systems Maintenance Agreement',
    'Memorandum of Agreement – NGO Partnership',
    'Voucher: Travel Expenses – National Conference',
    'Request for CCTV Installation – Public Market',
    'Certificate of Indigency – Batch Processing Request',
    'Report: Annual Accomplishment Report 2025',
    'Letter: Invitation to Regional Development Council Meeting',
    'Purchase Order – COVID-19 Testing Supplies',
    'Resolution Approving Annual Investment Program',
    'Request for Tree Planting Activity Budget',
    'Petition for Additional Police Visibility – Brgy. Rizal',
    'Contract for School Building Repair – East District',
    'Memorandum: Flag Ceremony Schedule Update',
    'Voucher: Honoraria – Guest Speakers',
    'Certificate of Good Moral Character Request',
    'Report: Monthly Crime Statistics – February 2026',
    'Letter from DILG: Compliance Review Notice',
    'Request for Fire Truck Maintenance',
    'Ordinance: Revised Zoning Classification',
    'Purchase Order – Medical Supplies for Rural Health Units',
    'Resolution Approving CY 2026 Gender and Development Plan',
    'Letter from Bureau of Fire Protection – Inspection Schedule',
    'Contract Extension – Security Services',
    'Memorandum: Upcoming Barangay Elections Preparation',
    'Voucher: Payment for Waterworks Repair',
    'Request for Scholarship Grants – Underprivileged Youth',
  ]

  const types: Document['documentType'][] = ['Voucher', 'Contract', 'Report', 'Request', 'Letter', 'Memorandum', 'Certificate', 'Petition', 'Purchase Order', 'Resolution', 'Letter', 'Report', 'Ordinance', 'Request', 'Contract', 'Memorandum', 'Voucher', 'Request', 'Certificate', 'Report', 'Letter', 'Purchase Order', 'Resolution', 'Request', 'Petition', 'Contract', 'Memorandum', 'Voucher', 'Certificate', 'Report', 'Letter', 'Request', 'Ordinance', 'Purchase Order', 'Resolution', 'Letter', 'Contract', 'Memorandum', 'Voucher', 'Request']
  const statuses: Document['status'][] = ['Received', 'In Review', 'For Signature', 'For Routing', 'In Transit', 'Action Taken', 'Completed', 'Completed', 'In Review', 'Received', 'In Transit', 'For Signature', 'Completed', 'In Review', 'For Routing', 'Action Taken', 'Completed', 'Received', 'In Review', 'Completed', 'In Transit', 'For Signature', 'Completed', 'Received', 'In Review', 'Action Taken', 'Completed', 'In Review', 'Received', 'Completed', 'In Review', 'For Signature', 'For Routing', 'Received', 'Completed', 'In Transit', 'In Review', 'Completed', 'Received', 'On Hold']
  const priorities: Document['priority'][] = ['Normal', 'Normal', 'High', 'Normal', 'High', 'Normal', 'Low', 'Normal', 'Normal', 'High', 'Normal', 'High', 'Normal', 'Low', 'Normal', 'Normal', 'Low', 'High', 'Normal', 'Normal', 'Normal', 'Urgent', 'High', 'Normal', 'Normal', 'High', 'Low', 'Normal', 'Normal', 'Normal', 'High', 'Normal', 'High', 'Urgent', 'Normal', 'Normal', 'Normal', 'Normal', 'Normal', 'High']
  const officeIds = ['off-1', 'off-2', 'off-3', 'off-4', 'off-5', 'off-6', 'off-7', 'off-8']
  const userIds = ['usr-1', 'usr-2', 'usr-3', 'usr-5', 'usr-7', 'usr-8', 'usr-9', 'usr-10']

  return titles.map((title, i) => {
    const idx = i + 11
    const offIdx = i % officeIds.length
    const usrIdx = i % userIds.length
    const daysAgo = Math.floor(Math.random() * 60) + 1
    const dateRec = new Date('2026-03-11')
    dateRec.setDate(dateRec.getDate() - daysAgo)
    const dueDate = new Date(dateRec)
    dueDate.setDate(dueDate.getDate() + 14)
    const isOverdue = dueDate < new Date('2026-03-11') && !['Completed', 'Cancelled', 'Action Taken'].includes(statuses[i])

    return {
      id: `doc-${idx}`,
      trackingCode: `TRK-2026-${String(idx).padStart(5, '0')}`,
      title,
      description: `${title} — detailed description for document processing.`,
      documentType: types[i],
      classification: i === 7 || i === 20 ? 'Confidential' as const : 'Routine' as const,
      priority: priorities[i],
      originatorId: userIds[usrIdx],
      originOfficeId: officeIds[offIdx],
      currentOfficeId: officeIds[(offIdx + 1) % officeIds.length],
      currentAssigneeId: userIds[(usrIdx + 1) % userIds.length],
      status: statuses[i],
      attachments: [{
        id: `att-${idx + 12}`,
        filename: `document_${idx}.pdf`,
        fileSize: Math.floor(Math.random() * 5000000) + 100000,
        fileType: 'application/pdf',
        url: '#',
        uploadedBy: userIds[usrIdx],
        uploadedAt: dateRec,
      }],
      routingHistory: [{
        id: `rh-${idx + 20}`,
        documentId: `doc-${idx}`,
        fromOfficeId: officeIds[offIdx],
        toOfficeId: officeIds[(offIdx + 1) % officeIds.length],
        fromUserId: userIds[usrIdx],
        toUserId: userIds[(usrIdx + 1) % userIds.length],
        action: 'Forwarded' as const,
        remarks: 'Forwarded for processing.',
        timestamp: dateRec,
        receivedAt: new Date(dateRec.getTime() + 3600000),
        isAcknowledged: statuses[i] !== 'In Transit' && statuses[i] !== 'Received',
      }],
      remarks: [],
      dueDate,
      dateReceived: dateRec,
      dateCreated: dateRec,
      updatedAt: new Date(dateRec.getTime() + 86400000),
      tags: [types[i].toLowerCase().replace(/\s/g, '-')],
      isConfidential: i === 7 || i === 20,
    }
  })
}

export const notifications: Notification[] = [
  { id: 'notif-1', userId: 'usr-2', type: 'incoming', title: 'New Document Received', message: 'TRK-2026-00004 — Resolution for Emergency Medical Supplies has been forwarded to your office.', documentId: 'doc-4', isRead: false, createdAt: d('2026-03-11T08:00:00') },
  { id: 'notif-2', userId: 'usr-2', type: 'overdue', title: 'Overdue Document', message: 'TRK-2026-00010 — Ordinance: Plastic Bag Ban is past its due date.', documentId: 'doc-10', isRead: false, createdAt: d('2026-03-11T07:00:00') },
  { id: 'notif-3', userId: 'usr-2', type: 'action_required', title: 'Action Required', message: 'TRK-2026-00006 — Petition for Street Light Installation needs your review.', documentId: 'doc-6', isRead: true, createdAt: d('2026-03-10T14:00:00') },
  { id: 'notif-4', userId: 'usr-1', type: 'incoming', title: 'Document for Signature', message: 'TRK-2026-00001 — Budget Allocation FY2026 is awaiting your signature.', documentId: 'doc-1', isRead: false, createdAt: d('2026-03-11T09:00:00') },
  { id: 'notif-5', userId: 'usr-1', type: 'system', title: 'System Update', message: 'TrackGov system has been updated to version 2.1.', isRead: true, createdAt: d('2026-03-09T06:00:00') },
]

export const auditTrail: AuditEntry[] = [
  { id: 'audit-1', timestamp: d('2026-03-11T08:30:00'), userId: 'usr-1', action: 'Login', details: 'User logged in successfully.', ipAddress: '192.168.1.100' },
  { id: 'audit-2', timestamp: d('2026-03-11T07:45:00'), userId: 'usr-2', action: 'Login', details: 'User logged in successfully.', ipAddress: '192.168.1.101' },
  { id: 'audit-3', timestamp: d('2026-03-10T10:15:00'), userId: 'usr-2', action: 'Forward Document', documentId: 'doc-1', officeId: 'off-1', details: 'Forwarded TRK-2026-00001 to Office of the Secretary/Mayor.', ipAddress: '192.168.1.101' },
  { id: 'audit-4', timestamp: d('2026-03-09T14:00:00'), userId: 'usr-13', action: 'Create Document', documentId: 'doc-4', officeId: 'off-1', details: 'Created TRK-2026-00004 — Emergency Medical Supplies Resolution.', ipAddress: '192.168.1.100' },
  { id: 'audit-5', timestamp: d('2026-03-08T09:00:00'), userId: 'usr-3', action: 'Add Remark', documentId: 'doc-2', officeId: 'off-2', details: 'Added internal remark on TRK-2026-00002.', ipAddress: '192.168.1.103' },
]
