"use client"

import React, { useState, useRef, useId } from 'react'
import axios from 'axios'
import { Send, Upload } from 'lucide-react'
import { toast } from 'react-toastify'
import ReactPhoneNumber from '@/Components/CommonJsx/ReactPhoneNumber'
import { BASE_URL } from '@/config'
import styles from './CadServiceForm.module.css'

const UPLOAD_TIMEOUT_MS = 120000 // 2 min for large CAD files
const PRESIGNED_TIMEOUT_MS = 30000 // 30 s for presigned

const SERVICE_OPTIONS = [
  { value: '', label: 'Select a service...' },
  { value: 'modeling', label: '3D Modeling' },
  { value: 'drafting', label: '2D Drafting' },
  { value: 'rendering', label: 'Rendering' },
  { value: 'conversion', label: 'File Conversion' },
  { value: 'reverse-engineering', label: 'Reverse Engineering' },
  { value: 'other', label: 'Other' },
]

function CadServiceForm({ onClose, inPopup = false }) {
  const fileInputId = useId()
  const fileInputRef = React.useRef(null)
  const fileUrlRef = useRef('')
  const uploadIdRef = useRef(0)
  const abortControllerRef = useRef(null)
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    company: '',
    service: '',
    requirement: '',
  })
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
    // Abort any in-flight upload
    if (abortControllerRef.current) abortControllerRef.current.abort()
    // Reset input so same file can be re-selected (some browsers don't fire onChange otherwise)
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
      // Ignore if user selected a different file before this upload finished
      if (thisUploadId !== uploadIdRef.current) return
      setFileUrl(url)
    } catch (err) {
      if (axios.isCancel(err) || err.name === 'CanceledError' || err.name === 'AbortError') return
      if (thisUploadId !== uploadIdRef.current) return
      const msg = err.response?.data?.meta?.message || err.message || 'File upload failed. Please try again.'
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
    setLoading(true)
    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.workEmail,
        phone_number: formData.phone || '',
        company_name: formData.company || '',
        what_do_you_need: formData.service || '',
        requirement: formData.requirement,
        file: fileUrlRef.current || fileUrl || '',
      }

      const response = await axios.post(
        `${BASE_URL}/v1/cad-creator/create-cad-service-user`,
        payload
      )

      if (response.data?.meta?.success) {
        toast.success('Request submitted! We\'ll reply within 24 hours.')
        setFormData({
          fullName: '',
          workEmail: '',
          phone: '',
          company: '',
          service: '',
          requirement: '',
        })
        setFile(null)
        setFileUrl('')
        fileUrlRef.current = ''
        if (fileInputRef.current) fileInputRef.current.value = ''
        onClose?.()
      } else {
        toast.error(response.data?.meta?.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('CAD service request error:', err)
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
            className={styles.formInput}
            placeholder="Jane Smith"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="workEmail">WORK EMAIL *</label>
          <input
            id="workEmail"
            name="workEmail"
            type="email"
            className={styles.formInput}
            placeholder="jane@company.com"
            value={formData.workEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="cad-phone-input">PHONE / WHATSAPP</label>
          <ReactPhoneNumber
            phoneNumber={formData.phone}
            setPhoneNumber={(value) => setFormData((prev) => ({ ...prev, phone: value || '' }))}
            styles={styles}
            classname="formPhoneInput"
            id="cad-phone-input"
          />
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
            className={styles.formSelect}
            value={formData.service}
            onChange={handleChange}
            required
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
          <label className={styles.formLabel} htmlFor="requirement">DESCRIBE YOUR REQUIREMENT *</label>
          <textarea
            id="requirement"
            name="requirement"
            className={styles.formTextarea}
            placeholder="E.g. 10 sheet metal parts in SolidWorks, need STEP + drawing packs, deadline in 5 days..."
            value={formData.requirement}
            onChange={handleChange}
            required
          />
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
      <form className={`${styles.formCard} ${styles.formCardPopup}`} onSubmit={handleSubmit}>
        <div className={styles.formScrollContent}>{formContent}</div>
        <div className={styles.formStickyFooter}>{submitButton}</div>
      </form>
    )
  }

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      {formContent}
      {submitButton}
    </form>
  )
}

export default CadServiceForm
