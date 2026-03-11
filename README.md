# TrackGov — Government Document Tracking System

A comprehensive document tracking and management system built for local and national government offices. Track incoming/outgoing documents, manage routing workflows, and generate reports with full audit trails.

## Features

- **Document Management** — Receive, route, track, and complete government documents with tracking codes
- **Real-time Routing** — Forward documents between offices with acknowledgment tracking
- **Public Tracker** — Citizens can track document status using a tracking code (no login required)
- **Role-Based Access** — Super Admin, Admin, Records Officer, Department Head, Staff, Read Only roles
- **Reports & Analytics** — Charts for volume trends, status distribution, SLA compliance, office workload
- **Audit Trail** — Comprehensive system activity log
- **SLA Monitoring** — Configurable processing time limits per RA 11032
- **Mobile Responsive** — Full mobile support with sidebar drawer and adaptive layouts

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — Build tool
- **Tailwind CSS v4** — Styling
- **shadcn/ui** + **Radix UI** — Component library
- **Zustand** — State management
- **React Router v7** — Routing
- **Recharts** — Data visualization
- **Lucide React** — Icons
- **date-fns** — Date utilities

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@trackgov.gov.ph | admin2024 |
| Records Officer | records@trackgov.gov.ph | rec2024 |
| Department Head | dept@trackgov.gov.ph | dept2024 |
| Staff | staff@trackgov.gov.ph | staff2024 |

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Authentication page |
| Dashboard | `/` | KPIs, charts, activity feed |
| Incoming | `/incoming` | Receive new documents |
| Outgoing | `/outgoing` | Track sent documents |
| All Documents | `/documents` | Browse/filter/search all documents |
| Document Detail | `/documents/:id` | Full document view with routing timeline |
| Pending | `/pending` | Actions requiring attention |
| Offices | `/offices` | Office/department management (CRUD) |
| Users | `/users` | User management (CRUD) |
| Reports | `/reports` | Analytics dashboards |
| Audit Trail | `/audit` | System activity log |
| Settings | `/settings` | System configuration |
| Public Tracker | `/track` | Public document tracking (no auth) |

## Project Structure

```
src/
├── components/
│   ├── documents/    # DocStatusBadge
│   ├── layout/       # AppLayout, Sidebar, Header
│   └── ui/           # shadcn/ui components
├── lib/
│   ├── mockData.ts   # Sample data (8 offices, 14 users, 50+ documents)
│   └── utils.ts      # Utility functions
├── pages/            # All page components
├── store/
│   └── index.ts      # Zustand stores (auth, document, office, user, notification, audit)
├── types/
│   └── index.ts      # TypeScript interfaces and types
├── App.tsx           # Router configuration
├── main.tsx          # Entry point
└── index.css         # Tailwind CSS configuration
```

## License

MIT
