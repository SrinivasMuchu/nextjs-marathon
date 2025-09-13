"use client"
import React, { useContext, useState, useEffect } from 'react'
import styles from './Creators.module.css'
import { MdKeyboardArrowRight } from "react-icons/md";
import { contextState } from '../CommonJsx/ContextProvider';
import RatingsPopUp from '../CommonJsx/RatingsPopUp';
import axios from 'axios'
import {BASE_URL} from '../../config'

function DownloadsRatingAlert() {
    const [openRating, setOpenRating] = useState(false);
    const { user } = useContext(contextState);
    const [downloadCount, setDownloadCount] = useState(user?.downloadRating || 0);
    const [designArray,setDesignArray]=useState([])
  const fetchDesignArray = async () => {
     try {
          const res = await axios.get(`${BASE_URL}/v1/cad-creator/unrated-cad-file-downloads`, {
            headers: { 'user-uuid': localStorage.getItem('uuid') }
          });
          if (res.data.meta.success) {
            setDesignArray(res.data.data.unrated_designs);
          }
        }
      catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    useEffect(() => {
      setDownloadCount(user?.downloadRating );
    }, [user?.downloadRating]);

    if (downloadCount<1) return null;

    return (
        <>
            <div className={styles.downloadAlertContainer} onClick={() => {setOpenRating(true); fetchDesignArray()}}>
                <span>Please rate the {downloadCount} files you downloaded or converted</span>
                <button ><MdKeyboardArrowRight style={{ fontSize: '20px' }} /></button>
            </div>
            {openRating && (
              <RatingsPopUp
                onClose={() => setOpenRating(false)}
                designArray={designArray}
                setDownloadCount={setDownloadCount}
                downloadCount={downloadCount}
              />
            )}
        </>
    )
}

export default DownloadsRatingAlert