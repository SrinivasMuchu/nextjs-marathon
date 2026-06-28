"use client"

import React, { useEffect, useState } from 'react'
import PopupWrapper from '../CommonJsx/PopupWrapper'
import popupStyles from '../CommonJsx/CommonStyles.module.css'
import CreatableSelect from 'react-select/creatable'
import { createDropdownCustomStyles } from '@/common.helper'
import { createVendor, createVendorCategory, updateVendor } from '@/api/adminVendorsApi'
import { toast } from 'react-toastify'
import styles from './VendorFormPopup.module.css'

const EMPTY_FORM = {
  name: '',
  phone_number: '',
  email: '',
  whatsapp_group_link: '',
  website_link: '',
  is_active: true,
}

const vendorCategorySelectStyles = {
  ...createDropdownCustomStyles,
  control: (provided, state) => ({
    ...createDropdownCustomStyles.control(provided, state),
    marginBottom: 0,
    minHeight: '42px',
  }),
}

function VendorFormPopup({ onClose, onSaved, vendor, categories, onCategoriesChange }) {
  const isEdit = Boolean(vendor?._id)
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)

  useEffect(() => {
    if (!vendor) {
      setForm(EMPTY_FORM)
      setSelectedCategories([])
      return
    }

    setForm({
      name: vendor.name || '',
      phone_number: vendor.phone_number || '',
      email: vendor.email || '',
      whatsapp_group_link: vendor.whatsapp_group_link || '',
      website_link: vendor.website_link || '',
      is_active: vendor.is_active !== false,
    })
    setSelectedCategories(
      (vendor.categories || []).map((category) => ({
        value: category._id,
        label: category.name,
      })),
    )
  }, [vendor])

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }))

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleCreateCategory = async (inputValue) => {
    const name = String(inputValue || '').trim()
    if (!name) return

    setIsCreatingCategory(true)
    try {
      const response = await createVendorCategory(name)

      if (!response.meta.success) {
        toast.error(response.meta.message || 'Failed to create category')
        return
      }

      const category = response.data.category
      onCategoriesChange([...categories, category])
      setSelectedCategories((prev) => [
        ...prev,
        { value: category._id, label: category.name },
      ])
      toast.success('Category created')
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error(error.response?.data?.meta?.message || 'Failed to create category')
    } finally {
      setIsCreatingCategory(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedName = form.name.trim()
    if (!trimmedName) {
      toast.error('Name / Agency Name is required')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        name: trimmedName,
        phone_number: form.phone_number.trim(),
        email: form.email.trim(),
        category_ids: selectedCategories.map((option) => option.value),
        whatsapp_group_link: form.whatsapp_group_link.trim(),
        website_link: form.website_link.trim(),
        is_active: form.is_active,
      }

      const response = isEdit
        ? await updateVendor({ vendor_id: vendor._id, ...payload })
        : await createVendor(payload)

      if (response.meta.success) {
        toast.success(response.meta.message || (isEdit ? 'Vendor updated' : 'Vendor created'))
        onSaved(response.data.vendor)
        onClose()
      } else {
        toast.error(response.meta.message || 'Failed to save vendor')
      }
    } catch (error) {
      console.error('Error saving vendor:', error)
      toast.error(error.response?.data?.meta?.message || 'Failed to save vendor')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PopupWrapper>
      <div className={`${popupStyles.popupContainer} ${styles.popup}`}>
        <div className={popupStyles.headerRow}>
          <span className={popupStyles.headerTitle}>
            {isEdit ? 'Edit Vendor' : 'Add Vendor'}
          </span>
          <button type="button" className={popupStyles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="vendor-name">
                Name / Agency Name *
              </label>
              <input
                id="vendor-name"
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Enter vendor or agency name"
                className={styles.input}
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="vendor-phone">
                Phone Number
              </label>
              <input
                id="vendor-phone"
                type="text"
                value={form.phone_number}
                onChange={handleChange('phone_number')}
                placeholder="Enter phone number"
                className={styles.input}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="vendor-email">
                Email
              </label>
              <input
                id="vendor-email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="Enter vendor email"
                className={styles.input}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="vendor-status">
                Status
              </label>
              <select
                id="vendor-status"
                value={form.is_active ? 'active' : 'inactive'}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    is_active: event.target.value === 'active',
                  }))
                }
                disabled={isSubmitting}
                className={styles.select}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label} htmlFor="vendor-categories">
                Specialised In
              </label>
              <CreatableSelect
                inputId="vendor-categories"
                isMulti
                styles={vendorCategorySelectStyles}
                options={categoryOptions}
                value={selectedCategories}
                onChange={setSelectedCategories}
                onCreateOption={handleCreateCategory}
                isLoading={isCreatingCategory}
                placeholder="Select or create categories"
                isDisabled={isSubmitting}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="vendor-whatsapp">
                WhatsApp Group Link
              </label>
              <input
                id="vendor-whatsapp"
                type="url"
                value={form.whatsapp_group_link}
                onChange={handleChange('whatsapp_group_link')}
                placeholder="https://chat.whatsapp.com/..."
                className={styles.input}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="vendor-website">
                Website Link
              </label>
              <input
                id="vendor-website"
                type="url"
                value={form.website_link}
                onChange={handleChange('website_link')}
                placeholder="https://example.com"
                className={styles.input}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className={`${popupStyles.actionsRow} ${styles.actions}`}>
            <button
              type="button"
              onClick={onClose}
              className={popupStyles.skipBtn}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={popupStyles.nextBtn}
              disabled={!form.name.trim() || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Vendor' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </div>
    </PopupWrapper>
  )
}

export default VendorFormPopup
