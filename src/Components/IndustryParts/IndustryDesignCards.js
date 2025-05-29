// app/components/IndustryDesignCards.tsx (or .jsx if using JS)
import IndustryDesignParallelaxWrapper from './IndustryDesignParallelaxWrapper';
import { BASE_URL, DESIGN_GLB_PREFIX_URL } from '@/config';
import { textLettersLimit } from '@/common.helper';
import Image from 'next/image';

async function IndustryDesignCards({ styles, part_name, industry, uuid }) {
  let capabilities = [];

  try {
    const res = await fetch(`${BASE_URL}/v1/cad/get-part-designs?part_route=${part_name}`, {
      
      cache: 'no-store', // optional: to avoid caching if data updates often
    });
 
    const data = await res.json();
  
    capabilities = data.data.response;
  } catch (error) {
    console.error('Error fetching capabilities:', error);
  }

  return (
    <div className={styles['industry-horizontal-img-cont']}  >
      {capabilities.map((capability, index) => (
        <IndustryDesignParallelaxWrapper key={index} styles={styles} >
          <a href={`/industry/${industry}/${part_name}/${capability.route}`}>
            <div className={styles['capabilities-img-cont']} >
              <Image
                src={`${DESIGN_GLB_PREFIX_URL}${capability._id}/sprite_0_150.webp`}
                alt={capability.page_title}
                className={styles['capabilities-img']}
                width={100}
                height={150}
              />
            </div>
            <div style={{ width: '100%', height: '2px', background: 'grey', marginBottom: '5px' }}></div>
            <div className={styles['capabilities-page-card-text']}>
              
              <h6 className={styles['capabilities-page-card-head']}>
                {capability.page_title}
              </h6>
              <p className={styles['capabilities-page-card-desc']} >
                {textLettersLimit(capability.page_description, 45)}
              </p>
            </div>
          </a>
        </IndustryDesignParallelaxWrapper>
      ))}
    </div>
  );
}

export default IndustryDesignCards;
