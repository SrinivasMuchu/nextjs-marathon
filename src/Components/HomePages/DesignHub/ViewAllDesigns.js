import Link from 'next/link';
import styles from './DesignHub.module.css'
import { FaArrowRight } from "react-icons/fa6";


function ViewAllDesigns() {
  return (
    <Link href="/library" className={styles.viewAllDesignsButton}>
      View all designs
      <FaArrowRight className={styles.viewAllDesignsArrow} />
    </Link>
  )
}

export default ViewAllDesigns