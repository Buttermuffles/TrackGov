# 🏛️ TrackGov — Government Document Tracking System

> **Transparency. Accountability. Efficiency.**

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Brand & Design System](#brand--design-system)
4. [Dark Mode](#dark-mode)
5. [Project Structure](#project-structure)
6. [TypeScript Interfaces](#typescript-interfaces)
7. [Pages & Features](#pages--features)
   - [Login / Auth](#login--auth)
   - [Dashboard](#dashboard)
   - [Incoming Documents](#incoming-documents)
   - [Document Detail View](#document-detail-view)
   - [Route / Forward](#route--forward)
   - [Outgoing Documents](#outgoing-documents)
   - [All Documents](#all-documents)
   - [Routing Map](#routing-map-visual)
   - [Offices / Departments](#offices--departments)
   - [Users](#users)
   - [Reports & Analytics](#reports--analytics)
   - [Public Tracker](#public-tracker)
   - [Settings](#settings)
8. [Module Permission Access (MVC)](#module-permission-access-mvc)
   - [Concept & Architecture](#concept--architecture)
   - [All Modules & Actions](#all-modules--actions)
   - [TypeScript Interfaces](#permission-typescript-interfaces)
   - [Permission Matrix UI](#permission-matrix-ui)
   - [Super Admin Assignment Flow](#super-admin-assignment-flow)
   - [MVC Guard Implementation](#mvc-guard-implementation)
   - [Zustand Permission Store](#zustand-permission-store)
   - [Route & Component Guards](#route--component-guards)
   - [Audit Logging](#permission-audit-logging)
9. [Confirmation Dialogs](#confirmation-dialogs--every-transaction)
10. [OCR Integration](#ocr-integration)
11. [Notifications System](#notifications-system)
12. [Keyboard Shortcuts](#keyboard-shortcuts)
13. [Mock / Seed Data](#mock--seed-data)
14. [Implementation Order](#implementation-order)
15. [Demo Credentials](#demo-credentials)

---

## Overview

**TrackGov** is a full-featured Government Document Tracking and Management System designed for local and national government offices. It enables efficient routing, monitoring, and auditing of documents across departments with full accountability and transparency.

### Core Capabilities

- **Document Intake** — Receive and register incoming documents with auto-generated tracking codes
- **Smart Routing** — Forward documents across offices with action requirements and due dates
- **Real-time Tracking** — Full routing history timeline per document
- **OCR Scanning** — Extract document metadata using `Tesseract.js` + `pdf.js`
- **Public Portal** — Citizens can track their documents without logging in
- **Module Permission Access** — Super Admin assigns granular CRUD permissions per user per module (MVC pattern)
- **Analytics & Reports** — Performance metrics, turnaround times, compliance rates
- **Dark Mode** — Full system-wide dark/light theme toggle
- **Audit Trail** — Every action logged with timestamp and user

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router v6 |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table v8 |
| Charts | Recharts |
| Dates | date-fns |
| Icons | lucide-react |
| OCR | **Tesseract.js v5** + **pdfjs-dist** |
| QR Codes | qrcode.react + html5-qrcode |
| Dark Mode | next-themes / class-based Tailwind dark |

---

## Brand & Design System

### Color Tokens

```css
/* Light Mode */
--color-primary:        #1E3A5F;   /* Navy Blue */
--color-primary-hover:  #2a4d7a;
--color-accent:         #CA8A04;   /* Gold */
--color-accent-light:   #FEF9C3;
--color-bg:             #F8FAFC;   /* Slate 50 */
--color-surface:        #FFFFFF;
--color-border:         #E2E8F0;
--color-text:           #0F172A;
--color-muted:          #64748B;
--color-success:        #15803D;
--color-warning:        #B45309;
--color-danger:         #B91C1C;
--color-info:           #1D4ED8;

/* Dark Mode */
--color-bg-dark:        #0F172A;   /* Slate 900 */
--color-surface-dark:   #1E293B;   /* Slate 800 */
--color-border-dark:    #334155;   /* Slate 700 */
--color-text-dark:      #F1F5F9;   /* Slate 100 */
--color-muted-dark:     #94A3B8;   /* Slate 400 */
--color-primary-dark:   #3B82F6;   /* Blue 500 (brighter in dark) */
--color-accent-dark:    #EAB308;   /* Yellow 500 */
```

### Typography

| Element | Style |
|---|---|
| Display Headings | `font-bold tracking-tight` |
| Section Headings | `font-semibold text-slate-700` |
| Body Text | `text-sm text-slate-600` |
| Labels | `text-xs uppercase tracking-widest text-slate-400` |
| Tracking Codes | `font-mono text-blue-700` (blue-400 dark) |
| Timestamps | `text-xs text-slate-400 tabular-nums` |

### Status Badge Colors

| Status | Light | Dark |
|---|---|---|
| Received | `bg-blue-100 text-blue-700` | `bg-blue-900/30 text-blue-300` |
| In Review | `bg-yellow-100 text-yellow-700` | `bg-yellow-900/30 text-yellow-300` |
| For Signature | `bg-purple-100 text-purple-700` | `bg-purple-900/30 text-purple-300` |
| In Transit | `bg-orange-100 text-orange-700` | `bg-orange-900/30 text-orange-300` |
| Completed | `bg-green-100 text-green-700` | `bg-green-900/30 text-green-300` |
| Overdue | `bg-red-100 text-red-700` | `bg-red-900/30 text-red-300` |
| On Hold | `bg-slate-100 text-slate-600` | `bg-slate-700 text-slate-300` |
| Cancelled | `bg-slate-100 text-slate-400 line-through` | — |

---

## Dark Mode

### Implementation

Dark mode uses **Tailwind's class-based dark strategy** (`darkMode: 'class'`) with a theme toggle persisted in `localStorage`.

```tsx
// ThemeProvider (wrap at root)
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <App />
</ThemeProvider>

// Toggle component
const { theme, setTheme } = useTheme()
<Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  {theme === 'dark' ? <Sun /> : <Moon />}
</Button>
```

### Dark Mode Rules

- Sidebar: `bg-[#1E3A5F] dark:bg-slate-900`
- Cards: `bg-white dark:bg-slate-800`
- Background: `bg-slate-50 dark:bg-slate-900`
- Inputs: `dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100`
- Tables: `dark:bg-slate-800 dark:border-slate-700`
- Hover rows: `hover:bg-slate-50 dark:hover:bg-slate-700`
- All shadcn/ui components support dark mode via CSS variables
- Charts use conditional color arrays based on `useTheme()`
- The theme toggle button sits in the top Header bar (right side)
- System preference respected on first load

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          # Nav + user info
│   │   ├── Header.tsx           # Breadcrumb, search, theme toggle, notifs
│   │   └── PageWrapper.tsx      # Consistent page padding + title
│   ├── ui/                      # shadcn/ui re-exports
│   ├── documents/
│   │   ├── DocCard.tsx          # Card view for document grid
│   │   ├── DocTimeline.tsx      # Routing history stepper
│   │   ├── DocStatusBadge.tsx   # Color-coded status pill
│   │   └── DocPriorityBadge.tsx
│   ├── routing/
│   │   ├── ForwardingWizard.tsx # 3-step routing wizard
│   │   ├── RouteStep.tsx        # Single timeline entry
│   │   └── RoutingSlip.tsx      # Printable slip
│   ├── ocr/
│   │   ├── OCRScanner.tsx       # Tesseract.js scanner UI
│   │   ├── PDFExtractor.tsx     # pdfjs-dist extractor
│   │   └── OCRResultForm.tsx    # Pre-filled form from OCR
│   └── shared/
│       ├── DataTable.tsx        # TanStack Table wrapper
│       ├── ConfirmDialog.tsx    # Reusable confirmation modal ← KEY
│       ├── SearchBar.tsx        # Global command palette
│       ├── FileUpload.tsx       # Drag-and-drop uploader
│       ├── QRCodeDisplay.tsx    # QR code generator + scanner
│       └── EmptyState.tsx       # Consistent empty views
├── pages/
│   ├── Dashboard.tsx
│   ├── Incoming.tsx
│   ├── Outgoing.tsx
│   ├── AllDocuments.tsx
│   ├── DocumentDetail.tsx
│   ├── RoutingWizard.tsx
│   ├── RoutingMap.tsx
│   ├── Offices.tsx
│   ├── Users.tsx
│   ├── Reports.tsx
│   ├── Settings.tsx
│   ├── PublicTracker.tsx        # /track — no auth required
│   └── Login.tsx
├── store/
│   ├── useDocumentStore.ts
│   ├── useAuthStore.ts
│   ├── useOfficeStore.ts
│   ├── useNotificationStore.ts
│   └── useThemeStore.ts
├── types/
│   └── index.ts                 # All interfaces
├── hooks/
│   ├── useConfirm.ts            # Programmatic confirm dialog
│   ├── useOCR.ts                # OCR processing hook
│   └── useDebounce.ts
└── lib/
    ├── mockData.ts
    ├── validators.ts            # Zod schemas
    ├── trackingCode.ts          # Code generator utility
    └── utils.ts
```

---

## TypeScript Interfaces

```typescript
// ─── DOCUMENT ───────────────────────────────────────────────
interface Document {
  id: string;
  trackingCode: string;        // e.g. "TRK-2024-00145"
  title: string;
  description: string;
  documentType: DocumentType;
  classification: Classification;
  priority: Priority;
  originatorId: string;
  originOfficeId: string;
  currentOfficeId: string;
  currentAssigneeId?: string;
  status: DocumentStatus;
  attachments: Attachment[];
  routingHistory: RoutingEntry[];
  remarks: Remark[];
  dueDate?: Date;
  dateReceived: Date;
  dateCreated: Date;
  updatedAt: Date;
  tags: string[];
  referenceNumber?: string;
  isConfidential: boolean;
  qrCode?: string;
  ocrExtracted?: OCRData;      // from OCR scan
}

type DocumentType =
  | "Letter" | "Memorandum" | "Resolution" | "Ordinance"
  | "Contract" | "Report" | "Request" | "Petition"
  | "Certificate" | "Voucher" | "Purchase Order" | "Other";

type Classification = "Routine" | "Priority" | "Confidential" | "Top Secret";
type Priority = "Low" | "Normal" | "High" | "Urgent";

type DocumentStatus =
  | "Received" | "In Review" | "For Signature" | "For Routing"
  | "In Transit" | "Action Taken" | "Returned" | "Completed"
  | "On Hold" | "Cancelled";

// ─── ROUTING ────────────────────────────────────────────────
interface RoutingEntry {
  id: string;
  documentId: string;
  fromOfficeId: string;
  toOfficeId: string;
  fromUserId: string;
  toUserId?: string;
  action: RoutingAction;
  remarks: string;
  attachments?: Attachment[];
  timestamp: Date;
  receivedAt?: Date;
  dueDate?: Date;
  isAcknowledged: boolean;
}

type RoutingAction =
  | "Forwarded" | "Returned" | "Endorsed" | "For Signature"
  | "For Review" | "For Action" | "For Information" | "Approved"
  | "Disapproved" | "Noted" | "Filed";

// ─── OFFICE ─────────────────────────────────────────────────
interface Office {
  id: string;
  code: string;
  name: string;
  headId?: string;
  parentOfficeId?: string;
  staffCount: number;
  isActive: boolean;
  description?: string;
}

// ─── USER ───────────────────────────────────────────────────
interface User {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  officeId: string;
  role: UserRole;
  position: string;
  signature?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

type UserRole =
  | "Super Admin" | "Admin" | "Department Head"
  | "Records Officer" | "Staff" | "Read Only";

// ─── OCR ────────────────────────────────────────────────────
interface OCRData {
  rawText: string;
  confidence: number;
  extractedFields: {
    title?: string;
    referenceNumber?: string;
    date?: string;
    sender?: string;
    recipient?: string;
    subject?: string;
  };
  processedAt: Date;
  engine: "tesseract" | "pdfjs";
}

// ─── NOTIFICATIONS ───────────────────────────────────────────
interface Notification {
  id: string;
  userId: string;
  type: "incoming" | "action_required" | "overdue" | "forwarded" | "system";
  title: string;
  message: string;
  documentId?: string;
  isRead: boolean;
  createdAt: Date;
}

// ─── ATTACHMENTS ─────────────────────────────────────────────
interface Attachment {
  id: string;
  filename: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  ocrProcessed?: boolean;
}

// ─── REMARKS ─────────────────────────────────────────────────
interface Remark {
  id: string;
  documentId: string;
  userId: string;
  content: string;
  isInternal: boolean;
  createdAt: Date;
}
```

---

## Pages & Features

### Login / Auth

**Route:** `/login` — Public, no auth required

**Layout:**
- Left panel (40%): Navy blue, official seal, system name, tagline, grid texture
- Right panel (60%): White form — Employee ID / Email + Password

**Auth Flow:**
1. Submit credentials
2. Role-based redirect: Admin/Records Officer → Dashboard; Staff → Incoming
3. Auth guard on all protected routes
4. Session persisted in Zustand + localStorage

---

### Dashboard

Role-aware view (admin = system-wide, staff = own office only).

**KPI Cards:**

| Card | Value | Action |
|---|---|---|
| 📥 Incoming Today | Count + delta | View list |
| ⏳ For Action | Pending docs | View queue |
| ✅ Completed Today | Count | View list |
| 🔴 Overdue | Count (red badge) | View + remind |
| 📄 Total This Month | Cumulative | View all |

**Charts:**
- Line chart: 30-day document volume (received vs completed vs overdue)
- Horizontal bar: Top 8 offices by document count

**Bottom Grid:**
- Recent Activity Feed (timeline)
- Overdue & Urgent list with `[Remind]` button
- My Personal Action Queue
- Document Type Donut Chart

---

### Incoming Documents

**Sub-tabs:** `[Unacknowledged]` `[All Incoming]`

**Table Columns:**
`Tracking Code` | `Title` | `Type` | `From Office` | `Date Received` | `Priority` | `Status` | `Due Date` | `Assigned To` | `Actions`

**Row Styles:**
- Unacknowledged: `bg-blue-50 dark:bg-blue-900/20` + bold tracking code
- Overdue: `bg-red-50 dark:bg-red-900/20` + left red border

**Actions per row:** `[View]` `[Acknowledge]` `[Forward]` `[Add Remark]`

**Receive New Document Form (Sheet):**
- Document Title, Type, Reference#, Classification, Priority
- From (external sender / internal office), Date of Document, Date Received, Due Date
- Subject / Description, Tags
- File attachments (drag-and-drop)
- OCR scan button (for uploaded image/PDF)
- Initial routing: Assign to Office + Person + Action Required
- Auto-generate tracking code button

---

### Document Detail View

**Header Card:**
```
[Priority]  [Status]  [Classification]          [QR Code]
TRK-2024-00145
Title: Request for Budget Allocation FY2025
Type: Request  |  Ref#: LGU-2024-089
Received: Nov 12, 2024  |  Due: Nov 20, 2024  (3 days remaining)
Currently at: Budget Office → Maria Santos (For Review)
```

**Action Buttons:**
`[Forward ▶]` `[Add Remark]` `[Upload File]` `[Print]` `[QR Code]` `[Mark Complete]` `[Hold]` `[Return]` `[▼ More]`

**Main Layout (Two Column):**

Left (65%) — Routing Timeline (vertical stepper):
- Each entry: timestamp, actor, action type icon, office chain, remarks, files
- Current position animated (pulsing ring)
- Pending steps shown as empty circles

Right (35%) — Info Panel:
- Document metadata (editable for authorized roles)
- All attachments across routing history
- Remarks thread (internal vs official toggle)
- Related/linked documents

---

### Route / Forward

**3-Step Wizard:**

```
Step 1: Select Document (if not pre-selected)
   └─ Search by tracking code or title

Step 2: Routing Details
   ├─ Route To: Office (searchable select)
   ├─ Assign To: Specific person (optional)
   ├─ Action: For Review / Signature / Action / FYI / Approve / Return...
   ├─ Instructions / Remarks (required)
   ├─ Priority override (optional)
   ├─ Due Date override (optional)
   └─ Additional attachments

Step 3: Review & Confirm
   └─ Summary card → [Back] [✅ Confirm & Forward]
```

On success: Toast + option to print routing slip (PDF).

---

### Outgoing Documents

**Sub-tabs:** `[In Transit]` `[Acknowledged]` `[All Outgoing]`

**Table:** `Tracking Code` | `Title` | `Type` | `Sent To` | `Date Sent` | `Action` | `Status` | `Acknowledged`

- In-Transit rows highlighted
- `[Send Reminder]` shown for unacknowledged items > 24hrs

---

### All Documents

**Advanced Filter Panel (collapsible):**
Search | Type | Status | Priority | Office | Classification | Date Range | Has Attachments | Overdue Only | Tags

**View Modes:**
- 📋 Table View (default)
- 📇 Card Grid
- 🗓️ Calendar View (by due date)

**Card Grid:** Tracking code (prominent mono) + Status badge + Priority left-border + Location + Progress indicator + Quick actions

---

### Routing Map (Visual)

- **Nodes** = Offices (boxes with code, name, doc count badge)
- **Edges** = Document flow between offices (animated dots = in-transit)
- **Edge thickness** = volume
- **Node color coding:** green (normal), yellow (high load), red (has overdue)
- Click office node → detail panel: current docs in/out/pending
- Filter: specific document | date range | document type
- Linear route view for selected document (horizontal stepper)

---

### Offices / Departments

**Views:** `[Table]` `[Org Chart Tree]`

**Table:** `Code` | `Office Name` | `Head` | `Staff Count` | `Active Docs` | `Status` | `Actions`

**Org Chart:** Collapsible tree hierarchy (Mayor/Agency → Departments → Divisions → Units)

**Add/Edit Office Dialog:**
- Code, Full Name, Abbreviation, Parent Office, Head (user select), Description, Status

---

### Users

**Filter:** Office | Role | Status | Search

**Table:** `Employee ID` | `Name` | `Position` | `Office` | `Role` | `Status` | `Last Login` | `Actions`

**Add/Edit User Sheet:**
- Employee ID, First/Last Name, Email, Phone
- Position, Office (select), Role (select with descriptions)
- Signature upload
- Status, Send Welcome Email

**Role Permissions Matrix:**

| Feature | Super Admin | Admin | Dept Head | Records Officer | Staff | Read Only |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| View all docs | ✅ | ✅ | 👁️ Office | 👁️ Office | 👁️ Assigned | 👁️ |
| Receive docs | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Forward docs | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Approve/Sign | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage users | ✅ | 👁️ Office | ❌ | ❌ | ❌ | ❌ |
| System settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View reports | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

---

### Reports & Analytics

**Tabs:** `[Document Summary]` `[Office Performance]` `[Processing Time]` `[Compliance]` `[Audit Trail]`

**Document Summary:** KPI row + area chart (daily volume) + stacked bar (monthly by type) + status donut + Export CSV/PDF

**Office Performance:** Bar chart + table with Received/Completed/Pending/Overdue/Avg Days/Rating badge

**Processing Time:** Avg TAT per type, per routing stage, bottleneck analysis, day-of-week heatmap

**Compliance:** SLA compliance %, overdue trend, per-office breakdown

**Audit Trail:** Full action log — Timestamp | User | Action | Document | Office | IP — filterable + exportable

---

### Public Tracker

**Route:** `/track` — No login required. Citizen-facing.

**Interface:**
- Clean, minimal design
- Large search input: "Enter your Tracking Code"
- QR code scanner button (mobile)

**Result (public-safe fields only):**
```
Document: Request for Business Permit
Reference #: BP-2024-0091
Status: 🔵 In Review
Currently at: Business Permits Office
Date Filed: Nov 10, 2024
Last Updated: Nov 14, 2024 — 9:30 AM

TRACKING HISTORY:
✅ Nov 10 — Received by City Hall Records
✅ Nov 11 — Forwarded to BPLO
🔵 Nov 12 — Under review by BPLO
○  Awaiting next action
```

> Confidential documents show only: "Status: Processing — Your document is being handled."

---

### Settings

**Tabs:** `[General]` `[Tracking Codes]` `[Notifications]` `[SLA / Deadlines]` `[Email]` `[Backup & Archive]`

| Tab | Key Settings |
|---|---|
| General | Agency name, address, logo, seal, timezone, date format |
| Tracking Codes | Prefix format, year toggle, padding, sequence reset |
| Notifications | Email + in-app triggers, digest frequency, per-role defaults |
| SLA / Deadlines | Processing days per type/action, escalation rules, holiday calendar |
| Email | SMTP config, templates, test send |
| Backup | Export all data (JSON/CSV), archive completed docs, restore |

---

## Module Permission Access (MVC)

### Concept & Architecture

TrackGov uses a **granular, per-user Module Permission system** that goes beyond role-based access. The Super Admin can assign any individual user specific **CRUD permissions** (Create, Read/View, Update, Delete) on a **per-module basis**, independent of their role.

This follows the **MVC (Model-View-Controller)** pattern:
- **Model** — Permission records stored in Zustand + backend (user × module × action)
- **View** — The Permission Matrix UI in the Super Admin panel
- **Controller** — Guards applied at the route level, component level, and API call level

```
Super Admin
    │
    ▼
Permission Assignment UI  ──────────────────────────────────┐
    │                                                        │
    ▼                                                        ▼
ModulePermission record              Enforced by:
{                                    ├── Route Guard (page access)
  userId: "user_123",                ├── Component Guard (button/action visibility)
  module: "Documents",               ├── usePermission() hook
  actions: {                         └── API middleware check
    create: true,
    read:   true,
    update: false,
    delete: false,
  }
}
```

**Priority Rules:**
1. Super Admin always has full access (bypasses all checks)
2. If a user has explicit module permissions assigned → use those
3. If no explicit permissions → fall back to role defaults
4. Deny by default — if no record exists, access is denied

---

### All Modules & Actions

Every module in TrackGov has exactly four controllable actions:

| Icon | Action | Meaning |
|---|---|---|
| ➕ | **Create** | Add new records, submit new entries, receive new documents |
| 👁️ | **Read / View** | View pages, view records, view details, view reports |
| ✏️ | **Update** | Edit existing records, change status, forward/route, acknowledge |
| 🗑️ | **Delete** | Delete records, void/cancel, deactivate, archive |

---

### Module Registry — Full List

```typescript
const SYSTEM_MODULES = [
  // ── DOCUMENTS ──────────────────────────────
  {
    id: "documents_incoming",
    name: "Incoming Documents",
    group: "Documents",
    description: "Receive, acknowledge, and manage incoming documents",
    actions: {
      create: "Receive new document into the system",
      read:   "View incoming document list and details",
      update: "Acknowledge receipt, add remarks, change status",
      delete: "Void or cancel an incoming document",
    }
  },
  {
    id: "documents_outgoing",
    name: "Outgoing Documents",
    group: "Documents",
    description: "View and manage documents sent from this office",
    actions: {
      create: "N/A (auto-created when forwarding)",
      read:   "View outgoing document list",
      update: "Send reminders for unacknowledged outgoing docs",
      delete: "Recall / retract a forwarded document",
    }
  },
  {
    id: "documents_all",
    name: "All Documents",
    group: "Documents",
    description: "System-wide document registry",
    actions: {
      create: "N/A",
      read:   "View all documents across all offices",
      update: "Edit document metadata",
      delete: "Archive or permanently remove documents",
    }
  },

  // ── ROUTING ────────────────────────────────
  {
    id: "routing_forward",
    name: "Route / Forward",
    group: "Routing",
    description: "Route documents between offices",
    actions: {
      create: "Create a new routing/forwarding action",
      read:   "View routing wizard and routing options",
      update: "Edit a pending routing instruction",
      delete: "Cancel a routing action before receipt",
    }
  },
  {
    id: "routing_map",
    name: "Routing Map",
    group: "Routing",
    description: "Visual routing flow between offices",
    actions: {
      create: "N/A",
      read:   "View the routing map visualization",
      update: "N/A",
      delete: "N/A",
    }
  },

  // ── OFFICES ────────────────────────────────
  {
    id: "offices",
    name: "Offices / Departments",
    group: "Management",
    description: "Manage government offices and departments",
    actions: {
      create: "Add a new office or department",
      read:   "View office list, org chart, office details",
      update: "Edit office info, assign office head",
      delete: "Deactivate an office",
    }
  },

  // ── USERS ──────────────────────────────────
  {
    id: "users",
    name: "Users",
    group: "Management",
    description: "Manage system user accounts",
    actions: {
      create: "Create new user accounts",
      read:   "View user list and profiles",
      update: "Edit user info, change role, reset password",
      delete: "Deactivate a user account",
    }
  },

  // ── PERMISSIONS ────────────────────────────
  {
    id: "permissions",
    name: "Module Permissions",
    group: "Management",
    description: "Assign module access permissions to users",
    actions: {
      create: "Assign new permissions to a user",
      read:   "View permission matrix",
      update: "Modify existing user permissions",
      delete: "Revoke user permissions",
    }
  },

  // ── REPORTS ────────────────────────────────
  {
    id: "reports_document",
    name: "Document Reports",
    group: "Reports",
    description: "Document summary and volume analytics",
    actions: {
      create: "N/A",
      read:   "View document summary reports",
      update: "N/A",
      delete: "N/A",
    }
  },
  {
    id: "reports_office",
    name: "Office Performance Reports",
    group: "Reports",
    description: "Per-office performance and efficiency metrics",
    actions: {
      create: "N/A",
      read:   "View office performance reports",
      update: "N/A",
      delete: "N/A",
    }
  },
  {
    id: "reports_compliance",
    name: "Compliance Reports",
    group: "Reports",
    description: "SLA compliance and overdue analysis",
    actions: {
      create: "N/A",
      read:   "View compliance reports",
      update: "N/A",
      delete: "N/A",
    }
  },
  {
    id: "audit_trail",
    name: "Audit Trail",
    group: "Reports",
    description: "Full system action log",
    actions: {
      create: "N/A",
      read:   "View audit trail",
      update: "N/A",
      delete: "Clear/archive old audit entries",
    }
  },

  // ── SETTINGS ───────────────────────────────
  {
    id: "settings_general",
    name: "General Settings",
    group: "Settings",
    description: "Agency info, logo, timezone",
    actions: {
      create: "N/A",
      read:   "View general settings",
      update: "Edit general settings",
      delete: "N/A",
    }
  },
  {
    id: "settings_tracking",
    name: "Tracking Code Settings",
    group: "Settings",
    description: "Configure tracking code format and sequence",
    actions: {
      create: "N/A",
      read:   "View tracking code settings",
      update: "Edit tracking code format",
      delete: "Reset tracking sequence",
    }
  },
  {
    id: "settings_sla",
    name: "SLA & Deadline Settings",
    group: "Settings",
    description: "Configure processing deadlines and escalations",
    actions: {
      create: "Add new SLA rule",
      read:   "View SLA settings",
      update: "Edit SLA rules",
      delete: "Remove an SLA rule",
    }
  },
  {
    id: "settings_notifications",
    name: "Notification Settings",
    group: "Settings",
    description: "Email and in-app notification configuration",
    actions: {
      create: "N/A",
      read:   "View notification settings",
      update: "Edit notification preferences",
      delete: "N/A",
    }
  },
  {
    id: "settings_backup",
    name: "Backup & Archive",
    group: "Settings",
    description: "Data backup, export, and archiving",
    actions: {
      create: "Trigger a backup / export",
      read:   "View backup history",
      update: "N/A",
      delete: "Delete old backups / purge archives",
    }
  },
] as const;

export type ModuleId = typeof SYSTEM_MODULES[number]['id'];
export type CRUDAction = 'create' | 'read' | 'update' | 'delete';
export type ModuleGroup = "Documents" | "Routing" | "Management" | "Reports" | "Settings";
```

---

### Permission TypeScript Interfaces

```typescript
// ─── PERMISSION RECORD ──────────────────────────────────────
interface ModulePermission {
  id: string;
  userId: string;
  moduleId: ModuleId;
  actions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  grantedBy: string;       // Super Admin userId who assigned it
  grantedAt: Date;
  updatedAt: Date;
  notes?: string;          // Optional reason/justification
  expiresAt?: Date;        // Optional: temporary permission with expiry
  isActive: boolean;
}

// ─── PERMISSION PRESET / TEMPLATE ───────────────────────────
interface PermissionPreset {
  id: string;
  name: string;            // e.g., "Records Officer Standard", "Read-Only Viewer"
  description: string;
  permissions: Array<{
    moduleId: ModuleId;
    actions: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  }>;
  createdBy: string;
  createdAt: Date;
  isSystem: boolean;       // system defaults vs custom presets
}

// ─── ROLE DEFAULT PERMISSIONS ────────────────────────────────
// Fallback used when no explicit ModulePermission exists for user
type RoleDefaultPermissions = {
  [role in UserRole]: {
    [moduleId in ModuleId]: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  };
};

// ─── PERMISSION CHECK RESULT ────────────────────────────────
interface PermissionCheckResult {
  allowed: boolean;
  source: "super_admin" | "explicit" | "role_default" | "denied";
  moduleId: ModuleId;
  action: CRUDAction;
}
```

---

### Permission Matrix UI

**Route:** `/settings/permissions` (Super Admin only)

**Layout:** Full-page with user selector on left, permission matrix on right.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🔐 Module Permission Access                    [+ Apply Preset]         │
├──────────────────┬──────────────────────────────────────────────────────┤
│                  │                                                        │
│  👤 Select User  │  Permissions for: Maria Santos                        │
│  ─────────────── │  Office: Budget Office  |  Role: Staff                │
│  🔍 Search users │  ─────────────────────────────────────────────────── │
│                  │  [📋 Apply Preset ▼]  [↩ Reset to Role Default]       │
│  ○ Juan D.Cruz   │  [💾 Save Changes]    [📋 Copy from User...]          │
│  ● Maria Santos  │                                                        │
│  ○ Pedro Reyes   │  MODULE                  ➕CREATE  👁️READ  ✏️UPDATE  🗑️DELETE │
│  ○ Ana Lim       │  ─────────────────────────────────────────────────── │
│  ○ Jose Bautista │  DOCUMENTS                                            │
│  ○ Rosa Garcia   │    Incoming Documents    [  ✅  ]  [  ✅  ]  [  ✅  ]  [  ❌  ] │
│  ○ Carlo Santos  │    Outgoing Documents    [  ❌  ]  [  ✅  ]  [  ✅  ]  [  ❌  ] │
│  ○ Liza Torres   │    All Documents         [  ❌  ]  [  ✅  ]  [  ❌  ]  [  ❌  ] │
│                  │                                                        │
│  ─────────────── │  ROUTING                                              │
│  Filter by:      │    Route / Forward       [  ✅  ]  [  ✅  ]  [  ✅  ]  [  ❌  ] │
│  [Office ▼]      │    Routing Map           [  ❌  ]  [  ✅  ]  [  ❌  ]  [  ❌  ] │
│  [Role ▼]        │                                                        │
│                  │  MANAGEMENT                                           │
│                  │    Offices               [  ❌  ]  [  ✅  ]  [  ❌  ]  [  ❌  ] │
│                  │    Users                 [  ❌  ]  [  ❌  ]  [  ❌  ]  [  ❌  ] │
│                  │    Module Permissions    [  ❌  ]  [  ❌  ]  [  ❌  ]  [  ❌  ] │
│                  │                                                        │
│                  │  REPORTS                                              │
│                  │    Document Reports      [  ❌  ]  [  ✅  ]  [  ❌  ]  [  ❌  ] │
│                  │    Office Performance    [  ❌  ]  [  ❌  ]  [  ❌  ]  [  ❌  ] │
│                  │    Compliance Reports    [  ❌  ]  [  ❌  ]  [  ❌  ]  [  ❌  ] │
│                  │    Audit Trail           [  ❌  ]  [  ❌  ]  [  ❌  ]  [  ❌  ] │
│                  │                                                        │
│                  │  SETTINGS                                             │
│                  │    General Settings      [  ❌  ]  [  ❌  ]  [  ❌  ]  [  ❌  ] │
│                  │    Tracking Codes        [  ❌  ]  [  ❌  ]  [  ❌  ]  [  ❌  ] │
│                  │    SLA & Deadlines       [  ❌  ]  [  ❌  ]  [  ❌  ]  [  ❌  ] │
│                  │    Notifications         [  ❌  ]  [  ❌  ]  [  ❌  ]  [  ❌  ] │
│                  │    Backup & Archive      [  ❌  ]  [  ❌  ]  [  ❌  ]  [  ❌  ] │
│                  │                                                        │
│                  │  ─────────────────────────────────────────────────── │
│                  │  ⬜ Select All  |  Module row select-all toggles      │
│                  │  Last updated: Nov 14, 2024 by Admin (Juan Dela Cruz) │
└──────────────────┴──────────────────────────────────────────────────────┘
```

**Toggle Behavior:**
- Each cell = a shadcn `<Switch>` component (green=on, gray=off)
- Row header checkbox = toggle all 4 actions for that module at once
- Column header checkbox = toggle one action (e.g., all READ) across all modules
- Top-left master checkbox = toggle ALL permissions for the user
- Changes are **not saved until `[💾 Save Changes]`** is clicked
- Unsaved changes show a yellow "Unsaved changes" banner

**Secondary Actions:**
- `[📋 Apply Preset ▼]` — dropdown of saved presets (Records Officer Standard, Viewer Only, Full Access, etc.)
- `[↩ Reset to Role Default]` — revert all permissions to the user's role defaults
- `[📋 Copy from User...]` — copy permission set from another user (select via dialog)
- `[📤 Export Permissions]` — export this user's permissions as JSON/PDF
- `[⏳ Set Expiry]` per module row — optional expiry date for temporary access

---

### Super Admin Assignment Flow

**How the Super Admin assigns permissions:**

```
1. Navigate to Settings → Module Permissions  (or Users → [Manage Permissions])

2. Select a user from the left panel
   └─ User card shows: name, office, role, last permission update

3. Review current permission matrix (pre-filled from role defaults or existing record)

4. Toggle individual switches or apply a preset

5. Optionally:
   ├─ Add a note/justification (required for Confidential/Top Secret module access)
   ├─ Set an expiry date (for temporary access)
   └─ Copy permissions from another user

6. Click [💾 Save Changes]
   └─ Confirmation dialog appears:
      ┌─────────────────────────────────────────────────┐
      │  💾 Save Permission Changes?                     │
      │  User: Maria Santos (Budget Office)              │
      │  Changes: 4 permissions modified                 │
      │                                                  │
      │  ✅ Incoming Documents → Update: OFF → ON        │
      │  ✅ Route/Forward → Create: OFF → ON             │
      │  ❌ All Documents → Read: ON → OFF               │
      │  ❌ Document Reports → Read: ON → OFF            │
      │                                                  │
      │  These changes take effect immediately.          │
      │  [Cancel]           [✅ Save & Apply]            │
      └─────────────────────────────────────────────────┘

7. On confirm: permissions saved, audit log entry created, user notified via in-app alert
```

**Notification to user when permissions change:**
```
🔔 Your system permissions have been updated
   Updated by: Admin Juan Dela Cruz
   Date: Nov 14, 2024 — 2:30 PM
   [View Changes]
```

---

### MVC Guard Implementation

#### Controller Layer — `usePermission()` Hook

```typescript
// hooks/usePermission.ts
import { useAuthStore } from '@/store/useAuthStore';
import { usePermissionStore } from '@/store/usePermissionStore';

export const usePermission = () => {
  const { currentUser } = useAuthStore();
  const { getUserPermissions, roleDefaults } = usePermissionStore();

  const can = (moduleId: ModuleId, action: CRUDAction): boolean => {
    // Super Admin bypasses everything
    if (currentUser?.role === 'Super Admin') return true;

    // Check explicit user-level permission first
    const explicit = getUserPermissions(currentUser!.id, moduleId);
    if (explicit) {
      return explicit.actions[action] && explicit.isActive;
    }

    // Fall back to role default
    const roleDefault = roleDefaults[currentUser!.role]?.[moduleId];
    if (roleDefault) {
      return roleDefault[action];
    }

    // Deny by default
    return false;
  };

  const canAny = (moduleId: ModuleId, actions: CRUDAction[]): boolean =>
    actions.some(action => can(moduleId, action));

  const canAll = (moduleId: ModuleId, actions: CRUDAction[]): boolean =>
    actions.every(action => can(moduleId, action));

  return { can, canAny, canAll };
};
```

#### View Layer — Component Guards

**Option A: `<PermissionGuard>` wrapper component**

```tsx
// components/shared/PermissionGuard.tsx
interface PermissionGuardProps {
  module: ModuleId;
  action: CRUDAction;
  fallback?: React.ReactNode;   // show this if denied (default: null/hidden)
  children: React.ReactNode;
}

export const PermissionGuard = ({
  module, action, fallback = null, children
}: PermissionGuardProps) => {
  const { can } = usePermission();
  return can(module, action) ? <>{children}</> : <>{fallback}</>;
};

// Usage — hide button if no permission
<PermissionGuard module="documents_incoming" action="create">
  <Button onClick={handleReceive}>+ Receive New Document</Button>
</PermissionGuard>

// Usage — show disabled state instead of hiding
<PermissionGuard
  module="routing_forward"
  action="create"
  fallback={
    <Tooltip content="You don't have permission to forward documents">
      <Button disabled>Forward ▶</Button>
    </Tooltip>
  }
>
  <Button onClick={handleForward}>Forward ▶</Button>
</PermissionGuard>
```

**Option B: inline `can()` check**

```tsx
const { can } = usePermission();

// In table row actions:
<DropdownMenu>
  <DropdownMenuContent>
    {can('documents_incoming', 'read') && (
      <DropdownMenuItem onClick={() => viewDoc(id)}>View</DropdownMenuItem>
    )}
    {can('documents_incoming', 'update') && (
      <DropdownMenuItem onClick={() => acknowledge(id)}>Acknowledge</DropdownMenuItem>
    )}
    {can('routing_forward', 'create') && (
      <DropdownMenuItem onClick={() => forward(id)}>Forward</DropdownMenuItem>
    )}
    {can('documents_incoming', 'delete') && (
      <DropdownMenuItem className="text-red-600" onClick={() => voidDoc(id)}>
        Void Document
      </DropdownMenuItem>
    )}
  </DropdownMenuContent>
</DropdownMenu>
```

#### Route Layer — Page-Level Guards

```tsx
// components/layout/ModuleRoute.tsx
interface ModuleRouteProps {
  module: ModuleId;
  action?: CRUDAction;  // default: 'read'
  element: React.ReactElement;
}

export const ModuleRoute = ({
  module, action = 'read', element
}: ModuleRouteProps) => {
  const { can } = usePermission();

  if (!can(module, action)) {
    return <AccessDeniedPage module={module} action={action} />;
  }
  return element;
};

// In Router setup:
<Routes>
  <Route path="/incoming"
    element={
      <ModuleRoute module="documents_incoming" action="read"
        element={<IncomingDocuments />} />
    }
  />
  <Route path="/settings/permissions"
    element={
      <ModuleRoute module="permissions" action="read"
        element={<PermissionsPage />} />
    }
  />
  <Route path="/reports/office"
    element={
      <ModuleRoute module="reports_office" action="read"
        element={<OfficeReports />} />
    }
  />
</Routes>
```

**Access Denied Page:**
```
┌──────────────────────────────────────────┐
│                                          │
│       🔒                                 │
│   Access Restricted                      │
│                                          │
│   You don't have permission to view      │
│   this page.                             │
│                                          │
│   Module: Office Performance Reports     │
│   Required: Read Access                  │
│                                          │
│   Contact your administrator to          │
│   request access to this module.         │
│                                          │
│   [← Go Back]   [Contact Admin]          │
│                                          │
└──────────────────────────────────────────┘
```

---

### Zustand Permission Store

```typescript
// store/usePermissionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PermissionState {
  // Records: userId → moduleId → permission
  permissions: Record<string, Record<string, ModulePermission>>;
  presets: PermissionPreset[];

  // Actions
  getPermission: (userId: string, moduleId: ModuleId) => ModulePermission | null;
  getUserPermissions: (userId: string, moduleId: ModuleId) => ModulePermission | null;
  setPermission: (userId: string, moduleId: ModuleId,
                  actions: ModulePermission['actions'],
                  grantedBy: string, notes?: string, expiresAt?: Date) => void;
  revokePermission: (userId: string, moduleId: ModuleId) => void;
  resetToRoleDefault: (userId: string, role: UserRole) => void;
  copyPermissions: (fromUserId: string, toUserId: string, grantedBy: string) => void;
  savePreset: (name: string, description: string,
               userId: string, createdBy: string) => void;
  applyPreset: (presetId: string, userId: string, grantedBy: string) => void;

  // Role defaults fallback
  roleDefaults: RoleDefaultPermissions;
}

export const usePermissionStore = create<PermissionState>()(
  persist(
    (set, get) => ({
      permissions: {},
      presets: DEFAULT_PRESETS,
      roleDefaults: ROLE_DEFAULT_PERMISSIONS,

      getUserPermissions: (userId, moduleId) => {
        const userPerms = get().permissions[userId];
        if (!userPerms) return null;
        const perm = userPerms[moduleId];
        if (!perm || !perm.isActive) return null;
        // Check expiry
        if (perm.expiresAt && new Date() > perm.expiresAt) return null;
        return perm;
      },

      setPermission: (userId, moduleId, actions, grantedBy, notes, expiresAt) => {
        set(state => ({
          permissions: {
            ...state.permissions,
            [userId]: {
              ...state.permissions[userId],
              [moduleId]: {
                id: `${userId}_${moduleId}`,
                userId,
                moduleId,
                actions,
                grantedBy,
                grantedAt: new Date(),
                updatedAt: new Date(),
                notes,
                expiresAt,
                isActive: true,
              }
            }
          }
        }));
      },

      revokePermission: (userId, moduleId) => {
        set(state => ({
          permissions: {
            ...state.permissions,
            [userId]: {
              ...state.permissions[userId],
              [moduleId]: {
                ...state.permissions[userId]?.[moduleId],
                isActive: false,
                updatedAt: new Date(),
              }
            }
          }
        }));
      },

      copyPermissions: (fromUserId, toUserId, grantedBy) => {
        const fromPerms = get().permissions[fromUserId] || {};
        set(state => ({
          permissions: {
            ...state.permissions,
            [toUserId]: Object.fromEntries(
              Object.entries(fromPerms).map(([moduleId, perm]) => [
                moduleId,
                { ...perm, userId: toUserId, grantedBy, grantedAt: new Date() }
              ])
            )
          }
        }));
      },
    }),
    { name: 'trackgov-permissions' }
  )
);
```

---

### Role Default Permissions

Pre-configured defaults used when no explicit permission is assigned:

```typescript
const ROLE_DEFAULT_PERMISSIONS: RoleDefaultPermissions = {
  "Super Admin": {
    // Full access to everything — set all to true
    documents_incoming:    { create: true,  read: true,  update: true,  delete: true  },
    documents_outgoing:    { create: true,  read: true,  update: true,  delete: true  },
    documents_all:         { create: true,  read: true,  update: true,  delete: true  },
    routing_forward:       { create: true,  read: true,  update: true,  delete: true  },
    routing_map:           { create: true,  read: true,  update: true,  delete: true  },
    offices:               { create: true,  read: true,  update: true,  delete: true  },
    users:                 { create: true,  read: true,  update: true,  delete: true  },
    permissions:           { create: true,  read: true,  update: true,  delete: true  },
    reports_document:      { create: true,  read: true,  update: true,  delete: true  },
    reports_office:        { create: true,  read: true,  update: true,  delete: true  },
    reports_compliance:    { create: true,  read: true,  update: true,  delete: true  },
    audit_trail:           { create: true,  read: true,  update: true,  delete: true  },
    settings_general:      { create: true,  read: true,  update: true,  delete: true  },
    settings_tracking:     { create: true,  read: true,  update: true,  delete: true  },
    settings_sla:          { create: true,  read: true,  update: true,  delete: true  },
    settings_notifications:{ create: true,  read: true,  update: true,  delete: true  },
    settings_backup:       { create: true,  read: true,  update: true,  delete: true  },
  },

  "Admin": {
    documents_incoming:    { create: true,  read: true,  update: true,  delete: true  },
    documents_outgoing:    { create: false, read: true,  update: true,  delete: false },
    documents_all:         { create: false, read: true,  update: true,  delete: false },
    routing_forward:       { create: true,  read: true,  update: true,  delete: false },
    routing_map:           { create: false, read: true,  update: false, delete: false },
    offices:               { create: true,  read: true,  update: true,  delete: false },
    users:                 { create: true,  read: true,  update: true,  delete: false },
    permissions:           { create: false, read: true,  update: false, delete: false },
    reports_document:      { create: false, read: true,  update: false, delete: false },
    reports_office:        { create: false, read: true,  update: false, delete: false },
    reports_compliance:    { create: false, read: true,  update: false, delete: false },
    audit_trail:           { create: false, read: true,  update: false, delete: false },
    settings_general:      { create: false, read: true,  update: true,  delete: false },
    settings_tracking:     { create: false, read: true,  update: true,  delete: false },
    settings_sla:          { create: true,  read: true,  update: true,  delete: true  },
    settings_notifications:{ create: false, read: true,  update: true,  delete: false },
    settings_backup:       { create: true,  read: true,  update: false, delete: false },
  },

  "Department Head": {
    documents_incoming:    { create: true,  read: true,  update: true,  delete: false },
    documents_outgoing:    { create: false, read: true,  update: true,  delete: false },
    documents_all:         { create: false, read: true,  update: false, delete: false },
    routing_forward:       { create: true,  read: true,  update: true,  delete: false },
    routing_map:           { create: false, read: true,  update: false, delete: false },
    offices:               { create: false, read: true,  update: false, delete: false },
    users:                 { create: false, read: true,  update: false, delete: false },
    permissions:           { create: false, read: false, update: false, delete: false },
    reports_document:      { create: false, read: true,  update: false, delete: false },
    reports_office:        { create: false, read: true,  update: false, delete: false },
    reports_compliance:    { create: false, read: true,  update: false, delete: false },
    audit_trail:           { create: false, read: true,  update: false, delete: false },
    settings_general:      { create: false, read: false, update: false, delete: false },
    settings_tracking:     { create: false, read: false, update: false, delete: false },
    settings_sla:          { create: false, read: true,  update: false, delete: false },
    settings_notifications:{ create: false, read: true,  update: true,  delete: false },
    settings_backup:       { create: false, read: false, update: false, delete: false },
  },

  "Records Officer": {
    documents_incoming:    { create: true,  read: true,  update: true,  delete: false },
    documents_outgoing:    { create: false, read: true,  update: true,  delete: false },
    documents_all:         { create: false, read: true,  update: false, delete: false },
    routing_forward:       { create: true,  read: true,  update: true,  delete: false },
    routing_map:           { create: false, read: true,  update: false, delete: false },
    offices:               { create: false, read: true,  update: false, delete: false },
    users:                 { create: false, read: false, update: false, delete: false },
    permissions:           { create: false, read: false, update: false, delete: false },
    reports_document:      { create: false, read: true,  update: false, delete: false },
    reports_office:        { create: false, read: false, update: false, delete: false },
    reports_compliance:    { create: false, read: false, update: false, delete: false },
    audit_trail:           { create: false, read: false, update: false, delete: false },
    settings_general:      { create: false, read: false, update: false, delete: false },
    settings_tracking:     { create: false, read: false, update: false, delete: false },
    settings_sla:          { create: false, read: false, update: false, delete: false },
    settings_notifications:{ create: false, read: true,  update: true,  delete: false },
    settings_backup:       { create: false, read: false, update: false, delete: false },
  },

  "Staff": {
    documents_incoming:    { create: false, read: true,  update: true,  delete: false },
    documents_outgoing:    { create: false, read: true,  update: false, delete: false },
    documents_all:         { create: false, read: false, update: false, delete: false },
    routing_forward:       { create: true,  read: true,  update: false, delete: false },
    routing_map:           { create: false, read: true,  update: false, delete: false },
    offices:               { create: false, read: true,  update: false, delete: false },
    users:                 { create: false, read: false, update: false, delete: false },
    permissions:           { create: false, read: false, update: false, delete: false },
    reports_document:      { create: false, read: false, update: false, delete: false },
    reports_office:        { create: false, read: false, update: false, delete: false },
    reports_compliance:    { create: false, read: false, update: false, delete: false },
    audit_trail:           { create: false, read: false, update: false, delete: false },
    settings_general:      { create: false, read: false, update: false, delete: false },
    settings_tracking:     { create: false, read: false, update: false, delete: false },
    settings_sla:          { create: false, read: false, update: false, delete: false },
    settings_notifications:{ create: false, read: true,  update: true,  delete: false },
    settings_backup:       { create: false, read: false, update: false, delete: false },
  },

  "Read Only": {
    // Read access only on safe modules
    documents_incoming:    { create: false, read: true,  update: false, delete: false },
    documents_outgoing:    { create: false, read: true,  update: false, delete: false },
    documents_all:         { create: false, read: true,  update: false, delete: false },
    routing_forward:       { create: false, read: true,  update: false, delete: false },
    routing_map:           { create: false, read: true,  update: false, delete: false },
    offices:               { create: false, read: true,  update: false, delete: false },
    users:                 { create: false, read: false, update: false, delete: false },
    permissions:           { create: false, read: false, update: false, delete: false },
    reports_document:      { create: false, read: false, update: false, delete: false },
    reports_office:        { create: false, read: false, update: false, delete: false },
    reports_compliance:    { create: false, read: false, update: false, delete: false },
    audit_trail:           { create: false, read: false, update: false, delete: false },
    settings_general:      { create: false, read: false, update: false, delete: false },
    settings_tracking:     { create: false, read: false, update: false, delete: false },
    settings_sla:          { create: false, read: false, update: false, delete: false },
    settings_notifications:{ create: false, read: false, update: false, delete: false },
    settings_backup:       { create: false, read: false, update: false, delete: false },
  },
};
```

---

### Sidebar — Dynamic Navigation (Permission-aware)

The sidebar must hide navigation items the user cannot access:

```tsx
// Sidebar renders nav items conditionally
const { can } = usePermission();

const navItems = [
  { label: "Dashboard",            path: "/",                    icon: Home,       always: true },
  { label: "Incoming Documents",   path: "/incoming",            icon: Inbox,      module: "documents_incoming",  action: "read" },
  { label: "Outgoing Documents",   path: "/outgoing",            icon: Send,       module: "documents_outgoing",  action: "read" },
  { label: "All Documents",        path: "/documents",           icon: Files,      module: "documents_all",       action: "read" },
  { label: "Route / Forward",      path: "/routing",             icon: Share2,     module: "routing_forward",     action: "read" },
  { label: "Routing Map",          path: "/routing-map",         icon: Map,        module: "routing_map",         action: "read" },
  { label: "Offices",              path: "/offices",             icon: Building2,  module: "offices",             action: "read" },
  { label: "Users",                path: "/users",               icon: Users,      module: "users",               action: "read" },
  { label: "Module Permissions",   path: "/settings/permissions",icon: ShieldCheck,module: "permissions",         action: "read" },
  { label: "Document Reports",     path: "/reports/documents",   icon: BarChart2,  module: "reports_document",    action: "read" },
  { label: "Office Performance",   path: "/reports/offices",     icon: TrendingUp, module: "reports_office",      action: "read" },
  { label: "Compliance",           path: "/reports/compliance",  icon: CheckSquare,module: "reports_compliance",  action: "read" },
  { label: "Audit Trail",          path: "/reports/audit",       icon: ClipboardList, module: "audit_trail",      action: "read" },
  { label: "Settings",             path: "/settings",            icon: Settings,   module: "settings_general",    action: "read" },
];

// Render only permitted items
{navItems
  .filter(item => item.always || can(item.module as ModuleId, item.action as CRUDAction))
  .map(item => <NavItem key={item.path} {...item} />)
}
```

---

### Permission Audit Logging

Every permission change is recorded in the Audit Trail with special formatting:

```typescript
interface PermissionAuditEntry {
  id: string;
  type: "permission_granted" | "permission_revoked" | "permission_updated"
       | "preset_applied" | "permissions_copied" | "reset_to_default";
  performedBy: string;         // Super Admin userId
  targetUserId: string;        // User being modified
  changes: Array<{
    moduleId: ModuleId;
    moduleName: string;
    before: { create: boolean; read: boolean; update: boolean; delete: boolean; } | null;
    after:  { create: boolean; read: boolean; update: boolean; delete: boolean; } | null;
  }>;
  notes?: string;
  timestamp: Date;
  ipAddress?: string;
}
```

**Audit Trail display for permission events:**
```
Nov 14, 2024 — 2:45 PM
🔐 PERMISSIONS UPDATED
   Admin: Juan Dela Cruz → User: Maria Santos (Budget Office)
   ├── ✅ Incoming Documents → Update: OFF → ON
   ├── ✅ Route/Forward → Create: OFF → ON
   ├── ❌ All Documents → Read: ON → OFF
   └── ❌ Document Reports → Read: ON → OFF
   Note: "Temporary access for project duration"
   [View Full Diff]
```

---

### Permission Presets

Pre-defined templates the Super Admin can apply in one click:

| Preset Name | Description |
|---|---|
| **Records Officer Standard** | Full doc management, routing, basic reports |
| **Document Viewer Only** | Read-only on incoming, outgoing, all documents |
| **Department Supervisor** | Full doc + routing, office reports, no settings |
| **Reports Analyst** | All reports read access, no document management |
| **Temporary Receiver** | Incoming create+read+update only, 30-day auto-expiry |
| **Full Access (Non-Admin)** | Everything except permissions and system settings |
| **Minimal / Restricted** | Only incoming read + routing read |

Custom presets can be created by Super Admin and saved for reuse.

---

## Confirmation Dialogs — Every Transaction

Every destructive or significant action requires a `ConfirmDialog` before execution.

### Standard Confirm Dialog Component

```tsx
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;       // default: "Confirm"
  cancelLabel?: string;        // default: "Cancel"
  variant?: "default" | "destructive" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;         // shows spinner on confirm button
  details?: React.ReactNode;   // optional detail card inside dialog
}
```

### Confirmation Required — Full Matrix

| Action | Dialog Title | Variant | Details Shown |
|---|---|---|---|
| Forward / Route document | "Confirm Document Forwarding" | default | From → To office, Action, Due date |
| Return document to sender | "Return to Sender?" | warning | Document title, reason required |
| Mark document as Completed | "Mark as Completed?" | default | Tracking code, current status |
| Put document On Hold | "Place Document On Hold?" | warning | Reason required |
| Cancel / Void document | "Cancel This Document?" | destructive | Irreversible warning |
| Acknowledge incoming doc | "Acknowledge Receipt?" | default | Tracking code, from office |
| Batch acknowledge | "Acknowledge X Documents?" | default | Count of documents |
| Delete attachment | "Delete Attachment?" | destructive | Filename, cannot be recovered |
| Deactivate office | "Deactivate Office?" | destructive | Office name, active doc count |
| Delete / deactivate user | "Deactivate User Account?" | destructive | User name, role, office |
| Change user role | "Change User Role?" | warning | From role → To role |
| Reset tracking sequence | "Reset Tracking Code Sequence?" | destructive | Current sequence number |
| Bulk export data | "Export All System Data?" | warning | File size estimate |
| Archive completed docs | "Archive Documents?" | warning | Count + date range |
| Send reminder notification | "Send Overdue Reminder?" | default | Recipient office, document |
| Delete remark | "Delete This Remark?" | destructive | Remark preview (30 chars) |
| Approve document | "Approve This Document?" | default | Document title, approver name |
| Disapprove document | "Disapprove This Document?" | warning | Reason required (textarea) |

### Programmatic Usage Pattern

```tsx
// useConfirm hook
const { confirm } = useConfirm();

const handleForward = async () => {
  const confirmed = await confirm({
    title: "Confirm Document Forwarding",
    description: "This document will be routed to the selected office.",
    variant: "default",
    confirmLabel: "Forward Document",
    details: (
      <div className="rounded-md bg-slate-50 dark:bg-slate-800 p-3 text-sm">
        <p><strong>From:</strong> Records Office</p>
        <p><strong>To:</strong> Budget Office — Maria Santos</p>
        <p><strong>Action:</strong> For Review</p>
        <p><strong>Due:</strong> November 20, 2024</p>
      </div>
    )
  });

  if (confirmed) {
    await forwardDocument(documentId, routingDetails);
    toast.success("Document forwarded successfully.");
  }
};
```

### Irreversible Actions — Extra Step

For `destructive` variant actions (Cancel, Delete, Deactivate), require the user to **type a confirmation phrase**:

```
To confirm, type the tracking code: TRK-2024-00145
[ __________________________ ]
```

This prevents accidental irreversible operations.

---

## OCR Integration

TrackGov uses **two OCR engines** depending on input type:

### Engine 1 — Tesseract.js v5 (Image OCR)

Used for: scanned images (JPG, PNG, TIFF), photo of physical document

```bash
npm install tesseract.js
```

```typescript
// hooks/useOCR.ts
import Tesseract from 'tesseract.js';

export const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const extractFromImage = async (imageFile: File): Promise<OCRData> => {
    setIsProcessing(true);

    const result = await Tesseract.recognize(imageFile, 'eng+fil', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 100));
        }
      },
    });

    const raw = result.data.text;
    const confidence = result.data.confidence;

    setIsProcessing(false);
    return {
      rawText: raw,
      confidence,
      extractedFields: parseDocumentFields(raw),
      processedAt: new Date(),
      engine: 'tesseract',
    };
  };

  return { extractFromImage, isProcessing, progress };
};
```

**Language Support:** `eng` (English) + `fil` (Filipino) for Philippine government documents.

**Tesseract Worker Pool** — For performance, initialize a persistent worker:

```typescript
// lib/tesseractWorker.ts
import { createWorker } from 'tesseract.js';

let worker: Tesseract.Worker | null = null;

export const getWorker = async () => {
  if (!worker) {
    worker = await createWorker(['eng', 'fil'], 1, {
      cachePath: '/tesseract-cache',
    });
  }
  return worker;
};
```

---

### Engine 2 — pdfjs-dist (PDF Text Extraction)

Used for: digital PDFs with embedded text (contracts, memos, typed letters)

```bash
npm install pdfjs-dist
```

```typescript
// lib/pdfExtractor.ts
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export const extractFromPDF = async (file: File): Promise<OCRData> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return {
    rawText: fullText,
    confidence: 99,              // Native PDF = high confidence
    extractedFields: parseDocumentFields(fullText),
    processedAt: new Date(),
    engine: 'pdfjs',
  };
};
```

---

### Smart Routing — Auto-detect Engine

```typescript
export const processDocument = async (file: File): Promise<OCRData> => {
  if (file.type === 'application/pdf') {
    // Try pdfjs first (native text)
    const pdfData = await extractFromPDF(file);
    if (pdfData.rawText.trim().length > 50) {
      return pdfData;  // Has embedded text — use it
    }
    // PDF is scanned — fall back to Tesseract
  }
  // Image or scanned PDF → Tesseract
  return await extractFromImage(file);
};
```

---

### Field Parser (Regex-based extraction)

```typescript
const parseDocumentFields = (text: string) => {
  return {
    title: extractPattern(text, /subject[:\s]+(.+)/i),
    referenceNumber: extractPattern(text, /ref(?:erence)?[:\s#]+([A-Z0-9-]+)/i),
    date: extractPattern(text, /date[:\s]+(\w+ \d{1,2},?\s*\d{4})/i),
    sender: extractPattern(text, /from[:\s]+(.+)/i),
    recipient: extractPattern(text, /(?:to|attn)[:\s]+(.+)/i),
    subject: extractPattern(text, /re[:\s]+(.+)/i),
  };
};
```

---

### OCR UI Component

```
┌────────────────────────────────────────────┐
│  📄 Scan Document with OCR                 │
│                                            │
│  [📁 Upload Image/PDF]  [📷 Camera]        │
│                                            │
│  ████████████████░░░░  78% — Processing... │
│  Engine: Tesseract.js  |  Lang: EN + FIL   │
│                                            │
│  ─── Extracted Fields ───────────────────  │
│  Title:    [Request for Budget Allocation] │
│  Ref #:    [LGU-2024-089              ]    │
│  Date:     [November 10, 2024         ]    │
│  From:     [Provincial Governor's Off.]   │
│  Subject:  [FY2025 Budget Request     ]    │
│                                            │
│  Confidence: 94%  ✅ Good                  │
│  [✏️ Edit Fields]  [✅ Use These Values]   │
└────────────────────────────────────────────┘
```

All extracted fields are **editable before applying** to the receive form. User always has final say.

---

## Notifications System

### In-App (Bell icon in Header)

Dropdown panel (max 10 recent, "View All" link):

| Type | Icon | Message Example |
|---|---|---|
| incoming | 📥 | "New document from HRMO assigned to you" |
| action_required | ⚡ | "TRK-2024-00145 requires your signature" |
| overdue | 🔴 | "3 documents in your queue are overdue" |
| forwarded | ➡️ | "Document forwarded to Budget Office" |
| system | 🔔 | "System maintenance scheduled Nov 20" |

### Email Notifications

Triggered for: incoming doc, forwarded doc, overdue escalation, approval decision

### Notification Settings (per user)

- Email alerts toggle
- In-app alerts toggle
- Digest: Real-time / Hourly / Daily summary

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd+K` | Open global search (Command palette) |
| `Cmd+N` | Receive new document |
| `Cmd+F` | Forward current document |
| `Cmd+P` | Print current document / routing slip |
| `Esc` | Close any open dialog, sheet, or modal |
| `R` | Refresh current view |
| `?` | Show keyboard shortcuts cheatsheet |
| `D` | Go to Dashboard |
| `I` | Go to Incoming Documents |
| `A` | Go to All Documents |

---

## Mock / Seed Data

### Offices (8)

| Code | Name |
|---|---|
| OSEC | Office of the Secretary/Mayor |
| HRMO | Human Resource Management Office |
| BPLO | Business Permits & Licensing Office |
| ENRO | Environment & Natural Resources Office |
| BFAD | Budget & Finance Administration Division |
| MPDO | Municipal/City Planning & Dev't Office |
| CSWDO | Community & Social Welfare Dev't Office |
| RECORDS | Office of the Records Officer |

### Users (10+)

- 2 Super Admins, 2 Records Officers, 2 Department Heads, 3 Staff, 1 Read Only
- Spread across all 8 offices

### Documents (50+)

- Mix of all types and statuses
- 5–8 overdue (for dashboard alerts)
- 3–5 currently in-transit
- 10+ with 3+ routing history steps
- 2–3 confidential documents
- Real Philippine government document titles (e.g., "Memorandum Circular No. 2024-012", "Resolution No. 089-2024", "Request for Realignment of Funds")

---

## Implementation Order

Build in this sequence:

```
1.  TypeScript interfaces & Zod validators
    └─ Include: ModulePermission, PermissionPreset, RoleDefaultPermissions

2.  Mock data + Zustand stores
    └─ Include: usePermissionStore with ROLE_DEFAULT_PERMISSIONS + DEFAULT_PRESETS

3.  Auth (login page + auth guard + role routing)

4.  usePermission() hook + PermissionGuard component + ModuleRoute guard
    └─ Core MVC controller — used everywhere from step 5 onward

5.  Layout shell: Sidebar + Header + Theme Toggle + Router
    └─ Sidebar uses permission-aware nav filtering

6.  Dashboard page

7.  Incoming Documents + Receive form + OCR integration
    └─ Wrap all actions with PermissionGuard

8.  Document Detail View + Routing Timeline
    └─ Action buttons guarded by permissions

9.  ConfirmDialog component + useConfirm hook (add to all actions)

10. Route/Forward wizard
    └─ Guard: routing_forward → create

11. Outgoing Documents

12. All Documents (filters + views)

13. Offices page
    └─ CRUD guarded by offices module permissions

14. Users page
    └─ CRUD guarded by users module permissions

15. Module Permissions page (Super Admin)
    └─ Permission Matrix UI, presets, copy-from-user, expiry dates
    └─ Guard: permissions → read (Super Admin only by default)

16. Reports & Analytics
    └─ Each tab guarded by its reports_* module

17. Public Tracker (/track)

18. Settings
    └─ Each settings tab guarded by settings_* modules

19. Routing Map (visual)

20. Notification system (in-app + email)
    └─ Notify users on permission changes

21. Dark mode polish pass (verify all pages + permission UI)

22. Keyboard shortcuts + accessibility audit
```

---

## Demo Credentials

| Email | Password | Role | Redirect |
|---|---|---|---|
| `admin@trackgov.gov.ph` | `admin2024` | Super Admin | Dashboard |
| `records@trackgov.gov.ph` | `rec2024` | Records Officer | Dashboard |
| `dept@trackgov.gov.ph` | `dept2024` | Department Head | Dashboard |
| `staff@trackgov.gov.ph` | `staff2024` | Staff | Incoming Queue |
| `readonly@trackgov.gov.ph` | `read2024` | Read Only | All Documents |

---

## License & Usage

This system prompt and documentation is intended for use with AI-assisted development tools (Claude, Cursor, v0, GitHub Copilot, etc.).

Built for Philippine Local Government Units and National Government Agencies in compliance with:
- **RA 9184** — Government Procurement Reform Act
- **RA 11032** — Ease of Doing Business Act
- **RA 10173** — Data Privacy Act (confidential document handling)

---

*TrackGov — Transparency. Accountability. Efficiency.*