"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SearchIcon from '@mui/icons-material/Search'
import { BASE_URL } from '@/config'
import { formatDate } from '@/common.helper'
import Pagenation from '@/Components/CommonJsx/Pagenation'
import Loading from '../CommonJsx/Loaders/Loading'
import styles from './AdminPannel.module.css'
import creditStyles from './ConverterCreditsTable.module.css'

const SCOPES = [
  { id: 'balance', label: 'Has credits' },
  { id: 'purchased', label: 'Bought credits' },
]

function formatWhen(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return formatDate(value)
}

function formatMoney(amount, currency = 'USD') {
  const value = Number(amount)
  if (!Number.isFinite(value)) return '—'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${currency} ${value.toFixed(2)}`
  }
}

function packTitle(purchase) {
  return purchase.pack_name || purchase.pack_id || 'Credit pack'
}

function PurchaseList({ user }) {
  if (!user.purchases?.length) {
    return <span className={creditStyles.muted}>No purchase on file</span>
  }
  const hidden = Math.max(0, (user.purchase_count || 0) - user.purchases.length)
  return (
    <div className={creditStyles.purchases}>
      {user.purchases.map((purchase, index) => (
        <div key={`${user.user_id}-${purchase.bought_at || index}-${purchase.pack_id}`} className={creditStyles.purchase}>
          <span className={creditStyles.packName}>
            {packTitle(purchase)}
            {purchase.credits_granted ? ` · ${purchase.credits_granted} credits` : ''}
          </span>
          <span className={creditStyles.muted}>
            {formatWhen(purchase.bought_at)}
            {' · '}
            {formatMoney(purchase.amount, purchase.currency)}
          </span>
        </div>
      ))}
      {hidden > 0 ? <span className={creditStyles.muted}>+ {hidden} more</span> : null}
    </div>
  )
}

function SummaryCard({ label, value }) {
  return (
    <div className={creditStyles.summaryCard}>
      <span className={creditStyles.summaryLabel}>{label}</span>
      <span className={creditStyles.summaryValue}>{value}</span>
    </div>
  )
}

function ConverterCreditsTable() {
  const [users, setUsers] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [scope, setScope] = useState('balance')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${BASE_URL}/v1/admin-pannel/get-converter-credits`, {
          params: { page: currentPage, limit, q: searchTerm, scope },
          headers: { 'admin-uuid': localStorage.getItem('admin-uuid') },
        })
        if (cancelled) return
        const data = response?.data?.data || {}
        setUsers(data.users || [])
        setSummary(data.summary || null)
        setTotalPages(data.totalPages || 1)
        setTotal(data.total || 0)
      } catch (error) {
        console.error('Failed to fetch converter credits:', error)
        if (cancelled) return
        setUsers([])
        setTotalPages(1)
        setTotal(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [currentPage, limit, searchTerm, scope])

  const handleSearch = (event) => {
    event.preventDefault()
    setSearchTerm(searchInput.trim())
    setCurrentPage(1)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const emptyMessage = searchTerm
    ? 'No users found for that email'
    : scope === 'purchased'
      ? 'No credit purchases yet'
      : 'No users currently have credits'

  return (
    <>
      {summary ? (
        <div className={creditStyles.summary}>
          <SummaryCard label="Users with credits" value={summary.users_with_credits || 0} />
          <SummaryCard label="Credits left" value={summary.credits_remaining || 0} />
          <SummaryCard label="Credits used" value={summary.credits_used || 0} />
          <SummaryCard label="Credits bought" value={summary.credits_bought || 0} />
        </div>
      ) : null}

      <div className={styles.searchContainer}>
        <div className={styles.filterContainer}>
          <div className={styles.filterButtons}>
            {SCOPES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.filterBtn} ${scope === item.id ? styles.filterBtnActive : ''}`}
                onClick={() => {
                  setScope(item.id)
                  setCurrentPage(1)
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles['search-container']}>
            <SearchIcon className={styles['search-icon']} />
            <input
              type="text"
              placeholder="Search by email"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className={styles['search-input']}
            />
          </div>
          <button type="submit" className={styles.searchBtn}>
            Search
          </button>
          {searchTerm ? (
            <button type="button" onClick={handleClearSearch} className={styles.clearBtn}>
              Clear
            </button>
          ) : null}
        </form>
        {searchTerm ? (
          <p className={styles.searchInfo}>
            Showing results for &quot;{searchTerm}&quot; ({total} found)
          </p>
        ) : (
          <p className={styles.searchInfo}>
            {scope === 'purchased'
              ? 'Everyone who bought a credit pack, including people who have used them all.'
              : 'People who still have converter credits left. Each row shows the pack they bought and when.'}
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
                  <th>Email</th>
                  <th>Credits left</th>
                  <th>Used</th>
                  <th>Bought</th>
                  <th>Pack and purchase date</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.user_id}>
                      <td>
                        <div className={creditStyles.email}>{user.email || '—'}</div>
                        {user.full_name ? <div className={creditStyles.muted}>{user.full_name}</div> : null}
                      </td>
                      <td>{user.credits_left}</td>
                      <td>{user.credits_used}</td>
                      <td>{user.credits_bought}</td>
                      <td>
                        <PurchaseList user={user} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.mobileCards}>
            {users.length === 0 ? (
              <div className={styles.mobileEmpty}>{emptyMessage}</div>
            ) : (
              users.map((user) => (
                <div key={user.user_id} className={styles.mobileCard}>
                  <div className={styles.mobileCardHeader}>
                    <h3 className={styles.mobileCardTitle}>{user.email || 'Unknown email'}</h3>
                    <span className={styles.mobileCardAside}>{user.credits_left} left</span>
                  </div>
                  <div className={styles.mobileCardBody}>
                    {user.full_name ? (
                      <div className={styles.mobileCardField}>
                        <span className={styles.mobileCardLabel}>Name</span>
                        <span className={styles.mobileCardValue}>{user.full_name}</span>
                      </div>
                    ) : null}
                    <div className={styles.mobileCardField}>
                      <span className={styles.mobileCardLabel}>Used</span>
                      <span className={styles.mobileCardValue}>{user.credits_used}</span>
                    </div>
                    <div className={styles.mobileCardField}>
                      <span className={styles.mobileCardLabel}>Bought</span>
                      <span className={styles.mobileCardValue}>{user.credits_bought}</span>
                    </div>
                    <div className={styles.mobileCardField}>
                      <span className={styles.mobileCardLabel}>Packs</span>
                      <span className={styles.mobileCardValue}>
                        <PurchaseList user={user} />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <div className={styles.paginationWrap}>
        {totalPages > 1 ? (
          <Pagenation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        ) : null}
      </div>
    </>
  )
}

export default ConverterCreditsTable
