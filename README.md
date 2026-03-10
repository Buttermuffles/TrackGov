## TrackGov – Government Document Tracking and Management

TrackGov is a React + TypeScript single-page application for local and national government offices to track, route, and report on official documents.

### Tech Stack

- **Frontend**: React 18, TypeScript, React Router v6
- **Styling**: Tailwind CSS with a TrackGov brand theme (navy, gold, slate)
- **State**: Zustand for auth and document state (mock for now)
- **Forms & Validation**: React Hook Form + Zod (to be wired into forms)
- **Tables & Charts**: TanStack Table v8, Recharts (placeholders ready)

### Available Pages

- **Login**: `/login` – demo auth with role-based redirects
- **Dashboard**: `/` – KPI cards and analytics placeholders
- **Incoming Documents**: `/incoming`
- **Outgoing Documents**: `/outgoing`
- **All Documents Registry**: `/documents`
- **Pending Action Queue**: `/pending`
- **Route / Forward Wizard**: `/routing`
- **Routing Map (Visual)**: `/routing-map`
- **Offices / Departments**: `/offices`
- **Users Management**: `/users`
- **Reports & Analytics**: `/reports`
- **Audit Trail**: `/audit-trail`
- **Settings**: `/settings`
- **Public Document Tracker**: `/track` (no login required)

Each internal page is wrapped in a **persistent sidebar + header layout** with responsive typography and data-dense cards. The public tracker is a separate mobile-friendly layout.

### Running Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

### Deploying to Vercel

1. Push this project to a Git provider (GitHub, GitLab, etc.).
2. In Vercel, create a new project from that repo.
3. Framework preset: **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`

No extra configuration is required; Vercel will detect the Vite app automatically.

