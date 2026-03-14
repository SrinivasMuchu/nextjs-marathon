"use client"

import React, { useState } from 'react'
import { Send, Upload } from 'lucide-react'
import ReactPhoneNumber from '@/Components/CommonJsx/ReactPhoneNumber'
import styles from './CadServiceForm.module.css'

const SERVICE_OPTIONS = [
  { value: '', label: 'Select a service...' },
  { value: 'modeling', label: '3D Modeling' },
  { value: 'drafting', label: '2D Drafting' },
  { value: 'rendering', label: 'Rendering' },
  { value: 'conversion', label: 'File Conversion' },
  { value: 'reverse-engineering', label: 'Reverse Engineering' },
  { value: 'other', label: 'Other' },
]

function CadServiceForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    company: '',
    service: '',
    requirement: '',
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) setFile(selectedFile)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // TODO: wire to API endpoint
    console.log('Form submit:', formData, file)
    setLoading(false)
  }

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
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

      <label className={styles.uploadSection} htmlFor="fileUpload">
        <input
          id="fileUpload"
          type="file"
          className={styles.uploadInput}
          accept=".pdf,.jpg,.jpeg,.png,.sketch,.dwg,.dxf,.step,.stp,.iges"
          onChange={handleFileChange}
        />
        <Upload className={styles.uploadIcon} size={20} />
        <span className={styles.uploadText}>
          Upload reference file (optional - sketch, photo, PDF)
          {file && ` • ${file.name}`}
        </span>
      </label>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        Get a Quote in 24 Hours
        <Send size={18} />
      </button>
    </form>
  )
}

export default CadServiceForm
