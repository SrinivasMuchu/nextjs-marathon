'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Library.module.css';
import { DESIGN_GLB_PREFIX_URL } from '@/config';

const HoverImageSequence = ({ design }) => {
  const angles = [0,30, 60, 90, 120, 150, 180, 210, 240,270,300,330,360]; // custom order
  const yangles = [0,360,330,300,270,240,210,180,150, 120, 90, 60, 30]; // custom order
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const hoverRef = useRef(false);

  const IMAGE_BASE_URL = `${DESIGN_GLB_PREFIX_URL}${design._id}`;

  const startCycling = () => {
    if (intervalRef.current || !hoverRef.current) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % angles.length);
    }, 300);
  };

  const stopCycling = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setCurrentIndex(0);
  };

  const handleMouseEnter = () => {
    hoverRef.current = true;
    startCycling();
  };

  const handleMouseLeave = () => {
    hoverRef.current = false;
    stopCycling();
  };

  return (
    <div
      className={styles['library-designs-items-container-img']}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={`${IMAGE_BASE_URL}/sprite_${angles[currentIndex]}_${yangles[currentIndex]}.webp`}
        alt={design.page_title}
        width={300}
        height={250}
        priority
      />
    </div>
  );
};

export default HoverImageSequence;
