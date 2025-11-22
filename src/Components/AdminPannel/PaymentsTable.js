"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '@/config'
import styles from './AdminPannel.module.css'
import { formatDate } from '@/common.helper'
import Pagenation from '@/Components/CommonJsx/Pagenation'
import Loading from '../CommonJsx/Loaders/Loading'
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-toastify'

// Transfer status definitions
const TRANSFER_STATUS_DEFINITIONS = Object.freeze([
    { code: 'pending_payment', label: 'Pending Payment', meaning: 'Buyer payment not confirmed' },
    { code: 'payment_received', label: 'Payment Received', meaning: 'Buyer payment confirmed' },
    { code: 'on_hold', label: 'On Hold / Under Review', meaning: 'Fraud/KYC verification' },
    { code: 'scheduled', label: 'Scheduled for Payout', meaning: 'Added to upcoming payout' },
    { code: 'processing_payout', label: 'Processing Payout', meaning: 'Transfer in progress' },
    { code: 'transferred', label: 'Transferred', meaning: 'Payout successfully sent' },
    { code: 'failed', label: 'Failed', meaning: 'Payout failed; retry needed' },
    { code: 'refunded', label: 'Refunded', meaning: 'Buyer refund / reversal' },
]);

function statusBadge(status) {
  const base = styles.badge
  const statusCode = status?.toLowerCase?.() || status
  
  switch (statusCode) {
    case 'transferred':
    case 'payment_received':
    case 'scheduled':
    case 'approved':
    case true:
    case 'true':
      return `${base} ${styles.badgeSuccess}`
    
    case 'pending_payment':
    case 'on_hold':
    case 'processing_payout':
    case 'pending':
      return `${base} ${styles.badgeWarn}`
    
    case 'failed':
    case 'refunded':
    case 'rejected':
    case 'reject':
      return `${base} ${styles.badgeDanger}`
    
    default:
      return `${base} ${styles.badgeWarn}`
  }
}

// Helper function to get display text for status
function getStatusDisplayText(status) {
  const statusCode = status?.toLowerCase?.() || status
  const statusDef = TRANSFER_STATUS_DEFINITIONS.find(s => s.code === statusCode)
  
  if (statusDef) {
    return statusDef.label
  }
  
  // Legacy status handling
  if (statusCode === true || statusCode === 'true' || statusCode === 'approved') {
    return 'Approved'
  }
  if (statusCode === 'rejected' || statusCode === 'reject') {
    return 'Rejected'
  }
  if (statusCode === 'pending') {
    return 'Pending'
  }
  
  return status || 'Pending'
}

// Helper function to check if actions are allowed for a status
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

  const handleApprove = async (id) => {
    try {
      setSubmitting(prev => ({ ...prev, [id]: 'approve' }))
      // TODO: call approve endpoint
      // await axios.post(`${BASE_URL}/v1/admin-pannel/approve-transaction`, { id }, { headers: { 'admin-uuid': localStorage.getItem('admin-uuid') } })
      // optimistic update
      setPayments(prev => prev.map(p => p._id === id ? { ...p, transfered_to_publisher: true } : p))
    } catch (e) {
      console.error('Approve failed:', e)
    } finally {
      setSubmitting(prev => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
  }

  const handleReject = async (id) => {
    try {
      setSubmitting(prev => ({ ...prev, [id]: 'reject' }))
      // TODO: call reject endpoint
      // await axios.post(`${BASE_URL}/v1/admin-pannel/reject-transaction`, { id }, { headers: { 'admin-uuid': localStorage.getItem('admin-uuid') } })
    } catch (e) {
      console.error('Reject failed:', e)
    } finally {
      setSubmitting(prev => {
        const next = { ...prev }
        delete next[id]
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

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Razorpay ID</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center' }}>
              <Loading />
            </div>
          ) : (
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 20 }}>
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
                      <td>{p.razorpay_order_id}</td>
                      <td>${p.amount}</td>
                      <td>{p.razorpay_payment_id}</td>
                      <td><span className={statusBadge(p.transfered_to_publisher)}>{getStatusDisplayText(p.transfered_to_publisher)}</span></td>
                      <td>{formatDate(p.createdAt)}</td>
                      <td>
                        <div className={styles.actionCell}>
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.actionApprove}`}
                            onClick={() => handleActions('approve', p._id)}
                            disabled={isSubmitting || !canAct}
                          >
                            {submitting[id] === 'approve' ? 'Approving…' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.actionReject}`}
                            onClick={() => handleActions('reject', p._id)}
                            disabled={isSubmitting || !canAct}
                          >
                            {submitting[p._id] === 'reject' ? 'Rejecting…' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          )}
        </table>
      </div>
      
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
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