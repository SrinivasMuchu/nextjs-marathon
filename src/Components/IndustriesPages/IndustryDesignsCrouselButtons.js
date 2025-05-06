'use client';

import React, { useRef } from 'react';
import styles from './Industry.module.css';

export default function IndustryDesignsCrouselButtons({ children }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles["scroll-container-wrapper"]}>
      <button className={styles["scroll-btn"]} onClick={() => scroll('left')}>⬅️</button>
      <div className={styles["scroll-container"]} ref={scrollRef}>
        {children}
      </div>
      <button className={styles["scroll-btn"]} onClick={() => scroll('right')}>➡️</button>
    </div>
  );
}
