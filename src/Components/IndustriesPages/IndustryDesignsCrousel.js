

import React from 'react';
import styles from './Industry.module.css';
import { BASE_URL } from '@/config';
import Image from 'next/image';
import { textLettersLimit } from '@/common.helper';
import IndustryCarouselClient from './IndustryDesignsCrouselButtons';

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
    <IndustryCarouselClient
    designs={designs}
    category={category}
    industryName={industryName}
  />
  );
}
