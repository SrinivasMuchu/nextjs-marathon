"use client"

import React, { useState, useRef, useId, useEffect } from 'react'
import axios from 'axios'
import { Upload } from 'lucide-react'
import { toast } from 'react-toastify'
import { isValidPhoneNumber } from 'react-phone-number-input'
import ReactPhoneNumber from '@/Components/CommonJsx/ReactPhoneNumber'
import { sendGAtagEvent } from '@/common.helper'
import { BASE_URL, CAD_HIRE_DESIGNER_EVENT } from '@/config'
import styles from './CadServiceForm.module.css'
import { MODEL_USE_OPTIONS, SERVICE_OPTIONS, SOFTWARE_FORMAT_OPTIONS } from './cadServiceFormOptions'

const UPLOAD_TIMEOUT_MS = 120000
const PRESIGNED_TIMEOUT_MS = 30000
const LINKEDIN_CAD_SERVICE_CONVERSION_ID = 26345300
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMPTY_FIELD_ERRORS = {
  fullName: '',
  workEmail: '',
  phone: '',
  service: '',
  modelUse: '',
  softwareFormat: '',
  requirement: '',
  file: '',
}

function trackHireDesignerEvent(eventName, extra = {}) {
  sendGAtagEvent({
    event_name: eventName,
    event_category: CAD_HIRE_DESIGNER_EVENT,
    ...extra,
  })
}

function trackLinkedInCadServiceConversion() {
  if (typeof window !== 'undefined' && typeof window.lintrk === 'function') {
    window.lintrk('track', { conversion_id: LINKEDIN_CAD_SERVICE_CONVERSION_ID })
  }
}

function FieldError({ message }) {
  if (!message) return null
  return <p className={styles.formFieldError}>{message}</p>
}

function validateFormFields(formData, uploadedFileUrl) {
  const errors = { ...EMPTY_FIELD_ERRORS }

  if (!String(formData.fullName || '').trim()) {
    errors.fullName = 'Please enter your full name.'
  }

  const email = String(formData.workEmail || '').trim()
  if (!email) {
    errors.workEmail = 'Please enter your work email.'
  } else if (!EMAIL_RE.test(email)) {
    errors.workEmail = 'Please enter a valid email address.'
  }

  const phone = String(formData.phone || '').trim()
  if (!phone) {
    errors.phone = 'Please enter your phone number with country code.'
  } else if (!isValidPhoneNumber(phone)) {
    errors.phone = 'Enter a valid number for the selected country (e.g. +91 and 10 digits for India).'
  }

  if (!formData.service) {
    errors.service = 'Please select a project type.'
  }

  if (!String(formData.requirement || '').trim()) {
    errors.requirement = 'Please describe your project brief.'
  }

  if (!String(uploadedFileUrl || '').trim()) {
    errors.file = 'Please attach a reference file.'
  }

  return errors
}

