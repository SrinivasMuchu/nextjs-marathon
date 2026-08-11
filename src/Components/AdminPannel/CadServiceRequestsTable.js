"use client"

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { BASE_URL } from '@/config'
import { formatDate } from '@/common.helper'
import Pagenation from '@/Components/CommonJsx/Pagenation'
import Loading from '../CommonJsx/Loaders/Loading'
import modalStyles from '../CommonJsx/AdminApprovalButtons.module.css'
import styles from './CadServiceRequestsTable.module.css'
import CadVendorMailPopup from './CadVendorMailPopup'
import AddQuotationPopup, {
  QuotationHistoryList,
} from './AddQuotationPopup'
import AddInvoicePopup, {
  InvoiceHistoryList,
} from './AddInvoicePopup'
import {
  addCadServiceNote,
  addCadServicePartnerNote,
  deleteCadServicePartnerNote,
  fetchCadServiceActivity,
  fetchCadServicePartnerNotes,
  fetchCadServiceQuotations,
  fetchCadServiceInvoices,
  updateCadServiceProgress,
  uploadCadServiceNoteFile,
  uploadCadServiceReferenceFile,
  removeCadServiceReferenceFile,
} from '@/api/adminVendorsApi'
import {
  CAD_SERVICE_STATUSES,
  getCadServiceStatusColor,
  getCadServiceStatusLabel,
  normalizeCadServiceStatus,
} from './cadServiceStatusConfig'
import { getCadPartnerPagePath, getCadPartnerPageUrl } from '../CadServicePages/CadFormContext'

const SERVICE_LABELS = {
  modeling: '3D Modeling',
  drafting: '2D Drafting',
  rendering: 'Rendering',
  conversion: 'File Conversion',
  'reverse-engineering': 'Reverse Engineering',
  other: 'Other',
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  ...CAD_SERVICE_STATUSES.map((status) => ({
    value: status.value,
    label: status.label,
  })),
]

function StatusBadge({ status }) {
  const normalized = normalizeCadServiceStatus(status)
  const color = getCadServiceStatusColor(normalized)
  const label = getCadServiceStatusLabel(normalized)

  return (
    <span
      className={styles.statusBadge}
      style={{
        color,
        backgroundColor: `${color}1a`,
        borderColor: `${color}59`,
      }}
    >
      <span className={styles.statusDot} style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

function toDateInputValue(value) {
  if (!value) return ''
  const raw = String(value)
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function formatServiceProgressDate(value) {
  const inputValue = toDateInputValue(value)
  if (!inputValue) return ''
  const [year, month, day] = inputValue.split('-').map(Number)
  if (!year || !month || !day) return formatDate(value)
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatServiceProgressRange(request = {}) {
  const started = formatServiceProgressDate(request.service_started_at)
  const ended = formatServiceProgressDate(request.service_ended_at)
  if (!started && !ended) return '—'
  if (started && ended) return `${started} → ${ended}`
  if (started) return `${started} → Open`
  return `Ended ${ended}`
}

function getReferenceFiles(request = {}) {
  const fromArray = Array.isArray(request.files) ? request.files : []
  const fromSingle = request.file ? [request.file] : []
  return [...new Set([...fromArray, ...fromSingle].map((item) => String(item || '').trim()).filter(Boolean))]
}

function DetailRow({ label, value, isLink, links, linkLabel }) {
  const linkList = Array.isArray(links) ? links.filter(Boolean) : []
  if (!value && !linkList.length) return null
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      {linkList.length ? (
        <div className={styles.detailLinks}>
          {linkList.map((url, index) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.detailLink}
            >
              {linkList.length === 1 ? 'Download reference file' : `Download file ${index + 1}`}
            </a>
          ))}
        </div>
      ) : isLink ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
          {linkLabel || 'Download reference file'}
        </a>
      ) : (
        <span className={styles.detailValue}>{value}</span>
      )}
    </div>
  )
}

function VendorMailHistory({ logs = [], title = 'Vendor mail history', showTitle = true }) {
  if (!Array.isArray(logs) || !logs.length) {
    return <p className={styles.logsEmptyText}>No mail logs found for this request.</p>
  }

  const ordered = [...logs]

  return (
    <div className={styles.vendorMailHistory}>
      {showTitle ? <h4 className={styles.vendorMailHistoryTitle}>{title}</h4> : null}
      {ordered.map((log, index) => (
        <div key={log._id || `${log.sent_at}-${index}`} className={styles.vendorMailLog}>
          <div className={styles.vendorMailLogHeader}>
            <span>
              Send #{ordered.length - index} · {formatDate(log.sent_at || log.createdAt)}
            </span>
            <span>
              {(log.vendor_emails || []).length} recipient{(log.vendor_emails || []).length === 1 ? '' : 's'}
              {log.send_all ? ' · all active' : ''}
            </span>
          </div>
          <DetailRow label="Subject" value={log.subject} />
          <DetailRow
            label="CC"
            value={(log.cc_emails || []).join('\n') || null}
          />
          <DetailRow
            label="Format"
            value={log.mail_format === 'text' ? 'Plain text' : 'Template'}
          />
          {log.mail_format === 'text' ? (
            <DetailRow label="Email text" value={log.text_content} />
          ) : null}
          <DetailRow label="Project type" value={log.content?.project_type} />
          <DetailRow label="Timeline" value={log.content?.model_use} />
          <DetailRow label="Budget" value={log.content?.budget} />
          <DetailRow label="Software" value={log.content?.software_format} />
          <DetailRow label="Project brief" value={log.content?.requirement} />
          <DetailRow
            label="Mails received by"
            value={(log.vendor_emails || []).join('\n') || null}
          />
        </div>
      ))}
    </div>
  )
}

const ACTIVITY_LABELS = {
  request_created: 'Request',
  status_changed: 'Status',
  standalone_status_changed: 'Page status',
  vendor_mail_sent: 'Email',
  quotation_created: 'Quotation',
  invoice_created: 'Invoice',
  service_progress_updated: 'Progress',
  note_added: 'Note',
  file_replaced: 'File',
  file_removed: 'File',
}

