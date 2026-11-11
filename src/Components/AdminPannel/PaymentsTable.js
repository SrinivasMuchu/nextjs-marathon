"use client"
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import axios from 'axios'
import { BASE_URL } from '@/config'
import styles from './AdminPannel.module.css'
import { formatDate } from '@/common.helper'
import Pagenation from '@/Components/CommonJsx/Pagenation'
import Loading from '../CommonJsx/Loaders/Loading'
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast } from 'react-toastify'

function formatPaymentAmount(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return '—'
  return `$${value.toFixed(2)}`
}

function canPerformActions(status) {
  const statusCode = status?.toLowerCase?.() || status
  
  // Allow actions for statuses that can be changed
  const actionableStatuses = [
    'pending_payment',
    'payment_received', 
    'on_hold',
    'failed',
    'pending',
    null,
    undefined,
    false,
    'false'
  ]
  
  return actionableStatuses.includes(statusCode)
}

function PaymentActions({ canAct, submittingAction, onApprove, onReject }) {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState(null)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const busy = Boolean(submittingAction)

  useEffect(() => {
    if (!open) return undefined
    const close = (event) => {
      const target = event.target
      if (
        target instanceof Node &&
        (buttonRef.current?.contains(target) || menuRef.current?.contains(target))
      ) {
        return
      }
      setOpen(false)
    }
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  const toggle = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    setMenuPos({
      top: rect.bottom + 6,
      left: Math.max(8, rect.right - 148),
    })
    setOpen((current) => !current)
  }

  const menu = open && menuPos
    ? createPortal(
        <div
          ref={menuRef}
          className={styles.actionMenu}
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          <button
            type="button"
            className={styles.actionApprove}
            onClick={() => {
              setOpen(false)
              onApprove()
            }}
            disabled={busy || !canAct}
          >
            {submittingAction === 'approve' ? 'Approving…' : 'Approve'}
          </button>
          <button
            type="button"
            className={styles.actionReject}
            onClick={() => {
              setOpen(false)
              onReject()
            }}
            disabled={busy || !canAct}
          >
            {submittingAction === 'reject' ? 'Rejecting…' : 'Reject'}
          </button>
        </div>,
        document.body,
      )
    : null

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.menuBtn}
        onClick={toggle}
        aria-label="Payment actions"
        aria-expanded={open}
        disabled={busy}
      >
        <MoreVertIcon fontSize="small" />
      </button>
      {menu}
    </>
  )
}

