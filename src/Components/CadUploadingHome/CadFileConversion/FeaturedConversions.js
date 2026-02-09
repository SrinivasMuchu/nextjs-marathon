import React from 'react';
import Link from 'next/link';
import styles from '../CadHomeDesign/CadHome.module.css';
import { featuredConversions } from '@/common.helper';

function FeaturedConversions() {
  return (
    <div className={styles['cad-convert-types']}>
      <h2>Popular conversions</h2>
      <div className={styles['cad-convert-types-list']}>
        {featuredConversions.map((item, index) => (
          <Link
            href={`/tools/convert-${item.path.slice(1)}`}
            key={index}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: 250,
                minHeight: 80,
                padding: 16,
                background: 'white',
                borderRadius: 8,
                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 'clamp(14px, 2vw, 18px)', marginBottom: 6 }}>
                {item.label}
              </span>
              {item.oneLiner && (
                <span style={{ fontSize: 13, lineHeight: 1.4, color: '#555' }}>{item.oneLiner}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FeaturedConversions;
