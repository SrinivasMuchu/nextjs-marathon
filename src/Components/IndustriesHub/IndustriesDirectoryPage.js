import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2 } from 'lucide-react';
import Footer from '@/Components/HomePages/Footer/Footer';
import ActiveLastBreadcrumb from '@/Components/CommonJsx/BreadCrumbs';
import { BASE_URL, MARATHON_ASSET_PREFIX_URL } from '@/config';
import { textLettersLimit } from '@/common.helper';
import styles from './IndustriesDirectoryPage.module.css';

async function fetchIndustries() {
  try {
    const res = await fetch(`${BASE_URL}/v1/cad/get-industry-data`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    const list = json?.data;
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export default async function IndustriesDirectoryPage() {
  const industries = await fetchIndustries();

  return (
    <div className={styles.page}>
      <ActiveLastBreadcrumb
        links={[
          { label: 'tools', href: '/tools' },
          { label: 'Industries', href: '/tools/industries' },
        ]}
      />

      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.badge}>
            <Building2 size={16} strokeWidth={2.2} aria-hidden />
            <span>Industry CAD viewers</span>
          </p>
          <h1 className={styles.title}>Browse industries</h1>
          <p className={styles.lead}>
            Open the Marathon OS CAD viewer experience tailored to your sector—each page includes formats,
            sample workflows, and upload tools for that industry.
          </p>
        </div>
      </header>

      <section className={styles.gridSection} aria-labelledby="industries-grid-heading">
        <h2 id="industries-grid-heading" className={styles.visuallyHidden}>
          All industries
        </h2>
        {industries.length === 0 ? (
          <p className={styles.empty}>No industries are available right now. Please try again later.</p>
        ) : (
          <ul className={styles.grid}>
            {industries.map((item) => (
              <li key={item._id || item.route}>
                <Link href={`/industry/${item.route}`} className={styles.card}>
                  <div className={styles.cardMedia}>
                    {item.logo ? (
                      <Image
                        src={`${MARATHON_ASSET_PREFIX_URL}${item.logo}`}
                        alt={item.industry ? `${item.industry} logo` : 'Industry logo'}
                        width={120}
                        height={120}
                        className={styles.cardImg}
                      />
                    ) : (
                      <span className={styles.cardPlaceholder} aria-hidden>
                        <Building2 size={36} strokeWidth={2} />
                      </span>
                    )}
                  </div>
                  <h3 className={styles.cardTitle}>{item.industry}</h3>
                  {item.description ? (
                    <p className={styles.cardDesc}>{textLettersLimit(item.description, 180)}</p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Footer />
    </div>
  );
}
