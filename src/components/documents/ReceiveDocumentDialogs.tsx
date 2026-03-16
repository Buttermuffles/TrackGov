import React from 'react'
import type { Classification, DocumentType, Office, User } from '@/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Eye, Check } from 'lucide-react'
import { formatFileSize } from '@/lib/utils'

export type PendingAttachment = {
  id: string
  file: File
  previewUrl: string
  ocrStatus: 'idle' | 'processing' | 'done' | 'error'
  ocrText: string
  ocrError?: string
}

export type ReceiveFormData = {
  title: string
  documentType: DocumentType
  referenceNumber: string
  classification: Classification
  fromOfficeId: string
  dateReceived: string
  description: string
  tags: string
  assignToOfficeId: string
  assignToUserId: string
  remarks: string
}

type ReceiveDocumentDialogsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: ReceiveFormData
  setFormData: React.Dispatch<React.SetStateAction<ReceiveFormData>>
  docTypes: DocumentType[]
  offices: Office[]
  users: User[]
  attachments: PendingAttachment[]
  previewAttachment: PendingAttachment | null
  setPreviewAttachment: (attachment: PendingAttachment | null) => void
  onSelectAttachments: (e: React.ChangeEvent<HTMLInputElement>) => void
  canPreviewAttachment: (att: PendingAttachment) => boolean
  runOcrForAllImages: () => Promise<void>
  runOcr: (id: string) => Promise<void>
  removeAttachment: (id: string) => void
  onCancel: () => void
  onSubmit: () => void
  canSubmit: boolean
}

