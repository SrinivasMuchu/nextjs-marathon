import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../CadHomeDesign/CadHome.module.css';
import { IMAGEURLS } from '@/config';

const blocks = [
  {
    heading: 'Need to preview before converting?',
    ctaLabel: 'Open CAD Viewer',
    href: '/tools/3D-cad-viewer',
    image: IMAGEURLS.freeTools1,
  },
  {
    heading: 'Looking for ready-to-use CAD files?',
    ctaLabel: 'Browse CAD Library',
    href: '/library',
    image: IMAGEURLS.freeTools3,
  },
];

function InterlinkingBlocks() {
  return (
    <div className={styles['cad-industries']} style={{ background: 'linear-gradient(0deg, hsla(0, 0%, 100%, .9), hsla(0, 0%, 100%, .9)), #ff7a7a' }}>
      <div className={styles['cad-industries-content']}>
        <h2 style={{ color: '#000', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, margin: 0, textAlign: 'center' }}>
          Explore more
        </h2>
      </div>
      <div className={styles['cad-industries-items']} style={{ maxWidth: 900, gap: 24 }}>
        {blocks.map((block, index) => (
          <div key={index} className={styles['cad-industries-item-cont']} style={{ minHeight: 'auto', padding: 24 }}>
            {block.image && (
              <div style={{ marginBottom: 16, borderRadius: 8, overflow: 'hidden', position: 'relative', aspectRatio: '16/10', maxWidth: '100%' }}>
                <Image
                  src={block.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <h3 style={{ color: '#000', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700, margin: 0, marginBottom: 16 }}>
              {block.heading}
            </h3>
            <Link
              href={block.href}
              className={styles['cad-conversion-button']}
              style={{ display: 'inline-block', textDecoration: 'none', color: 'white', marginTop: 'auto' }}
            >
              {block.ctaLabel} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InterlinkingBlocks;