function formatNoteFileSize(bytes) {
  const size = Number(bytes)
  if (!Number.isFinite(size) || size < 0) return ''
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function fileNameFromUrl(url) {
  const value = String(url || '').trim()
  if (!value) return 'File'
  try {
    const pathname = new URL(value).pathname
    const name = decodeURIComponent(pathname.split('/').pop() || '')
    return name || 'File'
  } catch {
    const name = decodeURIComponent(value.split('/').pop() || '')
    return name || 'File'
  }
}

function ActivityTimeline({ activities = [] }) {
  if (!Array.isArray(activities) || activities.length === 0) {
    return <p className={styles.logsEmptyText}>No activity found for this request.</p>
  }

  return (
    <div className={styles.activityTimeline}>
      {activities.map((activity) => {
        const vendorNames = activity.metadata?.vendor_names || []
        const vendorEmails = activity.metadata?.vendor_emails || []
        const noteAttachments = Array.isArray(activity.metadata?.attachments)
          ? activity.metadata.attachments
          : []
        const addedFileUrl = activity.metadata?.new_file || null
        const removedFileUrl = activity.metadata?.removed_file || null
        return (
          <div key={activity._id} className={styles.activityItem}>
            <span className={styles.activityDot} />
            <div className={styles.activityCard}>
              <div className={styles.activityHeader}>
                <div className={styles.activityTitleRow}>
                  <span className={styles.activityType}>
                    {ACTIVITY_LABELS[activity.event_type] || 'Activity'}
                  </span>
                  <strong>{activity.title}</strong>
                </div>
                <span className={styles.activityDate}>
                  {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : ''}
                </span>
              </div>
              {activity.from_status || activity.to_status ? (
                <div className={styles.activityStatus}>
                  {activity.from_status
                    ? getCadServiceStatusLabel(activity.from_status)
                    : 'New'}
                  {' → '}
                  {getCadServiceStatusLabel(activity.to_status)}
                </div>
              ) : null}
              {activity.description ? (
                <p className={styles.activityDescription}>{activity.description}</p>
              ) : null}
              {vendorNames.length || vendorEmails.length ? (
                <p className={styles.activityMeta}>
                  Vendors: {(vendorNames.length ? vendorNames : vendorEmails).join(', ')}
                </p>
              ) : null}
              {activity.metadata?.subject ? (
                <p className={styles.activityMeta}>Subject: {activity.metadata.subject}</p>
              ) : null}
              {Array.isArray(activity.metadata?.cc_emails) && activity.metadata.cc_emails.length ? (
                <p className={styles.activityMeta}>
                  CC: {activity.metadata.cc_emails.join(', ')}
                </p>
              ) : null}
              {addedFileUrl ? (
                <div className={styles.noteAttachmentLinks}>
                  <a
                    href={addedFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.noteAttachmentLink}
                  >
                    Added: {fileNameFromUrl(addedFileUrl)}
                  </a>
                </div>
              ) : null}
              {removedFileUrl ? (
                <div className={styles.noteAttachmentLinks}>
                  <a
                    href={removedFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.noteAttachmentLink} ${styles.noteAttachmentLinkRemoved}`}
                  >
                    Deleted: {fileNameFromUrl(removedFileUrl)}
                  </a>
                </div>
              ) : null}
              {noteAttachments.length > 0 ? (
                <div className={styles.noteAttachmentLinks}>
                  {noteAttachments.map((attachment) => (
                    <a
                      key={`${activity._id}-${attachment.key || attachment.url || attachment.name}`}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.noteAttachmentLink}
                    >
                      {attachment.name || 'Attachment'}
                    </a>
                  ))}
                </div>
              ) : activity.metadata?.attachment_count ? (
                <p className={styles.activityMeta}>
                  Attachments: {activity.metadata.attachment_count}
                </p>
              ) : null}
              {activity.actor_admin_email || activity.actor_admin_uuid ? (
                <p className={styles.activityActor}>
                  By {activity.actor_admin_email || activity.actor_admin_uuid}
                </p>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getServiceLabel(request) {
  return SERVICE_LABELS[request.what_do_you_need] || request.what_do_you_need || ''
}

async function fetchAllRequestsForExport(baseUrl, headers, q, action) {
  const allRequests = []
  let page = 1
  let totalPages = 1

  do {
    const params = { page, limit: 100, q }
    if (action !== 'all') params.action = action

    const response = await axios.get(`${baseUrl}/v1/admin-pannel/get-cad-service-requests`, {
      params,
      headers,
    })

    const respData = response?.data?.data || {}
    allRequests.push(...(respData.requests || []))
    totalPages = respData.totalPages || 1
    page += 1
  } while (page <= totalPages)

  return allRequests
}

async function exportRequestsToExcel(rows) {
  const ExcelJS = (await import('exceljs')).default
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('CAD Service Requests')

  worksheet.columns = [
    { header: 'Request ID', key: 'id', width: 26 },
    { header: 'Full Name', key: 'full_name', width: 22 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'Phone', key: 'phone_number', width: 18 },
    { header: 'Company', key: 'company_name', width: 22 },
    { header: 'Service', key: 'service', width: 20 },
    { header: 'Timeline', key: 'model_use', width: 20 },
    { header: 'Budget', key: 'budget', width: 16 },
    { header: 'Software Format', key: 'software_format', width: 20 },
    { header: 'Requirement', key: 'requirement', width: 40 },
    { header: 'Reference File URL', key: 'file', width: 40 },
    { header: 'Status', key: 'status', width: 20 },
    { header: 'Page Status', key: 'standalone_page_status', width: 20 },
    { header: 'Partner Page URL', key: 'partner_page_url', width: 40 },
    { header: 'Rejection Reason', key: 'rejected_message', width: 30 },
    { header: 'Submitted At', key: 'createdAt', width: 18 },
    { header: 'Service Started', key: 'service_started_at', width: 18 },
    { header: 'Service Ended', key: 'service_ended_at', width: 18 },
    { header: 'Reviewed At', key: 'reviewed_at', width: 18 },
    { header: 'Updated At', key: 'updatedAt', width: 18 },
  ]

  worksheet.getRow(1).font = { bold: true }

  rows.forEach((request) => {
    worksheet.addRow({
      id: request._id || '',
      full_name: request.full_name || '',
      email: request.email || '',
      phone_number: request.phone_number || '',
      company_name: request.company_name || '',
      service: getServiceLabel(request),
      model_use: request.model_use || '',
      budget: request.budget || '',
      software_format: request.software_format || '',
      requirement: request.requirement || '',
      file: getReferenceFiles(request).join('\n'),
      status: getCadServiceStatusLabel(request.status),
      standalone_page_status: getCadServiceStatusLabel(request.standalone_page_status),
      partner_page_url: getCadPartnerPageUrl(request._id),
      rejected_message: request.rejected_message || '',
      createdAt: request.createdAt ? formatDate(request.createdAt) : '',
      service_started_at: formatServiceProgressDate(request.service_started_at),
      service_ended_at: formatServiceProgressDate(request.service_ended_at),
      reviewed_at: request.reviewed_at ? formatDate(request.reviewed_at) : '',
      updatedAt: request.updatedAt ? formatDate(request.updatedAt) : '',
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob(
    [buffer],
    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
  )
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `cad-service-requests-${new Date().toISOString().slice(0, 10)}.xlsx`
  link.click()
  URL.revokeObjectURL(url)
}

function RequestStatusSelect({ request, isSubmitting, onStatusSelect, className }) {
  return (
    <select
      className={className}
      value={normalizeCadServiceStatus(request.status)}
      disabled={isSubmitting}
      onChange={(e) => onStatusSelect(request, e.target.value)}
      aria-label={`Change status for ${request.full_name || request.email || 'request'}`}
    >
      {CAD_SERVICE_STATUSES.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  )
}

function StandalonePageStatusSelect({ request, isSubmitting, onStatusSelect, className }) {
  return (
    <select
      className={className}
      value={normalizeCadServiceStatus(request.standalone_page_status)}
      disabled={isSubmitting}
      onChange={(e) => onStatusSelect(request, e.target.value)}
      aria-label={`Change partner page status for ${request.full_name || request.email || 'request'}`}
    >
      {CAD_SERVICE_STATUSES.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  )
}

function RequestActionsMenu({
  request,
  isSubmitting,
  onAddQuote,
  onViewQuotes,
  onAddInvoice,
  onViewInvoices,
  onViewActivity,
  onPartnerNotes,
  onStatusSelect,
  onStandaloneStatusSelect,
}) {
  const [open, setOpen] = useState(false)
  const [panelStyle, setPanelStyle] = useState({})
  const buttonRef = useRef(null)
  const panelRef = useRef(null)

  const quotationCount = Number(request.quotation_count) || 0
  const invoiceCount = Number(request.invoice_count) || 0
  const activityCount = Number(request.activity_count) || 0

  const updatePanelPosition = () => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const panelWidth = 260
    const estimatedHeight = 420
    const left = Math.min(Math.max(8, rect.right - panelWidth), window.innerWidth - panelWidth - 8)
    const openUp = window.innerHeight - rect.bottom < estimatedHeight && rect.top > estimatedHeight
    const top = openUp
      ? Math.max(8, rect.top - estimatedHeight - 4)
      : Math.min(rect.bottom + 4, window.innerHeight - 8)

    setPanelStyle({
      top,
      left,
      width: panelWidth,
    })
  }

  useEffect(() => {
    if (!open) return undefined

    updatePanelPosition()

    const handlePointerDown = (event) => {
      const target = event.target
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const handleReposition = () => updatePanelPosition()

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [open])

  const runAndClose = (action) => {
    setOpen(false)
    action?.()
  }

  return (
    <div className={styles.actionMenu}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.actionMenuBtn}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        Action
        <KeyboardArrowDownIcon fontSize="small" />
      </button>
      {open && typeof document !== 'undefined'
        ? createPortal(
          <div
            ref={panelRef}
            className={styles.actionMenuPanel}
            style={panelStyle}
            role="menu"
          >
            <button
              type="button"
              role="menuitem"
              className={styles.actionMenuItem}
              onClick={() => runAndClose(() => onAddQuote(request))}
            >
              Add quotation
            </button>
            <button
              type="button"
              role="menuitem"
              className={styles.actionMenuItem}
              disabled={quotationCount <= 0}
              onClick={() => runAndClose(() => onViewQuotes(request))}
            >
              {quotationCount > 0 ? `View quotations (${quotationCount})` : 'View quotations'}
            </button>
            <button
              type="button"
              role="menuitem"
              className={styles.actionMenuItem}
              onClick={() => runAndClose(() => onAddInvoice(request))}
            >
              Add invoice
            </button>
            <button
              type="button"
              role="menuitem"
              className={styles.actionMenuItem}
              disabled={invoiceCount <= 0}
              onClick={() => runAndClose(() => onViewInvoices(request))}
            >
              {invoiceCount > 0 ? `View invoices (${invoiceCount})` : 'View invoices'}
            </button>
            <button
              type="button"
              role="menuitem"
              className={styles.actionMenuItem}
              onClick={() => runAndClose(() => onViewActivity(request))}
            >
              {activityCount > 0 ? `Activity logs (${activityCount})` : 'Activity logs'}
            </button>
            <button
              type="button"
              role="menuitem"
              className={styles.actionMenuItem}
              onClick={() => runAndClose(() => onPartnerNotes(request))}
            >
              Partner notes
            </button>
            <div className={styles.actionMenuDivider} />
            <label className={styles.actionMenuField}>
              <span>Change status</span>
              <RequestStatusSelect
                request={request}
                isSubmitting={isSubmitting}
                onStatusSelect={onStatusSelect}
                className={styles.statusSelect}
              />
            </label>
            <label className={styles.actionMenuField}>
              <span>Page status</span>
              <StandalonePageStatusSelect
                request={request}
                isSubmitting={isSubmitting}
                onStatusSelect={onStandaloneStatusSelect}
                className={styles.statusSelect}
              />
            </label>
          </div>,
          document.body,
        )
        : null}
    </div>
  )
}

function CadServiceRequestsTable() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [statusCounts, setStatusCounts] = useState({})
  const [totalCount, setTotalCount] = useState(0)
  const [viewRequest, setViewRequest] = useState(null)
  const [isManagingReferenceFiles, setIsManagingReferenceFiles] = useState(false)
  const [removingReferenceFileUrl, setRemovingReferenceFileUrl] = useState('')
  const viewReferenceFileInputRef = useRef(null)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejectionMessage, setRejectionMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [mailTarget, setMailTarget] = useState(null)
  const [quotationTarget, setQuotationTarget] = useState(null)
  const [quotesTarget, setQuotesTarget] = useState(null)
  const [quotesLoading, setQuotesLoading] = useState(false)
  const [invoiceTarget, setInvoiceTarget] = useState(null)
  const [invoicesTarget, setInvoicesTarget] = useState(null)
  const [invoicesLoading, setInvoicesLoading] = useState(false)
  const [activityTarget, setActivityTarget] = useState(null)
  const [activityLoading, setActivityLoading] = useState(false)
  const [partnerNotesTarget, setPartnerNotesTarget] = useState(null)
  const [partnerNotesLoading, setPartnerNotesLoading] = useState(false)
  const [partnerNoteText, setPartnerNoteText] = useState('')
  const [partnerNoteSaving, setPartnerNoteSaving] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [notePendingFiles, setNotePendingFiles] = useState([])
  const [noteSaving, setNoteSaving] = useState(false)
  const [noteUploadProgress, setNoteUploadProgress] = useState('')
  const noteFileInputRef = useRef(null)
  const [logsTarget, setLogsTarget] = useState(null)
  const [logsLoading, setLogsLoading] = useState(false)
  const [progressStartedAt, setProgressStartedAt] = useState('')
  const [progressEndedAt, setProgressEndedAt] = useState('')
  const [isSavingProgress, setIsSavingProgress] = useState(false)

  const adminHeaders = () => ({
    'admin-uuid': localStorage.getItem('admin-uuid'),
  })

  const syncRequestInList = (updatedRequest) => {
    if (!updatedRequest?._id) return
    setRequests((current) =>
      current.map((item) => (item._id === updatedRequest._id ? { ...item, ...updatedRequest } : item))
    )
    setViewRequest((current) =>
      current && current._id === updatedRequest._id ? { ...current, ...updatedRequest } : current
    )
    setMailTarget((current) =>
      current && current._id === updatedRequest._id ? { ...current, ...updatedRequest } : current
    )
  }

  const handleAddViewReferenceFile = async (event) => {
    const selectedFile = event.target.files?.[0]
    event.target.value = ''
    if (!selectedFile || !viewRequest?._id) return

    setIsManagingReferenceFiles(true)
    try {
      const response = await uploadCadServiceReferenceFile(selectedFile, viewRequest._id)
      if (!response?.meta?.success || !response.data?.request) {
        throw new Error(response?.meta?.message || 'Failed to add reference file')
      }
      syncRequestInList(response.data.request)
      toast.success(response.meta.message || 'Reference file added successfully')
    } catch (error) {
      console.error('Add reference file error:', error)
      toast.error(
        error.response?.data?.meta?.message
          || error.message
          || 'Failed to add reference file',
      )
    } finally {
      setIsManagingReferenceFiles(false)
    }
  }

  const handleRemoveViewReferenceFile = async (fileUrl) => {
    if (!viewRequest?._id || !fileUrl) return
    const currentFiles = getReferenceFiles(viewRequest)
    if (currentFiles.length <= 1) {
      toast.error('At least one reference file is required. Add another file before removing this one.')
      return
    }

    setRemovingReferenceFileUrl(fileUrl)
    try {
      const response = await removeCadServiceReferenceFile(viewRequest._id, fileUrl)
      if (!response?.meta?.success || !response.data?.request) {
        throw new Error(response?.meta?.message || 'Failed to remove reference file')
      }
      syncRequestInList(response.data.request)
      toast.success(response.meta.message || 'Reference file removed successfully')
    } catch (error) {
      console.error('Remove reference file error:', error)
      toast.error(
        error.response?.data?.meta?.message
          || error.message
          || 'Failed to remove reference file',
      )
    } finally {
      setRemovingReferenceFileUrl('')
    }
  }

  const fetchRequests = async (page = 1, q = '', action = 'all') => {
    setIsLoading(true)
    try {
      const params = { page, limit, q }
      if (action !== 'all') params.action = action

      const response = await axios.get(`${BASE_URL}/v1/admin-pannel/get-cad-service-requests`, {
        params,
        headers: adminHeaders(),
      })

      const respData = response?.data?.data || {}
      setRequests(respData.requests || [])
      setTotalPages(respData.totalPages || 1)
      setStatusCounts(respData.statusCounts || {})
      setTotalCount(respData.total || respData.summary?.total || 0)
      if (respData.page && respData.page !== page) {
        setCurrentPage(respData.page)
      }
    } catch (error) {
      console.error('Error fetching CAD service requests:', error)
      setRequests([])
      setTotalPages(1)
      toast.error('Failed to load CAD service requests')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests(currentPage, searchTerm, statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, statusFilter])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchTerm(searchInput.trim())
    setCurrentPage(1)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleFilterChange = (filter) => {
    setStatusFilter(filter)
    setCurrentPage(1)
  }

  const refreshList = () => {
    fetchRequests(currentPage, searchTerm, statusFilter)
  }

  const handleStatusUpdate = async (requestId, nextStatus, message = '') => {
    setIsSubmitting(true)
    try {
      const payload = { request_id: requestId, status: nextStatus }
      if (nextStatus === 'rejected') payload.rejected_message = message

      const response = await axios.post(
        `${BASE_URL}/v1/admin-pannel/update-cad-service-request`,
        payload,
        { headers: adminHeaders() }
      )

      if (response.data?.meta?.success) {
        toast.success(response.data.meta.message)
        setRejectTarget(null)
        setRejectionMessage('')
        setViewRequest(null)
        refreshList()
      } else {
        toast.error(response.data?.meta?.message || 'Action failed')
      }
    } catch (error) {
      console.error('CAD service request action error:', error)
      toast.error(error.response?.data?.meta?.message || 'Failed to update request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStandaloneStatusUpdate = async (requestId, nextStatus) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/admin-pannel/update-cad-service-request`,
        { request_id: requestId, standalone_page_status: nextStatus },
        { headers: adminHeaders() }
      )

      if (response.data?.meta?.success) {
        toast.success(response.data.meta.message)
        if (response.data?.data?.request) {
          syncRequestInList(response.data.data.request)
        } else {
          refreshList()
        }
      } else {
        toast.error(response.data?.meta?.message || 'Action failed')
      }
    } catch (error) {
      console.error('CAD partner page status error:', error)
      toast.error(error.response?.data?.meta?.message || 'Failed to update partner page status')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusSelect = (request, nextStatus) => {
    const current = normalizeCadServiceStatus(request.status)
    if (nextStatus === current) return

    if (nextStatus === 'rejected') {
      setRejectTarget(request)
      setRejectionMessage('')
      return
    }

    handleStatusUpdate(request._id, nextStatus)
  }

  const handleStandaloneStatusSelect = (request, nextStatus) => {
    const current = normalizeCadServiceStatus(request.standalone_page_status)
    if (nextStatus === current) return
    handleStandaloneStatusUpdate(request._id, nextStatus)
  }

  const handleRejectSubmit = () => {
    if (!rejectionMessage.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    handleStatusUpdate(rejectTarget._id, 'rejected', rejectionMessage.trim())
  }

  const hydrateProgressForm = (request) => {
    setProgressStartedAt(toDateInputValue(request?.service_started_at))
    setProgressEndedAt(toDateInputValue(request?.service_ended_at))
  }

  const handleSaveServiceProgress = async () => {
    if (!viewRequest?._id) return

    if (progressEndedAt && !progressStartedAt) {
      toast.error('Set the service start date before the end date')
      return
    }
    if (progressStartedAt && progressEndedAt && progressEndedAt < progressStartedAt) {
      toast.error('Service end date cannot be earlier than the start date')
      return
    }

    const currentStarted = toDateInputValue(viewRequest.service_started_at)
    const currentEnded = toDateInputValue(viewRequest.service_ended_at)
    if (progressStartedAt === currentStarted && progressEndedAt === currentEnded) {
      toast.info('Service progress dates are unchanged')
      return
    }

    setIsSavingProgress(true)
    try {
      const response = await updateCadServiceProgress(viewRequest._id, {
        service_started_at: progressStartedAt || null,
        service_ended_at: progressEndedAt || null,
      })
      if (!response?.meta?.success || !response.data?.request) {
        throw new Error(response?.meta?.message || 'Failed to update service progress')
      }

      const updatedRequest = {
        ...response.data.request,
        activity_count: (Number(viewRequest.activity_count) || 0) + 1,
      }
      syncRequestInList(updatedRequest)
      hydrateProgressForm(updatedRequest)
      toast.success(response.meta.message || 'Service progress dates updated')
    } catch (error) {
      console.error('Save service progress error:', error)
      toast.error(
        error.response?.data?.meta?.message
          || error.message
          || 'Failed to update service progress',
      )
    } finally {
      setIsSavingProgress(false)
    }
  }

  const openView = async (request) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/v1/admin-pannel/get-cad-service-request/${request._id}`,
        { headers: adminHeaders() }
      )
      if (response.data?.meta?.success) {
        const nextRequest = response.data.data.request
        setViewRequest(nextRequest)
        hydrateProgressForm(nextRequest)
      } else {
        setViewRequest(request)
        hydrateProgressForm(request)
      }
    } catch {
      setViewRequest(request)
      hydrateProgressForm(request)
    }
  }

  const openMailLogs = async (request) => {
    const mailCount = Number(request.vendor_mail_count) || 0
    if (mailCount <= 0) return

    setLogsLoading(true)
    setLogsTarget({
      request,
      logs: [],
    })
    try {
      const response = await axios.get(
        `${BASE_URL}/v1/admin-pannel/get-cad-service-request/${request._id}`,
        { headers: adminHeaders() }
      )
      if (response.data?.meta?.success) {
        const detail = response.data.data.request || {}
        setLogsTarget({
          request: detail,
          logs: detail.vendor_mails || [],
        })
      } else {
        toast.error(response.data?.meta?.message || 'Failed to load mail logs')
        setLogsTarget(null)
      }
    } catch (error) {
      console.error('Error fetching mail logs:', error)
      toast.error('Failed to load mail logs')
      setLogsTarget(null)
    } finally {
      setLogsLoading(false)
    }
  }

  const openQuotations = async (request) => {
    const quotationCount = Number(request.quotation_count) || 0
    if (quotationCount <= 0) return

    setQuotesLoading(true)
    setQuotesTarget({
      request,
      quotations: [],
    })
    try {
      const response = await fetchCadServiceQuotations(request._id)
      if (response?.meta?.success) {
        setQuotesTarget({
          request,
          quotations: response.data?.quotations || [],
        })
      } else {
        toast.error(response?.meta?.message || 'Failed to load quotations')
        setQuotesTarget(null)
      }
    } catch (error) {
      console.error('Error fetching quotations:', error)
      toast.error('Failed to load quotations')
      setQuotesTarget(null)
    } finally {
      setQuotesLoading(false)
    }
  }

  const openInvoices = async (request) => {
    const invoiceCount = Number(request.invoice_count) || 0
    if (invoiceCount <= 0) return

    setInvoicesLoading(true)
    setInvoicesTarget({
      request,
      invoices: [],
    })
    try {
      const response = await fetchCadServiceInvoices(request._id)
      if (response?.meta?.success) {
        setInvoicesTarget({
          request,
          invoices: response.data?.invoices || [],
        })
      } else {
        toast.error(response?.meta?.message || 'Failed to load invoices')
        setInvoicesTarget(null)
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
      toast.error('Failed to load invoices')
      setInvoicesTarget(null)
    } finally {
      setInvoicesLoading(false)
    }
  }

  const openActivity = async (request) => {
    setNoteText('')
    setNotePendingFiles([])
    setNoteUploadProgress('')
    setActivityLoading(true)
    setActivityTarget({ request, activities: [] })
    try {
      const response = await fetchCadServiceActivity(request._id)
      if (response?.meta?.success) {
        setActivityTarget({
          request,
          activities: response.data?.activities || [],
        })
      } else {
        toast.error(response?.meta?.message || 'Failed to load activity logs')
        setActivityTarget(null)
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error)
      toast.error('Failed to load activity logs')
      setActivityTarget(null)
    } finally {
      setActivityLoading(false)
    }
  }

  const openPartnerNotes = async (request) => {
    setPartnerNoteText('')
    setPartnerNotesLoading(true)
    setPartnerNotesTarget({ request, notes: [] })
    try {
      const response = await fetchCadServicePartnerNotes(request._id)
      if (response?.meta?.success) {
        setPartnerNotesTarget({
          request,
          notes: response.data?.notes || [],
        })
      } else {
        toast.error(response?.meta?.message || 'Failed to load partner notes')
        setPartnerNotesTarget(null)
      }
    } catch (error) {
      console.error('Error fetching partner notes:', error)
      toast.error('Failed to load partner notes')
      setPartnerNotesTarget(null)
    } finally {
      setPartnerNotesLoading(false)
    }
  }

  const handleAddPartnerNote = async () => {
    const trimmedNote = partnerNoteText.trim()
    if (!trimmedNote || !partnerNotesTarget?.request?._id) return

    setPartnerNoteSaving(true)
    try {
      const response = await addCadServicePartnerNote(
        partnerNotesTarget.request._id,
        trimmedNote,
      )
      if (!response?.meta?.success || !response.data?.note) {
        throw new Error(response?.meta?.message || 'Failed to add partner note')
      }
      setPartnerNotesTarget((current) => ({
        ...current,
        notes: [response.data.note, ...(current?.notes || [])],
      }))
      setPartnerNoteText('')
      toast.success(response.meta.message || 'Partner note added')
    } catch (error) {
      console.error('Error adding partner note:', error)
      toast.error(error.response?.data?.meta?.message || error.message || 'Failed to add partner note')
    } finally {
      setPartnerNoteSaving(false)
    }
  }

  const handleDeletePartnerNote = async (noteId) => {
    if (!partnerNotesTarget?.request?._id || !noteId) return
    const confirmed = window.confirm('Delete this partner page note?')
    if (!confirmed) return

    try {
      const response = await deleteCadServicePartnerNote(
        partnerNotesTarget.request._id,
        noteId,
      )
      if (!response?.meta?.success) {
        throw new Error(response?.meta?.message || 'Failed to delete note')
      }
      setPartnerNotesTarget((current) => ({
        ...current,
        notes: (current?.notes || []).filter((note) => note._id !== noteId),
      }))
      toast.success(response.meta.message || 'Partner note deleted')
    } catch (error) {
      console.error('Error deleting partner note:', error)
      toast.error(error.response?.data?.meta?.message || error.message || 'Failed to delete note')
    }
  }

  const handleNoteFilesSelected = (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    setNotePendingFiles((prev) => {
      const existingKeys = new Set(
        prev.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
      )
      const next = [...prev]
      files.forEach((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`
        if (!existingKeys.has(key)) {
          next.push(file)
          existingKeys.add(key)
        }
      })
      return next.slice(0, 20)
    })
    event.target.value = ''
  }

  const removeNotePendingFile = (index) => {
    setNotePendingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddNote = async () => {
    const trimmedNote = noteText.trim()
    if ((!trimmedNote && notePendingFiles.length === 0) || !activityTarget?.request?._id) return

    setNoteSaving(true)
    setNoteUploadProgress(
      notePendingFiles.length ? `Uploading 0/${notePendingFiles.length}...` : 'Saving...',
    )
    try {
      const attachments = []
      for (let i = 0; i < notePendingFiles.length; i += 1) {
        setNoteUploadProgress(`Uploading ${i + 1}/${notePendingFiles.length}...`)
        const uploaded = await uploadCadServiceNoteFile(
          notePendingFiles[i],
          activityTarget.request._id,
        )
        attachments.push(uploaded)
      }

      setNoteUploadProgress('Saving note...')
      const response = await addCadServiceNote(
        activityTarget.request._id,
        trimmedNote,
        attachments,
      )
      if (!response?.meta?.success) {
        throw new Error(response?.meta?.message || 'Failed to add note')
      }

      setActivityTarget((current) => ({
        ...current,
        activities: [response.data.activity, ...(current?.activities || [])],
      }))
      setNoteText('')
      setNotePendingFiles([])
      toast.success(response.meta.message || 'Note added')
      refreshList()
    } catch (error) {
      console.error('Error adding request note:', error)
      toast.error(error.response?.data?.meta?.message || error.message || 'Failed to add note')
    } finally {
      setNoteSaving(false)
      setNoteUploadProgress('')
    }
  }

  const getFilterCount = (filterValue) => {
    if (filterValue === 'all') return totalCount
    return statusCounts[filterValue] || 0
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const rows = await fetchAllRequestsForExport(
        BASE_URL,
        adminHeaders(),
        searchTerm,
        statusFilter
      )

      const exportRows = rows.filter(
        (request) => normalizeCadServiceStatus(request.status) !== 'rejected',
      )

      if (!exportRows.length) {
        toast.info('No non-rejected requests to export')
        return
      }

      await exportRequestsToExcel(exportRows)
      toast.success(
        `Exported ${exportRows.length} request${exportRows.length === 1 ? '' : 's'} (rejected skipped)`,
      )
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export requests')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleWrap}>
          <h3 className={styles.sectionTitle}>All requests</h3>
          <span className={styles.sectionSubtitle}>{totalCount} requests</span>
        </div>
        <button
          type="button"
          className={styles.exportBtn}
          onClick={handleExport}
          disabled={isExporting}
        >
          <FileDownloadOutlinedIcon fontSize="small" />
          {isExporting ? 'Exporting...' : 'Export Excel'}
        </button>
      </div>

      <div className={styles.filtersRow}>
        <div className={`${styles.filterPills} ${styles.filterPillsDesktop}`}>
          {FILTER_OPTIONS.map((filter) => {
            const count = getFilterCount(filter.value)
            const label = filter.value === 'all' ? filter.label : `${filter.label} (${count})`
            return (
              <button
                key={filter.value}
                type="button"
                className={`${styles.filterPill} ${statusFilter === filter.value ? styles.filterPillActive : ''}`}
                onClick={() => handleFilterChange(filter.value)}
              >
                {label}
              </button>
            )
          })}
        </div>

        <div className={styles.statusFilterRow}>
          <label className={styles.statusFilterLabel} htmlFor="cad-status-filter">
            Filter by status
          </label>
          <select
            id="cad-status-filter"
            className={styles.statusDropdown}
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            {FILTER_OPTIONS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
                {filter.value !== 'all' ? ` (${getFilterCount(filter.value)})` : ` (${totalCount})`}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchInputWrap}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search name, email, service..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button type="submit" className={styles.searchBtn}>Search</button>
          {searchTerm && (
            <button type="button" onClick={handleClearSearch} className={styles.clearBtn}>
              Clear
            </button>
          )}
        </form>
      </div>

      <div className={styles.desktopTable}>
        <div className={styles.tableScroll}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Service progress</th>
                  <th>View</th>
                  <th>Send mail</th>
                  <th>Action</th>
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan={9} className={styles.emptyCell}>
                      <Loading />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={9} className={styles.emptyCell}>
                        No CAD service requests found
                      </td>
                    </tr>
                  ) : (
                    requests.map((request) => {
                      const partnerPagePath = getCadPartnerPagePath(request._id)
                      return (
                      <tr key={request._id}>
                        <td>{request.full_name || '—'}</td>
                        <td>{request.email || '—'}</td>
                        <td>
                          {SERVICE_LABELS[request.what_do_you_need] || request.what_do_you_need || '—'}
                        </td>
                        <td>
                          <StatusBadge status={request.status} />
                        </td>
                        <td>{formatDate(request.createdAt)}</td>
                        <td>
                          <span className={styles.progressCell}>
                            {formatServiceProgressRange(request)}
                          </span>
                        </td>
                        <td>
                          <div className={styles.inlineActions}>
                            <button
                              type="button"
                              className={styles.viewBtn}
                              onClick={() => openView(request)}
                              aria-label="View request"
                              title="View request details"
                            >
                              <VisibilityOutlinedIcon fontSize="small" />
                            </button>
                            <a
                              href={partnerPagePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.viewBtn}
                              aria-label="Open partner page"
                              title="Open partner page"
                            >
                              <OpenInNewIcon fontSize="small" />
                            </a>
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.viewBtn}
                            onClick={() => setMailTarget(request)}
                            aria-label="Send vendor mail"
                            title="Send mail to vendors"
                          >
                            <MailOutlineIcon fontSize="small" />
                          </button>
                        </td>
                        <td>
                          <RequestActionsMenu
                            request={request}
                            isSubmitting={isSubmitting}
                            onAddQuote={setQuotationTarget}
                            onViewQuotes={openQuotations}
                            onAddInvoice={setInvoiceTarget}
                            onViewInvoices={openInvoices}
                            onViewActivity={openActivity}
                            onPartnerNotes={openPartnerNotes}
                            onStatusSelect={handleStatusSelect}
                            onStandaloneStatusSelect={handleStandaloneStatusSelect}
                          />
                        </td>
                      </tr>
                      )
                    })
                  )}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      <div className={styles.mobileCards}>
        {isLoading ? (
          <div className={styles.mobileEmpty}>
            <Loading />
          </div>
        ) : requests.length === 0 ? (
          <div className={styles.mobileEmpty}>No CAD service requests found</div>
        ) : (
          requests.map((request) => (
            <article key={request._id} className={styles.requestCard}>
              <div className={styles.requestCardHeader}>
                <div>
                  <h4 className={styles.requestCardName}>{request.full_name || '—'}</h4>
                  <p className={styles.requestCardEmail}>{request.email || '—'}</p>
                </div>
                <div className={styles.inlineActions}>
                  <button
                    type="button"
                    className={styles.viewBtn}
                    onClick={() => openView(request)}
                    aria-label="View request"
                    title="View request details"
                  >
                    <VisibilityOutlinedIcon fontSize="small" />
                  </button>
                  <a
                    href={getCadPartnerPagePath(request._id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.viewBtn}
                    aria-label="Open partner page"
                    title="Open partner page"
                  >
                    <OpenInNewIcon fontSize="small" />
                  </a>
                </div>
              </div>

              <div className={styles.requestCardMeta}>
                <div className={styles.requestCardField}>
                  <span className={styles.requestCardLabel}>Service</span>
                  <span className={styles.requestCardValue}>
                    {SERVICE_LABELS[request.what_do_you_need] || request.what_do_you_need || '—'}
                  </span>
                </div>
                <div className={styles.requestCardField}>
                  <span className={styles.requestCardLabel}>Submitted</span>
                  <span className={styles.requestCardValue}>{formatDate(request.createdAt)}</span>
                </div>
                <div className={styles.requestCardField}>
                  <span className={styles.requestCardLabel}>Service progress</span>
                  <span className={styles.requestCardValue}>{formatServiceProgressRange(request)}</span>
                </div>
              </div>

              <div className={styles.requestCardStatusRow}>
                <StatusBadge status={request.status} />
                <StatusBadge status={request.standalone_page_status} />
              </div>

              <div className={styles.requestCardActions}>
                <div className={styles.requestCardActionRow}>
                  <button
                    type="button"
                    className={styles.viewBtn}
                    onClick={() => setMailTarget(request)}
                    aria-label="Send vendor mail"
                    title="Send mail to vendors"
                  >
                    <MailOutlineIcon fontSize="small" />
                  </button>
                  <RequestActionsMenu
                    request={request}
                    isSubmitting={isSubmitting}
                    onAddQuote={setQuotationTarget}
                    onViewQuotes={openQuotations}
                    onAddInvoice={setInvoiceTarget}
                    onViewInvoices={openInvoices}
                    onViewActivity={openActivity}
                    onPartnerNotes={openPartnerNotes}
                    onStatusSelect={handleStatusSelect}
                    onStandaloneStatusSelect={handleStandaloneStatusSelect}
                  />
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.paginationWrap}>
          <Pagenation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      )}

      {viewRequest && (
        <div className={modalStyles.modalOverlay} onClick={() => setViewRequest(null)}>
          <div className={styles.viewModal} onClick={(e) => e.stopPropagation()}>
            <h3 className={modalStyles.modalTitle}>CAD Service Request</h3>
            <p className={modalStyles.modalDescription}>
              Submitted {formatDate(viewRequest.createdAt)}
              {viewRequest.reviewed_at ? ` · Reviewed ${formatDate(viewRequest.reviewed_at)}` : ''}
            </p>
            <div className={styles.detailGrid}>
              <DetailRow label="Full name" value={viewRequest.full_name} />
              <DetailRow label="Email" value={viewRequest.email} />
              <DetailRow label="Phone" value={viewRequest.phone_number} />
              <DetailRow label="Company" value={viewRequest.company_name} />
              <DetailRow
                label="What do you need"
                value={SERVICE_LABELS[viewRequest.what_do_you_need] || viewRequest.what_do_you_need}
              />
              <DetailRow label="Timeline" value={viewRequest.model_use} />
              <DetailRow label="Budget" value={viewRequest.budget} />
              <DetailRow label="Software preference" value={viewRequest.software_format} />
              <DetailRow label="Requirement" value={viewRequest.requirement} />
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Reference files</span>
                {getReferenceFiles(viewRequest).length ? (
                  <div className={styles.referenceManageList}>
                    {getReferenceFiles(viewRequest).map((url, index) => (
                      <div key={url} className={styles.referenceManageRow}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.detailLink}
                        >
                          {getReferenceFiles(viewRequest).length === 1
                            ? 'Download reference file'
                            : `Download file ${index + 1}`}
                        </a>
                        <button
                          type="button"
                          className={styles.referenceRemoveBtn}
                          onClick={() => handleRemoveViewReferenceFile(url)}
                          disabled={
                            isManagingReferenceFiles
                            || Boolean(removingReferenceFileUrl)
                            || getReferenceFiles(viewRequest).length <= 1
                          }
                          title={
                            getReferenceFiles(viewRequest).length <= 1
                              ? 'At least one reference file is required'
                              : 'Remove file'
                          }
                        >
                          {removingReferenceFileUrl === url ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className={styles.detailValue}>No reference files</span>
                )}
                <div className={styles.referenceManageActions}>
                  <input
                    ref={viewReferenceFileInputRef}
                    type="file"
                    className={styles.hiddenFileInput}
                    onChange={handleAddViewReferenceFile}
                    disabled={isManagingReferenceFiles || Boolean(removingReferenceFileUrl)}
                  />
                  <button
                    type="button"
                    className={styles.referenceAddBtn}
                    onClick={() => viewReferenceFileInputRef.current?.click()}
                    disabled={isManagingReferenceFiles || Boolean(removingReferenceFileUrl)}
                  >
                    {isManagingReferenceFiles ? 'Uploading...' : 'Add file'}
                  </button>
                </div>
              </div>
              <div className={styles.progressForm}>
                <div>
                  <h4 className={styles.progressTitle}>Service progress</h4>
                  <p className={styles.progressHint}>
                    Record when work started and ended for this request.
                  </p>
                </div>
                <div className={styles.progressFields}>
                  <label className={styles.progressField}>
                    <span className={styles.detailLabel}>Started</span>
                    <input
                      type="date"
                      className={styles.progressInput}
                      value={progressStartedAt}
                      onChange={(event) => setProgressStartedAt(event.target.value)}
                      disabled={isSavingProgress}
                    />
                  </label>
                  <label className={styles.progressField}>
                    <span className={styles.detailLabel}>Ended</span>
                    <input
                      type="date"
                      className={styles.progressInput}
                      value={progressEndedAt}
                      min={progressStartedAt || undefined}
                      onChange={(event) => setProgressEndedAt(event.target.value)}
                      disabled={isSavingProgress}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  className={styles.progressSaveBtn}
                  onClick={handleSaveServiceProgress}
                  disabled={isSavingProgress}
                >
                  {isSavingProgress ? 'Saving...' : 'Save progress dates'}
                </button>
              </div>
              <DetailRow label="Status" value={getCadServiceStatusLabel(viewRequest.status)} />
              <DetailRow
                label="Partner page status"
                value={getCadServiceStatusLabel(viewRequest.standalone_page_status)}
              />
              <DetailRow
                label="Partner page"
                value={getCadPartnerPagePath(viewRequest._id)}
                isLink
                linkLabel="Open partner page"
              />
              {viewRequest.rejected_message ? (
                <DetailRow label="Rejection reason" value={viewRequest.rejected_message} />
              ) : null}
            </div>
            <div className={modalStyles.modalActions}>
              <a
                href={getCadPartnerPagePath(viewRequest._id)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${modalStyles.button} ${modalStyles.cancel}`}
              >
                Open partner page
              </a>
              <button
                type="button"
                className={`${modalStyles.button} ${modalStyles.cancel}`}
                onClick={() => setViewRequest(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {mailTarget && (
        <CadVendorMailPopup
          request={mailTarget}
          onClose={() => setMailTarget(null)}
          onSent={() => fetchRequests(currentPage, searchTerm, statusFilter)}
          onFileUpdated={(updatedRequest) => {
            if (updatedRequest) {
              setRequests((current) =>
                current.map((item) =>
                  item._id === updatedRequest._id ? { ...item, ...updatedRequest } : item
                )
              )
              setViewRequest((current) =>
                current && current._id === updatedRequest._id
                  ? { ...current, ...updatedRequest }
                  : current
              )
            }
            fetchRequests(currentPage, searchTerm, statusFilter)
          }}
        />
      )}

      {quotationTarget && (
        <AddQuotationPopup
          request={quotationTarget}
          onClose={() => setQuotationTarget(null)}
          onSaved={() => fetchRequests(currentPage, searchTerm, statusFilter)}
        />
      )}

      {invoiceTarget && (
        <AddInvoicePopup
          request={invoiceTarget}
          onClose={() => setInvoiceTarget(null)}
          onSaved={() => fetchRequests(currentPage, searchTerm, statusFilter)}
        />
      )}

      {quotesTarget && (
        <div className={modalStyles.modalOverlay} onClick={() => !quotesLoading && setQuotesTarget(null)}>
          <div className={styles.viewModal} onClick={(e) => e.stopPropagation()}>
            <h3 className={modalStyles.modalTitle}>Quotations</h3>
            <p className={modalStyles.modalDescription}>
              {quotesTarget.request?.full_name || quotesTarget.request?.email || 'Request'}
              {quotesTarget.quotations?.length
                ? ` · ${quotesTarget.quotations.length} quotation${quotesTarget.quotations.length === 1 ? '' : 's'}`
                : ''}
            </p>
            {quotesLoading ? (
              <div className={styles.logsLoading}>
                <Loading />
              </div>
            ) : (
              <QuotationHistoryList quotations={quotesTarget.quotations} />
            )}
            <div className={modalStyles.modalActions}>
              <button
                type="button"
                className={`${modalStyles.button} ${modalStyles.cancel}`}
                onClick={() => setQuotesTarget(null)}
                disabled={quotesLoading}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {invoicesTarget && (
        <div className={modalStyles.modalOverlay} onClick={() => !invoicesLoading && setInvoicesTarget(null)}>
          <div className={styles.viewModal} onClick={(e) => e.stopPropagation()}>
            <h3 className={modalStyles.modalTitle}>Invoices</h3>
            <p className={modalStyles.modalDescription}>
              {invoicesTarget.request?.full_name || invoicesTarget.request?.email || 'Request'}
              {invoicesTarget.invoices?.length
                ? ` · ${invoicesTarget.invoices.length} invoice${invoicesTarget.invoices.length === 1 ? '' : 's'}`
                : ''}
            </p>
            {invoicesLoading ? (
              <div className={styles.logsLoading}>
                <Loading />
              </div>
            ) : (
              <InvoiceHistoryList invoices={invoicesTarget.invoices} />
            )}
            <div className={modalStyles.modalActions}>
              <button
                type="button"
                className={`${modalStyles.button} ${modalStyles.cancel}`}
                onClick={() => setInvoicesTarget(null)}
                disabled={invoicesLoading}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {activityTarget && (
        <div
          className={modalStyles.modalOverlay}
          onClick={() => !activityLoading && !noteSaving && setActivityTarget(null)}
        >
          <div className={styles.viewModal} onClick={(event) => event.stopPropagation()}>
            <h3 className={modalStyles.modalTitle}>Activity logs</h3>
            <p className={modalStyles.modalDescription}>
              {activityTarget.request?.full_name || activityTarget.request?.email || 'Request'}
              {activityTarget.activities?.length
                ? ` · ${activityTarget.activities.length} event${activityTarget.activities.length === 1 ? '' : 's'}`
                : ''}
            </p>
            <div className={styles.noteComposer}>
              <label className={styles.noteLabel} htmlFor="cad-request-note">
                Add comment / note
              </label>
              <textarea
                id="cad-request-note"
                className={modalStyles.textarea}
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                placeholder="Write an internal note about this request..."
                maxLength={2000}
                rows={3}
                disabled={noteSaving}
              />
              <div className={styles.noteUploadRow}>
                <button
                  type="button"
                  className={styles.noteUploadBtn}
                  onClick={() => noteFileInputRef.current?.click()}
                  disabled={noteSaving}
                >
                  Add files
                </button>
                <span className={styles.noteUploadHint}>
                  Multiple files supported · PDF, images, docs, or any type
                </span>
                <input
                  ref={noteFileInputRef}
                  type="file"
                  multiple
                  className={styles.noteHiddenInput}
                  onChange={handleNoteFilesSelected}
                  disabled={noteSaving}
                />
              </div>
              {notePendingFiles.length > 0 ? (
                <ul className={styles.noteFileList}>
                  {notePendingFiles.map((file, index) => (
                    <li
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      className={styles.noteFileItem}
                    >
                      <InsertDriveFileOutlinedIcon fontSize="small" />
                      <div className={styles.noteFileMeta}>
                        <span className={styles.noteFileName}>{file.name}</span>
                        <span className={styles.noteFileSize}>
                          {formatNoteFileSize(file.size)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={styles.noteRemoveFileBtn}
                        onClick={() => removeNotePendingFile(index)}
                        disabled={noteSaving}
                        aria-label={`Remove ${file.name}`}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className={styles.noteFooter}>
                <span className={modalStyles.characterCount}>
                  {noteText.length}/2000
                  {notePendingFiles.length
                    ? ` · ${notePendingFiles.length} file${notePendingFiles.length === 1 ? '' : 's'}`
                    : ''}
                </span>
                <button
                  type="button"
                  className={`${modalStyles.button} ${styles.addNoteBtn}`}
                  onClick={handleAddNote}
                  disabled={
                    noteSaving || (!noteText.trim() && notePendingFiles.length === 0)
                  }
                >
                  {noteSaving ? (noteUploadProgress || 'Adding...') : 'Add note'}
                </button>
              </div>
            </div>
            {activityLoading ? (
              <div className={styles.logsLoading}>
                <Loading />
              </div>
            ) : (
              <ActivityTimeline activities={activityTarget.activities} />
            )}
            <div className={modalStyles.modalActions}>
              <button
                type="button"
                className={`${modalStyles.button} ${modalStyles.cancel}`}
                onClick={() => {
                  setActivityTarget(null)
                  setNoteText('')
                  setNotePendingFiles([])
                  setNoteUploadProgress('')
                }}
                disabled={activityLoading || noteSaving}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {partnerNotesTarget && (
        <div
          className={modalStyles.modalOverlay}
          onClick={() =>
            !partnerNotesLoading && !partnerNoteSaving && setPartnerNotesTarget(null)
          }
        >
          <div className={styles.viewModal} onClick={(event) => event.stopPropagation()}>
            <h3 className={modalStyles.modalTitle}>Partner page notes</h3>
            <p className={modalStyles.modalDescription}>
              Visible on the vendor partner page for{' '}
              {partnerNotesTarget.request?.full_name ||
                partnerNotesTarget.request?.email ||
                'this request'}
              . Separate from internal activity notes.
            </p>
            <div className={styles.noteComposer}>
              <label className={styles.noteLabel} htmlFor="cad-partner-note">
                Add partner page note
              </label>
              <textarea
                id="cad-partner-note"
                className={modalStyles.textarea}
                value={partnerNoteText}
                onChange={(event) => setPartnerNoteText(event.target.value)}
                placeholder="Write a note vendors will see on the partner page..."
                maxLength={2000}
                rows={3}
                disabled={partnerNoteSaving}
              />
              <div className={styles.noteFooter}>
                <span className={modalStyles.characterCount}>
                  {partnerNoteText.length}/2000
                </span>
                <button
                  type="button"
                  className={`${modalStyles.button} ${styles.addNoteBtn}`}
                  onClick={handleAddPartnerNote}
                  disabled={partnerNoteSaving || !partnerNoteText.trim()}
                >
                  {partnerNoteSaving ? 'Adding...' : 'Add note'}
                </button>
              </div>
            </div>
            {partnerNotesLoading ? (
              <div className={styles.logsLoading}>
                <Loading />
              </div>
            ) : (partnerNotesTarget.notes || []).length === 0 ? (
              <p className={styles.logsEmptyText}>No partner page notes yet.</p>
            ) : (
              <div className={styles.activityTimeline}>
                {(partnerNotesTarget.notes || []).map((note) => (
                  <div key={note._id} className={styles.activityItem}>
                    <span className={styles.activityDot} />
                    <div className={styles.activityCard}>
                      <div className={styles.activityHeader}>
                        <div className={styles.activityTitleRow}>
                          <span className={styles.activityType}>Note</span>
                          <strong>Partner page</strong>
                        </div>
                        <span className={styles.activityDate}>
                          {note.createdAt ? formatDate(note.createdAt) : ''}
                        </span>
                      </div>
                      <p className={styles.activityDescription}>{note.note}</p>
                      <p className={styles.activityMeta}>
                        By {note.actor_admin_email || 'Admin'}
                      </p>
                      <button
                        type="button"
                        className={styles.noteRemoveFileBtn}
                        onClick={() => handleDeletePartnerNote(note._id)}
                        aria-label="Delete partner note"
                        title="Delete note"
                        style={{ marginTop: 8 }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className={modalStyles.modalActions}>
              <button
                type="button"
                className={`${modalStyles.button} ${modalStyles.cancel}`}
                onClick={() => {
                  setPartnerNotesTarget(null)
                  setPartnerNoteText('')
                }}
                disabled={partnerNotesLoading || partnerNoteSaving}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {logsTarget && (
        <div className={modalStyles.modalOverlay} onClick={() => !logsLoading && setLogsTarget(null)}>
          <div className={styles.viewModal} onClick={(e) => e.stopPropagation()}>
            <h3 className={modalStyles.modalTitle}>Mail logs</h3>
            <p className={modalStyles.modalDescription}>
              {logsTarget.request?.full_name || logsTarget.request?.email || 'Request'}
              {logsTarget.logs?.length
                ? ` · Sent ${logsTarget.logs.length} time${logsTarget.logs.length === 1 ? '' : 's'}`
                : ''}
            </p>
            {logsLoading ? (
              <div className={styles.logsLoading}>
                <Loading />
              </div>
            ) : (
              <VendorMailHistory
                logs={logsTarget.logs}
                title="Sent mail history"
                showTitle={false}
              />
            )}
            <div className={modalStyles.modalActions}>
              <button
                type="button"
                className={`${modalStyles.button} ${modalStyles.cancel}`}
                onClick={() => setLogsTarget(null)}
                disabled={logsLoading}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectTarget && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modal}>
            <h3 className={modalStyles.modalTitle}>Reject CAD Service Request</h3>
            <p className={modalStyles.modalDescription}>
              Rejecting request from <strong>{rejectTarget.full_name || rejectTarget.email}</strong>.
              Please provide a reason for the rejection.
            </p>
            <textarea
              className={modalStyles.textarea}
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              maxLength={500}
            />
            <div className={modalStyles.characterCount}>
              {rejectionMessage.length}/500
            </div>
            <div className={modalStyles.modalActions}>
              <button
                type="button"
                className={`${modalStyles.button} ${modalStyles.cancel}`}
                onClick={() => {
                  setRejectTarget(null)
                  setRejectionMessage('')
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${modalStyles.button} ${modalStyles.reject}`}
                onClick={handleRejectSubmit}
                disabled={isSubmitting || !rejectionMessage.trim()}
              >
                {isSubmitting ? 'Rejecting...' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CadServiceRequestsTable
