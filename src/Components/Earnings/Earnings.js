import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './Earnings.module.css'
import { BASE_URL } from '@/config';
import Pagenation from '../CommonJsx/Pagenation';

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
  return `${netPrice}`;
}
function commission(amount){
  const commissionAmount = amount * 0.1;
  return `${commissionAmount}(10%)`
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

  // date range state (HTML date format: YYYY-MM-DD)
  const [range, setRange] = useState({
    
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

  // Handle start date change
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setRange(r => ({ ...r, from: newStartDate }));
    validateDates(newStartDate, range.to);
  };

  // Handle end date change
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (validateDates(range.from, newEndDate)) {
      setRange(r => ({ ...r, to: newEndDate }));
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
        
        // Update summary
        if (data.earning_summary) {
          setSummary({
            cadSold: data.earning_summary.sold_cad_designs || 0,
            totalA: data.earning_summary.total_earnings || 0,
            commissionB: data.earning_summary.commission || 0,
            commissionPct: 10,
            net: data.earning_summary.net_earnings || 0,
            transferred: data.earning_summary.amount_transferred || 0,
            processing: data.earning_summary.amount_pending_transfer || 0,
          });
        }

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

  // Fetch data when date range changes (reset to page 1)
  useEffect(() => {
    if (!dateError) {
      if (currentPage === 1) {
        fetchSellerDetails(1);
      } else {
        setCurrentPage(1);
      }
    }
  }, [range.from, range.to, dateError]);

  const statItems = [
    { label: 'CAD DESIGNS SOLD', value: summary.cadSold },
    { label: 'TOTAL EARNINGS (A)', value: `$${summary.totalA}` },
    { label: 'MARATHON COMMISSION (B)', value: `$${summary.commissionB} (${summary.commissionPct}%)` },
    { label: 'NET EARNING (A-B)', value: `$${summary.net}` },
    { label: 'AMOUNT TRANSFERRED', value: `$${summary.transferred}`, accent: 'ok' },
    { label: 'AMOUNT IN PROCESSING', value: `$${summary.processing}` },
  ];

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Your earnings</h2>

        {/* Date range input tag */}
        <div className={styles.dateRange} role="group" aria-label="Date range">
          <span className={styles.calIcon} aria-hidden>📅</span>
          <input
            type="date"
            className={styles.dateInput}
            value={range.from}
            onChange={handleStartDateChange}
            aria-label="From date"
          />
          <span className={styles.dateSep}>–</span>
          <input
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
        {isLoading ? (
          <div>Loading...</div>
        ) : dateError ? (
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
              {earningRows.map((row, idx) => (
                <tr key={`${row.cad_file_title}-${row.createdAt}-${idx}`} className={styles.tr}>
                  <td className={styles.td} data-label="Date">{fmtDate(row.createdAt)}</td>
                  <td className={styles.td} data-label="File name">{row.cad_file_title || 'N/A'}</td>
                  <td className={styles.td} data-label="Price">${row.amount}</td>
                  <td className={styles.td} data-label="Commission">-{commission(row.amount)}</td>
                  <td className={styles.td} data-label="Net earning">${netAmount(row.amount)}</td>
                  <td className={styles.td} data-label="Payment State">
                    <span className={row.transfered_to_publisher ? styles.stateOk : styles.stateInfo}>
                      {row.transfered_to_publisher ? 'Transferred' : 'Processing'}
                    </span>
                  </td>
                  <td className={styles.td} data-label="Actions">
                    <a className={styles.seller_invoice_url} href={row.seller_invoice_url}>Invoice</a>
                  </td>
                </tr>
              ))}
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