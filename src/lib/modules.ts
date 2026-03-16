import type { ModuleId, ModuleGroup, RoleDefaultPermissions, CRUDActions, PermissionPreset } from '@/types'

export interface ModuleDefinition {
  id: ModuleId
  name: string
  group: ModuleGroup
  description: string
  actions: {
    create: string
    read: string
    update: string
    delete: string
  }
}

export const SYSTEM_MODULES: ModuleDefinition[] = [
  // ── DOCUMENTS ──────────────────────────────
  {
    id: 'documents_incoming',
    name: 'Incoming Documents',
    group: 'Documents',
    description: 'Receive, acknowledge, and manage incoming documents',
    actions: {
      create: 'Receive new document into the system',
      read: 'View incoming document list and details',
      update: 'Acknowledge receipt, add remarks, change status',
      delete: 'Void or cancel an incoming document',
    },
  },
  {
    id: 'documents_outgoing',
    name: 'Outgoing Documents',
    group: 'Documents',
    description: 'View and manage documents sent from this office',
    actions: {
      create: 'N/A (auto-created when forwarding)',
      read: 'View outgoing document list',
      update: 'Send reminders for unacknowledged outgoing docs',
      delete: 'Recall / retract a forwarded document',
    },
  },
  {
    id: 'documents_all',
    name: 'All Documents',
    group: 'Documents',
    description: 'System-wide document registry',
    actions: {
      create: 'N/A',
      read: 'View all documents system-wide',
      update: 'Edit document metadata, reclassify',
      delete: 'Archive or permanently remove documents',
    },
  },

  // ── ROUTING ────────────────────────────────
  {
    id: 'routing_forward',
    name: 'Route / Forward',
    group: 'Routing',
    description: 'Route documents between offices',
    actions: {
      create: 'Create a new routing/forwarding action',
      read: 'View routing details and history',
      update: 'Edit routing instructions or reassign',
      delete: 'Cancel a routing action before receipt',
    },
  },
  {
    id: 'routing_map',
    name: 'Routing Map',
    group: 'Routing',
    description: 'Visual routing flow between offices',
    actions: {
      create: 'N/A',
      read: 'View the routing map visualization',
      update: 'N/A',
      delete: 'N/A',
    },
  },

  // ── MANAGEMENT ─────────────────────────────
  {
    id: 'offices',
    name: 'Offices / Departments',
    group: 'Management',
    description: 'Manage government offices and departments',
    actions: {
      create: 'Add a new office or department',
      read: 'View office list and details',
      update: 'Edit office information, reassign head',
      delete: 'Deactivate an office',
    },
  },
  {
    id: 'users',
    name: 'Users',
    group: 'Management',
    description: 'Manage system user accounts',
    actions: {
      create: 'Create new user accounts',
      read: 'View user list and profiles',
      update: 'Edit user details, change role, reset password',
      delete: 'Deactivate a user account',
    },
  },
  {
    id: 'permissions',
    name: 'Module Permissions',
    group: 'Management',
    description: 'Assign module access permissions to users',
    actions: {
      create: 'Assign new permissions to a user',
      read: 'View permission assignments',
      update: 'Modify existing permission levels',
      delete: 'Revoke user permissions',
    },
  },

  // ── REPORTS ────────────────────────────────
  {
    id: 'reports_document',
    name: 'Document Reports',
    group: 'Reports',
    description: 'Document summary and volume analytics',
    actions: {
      create: 'N/A',
      read: 'View document summary reports',
      update: 'N/A',
      delete: 'N/A',
    },
  },
  {
    id: 'reports_office',
    name: 'Office Performance',
    group: 'Reports',
    description: 'Office-level performance metrics',
    actions: {
      create: 'N/A',
      read: 'View office performance reports',
      update: 'N/A',
      delete: 'N/A',
    },
  },
  {
    id: 'reports_compliance',
    name: 'Compliance Reports',
    group: 'Reports',
    description: 'SLA compliance and overdue analytics',
    actions: {
      create: 'N/A',
      read: 'View compliance reports',
      update: 'N/A',
      delete: 'N/A',
    },
  },
  {
    id: 'audit_trail',
    name: 'Audit Trail',
    group: 'Reports',
    description: 'System-wide action audit log',
    actions: {
      create: 'N/A',
      read: 'View full audit trail',
      update: 'N/A',
      delete: 'N/A',
    },
  },

  // ── SETTINGS ───────────────────────────────
  {
    id: 'settings_general',
    name: 'General Settings',
    group: 'Settings',
    description: 'Agency name, address, logo, basic configuration',
    actions: {
      create: 'N/A',
      read: 'View general settings',
      update: 'Edit general settings',
      delete: 'N/A',
    },
  },
  {
    id: 'settings_tracking',
    name: 'Tracking Codes',
    group: 'Settings',
    description: 'Tracking code format and sequence configuration',
    actions: {
      create: 'N/A',
      read: 'View tracking code settings',
      update: 'Modify tracking code format',
      delete: 'N/A',
    },
  },
  {
    id: 'settings_sla',
    name: 'SLA & Deadlines',
    group: 'Settings',
    description: 'Processing time rules and escalation settings',
    actions: {
      create: 'Add new SLA rules',
      read: 'View SLA configuration',
      update: 'Edit SLA rules and deadlines',
      delete: 'Remove an SLA rule',
    },
  },
  {
    id: 'settings_notifications',
    name: 'Notification Settings',
    group: 'Settings',
    description: 'Email and in-app notification configuration',
    actions: {
      create: 'N/A',
      read: 'View notification settings',
      update: 'Edit notification preferences',
      delete: 'N/A',
    },
  },
  {
    id: 'settings_backup',
    name: 'Backup & Archive',
    group: 'Settings',
    description: 'Data backup, export, and archiving',
    actions: {
      create: 'Trigger a backup / export',
      read: 'View backup history',
      update: 'N/A',
      delete: 'Delete old backups / purge archives',
    },
  },
]

