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
  createCadServiceInvoices,
  fetchCadServiceInvoices,
  fetchVendors,
  uploadInvoiceFile,
} from '@/api/adminVendorsApi'
import styles from './AddInvoicePopup.module.css'

const EMPTY_INVOICE = {
  invoice_amount: '',
  invoice_no: '',
  comment: '',
}

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
}

function formatFileSize(bytes) {
  const size = Number(bytes) || 0
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function formatAmount(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return '—'
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

function invoiceTypeLabel(type) {
  return type === 'marathon' ? 'Marathon invoice' : 'Agency invoice'
}

export function groupInvoicesByBatch(invoices = []) {
  if (!Array.isArray(invoices) || !invoices.length) return []

  const groups = new Map()
  invoices.forEach((invoice) => {
    const key = String(invoice.batch_id || invoice._id)
    if (!groups.has(key)) {
      groups.set(key, {
        batch_id: invoice.batch_id || invoice._id,
        createdAt: invoice.createdAt,
        vendor: invoice.vendor || null,
        invoices: [],
      })
    }
    const group = groups.get(key)
    group.invoices.push(invoice)
    if (!group.vendor && invoice.vendor) group.vendor = invoice.vendor
    const createdAt = invoice.createdAt ? new Date(invoice.createdAt).getTime() : 0
    const groupCreatedAt = group.createdAt ? new Date(group.createdAt).getTime() : 0
    if (createdAt > groupCreatedAt) group.createdAt = invoice.createdAt
  })

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      invoices: [...group.invoices].sort((a, b) => {
        if (a.invoice_type === b.invoice_type) return 0
        return a.invoice_type === 'agency' ? -1 : 1
      }),
    }))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
}

function InvoiceAttachmentPreview({ files = [], onRemove, disabled }) {
  if (!Array.isArray(files) || !files.length) return null
  return (
    <ul className={styles.fileList}>
      {files.map((file, index) => (
        <li key={`${file.name}-${file.size}-${file.lastModified}-${index}`} className={styles.fileItem}>
          <InsertDriveFileOutlinedIcon fontSize="small" />
          <div className={styles.fileMeta}>
            <span className={styles.fileName}>{file.name}</span>
            <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
          </div>
          <button
            type="button"
            className={styles.removeFileBtn}
            onClick={() => onRemove(index)}
            disabled={disabled}
            aria-label={`Remove ${file.name}`}
          >
            <DeleteOutlineIcon fontSize="small" />
          </button>
        </li>
      ))}
    </ul>
  )
}

function getInvoiceAttachments(invoice) {
  if (Array.isArray(invoice?.attachments) && invoice.attachments.length) {
    return invoice.attachments
  }
  if (invoice?.attachment?.url) return [invoice.attachment]
  return []
}

