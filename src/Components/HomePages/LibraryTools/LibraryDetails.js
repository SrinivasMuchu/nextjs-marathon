 // 👈 Add this at the top

import React from 'react';
import styles from '../Tools/Tools.module.css';
import Image from 'next/image';
import LibraryScroll from './LibraryScroll';
import { DESIGN_GLB_PREFIX_URL } from '@/config';

const categories = [
  {
    title: "Aerospace",
    route: 'aerospace',
    _id: '680b7a0e35a26ccc297a02d4',
    thumbnail: `${DESIGN_GLB_PREFIX_URL}680b7a0e35a26ccc297a02d4/sprite_0_0.webp`
  },
  {
    title: "Automotive",
    route: 'automotive',
    _id: '6817dd65e883a1bdfe58b894',
    thumbnail: `${DESIGN_GLB_PREFIX_URL}6817dd65e883a1bdfe58b894/sprite_0_150.webp`
  },
  {
    title: "Architecture",
    route: 'architecture',
    _id: '6812139aabe872202f9758d3',
    thumbnail: `${DESIGN_GLB_PREFIX_URL}6812139aabe872202f9758d3/sprite_0_0.webp`
  },
  
  {
    title: "Electrical",
    route: 'electrical',
    _id: '680c8be811a13a42a587d583',
    thumbnail: `${DESIGN_GLB_PREFIX_URL}680c8be811a13a42a587d583/sprite_0_0.webp`
  },
  {
    title: "Aviation",
    route: 'aviation',
    _id: '680b94f935a26ccc297a02fe',
    thumbnail: `${DESIGN_GLB_PREFIX_URL}680b94f935a26ccc297a02fe/sprite_0_0.webp`
  },
  {
    title: "Robotic",
    route: 'robotics',
    _id: '68156780fcc7c6ee36fcf8d2',
    thumbnail: `${DESIGN_GLB_PREFIX_URL}68156780fcc7c6ee36fcf8d2/sprite_0_0.webp`
  },
  {
    title: "Jewellery",
    route: 'jewellery',
    _id: '680bbcc635a26ccc297a036d',
    thumbnail: `${DESIGN_GLB_PREFIX_URL}680bbcc635a26ccc297a036d/sprite_0_0.webp`
  },
   {
    title: "Manufacturing & CNC",
    route: 'machine-design',
    _id: '681c0dbef88b4b11bc92d3c7',
    thumbnail: `${DESIGN_GLB_PREFIX_URL}681c0dbef88b4b11bc92d3c7/sprite_0_0.webp`
  },
  {
    title: "3D Printing",
    route: '3d-printing',
    _id: '6815f25b2668f81c8127eb12',
    thumbnail: `${DESIGN_GLB_PREFIX_URL}6815f25b2668f81c8127eb12/sprite_0_0.webp`
  },
  {
    title: "Construction",
    route: 'construction',
    _id: '6812c6d4abe872202f975943',
    thumbnail: `${DESIGN_GLB_PREFIX_URL}6812c6d4abe872202f975943/sprite_0_0.webp`
  },
  {
    title: "Marine",
    route: 'marine',
    _id: '6815c98bb68908c2af9d1029',
    thumbnail: `${DESIGN_GLB_PREFIX_URL}6815c98bb68908c2af9d1029/sprite_0_0.webp`
  },
  {
    title: "Medical",
    route: 'medical',
    _id: '681073ea53cff792537302dd',
    thumbnail: `${DESIGN_GLB_PREFIX_URL}681073ea53cff792537302dd/sprite_0_0.webp`
  },
  
 
 
];

function LibraryDetails() {
  return (
    <div className={styles['library-tools-page']} style={{ position: 'relative' }}>
      <div className={styles['tools-page-header']}>
        <h3>CAD Design Library</h3>
        <p>3D CAD designs for engineering and product development. Browse models across industries to accelerate design inspiration and collaboration.</p>
      </div>
      <LibraryScroll categories={categories}/>
      
    </div>
  );
}

export default LibraryDetails;
