"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import PopupWrapper from '../CommonJsx/PopupWrapper'
import popupStyles from '../CommonJsx/CommonStyles.module.css'
import Loading from '../CommonJsx/Loaders/Loading'
import { formatDate } from '@/common.helper'
import {
  createCadServiceQuotation,
  fetchCadServiceQuotations,
  fetchVendors,
  uploadQuotationFile,
} from '@/api/adminVendorsApi'
import styles from './AddQuotationPopup.module.css'

const vendorSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#fff',
    border: state.selectProps?.hasError ? '1px solid #dc3545' : '1px solid #d1d5db',
    boxShadow: state.isFocused ? '0 0 0 1px #610bee' : 'none',
    minHeight: '42px',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  menuPortal: (provided) => ({ ...provided, zIndex: 10001 }),
  menu: (provided) => ({ ...provided, zIndex: 10001 }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#610bee'
      : state.isFocused
        ? '#f3e8ff'
        : '#fff',
    color: state.isSelected ? '#fff' : '#111827',
    cursor: 'pointer',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#610bee',
    borderRadius: '4px',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#fff',
    fontWeight: 500,
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#fff',
    ':hover': {
      backgroundColor: '#4f09c7',
      color: '#fff',
    },
  }),
}

function formatFileSize(bytes) {
  const size = Number(bytes) || 0
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function getQuotationVendors(quotation) {
  if (Array.isArray(quotation?.vendors) && quotation.vendors.length) {
    return quotation.vendors
  }
  if (quotation?.vendor) return [quotation.vendor]
  return []
}

export function formatQuotationVendorNames(quotation) {
  const vendors = getQuotationVendors(quotation)
  if (!vendors.length) return 'Vendor'
  return vendors.map((vendor) => vendor.name || vendor.email || 'Vendor').join(', ')
}

export function QuotationHistoryList({ quotations = [], emptyText = 'No quotations found for this request.' }) {
  if (!Array.isArray(quotations) || !quotations.length) {
    return <p className={styles.historyEmpty}>{emptyText}</p>
  }

  return (
    <ul className={styles.historyList}>
      {quotations.map((quotation) => {
        const vendors = getQuotationVendors(quotation)
        return (
          <li key={quotation._id} className={styles.historyItem}>
            <div className={styles.historyHeader}>
              <strong>{formatQuotationVendorNames(quotation)}</strong>
              <span>{formatDate(quotation.createdAt)}</span>
            </div>
            {vendors.length > 0 ? (
              <p className={styles.historyEmail}>
                {vendors
                  .map((vendor) => vendor.email || vendor.name)
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            ) : null}
            {quotation.text ? (
              <p className={styles.historyText}>{quotation.text}</p>
            ) : null}
            {Array.isArray(quotation.attachments) && quotation.attachments.length > 0 ? (
              <div className={styles.historyAttachments}>
                {quotation.attachments.map((attachment) => (
                  <a
                    key={`${quotation._id}-${attachment.key}`}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.attachmentLink}
                  >
                    {attachment.name}
                  </a>
                ))}
              </div>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

function AddQuotationPopup({ request, onClose, onSaved }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [vendors, setVendors] = useState([])
  const [quotations, setQuotations] = useState([])
  const [selectedVendors, setSelectedVendors] = useState([])
  const [text, setText] = useState('')
  const [pendingFiles, setPendingFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      try {
        const [vendorsRes, quotationsRes] = await Promise.all([
          fetchVendors({ action: 'active', limit: 100 }),
          fetchCadServiceQuotations(request._id),
        ])

        if (cancelled) return

        if (!vendorsRes?.meta?.success) {
          throw new Error(vendorsRes?.meta?.message || 'Failed to load vendors')
        }
        if (!quotationsRes?.meta?.success) {
          throw new Error(quotationsRes?.meta?.message || 'Failed to load quotations')
        }

        setVendors(vendorsRes.data?.vendors || [])
        setQuotations(quotationsRes.data?.quotations || [])
      } catch (error) {
        if (cancelled) return
        console.error('AddQuotationPopup load error:', error)
        toast.error(error.message || 'Failed to load quotation form')
        onClose()
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request._id])

  const vendorOptions = useMemo(
    () =>
      vendors.map((vendor) => ({
        value: vendor._id,
        label: vendor.email
          ? `${vendor.name} (${vendor.email})`
          : vendor.name,
      })),
    [vendors],
  )

  const handleFilesSelected = (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    setPendingFiles((prev) => {
      const existingKeys = new Set(prev.map((file) => `${file.name}-${file.size}-${file.lastModified}`))
      const next = [...prev]
      files.forEach((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`
        if (!existingKeys.has(key)) {
          next.push(file)
          existingKeys.add(key)
        }
      })
      return next
    })

    if (errors.files || errors.content) {
      setErrors((prev) => ({ ...prev, files: '', content: '' }))
    }
    if (formError) setFormError('')
    event.target.value = ''
  }

  const removePendingFile = (index) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const validate = () => {
    const nextErrors = {}
    if (!selectedVendors.length) {
      nextErrors.vendor = 'Please select at least one vendor'
    }
    if (!text.trim() && pendingFiles.length === 0) {
      nextErrors.content = 'Add quotation text or at least one file'
    }
    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setFormError(Object.values(nextErrors)[0])
      return
    }

    setIsSaving(true)
    setFormError('')
    setUploadProgress(pendingFiles.length ? `Uploading 0/${pendingFiles.length}...` : 'Saving...')

    try {
      const attachments = []
      for (let i = 0; i < pendingFiles.length; i += 1) {
        setUploadProgress(`Uploading ${i + 1}/${pendingFiles.length}...`)
        const uploaded = await uploadQuotationFile(pendingFiles[i], request._id)
        attachments.push(uploaded)
      }

      setUploadProgress('Saving quotation...')
      const response = await createCadServiceQuotation({
        request_id: request._id,
        vendor_ids: selectedVendors.map((vendor) => vendor.value),
        text: text.trim(),
        attachments,
      })

      if (!response?.meta?.success) {
        throw new Error(response?.meta?.message || 'Failed to save quotation')
      }

      toast.success(response.meta.message || 'Quotation saved')
      onSaved?.(response.data)
      onClose()
    } catch (error) {
      console.error('Save quotation error:', error)
      const message = error.response?.data?.meta?.message || error.message || 'Failed to save quotation'
      setFormError(message)
      toast.error(message)
    } finally {
      setIsSaving(false)
      setUploadProgress('')
    }
  }

  return (
    <PopupWrapper>
      <div className={`${popupStyles.popupContainer} ${styles.popup}`}>
        <div className={popupStyles.headerRow}>
          <div>
            <h3 className={styles.title}>Add quotation</h3>
            <p className={styles.subtitle}>
              {request.full_name || request.email || 'CAD service request'}
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {isLoading ? (
          <div className={styles.loadingWrap}>
            <Loading />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {formError ? <div className={styles.formError}>{formError}</div> : null}

            <label className={styles.field}>
              <span className={styles.label}>Vendors</span>
              <Select
                isMulti
                options={vendorOptions}
                value={selectedVendors}
                onChange={(options) => {
                  setSelectedVendors(options || [])
                  if (errors.vendor) setErrors((prev) => ({ ...prev, vendor: '' }))
                  if (formError) setFormError('')
                }}
                placeholder="Select one or more vendors..."
                isDisabled={isSaving}
                styles={vendorSelectStyles}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                hasError={Boolean(errors.vendor)}
              />
              {errors.vendor ? <span className={styles.errorText}>{errors.vendor}</span> : null}
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Quotation text</span>
              <textarea
                className={styles.textarea}
                value={text}
                onChange={(event) => {
                  setText(event.target.value)
                  if (errors.content) setErrors((prev) => ({ ...prev, content: '' }))
                  if (formError) setFormError('')
                }}
                rows={5}
                placeholder="Enter quotation details, pricing notes, terms..."
                disabled={isSaving}
              />
            </label>

            <div className={styles.field}>
              <span className={styles.label}>Attachments</span>
              <div className={styles.uploadRow}>
                <button
                  type="button"
                  className={styles.uploadBtn}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                >
                  Add files
                </button>
                <span className={styles.uploadHint}>PDF, images, docs, or any file type</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className={styles.hiddenInput}
                  onChange={handleFilesSelected}
                  disabled={isSaving}
                />
              </div>
              {errors.content ? <span className={styles.errorText}>{errors.content}</span> : null}

              {pendingFiles.length > 0 ? (
                <ul className={styles.fileList}>
                  {pendingFiles.map((file, index) => (
                    <li key={`${file.name}-${file.size}-${file.lastModified}`} className={styles.fileItem}>
                      <InsertDriveFileOutlinedIcon fontSize="small" />
                      <div className={styles.fileMeta}>
                        <span className={styles.fileName}>{file.name}</span>
                        <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                      </div>
                      <button
                        type="button"
                        className={styles.removeFileBtn}
                        onClick={() => removePendingFile(index)}
                        disabled={isSaving}
                        aria-label={`Remove ${file.name}`}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className={styles.historySection}>
              <h4 className={styles.historyTitle}>Previous quotations</h4>
              <QuotationHistoryList
                quotations={quotations}
                emptyText="No quotations saved for this request yet."
              />
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={popupStyles.skipBtn}
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={popupStyles.nextBtn}
                disabled={isSaving}
              >
                {isSaving ? (uploadProgress || 'Saving...') : 'Save quotation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </PopupWrapper>
  )
}

export default AddQuotationPopup
