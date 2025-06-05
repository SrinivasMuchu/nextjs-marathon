import React from 'react'
import styles from './IndustryDesign.module.css'
import { sendViewerEvent, textLettersLimit } from '@/common.helper'
import IndustryDesignFilesDownload from './IndustryDesignFilesDownload';
import { DESIGN_GLB_PREFIX_URL } from '@/config';
import DownloadClientButton from '../CommonJsx/DownloadClientButton';

function IndustryDesignFilesList({ designData }) {
    // Static view names with their corresponding view directions
    const viewDirections = [
        { name: "Front View", x: 0, y: 0 },
        { name: "Top View", x: 0, y: 90 },
        { name: "Bottom View", x: 0, y: 270 },
        { name: "Left Side View", x: 90, y: 0 },
        { name: "Right Side View", x: 270, y: 0 },
        { name: "Isometric View", x: 60, y: 30 }
    ];

    // Get the file ID from designData (assuming designData has at least one file)
   
    return (
        <div className={styles['industry-design-files']}>
            <div className={styles['industry-design-files-head']}>
            The files are shared to help you get inspired and speed up your workflow. They may not be fully accurate or production-ready, so review carefully before use.
            </div>
            <div className={styles['industry-design-files-bottom']}>
                <span className={styles['industry-design-files-count']}>Files {viewDirections.length+1}</span>
                <table className={styles['industry-design-files-list']}>
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>View Name</th>
                          
                            <th style={{ width: '20%' }}>Extension</th>
                            <th style={{ width: '20%' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
    <tr>
        <td data-label="View Name">Design file</td>
        <td data-label="Extension">step</td>
        <td data-label="Action">
           
                 <DownloadClientButton folderId={designData._id} isDownladable={designData.is_downloadable}/>
           
        </td>
    </tr>
    {viewDirections.map((view, index) => (
        <tr key={index}>
            <td data-label="View Name">{view.name}</td>
            <td data-label="Extension">webp</td>
            <td data-label="Action">
                {/* <a 
                    href={`${DESIGN_GLB_PREFIX_URL}${designData._id}/sprite_${view.x}_${view.y}.webp`} 
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button className={styles['industry-design-files-btn']}>
                        Download
                    </button>
                </a> */}
                <DownloadClientButton folderId={designData._id} xaxis={view.x} yaxis={view.y} isDownladable={designData.is_downloadable}/>
            </td>
        </tr>
    ))}
</tbody>

                </table>
            </div>
        </div>
    )
}

export default IndustryDesignFilesList