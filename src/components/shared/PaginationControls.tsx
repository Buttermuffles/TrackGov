import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationControlsProps = {
  totalItems: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: Array<number | 'all'>
  itemLabel?: string
  compact?: boolean
}

function getVisiblePages(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages]
  }

  if (currentPage >= totalPages - 3) {
    return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages]
}

export default function PaginationControls({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50, 100, 'all'],
  itemLabel = 'items',
  compact = false,
}: PaginationControlsProps) {
  if (totalItems <= 0) return null

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(Math.max(currentPage, 1), totalPages)
  const start = (safePage - 1) * pageSize + 1
  const end = Math.min(safePage * pageSize, totalItems)
  const pages = getVisiblePages(safePage, totalPages)

  const mode = useThemeStore(s => s.mode)
  const isDark = mode === 'dark'
  const containerBg = isDark ? 'bg-slate-950/40 border-slate-700/50' : 'bg-white border-slate-200/80'
  const textColor = isDark ? 'text-slate-300' : 'text-slate-600'
  const strongText = isDark ? 'text-slate-100' : 'text-slate-800'
  const mutedText = isDark ? 'text-slate-500' : 'text-slate-500'
  const buttonBorder = isDark ? 'border-slate-700' : 'border-slate-200'
  const buttonBg = isDark ? 'bg-slate-900' : 'bg-white'
  const buttonText = isDark ? 'text-slate-200' : 'text-slate-700'
  const hoverBorder = isDark ? 'hover:border-slate-600' : 'hover:border-indigo-300'
  const hoverBg = isDark ? 'hover:bg-slate-800' : 'hover:bg-indigo-50'

  return (
    <div className={cn('rounded-xl border px-3 py-2.5 shadow-sm', containerBg)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className={cn('flex flex-wrap items-center gap-2 text-xs', textColor)}>
          <span>
            Showing <span className={cn('font-semibold', strongText)}>{start}-{end}</span> of{' '}
            <span className={cn('font-semibold', strongText)}>{totalItems}</span> {itemLabel}
          </span>
          <div className="inline-flex items-center gap-2">
            <span className={mutedText}>Entries</span>
            <Select
              value={pageSize === totalItems ? 'all' : String(pageSize)}
              onValueChange={value => onPageSizeChange(value === 'all' ? totalItems : Number(value))}
            >
              <SelectTrigger className={cn('h-8 w-[86px] text-xs', buttonBorder, buttonBg, buttonText)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map(size => (
                  <SelectItem key={String(size)} value={String(size)}>
                    {size === 'all' ? 'All' : size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className={cn('h-8 px-2.5 text-xs', buttonBorder, buttonBg, buttonText, hoverBorder, hoverBg)}
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage === 1}
          >
            <ChevronLeft className="mr-1 h-3.5 w-3.5" />
            Prev
          </Button>

          {!compact && pages.map((p, index) =>
            p === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className={cn('px-1', mutedText)}>
                ...
              </span>
            ) : (
              <Button
                key={p}
                size="sm"
                variant={p === safePage ? 'default' : 'outline'}
                className={cn(
                  'h-8 min-w-8 px-2 text-xs',
                  p === safePage
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : cn(buttonBorder, buttonBg, buttonText, hoverBorder, hoverBg)
                )}
                onClick={() => onPageChange(p)}
              >
                {p}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            className={cn('h-8 px-2.5 text-xs', buttonBorder, buttonBg, buttonText, hoverBorder, hoverBg)}
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage === totalPages}
          >
            Next
            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
