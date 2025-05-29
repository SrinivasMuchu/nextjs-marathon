"use client"
import styles from './IndustryDesign.module.css'
import { sendViewerEvent } from '@/common.helper'
import { DESIGN_GLB_PREFIX_URL } from '@/config'
import React from 'react'

function IndustryDesignFilesDownload({designData}) {
    return (
          <a 
                href={`${DESIGN_GLB_PREFIX_URL}${designData._id}/${designData._id}.step`} 
                onClick={() => sendViewerEvent('design_page_file_download')}
                rel="noopener noreferrer"
            ><button className={styles['industry-design-files-btn']} >
            Download
        </button></a>
        
    )
}

export default IndustryDesignFilesDownload