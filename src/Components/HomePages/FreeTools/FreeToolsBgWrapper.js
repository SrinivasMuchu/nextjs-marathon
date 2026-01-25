'use client'

import React, { useEffect, useRef, useState } from 'react'
import styles from './FreeTools.module.css'

function FreeToolsBgWrapper({ children }) {
  const containerRef = useRef(null)
  const [bgLoaded, setBgLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setBgLoaded(true)
              observer.disconnect()
            }
          })
        },
        {
          root: null,
          threshold: 0.1,
        }
      )

      observer.observe(containerRef.current)

      return () => {
        observer.disconnect()
      }
    } else {
      // Fallback: load background immediately on environments without IntersectionObserver
      setBgLoaded(true)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`${styles.freeToolsContainer} ${bgLoaded ? styles.freeToolsBgLoaded : ''}`}
    >
      {children}
    </div>
  )
}

export default FreeToolsBgWrapper

