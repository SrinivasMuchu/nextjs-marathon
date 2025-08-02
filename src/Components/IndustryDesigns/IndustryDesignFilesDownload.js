"use client"
import styles from './IndustryDesign.module.css'
import { sendGAtagEvent } from '@/common.helper'
import { CAD_VIEWER_EVENT, DESIGN_GLB_PREFIX_URL } from '@/config'
import React from 'react'
import Link from 'next/link'

function IndustryDesignFilesDownload({designData}) {
    return (
          <Link
                href={`${DESIGN_GLB_PREFIX_URL}${designData._id}/${designData._id}.step`} 
                onClick={() => sendGAtagEvent({ event_name: 'design_page_file_download', event_category: CAD_VIEWER_EVENT })}
                rel="noopener noreferrer"
            ><button className={styles['industry-design-files-btn']} >
            Download
        </button></Link>
        
    )
}

export default IndustryDesignFilesDownload