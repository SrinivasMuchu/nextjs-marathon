'use client'

import React from 'react'
import CadServiceForm from '../CadServiceHome/CadServiceForm'
import commonStyles from '@/Components/CommonJsx/CommonStyles.module.css'

function CadServiceFormPopup({ onClose }) {
  return (
    <div
      className={commonStyles.popUpMain}
      onClick={onClose}
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          margin: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={commonStyles.closeBtn}
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 10000,
            background: '#fff',
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            fontSize: 20,
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
        <CadServiceForm onClose={onClose} inPopup />
      </div>
    </div>
  )
}

export default CadServiceFormPopup
