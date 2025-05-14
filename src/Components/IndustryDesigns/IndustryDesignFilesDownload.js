"use client"
import styles from './IndustryDesign.module.css'
import { sendViewerEvent } from '@/common.helper'
import React from 'react'

function IndustryDesignFilesDownload({designData}) {
    return (
          <a 
                href={`https://d1d8a3050v4fu6.cloudfront.net/${designData._id}/${designData._id}.step`} 
                onClick={() => sendViewerEvent('design_page_file_download')}
                rel="noopener noreferrer"
            ><button className={styles['industry-design-files-btn']} >
            Download
        </button></a>
        
    )
}

export default IndustryDesignFilesDownload