export function InvoiceHistoryList({ invoices = [], emptyText = 'No invoices found for this request.' }) {
  const groups = groupInvoicesByBatch(invoices)

  if (!groups.length) {
    return <p className={styles.historyEmpty}>{emptyText}</p>
  }

  return (
    <ul className={styles.historyList}>
      {groups.map((group) => {
        const vendorName = group.vendor?.name || group.vendor?.email || 'Vendor'
        return (
          <li key={String(group.batch_id)} className={styles.historyItem}>
            <div className={styles.historyHeader}>
              <strong>{vendorName}</strong>
              <span>{formatDate(group.createdAt)}</span>
            </div>
            {group.vendor?.email ? (
              <p className={styles.historyEmail}>{group.vendor.email}</p>
            ) : null}
            <div className={styles.historyPair}>
              {group.invoices.map((invoice) => {
                const attachments = getInvoiceAttachments(invoice)
                return (
                  <div key={invoice._id} className={styles.historyInvoiceCard}>
                    <span className={styles.historyInvoiceLabel}>
                      {invoiceTypeLabel(invoice.invoice_type)}
                    </span>
                    <p className={styles.historyMeta}>
                      Invoice no: {invoice.invoice_no || '—'}
                    </p>
                    <p className={styles.historyMeta}>
                      Amount: {formatAmount(invoice.invoice_amount)}
                    </p>
                    {invoice.comment ? (
                      <p className={styles.historyText}>{invoice.comment}</p>
                    ) : null}
                    {attachments.length ? (
                      <div className={styles.historyAttachments}>
                        {attachments.map((attachment) => (
                          <a
                            key={`${invoice._id}-${attachment.key || attachment.url}`}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.attachmentLink}
                          >
                            {attachment.name || 'Invoice PDF'}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function InvoiceSection({
  title,
  hint,
  values,
  files,
  errors,
  prefix,
  fileInputRef,
  isSaving,
  onChange,
  onFileSelected,
  onRemoveFile,
}) {
  return (
    <div className={styles.section}>
      <div>
        <h4 className={styles.sectionTitle}>{title}</h4>
        {hint ? <p className={styles.sectionHint}>{hint}</p> : null}
      </div>

      <div className={styles.fieldRow}>
        <label className={styles.field}>
          <span className={styles.label}>Invoice amount</span>
          <input
            type="number"
            min="0"
            step="0.01"
            className={`${styles.input} ${errors[`${prefix}_amount`] ? styles.inputHasError : ''}`}
            value={values.invoice_amount}
            onChange={(event) => onChange('invoice_amount', event.target.value)}
            placeholder="0.00"
            disabled={isSaving}
          />
          {errors[`${prefix}_amount`] ? (
            <span className={styles.errorText}>{errors[`${prefix}_amount`]}</span>
          ) : null}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Invoice no</span>
          <input
            type="text"
            className={`${styles.input} ${errors[`${prefix}_no`] ? styles.inputHasError : ''}`}
            value={values.invoice_no}
            onChange={(event) => onChange('invoice_no', event.target.value)}
            placeholder="Enter invoice number"
            disabled={isSaving}
          />
          {errors[`${prefix}_no`] ? (
            <span className={styles.errorText}>{errors[`${prefix}_no`]}</span>
          ) : null}
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Comment</span>
        <textarea
          className={styles.textarea}
          value={values.comment}
          onChange={(event) => onChange('comment', event.target.value)}
          rows={3}
          placeholder="Optional comment"
          disabled={isSaving}
        />
      </label>

      <div className={styles.field}>
        <span className={styles.label}>Attachments (invoice PDFs)</span>
        <div className={styles.uploadRow}>
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
          >
            Add PDFs
          </button>
          <span className={styles.uploadHint}>PDF only · add as many as needed</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            multiple
            className={styles.hiddenInput}
            onChange={onFileSelected}
            disabled={isSaving}
          />
        </div>
        {errors[`${prefix}_file`] ? (
          <span className={styles.errorText}>{errors[`${prefix}_file`]}</span>
        ) : null}
        <InvoiceAttachmentPreview
          files={files}
          onRemove={onRemoveFile}
          disabled={isSaving}
        />
      </div>
    </div>
  )
}

function AddInvoicePopup({ request, onClose, onSaved }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [vendors, setVendors] = useState([])
  const [invoices, setInvoices] = useState([])
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [agencyInvoice, setAgencyInvoice] = useState({ ...EMPTY_INVOICE })
  const [marathonInvoice, setMarathonInvoice] = useState({ ...EMPTY_INVOICE })
  const [agencyFiles, setAgencyFiles] = useState([])
  const [marathonFiles, setMarathonFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const agencyFileInputRef = useRef(null)
  const marathonFileInputRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      try {
        const [vendorsRes, invoicesRes] = await Promise.all([
          fetchVendors({ action: 'active', limit: 100 }),
          fetchCadServiceInvoices(request._id),
        ])

        if (cancelled) return

        if (!vendorsRes?.meta?.success) {
          throw new Error(vendorsRes?.meta?.message || 'Failed to load vendors')
        }
        if (!invoicesRes?.meta?.success) {
          throw new Error(invoicesRes?.meta?.message || 'Failed to load invoices')
        }

        setVendors(vendorsRes.data?.vendors || [])
        setInvoices(invoicesRes.data?.invoices || [])
      } catch (error) {
        if (cancelled) return
        console.error('AddInvoicePopup load error:', error)
        toast.error(error.message || 'Failed to load invoice form')
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

  const clearErrorKeys = (keys) => {
    setErrors((prev) => {
      const next = { ...prev }
      keys.forEach((key) => {
        delete next[key]
      })
      return next
    })
    if (formError) setFormError('')
  }

  const handleFileSelected = (event, setter, errorKey) => {
    const selected = Array.from(event.target.files || [])
    event.target.value = ''
    if (!selected.length) return

    const pdfFiles = []
    let rejected = false
    selected.forEach((file) => {
      const isPdf = (
        String(file.name || '').toLowerCase().endsWith('.pdf')
        || String(file.type || '').toLowerCase().includes('pdf')
      )
      if (!isPdf) {
        rejected = true
        return
      }
      pdfFiles.push(file)
    })

    if (rejected) {
      toast.error('Only PDF invoice attachments are allowed')
    }
    if (!pdfFiles.length) return

    setter((prev) => {
      const existingKeys = new Set(prev.map((file) => `${file.name}-${file.size}-${file.lastModified}`))
      const next = [...prev]
      pdfFiles.forEach((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`
        if (!existingKeys.has(key)) {
          next.push(file)
          existingKeys.add(key)
        }
      })
      return next
    })
    clearErrorKeys([errorKey])
  }

  const validate = () => {
    const nextErrors = {}
    if (!selectedVendor?.value) {
      nextErrors.vendor = 'Please select a vendor / agency'
    }

    if (!String(agencyInvoice.invoice_amount || '').trim() || !(Number(agencyInvoice.invoice_amount) > 0)) {
      nextErrors.agency_amount = 'Enter a valid agency invoice amount'
    }
    if (!String(agencyInvoice.invoice_no || '').trim()) {
      nextErrors.agency_no = 'Agency invoice number is required'
    }
    if (!agencyFiles.length) {
      nextErrors.agency_file = 'Add at least one agency invoice PDF'
    }

    if (!String(marathonInvoice.invoice_amount || '').trim() || !(Number(marathonInvoice.invoice_amount) > 0)) {
      nextErrors.marathon_amount = 'Enter a valid Marathon invoice amount'
    }
    if (!String(marathonInvoice.invoice_no || '').trim()) {
      nextErrors.marathon_no = 'Marathon invoice number is required'
    }
    if (!marathonFiles.length) {
      nextErrors.marathon_file = 'Add at least one Marathon invoice PDF'
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

    try {
      const agencyAttachments = []
      for (let i = 0; i < agencyFiles.length; i += 1) {
        setUploadProgress(`Uploading agency PDF ${i + 1}/${agencyFiles.length}...`)
        agencyAttachments.push(await uploadInvoiceFile(agencyFiles[i], request._id))
      }

      const marathonAttachments = []
      for (let i = 0; i < marathonFiles.length; i += 1) {
        setUploadProgress(`Uploading Marathon PDF ${i + 1}/${marathonFiles.length}...`)
        marathonAttachments.push(await uploadInvoiceFile(marathonFiles[i], request._id))
      }

      setUploadProgress('Saving invoices...')
      const response = await createCadServiceInvoices({
        request_id: request._id,
        vendor_id: selectedVendor.value,
        agency_invoice: {
          invoice_amount: Number(agencyInvoice.invoice_amount),
          invoice_no: agencyInvoice.invoice_no.trim(),
          comment: agencyInvoice.comment.trim(),
          attachments: agencyAttachments,
        },
        marathon_invoice: {
          invoice_amount: Number(marathonInvoice.invoice_amount),
          invoice_no: marathonInvoice.invoice_no.trim(),
          comment: marathonInvoice.comment.trim(),
          attachments: marathonAttachments,
        },
      })

      if (!response?.meta?.success) {
        throw new Error(response?.meta?.message || 'Failed to save invoices')
      }

      toast.success(response.meta.message || 'Invoices saved')
      onSaved?.(response.data)
      onClose()
    } catch (error) {
      console.error('Save invoices error:', error)
      const message = error.response?.data?.meta?.message || error.message || 'Failed to save invoices'
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
            <h3 className={styles.title}>Add invoice</h3>
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
              <span className={styles.label}>Agency / vendor</span>
              <Select
                options={vendorOptions}
                value={selectedVendor}
                onChange={(option) => {
                  setSelectedVendor(option || null)
                  clearErrorKeys(['vendor'])
                }}
                placeholder="Select one vendor..."
                isDisabled={isSaving}
                styles={vendorSelectStyles}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                hasError={Boolean(errors.vendor)}
              />
              {errors.vendor ? <span className={styles.errorText}>{errors.vendor}</span> : null}
            </label>

            <InvoiceSection
              title="Agency invoice"
              hint="Invoice received from the agency"
              values={agencyInvoice}
              files={agencyFiles}
              errors={errors}
              prefix="agency"
              fileInputRef={agencyFileInputRef}
              isSaving={isSaving}
              onChange={(field, value) => {
                setAgencyInvoice((prev) => ({ ...prev, [field]: value }))
                clearErrorKeys([
                  field === 'invoice_amount' ? 'agency_amount' : '',
                  field === 'invoice_no' ? 'agency_no' : '',
                ].filter(Boolean))
              }}
              onFileSelected={(event) => handleFileSelected(event, setAgencyFiles, 'agency_file')}
              onRemoveFile={(index) => setAgencyFiles((prev) => prev.filter((_, i) => i !== index))}
            />

            <InvoiceSection
              title="Marathon invoice"
              hint="Invoice issued by Marathon to the client"
              values={marathonInvoice}
              files={marathonFiles}
              errors={errors}
              prefix="marathon"
              fileInputRef={marathonFileInputRef}
              isSaving={isSaving}
              onChange={(field, value) => {
                setMarathonInvoice((prev) => ({ ...prev, [field]: value }))
                clearErrorKeys([
                  field === 'invoice_amount' ? 'marathon_amount' : '',
                  field === 'invoice_no' ? 'marathon_no' : '',
                ].filter(Boolean))
              }}
              onFileSelected={(event) => handleFileSelected(event, setMarathonFiles, 'marathon_file')}
              onRemoveFile={(index) => setMarathonFiles((prev) => prev.filter((_, i) => i !== index))}
            />

            <div className={styles.historySection}>
              <h4 className={styles.historyTitle}>Previous invoices</h4>
              <InvoiceHistoryList
                invoices={invoices}
                emptyText="No invoices saved for this request yet."
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
                {isSaving ? (uploadProgress || 'Saving...') : 'Save invoices'}
              </button>
            </div>
          </form>
        )}
      </div>
    </PopupWrapper>
  )
}

export default AddInvoicePopup
