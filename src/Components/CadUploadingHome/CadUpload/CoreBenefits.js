import React from 'react';
import Image from 'next/image';
import { IMAGEURLS } from '@/config';
import styles from './CoreBenefits.module.css';

function CoreBenefits({ benefits, title }) {
  if (!benefits?.length) return null;

  const mid = Math.ceil(benefits.length / 2);
  const leftColumn = benefits.slice(0, mid);
  const rightColumn = benefits.slice(mid);

  return (
    <div className={styles.coreBenefitsPage}>
      <h2 className={styles.coreBenefitsHeading}>{title}</h2>
      <div className={styles.coreBenefitsColumns}>
        <div className={styles.coreBenefitsColumn}>
          {leftColumn.map((item, index) => (
            <div key={index} className={styles.coreBenefitsItem}>
              <span className={styles.coreBenefitsItemIcon}>
                <Image src={IMAGEURLS.check} alt="" width={24} height={24} />
              </span>
              <div className={styles.coreBenefitsItemContent}>
                <h3 className={styles.coreBenefitsItemTitle}>{item.title}</h3>
                <p className={styles.coreBenefitsItemDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.coreBenefitsColumn}>
          {rightColumn.map((item, index) => (
            <div key={index} className={styles.coreBenefitsItem}>
              <span className={styles.coreBenefitsItemIcon}>
                <Image src={IMAGEURLS.check} alt="" width={24} height={24} />
              </span>
              <div className={styles.coreBenefitsItemContent}>
                <h3 className={styles.coreBenefitsItemTitle}>{item.title}</h3>
                <p className={styles.coreBenefitsItemDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoreBenefits;
