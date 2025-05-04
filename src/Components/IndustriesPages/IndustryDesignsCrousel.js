import React from 'react';
import styles from './Industry.module.css';
import { BASE_URL } from '@/config'; // Assuming you have a BASE_URL constant
import Image from 'next/image';
import { textLettersLimit } from '@/common.helper';

export default async function IndustryDesignsCrousel({ industry }) {
  let designs = [];
  let category = [];

  try {
    const res = await fetch(`${BASE_URL}/v1/cad/get-category-design?industry=${industry}`, {
      cache: 'no-store', // Always fresh
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch designs: ${res.status}`);
    }

    const data = await res.json();
    console.log('Designs:', data);
    designs = data?.data?.designDetails || [];
    category = data?.data?.categoryDetails || [];
  } catch (error) {
    console.error('Error fetching designs:', error.message);
  }

  if (!designs || designs.length === 0) {
    return null; // No designs? Render nothing
  }

  return (
    <div className={styles["industry-designs"]}>
      <div className={styles["industry-designs-header"]}>
        <h2>Our Designs</h2>
        <p>Explore our collection of industry-specific design inspirations.</p>
      </div>

      <div className={styles["industry-designs-crousel"]}>
        {designs.map((design) => (
          <a href={`/library/${design.route}`} key={design._id} style={{ textDecoration: 'none' }} className={styles["industry-designs-item"]}>
            <div >

              <Image src={`https://d1d8a3050v4fu6.cloudfront.net/${design._id}/sprite_0_150.webp`} alt={design.grabcad_title}
                className={styles["industry-designs-item-img"]} width={300} height={250} />
              <div style={{ width: '100%', height: '2px', background: 'grey' }}></div>
              <h6>{textLettersLimit(design.grabcad_title, 30)}</h6>
              <p>{textLettersLimit(design.grabcad_description, 50)}</p>
            </div>

          </a>

        ))}

        {/* View More Designs */}
        <a
          href={`/library?category=${category.map(item => item.industry_category_name).join(',')}`}
          className={styles["industry-designs-item"]}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            backgroundColor: '#f9f9f9', // light background
            border: '1px dashed #ccc',  // light dashed border
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            color: 'black',
          }}
        >
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Explore More
          </div>
          <div style={{
            fontSize: '14px',
            color: '#666'
          }}>
            Designs ➡️
          </div>
        </a>

      </div>
    </div>
  );
}
