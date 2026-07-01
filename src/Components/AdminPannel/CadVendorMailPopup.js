"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import Select from 'react-select'
import PopupWrapper from '../CommonJsx/PopupWrapper'
import popupStyles from '../CommonJsx/CommonStyles.module.css'
import {
  fetchCadVendorMailPreview,
  previewCadVendorMail,
  sendCadVendorMail,
} from '@/api/adminVendorsApi'
import Loading from '../CommonJsx/Loaders/Loading'
import styles from './CadVendorMailPopup.module.css'

const EMPTY_CONTENT = {
  project_type: '',
  model_use: '',
  software_format: '',
  requirement: '',
}

const BRIEF_MIN_HEIGHT = 220
const BRIEF_MAX_HEIGHT = 420

function adjustBriefHeight(textarea) {
  if (!textarea) return
  textarea.style.height = 'auto'
  const nextHeight = Math.min(
    Math.max(textarea.scrollHeight, BRIEF_MIN_HEIGHT),
    BRIEF_MAX_HEIGHT,
  )
  textarea.style.height = `${nextHeight}px`
  textarea.style.overflowY = textarea.scrollHeight > BRIEF_MAX_HEIGHT ? 'auto' : 'hidden'
}

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
  const [isRefreshingPreview, setIsRefreshingPreview] = useState(false)
  const [preview, setPreview] = useState(null)
  const [selectedVendors, setSelectedVendors] = useState([])
  const [subject, setSubject] = useState('')
  const [mailContent, setMailContent] = useState(EMPTY_CONTENT)
  const [defaultContent, setDefaultContent] = useState(EMPTY_CONTENT)
  const [previewHtml, setPreviewHtml] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [subjectError, setSubjectError] = useState('')
  const [contentErrors, setContentErrors] = useState({})
  const briefRef = useRef(null)

  useEffect(() => {
    adjustBriefHeight(briefRef.current)
  }, [mailContent.requirement])

  useEffect(() => {
    const loadPreview = async () => {
      setIsLoading(true)
      try {
        const response = await fetchCadVendorMailPreview(request._id)

        if (response.meta.success) {
          const content = response.data.content || {}
          const editableContent = {
            project_type: content.project_type || '',
            model_use: content.model_use || '',
            software_format: content.software_format || '',
            requirement: content.requirement || '',
          }
          setPreview(response.data)
          setSubject(response.data.subject || '')
          setMailContent(editableContent)
          setDefaultContent(editableContent)
          setPreviewHtml(response.data.html || '')
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

  const refreshPreview = useCallback(async (nextSubject, nextContent) => {
    setIsRefreshingPreview(true)
    try {
      const response = await previewCadVendorMail({
        request_id: request._id,
        subject: nextSubject,
        content: nextContent,
      })
      if (response.meta.success) {
        setPreviewHtml(response.data.html || '')
      }
    } catch (error) {
      console.error('Error refreshing mail preview:', error)
    } finally {
      setIsRefreshingPreview(false)
    }
  }, [request._id])

  useEffect(() => {
    if (!showPreview || isLoading) return undefined

    const timer = setTimeout(() => {
      refreshPreview(subject, mailContent)
    }, 400)

    return () => clearTimeout(timer)
  }, [subject, mailContent, showPreview, isLoading, refreshPreview])

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

  const handleContentChange = (field) => (event) => {
    const value = event.target.value
    setMailContent((prev) => ({ ...prev, [field]: value }))
    if (contentErrors[field]) {
      setContentErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleRequirementChange = (event) => {
    handleContentChange('requirement')(event)
    adjustBriefHeight(event.target)
  }

  const validateMailContent = () => {
    const nextSubjectError = subject.trim() ? '' : 'Subject is required'
    const nextContentErrors = {}
    if (!mailContent.project_type.trim()) {
      nextContentErrors.project_type = 'Project type is required'
    }
    if (!mailContent.requirement.trim()) {
      nextContentErrors.requirement = 'Project brief is required'
    }
    setSubjectError(nextSubjectError)
    setContentErrors(nextContentErrors)
    return !nextSubjectError && Object.keys(nextContentErrors).length === 0
  }

  const buildSendPayload = (extra = {}) => ({
    request_id: request._id,
    subject: subject.trim(),
    content: {
      project_type: mailContent.project_type.trim(),
      model_use: mailContent.model_use.trim(),
      software_format: mailContent.software_format.trim(),
      requirement: mailContent.requirement.trim(),
    },
    ...extra,
  })

  const handleResetFields = () => {
    setSubject(preview?.subject || '')
    setMailContent(defaultContent)
    setSubjectError('')
    setContentErrors({})
    toast.info('Fields reset to original request values.')
  }

  const handleSendSelected = async () => {
    if (!selectedVendors.length) {
      toast.error('Select at least one vendor')
      return
    }
    if (!validateMailContent()) return

    setIsSending(true)
    try {
      const response = await sendCadVendorMail(
        buildSendPayload({
          vendor_ids: selectedVendors.map((option) => option.value),
          send_all: false,
        }),
      )

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
    if (!validateMailContent()) return

    setIsSending(true)
    try {
      const response = await sendCadVendorMail(buildSendPayload({ send_all: true }))

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
            <div className={styles.bodyScroll}>
              <div className={styles.metaBlock}>
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

              <div className={styles.editSection}>
                <div className={styles.editSectionHeader}>
                  <span className={styles.bodyTitle}>Edit email content</span>
                  <button
                    type="button"
                    className={styles.resetBtn}
                    onClick={handleResetFields}
                    disabled={isSending}
                  >
                    Reset fields
                  </button>
                </div>

                <p className={styles.editHint}>
                  Edit the fields below. Email layout and styling stay fixed on send.
                </p>

                <div className={styles.formGrid}>
                  <div className={`${styles.formField} ${styles.formFieldFull}`}>
                    <label className={styles.fieldLabel} htmlFor="vendor-mail-subject">Subject *</label>
                    <input
                      id="vendor-mail-subject"
                      type="text"
                      className={`${styles.textInput} ${subjectError ? styles.inputError : ''}`}
                      value={subject}
                      onChange={(e) => {
                        setSubject(e.target.value)
                        if (subjectError) setSubjectError('')
                      }}
                      disabled={isSending}
                    />
                    {subjectError ? <span className={styles.errorText}>{subjectError}</span> : null}
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel} htmlFor="vendor-mail-project-type">Project type *</label>
                    <input
                      id="vendor-mail-project-type"
                      type="text"
                      className={`${styles.textInput} ${contentErrors.project_type ? styles.inputError : ''}`}
                      value={mailContent.project_type}
                      onChange={handleContentChange('project_type')}
                      disabled={isSending}
                    />
                    {contentErrors.project_type ? (
                      <span className={styles.errorText}>{contentErrors.project_type}</span>
                    ) : null}
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel} htmlFor="vendor-mail-model-use">Model use</label>
                    <input
                      id="vendor-mail-model-use"
                      type="text"
                      className={styles.textInput}
                      value={mailContent.model_use}
                      onChange={handleContentChange('model_use')}
                      disabled={isSending}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel} htmlFor="vendor-mail-software">Software</label>
                    <input
                      id="vendor-mail-software"
                      type="text"
                      className={styles.textInput}
                      value={mailContent.software_format}
                      onChange={handleContentChange('software_format')}
                      disabled={isSending}
                    />
                  </div>

                  <div className={`${styles.formField} ${styles.formFieldFull}`}>
                    <label className={styles.fieldLabel} htmlFor="vendor-mail-requirement">Project brief *</label>
                    <textarea
                      ref={briefRef}
                      id="vendor-mail-requirement"
                      className={`${styles.textArea} ${styles.briefArea} ${contentErrors.requirement ? styles.inputError : ''}`}
                      value={mailContent.requirement}
                      onChange={handleRequirementChange}
                      disabled={isSending}
                      rows={10}
                      placeholder="Describe the project requirements..."
                    />
                    {contentErrors.requirement ? (
                      <span className={styles.errorText}>{contentErrors.requirement}</span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className={styles.previewToggleSection}>
                <button
                  type="button"
                  className={styles.previewToggleBtn}
                  onClick={() => setShowPreview((value) => !value)}
                  disabled={isSending}
                >
                  {showPreview ? 'Hide email preview' : 'Show email preview'}
                  {isRefreshingPreview && showPreview ? ' (updating…)' : ''}
                </button>

                {showPreview ? (
                  <div className={styles.previewWrap}>
                    <div
                      className={styles.previewContent}
                      dangerouslySetInnerHTML={{ __html: previewHtml || '' }}
                    />
                  </div>
                ) : null}
              </div>
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
