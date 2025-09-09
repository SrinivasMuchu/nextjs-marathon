"use client";
import axios from 'axios';
import styles from '../IndustryDesigns/IndustryDesign.module.css'
import { sendGAtagEvent } from '@/common.helper';
import React, { useState } from 'react'
import { BASE_URL, CAD_VIEWER_EVENT } from '@/config';
import Tooltip from '@mui/material/Tooltip';
import CadFileNotifyPopUp from './CadFileNotifyPopUp';
import UserLoginPupUp from './UserLoginPupUp';

function DownloadClientButton({ folderId, xaxis, yaxis, isDownladable, step ,filetype,custumDownload}) {
  const [isDownLoading, setIsDownLoading] = useState(false);
  const [openEmailPopUp, setOpenEmailPopUp] = useState(false);
  const handleDownload = async () => {
    setIsDownLoading(true); // Disable button
    try {
      if(!localStorage.getItem('is_verified')) {
            setOpenEmailPopUp(true)
            return
      }
      const response = await axios.post(`${BASE_URL}/v1/cad/get-signedurl`, {
        design_id: folderId, xaxis, yaxis, step,file_type:filetype,action_type:'DOWNLOAD'


      }, {
        headers: {
          "user-uuid": localStorage.getItem("uuid"),
        }
      });

      const data = response.data;
      if (data.meta.success) {
        const url = data.data.download_url;
        window.open(url, '_blank');
      }
      sendGAtagEvent({ event_name: 'design_view_file_download', event_category: CAD_VIEWER_EVENT });
    } catch (err) {
      console.error('Error downloading file:', err);
    } finally {
      setIsDownLoading(false); // Re-enable button after completion
    }
  };
  return (
    <>
    {custumDownload ? <>
      <>
    {isDownladable === false ?
        <Tooltip
          title='This file is view-only downloads are disabled by the creator.' arrow
          placement='top'

          disableHoverListener={isDownladable}
          disableFocusListener={isDownladable}
          disableTouchListener={isDownladable}
          PopperProps={{
            sx: {
              '& .MuiTooltip-tooltip': {
                backgroundColor: '#333',
                color: '#fff',
                fontSize: '12px',
                padding: '6px',
                borderRadius: '4px',
              },
            },
          }}
        >
          <span>
            <button
              disabled
              className="rounded bg-[#610BEE] h-12"
              style={{ opacity: 0.6, cursor: 'not-allowed', color: 'white', fontSize: '20px' }}
            >
               Download 3-D design
            </button>
          </span>
        </Tooltip> : <button
          disabled={isDownLoading} style={{  fontSize: '20px' }} className="rounded bg-[#610BEE] h-12" onClick={handleDownload}>{isDownLoading ? 'Downloading' : 'Download 3-D design'} </button>}
  
    </>
    </>:<>
    {isDownladable === false ?
        <Tooltip
          title='This file is view-only downloads are disabled by the creator.' arrow
          placement='top'

          disableHoverListener={isDownladable}
          disableFocusListener={isDownladable}
          disableTouchListener={isDownladable}
          PopperProps={{
            sx: {
              '& .MuiTooltip-tooltip': {
                backgroundColor: '#333',
                color: '#fff',
                fontSize: '12px',
                padding: '6px',
                borderRadius: '4px',
              },
            },
          }}
        >
          <span>
            <button
              disabled
              className={styles['industry-design-files-btn']}
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            >
               Download
            </button>
          </span>
        </Tooltip> : <button
          disabled={isDownLoading} className={styles['industry-design-files-btn']} onClick={handleDownload}>{isDownLoading ? 'Downloading' : 'Download'} </button>}
  
    </>}
    {openEmailPopUp && <UserLoginPupUp onClose={() => setOpenEmailPopUp(false)} />}
        </>

  )
}

export default DownloadClientButton