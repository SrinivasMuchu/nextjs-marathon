 // 👈 Add this at the top

import React from 'react';
import styles from '../Tools/Tools.module.css';
import Image from 'next/image';
import LibraryScroll from './LibraryScroll';

const categories = [
  {
    title: "Aerospace",
    route: 'aerospace',
    thumbnail: "https://d1d8a3050v4fu6.cloudfront.net/680b7a0e35a26ccc297a02d4/sprite_0_0.webp"
  },
  {
    title: "Automotive",
    route: 'automotive',
    thumbnail: "https://d1d8a3050v4fu6.cloudfront.net/6817dd65e883a1bdfe58b894/sprite_0_150.webp"
  },
  {
    title: "Architecture",
    route: 'architecture',
    thumbnail: "https://d1d8a3050v4fu6.cloudfront.net/6812139aabe872202f9758d3/sprite_0_0.webp"
  },
  
  {
    title: "Electrical",
    route: 'electrical',
    thumbnail: "https://d1d8a3050v4fu6.cloudfront.net/680c8be811a13a42a587d583/sprite_0_0.webp"
  },
  {
    title: "Aviation",
    route: 'aviation',
    thumbnail: "https://d1d8a3050v4fu6.cloudfront.net/680b94f935a26ccc297a02fe/sprite_0_0.webp"
  },
  {
    title: "Robotic",
    route: 'robotic',
    thumbnail: "https://d1d8a3050v4fu6.cloudfront.net/68156780fcc7c6ee36fcf8d2/sprite_0_0.webp"
  },
  {
    title: "Jewellery",
    route: 'jewellery',
    thumbnail: "https://d1d8a3050v4fu6.cloudfront.net/680bbcc635a26ccc297a036d/sprite_0_0.webp"
  },
  {
    title: "3D Printing",
    route: '3d-printing',
    thumbnail: "https://d1d8a3050v4fu6.cloudfront.net/6815f25b2668f81c8127eb12/sprite_0_0.webp"
  },
  {
    title: "Construction",
    route: 'construction',
    thumbnail: "https://d1d8a3050v4fu6.cloudfront.net/6812c6d4abe872202f975943/sprite_0_0.webp"
  },
  {
    title: "Marine",
    route: 'marine',
    thumbnail: "https://d1d8a3050v4fu6.cloudfront.net/6815c98bb68908c2af9d1029/sprite_0_0.webp"
  },
  {
    title: "Medical",
    route: 'medical',
    thumbnail: "https://d1d8a3050v4fu6.cloudfront.net/681073ea53cff792537302dd/sprite_0_0.webp"
  },
  
 
 
];

function LibraryDetails() {
  return (
    <div className={styles['library-tools-page']} style={{ position: 'relative' }}>
      <div className={styles['tools-page-header']}>
        <h2>CAD Design Library</h2>
        <p>3D CAD designs for engineering and product development. Browse models across industries to accelerate design inspiration and collaboration.</p>
      </div>
      <LibraryScroll categories={categories}/>
      
    </div>
  );
}

export default LibraryDetails;
