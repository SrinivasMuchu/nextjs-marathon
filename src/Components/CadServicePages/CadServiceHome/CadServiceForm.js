"use client"

import React, { useState, useRef, useId, useEffect } from 'react'
import axios from 'axios'
import { Send, Upload } from 'lucide-react'
import { toast } from 'react-toastify'
import { isValidPhoneNumber } from 'react-phone-number-input'
import ReactPhoneNumber from '@/Components/CommonJsx/ReactPhoneNumber'
import { sendGAtagEvent } from '@/common.helper'
import { BASE_URL, CAD_HIRE_DESIGNER_EVENT } from '@/config'
import styles from './CadServiceForm.module.css'
import { MODEL_USE_OPTIONS } from './cadServiceFormOptions'
import SoftwareFormatSelect from './SoftwareFormatSelect'

const UPLOAD_TIMEOUT_MS = 120000 // 2 min for large CAD files
const PRESIGNED_TIMEOUT_MS = 30000 // 30 s for presigned
const LINKEDIN_CAD_SERVICE_CONVERSION_ID = 26345300
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SERVICE_OPTIONS = [
  { value: '', label: 'Select a service...' },
  { value: 'modeling', label: '3D Modeling' },
  { value: 'drafting', label: '2D Drafting' },
  { value: 'rendering', label: 'Rendering' },
  { value: 'conversion', label: 'File Conversion' },
  { value: 'reverse-engineering', label: 'Reverse Engineering' },
  { value: 'other', label: 'Other' },
]

const EMPTY_FIELD_ERRORS = {
  fullName: '',
  workEmail: '',
  phone: '',
  service: '',
  modelUse: '',
  softwareFormat: '',
  requirement: '',
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

function validateFormFields(formData) {
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
    errors.service = 'Please select what you need.'
  }

  if (!formData.modelUse) {
    errors.modelUse = 'Please select how the model will be used.'
  }

  if (!String(formData.softwareFormat || '').trim()) {
    errors.softwareFormat = 'Please select a software preference.'
  }

  if (!String(formData.requirement || '').trim()) {
    errors.requirement = 'Please describe your requirement.'
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

  const handleSoftwareFormatChange = (value) => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      trackHireDesignerEvent('hire_designer_form_start', {
        form_context: formContext,
        field_name: 'softwareFormat',
      })
    }
    setFormData((prev) => ({ ...prev, softwareFormat: value }))
    clearFieldError('softwareFormat')
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
      fileUrlRef.current = ''
    } finally {
      abortControllerRef.current = null
      if (thisUploadId === uploadIdRef.current) setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateFormFields(formData)
    setFieldErrors(errors)

    const firstError = Object.values(errors).find(Boolean)
    if (firstError) {
      toast.error(firstError)
      return
    }

    trackHireDesignerEvent('hire_designer_form_submit_click', {
      form_context: formContext,
      service_type: formData.service || 'unknown',
      has_file: Boolean(fileUrlRef.current || fileUrl),
    })
    if (!inPopup) {
      trackLinkedInCadServiceConversion()
    }
    setLoading(true)
    try {
      const modelUseLabel = MODEL_USE_OPTIONS.find((opt) => opt.value === formData.modelUse)?.label || formData.modelUse || ''
      const payload = {
        full_name: formData.fullName.trim(),
        email: formData.workEmail.trim(),
        phone_number: String(formData.phone || '').trim(),
        company_name: formData.company || '',
        what_do_you_need: formData.service || '',
        model_use: modelUseLabel === 'Select an option...' ? '' : modelUseLabel,
        software_format: formData.softwareFormat || '',
        requirement: formData.requirement.trim(),
        file: fileUrlRef.current || fileUrl || '',
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
      <h2 className={styles.formTitle}>Request CAD Support</h2>
      <p className={styles.formSubtitle}>Fill in the basics - we&apos;ll handle the rest.</p>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="fullName">FULL NAME *</label>
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
          <label className={styles.formLabel} htmlFor="workEmail">WORK EMAIL *</label>
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
          <label className={styles.formLabel} htmlFor="cad-phone-input">PHONE / WHATSAPP *</label>
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
          {/* <p className={styles.formHint}>Select country code, then enter your mobile number (not the full number with country digits repeated).</p> */}
          <FieldError message={fieldErrors.phone} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="company">COMPANY</label>
          <input
            id="company"
            name="company"
            type="text"
            className={styles.formInput}
            placeholder="Acme Corp"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
          <label className={styles.formLabel} htmlFor="service">WHAT DO YOU NEED? *</label>
          <select
            id="service"
            name="service"
            className={`${styles.formSelect} ${fieldErrors.service ? styles.formSelectError : ''}`}
            value={formData.service}
            onChange={handleChange}
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <FieldError message={fieldErrors.service} />
        </div>
        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
          <label className={styles.formLabel} htmlFor="modelUse">WILL THE MODEL BE USED FOR? *</label>
          <select
            id="modelUse"
            name="modelUse"
            className={`${styles.formSelect} ${fieldErrors.modelUse ? styles.formSelectError : ''}`}
            value={formData.modelUse}
            onChange={handleChange}
          >
            {MODEL_USE_OPTIONS.map((opt) => (
              <option key={opt.value || 'placeholder'} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <FieldError message={fieldErrors.modelUse} />
        </div>
        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
          <label className={styles.formLabel} htmlFor="softwareFormat">
            SOFTWARE PREFERENCE FOR MODELLING? *
          </label>
          <SoftwareFormatSelect
            inputId="softwareFormat"
            value={formData.softwareFormat}
            onChange={handleSoftwareFormatChange}
            inPopup={inPopup}
            hasError={Boolean(fieldErrors.softwareFormat)}
          />
          <FieldError message={fieldErrors.softwareFormat} />
        </div>
        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
          <label className={styles.formLabel} htmlFor="requirement">DESCRIBE YOUR REQUIREMENT *</label>
          <textarea
            id="requirement"
            name="requirement"
            className={`${styles.formTextarea} ${fieldErrors.requirement ? styles.formTextareaError : ''}`}
            placeholder="E.g. 10 sheet metal parts in SolidWorks, need STEP + drawing packs, deadline in 5 days..."
            value={formData.requirement}
            onChange={handleChange}
          />
          <FieldError message={fieldErrors.requirement} />
        </div>
      </div>

      <label className={styles.uploadSection} htmlFor={fileInputId}>
        <input
          ref={fileInputRef}
          id={fileInputId}
          type="file"
          className={styles.uploadInput}
          accept=".pdf,.jpg,.jpeg,.png,.sketch,.dwg,.dxf,.step,.stp,.iges"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Upload className={styles.uploadIcon} size={20} />
        <span className={styles.uploadText}>
          {uploading ? 'Uploading...' : 'Upload reference file (optional - sketch, photo, PDF)'}
          {file && ` • ${file.name}${fileUrl ? ' ✓' : ''}`}
        </span>
      </label>
    </>
  )

  const submitButton = (
    <button type="submit" className={styles.submitBtn} disabled={loading || uploading}>
      Get a Quote in 24 Hours
      <Send size={18} />
    </button>
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
