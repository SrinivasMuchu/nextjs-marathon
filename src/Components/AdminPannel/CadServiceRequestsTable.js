"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
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
import {
  addCadServiceNote,
  fetchCadServiceActivity,
  fetchCadServiceQuotations,
} from '@/api/adminVendorsApi'
import {
  CAD_SERVICE_STATUSES,
  getCadServiceStatusColor,
  getCadServiceStatusLabel,
  normalizeCadServiceStatus,
} from './cadServiceStatusConfig'

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

function DetailRow({ label, value, isLink }) {
  if (!value) return null
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      {isLink ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
          Download reference file
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
          <DetailRow label="Project type" value={log.content?.project_type} />
          <DetailRow label="Model use" value={log.content?.model_use} />
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
  vendor_mail_sent: 'Email',
  quotation_created: 'Quotation',
  note_added: 'Note',
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
              {activity.metadata?.attachment_count ? (
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
    { header: 'Model Use', key: 'model_use', width: 20 },
    { header: 'Software Format', key: 'software_format', width: 20 },
    { header: 'Requirement', key: 'requirement', width: 40 },
    { header: 'Reference File URL', key: 'file', width: 40 },
    { header: 'Status', key: 'status', width: 20 },
    { header: 'Rejection Reason', key: 'rejected_message', width: 30 },
    { header: 'Submitted At', key: 'createdAt', width: 18 },
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
      software_format: request.software_format || '',
      requirement: request.requirement || '',
      file: request.file || '',
      status: getCadServiceStatusLabel(request.status),
      rejected_message: request.rejected_message || '',
      createdAt: request.createdAt ? formatDate(request.createdAt) : '',
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
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejectionMessage, setRejectionMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [mailTarget, setMailTarget] = useState(null)
  const [quotationTarget, setQuotationTarget] = useState(null)
  const [quotesTarget, setQuotesTarget] = useState(null)
  const [quotesLoading, setQuotesLoading] = useState(false)
  const [activityTarget, setActivityTarget] = useState(null)
  const [activityLoading, setActivityLoading] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [noteSaving, setNoteSaving] = useState(false)
  const [logsTarget, setLogsTarget] = useState(null)
  const [logsLoading, setLogsLoading] = useState(false)

  const adminHeaders = () => ({
    'admin-uuid': localStorage.getItem('admin-uuid'),
  })

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

  const handleRejectSubmit = () => {
    if (!rejectionMessage.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    handleStatusUpdate(rejectTarget._id, 'rejected', rejectionMessage.trim())
  }

  const openView = async (request) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/v1/admin-pannel/get-cad-service-request/${request._id}`,
        { headers: adminHeaders() }
      )
      if (response.data?.meta?.success) {
        setViewRequest(response.data.data.request)
      } else {
        setViewRequest(request)
      }
    } catch {
      setViewRequest(request)
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

  const openActivity = async (request) => {
    setNoteText('')
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

  const handleAddNote = async () => {
    const trimmedNote = noteText.trim()
    if (!trimmedNote || !activityTarget?.request?._id) return

    setNoteSaving(true)
    try {
      const response = await addCadServiceNote(activityTarget.request._id, trimmedNote)
      if (!response?.meta?.success) {
        throw new Error(response?.meta?.message || 'Failed to add note')
      }

      setActivityTarget((current) => ({
        ...current,
        activities: [response.data.activity, ...(current?.activities || [])],
      }))
      setNoteText('')
      toast.success(response.meta.message || 'Note added')
      refreshList()
    } catch (error) {
      console.error('Error adding request note:', error)
      toast.error(error.response?.data?.meta?.message || error.message || 'Failed to add note')
    } finally {
      setNoteSaving(false)
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

      if (!rows.length) {
        toast.info('No requests to export')
        return
      }

      await exportRequestsToExcel(rows)
      toast.success(`Exported ${rows.length} request${rows.length === 1 ? '' : 's'}`)
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
                  <th>View</th>
                  <th>Send mail</th>
                  <th>Add quote</th>
                  <th>Quotations</th>
                  <th>Activity logs</th>
                  <th>Change status</th>
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan={11} className={styles.emptyCell}>
                      <Loading />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={11} className={styles.emptyCell}>
                        No CAD service requests found
                      </td>
                    </tr>
                  ) : (
                    requests.map((request) => {
                      const quotationCount = Number(request.quotation_count) || 0
                      const activityCount = Number(request.activity_count) || 0
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
                          <button
                            type="button"
                            className={styles.viewBtn}
                            onClick={() => openView(request)}
                            aria-label="View request"
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </button>
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
                          <button
                            type="button"
                            className={styles.viewBtn}
                            onClick={() => setQuotationTarget(request)}
                            aria-label="Add quotation"
                            title="Add quotation"
                          >
                            <RequestQuoteOutlinedIcon fontSize="small" />
                          </button>
                        </td>
                        <td>
                          {quotationCount > 0 ? (
                            <button
                              type="button"
                              className={styles.logsBtn}
                              onClick={() => openQuotations(request)}
                              aria-label={`View ${quotationCount} quotation${quotationCount === 1 ? '' : 's'}`}
                              title="View quotations"
                            >
                              {quotationCount} saved
                            </button>
                          ) : (
                            <span className={styles.logsEmpty}>—</span>
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.logsBtn}
                            onClick={() => openActivity(request)}
                            aria-label="View request activity"
                            title="View all activity"
                          >
                            {activityCount > 0 ? `${activityCount} events` : 'View'}
                          </button>
                        </td>
                        <td>
                          <RequestStatusSelect
                            request={request}
                            isSubmitting={isSubmitting}
                            onStatusSelect={handleStatusSelect}
                            className={styles.statusSelect}
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
                <button
                  type="button"
                  className={styles.viewBtn}
                  onClick={() => openView(request)}
                  aria-label="View request"
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </button>
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
              </div>

              <div className={styles.requestCardStatusRow}>
                <StatusBadge status={request.status} />
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
                  <button
                    type="button"
                    className={styles.viewBtn}
                    onClick={() => setQuotationTarget(request)}
                    aria-label="Add quotation"
                    title="Add quotation"
                  >
                    <RequestQuoteOutlinedIcon fontSize="small" />
                  </button>
                  {(Number(request.quotation_count) || 0) > 0 ? (
                    <button
                      type="button"
                      className={styles.logsBtn}
                      onClick={() => openQuotations(request)}
                      aria-label={`View ${request.quotation_count} quotation${Number(request.quotation_count) === 1 ? '' : 's'}`}
                      title="View quotations"
                    >
                      {request.quotation_count} saved
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className={styles.logsBtn}
                    onClick={() => openActivity(request)}
                    aria-label="View request activity"
                    title="View all activity"
                  >
                    {(Number(request.activity_count) || 0) > 0
                      ? `${request.activity_count} events`
                      : 'Activity'}
                  </button>
                </div>
                <span className={styles.requestCardLabel}>Change status</span>
                <RequestStatusSelect
                  request={request}
                  isSubmitting={isSubmitting}
                  onStatusSelect={handleStatusSelect}
                  className={styles.statusSelectMobile}
                />
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
              <DetailRow label="Model use" value={viewRequest.model_use} />
              <DetailRow label="Software preference" value={viewRequest.software_format} />
              <DetailRow label="Requirement" value={viewRequest.requirement} />
              <DetailRow label="Reference file" value={viewRequest.file} isLink={Boolean(viewRequest.file)} />
              <DetailRow label="Status" value={getCadServiceStatusLabel(viewRequest.status)} />
              {viewRequest.rejected_message ? (
                <DetailRow label="Rejection reason" value={viewRequest.rejected_message} />
              ) : null}
            </div>
            {Array.isArray(viewRequest.vendor_mails) && viewRequest.vendor_mails.length > 0 ? (
              <VendorMailHistory logs={viewRequest.vendor_mails} />
            ) : null}
            {Array.isArray(viewRequest.quotations) && viewRequest.quotations.length > 0 ? (
              <div className={styles.vendorMailHistory}>
                <h4 className={styles.vendorMailHistoryTitle}>Quotations</h4>
                <QuotationHistoryList quotations={viewRequest.quotations} />
              </div>
            ) : null}
            {Array.isArray(viewRequest.activity_logs) && viewRequest.activity_logs.length > 0 ? (
              <div className={styles.vendorMailHistory}>
                <h4 className={styles.vendorMailHistoryTitle}>Activity</h4>
                <ActivityTimeline activities={viewRequest.activity_logs} />
              </div>
            ) : null}
            <div className={modalStyles.modalActions}>
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
        />
      )}

      {quotationTarget && (
        <AddQuotationPopup
          request={quotationTarget}
          onClose={() => setQuotationTarget(null)}
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
              <div className={styles.noteFooter}>
                <span className={modalStyles.characterCount}>
                  {noteText.length}/2000
                </span>
                <button
                  type="button"
                  className={`${modalStyles.button} ${styles.addNoteBtn}`}
                  onClick={handleAddNote}
                  disabled={noteSaving || !noteText.trim()}
                >
                  {noteSaving ? 'Adding...' : 'Add note'}
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
                }}
                disabled={activityLoading || noteSaving}
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