function CadServiceForm({ onClose, inPopup = false }) {
  const formContext = inPopup ? 'popup' : 'inline'
  const fileInputId = useId()
  const fileInputRef = React.useRef(null)
  const fileUrlRef = useRef('')
  const uploadIdRef = useRef(0)
  const abortControllerRef = useRef(null)
  const hasStartedRef = useRef(false)
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    company: '',
    service: '',
    modelUse: '',
    softwareFormat: '',
    requirement: '',
  })
  const [fieldErrors, setFieldErrors] = useState(EMPTY_FIELD_ERRORS)
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    trackHireDesignerEvent('hire_designer_form_view', {
      form_context: formContext,
      page_path: window.location.pathname,
    })
  }, [formContext])

  const clearFieldError = (fieldName) => {
    setFieldErrors((prev) => (prev[fieldName] ? { ...prev, [fieldName]: '' } : prev))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      trackHireDesignerEvent('hire_designer_form_start', {
        form_context: formContext,
        field_name: name,
      })
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
    clearFieldError(name)
  }

  const uploadToS3 = async (selectedFile, signal) => {
    const presignedRes = await axios.post(
      `${BASE_URL}/v1/cad-creator/get-cad-service-presigned-url`,
      { file: selectedFile.name, filesize: selectedFile.size },
      { timeout: PRESIGNED_TIMEOUT_MS, signal }
    )
    if (!presignedRes.data?.meta?.success || !presignedRes.data?.data?.url) {
      throw new Error(presignedRes.data?.meta?.message || 'Failed to get upload URL')
    }
    const { url, file_url } = presignedRes.data.data
    await axios.put(url, selectedFile, {
      headers: { 'Content-Type': selectedFile.type || 'application/octet-stream' },
      timeout: UPLOAD_TIMEOUT_MS,
      signal,
    })
    return file_url
  }

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    if (abortControllerRef.current) abortControllerRef.current.abort()
    e.target.value = ''
    const thisUploadId = ++uploadIdRef.current
    const controller = new AbortController()
    abortControllerRef.current = controller
    setFile(selectedFile)
    setFileUrl('')
    fileUrlRef.current = ''
    setUploading(true)
    try {
      const url = await uploadToS3(selectedFile, controller.signal)
      if (thisUploadId !== uploadIdRef.current) return
      setFileUrl(url)
      fileUrlRef.current = url
      clearFieldError('file')
      trackHireDesignerEvent('hire_designer_form_file_upload_success', {
        form_context: formContext,
      })
    } catch (err) {
      if (axios.isCancel(err) || err.name === 'CanceledError' || err.name === 'AbortError') return
      if (thisUploadId !== uploadIdRef.current) return
      const msg = err.response?.data?.meta?.message || err.message || 'File upload failed. Please try again.'
      trackHireDesignerEvent('hire_designer_form_file_upload_error', {
        form_context: formContext,
      })
      toast.error(msg)
      setFile(null)
      setFileUrl('')
      fileUrlRef.current = ''
    } finally {
      abortControllerRef.current = null
      if (thisUploadId === uploadIdRef.current) setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const uploadedFileUrl = fileUrlRef.current || fileUrl
    const errors = validateFormFields(formData, uploadedFileUrl)
    setFieldErrors(errors)

    const firstError = Object.values(errors).find(Boolean)
    if (firstError) {
      toast.error(firstError)
      return
    }

    trackHireDesignerEvent('hire_designer_form_submit_click', {
      form_context: formContext,
      service_type: formData.service || 'unknown',
      has_file: true,
    })
    if (!inPopup) {
      trackLinkedInCadServiceConversion()
    }
    setLoading(true)
    try {
      const payload = {
        full_name: formData.fullName.trim(),
        email: formData.workEmail.trim(),
        phone_number: String(formData.phone || '').trim(),
        company_name: formData.company || '',
        what_do_you_need: formData.service || '',
        model_use: formData.modelUse || '',
        software_format: formData.softwareFormat || '',
        requirement: formData.requirement.trim(),
        file: uploadedFileUrl,
      }

      const response = await axios.post(
        `${BASE_URL}/v1/cad-creator/create-cad-service-user`,
        payload
      )

      if (response.data?.meta?.success) {
        trackHireDesignerEvent('hire_designer_form_submit_success', {
          form_context: formContext,
          service_type: formData.service || 'unknown',
        })
        toast.success('Request submitted! We\'ll reply within 24 hours.')
        setFormData({
          fullName: '',
          workEmail: '',
          phone: '',
          company: '',
          service: '',
          modelUse: '',
          softwareFormat: '',
          requirement: '',
        })
        setFieldErrors(EMPTY_FIELD_ERRORS)
        setFile(null)
        setFileUrl('')
        fileUrlRef.current = ''
        if (fileInputRef.current) fileInputRef.current.value = ''
        hasStartedRef.current = false
        onClose?.()
      } else {
        trackHireDesignerEvent('hire_designer_form_submit_error', {
          form_context: formContext,
          error_type: 'api_response',
        })
        toast.error(response.data?.meta?.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('CAD service request error:', err)
      trackHireDesignerEvent('hire_designer_form_submit_error', {
        form_context: formContext,
        error_type: 'network_or_server',
      })
      toast.error(err.response?.data?.meta?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formContent = (
    <>
      <div className={styles.formKicker}>Start with one clear brief</div>
      <h2 className={styles.formTitle}>Tell Us What You Need Designed</h2>
      <p className={styles.formSubtitle}>
        Give us enough information to understand the scope, required output and timeline. A reference file is required
        to start matching.
      </p>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="fullName">Full name *</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className={`${styles.formInput} ${fieldErrors.fullName ? styles.formInputError : ''}`}
            placeholder="Jane Smith"
            value={formData.fullName}
            onChange={handleChange}
          />
          <FieldError message={fieldErrors.fullName} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="workEmail">Work email *</label>
          <input
            id="workEmail"
            name="workEmail"
            type="email"
            className={`${styles.formInput} ${fieldErrors.workEmail ? styles.formInputError : ''}`}
            placeholder="jane@company.com"
            value={formData.workEmail}
            onChange={handleChange}
          />
          <FieldError message={fieldErrors.workEmail} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="cad-phone-input">Phone / WhatsApp *</label>
          <ReactPhoneNumber
            phoneNumber={formData.phone}
            setPhoneNumber={(value) => {
              if (!hasStartedRef.current) {
                hasStartedRef.current = true
                trackHireDesignerEvent('hire_designer_form_start', {
                  form_context: formContext,
                  field_name: 'phone',
                })
              }
              setFormData((prev) => ({ ...prev, phone: value || '' }))
              clearFieldError('phone')
            }}
            styles={styles}
            classname={fieldErrors.phone ? 'formPhoneInputError' : 'formPhoneInput'}
            id="cad-phone-input"
          />
          <FieldError message={fieldErrors.phone} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            className={styles.formInput}
            placeholder="Company name"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
          <label className={styles.formLabel} htmlFor="service">Project type *</label>
          <select
            id="service"
            name="service"
            className={`${styles.formSelect} ${fieldErrors.service ? styles.formSelectError : ''}`}
            value={formData.service}
            onChange={handleChange}
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value || 'placeholder'} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <FieldError message={fieldErrors.service} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="softwareFormat">Preferred CAD tool</label>
          <select
            id="softwareFormat"
            name="softwareFormat"
            className={styles.formSelect}
            value={formData.softwareFormat}
            onChange={handleChange}
          >
            {SOFTWARE_FORMAT_OPTIONS.map((opt) => (
              <option key={opt.value || 'placeholder'} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="modelUse">When do you need support?</label>
          <select
            id="modelUse"
            name="modelUse"
            className={styles.formSelect}
            value={formData.modelUse}
            onChange={handleChange}
          >
            {MODEL_USE_OPTIONS.map((opt) => (
              <option key={opt.value || 'placeholder'} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
          <label className={styles.formLabel} htmlFor="requirement">Project brief *</label>
          <textarea
            id="requirement"
            name="requirement"
            className={`${styles.formTextarea} ${fieldErrors.requirement ? styles.formTextareaError : ''}`}
            placeholder="Example: We need a sheet-metal enclosure model and manufacturing drawings in SOLIDWORKS. The internal layout is ready, and we need the first version within two weeks."
            value={formData.requirement}
            onChange={handleChange}
          />
          <FieldError message={fieldErrors.requirement} />
        </div>
      </div>

      <label
        className={`${styles.uploadSection} ${fieldErrors.file ? styles.uploadSectionError : ''}`}
        htmlFor={fileInputId}
      >
        <input
          ref={fileInputRef}
          id={fileInputId}
          type="file"
          className={styles.uploadInput}
          accept=".pdf,.jpg,.jpeg,.png,.sketch,.dwg,.dxf,.step,.stp,.iges"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Upload className={styles.uploadIcon} size={18} />
        <span className={styles.uploadText}>
          {uploading
            ? 'Uploading...'
            : file
              ? `${file.name}${fileUrl ? ' ✓' : ''}`
              : 'Attach a reference file *'}
        </span>
      </label>
      <FieldError message={fieldErrors.file} />

      <div className={styles.formAssurance}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M12 14v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>
          Your brief is reviewed by Marathon. Detailed files are shared only with the agency you select, with an NDA
          where required.
        </span>
      </div>
    </>
  )

  const submitButton = (
    <>
      <button type="submit" className={styles.submitBtn} disabled={loading || uploading}>
        Get Matched With CAD Agencies →
      </button>
      {!inPopup && (
        <p className={styles.formNote}>Submitting a brief does not commit you to an agency or quotation.</p>
      )}
    </>
  )

  if (inPopup) {
    return (
      <form className={`${styles.formCard} ${styles.formCardPopup}`} onSubmit={handleSubmit} noValidate>
        <div className={styles.formScrollContent}>{formContent}</div>
        <div className={styles.formStickyFooter}>{submitButton}</div>
      </form>
    )
  }

  return (
    <form className={styles.formCard} onSubmit={handleSubmit} noValidate>
      {formContent}
      {submitButton}
    </form>
  )
}

export default CadServiceForm
