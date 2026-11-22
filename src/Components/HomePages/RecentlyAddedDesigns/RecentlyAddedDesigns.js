import { BASE_URL } from '../../../config'
import Link from 'next/link'
import styles from './RecentlyAddedDesigns.module.css'
import libraryStyles from '../../Library/Library.module.css'
import HoverImageSequence from '../../CommonJsx/RotatedImages'
import ViewAllDesigns from '../DesignHub/ViewAllDesigns'

const RECENT_DESIGNS_REVALIDATE_SECONDS = 3600

async function RecentlyAddedDesigns({ category = '', tag = '', excludeRoute = '' }) {
  try {
    const params = new URLSearchParams({ limit: '10' })
    if (category) params.set('category', category)
    if (tag) params.set('tags', tag)
    if (excludeRoute) params.set('exclude_route', excludeRoute)

    const response = await fetch(
      `${BASE_URL}/v1/cad/get-recently-added-designs?${params.toString()}`,
      { next: { revalidate: RECENT_DESIGNS_REVALIDATE_SECONDS } }
    )

    const data = await response.json()
    const designs = data?.data || []

    return (
      <div className={styles.recentlyAddedDesignsContainer}>
        <h2 className={styles.recentlyAddedDesignsHead}>Recently added / Trending</h2>
        <p className={styles.recentlyAddedDesignsDesc}>Everything you need to design faster, smarter, and with more impact.</p>
        <div className={styles.recentlyAddedDesignsGrid}>
          {designs.length > 0 ? (
            designs.map((design) => (
              <div key={design._id} className={styles.recentlyAddedDesignCard}>
                <Link
                  href={`/library/${design.route}`}
                  className={libraryStyles['library-designs-items-container-home']}
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
        <h2 className={styles.recentlyAddedDesignsHead}>Recently added / Trending</h2>
        <p className={styles.recentlyAddedDesignsDesc}>Everything you need to design faster, smarter, and with more impact.</p>
        <div className={styles.recentlyAddedDesignsGrid}>
          <p>Unable to load designs. Please try again later.</p>
        </div>
      </div>
    )
  }
}

export default RecentlyAddedDesigns
