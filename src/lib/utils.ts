import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function generateTrackingCode(): string {
  const year = new Date().getFullYear()
  const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0')
  return `TRK-${year}-${seq}`
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function getDaysUntilDue(dueDate: Date | undefined): number | null {
  if (!dueDate) return null
  const now = new Date()
  const diff = new Date(dueDate).getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
