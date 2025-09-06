"use client"
import React, { useContext, useState } from 'react'
import styles from './Creators.module.css'
import { MdKeyboardArrowRight } from "react-icons/md";
import { contextState } from '../CommonJsx/ContextProvider';
import RatingsPopUp from '../CommonJsx/RatingsPopUp';

function DownloadsRatingAlert() {
    const [openRating, setOpenRating] = useState(false);
    const { user } = useContext(contextState);

    if (!user?.downloadRating?.length) return null;

    return (
        <>
            <div className={styles.downloadAlertContainer} onClick={() => setOpenRating(true)}>
                <span>Please rate the {user.downloadRating.length} files you downloaded or converted</span>
                <button ><MdKeyboardArrowRight style={{ fontSize: '20px' }} /></button>
            </div>
            {openRating && <RatingsPopUp onClose={() => setOpenRating(false)} designArray={user.downloadRating} />}
        </>
    )
}

export default DownloadsRatingAlert