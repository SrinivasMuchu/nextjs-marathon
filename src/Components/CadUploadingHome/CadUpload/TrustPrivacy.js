

import React from 'react';
import Image from 'next/image';
import { IMAGEURLS } from '@/config';
import securityStyles from '@/Components/HomePages/Security/Security.module.css';
import SecurityWrapper from '@/Components/HomePages/Security/SecurityWrapper';

function TrustPrivacy({ items, title, description }) {
  return (
    <SecurityWrapper styles={securityStyles}>
      <div className={securityStyles['security-content']}>
        <h3 className={securityStyles['security-head']}>{title}</h3>
        {description && (
          <p className={securityStyles['security-desc']}>{description}</p>
        )}
      </div>
      <div className={securityStyles['security-points']}>
        <div className={securityStyles['security-points-1']}>
          {items?.map((item, index) => (
            <div key={index} className={securityStyles['security-internal-points']}>
              <Image
                src={IMAGEURLS.points}
                alt=""
                width={40}
                height={40}
              />
              <div>
                <p className={securityStyles['security-desc-questions']}>{item.title}</p>
                {item.description && (
                  <p className={securityStyles['security-desc-points']} style={{ marginTop: 4, opacity: 0.9 }}>{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SecurityWrapper>
  );
}

export default TrustPrivacy;
