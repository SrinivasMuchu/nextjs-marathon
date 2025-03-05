import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { IMAGEURLS } from '@/config'
import styles from './OrgLandPage.module.css'

function OrgLandPage() {
    return (
        <div className={styles['org-land-page']}>
            <div className={styles['org-land-page-text']}>
                <span className={styles['org-land-page-heading']}>
                    Org Chart Maker – Fast & Easy Team Management
                </span>
                <span className={styles['org-land-page-description']}>
                    Turn employee data into clear, structured org charts. Quickly organize your team and improve visibility into your company’s hierarchy.

                </span>
                <button className={styles['org-land-page-btn']}>
                    <Link href="/tools/org-hierarchy/chart-maker">Create now</Link>
                </button>
            </div>
            <div>
                <Image className={styles['org-land-page-img']} src={IMAGEURLS.orgChart} alt="Org Chart" width={666} height={429} />
            </div>
        </div>
    )
}

export default OrgLandPage