"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Select from 'react-select'
import { SOFTWARE_FORMAT_OPTIONS } from './cadServiceFormOptions'
import { searchSoftwareOptions } from './softwareSearch'
import styles from './CadServiceForm.module.css'

const ALL_SOFTWARE_OPTIONS = SOFTWARE_FORMAT_OPTIONS.filter((opt) => opt.value)
const SEARCH_DEBOUNCE_MS = 300
const RESULT_LIMIT = 25

function buildSelectStyles(hasError = false) {
  return {
  control: (provided, state) => ({
    ...provided,
    minHeight: 44,
    borderRadius: 10,
    borderColor: hasError ? '#ef4444' : state.isFocused ? '#610bee' : '#e5e7eb',
    boxShadow: 'none',
    fontSize: 16,
    fontFamily: 'inherit',
    cursor: 'pointer',
    '&:hover': {
      borderColor: hasError ? '#ef4444' : state.isFocused ? '#610bee' : '#e5e7eb',
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '2px 14px',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#6b7280',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#1a1a1a',
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#6b7280',
    paddingRight: 14,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 10001,
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#610bee'
      : state.isFocused
        ? '#faf5ff'
        : 'white',
    color: state.isSelected ? 'white' : '#1a1a1a',
    cursor: 'pointer',
    fontSize: 15,
  }),
}
}

function SoftwareFormatSelect({ value, onChange, inputId, required, inPopup = false, hasError = false }) {
  const [searchInput, setSearchInput] = useState('')
  const [displayOptions, setDisplayOptions] = useState(() =>
    searchSoftwareOptions(ALL_SOFTWARE_OPTIONS, '', RESULT_LIMIT)
  )
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef('')

  const selectedOption = useMemo(
    () => ALL_SOFTWARE_OPTIONS.find((opt) => opt.value === value) || null,
    [value]
  )

  useEffect(() => {
    searchInputRef.current = searchInput
  }, [searchInput])

  useEffect(() => {
    const timer = setTimeout(() => {
      const rankedOptions = searchSoftwareOptions(
        ALL_SOFTWARE_OPTIONS,
        searchInputRef.current,
        RESULT_LIMIT
      )
      setDisplayOptions(rankedOptions)
      setIsSearching(false)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchInput])

  const optionsWithSelection = useMemo(() => {
    if (!selectedOption) return displayOptions
    if (displayOptions.some((option) => option.value === selectedOption.value)) {
      return displayOptions
    }
    return [selectedOption, ...displayOptions]
  }, [displayOptions, selectedOption])

  const handleInputChange = (nextValue, { action }) => {
    if (action === 'input-blur') {
      return searchInput
    }
    if (action === 'menu-close' || action === 'set-value') {
      setSearchInput('')
      setIsSearching(false)
      return ''
    }
    setIsSearching(true)
    setSearchInput(nextValue)
    return nextValue
  }

  const handleChange = (option) => {
    onChange(option?.value || '')
    setSearchInput('')
    setIsSearching(false)
    setDisplayOptions(searchSoftwareOptions(ALL_SOFTWARE_OPTIONS, '', RESULT_LIMIT))
  }

  const handleMenuOpen = () => {
    setDisplayOptions(searchSoftwareOptions(ALL_SOFTWARE_OPTIONS, searchInput, RESULT_LIMIT))
  }

  return (
    <div className={styles.softwareSelectWrap}>
      <Select
        inputId={inputId}
        instanceId={inputId}
        options={optionsWithSelection}
        value={selectedOption}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onMenuOpen={handleMenuOpen}
        inputValue={searchInput}
        placeholder="Search or select software..."
        isSearchable
        isClearable={false}
        isLoading={isSearching}
        filterOption={() => true}
        styles={buildSelectStyles(hasError)}
        menuPortalTarget={inPopup && typeof document !== 'undefined' ? document.body : undefined}
        menuPosition={inPopup ? 'fixed' : 'absolute'}
        noOptionsMessage={() =>
          searchInput.trim()
            ? 'No matching software found'
            : 'Start typing to search software'
        }
        loadingMessage={() => 'Searching...'}
      />
      {required ? (
        <input
          tabIndex={-1}
          aria-hidden="true"
          className={styles.softwareSelectRequiredInput}
          value={value}
          onChange={() => {}}
          required
        />
      ) : null}
    </div>
  )
}

export default SoftwareFormatSelect
