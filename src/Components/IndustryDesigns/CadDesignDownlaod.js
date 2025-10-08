"use client"
import React,{useEffect, useState,useContext} from 'react'
import { MdKeyboardArrowRight } from "react-icons/md";
import styles from './IndustryDesign.module.css'
import { BASE_URL } from '@/config';
import axios from 'axios';
import RatingsPopUp from '../CommonJsx/RatingsPopUp';
import { contextState } from '../CommonJsx/ContextProvider';

function CadDesignDownload ({designId,designTitle}) {
  const [downloadedAt,setDownloadedAt] = useState('');
   const [openRatingModal,setOpenRatingModal] = useState(false);
   const { downloadedFileUpdate,setDesignLiked,setIsLiked } = useContext(contextState);

  const getIsRated=async()=>{
    try {
       const res = await axios.get(`${BASE_URL}/v1/cad-creator/check-file-rating?design_id=${designId}`, {
        headers: { 'user-uuid': localStorage.getItem('uuid') }
      });
      if (res.data.meta.success) {
        setDownloadedAt(res.data.data.latest_download_created_at);

        // Only set designLiked and isLiked if data is a non-empty object
        if (res.data.data && Object.keys(res.data.data).length > 0) {
            setDesignLiked(true);
            setIsLiked(res.data.data.is_liked);
        } else {
            setDesignLiked(false);
            setIsLiked(false);
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getIsRated();
  },[downloadedFileUpdate])
  function timeSince(dateString) {
  const inputDate = new Date(dateString);
  const now = new Date();

  const diffMs = now - inputDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  return `${diffSeconds} second${diffSeconds !== 1 ? 's' : ''}`;
}

  if (!downloadedAt) return null;
  return (
    <>
     <div className={styles.cadDesignDownload} onClick={() => setOpenRatingModal(true)}>
        <div className={styles.cadDesignDownloadTitle}>
            <span>You downloaded this 3-D file {timeSince(downloadedAt)} ago!</span>
            <MdKeyboardArrowRight style={{fontSize:'20px'}}/>
        </div>
     
        <p>Please rate this 3D model and share your experience. Your feedback helps creators improve their work and deliver better designs.</p>
    </div>
    {openRatingModal && <RatingsPopUp designArray={[{ _id: designId, title: designTitle }]} onClose={() => setOpenRatingModal(false)} ratingType="cad-design" />}
    </>
   
  )
}

export default CadDesignDownload