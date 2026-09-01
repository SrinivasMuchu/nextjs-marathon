'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../Library/Library.module.css';
import { DESIGN_GLB_PREFIX_URL } from '@/config';
import {
  THUMBNAIL_SPRITE_ANGLES,
  getThumbnailSpriteUrl,
} from '@/data/thumbnailSpriteAngles';
import StaticDesign from './StaticDesign';


const HoverImageSequence = ({ design, width, height, loading, containerClassName = '' }) => {
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
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
      { threshold: 0.05, rootMargin: '40px 0px' }
    );

    const node = containerRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);


  const startCycling = () => {
    if (intervalRef.current || !hoverRef.current) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % THUMBNAIL_SPRITE_ANGLES.length);
    }, 300);
  };


  const stopCycling = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setCurrentIndex(0);
  };


  const handleMouseEnter = () => {
    hoverRef.current = true;
    setIsHovering(true);
    startCycling();
  };


  const handleMouseLeave = () => {
    hoverRef.current = false;
    setIsHovering(false);
    stopCycling();
  };


  const containerClass = [
    styles['library-designs-items-container-img'],
    containerClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const containerStyle = containerClassName
    ? { height: '100%', minHeight: height || undefined }
    : { height };

  // Lazy-load sprite sheets when in view; always allow hover rotation once interacted.
  const showRotatingPreview = isVisible || isHovering;

  // For DXF/DWG files only, cycle through supporting images on hover
  if (isDxfOrDwg && hasSupportingImages) {
    const imageCount = supportingImages.length;
    const activeImage =
      imageCount > 0 ? supportingImages[currentIndex % imageCount] : null;

    return (
      <div
        ref={containerRef}
        style={containerStyle}
        className={containerClass}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {activeImage && (
          <Image
            src={activeImage.url}
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
      style={containerStyle}
      className={containerClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showRotatingPreview ? (
        <Image
          src={getThumbnailSpriteUrl(IMAGE_BASE_URL, currentIndex)}
          alt={design.page_title}
          width={width}
          height={height}
          loading={loading}
          priority={loading !== 'lazy'}
        />
      ) : (
        <StaticDesign design={design} width={width} height={height} loading={loading} />
      )}
    </div>
  );
};


export default HoverImageSequence;






