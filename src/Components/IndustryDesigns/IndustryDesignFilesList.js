import React from 'react'
import styles from './IndustryDesign.module.css'
import { textLettersLimit } from '@/common.helper'

function IndustryDesignFilesList({ designData }) {
    // Assuming each design in designData has a step_files array
    // If not, you might need to adjust this logic
  

    return (
        <div className={styles['industry-design-files']}>
            <div className={styles['industry-design-files-head']}>
                Guidline text in multiple lines
            </div>
            <div className={styles['industry-design-files-bottom']}>
                <span className={styles['industry-design-files-count']}>Files {designData.length}</span>
                <table className={styles['industry-design-files-list']}>
                    <thead>
                        <tr>
                            <th style={{ width: '60%' }}>File name</th>
                            <th>Extension</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {designData.map((file, index) => (
                            
                            <tr key={`${file._id}-${index}`}>
                                <td>{textLettersLimit(file.grabcad_title,50)  }</td>
                                <td>{file.extension || 'STEP'}</td>
                                <td>
                                    <a 
                                        href={`https://d1d8a3050v4fu6.cloudfront.net/${file._id}/${file._id}.step`} 
                                        download
                                       
                                    >
                                        <button className={styles['industry-design-files-btn']}>Download</button>
                                        
                                    </a>
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