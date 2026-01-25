'use client'
import React, { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import styles from './CreatorsContent.module.css'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import UserLoginPupUp from '../../CreatorsLanding/../CommonJsx/UserLoginPupUp'

function StartSellingButton() {
  const [showLogin, setShowLogin] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [hasUuid, setHasUuid] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = localStorage.getItem('uuid')
      const verified = localStorage.getItem('is_verified')

      setHasUuid(!!uuid)
      setIsVerified(!!verified)
    }
  }, [])

  const handleClick = () => {
    if (typeof window === 'undefined') return

    const uuid = localStorage.getItem('uuid')
    const verified = localStorage.getItem('is_verified')

    // If uuid is missing OR user is not verified, show login popup
    if (!uuid || !verified) {
      setShowLogin(true)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <button className={styles.creatorsContentButton} onClick={handleClick}>
        Start selling CAD designs
        <FaArrowRight className={styles.creatorsContentButtonArrow} />
      </button>

      {showLogin &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UserLoginPupUp type="profile" onClose={() => setShowLogin(false)} />
          </div>,
          document.body
        )}
    </>
  )
}

export default StartSellingButton