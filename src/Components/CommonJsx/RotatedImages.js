'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../Library/Library.module.css';
import { DESIGN_GLB_PREFIX_URL, PHOTO_LINK } from '@/config';
import StaticDesign from './StaticDesign';

// Normalize supporting file URL:
// - If it is an S3 URL, convert to CloudFront using PHOTO_LINK
// - Otherwise return as-is
const mapSupportingUrlToPhotoLink = (file) => {
  const raw = file?.url || '';
  if (!raw) return '';

  // Already non-S3 (likely already CloudFront or other CDN) – use as-is
  if (!raw.includes('.s3.')) return raw;

  const s3UrlWithoutQuery = raw.split('?')[0];
  const [, key = ''] = s3UrlWithoutQuery.split('.com/');

  return key ? `${PHOTO_LINK}${key}` : raw;
};


const HoverImageSequence = ({ design, width, height, loading }) => {
  // Supported preview images coming from supporting_files (only image formats)
  const supportingImages = (design?.supporting_files || []).filter((f) => {
    const name = f.name || f.fileName || '';
    return /\.(png|jpe?g|webp)$/i.test(name);
  });
  const hasSupportingImages = supportingImages.length > 0;

  // Check if file type is DXF or DWG
  const isDxfOrDwg =
    design?.file_type?.toLowerCase() === 'dxf' ||
    design?.file_type?.toLowerCase() === 'dwg';

  const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  // const yangles = [0, 330, 300, 270, 240, 210, 180, 150, 120, 90, 60, 30];
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


  // For DXF/DWG files only, cycle through supporting images on hover
  if (isDxfOrDwg && hasSupportingImages) {
    const imageCount = supportingImages.length;
    const activeImage =
      imageCount > 0 ? supportingImages[currentIndex % imageCount] : null;

    return (
      <div
        ref={containerRef}
        style={{ height }}
        className={styles['library-designs-items-container-img']}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {activeImage && (
          <Image
            src={mapSupportingUrlToPhotoLink(activeImage)}
            alt={activeImage.name || design.page_title}
            width={width}
            height={height}
            loading={loading}
            priority={loading !== 'lazy'}
          />
        )}
      </div>
    );
  }


  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={styles['library-designs-items-container-img']}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isVisible ? (
        <Image
          src={`${IMAGE_BASE_URL}/sprite_${angles[currentIndex]}_${angles[currentIndex]}.webp`}
          alt={design.page_title}
          width={width}
          height={height}
          loading={loading} // 'lazy' or 'eager'
          priority={loading !== 'lazy'}
        />
      ) : (
        <StaticDesign design={design} width={width} height={height} loading={loading}/>
      )}
    </div>
  );
};


export default HoverImageSequence;






