import React from 'react'
import styles from './IndustryDesign.module.css'

function IndustryDesignFilesList() {
    return (
        <div className={styles['industry-design-files']}>
            <div className={styles['industry-design-files-head']}>
                Guidline text in multiple lines
            </div>
            <div className={styles['industry-design-files-bottom']}>
                <span className={styles['industry-design-files-count']}>Files 6</span>
                <table className={styles['industry-design-files-list']}>
                    <thead>
                        <tr>
                            <th style={{width:'60%'}}>File name</th>
                            <th>Extension</th>
                            <th>Action</th>
                           
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td >File 1</td>
                            <td>Type 1</td>
                            
                            <td><button className={styles['industry-design-files-btn']}>Download</button></td>
                        </tr>
                        {/* Add more rows as needed */}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default IndustryDesignFilesList