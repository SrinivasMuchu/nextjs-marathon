"use client"
import React, { useState,useContext } from 'react';
import PopupWrapper from './PopupWrapper';
import { GoStarFill } from "react-icons/go";
import styles from './CommonStyles.module.css';
import Image from 'next/image';
import { DESIGN_GLB_PREFIX_URL, MARATHON_ASSET_PREFIX_URL, BASE_URL } from '@/config';
import axios from 'axios';
import { toast } from 'react-toastify';


function RatingsPopUp({ onClose, designArray = [],setDownloadCount,downlaodCount }) {
    //  const { setUpdatedDetails } = useContext(contextState);
  const [current, setCurrent] = useState(0);
  const [ratings, setRatings] = useState(Array(designArray.length).fill(0));
  const [feedbacks, setFeedbacks] = useState(Array(designArray.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!designArray.length) return null;

  const design = designArray[current];

  const handleStar = (star) => {
    const newRatings = [...ratings];
    newRatings[current] = star;
    setRatings(newRatings);
  };

  const handleFeedback = (e) => {
    const newFeedbacks = [...feedbacks];
    newFeedbacks[current] = e.target.value;
    setFeedbacks(newFeedbacks);
  };

  // Helper to call API for current design
  const submitCurrentRating = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/v1/cad-creator/cad-file-design-ratings`,
        {
          design_id: design._id,
          comment: feedbacks[current],
          star_rating: ratings[current],
        },
        {
          headers: { 'user-uuid': localStorage.getItem('uuid') }, // Replace with actual uuid if you have it in context
        }
      );
      if (res.data.meta.success) {
        setDownloadCount(downlaodCount-1)
        return true;
      } else {
        toast.error(res.data.meta.message || "Failed to submit rating.");
        return false;
      }
    } catch (err) {
      toast.error('Failed to submit rating.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (ratings[current] === 0) return;
    const ok = await submitCurrentRating();
    if (ok && current < designArray.length - 1) {
      setCurrent(current + 1);
    }
  };

  const handleSkip = async () => {
    // Optionally, you can send a "skipped" status or just move to next
    if (current < designArray.length - 1) {
      setCurrent(current + 1);
    }
  };

  const handleSubmit = async () => {
    if (ratings[current] === 0) return;
    const ok = await submitCurrentRating();
    if (ok) setSubmitted(true);
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
              <Image
                src={`${DESIGN_GLB_PREFIX_URL}${design._id}/sprite_0_0.webp`}
                alt="model"
                className={styles.modelImg}
                width={80}
                height={80}
              />
              <span className={styles.modelInfo}>{design.title}</span>
            </div>
            <div className={styles.starsRow}>
              {[1,2,3,4,5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${star <= ratings[current] ? styles.filled : ''}`}
                  onClick={() => handleStar(star)}
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
                value={feedbacks[current]}
                onChange={handleFeedback}
                disabled={loading}
              />
            </div>
            <div className={styles.actionsRow}>
              {current < designArray.length - 1 ? (
                <>
                  <button
                    className={styles.nextBtn}
                    disabled={ratings[current] === 0 || loading}
                    onClick={handleNext}
                  >
                    {loading ? "Saving..." : "Next"}
                  </button>
                  <button className={styles.skipBtn} type="button" onClick={handleSkip} disabled={loading}>
                    Skip
                  </button>
                </>
              ) : (
                <button
                  className={styles.nextBtn}
                  disabled={ratings[current] === 0 || loading}
                  onClick={handleSubmit}
                >
                  {loading ? "Saving..." : "Submit"}
                </button>
              )}
              <span className={styles.progressText}>{current + 1}/{designArray.length}</span>
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