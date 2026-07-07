import React from 'react'
import { DESIGN_GLB_PREFIX_URL } from '@/config';
import styles from '../Library/Library.module.css';
import Image from 'next/image';

function StaticDesign({ design, width, height, loading, imageClassName = '' }) {
  const IMAGE_BASE_URL = `${DESIGN_GLB_PREFIX_URL}${design._id}`;
  return (
    <Image
      src={`${IMAGE_BASE_URL}/sprite_0_0.webp`}
      alt={design.page_title}
      width={width}
      height={height}
      loading={loading}
      priority={loading !== 'lazy'}
      className={imageClassName || undefined}
    />
  );
}

export default StaticDesign