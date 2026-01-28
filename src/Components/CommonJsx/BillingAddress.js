"use client"
import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import PopupWrapper from './PopupWrapper'
import styles from './CommonStyles.module.css'
import axios from 'axios'
import { BASE_URL } from '@/config';
import { GoPencil } from "react-icons/go";
import ReactPhoneNumber from './ReactPhoneNumber';

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

function BillingAddress({  onClose, onSave, cadId, designDetails, setBillerDetails }) {
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
  const [errors, setErrors] = useState({})
  const [showBillingSummary, setShowBillingSummary] = useState(false)
  const [pricingDetails, setPricingDetails] = useState(null)
  const [savedBillingData, setSavedBillingData] = useState(null)

  // Validation function
  const validateForm = () => {
    const newErrors = {}

    // Full Name validation (mandatory, should contain at least one space for first and last name)
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (!formData.fullName.trim().includes(' ')) {
      newErrors.fullName = 'Please enter both first and last name'
    }

    // Phone Number validation (mandatory)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Address Line 1 validation (mandatory)
    if (!formData.address1.trim()) {
      newErrors.address1 = 'Address line 1 is required'
    }

    // City validation (mandatory)
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    // Postal Code validation (mandatory)
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required'
    }

    // Country validation (mandatory)
    if (!formData.country || !formData.country.value) {
      newErrors.country = 'Country is required'
    }

    // State validation (mandatory)
    if (!formData.state.trim()) {
      newErrors.state = 'State/Province is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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
    setErrors({})
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
    setErrors({})
  }

  // Fetch pricing details for billing summary
 

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
      const fallbackCurrencies = {
        'US': { code: 'USD', symbol: '$', name: 'US Dollar' },
        'IN': { code: 'USD', symbol: '$', name: 'US Dollar' }, // Changed from INR to USD
        'GB': { code: 'USD', symbol: '$', name: 'US Dollar' },
        'CA': { code: 'USD', symbol: '$', name: 'US Dollar' },
        'AU': { code: 'USD', symbol: '$', name: 'US Dollar' }
      }
      
      const fallbackCurrency = fallbackCurrencies[countryCode]
      if (fallbackCurrency) {
        setFormData(prev => ({
          ...prev,
          currency: {
            value: fallbackCurrency.code,
            label: `${fallbackCurrency.code} - (${fallbackCurrency.symbol})`,
            symbol: fallbackCurrency.symbol,
            name: fallbackCurrency.name
          }
        }))
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption
    }))
    
    // Clear error when user makes selection
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form before submission
    if (!validateForm()) {
      return
    }
    
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
        // Save billing data for summary
        setSavedBillingData({
          billingId: response.data.data._id,
          currency: formData.currency?.value,
          cadId: cadId
        })
        setBillerDetails({
          user_name: formData.fullName,
          phone_number: formData.phone
        })
        // Fetch pricing details
        // await fetchPricingDetails(response.data.data._id, formData.currency?.value)
        
        // Show billing summary instead of directly calling onSave
        setShowBillingSummary(true)
      }
    } catch (error) {
      console.error('Error creating billing address:', error)
      alert(error?.response?.data?.message || 'Failed to save billing address. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle proceed to payment from billing summary
  const handleProceedToPayment = () => {
    if (savedBillingData && onSave) {
      onSave(savedBillingData.cadId, savedBillingData.billingId, savedBillingData.currency)
      onClose && onClose()
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
    control: (provided, state) => ({
      ...provided,
      minHeight: '40px',
      border: `1px solid ${errors.country ? '#dc3545' : '#ddd'}`,
      borderRadius: '5px',
      '&:hover': {
        border: `1px solid ${errors.country ? '#dc3545' : '#007bff'}`
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#007bff' : 'white',
      color: state.isFocused ? 'white' : 'black',
      cursor: 'pointer'
    })
  }

  // Error message component
  const ErrorMessage = ({ error }) => {
    return error ? <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', display: 'block' }}>{error}</span> : null
  }

  // Format currency display
  const formatCurrency = (amount) => {
    
    return `$ ${parseFloat(amount).toFixed(2)}`
  }

  // Calculate pricing breakdown
  const calculatePricing = () => {
    const basePrice = pricingDetails?.basePrice || pricingDetails?.amount || designDetails?.price || 100
    const gstRate = 18 // 18% GST
    const gstAmount = (basePrice * gstRate) / 100
    const totalAmount = basePrice + gstAmount
    
    return {
      basePrice,
      gstRate,
      gstAmount,
      totalAmount,
      currency: formData.currency?.value || 'INR'
    }
  }

  // Billing Summary Modal Component
  const BillingSummaryModal = () => {
    const pricing = calculatePricing()
    
    return (
      <PopupWrapper onClose={() => setShowBillingSummary(false)}>
        <div className={styles["billing-address-container"]}
        style={{padding:'24px'}}>
          <div className={styles["billing-header"]}>
            <h2>Billing Summary</h2>
            <button
              className={styles["close-btn"]}
              onClick={() => setShowBillingSummary(false)}
            >
              ×
            </button>
          </div>

          <div style={{ padding: '20px 0' }}>
            {/* Design Details */}
            <div style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                {designDetails?.title || designDetails?.name || 'CAD Design File'}
              </h3>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                {designDetails?.description || 'Professional CAD design file download'}
              </p>
            </div>

            {/* Pricing Breakdown */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Price Breakdown</h4>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Base Price:</span>
                <span>{formatCurrency(pricing.basePrice)}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>GST ({pricing.gstRate}%):</span>
                <span>{formatCurrency(pricing.gstAmount)}</span>
              </div>
              
              <hr style={{ margin: '15px 0', border: '1px solid #ddd' }} />
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontWeight: 'bold', 
                fontSize: '16px',
                color: '#333'
              }}>
                <span>Total Amount:</span>
                <span>{formatCurrency(pricing.totalAmount)}</span>
              </div>
            </div>

            {/* Billing Address Summary */}
           
          </div>

          <div className={styles["form-actions"]}>
            <button 
              type="button" 
              onClick={() => setShowBillingSummary(false)} 
              className={styles["cancel-btn"]}
            >
              Back
            </button>
            <button 
              onClick={handleProceedToPayment} 
              className={styles["save-btn"]}
              style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
            >
              Proceed for Payment
            </button>
          </div>
        </div>
      </PopupWrapper>
    )
  }

  // if (!isOpen) return null

  // Show billing summary if flag is set
  if (showBillingSummary) {
    return <BillingSummaryModal />
  }

  return (
    <PopupWrapper onClose={onClose}>
      <div className={styles["billing-address-container"]}>
        <div className={styles["billing-header"]}>
          <h2>Billing Address</h2>
          <button className={styles["close-btn"]} style={{width:'50px'}} onClick={onClose}>×</button>
        </div>

        <form className={styles["billing-form"]} onSubmit={handleSubmit}>
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
                  <div style={{ 
                    marginTop: 6,
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxHeight: '7.2em', // approximately 6 lines
                    lineHeight: '1.2em'
                  }}>
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
                style={{
                  border: errors.fullName ? '1px solid #dc3545' : '1px solid #ddd'
                }}
                required
              />
              <ErrorMessage error={errors.fullName} />
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="address1">Address Line 1 *</label>
            <input
              type="text"
              id="address1"
              name="address1"
              value={formData.address1}
              onChange={handleInputChange}
              placeholder="Enter street address"
              style={{
                border: errors.address1 ? '1px solid #dc3545' : '1px solid #ddd'
              }}
              required
            />
            <ErrorMessage error={errors.address1} />
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
                style={{
                  border: errors.city ? '1px solid #dc3545' : '1px solid #ddd'
                }}
                required
              />
              <ErrorMessage error={errors.city} />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="postalCode">Postal Code *</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Enter postal code"
                style={{
                  border: errors.postalCode ? '1px solid #dc3545' : '1px solid #ddd'
                }}
                required
              />
              <ErrorMessage error={errors.postalCode} />
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
              <ErrorMessage error={errors.country} />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="state">State/Province *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state/province"
                style={{
                  border: errors.state ? '1px solid #dc3545' : '1px solid #ddd'
                }}
                required
              />
              <ErrorMessage error={errors.state} />
            </div>
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="phone">Phone Number *</label>
              <ReactPhoneNumber
                phoneNumber={formData.phone}
                setPhoneNumber={val => {
                  setFormData(prev => ({ ...prev, phone: val || '' }));
                  if (errors.phone) {
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }
                }}
                styles={styles}
                classname="input"
                label="Phone Number"
                id="phone"
              />
              <ErrorMessage error={errors.phone} />
            </div>
          </div>

          <div className={styles["form-row"]}>
            {/* Optional GST Number field remains commented */}
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