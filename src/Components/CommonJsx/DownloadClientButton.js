"use client";
import axios from 'axios';
import styles from '../IndustryDesigns/IndustryDesign.module.css'
import { sendViewerEvent } from '@/common.helper';
import React,{useState} from 'react'
import { BASE_URL } from '@/config';

function DownloadClientButton({folderId,xaxis,yaxis}) {
  const [isDownLoading, setIsDownLoading] = useState(false);
    const handleDownload = async () => {
             setIsDownLoading(true); // Disable button
            try {
                const response = await axios.post(`${BASE_URL}/v1/cad/get-signedurl`, {
                    design_id: folderId,xaxis,yaxis,
                    uuid: localStorage.getItem('uuid'),
                });
    
                const data = response.data;
                if (data.meta.success) {
                    const url = data.data.download_url;
                    window.open(url, '_blank');
                }
                sendViewerEvent('design_view_file_download');
            } catch (err) {
                console.error('Error downloading file:', err);
            } finally {
            setIsDownLoading(false); // Re-enable button after completion
        }
        };
  return (
    <button   disabled={isDownLoading} className={styles['industry-design-files-btn']} onClick={handleDownload}>Download</button>
  )
}

export default DownloadClientButton