export default function ReceiveDocumentDialogs({
  open,
  onOpenChange,
  formData,
  setFormData,
  docTypes,
  offices,
  users,
  attachments,
  previewAttachment,
  setPreviewAttachment,
  onSelectAttachments,
  canPreviewAttachment,
  runOcrForAllImages,
  runOcr,
  removeAttachment,
  onCancel,
  onSubmit,
  canSubmit,
}: ReceiveDocumentDialogsProps) {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Receive New Document</DialogTitle>
            <DialogDescription>Enter document details and initial routing information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <Label>Document Title <span className="text-red-500">*</span></Label>
                <Input value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} placeholder="Enter document title" />
              </div>
              <div className="space-y-2">
                <Label>Document Type <span className="text-red-500">*</span></Label>
                <Select value={formData.documentType} onValueChange={v => setFormData(f => ({ ...f, documentType: v as DocumentType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {docTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Reference Number</Label>
                <Input value={formData.referenceNumber} onChange={e => setFormData(f => ({ ...f, referenceNumber: e.target.value }))} placeholder="e.g. LGU-2026-089" />
              </div>
              <div className="space-y-2">
                <Label>Classification <span className="text-red-500">*</span></Label>
                <Select value={formData.classification} onValueChange={v => setFormData(f => ({ ...f, classification: v as Classification }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Routine', 'Priority', 'Confidential', 'Top Secret'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Received <span className="text-red-500">*</span></Label>
                <Input type="date" value={formData.dateReceived} onChange={e => setFormData(f => ({ ...f, dateReceived: e.target.value }))} />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} placeholder="Enter description..." rows={3} />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Tags <span className="text-slate-400 font-normal">(comma separated)</span></Label>
                <Input value={formData.tags} onChange={e => setFormData(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. budget, urgent, fy2026" />
              </div>

              <div className="sm:col-span-2 space-y-3 border rounded-lg p-3 bg-slate-50/80">
                <div className="flex items-center justify-between gap-2">
                  <Label>Attachments</Label>
                  <Button type="button" size="sm" variant="accent" onClick={runOcrForAllImages} disabled={!attachments.some(att => att.file.type.startsWith('image/'))}>
                    Scan OCR for Images
                  </Button>
                </div>
                <Input type="file" multiple onChange={onSelectAttachments} accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" />
                <p className="text-[11px] text-slate-500">Supports image, PDF, Word, spreadsheet, and text files. OCR is available for images.</p>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map(att => (
                      <div key={att.id} className="rounded-md border bg-white p-2.5 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">{att.file.name}</p>
                            <p className="text-[11px] text-slate-500">{formatFileSize(att.file.size)} · {att.file.type || 'Unknown type'}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button type="button" size="sm" variant="accent" className="h-7 text-[11px]" onClick={() => setPreviewAttachment(att)} disabled={!canPreviewAttachment(att)}>
                              <Eye className="w-3 h-3 mr-1" />Preview
                            </Button>
                            {att.file.type.startsWith('image/') && (
                              <Button type="button" size="sm" variant={att.ocrStatus === 'done' ? 'success' : 'gold'} className="h-7 text-[11px]" onClick={() => runOcr(att.id)} disabled={att.ocrStatus === 'processing'}>
                                {att.ocrStatus === 'processing' ? 'Scanning...' : att.ocrStatus === 'done' ? 'OCR Done' : 'Run OCR'}
                              </Button>
                            )}
                            <Button type="button" size="sm" variant="destructive" className="h-7 text-[11px]" onClick={() => removeAttachment(att.id)}>
                              Remove
                            </Button>
                          </div>
                        </div>
                        {att.ocrStatus === 'done' && att.ocrText && (
                          <Textarea readOnly value={att.ocrText.slice(0, 1000)} rows={4} className="text-xs" />
                        )}
                        {att.ocrStatus === 'done' && !att.ocrText && (
                          <p className="text-[11px] text-amber-600">No readable text found from OCR.</p>
                        )}
                        {att.ocrStatus === 'error' && (
                          <p className="text-[11px] text-red-600">{att.ocrError}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4 mt-2">
              <h4 className="font-semibold text-sm mb-3">Initial Routing</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assign to Office</Label>
                  <Select value={formData.assignToOfficeId} onValueChange={v => setFormData(f => ({ ...f, assignToOfficeId: v, assignToUserId: '' }))}>
                    <SelectTrigger><SelectValue placeholder="Select office..." /></SelectTrigger>
                    <SelectContent>
                      {offices.map(o => <SelectItem key={o.id} value={o.id}>{o.code} — {o.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {formData.assignToOfficeId && (
                  <div className="space-y-2">
                    <Label>Assign to Person <span className="text-slate-400 font-normal">(optional)</span></Label>
                    <Select value={formData.assignToUserId || 'none'} onValueChange={v => setFormData(f => ({ ...f, assignToUserId: v === 'none' ? '' : v }))}>
                      <SelectTrigger><SelectValue placeholder="Auto-assign to office..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
                        {users.filter(u => u.officeId === formData.assignToOfficeId && u.isActive).map(u => (
                          <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.position}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="sm:col-span-2 space-y-2">
                  <Label>Remarks / Instructions</Label>
                  <Textarea value={formData.remarks} onChange={e => setFormData(f => ({ ...f, remarks: e.target.value }))} placeholder="Instructions for receiving office..." rows={2} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={onSubmit} disabled={!canSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5">
              <Check className="w-4 h-4" />Receive & Route
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewAttachment} onOpenChange={open => { if (!open) setPreviewAttachment(null) }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Attachment Preview</DialogTitle>
            <DialogDescription>{previewAttachment?.file.name}</DialogDescription>
          </DialogHeader>
          {previewAttachment && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">{formatFileSize(previewAttachment.file.size)} · {previewAttachment.file.type || 'Unknown type'}</p>
              {previewAttachment.file.type.startsWith('image/') && (
                <div className="rounded-lg border bg-slate-50 p-2">
                  <img src={previewAttachment.previewUrl} alt={previewAttachment.file.name} className="max-h-[60vh] w-full object-contain rounded" />
                </div>
              )}
              {previewAttachment.file.type === 'application/pdf' && (
                <iframe src={previewAttachment.previewUrl} title={previewAttachment.file.name} className="h-[60vh] w-full rounded border" />
              )}
              {previewAttachment.file.type.startsWith('text/') && (
                <iframe src={previewAttachment.previewUrl} title={previewAttachment.file.name} className="h-[50vh] w-full rounded border bg-white" />
              )}
              {!canPreviewAttachment(previewAttachment) && (
                <div className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-600">
                  Preview is not available for this file type. You can still keep it attached.
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {previewAttachment && (
              <Button asChild variant="outline">
                <a href={previewAttachment.previewUrl} target="_blank" rel="noreferrer">Open in New Tab</a>
              </Button>
            )}
            <Button onClick={() => setPreviewAttachment(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
