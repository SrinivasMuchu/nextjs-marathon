// RoleOfCadImage.tsx (Server Component)
import Image from 'next/image';
import { BASE_URL } from '@/config';

async function RoleOfCadImage({ styles, industry, part_name, uuid }) {
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
    <>
      {designId &&  <div className={styles['role-of-cad-desgin']}>
    <Image
      src={`https://d1d8a3050v4fu6.cloudfront.net/${designId}/sprite_0_150.webp`}
      alt={part_name ? part_name : industry}
      width={400}
      height={400}
      className={styles['role-of-cad-desgin-image']}
    />
  </div>}
    </>
  
   
  );
}

export default RoleOfCadImage;
