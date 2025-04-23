// app/components/IndustryDesignCards.tsx (or .jsx if using JS)
import IndustryDesignParallelaxWrapper from './IndustryDesignParallelaxWrapper';
import { BASE_URL } from '@/config';
import { textLettersLimit } from '@/common.helper';
import Image from 'next/image';

async function IndustryDesignCards({ styles, part_name, industry, uuid }) {
  let capabilities = [];

  try {
    const res = await fetch(`${BASE_URL}/v1/cad/get-part-designs?part_name=${part_name}`, {
      
      cache: 'no-store', // optional: to avoid caching if data updates often
    });

    const data = await res.json();
    console.log(data.data.response, 'data');
    capabilities = data.data.response;
  } catch (error) {
    console.error('Error fetching capabilities:', error);
  }

  return (
    <div className={styles['industry-horizontal-img-cont']}  >
      {capabilities.slice(0, 4).map((capability, index) => (
        <IndustryDesignParallelaxWrapper key={index} styles={styles} >
          <a href={`/industry/${industry}/${part_name}/${capability.route}`}>
            <div className={styles['capabilities-img-cont']} >
              <Image
                src={`https://d1d8a3050v4fu6.cloudfront.net/${capability._id}/sprite_0_150.webp`}
                alt={capability.page_title}
                className={styles['capabilities-img']}
                width={100}
                height={150}
              />
            </div>
           
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
