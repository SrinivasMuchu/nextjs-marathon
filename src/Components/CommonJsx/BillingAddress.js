"use client"
import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import PopupWrapper from './PopupWrapper'
import styles from './CommonStyles.module.css'
import axios from 'axios'
import { BASE_URL } from '@/config';
import { GoPencil } from "react-icons/go";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

function BillingAddress({  onClose, onSave, cadId }) {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    gstNumber: '',
    currency: ''
  })

  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [editAddressId, setEditAddressId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  // Helper: reset form for "add new address"
  const resetForm = () => {
    setEditAddressId(null)
    setFormData({
      fullName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
      gstNumber: '',
      currency: ''
    })
  }

  // Map saved address to form fields
  const fillFormFromAddress = (addr) => {
    const selectedCountry =
      countries.find(c => c.label === addr.country || c.value === addr.country) || null;

    setEditAddressId(addr._id);
    setFormData({
      fullName: addr.name || "",
      address1: addr.street_address || "",
      address2: addr.appartment_address || "",
      city: addr.city || "",
      state: addr.state || "",
      postalCode: addr.postal_code || "",
      country: selectedCountry,
      phone: addr.phone || "",
      gstNumber: addr.gstNumber || "",
      currency: addr.currency || ""
    });
  }

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries()
  }, [])
  const fetchAddresses = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${BASE_URL}/v1/payment/get-billing`, {
        headers: { "user-uuid": localStorage.getItem("uuid") }
      })
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || [])
      setAddresses(list)

      // Do NOT auto-select anything. If previously selected address disappeared, clear selection and form.
      if (selectedId && !list.find(a => a._id === selectedId)) {
        setSelectedId(null)
        resetForm()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAddresses() }, [])

  // Auto-populate currency when country changes
  useEffect(() => {
    if (formData.country?.value) {
      getCurrencyByCountry(formData.country.value)
    }
  }, [formData.country])

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
      const data = await response.json()
      const countryOptions = data.map(country => ({
        value: country.cca2,
        label: country.name.common
      })).sort((a, b) => a.label.localeCompare(b.label))
      setCountries(countryOptions)
    } catch (error) {
      console.error('Error fetching countries:', error)
      // Fallback countries
      setCountries([
        { value: 'US', label: 'United States' },
        { value: 'IN', label: 'India' },
        { value: 'GB', label: 'United Kingdom' },
        { value: 'CA', label: 'Canada' },
        { value: 'AU', label: 'Australia' }
      ])
    }
  }

  const getCurrencyByCountry = async (countryCode) => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
      const data = await response.json()
      const currencies = data[0].currencies

      for (let key in currencies) {
        const currencyData = {
          value: key,
          label: `${key} - (${currencies[key].symbol})`,
          symbol: currencies[key].symbol,
          name: currencies[key].name
        }
        
        // Auto-populate the currency field
        setFormData(prev => ({
          ...prev,
          currency: currencyData
        }))
        
        return { code: key, symbol: currencies[key].symbol, name: currencies[key].name }
      }
    } catch (error) {
      console.error('Error fetching currency for country:', error)
      
      // Fallback currency mapping with symbols
      
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      name: formData.fullName,
      street_address: formData.address1,
      appartment_address: formData.address2,
      city: formData.city,
      state: formData.state,
      postal_code: formData.postalCode,
      country: formData.country?.label || '',
      phone: formData.phone,
      payment_billing_id: editAddressId
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/v1/payment/create-billing`,
        payload,
        { headers: { 'user-uuid': localStorage.getItem('uuid') } }
      )
      if (response?.data?.meta?.success) {
        onSave && onSave(cadId,response.data.data._id,formData.currency?.value) // Pass billing ID back to parent
        onClose && onClose()
      }
    } catch (error) {
      console.error('Error creating billing address:', error)
      alert(error?.response?.data?.message || 'Failed to save billing address. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Checkbox toggle: select to edit, unselect to add new
  const handleAddressToggle = (addr, checked) => {
    if (checked) {
      setSelectedId(addr._id)
      fillFormFromAddress(addr)
    } else {
      if (selectedId === addr._id) {
        setSelectedId(null)
        resetForm()
      }
    }
  }

  const handleEdit = (addr, e) => {
    e.preventDefault();
    setSelectedId(addr._id)
    fillFormFromAddress(addr)
  }

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '40px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      '&:hover': {
        border: '1px solid #007bff'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#007bff' : 'white',
      color: state.isFocused ? 'white' : 'black',
      cursor: 'pointer'
    })
  }

  // if (!isOpen) return null

  return (
    <PopupWrapper onClose={onClose}>
      <div className={styles["billing-address-container"]}>
        <div className={styles["billing-header"]}>
          <h2>Billing Address</h2>
          <button className={styles["close-btn"]} onClick={onClose}>×</button>
        </div>

        <form className={styles["billing-form"]}>
          {addresses?.length > 0 && (
            <div className={styles.addressRow}>
              {addresses.map(addr => (
                <div key={addr._id} className={styles.addressCard}>
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedId === addr._id}
                      onChange={(e) => handleAddressToggle(addr, e.target.checked)}
                      style={{ marginRight: 8 }}
                    />
                    <b>{addr.name}</b>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <div>{addr.street_address}</div>
                    {addr.appartment_address ? <div>{addr.appartment_address}</div> : null}
                    <div>{addr.city}{addr.state ? `, ${addr.state}` : ""} {addr.postal_code}</div>
                    <div>{addr.country}</div>
                    {addr.phone ? <div>Phone: {addr.phone}</div> : null}
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    {/* Optional edit button; checkbox already puts it in edit mode */}
                    {/* <button onClick={(e) => handleEdit(addr, e)}><GoPencil/></button> */}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* <div className={styles["form-group"]}>
            <label htmlFor="company">Company (Optional)</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Enter company name"
            />
          </div> */}

          <div className={styles["form-group"]}>
            <label htmlFor="address1">Address Line 1 *</label>
            <input
              type="text"
              id="address1"
              name="address1"
              value={formData.address1}
              onChange={handleInputChange}
              placeholder="Enter street address"
              required
            />
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="address2">Address Line 2 (Optional)</label>
            <input
              type="text"
              id="address2"
              name="address2"
              value={formData.address2}
              onChange={handleInputChange}
              placeholder="Apartment, suite, unit, etc."
            />
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Enter postal code"
              />
            </div>
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="country">Country *</label>
              <Select
                name="country"
                value={formData.country}
                onChange={handleSelectChange}
                options={countries}
                styles={customSelectStyles}
                placeholder="Select Country"
                isSearchable
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="state">State/Province</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state/province"
              />
            </div>
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>
            {/* <div className={styles["form-group"]}>
              <label htmlFor="currency">Currency </label>
              <Select
                name="currency"
                value={formData.currency}
                onChange={handleSelectChange}
                options={[formData.currency].filter(Boolean)}
                styles={customSelectStyles}
                placeholder="Currency"
                isSearchable
                isDisabled={true}
                formatOptionLabel={(option) => (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{option.label}</span>
                    <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>{option.symbol}</span>
                  </div>
                )}
              />
            </div> */}
          </div>

           <div className={styles["form-row"]}>
          {/*  <div className={styles["form-group"]}>
              <label htmlFor="gstNumber">GST Number</label>
              <input
                type="text"
                id="gstNumber"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                placeholder="Enter GST number"
              />
            </div>*/}
            <div className={styles["form-group"]}>
              <label htmlFor="currency">Currency </label>
              <Select
                name="currency"
                value={formData.currency}
                onChange={handleSelectChange}
                options={[formData.currency].filter(Boolean)}
                styles={customSelectStyles}
                placeholder="Currency"
                isSearchable
                isDisabled={true}
                formatOptionLabel={(option) => (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{option.label}</span>
                    <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>{option.symbol}</span>
                  </div>
                )}
              />
            </div>
          </div> 
        </form>

        <div className={styles["form-actions"]}>
          <button type="button" onClick={onClose} className={styles["cancel-btn"]}>
            Cancel
          </button>
          <button onClick={handleSubmit} type="submit" disabled={loading} className={styles["save-btn"]}>
            {loading ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default BillingAddress