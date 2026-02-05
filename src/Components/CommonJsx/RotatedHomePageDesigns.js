'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../Library/Library.module.css';
import { DESIGN_GLB_PREFIX_URL } from '@/config';
import StaticDesign from './StaticDesign';

const HoverImageSequenceHome = ({ design, loading }) => {
  // Fixed height for home page preview (keep width responsive)
  const height = 280;

  // Supported preview images coming from supporting_files (only image formats) - same as Library
  const supportingImages = (design?.supporting_files || []).filter((f) => {
    const name = f.name || f.fileName || '';
    return /\.(png|jpe?g|webp)$/i.test(name);
  });
  const hasSupportingImages = supportingImages.length > 0;

  // Check if file type is DXF or DWG
  const isDxfOrDwg = design?.file_type?.toLowerCase() === 'dxf' || design?.file_type?.toLowerCase() === 'dwg';

  const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const hoverRef = useRef(false);

  const IMAGE_BASE_URL = `${DESIGN_GLB_PREFIX_URL}${design._id}`;

  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const startCycling = () => {
    if (intervalRef.current || !hoverRef.current) return;
    // For DXF/DWG with supporting images, cycle through image count; otherwise cycle through angles
    const cycleLength = isDxfOrDwg && hasSupportingImages ? supportingImages.length : angles.length;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % cycleLength);
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

  // For DXF/DWG files, show supporting-file images only (same behavior as Library)
  if (isDxfOrDwg && hasSupportingImages) {
    const imageCount = supportingImages.length;
    const activeImage = imageCount > 0 ? supportingImages[currentIndex % imageCount] : null;

    return (
      <div
        ref={containerRef}
        className={styles['library-designs-items-container-img-1']}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {activeImage && (
          <Image
            src={activeImage.url}
            alt={activeImage.name || design.page_title}
            width={298}
            height={298}
            loading={loading}
            priority={loading !== 'lazy'}
            style={{ objectFit: 'contain' }}
          />
        )}
      </div>
    );
  }

  // DXF/DWG with no supporting images: fallback to static thumbnail if available
  if (isDxfOrDwg) {
    return (
      <div
        ref={containerRef}
        className={styles['library-designs-items-container-img-1']}
      >
        <Image
          src={`${IMAGE_BASE_URL}/${design._id}.webp`}
          alt={design.page_title}
          width={298}
          height={298}
          loading={loading}
          priority={loading !== 'lazy'}
          style={{ objectFit: 'contain' }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={styles['library-designs-items-container-img-1']}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isVisible ? (
        <Image
          src={`${IMAGE_BASE_URL}/sprite_${angles[currentIndex]}_${angles[currentIndex]}.webp`}
          alt={design.page_title}
          width={298}
          height={298}
          loading={loading}
          priority={loading !== 'lazy'}
          style={{ objectFit: 'contain' }}
        />
      ) : (
        <StaticDesign design={design} width={298} height={298} loading={loading}/>
      )}
    </div>
  );
};

export default HoverImageSequenceHome;
