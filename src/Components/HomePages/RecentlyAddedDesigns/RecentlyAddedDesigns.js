import { BASE_URL } from '../../../config'
import Link from 'next/link'
import styles from './RecentlyAddedDesigns.module.css'
import libraryStyles from '../../Library/Library.module.css'
import HoverImageSequence from '../../CommonJsx/RotatedImages'
import ViewAllDesigns from '../DesignHub/ViewAllDesigns'

async function RecentlyAddedDesigns() {
  try {
    // Fetch recently added designs (server-side)
    const response = await fetch(
      `${BASE_URL}/v1/cad/get-recently-added-designs?limit=10`,
      { cache: 'no-store' }
    )
    
    const data = await response.json()
    const designs = data?.data || []
    
    return (
      <div className={styles.recentlyAddedDesignsContainer}>
        <h1 className={styles.recentlyAddedDesignsHead}>Recently added / Trending</h1>
        <p className={styles.recentlyAddedDesignsDesc}>Everything you need to design faster, smarter, and with more impact.</p>
        <div className={styles.recentlyAddedDesignsGrid}>
          {designs.length > 0 ? (
            designs.map((design) => (
              <div key={design._id} className={styles.recentlyAddedDesignCard}>
                <Link 
                  href={`/library/${design.route}`} 
                  className={libraryStyles["library-designs-items-container-home"]}
                >
                  <HoverImageSequence design={design} width={298} height={298} />
                </Link>
                <div className={styles.recentlyAddedDesignTitle}>
                  {design.page_title}
                </div>
              </div>
             
            ))
          ) : (
            <p>No designs available</p>
          )}
        </div>
        <ViewAllDesigns />
      </div>
    )
  } catch (error) {
    return (
      <div className={styles.recentlyAddedDesignsContainer}>
        <h1 className={styles.recentlyAddedDesignsHead}>Recently added / Trending</h1>
        <p className={styles.recentlyAddedDesignsDesc}>Everything you need to design faster, smarter, and with more impact.</p>
        <div className={styles.recentlyAddedDesignsGrid}>
          <p>Unable to load designs. Please try again later.</p>
        </div>
      </div>
    )
  }
}

export default RecentlyAddedDesigns