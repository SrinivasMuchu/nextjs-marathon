"use client"
import React, { useState } from 'react';
import PopupWrapper from './PopupWrapper';
import { GoStarFill } from "react-icons/go";
import styles from './CommonStyles.module.css';
import Image from 'next/image';
import { DESIGN_GLB_PREFIX_URL, IMAGEURLS, MARATHON_ASSET_PREFIX_URL } from '@/config';

const model = {
  name: "0 5M Spur Gear - Standard Mechanical Component",
  img: 'https://via.placeholder.com/48?text=3D', // Replace with actual image if available
};

function RatingsPopUp({ onClose, designId ,designTitle}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    // You can add your save logic here (API call, etc.)
    setSubmitted(true);
  };

  return (
    <PopupWrapper>
      <div className={styles.popupContainer}>
        <div className={styles.headerRow}>
          <span className={styles.headerTitle}>Rate the 3-D model file</span>
          <button className={styles.closeBtn} onClick={onClose || (()=>{})}>&times;</button>
        </div>
        {!submitted ? (
          <>
            <div className={styles.modelRow}>
              <Image src={`${DESIGN_GLB_PREFIX_URL}${designId}/sprite_0_0.webp`} alt="model" className={styles.modelImg} width={80} height={80} />
              <span className={styles.modelInfo}>{designTitle}</span>
            </div>
            <div className={styles.starsRow}>
              {[1,2,3,4,5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${star <= (hover || rating) ? styles.filled : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                ><GoStarFill/></span>
              ))}
            </div>
            <div className={styles.textareaRow}>
              <textarea
                className={styles.textarea}
                placeholder="Type your valuable feedback/ comment for the creater here"
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
              />
            </div>
            <div className={styles.actionsRow}>
              <button className={styles.nextBtn} disabled={rating === 0} onClick={handleNext}>
                Submit
              </button>
              {/* <button className={styles.skipBtn} type="button" onClick={onClose}>
                Skip
              </button> */}
              <span className={styles.progressText}>1/5</span>
            </div>
          </>
        ) : (
          <div style={{textAlign: 'center', padding: '32px 0'}}>
            <div style={{
              background: '#faf7ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              width: '220px',
              height: '140px'
            }}>
              <Image
                src={`${MARATHON_ASSET_PREFIX_URL}appreciate.webp`}
                alt="Thank you"
                width={100}
                height={100}
                style={{margin: '0 auto'}}
              />
            </div>
            <div style={{fontWeight: 600, fontSize: 18, color: '#222', marginBottom: 8}}>
              We appreciate your valuable time to<br/>rate the 3-D files.
            </div>
          </div>
        )}
      </div>
    </PopupWrapper>
  );
}

export default RatingsPopUp;