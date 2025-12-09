import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import styles from './Earnings.module.css'
import { BASE_URL } from '@/config';
import Pagenation from '../CommonJsx/Pagenation';
import Loading from '../CommonJsx/Loaders/Loading';
import Link from 'next/link';
// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const headers = [
  'Date',
  'File name',
  'Price',
  'Commission',
  'Net earning',
  'Payment State',
  'Actions',
];

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function netAmount(amount) {
  const netPrice = amount * 0.9;
  return `${netPrice.toFixed(2)}`;
}
function commission(amount) {
  const commissionAmount = amount * 0.1;
  return `${commissionAmount.toFixed(2)}(10%)`
}

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

// Helper function to get payment state styling and display text
function getPaymentStateInfo(transferredStatus) {
  const statusCode = transferredStatus?.toLowerCase?.() || transferredStatus;

  switch (statusCode) {
    case 'transferred':
      return { className: styles.stateOk, text: 'Transferred' };

    case 'payment_received':
    case 'scheduled':
      return { className: styles.stateOk, text: TRANSFER_STATUS_DEFINITIONS.find(s => s.code === statusCode)?.label || 'Approved' };

    case 'processing_payout':
      return { className: styles.stateInfo, text: 'Processing Payout' };

    case 'pending_payment':
    case 'on_hold':
      return { className: styles.stateInfo, text: TRANSFER_STATUS_DEFINITIONS.find(s => s.code === statusCode)?.label || 'Pending' };

    case 'failed':
    case 'refunded':
      return { className: styles.stateReject, text: TRANSFER_STATUS_DEFINITIONS.find(s => s.code === statusCode)?.label || 'Failed' };

    // Legacy support for boolean/string values
    case true:
    case 'true':
    case 'approved':
      return { className: styles.stateOk, text: 'Approved' };

    case 'rejected':
    case 'reject':
      return { className: styles.stateReject, text: 'Rejected' };

    default:
      return { className: styles.stateInfo, text: 'Pending' };
  }
}

