import React from 'react'
import styles from './IndustryDesign.module.css'

import DownloadClientButton from '../CommonJsx/DownloadClientButton';
import {
  formatLibraryFileType,
  getFormatDownloadLabel,
} from '@/lib/seo/libraryProductDetail';

function IndustryDesignFilesList({ designData, isLibraryDetail = false }) {
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

    const fileType = designData.file_type ? designData.file_type : 'step';
    const formatLabel = formatLibraryFileType(fileType);
    const designFileDownloadLabel = isLibraryDetail
      ? getFormatDownloadLabel(fileType)
      : undefined;

    return (
        <div className={styles['industry-design-files']}>

            <div className={styles['industry-design-files-bottom']}>
                <table className={styles['industry-design-files-list']}>
                    <thead>
                        <tr>
                            <th style={{ width: '50%' }}>View Name</th>
                            <th style={{ width: '25%' }}>Extension</th>
                            <th style={{ width: '25%' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-label="View Name"><span className={styles['industry-design-files-cell-content']}>Design file</span></td>
                            <td data-label="Extension">
                              <span className={styles['industry-design-files-cell-content']}>
                                {isLibraryDetail ? `Format: ${formatLabel}` : fileType}
                              </span>
                            </td>
                            <td data-label="Action">

                                <DownloadClientButton folderId={designData._id} isDownladable={designData.is_downloadable} step={true}
                                    filetype={fileType}
                                    downloadButtonLabel={designFileDownloadLabel}
                                    designDetails={{
                                        title: designData.page_title,
                                        description: designData.page_description,
                                        price: designData.price,
                                    }} />

                            </td>
                        </tr>
                        {!isDxfOrDwg && viewDirections.map((view, index) => (
                            <tr key={index}>
                                <td data-label="View Name"><span className={styles['industry-design-files-cell-content']}>{view.name}</span></td>
                                <td data-label="Extension"><span className={styles['industry-design-files-cell-content']}>webp</span></td>
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
