'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../../config'
import Link from 'next/link'
import styles from './DesignHub.module.css'
import libraryStyles from '../../Library/Library.module.css'
import HoverImageSequenceHome from '../../CommonJsx/RotatedHomePageDesigns'
import Loading from '@/Components/CommonJsx/Loaders/Loading'

function DesignHubDesigns({ category = 'automotive' }) {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        setLoading(true)
        setError(null)
        // Fetch designs for the design hub filtered by category
        const response = await axios.get(
          `${BASE_URL}/v1/cad/get-category-design?category=${category}&limit=16&page=1`,
          { cache: 'no-store' }
        )
        
        const designsData = response.data?.data?.designDetails || []
        setDesigns(designsData)
      } catch (err) {
        setError('Unable to load designs. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchDesigns()
  }, [category])

  if (loading) {
    return (
        <Loading />
    )
  }

 

  return (
    <div className={styles.designHubDesignsContainer}>
      <div className={styles.designHubDesignsGrid}>
        {designs.length > 0 ? (
          designs.map((design) => (
            <div key={design._id} className={styles.designHubDesignCard}>
              <Link 
                href={`/library/${design.route}`} 
                className={libraryStyles["library-designs-items-container"]}
                style={{ width: 298, height: 298 }}
              >
                <HoverImageSequenceHome design={design} loading="lazy" />
              </Link>
              <div className={styles.designHubDesignTitle}>
                {design.page_title}
              </div>
            </div>
          ))
        ) : (
          <p>No designs available</p>
        )}
      </div>
    </div>
  )
}

export default DesignHubDesigns