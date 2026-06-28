"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { BASE_URL } from '@/config'
import Pagenation from '@/Components/CommonJsx/Pagenation'
import Loading from '../CommonJsx/Loaders/Loading'
import styles from './AdminPannel.module.css'
import tableStyles from './VendorsTable.module.css'
import VendorFormPopup from './VendorFormPopup'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

function getAdminHeaders() {
  return { 'admin-uuid': localStorage.getItem('admin-uuid') }
}

function formatCategoryNames(categories = []) {
  if (!categories.length) return '—'
  return categories.map((category) => category.name).join(', ')
}

function VendorsTable() {
  const [vendors, setVendors] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showPopup, setShowPopup] = useState(false)
  const [editingVendor, setEditingVendor] = useState(null)
  const [updatingStatusId, setUpdatingStatusId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/v1/admin-pannel/get-vendor-categories`,
        { headers: getAdminHeaders() },
      )
      setCategories(response?.data?.data?.categories || [])
    } catch (error) {
      console.error('Error fetching vendor categories:', error)
    }
  }

  const fetchVendors = async (page = 1, q = '', action = statusFilter) => {
    setIsLoading(true)
    try {
      const params = { page, limit, q }
      if (action !== 'all') params.action = action

      const response = await axios.get(`${BASE_URL}/v1/admin-pannel/get-vendors`, {
        params,
        headers: getAdminHeaders(),
      })

      const respData = response?.data?.data || {}
      setVendors(respData.vendors || [])
      setTotalPages(respData.totalPages || 1)
      setTotal(respData.total || 0)

      if (respData.page && respData.page !== page) {
        setCurrentPage(respData.page)
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
      setVendors([])
      setTotalPages(1)
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchVendors(currentPage, searchTerm, statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, statusFilter])

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

  const handleOpenAdd = () => {
    setEditingVendor(null)
    setShowPopup(true)
  }

  const handleOpenEdit = (vendor) => {
    setEditingVendor(vendor)
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
    setEditingVendor(null)
  }

  const handleSaved = () => {
    fetchVendors(currentPage, searchTerm, statusFilter)
  }

  const handleStatusChange = async (vendor, nextStatus) => {
    const isActive = nextStatus === 'active'
    if (vendor.is_active === isActive) return

    setUpdatingStatusId(vendor._id)
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/admin-pannel/update-vendor`,
        { vendor_id: vendor._id, is_active: isActive },
        { headers: getAdminHeaders() },
      )

      if (response.data.meta.success) {
        toast.success('Vendor status updated')
        setVendors((prev) =>
          prev.map((item) =>
            item._id === vendor._id ? { ...item, is_active: isActive } : item,
          ),
        )
      } else {
        toast.error(response.data.meta.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating vendor status:', error)
      toast.error(error.response?.data?.meta?.message || 'Failed to update status')
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const handleDelete = async (vendor) => {
    const confirmed = window.confirm(`Delete vendor "${vendor.name}"?`)
    if (!confirmed) return

    setDeletingId(vendor._id)
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/admin-pannel/delete-vendor`,
        { vendor_id: vendor._id },
        { headers: getAdminHeaders() },
      )

      if (response.data.meta.success) {
        toast.success('Vendor deleted')
        fetchVendors(currentPage, searchTerm, statusFilter)
      } else {
        toast.error(response.data.meta.message || 'Failed to delete vendor')
      }
    } catch (error) {
      console.error('Error deleting vendor:', error)
      toast.error(error.response?.data?.meta?.message || 'Failed to delete vendor')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <div className={tableStyles.toolbar}>
        <div className={styles.searchContainer} style={{ marginBottom: 0, flex: 1 }}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles['search-container']}>
              <SearchIcon className={styles['search-icon']} />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className={styles['search-input']}
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
        </div>

        <div className={tableStyles.toolbarActions}>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value)
              setCurrentPage(1)
            }}
            className={tableStyles.statusFilter}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button type="button" className={tableStyles.addBtn} onClick={handleOpenAdd}>
            <AddIcon fontSize="small" />
            Add Vendor
          </button>
        </div>
      </div>

      {searchTerm && (
        <p className={styles.searchInfo}>
          Showing results for &quot;{searchTerm}&quot; ({total} found)
        </p>
      )}

      <div className={styles.tableWrap} style={{ width: '100%' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name / Agency Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Specialised In</th>
              <th>WhatsApp Group Link</th>
              <th>Website Link</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 20 }}>
                  <Loading />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 20 }}>
                    {searchTerm ? 'No vendors found for your search' : 'No vendors found'}
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor._id} className={styles.row}>
                    <td>{vendor.name}</td>
                    <td>{vendor.email || '—'}</td>
                    <td>{vendor.phone_number || '—'}</td>
                    <td>{formatCategoryNames(vendor.categories)}</td>
                    <td>
                      {vendor.whatsapp_group_link ? (
                        <a
                          href={vendor.whatsapp_group_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={tableStyles.link}
                        >
                          Open
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {vendor.website_link ? (
                        <a
                          href={vendor.website_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={tableStyles.link}
                        >
                          Visit
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <select
                        value={vendor.is_active ? 'active' : 'inactive'}
                        onChange={(event) => handleStatusChange(vendor, event.target.value)}
                        disabled={updatingStatusId === vendor._id}
                        className={`${tableStyles.rowStatusSelect} ${
                          vendor.is_active ? tableStyles.active : tableStyles.inactive
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td>
                      <div className={tableStyles.actions}>
                        <button
                          type="button"
                          className={tableStyles.iconBtn}
                          onClick={() => handleOpenEdit(vendor)}
                          title="Edit vendor"
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </button>
                        <button
                          type="button"
                          className={`${tableStyles.iconBtn} ${tableStyles.deleteBtn}`}
                          onClick={() => handleDelete(vendor)}
                          disabled={deletingId === vendor._id}
                          title="Delete vendor"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </div>

      {totalPages > 1 && (
        <Pagenation
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {showPopup && (
        <VendorFormPopup
          onClose={handleClosePopup}
          onSaved={handleSaved}
          vendor={editingVendor}
          categories={categories}
          onCategoriesChange={setCategories}
        />
      )}
    </>
  )
}

export default VendorsTable
