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
8. [Confirmation Dialogs](#confirmation-dialogs--every-transaction)
9. [OCR Integration](#ocr-integration)
10. [Notifications System](#notifications-system)
11. [Keyboard Shortcuts](#keyboard-shortcuts)
12. [Mock / Seed Data](#mock--seed-data)
13. [Implementation Order](#implementation-order)
14. [Demo Credentials](#demo-credentials)

---

## Overview

**TrackGov** is a full-featured Government Document Tracking and Management System designed for local and national government offices. It enables efficient routing, monitoring, and auditing of documents across departments with full accountability and transparency.

### Core Capabilities

- **Document Intake** — Receive and register incoming documents with auto-generated tracking codes
- **Smart Routing** — Forward documents across offices with action requirements and due dates
- **Real-time Tracking** — Full routing history timeline per document
- **OCR Scanning** — Extract document metadata using `Tesseract.js` + `pdf.js`
- **Public Portal** — Citizens can track their documents without logging in
- **Role-based Access** — Six distinct roles with permission matrix
- **Analytics & Reports** — Performance metrics, turnaround times, compliance rates
- **Dark Mode** — Full system-wide dark/light theme toggle
- **Audit Trail** — Every action logged with timestamp and user

---

## Documentation

Detailed process documentation is available in `docs/`:

- `docs/README.md`
- `docs/processes/document-lifecycle.md`
- `docs/processes/security-hardening.md`
- `docs/processes/performance-and-caching.md`
- `docs/processes/error-handling-and-resilience.md`
- `docs/processes/operations-runbook.md`

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
- 5-8 overdue (for dashboard alerts)
- 3-5 currently in-transit
- 10+ with 3+ routing history steps
- 2-3 confidential documents
- Real Philippine government document titles (e.g., "Memorandum Circular No. 2024-012", "Resolution No. 089-2024", "Request for Realignment of Funds")

---

## Implementation Order

Build in this sequence:

```
1.  TypeScript interfaces & Zod validators
2.  Mock data + Zustand stores
3.  Auth (login page + auth guard + role routing)
4.  Layout shell: Sidebar + Header + Theme Toggle + Router
5.  Dashboard page
6.  Incoming Documents + Receive form + OCR integration
7.  Document Detail View + Routing Timeline
8.  ConfirmDialog component + useConfirm hook (add to all actions)
9.  Route/Forward wizard
10. Outgoing Documents
11. All Documents (filters + views)
12. Offices page
13. Users page + permissions matrix
14. Reports & Analytics
15. Public Tracker (/track)
16. Settings
17. Routing Map (visual)
18. Notification system (in-app + email)
19. Dark mode polish pass (verify all pages)
20. Keyboard shortcuts + accessibility audit
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
