import React from 'react'
import styles from './Industry.module.css'
import RoleOfCadImage from './RoleOfCadImage'
import Image from 'next/image';
import { BASE_URL, DESIGN_GLB_PREFIX_URL } from '@/config';


async function RoleOfCAD({industryData,part_name,industry}) {
  let designId = '';
 
   try {
     const queryParam = part_name
       ? `part_name=${encodeURIComponent(part_name)}`
       : `industry=${encodeURIComponent(industry)}`;
 
     const res = await fetch(`${BASE_URL}/v1/cad/get-design?${queryParam}`, {
     //   headers: {
     //     'user-uuid': uuid, // passed from client or middleware
     //   },
       cache: 'no-store',
     });
 
     const data = await res.json();
     designId = data?.data?.design_id || '';
   } catch (error) {
     console.error('Error fetching design:', error);
   }
 
  return (
    <div className={styles['role-of-cad']}  style={designId ? {} : { textAlign: 'center',justifyContent: 'center'}}>
        <div className={styles['role-of-cad-content']} >
          {part_name ? <>
            <h2 style={designId ? {} : { textAlign: 'center' }}>{industryData.part_name} Essentials</h2>
            <p style={designId ? {} : { textAlign: 'center' }}>{industryData.description}</p>
            <span>Used for</span>
            <p style={designId ? {} : { textAlign: 'center' }}>{industryData.use_cases}</p>
            <span>Common CAD File Formats</span>
            <p style={designId ? {} : { textAlign: 'center' }}>{industryData.cad_file_formats}</p>
          </>:<>
          <h2>Role of CAD file in {industryData.industry}</h2>
            <p style={designId ? {} : { textAlign: 'center' }}>{industryData.usage}</p>
            <span>Common CAD File Formats</span>
            <p style={designId ? {} : { textAlign: 'center' }}>{industryData.cad_file_formats}</p>
          </>}
          
        </div>
        {designId && <div className={styles['role-of-cad-desgin']}>
            <Image
              src={`${DESIGN_GLB_PREFIX_URL}${designId}/sprite_0_150.webp`}
              alt={part_name ? part_name : industry}
              width={400}
              height={400}
              className={styles['role-of-cad-desgin-image']}
            />
          </div>}
        
       
    </div>
  )
}

export default RoleOfCAD