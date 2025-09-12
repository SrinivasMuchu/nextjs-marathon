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
       
        if(!res.data.data.latest_download_created_at){
           setDesignLiked(true);
           setIsLiked(res.data.data.is_liked);
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getIsRated();
  },[downloadedFileUpdate])
  function daysSince(dateString) {
  const inputDate = new Date(dateString);
  const today = new Date();

  // normalize both dates to midnight to avoid time differences
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today - inputDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

// Example usage:

// -> e.g. 79 (depending on today's date)

  if (!downloadedAt) return null;
  return (
    <>
     <div className={styles.cadDesignDownload} onClick={() => setOpenRatingModal(true)}>
        <div className={styles.cadDesignDownloadTitle}>
            <span>You downloaded this 3-D file {daysSince(downloadedAt)} days back!</span>
            <MdKeyboardArrowRight style={{fontSize:'20px'}}/>
        </div>
     
        <p>Please rate the 3-D model file and share your experience. It will help creators to ....bla bla</p>
    </div>
    {openRatingModal && <RatingsPopUp designArray={[{ _id: designId, title: designTitle }]} onClose={() => setOpenRatingModal(false)} />}
    </>
   
  )
}

export default CadDesignDownload