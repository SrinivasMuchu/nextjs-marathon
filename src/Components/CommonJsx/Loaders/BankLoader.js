import React from 'react'

function BankLoader() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(255,255,255,0.85)',
      zIndex: 21000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Bank Icon SVG */}
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="24" fill="#E0E7FF"/>
        <g>
          <rect x="12" y="22" width="24" height="12" rx="2" fill="#6366F1"/>
          <rect x="18" y="28" width="4" height="6" rx="1" fill="#A5B4FC"/>
          <rect x="26" y="28" width="4" height="6" rx="1" fill="#A5B4FC"/>
          <rect x="16" y="18" width="16" height="6" rx="3" fill="#6366F1"/>
        </g>
      </svg>
      {/* Spinner */}
      <div style={{ margin: '16px 0' }}>
        <div className="bank-loader-spinner" />
      </div>
      <div style={{ color: '#6366F1', fontWeight: 500, fontSize: 16 }}>Verifying bank details...</div>
      <style>{`
        .bank-loader-spinner {
          border: 4px solid #E0E7FF;
          border-top: 4px solid #6366F1;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default BankLoader