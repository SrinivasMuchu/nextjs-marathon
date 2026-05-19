import React from 'react';
import { BASE_URL } from '@/config';
import { getLibraryPath } from '@/common.helper';
import IndustryCarouselClient from './IndustryDesignsCrouselButtons';
import Link from 'next/link';
import designHubStyles from '../HomePages/DesignHub/DesignHub.module.css';
import { FaArrowRight } from 'react-icons/fa6';
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


  const viewAllHref = category[0]?.industry_category_name
    ? getLibraryPath({ categoryName: category[0].industry_category_name })
    : '/library';

  return (
    <div className={designHubStyles.designHubContainer}>
      <h3 className={designHubStyles.designHubHead}>{industryName} Design Library</h3>
      <p className={designHubStyles.designHubDesc}>
        Explore high-quality design inspirations curated for the {industryName}.
      </p>
      <IndustryCarouselClient designs={designs} />
      <Link href={viewAllHref} className={designHubStyles.viewAllDesignsButton}>
        View all designs
        <FaArrowRight className={designHubStyles.viewAllDesignsArrow} />
      </Link>
    </div>
  );
}
