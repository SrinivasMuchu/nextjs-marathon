import React from 'react';
import Image from 'next/image';
import {
  Zap,
  MonitorSmartphone,
  Cpu,
  Shield,
  Lock,
  Clock,
  Layers,
  Users,
} from 'lucide-react';
import { IMAGEURLS } from '@/config';
import styles from './CoreBenefits.module.css';

const CARD_GRID_ICONS = {
  zap: Zap,
  monitorSmartphone: MonitorSmartphone,
  cpu: Cpu,
  shield: Shield,
  lock: Lock,
  clock: Clock,
};

/** CAD viewer: 2×2 cards, icon left + text right */
const VIEWER_GRID_ICONS = {
  zap: Zap,
  layers: Layers,
  users: Users,
  monitorSmartphone: MonitorSmartphone,
};

function CoreBenefits({ benefits, title, variant }) {
  if (!benefits?.length) return null;

  if (variant === 'viewerGrid') {
    return (
      <section className={styles.viewerGridSection} aria-labelledby="viewer-core-benefits-heading">
        <h2 id="viewer-core-benefits-heading" className={styles.viewerGridHeading}>
          {title}
        </h2>
        <div className={styles.viewerGrid}>
          {benefits.map((item, index) => {
            const Icon = (item.icon && VIEWER_GRID_ICONS[item.icon]) || Zap;
            return (
              <article key={index} className={styles.viewerCard}>
                <div className={styles.viewerCardIconBox} aria-hidden>
                  <Icon size={22} strokeWidth={2.2} className={styles.viewerCardIconSvg} />
                </div>
                <div className={styles.viewerCardBody}>
                  <h3 className={styles.viewerCardTitle}>{item.title}</h3>
                  <p className={styles.viewerCardDescription}>{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  if (variant === 'cardGrid') {
    return (
      <section className={styles.cardGridSection} aria-labelledby="core-benefits-heading">
        <h2 id="core-benefits-heading" className={styles.cardGridHeading}>
          {title}
        </h2>
        <div className={styles.cardGrid}>
          {benefits.map((item, index) => {
            const Icon = (item.icon && CARD_GRID_ICONS[item.icon]) || Zap;
            return (
              <article key={index} className={styles.benefitCard}>
                <div className={styles.benefitCardIconBox} aria-hidden>
                  <Icon size={22} strokeWidth={2.2} className={styles.benefitCardIconSvg} />
                </div>
                <h3 className={styles.benefitCardTitle}>{item.title}</h3>
                <p className={styles.benefitCardDescription}>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

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
