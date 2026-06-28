"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import Select from 'react-select'
import PopupWrapper from '../CommonJsx/PopupWrapper'
import popupStyles from '../CommonJsx/CommonStyles.module.css'
import { fetchCadVendorMailPreview, sendCadVendorMail } from '@/api/adminVendorsApi'
import Loading from '../CommonJsx/Loaders/Loading'
import styles from './CadVendorMailPopup.module.css'

const vendorSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#fff',
    border: '1px solid #d1d5db',
    boxShadow: state.isFocused ? '0 0 0 1px #610bee' : 'none',
    minHeight: '42px',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  menuPortal: (provided) => ({ ...provided, zIndex: 10001 }),
  menu: (provided) => ({ ...provided, zIndex: 10001 }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled
      ? '#f9fafb'
      : state.isSelected
        ? '#610bee'
        : state.isFocused
          ? '#f3e8ff'
          : '#fff',
    color: state.isDisabled ? '#9ca3af' : state.isSelected ? '#fff' : '#111827',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
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

function CadVendorMailPopup({ request, onClose, onSent }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [preview, setPreview] = useState(null)
  const [selectedVendors, setSelectedVendors] = useState([])

  useEffect(() => {
    const loadPreview = async () => {
      setIsLoading(true)
      try {
        const response = await fetchCadVendorMailPreview(request._id)

        if (response.meta.success) {
          setPreview(response.data)
        } else {
          toast.error(response.meta.message || 'Failed to load mail preview')
          onClose()
        }
      } catch (error) {
        console.error('Error loading mail preview:', error)
        toast.error(error.response?.data?.meta?.message || 'Failed to load mail preview')
        onClose()
      } finally {
        setIsLoading(false)
      }
    }

    loadPreview()
  }, [request._id, onClose])

  const vendorOptions = useMemo(
    () =>
      (preview?.active_vendors || []).map((vendor) => {
        const email = String(vendor.email || '').trim()
        return {
          value: vendor._id,
          label: email ? `${vendor.name} (${email})` : `${vendor.name} (no email)`,
          email,
          isDisabled: !email,
        }
      }),
    [preview?.active_vendors],
  )

  const mailableVendorCount = useMemo(
    () => vendorOptions.filter((option) => !option.isDisabled).length,
    [vendorOptions],
  )

  const handleSendSelected = async () => {
    if (!selectedVendors.length) {
      toast.error('Select at least one vendor')
      return
    }

    setIsSending(true)
    try {
      const response = await sendCadVendorMail({
        request_id: request._id,
        vendor_ids: selectedVendors.map((option) => option.value),
        send_all: false,
      })

      if (response.meta.success) {
        toast.success(response.meta.message || 'Email sent')
        onSent?.()
        onClose()
      } else {
        toast.error(response.meta.message || 'Failed to send email')
      }
    } catch (error) {
      console.error('Error sending vendor mail:', error)
      toast.error(error.response?.data?.meta?.message || 'Failed to send email')
    } finally {
      setIsSending(false)
    }
  }

  const handleSendAll = async () => {
    if (!mailableVendorCount) {
      toast.error('No active vendors with email addresses found')
      return
    }

    setIsSending(true)
    try {
      const response = await sendCadVendorMail({
        request_id: request._id,
        send_all: true,
      })

      if (response.meta.success) {
        toast.success(response.meta.message || 'Email sent to all active vendors')
        onSent?.()
        onClose()
      } else {
        toast.error(response.meta.message || 'Failed to send email')
      }
    } catch (error) {
      console.error('Error sending vendor mail:', error)
      toast.error(error.response?.data?.meta?.message || 'Failed to send email')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <PopupWrapper>
      <div className={styles.container}>
        <div className={popupStyles.headerRow}>
          <span className={popupStyles.headerTitle}>Send Vendor Mail</span>
          <button type="button" className={popupStyles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        {isLoading ? (
          <div className={styles.loadingWrap}>
            <Loading />
          </div>
        ) : (
          <>
            <div className={styles.metaBlock}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Subject</span>
                <span className={styles.metaValue}>{preview?.subject}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>From</span>
                <span className={styles.metaValue}>
                  {preview?.from_name} &lt;{preview?.from}&gt;
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Reply to</span>
                <span className={styles.metaValue}>{preview?.reply_to}</span>
              </div>
            </div>

            <div className={styles.previewWrap}>
              <div
                className={styles.previewContent}
                dangerouslySetInnerHTML={{ __html: preview?.html || '' }}
              />
            </div>

            <div className={styles.actionsBlock}>
              {!vendorOptions.length ? (
                <p className={styles.helperText}>
                  No active vendors found. Add vendors in the Vendors tab first.
                </p>
              ) : !mailableVendorCount ? (
                <p className={styles.helperText}>
                  Active vendors found, but none have an email address. Add emails in the Vendors tab to send mail.
                </p>
              ) : (
                <p className={styles.helperText}>
                  {mailableVendorCount} active vendor{mailableVendorCount === 1 ? '' : 's'} with email available.
                </p>
              )}

              <div className={styles.sendToRow}>
                <label className={styles.sendToLabel} htmlFor="cad-vendor-mail-select">
                  Send to
                </label>
                <div className={styles.sendToControls}>
                  <Select
                    inputId="cad-vendor-mail-select"
                    instanceId="cad-vendor-mail-select"
                    isMulti
                    styles={vendorSelectStyles}
                    options={vendorOptions}
                    value={selectedVendors}
                    onChange={setSelectedVendors}
                    placeholder="Select vendors..."
                    isDisabled={isSending || !vendorOptions.length}
                    className={styles.vendorSelect}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                    menuPosition="fixed"
                    closeMenuOnSelect={false}
                  />
                  <button
                    type="button"
                    className={styles.sendToBtn}
                    onClick={handleSendSelected}
                    disabled={isSending || !selectedVendors.length}
                  >
                    {isSending ? 'Sending...' : 'Send To'}
                  </button>
                </div>
              </div>

              <div className={styles.footerActions}>
                <button
                  type="button"
                  className={popupStyles.skipBtn}
                  onClick={onClose}
                  disabled={isSending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.sendAllBtn}
                  onClick={handleSendAll}
                  disabled={isSending || !mailableVendorCount}
                >
                  {isSending ? 'Sending...' : `Send All (${mailableVendorCount})`}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </PopupWrapper>
  )
}

export default CadVendorMailPopup