export const MODULE_GROUPS: ModuleGroup[] = ['Documents', 'Routing', 'Management', 'Reports', 'Settings']

export function getModulesByGroup(group: ModuleGroup): ModuleDefinition[] {
  return SYSTEM_MODULES.filter(m => m.group === group)
}

export function getModuleById(id: ModuleId): ModuleDefinition | undefined {
  return SYSTEM_MODULES.find(m => m.id === id)
}

// ─── CRUD Helpers ────────────────────────────────────────────
const ALL_TRUE: CRUDActions = { create: true, read: true, update: true, delete: true }
const ALL_FALSE: CRUDActions = { create: false, read: false, update: false, delete: false }
const READ_ONLY: CRUDActions = { create: false, read: true, update: false, delete: false }

function crud(c: boolean, r: boolean, u: boolean, d: boolean): CRUDActions {
  return { create: c, read: r, update: u, delete: d }
}

// ─── Role Default Permissions ────────────────────────────────
export const ROLE_DEFAULT_PERMISSIONS: RoleDefaultPermissions = {
  'Super Admin': {
    documents_incoming:     ALL_TRUE,
    documents_outgoing:     ALL_TRUE,
    documents_all:          ALL_TRUE,
    routing_forward:        ALL_TRUE,
    routing_map:            ALL_TRUE,
    offices:                ALL_TRUE,
    users:                  ALL_TRUE,
    permissions:            ALL_TRUE,
    reports_document:       ALL_TRUE,
    reports_office:         ALL_TRUE,
    reports_compliance:     ALL_TRUE,
    audit_trail:            ALL_TRUE,
    settings_general:       ALL_TRUE,
    settings_tracking:      ALL_TRUE,
    settings_sla:           ALL_TRUE,
    settings_notifications: ALL_TRUE,
    settings_backup:        ALL_TRUE,
  },

  'Admin': {
    documents_incoming:     crud(true, true, true, true),
    documents_outgoing:     crud(false, true, true, false),
    documents_all:          crud(false, true, true, false),
    routing_forward:        crud(true, true, true, false),
    routing_map:            READ_ONLY,
    offices:                crud(true, true, true, false),
    users:                  crud(true, true, true, false),
    permissions:            READ_ONLY,
    reports_document:       READ_ONLY,
    reports_office:         READ_ONLY,
    reports_compliance:     READ_ONLY,
    audit_trail:            READ_ONLY,
    settings_general:       crud(false, true, true, false),
    settings_tracking:      crud(false, true, true, false),
    settings_sla:           crud(true, true, true, true),
    settings_notifications: crud(false, true, true, false),
    settings_backup:        crud(true, true, false, false),
  },

  'Department Head': {
    documents_incoming:     crud(true, true, true, false),
    documents_outgoing:     crud(false, true, true, false),
    documents_all:          READ_ONLY,
    routing_forward:        crud(true, true, true, false),
    routing_map:            READ_ONLY,
    offices:                READ_ONLY,
    users:                  READ_ONLY,
    permissions:            ALL_FALSE,
    reports_document:       READ_ONLY,
    reports_office:         READ_ONLY,
    reports_compliance:     READ_ONLY,
    audit_trail:            READ_ONLY,
    settings_general:       ALL_FALSE,
    settings_tracking:      ALL_FALSE,
    settings_sla:           READ_ONLY,
    settings_notifications: crud(false, true, true, false),
    settings_backup:        ALL_FALSE,
  },

  'Records Officer': {
    documents_incoming:     crud(true, true, true, false),
    documents_outgoing:     crud(false, true, true, false),
    documents_all:          READ_ONLY,
    routing_forward:        crud(true, true, true, false),
    routing_map:            READ_ONLY,
    offices:                READ_ONLY,
    users:                  ALL_FALSE,
    permissions:            ALL_FALSE,
    reports_document:       READ_ONLY,
    reports_office:         ALL_FALSE,
    reports_compliance:     ALL_FALSE,
    audit_trail:            ALL_FALSE,
    settings_general:       ALL_FALSE,
    settings_tracking:      ALL_FALSE,
    settings_sla:           ALL_FALSE,
    settings_notifications: crud(false, true, true, false),
    settings_backup:        ALL_FALSE,
  },

  'Staff': {
    documents_incoming:     crud(false, true, true, false),
    documents_outgoing:     crud(false, true, false, false),
    documents_all:          ALL_FALSE,
    routing_forward:        crud(true, true, false, false),
    routing_map:            READ_ONLY,
    offices:                READ_ONLY,
    users:                  ALL_FALSE,
    permissions:            ALL_FALSE,
    reports_document:       ALL_FALSE,
    reports_office:         ALL_FALSE,
    reports_compliance:     ALL_FALSE,
    audit_trail:            ALL_FALSE,
    settings_general:       ALL_FALSE,
    settings_tracking:      ALL_FALSE,
    settings_sla:           ALL_FALSE,
    settings_notifications: crud(false, true, true, false),
    settings_backup:        ALL_FALSE,
  },

  'Read Only': {
    documents_incoming:     READ_ONLY,
    documents_outgoing:     READ_ONLY,
    documents_all:          READ_ONLY,
    routing_forward:        READ_ONLY,
    routing_map:            READ_ONLY,
    offices:                READ_ONLY,
    users:                  ALL_FALSE,
    permissions:            ALL_FALSE,
    reports_document:       ALL_FALSE,
    reports_office:         ALL_FALSE,
    reports_compliance:     ALL_FALSE,
    audit_trail:            ALL_FALSE,
    settings_general:       ALL_FALSE,
    settings_tracking:      ALL_FALSE,
    settings_sla:           ALL_FALSE,
    settings_notifications: ALL_FALSE,
    settings_backup:        ALL_FALSE,
  },
}

