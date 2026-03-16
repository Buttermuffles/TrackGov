import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  [
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'focus:ring-slate-950 dark:focus:ring-slate-300 dark:focus:ring-offset-slate-900',
    'select-none',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'border-transparent bg-slate-900 text-white',
          'dark:bg-slate-100 dark:text-slate-900',
          'hover:bg-slate-700 dark:hover:bg-slate-200',
        ].join(' '),

        secondary: [
          'border-transparent bg-slate-200 text-slate-800',
          'dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600',
          'hover:bg-slate-300 dark:hover:bg-slate-600',
        ].join(' '),

        destructive: [
          'border-transparent bg-red-700 text-white',
          'dark:bg-red-600 dark:text-white dark:border-transparent',
          'hover:bg-red-800 dark:hover:bg-red-500',
        ].join(' '),

        outline: [
          'border-slate-300 text-slate-700 bg-transparent',
          'dark:border-slate-600 dark:text-slate-300',
          'hover:bg-slate-50 dark:hover:bg-slate-800',
        ].join(' '),

        success: [
          'border-transparent bg-emerald-600 text-white',
          'dark:bg-emerald-500 dark:text-white dark:border-transparent',
          'hover:bg-emerald-700 dark:hover:bg-emerald-400',
        ].join(' '),

        warning: [
          'border-transparent bg-amber-500 text-white',
          'dark:bg-amber-500 dark:text-white dark:border-transparent',
          'hover:bg-amber-600 dark:hover:bg-amber-400',
        ].join(' '),

        danger: [
          'border-transparent bg-rose-600 text-white',
          'dark:bg-rose-500 dark:text-white dark:border-transparent',
          'hover:bg-rose-700 dark:hover:bg-rose-400',
        ].join(' '),

        info: [
          'border-transparent bg-blue-600 text-white',
          'dark:bg-blue-500 dark:text-white dark:border-transparent',
          'hover:bg-blue-700 dark:hover:bg-blue-400',
        ].join(' '),

        gold: [
          'border-transparent bg-yellow-400 text-slate-900',
          'dark:bg-yellow-400 dark:text-slate-950 dark:border-transparent',
          'hover:bg-yellow-300 dark:hover:bg-yellow-300',
        ].join(' '),

        purple: [
          'border-transparent bg-violet-600 text-white',
          'dark:bg-violet-500 dark:text-white dark:border-transparent',
          'hover:bg-violet-700 dark:hover:bg-violet-400',
        ].join(' '),
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }