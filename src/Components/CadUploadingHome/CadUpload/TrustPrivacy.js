

import React from 'react';
import Image from 'next/image';
import { IMAGEURLS } from '@/config';
import securityStyles from '@/Components/HomePages/Security/Security.module.css';
import SecurityWrapper from '@/Components/HomePages/Security/SecurityWrapper';
import { LockKeyhole, Trash2, UserRound } from 'lucide-react';
import converterStyles from './TrustPrivacyConverter.module.css';

const CONVERTER_ICONS = [LockKeyhole, Trash2, UserRound];

function TrustPrivacy({ items, title, description, variant }) {
  if (variant === 'converterBanner') {
    return (
      <section className={converterStyles.section} aria-labelledby="converter-privacy-heading">
        <div className={converterStyles.banner}>
          <div className={converterStyles.copy}>
            <p className={converterStyles.eyebrow}>Privacy and file handling</p>
            <h2 id="converter-privacy-heading">{title}</h2>
            {description ? <p className={converterStyles.description}>{description}</p> : null}
          </div>
          <div className={converterStyles.items}>
            {items?.map((item, index) => {
              const Icon = CONVERTER_ICONS[index] || LockKeyhole;
              return (
                <article key={item.title} className={converterStyles.item}>
                  <Icon size={17} strokeWidth={1.9} aria-hidden />
                  <h3>{item.title}</h3>
                  {item.description ? <p>{item.description}</p> : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

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
