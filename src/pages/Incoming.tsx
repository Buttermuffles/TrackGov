import { LayoutShell } from '../components/layout/LayoutShell'
import { mockData } from '../lib/mockData'

export function IncomingPage() {
  return (
    <LayoutShell>
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Documents
            </p>
            <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
              Incoming Documents
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              All documents routed to your office. Filter, acknowledge, and
              route items as they arrive.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center justify-center rounded-md bg-[#1E3A5F] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#2a4d7a]">
              + Receive New Document
            </button>
            <button className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
              Batch Acknowledge
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-3 text-[11px] text-slate-600 shadow-sm">
          <span className="font-semibold text-slate-700">Filters:</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
            Date range
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
            Type
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
            Priority
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
            Status
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <button className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-700 shadow-sm">
                Unacknowledged
              </button>
              <button className="rounded-full px-2 py-0.5 text-xs text-slate-500 hover:bg-white">
                All Incoming
              </button>
            </div>
            <div>Rows: {mockData.documents.length}</div>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2">
                    Tracking Code
                  </th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">From Office</th>
                  <th className="px-3 py-2">Date Received</th>
                  <th className="px-3 py-2">Priority</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Due Date</th>
                  <th className="px-3 py-2">Assigned To</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockData.documents.map((doc, idx) => (
                  <tr
                    key={doc.id}
                    className={idx === 0 ? 'bg-blue-50' : 'bg-white'}
                  >
                    <td className="sticky left-0 z-10 px-3 py-2 font-mono text-xs font-semibold text-blue-700">
                      {doc.trackingCode}
                    </td>
                    <td className="max-w-xs truncate px-3 py-2 text-xs">
                      {doc.title}
                    </td>
                    <td className="px-3 py-2 text-xs">{doc.documentType}</td>
                    <td className="px-3 py-2 text-xs">Origin Office</td>
                    <td className="px-3 py-2 text-xs">
                      {doc.dateReceived.toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <span className="inline-flex rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-700">
                        {doc.priority}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs">{doc.status}</td>
                    <td className="px-3 py-2 text-xs">
                      {doc.dueDate?.toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 text-xs">Assignee</td>
                    <td className="px-3 py-2 text-right text-[11px]">
                      <button className="mr-1 rounded border border-slate-200 px-1.5 py-0.5 hover:bg-slate-50">
                        View
                      </button>
                      <button className="mr-1 rounded border border-slate-200 px-1.5 py-0.5 hover:bg-slate-50">
                        Ack
                      </button>
                      <button className="mr-1 rounded border border-slate-200 px-1.5 py-0.5 hover:bg-slate-50">
                        Forward
                      </button>
                      <button className="rounded border border-slate-200 px-1.5 py-0.5 hover:bg-slate-50">
                        Remark
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayoutShell>
  )
}

