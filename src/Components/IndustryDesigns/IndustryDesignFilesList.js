import React from 'react'
import styles from './IndustryDesign.module.css'

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

    const isDxfOrDwg = designData?.file_type &&
        ['dxf', 'dwg'].includes(String(designData.file_type).toLowerCase());

    // Get the file ID from designData (assuming designData has at least one file)

    return (
        <div className={styles['industry-design-files']}>

            <div className={styles['industry-design-files-bottom']}>
                {/* <span className={styles['industry-design-files-count']}>Files {viewDirections.length+1}</span> */}
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
                            <td data-label="Extension">{designData.file_type ? designData.file_type : 'step'}</td>
                            <td data-label="Action">

                                <DownloadClientButton folderId={designData._id} isDownladable={designData.is_downloadable} step={true}
                                    filetype={designData.file_type} designDetails={{
                                        title: designData.page_title, // You can pass actual design title here
                                        description: designData.page_description, // You can pass actual design description here
                                        price: designData.price, // Use the designPrice prop
                                        // Add other design details as needed
                                    }} />

                            </td>
                        </tr>
                        {!isDxfOrDwg && viewDirections.map((view, index) => (
                            <tr key={index}>
                                <td data-label="View Name">{view.name}</td>
                                <td data-label="Extension">webp</td>
                                <td data-label="Action">
                                    <DownloadClientButton
                                        folderId={designData._id}
                                        xaxis={view.x}
                                        yaxis={view.y}
                                        isDownladable={designData.is_downloadable}
                                        step={false}
                                    />
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