// ─── Default Presets ─────────────────────────────────────────
export const DEFAULT_PRESETS: PermissionPreset[] = [
  {
    id: 'preset-full-access',
    name: 'Full Access',
    description: 'Complete access to all modules (excluding permission management)',
    permissions: SYSTEM_MODULES.map(m => ({
      moduleId: m.id,
      actions: m.id === 'permissions' ? ALL_FALSE : ALL_TRUE,
    })),
    createdBy: 'system',
    createdAt: new Date('2024-01-01'),
    isSystem: true,
  },
  {
    id: 'preset-records-officer',
    name: 'Records Officer Standard',
    description: 'Standard access for records officers — document intake, routing, and basic reports',
    permissions: SYSTEM_MODULES.map(m => ({
      moduleId: m.id,
      actions: ROLE_DEFAULT_PERMISSIONS['Records Officer'][m.id],
    })),
    createdBy: 'system',
    createdAt: new Date('2024-01-01'),
    isSystem: true,
  },
  {
    id: 'preset-viewer',
    name: 'Viewer Only',
    description: 'Read-only access to documents, routing, and offices',
    permissions: SYSTEM_MODULES.map(m => ({
      moduleId: m.id,
      actions: ROLE_DEFAULT_PERMISSIONS['Read Only'][m.id],
    })),
    createdBy: 'system',
    createdAt: new Date('2024-01-01'),
    isSystem: true,
  },
]
