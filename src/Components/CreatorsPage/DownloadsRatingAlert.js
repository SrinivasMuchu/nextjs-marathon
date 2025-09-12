"use client"
import React, { useContext, useState, useEffect } from 'react'
import styles from './Creators.module.css'
import { MdKeyboardArrowRight } from "react-icons/md";
import { contextState } from '../CommonJsx/ContextProvider';
import RatingsPopUp from '../CommonJsx/RatingsPopUp';

function DownloadsRatingAlert() {
    const [openRating, setOpenRating] = useState(false);
    const { user } = useContext(contextState);
    const [downlaodCount, setDownloadCount] = useState(user?.downloadRating?.length || 0);

    useEffect(() => {
      setDownloadCount(user?.downloadRating?.length || 0);
    }, [user?.downloadRating?.length]);

    if (downlaodCount<1) return null;

    return (
        <>
            <div className={styles.downloadAlertContainer} onClick={() => setOpenRating(true)}>
                <span>Please rate the {downlaodCount} files you downloaded or converted</span>
                <button ><MdKeyboardArrowRight style={{ fontSize: '20px' }} /></button>
            </div>
            {openRating && (
              <RatingsPopUp
                onClose={() => setOpenRating(false)}
                designArray={user.downloadRating}
                setDownloadCount={setDownloadCount}
                downlaodCount={downlaodCount}
              />
            )}
        </>
    )
}

export default DownloadsRatingAlert