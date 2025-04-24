import React from 'react';
import IndustryDesignCards from './IndustryDesignCards';
import styles from '../HomePages/Capabilities/Capabilities.module.css';
import { BASE_URL } from '@/config';

export default async function IndustryDesigns({ industryData, part_name, industry }) {
  let capabilities = [];

  try {
    const res = await fetch(`${BASE_URL}/v1/cad/get-part-designs?part_route=${part_name}`, {
      cache: 'no-store',
    });

    const data = await res.json();
    capabilities = data.data.response;
    console.log(capabilities, 'data');
  } catch (error) {
    console.error('Error fetching capabilities:', error);
  }

  // ❌ No capabilities? Return null
  if (!capabilities || capabilities.length === 0) return null;

  return (
    <div id="capabilities" className={styles['capabilities-page']}>
      <div className={styles['capabilities-page-head']}>
        <h1 className={styles['capabilities-page-head-title']}>
          {industryData.part_name} CAD Previews in 3D
        </h1>
        <p className={styles['capabilities-page-head-desc']}>
          Interact with high-fidelity 3D models of the {industryData.part_name}. No downloads
          required—just explore, inspect, and collaborate online.
        </p>
      </div>

      <div className={styles['industry-parts-page-img']}>
        <IndustryDesignCards
          styles={styles}
          part_name={part_name}
          industry={industry}
          capabilities={capabilities}
        />
      </div>
    </div>
  );
}
