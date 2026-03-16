import { format } from 'date-fns'
import type { Document, RoutingAction } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useThemeStore } from '@/store/themeStore'
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Pause,
  RotateCcw,
  Send,
} from 'lucide-react'

type RoutingHistoryDialogProps = {
  open: boolean
  document: Document | null
  onOpenChange: (open: boolean) => void
  getOfficeName: (officeId: string) => string
  getUserName: (userId: string) => string
}

function getRoutingActionMeta(action: RoutingAction) {
  switch (action) {
    case 'Forwarded':
    case 'Endorsed':
      return {
        icon: Send,
        iconWrapClass: 'border-blue-600 bg-blue-600 text-white',
        badgeClass: 'border-transparent bg-blue-600 text-white',
        connectorClass: 'bg-blue-200',
      }
    case 'Returned':
      return {
        icon: RotateCcw,
        iconWrapClass: 'border-rose-600 bg-rose-600 text-white',
        badgeClass: 'border-transparent bg-rose-600 text-white',
        connectorClass: 'bg-rose-200',
      }
    case 'Approved':
      return {
        icon: CheckCircle,
        iconWrapClass: 'border-emerald-600 bg-emerald-600 text-white',
        badgeClass: 'border-transparent bg-emerald-600 text-white',
        connectorClass: 'bg-emerald-200',
      }
    case 'Disapproved':
      return {
        icon: Pause,
        iconWrapClass: 'border-red-600 bg-red-600 text-white',
        badgeClass: 'border-transparent bg-red-600 text-white',
        connectorClass: 'bg-red-200',
      }
    case 'For Signature':
    case 'For Action':
      return {
        icon: Clock,
        iconWrapClass: 'border-amber-600 bg-amber-600 text-white',
        badgeClass: 'border-transparent bg-amber-600 text-white',
        connectorClass: 'bg-amber-200',
      }
    case 'For Review':
    case 'For Information':
    case 'Noted':
    case 'Filed':
      return {
        icon: Eye,
        iconWrapClass: 'border-indigo-600 bg-indigo-600 text-white',
        badgeClass: 'border-transparent bg-indigo-600 text-white',
        connectorClass: 'bg-indigo-200',
      }
    default:
      return {
        icon: FileText,
        iconWrapClass: 'border-slate-500 bg-slate-500 text-white',
        badgeClass: 'border-transparent bg-slate-500 text-white',
        connectorClass: 'bg-slate-200',
      }
  }
}