function Earnings() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState({
    cadSold: 0,
    totalA: 0,
    commissionB: 0,
    commissionPct: 0,
    net: 0,
    transferred: 0,
    processing: 0,
  });
  const [earningRows, setEarningRows] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10,
    has_next_page: false,
    has_prev_page: false
  });

  // refs for date inputs
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // date range state (HTML date format: YYYY-MM-DD)
  const [range, setRange] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // Current month (0-indexed)

    // First day of current month
    const startOfMonth = new Date(year, month, 1);
    const startDate = startOfMonth.toISOString().split('T')[0];

    // Last day of current month
    const endOfMonth = new Date(year, month + 1, 0);
    const endDate = endOfMonth.toISOString().split('T')[0];

    return {
      from: startDate,
      to: endDate
    };
  });

  // Date validation state
  const [dateError, setDateError] = useState('');

  // Date validation function
  const validateDates = (startDate, endDate) => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setDateError('End date cannot be earlier than start date');
      return false;
    }
    setDateError('');
    return true;
  };

  // Handle start date change with auto-open end date
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setRange(r => {
      // Clear end date if it's before the new start date
      const newEndDate = r.to && new Date(r.to) < new Date(newStartDate) ? '' : r.to;
      return { ...r, from: newStartDate, to: newEndDate };
    });

    validateDates(newStartDate, range.to);

    // Automatically focus and open end date picker
    setTimeout(() => {
      if (endDateRef.current) {
        endDateRef.current.focus();
        // Try to open the date picker (modern browsers support showPicker())
        if (endDateRef.current.showPicker) {
          try {
            endDateRef.current.showPicker();
          } catch (e) {
            // showPicker() might fail in some browsers or contexts
            console.log('showPicker not supported or failed');
          }
        }
      }
    }, 100);
  };

  // Handle end date change
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (validateDates(range.from, newEndDate)) {
      setRange(r => ({ ...r, to: newEndDate }));
    }
  };

  const fetchSummary = async () => {
    // Don't fetch if there's a date validation error
    if (dateError) {
      return;
    }

    try {
      const params = new URLSearchParams({
        start_date: range.from,
        end_date: range.to
      });

      const response = await axios.get(`${BASE_URL}/v1/payment/get-seller-earning-summary?${params}`, {
        headers: { 'user-uuid': localStorage.getItem('uuid') }
      });

      if (response.data.meta.success && response.data.data) {
        const data = response.data.data;
        setSummary({
          cadSold: data.sold_cad_designs || 0,
          totalA: data.total_earnings || 0,
          commissionB: data.commission || 0,
          commissionPct: 10,
          net: data.net_earnings || 0,
          transferred: data.amount_transferred || 0,
          processing: data.amount_pending_transfer || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching earning summary:', error);
    }
  };

  const fetchSellerDetails = async (page = 1) => {
    // Don't fetch if there's a date validation error
    if (dateError) {
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        start_date: range.from,
        end_date: range.to,
        page: page.toString(),
        limit: '10'
      });

      const response = await axios.get(`${BASE_URL}/v1/payment/get-seller-earning-details?${params}`, {
        headers: { 'user-uuid': localStorage.getItem('uuid') }
      });

      if (response.data.meta.success && response.data.data) {
        const data = response.data.data;

        // Update earning details
        if (data.earning_details && Array.isArray(data.earning_details)) {
          setEarningRows(data.earning_details);
        }

        // Update pagination
        if (data.pagination) {
          setPagination(data.pagination);
          setTotalPages(data.pagination.total_pages);
          setCurrentPage(data.pagination.current_page);
        }
      }
    } catch (error) {
      console.error('Error fetching seller details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts or page changes
  useEffect(() => {
    fetchSellerDetails(currentPage);
  }, [currentPage]);

  // Fetch data when date range changes (reset to page 1 and fetch summary)
  useEffect(() => {
    if (!dateError) {
      fetchSummary(); // Fetch summary data
      if (currentPage === 1) {
        fetchSellerDetails(1);
      } else {
        setCurrentPage(1);
      }
    }
  }, [range.from, range.to, dateError]);

  // Initial load - fetch summary data
  useEffect(() => {
    fetchSummary();
  }, []);

  const statItems = [
    { label: 'CAD DESIGNS SOLD', value: summary.cadSold },
    { label: 'TOTAL EARNINGS (A)', value: `$${summary.totalA.toFixed(2)}` },
    { label: 'MARATHON COMMISSION (B)', value: `$${summary.commissionB.toFixed(2)} (${summary.commissionPct}%)` },
    { label: 'NET EARNING (A-B)', value: `$${summary.net.toFixed(2)}` },
    { label: 'AMOUNT TRANSFERRED', value: `$${summary.transferred.toFixed(2)}`, accent: 'ok' },
    { label: 'AMOUNT IN PROCESSING', value: `$${summary.processing.toFixed(2)}` },
  ];

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Your earnings</h2>

        {/* Date range input tag */}
        <div className={styles.dateRange} role="group" aria-label="Date range">
          <span className={styles.calIcon} aria-hidden>📅</span>
          <input
            ref={startDateRef}
            type="date"
            className={styles.dateInput}
            value={range.from}
            onChange={handleStartDateChange}
            aria-label="From date"
          />
          <span className={styles.dateSep}>–</span>
          <input
            ref={endDateRef}
            type="date"
            className={styles.dateInput}
            value={range.to}
            onChange={handleEndDateChange}
            min={range.from} // HTML5 validation - prevents selecting dates before start date
            aria-label="To date"
            style={dateError ? { borderColor: 'red' } : {}}
          />
          <span className={styles.caret} aria-hidden>▾</span>
        </div>

        {/* Date validation error message */}
        {dateError && (
          <div style={{
            color: 'red',
            fontSize: '14px',
            marginTop: '8px',
            textAlign: 'center'
          }}>
            {dateError}
          </div>
        )}
      </div>

      {/* stats grid */}
      <div className={styles.statsGrid}>
        {statItems.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={`${styles.statValue} ${s.accent === 'ok' ? styles.valueOk : ''}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* table */}
      <div className={styles.tableWrap}>
        {dateError ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            Please fix the date range to view earnings data.
          </div>
        ) : (
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                {headers.map(h => (
                  <th key={h} className={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td className={styles.td} colSpan={headers.length} style={{ textAlign: 'center', padding: '20px', height: '30vh' }}>
                    <Loading smallScreen="earnings" />
                  </td>
                </tr>
              ) : (
                earningRows.map((row, idx) => (
                  <tr key={`${row.cad_file_title}-${row.createdAt}-${idx}`} className={styles.tr}>
                    <td className={styles.td} data-label="Date">{fmtDate(row.createdAt)}</td>
                    <td className={styles.td} data-label="File name">{row.cad_file_title || 'N/A'}</td>
                    <td className={styles.td} data-label="Price">${parseFloat(row.amount).toFixed(2)}</td>
                    <td className={styles.td} data-label="Commission">-{commission(row.amount)}</td>
                    <td className={styles.td} data-label="Net earning">${netAmount(row.amount)}</td>
                    <td className={styles.td} data-label="Payment State">
                      {(() => {
                        const stateInfo = getPaymentStateInfo(row.transfered_to_publisher);
                        return (
                          <span className={stateInfo.className}>
                            {stateInfo.text}
                          </span>
                        );
                      })()}
                    </td>
                    <td className={styles.td} data-label="Actions">
                      {row.seller_invoice_url ? (
                        <Link
                          className={styles.seller_invoice_url}
                          href={row.seller_invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Invoice
                        </Link>
                      ) : (
                        <span style={{ color: '#aaa' }}>N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
        {totalPages > 1 && !dateError && (
          <Pagenation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </section>
  )
}

export default Earnings