function PaymentsTable() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState({})

  // pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // search state
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // filter state
  const [statusFilter, setStatusFilter] = useState('pending_payment')

  // popup state
  const [showApprovePopup, setShowApprovePopup] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState('')
  const [payoutId, setPayoutId] = useState('')
  const [payoutIdError, setPayoutIdError] = useState('')

  useEffect(() => {
    fetchPayments(currentPage, searchTerm, statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, statusFilter]) 

  const fetchPayments = async (page = 1, q = '', status = 'pending_payment') => {
    setLoading(true)
    try {
      // Prepare params object
      const params = { page, limit, q };
      
      // Only add status param if it's not 'all'
      if (status !== 'all') {
        params.status = status;
      }

      const response = await axios.get(`${BASE_URL}/v1/admin-pannel/get-transactions`, {
        params,
        headers: { 'admin-uuid': localStorage.getItem('admin-uuid') }
      })

      const respData = response?.data?.data || {}
      const transactions = respData.transactions || []
      setPayments(transactions)
      setTotalPages(respData.totalPages || 1)
      setTotal(respData.total || 0)
      
      if (respData.page && respData.page !== page) {
        setCurrentPage(respData.page)
      }

      console.log('Payments response:', transactions, { 
        page: respData.page, 
        total: respData.total, 
        totalPages: respData.totalPages 
      })
    } catch (e) {
      console.error('Failed to fetch payments:', e)
      setPayments([])
      setTotalPages(1)
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchTerm(searchInput.trim())
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleFilterChange = (filter) => {
    setStatusFilter(filter)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleApproveClick = (transactionId) => {
    setSelectedTransactionId(transactionId)
    setShowApprovePopup(true)
    setPayoutId('')
    setPayoutIdError('')
  }

  const handleCloseApprovePopup = () => {
    setShowApprovePopup(false)
    setSelectedTransactionId('')
    setPayoutId('')
    setPayoutIdError('')
  }

  const handleApproveWithPayoutId = async () => {
    // Validate payout ID
    if (!payoutId.trim()) {
      setPayoutIdError('Payout ID is required')
      return
    }

    try {
      setSubmitting(prev => ({ ...prev, [selectedTransactionId]: 'approve' }))
      
      const response = await axios.post(`${BASE_URL}/v1/admin-pannel/approve-transaction`, {
        action: 'approve',
        status_code: 'transferred',
        transactionId: selectedTransactionId,
        payoutId: payoutId.trim()
      }, { headers: { 'admin-uuid': localStorage.getItem('admin-uuid') } });
      
      if(response.data.meta.success){
        toast.success(response.data.meta.message)
        fetchPayments(currentPage, searchTerm, statusFilter)
        handleCloseApprovePopup()
      } else {
        toast.error(response.data.meta.message)
      }
     
    } catch (error) {
      console.log('Error handling approve action:', error);
      toast.error('Failed to approve transaction')
    } finally {
      setSubmitting(prev => {
        const next = { ...prev }
        delete next[selectedTransactionId]
        return next
      })
    }
  }

  const handleActions = async(action, id) => {
      try {
        setSubmitting(prev => ({ ...prev, [id]: action }))
        
        const response = await axios.post(`${BASE_URL}/v1/admin-pannel/approve-transaction`, {
          action: action,
          transactionId: id
        }, { headers: { 'admin-uuid': localStorage.getItem('admin-uuid') } });
        
        if(response.data.meta.success){
          toast.success(response.data.meta.message)
          fetchPayments(currentPage, searchTerm, statusFilter)
        } else {
          toast.error(response.data.meta.message)
        }
       
      } catch (error) {
        console.log('Error handling action:', error);
        toast.error('Failed to perform action')
      } finally {
        setSubmitting(prev => {
          const next = { ...prev }
          delete next[id]
          return next
        })
      }
    }

  return (
    <>
      {/* Approve with Payout ID Popup */}
      {showApprovePopup && (
        <div className={styles.loginOverlay}>
          <div className={styles.loginPopup}>
            <h2>Approve Transaction</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleApproveWithPayoutId(); }}>
              <div className={styles.formGroup}>
                <label htmlFor="payoutId">Payout ID</label>
                <input
                  type="text"
                  id="payoutId"
                  value={payoutId}
                  onChange={(e) => {
                    setPayoutId(e.target.value)
                    setPayoutIdError('')
                  }}
                  placeholder="Enter payout ID"
                  required
                />
                {payoutIdError && (
                  <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                    {payoutIdError}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={submitting[selectedTransactionId] === 'approve'}
                  style={{ flex: 1 }}
                >
                  {submitting[selectedTransactionId] === 'approve' ? 'Approving...' : 'Approve'}
                </button>
                <button 
                  type="button" 
                  onClick={handleCloseApprovePopup}
                  className={styles.submitBtn}
                  style={{
                    flex: 1,
                    background: '#6b7280',
                    border: 'none'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.searchContainer}>
        {/* Filter buttons */}  
        <div className={styles.filterContainer}>
          <div className={styles.filterButtons}>
            {['all', 'pending_payment', 'rejected', 'transferred', 'failed'].map((filter) => (
              <button
                key={filter}
                type="button"
                className={`${styles.filterBtn} ${statusFilter === filter ? styles.filterBtnActive : ''}`}
                onClick={() => handleFilterChange(filter)}
              >
                {filter === 'pending_payment' ? 'Pending Payment' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

       <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles["search-container"]}>
             <SearchIcon className={styles["search-icon"]} />
              <input
            type="text"
            placeholder="Search ..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={styles["search-input"]}
          />
          </div>

          
          
          <button type="submit" className={styles.searchBtn}>
            Search
          </button>
          {searchTerm && (
            <button type="button" onClick={handleClearSearch} className={styles.clearBtn}>
              Clear
            </button>
          )}
        </form>
        {searchTerm && (
          <p className={styles.searchInfo}>
            Showing results for &quot;{searchTerm}&quot; ({total} found)
          </p>
        )}
      </div>

      {loading ? (
        <div className={styles.loadingWrap}>
          <Loading />
        </div>
      ) : (
        <>
      <div className={`${styles.tableWrap} ${styles.desktopTable}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Razorpay ID</th>
              <th>Conversion</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 20 }}>
                    {searchTerm ? 'No payments found for your search' : 'No payments found'}
                  </td>
                </tr>
              ) : (
                payments.map(p => {
                  const id = p._id
                  const isSubmitting = Boolean(submitting[id])
                  const canAct = canPerformActions(p.transfered_to_publisher)
                  
                  return (
                    <tr key={id} className={styles.row}>
                      <td>{p._id}</td>
                      <td>{p.user_email || '—'}</td>
                      <td>{p.razorpay_order_id}</td>
                      <td>{formatPaymentAmount(p.amount)}</td>
                      <td>{p.razorpay_payment_id}</td>
                      <td>{p.conversion || '—'}</td>
                      <td>{formatDate(p.createdAt)}</td>
                      <td>
                        <PaymentActions
                          canAct={canAct}
                          submittingAction={isSubmitting ? submitting[id] : ''}
                          onApprove={() => handleApproveClick(id)}
                          onReject={() => handleActions('reject', id)}
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
        </table>
      </div>

      <div className={styles.mobileCards}>
        {payments.length === 0 ? (
          <div className={styles.mobileEmpty}>
            {searchTerm ? 'No payments found for your search' : 'No payments found'}
          </div>
        ) : (
          payments.map((p) => {
            const id = p._id
            const isSubmitting = Boolean(submitting[id])
            const canAct = canPerformActions(p.transfered_to_publisher)
            return (
              <div key={id} className={styles.mobileCard}>
                <div className={styles.mobileCardHeader}>
                  <h3 className={styles.mobileCardTitle}>{p.conversion || 'Payment'}</h3>
                  <div className={styles.mobileCardAsideRow}>
                    <span className={styles.mobileCardAside}>{formatPaymentAmount(p.amount)}</span>
                    <PaymentActions
                      canAct={canAct}
                      submittingAction={isSubmitting ? submitting[id] : ''}
                      onApprove={() => handleApproveClick(id)}
                      onReject={() => handleActions('reject', id)}
                    />
                  </div>
                </div>
                <div className={styles.mobileCardBody}>
                  <div className={styles.mobileCardField}>
                    <span className={styles.mobileCardLabel}>Email</span>
                    <span className={styles.mobileCardValue}>{p.user_email || '—'}</span>
                  </div>
                  <div className={styles.mobileCardField}>
                    <span className={styles.mobileCardLabel}>Order ID</span>
                    <span className={styles.mobileCardValue}>{p.razorpay_order_id || '—'}</span>
                  </div>
                  <div className={styles.mobileCardField}>
                    <span className={styles.mobileCardLabel}>Razorpay ID</span>
                    <span className={styles.mobileCardValue}>{p.razorpay_payment_id || '—'}</span>
                  </div>
                  <div className={styles.mobileCardMeta}>
                    <span className={styles.mobileCardDate}>Date: {formatDate(p.createdAt)}</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
        </>
      )}
      
      <div className={styles.paginationWrap}>
        {totalPages > 1 && (
          <Pagenation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </>
  )
}

export default PaymentsTable