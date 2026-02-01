"use client"
import React, { useState, useEffect } from 'react'
import PopupWrapper from '../CommonJsx/PopupWrapper'
import styles from '../CommonJsx/CommonStyles.module.css'
import adminStyles from './AdminPannel.module.css'

function UpdateSearchTextPopup({ onClose, currentSearchText, onUpdate, isLoading }) {
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setSearchText(currentSearchText || '')
  }, [currentSearchText])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchText.trim()) {
      onUpdate(searchText.trim())
    }
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <PopupWrapper>
      <div className={styles.popupContainer}>
        <div className={styles.headerRow}>
          <span className={styles.headerTitle}>Update Search Text</span>
          <button className={styles.closeBtn} onClick={handleCancel}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Enter search text"
              className={adminStyles.searchInput}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d3d3d3',
                borderRadius: '6px',
                fontSize: '15px',
                outline: 'none'
              }}
              autoFocus
              disabled={isLoading}
            />
          </div>
          <div className={styles.actionsRow} style={{ justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.skipBtn}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.nextBtn}
              disabled={!searchText.trim() || isLoading}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </PopupWrapper>
  )
}

export default UpdateSearchTextPopup
