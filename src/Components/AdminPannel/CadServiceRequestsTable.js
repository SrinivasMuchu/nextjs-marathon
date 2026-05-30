"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import SearchIcon from '@mui/icons-material/Search'
import { BASE_URL } from '@/config'
import { formatDate } from '@/common.helper'
import Pagenation from '@/Components/CommonJsx/Pagenation'
import Loading from '../CommonJsx/Loaders/Loading'
import styles from './AdminPannel.module.css'
import modalStyles from '../CommonJsx/AdminApprovalButtons.module.css'

const SERVICE_LABELS = {
  modeling: '3D Modeling',
  drafting: '2D Drafting',
  rendering: 'Rendering',
  conversion: 'File Conversion',
  'reverse-engineering': 'Reverse Engineering',
  other: 'Other',
}

function normalizeStatus(status) {
  return status || 'pending'
}

function isPendingStatus(status) {
  const normalized = normalizeStatus(status)
  return normalized === 'pending'
}

function statusBadge(status) {
  const base = styles.badge
  const normalized = normalizeStatus(status)
  if (normalized === 'approved') return `${base} ${styles.badgeSuccess}`
  if (normalized === 'pending') return `${base} ${styles.badgeWarn}`
  if (normalized === 'rejected') return `${base} ${styles.badgeDanger}`
  return `${base} ${styles.badgeInfo}`
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

function CadServiceRequestsTable() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [viewRequest, setViewRequest] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejectionMessage, setRejectionMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const adminHeaders = () => ({
    'admin-uuid': localStorage.getItem('admin-uuid'),
  })

  const fetchRequests = async (page = 1, q = '', action = 'pending') => {
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
      setTotal(respData.total || 0)
      if (respData.page && respData.page !== page) {
        setCurrentPage(respData.page)
      }
    } catch (error) {
      console.error('Error fetching CAD service requests:', error)
      setRequests([])
      setTotalPages(1)
      setTotal(0)
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

  const handleStatusUpdate = async (requestId, action, message = '') => {
    setIsSubmitting(true)
    try {
      const payload = { request_id: requestId, action }
      if (action === 'reject') payload.rejected_message = message

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

  const handleRejectSubmit = () => {
    if (!rejectionMessage.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    handleStatusUpdate(rejectTarget._id, 'reject', rejectionMessage.trim())
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

  const renderActions = (request) => {
    const isPending = isPendingStatus(request.status)
    return (
      <div className={styles.actionCell}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => openView(request)}
        >
          View
        </button>
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.actionApprove}`}
          disabled={!isPending || isSubmitting}
          onClick={() => handleStatusUpdate(request._id, 'approve')}
        >
          Approve
        </button>
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.actionReject}`}
          disabled={!isPending || isSubmitting}
          onClick={() => {
            setRejectTarget(request)
            setRejectionMessage('')
          }}
        >
          Reject
        </button>
      </div>
    )
  }

  return (
    <>
      <div className={styles.searchContainer}>
        <div className={styles.filterContainer}>
          <div className={styles.filterButtons}>
            {['all', 'pending', 'approved', 'rejected'].map((filter) => (
              <button
                key={filter}
                type="button"
                className={`${styles.filterBtn} ${statusFilter === filter ? styles.filterBtnActive : ''}`}
                onClick={() => handleFilterChange(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles['search-container']}>
            <SearchIcon className={styles['search-icon']} />
            <input
              type="text"
              placeholder="Search name, email, company..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles['search-input']}
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

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Service</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>
                  <Loading />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>
                    No CAD service requests found
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request._id} className={styles.row}>
                    <td>{request.full_name || '—'}</td>
                    <td>{request.email || '—'}</td>
                    <td>
                      {SERVICE_LABELS[request.what_do_you_need] || request.what_do_you_need || '—'}
                    </td>
                    <td>
                      <span className={statusBadge(request.status)}>
                        {normalizeStatus(request.status).charAt(0).toUpperCase() + normalizeStatus(request.status).slice(1)}
                      </span>
                    </td>
                    <td>{formatDate(request.createdAt)}</td>
                    <td>{renderActions(request)}</td>
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 16 }}>
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
              <DetailRow label="Status" value={viewRequest.status} />
              {viewRequest.rejected_message ? (
                <DetailRow label="Rejection reason" value={viewRequest.rejected_message} />
              ) : null}
            </div>
            {isPendingStatus(viewRequest.status) && (
              <div className={styles.viewModalActions}>
                <button
                  type="button"
                  className={`${modalStyles.button} ${modalStyles.approve}`}
                  disabled={isSubmitting}
                  onClick={() => handleStatusUpdate(viewRequest._id, 'approve')}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className={`${modalStyles.button} ${modalStyles.reject}`}
                  disabled={isSubmitting}
                  onClick={() => {
                    setRejectTarget(viewRequest)
                    setViewRequest(null)
                  }}
                >
                  Reject
                </button>
              </div>
            )}
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
    </>
  )
}

export default CadServiceRequestsTable
