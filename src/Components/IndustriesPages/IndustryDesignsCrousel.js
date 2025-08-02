

import React from 'react';
import styles from './Industry.module.css';
import { BASE_URL } from '@/config';
import Image from 'next/image';
import { textLettersLimit } from '@/common.helper';
import IndustryCarouselClient from './IndustryDesignsCrouselButtons';
import Link from 'next/link';
export default async function IndustryDesignsCrousel({ industry }) {
  let designs = [];
  let category = [];
  let industryName = '';

  try {
    const res = await fetch(`${BASE_URL}/v1/cad/get-category-design?industry=${industry}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch designs: ${res.status}`);
    }

    const data = await res.json();
    designs = data?.data?.designDetails || [];
    industryName = data?.data?.industry || '';
    category = data?.data?.categoryDetails || [];
  } catch (error) {
    console.error('Error fetching designs:', error.message);
  }

  if (!designs || designs.length === 0) return null;

  // Reference to the scrollable container


  return (
    <div className={styles["industry-designs"]} style={{ position: 'relative' }}>
      <div className={styles["industry-designs-header"]}>
        <h2>{industryName} Design Library</h2>
        <p style={{ color: 'rgba(135, 134, 134, 0.7)' }}>
          Explore high-quality design inspirations curated for the {industryName}.
          <Link style={{
            color: 'white', opacity: '1', padding: '5px 10px',
            background: '#610bee', borderRadius: '8px', marginLeft: '10px'
          }}
            href={`/library?category=${category[0]?.industry_category_name}`}>
            View all →
          </Link>
        </p>
      </div>
      <IndustryCarouselClient
        designs={designs}
        category={category}
        industryName={industryName}
      />
    </div>
  );
}
