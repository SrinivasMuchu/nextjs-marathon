"use client"
import styles from './IndustryDesign.module.css'
import { sendGAtagEvent } from '@/common.helper'
import { CAD_VIEWER_EVENT, DESIGN_GLB_PREFIX_URL } from '@/config'
import React from 'react'

function IndustryDesignFilesDownload({designData}) {
    return (
          <a 
                href={`${DESIGN_GLB_PREFIX_URL}${designData._id}/${designData._id}.step`} 
                onClick={() => sendGAtagEvent('design_page_file_download',CAD_VIEWER_EVENT)}
                rel="noopener noreferrer"
            ><button className={styles['industry-design-files-btn']} >
            Download
        </button></a>
        
    )
}

export default IndustryDesignFilesDownload