import React from 'react'
import styles from './Industry.module.css'
import { BASE_URL } from '@/config';
import HoverImageSequence from '../CommonJsx/RotatedImages';
import { MdOutlineCategory } from 'react-icons/md';


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
 
 const formatTags = String(industryData?.cad_file_formats || '')
   .split(',')
   .map((item) => item.trim())
   .filter(Boolean);

 if (part_name) {
   return (
     <div className={styles['role-of-cad']} style={designId ? {} : { textAlign: 'center', justifyContent: 'center' }}>
       <div className={styles['role-of-cad-content']}>
         <h2 style={designId ? {} : { textAlign: 'center' }}>{industryData.part_name} Essentials</h2>
         <p style={designId ? {} : { textAlign: 'center' }}>{industryData.description}</p>
         <span>Used for</span>
         <p style={designId ? {} : { textAlign: 'center' }}>{industryData.use_cases}</p>
         <span>Common CAD File Formats</span>
         <p style={designId ? {} : { textAlign: 'center' }}>{industryData.cad_file_formats}</p>
       </div>
       {designId && (
         <div className={styles['role-of-cad-desgin']}>
           <HoverImageSequence design={{ _id: designId, page_title: part_name ? part_name : industry }} width={400} height={400} />
         </div>
       )}
     </div>
   );
 }

 return (
   <section className={styles.roleSpotlight}>
     <div className={styles.roleSpotlightInner}>
       <div className={styles.roleSpotlightContent}>
         <span className={styles.roleSpotlightBadge}>Industry spotlight</span>
         <h2 className={styles.roleSpotlightTitle}>Role of CAD file in {industryData.industry}</h2>
         <p className={styles.roleSpotlightDesc}>{industryData.usage}</p>
         <h3 className={styles.roleSpotlightSubhead}>Common CAD File Formats</h3>
         <div className={styles.roleSpotlightTags}>
           {formatTags.map((format) => (
             <span key={format} className={styles.roleSpotlightTag}>
               {format}
             </span>
           ))}
         </div>
       </div>

       <div className={styles.roleSpotlightPreview}>
         <div className={styles.roleSpotlightPreviewVisual}>
           {designId ? (
             <HoverImageSequence
               design={{ _id: designId, page_title: part_name ? part_name : industry }}
               width={220}
               height={220}
             />
           ) : (
             <span className={styles.roleSpotlightPlaceholder} aria-hidden>
               <MdOutlineCategory size={34} />
             </span>
           )}
         </div>
         <p className={styles.roleSpotlightPreviewTitle}>{industryData.industry} CAD Model Preview</p>
         <p className={styles.roleSpotlightPreviewMeta}>
           {formatTags.slice(0, 3).join(' · ') || 'STEP · IGES · STL'}
         </p>
       </div>
     </div>
   </section>
 )
}

export default RoleOfCAD