export default function RoutingHistoryDialog({
  open,
  document,
  onOpenChange,
  getOfficeName,
  getUserName,
}: RoutingHistoryDialogProps) {
  const mode = useThemeStore(s => s.mode)
  const isDark = mode === 'dark'

  const sortedEntries = document
    ? [...document.routingHistory].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
    : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-2xl p-0 shadow-2xl ${
          isDark
            ? 'border-slate-700 bg-slate-900 text-slate-50'
            : 'border-slate-200 bg-white text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`border-b px-6 py-5 ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          }`}
        >
          <DialogHeader>
            <DialogTitle
              className={`text-base font-semibold uppercase tracking-wide ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              Routing History{' '}
              {document
                ? `(${sortedEntries.length} ${sortedEntries.length === 1 ? 'Entry' : 'Entries'})`
                : ''}
            </DialogTitle>
            <DialogDescription
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            >
              {document
                ? `${document.trackingCode} • ${document.title}`
                : 'Review document routing activity.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
          {!document || sortedEntries.length === 0 ? (
            <div
              className={`rounded-xl border px-4 py-12 text-center ${
                isDark
                  ? 'border-slate-700 bg-slate-800/60'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <FileText
                className={`mx-auto mb-3 h-10 w-10 ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              />
              <p
                className={`text-sm font-semibold ${
                  isDark ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                No routing history yet
              </p>
              <p
                className={`mt-1 text-xs ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                This document has not been routed between offices.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {sortedEntries.map((entry, index) => {
                const meta = getRoutingActionMeta(entry.action)
                const EntryIcon = meta.icon
                const isLast = index === sortedEntries.length - 1

                return (
                  <div key={entry.id} className="flex gap-4 pb-5 last:pb-0">
                    {/* Timeline column */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${meta.iconWrapClass}`}
                      >
                        <EntryIcon className="h-4 w-4" />
                      </div>
                      {!isLast && (
                        <div
                          className={`my-1.5 w-0.5 flex-1 ${meta.connectorClass}`}
                        />
                      )}
                    </div>

                    {/* Card */}
                    <div
                      className={`min-w-0 flex-1 rounded-xl border px-4 py-3 shadow-sm ${
                        isDark
                          ? 'border-slate-700 bg-slate-800/70'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">

                          {/* Badges row */}
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              className={`pointer-events-none select-none text-[11px] font-semibold ${meta.badgeClass}`}
                            >
                              {entry.action}
                            </Badge>

                            {index === 0 &&
                              document.status !== 'Completed' &&
                              document.status !== 'Cancelled' && (
                                <Badge
                                  className={`pointer-events-none select-none text-[11px] font-semibold ${
                                    isDark
                                      ? 'border-transparent bg-sky-500 text-white'
                                      : 'border-transparent bg-sky-500 text-white'
                                  }`}
                                >
                                  Latest Step
                                </Badge>
                              )}
                          </div>

                          {/* Route: From → To */}
                          <p
                            className={`mt-2 flex flex-wrap items-center gap-1 text-sm font-semibold ${
                              isDark ? 'text-slate-100' : 'text-slate-900'
                            }`}
                          >
                            <span>{getOfficeName(entry.fromOfficeId)}</span>
                            <ArrowRight
                              className={`h-3.5 w-3.5 shrink-0 ${
                                isDark ? 'text-slate-400' : 'text-slate-500'
                              }`}
                            />
                            <span
                              className={
                                isDark ? 'text-emerald-400' : 'text-emerald-600'
                              }
                            >
                              {getOfficeName(entry.toOfficeId)}
                            </span>
                          </p>

                          {/* Remarks */}
                          {entry.remarks && (
                            <p
                              className={`mt-1.5 text-sm italic ${
                                isDark ? 'text-slate-300' : 'text-slate-600'
                              }`}
                            >
                              "{entry.remarks}"
                            </p>
                          )}

                          {/* By / To user */}
                          <p
                            className={`mt-1.5 text-xs ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            by{' '}
                            <span
                              className={`font-medium ${
                                isDark ? 'text-slate-200' : 'text-slate-700'
                              }`}
                            >
                              {getUserName(entry.fromUserId)}
                            </span>
                            {entry.toUserId && (
                              <>
                                {' '}
                                to{' '}
                                <span
                                  className={`font-medium ${
                                    isDark ? 'text-slate-200' : 'text-slate-700'
                                  }`}
                                >
                                  {getUserName(entry.toUserId)}
                                </span>
                              </>
                            )}
                          </p>

                          {/* Acknowledgment pill */}
                          <div className="mt-2.5">
                            {entry.isAcknowledged && entry.receivedAt ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-medium text-white">
                                <CheckCircle className="h-3 w-3" />
                                Acknowledged{' '}
                                {format(new Date(entry.receivedAt), 'MMM d, h:mm a')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-medium text-white">
                                <Clock className="h-3 w-3" />
                                Awaiting acknowledgment
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div
                          className={`shrink-0 text-right text-[11px] ${
                            isDark ? 'text-slate-500' : 'text-slate-400'
                          }`}
                        >
                          <p>{format(new Date(entry.timestamp), 'MMM d, yyyy')}</p>
                          <p>{format(new Date(entry.timestamp), 'HH:mm')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter
          className={`border-t px-6 py-4 ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          }`}
        >
          <Button
            variant="outline"
            className={`${
              isDark
                ? 'border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}