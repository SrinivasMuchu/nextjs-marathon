import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2 } from 'lucide-react';
import Footer from '@/Components/HomePages/Footer/Footer';
import ActiveLastBreadcrumb from '@/Components/CommonJsx/BreadCrumbs';
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner';
import cadHomeStyles from '@/Components/CadUploadingHome/CadHomeDesign/CadHome.module.css';
import { BASE_URL, MARATHON_ASSET_PREFIX_URL } from '@/config';
import { textLettersLimit } from '@/common.helper';
import RequestDemoPopupButton from '@/Components/IndustriesHub/RequestDemoPopupButton';
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

async function fetchIndustryParts(industrySlug) {
  try {
    if (!industrySlug) return [];
    const res = await fetch(
      `${BASE_URL}/v1/cad/get-industry-part-data?industry=${encodeURIComponent(industrySlug)}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const list = json?.data;
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function parseFormats(rawFormats) {
  const DEFAULT_FORMATS = ['STEP', 'IGES', 'STL', 'BREP'];
  if (!rawFormats || !String(rawFormats).trim()) {
    return DEFAULT_FORMATS;
  }

  const tokens = String(rawFormats)
    .split(/[,|/]/)
    .map((token) => token.trim().toUpperCase().replace(/^\./, ''))
    .filter(Boolean);
  const unique = [...new Set(tokens)];
  return (unique.length ? unique : DEFAULT_FORMATS).slice(0, 4);
}

function getPartNames(parts) {
  const uniqueByKey = new Map();
  (Array.isArray(parts) ? parts : []).forEach((part) => {
    const name = part?.part_name?.trim();
    if (!name) return;
    const route = part?.route?.trim() || null;
    const key = route || name.toLowerCase();
    if (!uniqueByKey.has(key)) {
      uniqueByKey.set(key, { name, route });
    }
  });
  return Array.from(uniqueByKey.values()).slice(0, 6);
}

export default async function IndustriesDirectoryPage() {
  const industries = await fetchIndustries();
  const partsByIndustry = await Promise.all(
    industries.map(async (item) => {
      const route = item?.route;
      const parts = await fetchIndustryParts(route);
      return [route, parts];
    })
  );
  const partsMap = new Map(partsByIndustry);

  return (
    <div className={styles.page}>
      <ActiveLastBreadcrumb
        links={[
          { label: 'tools', href: '/tools' },
          { label: 'Industries', href: '/tools/industries' },
        ]}
      />
      <div className={cadHomeStyles['cad-ad-bar']}>
        <div className={cadHomeStyles['cad-ad-bar-inner']}>
          <LeftRightBanner adSlot="3755241003" />
        </div>
      </div>

      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.badge}>
            <Building2 size={16} strokeWidth={2.2} aria-hidden />
            <span>Industries we serve</span>
          </p>
          <h1 className={styles.title}>CAD viewers built for every engineering discipline</h1>
          <p className={styles.lead}>
            Marathon OS opens, inspects, and reviews CAD files for teams across automotive,
            aerospace, manufacturing, and beyond — directly in the browser, with no installs.
          </p>
          <div className={styles.heroActions}>
            <a href="#industries-grid-heading" className={styles.primaryAction}>
              Browse all industries
              <span aria-hidden>→</span>
            </a>
            <RequestDemoPopupButton className={styles.secondaryAction}>
              Request Demo
            </RequestDemoPopupButton>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <p className={styles.statValue}>{Math.max(industries.length, 6)}+</p>
              <p className={styles.statLabel}>Industries</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>50+</p>
              <p className={styles.statLabel}>File formats</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>300MB</p>
              <p className={styles.statLabel}>Per file</p>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.gridSection} aria-labelledby="industries-grid-heading">
        <div className={styles.gridHead}>
          <div>
            <h2 id="industries-grid-heading" className={styles.gridHeading}>
              Pick your industry
            </h2>
            <p className={styles.gridSubhead}>
              Each industry page includes part libraries, supported file formats, and tailored review
              workflows.
            </p>
          </div>
          <p className={styles.gridCount}>
            {industries.length} {industries.length === 1 ? 'industry' : 'industries'}
          </p>
        </div>
        {industries.length === 0 ? (
          <p className={styles.empty}>No industries are available right now. Please try again later.</p>
        ) : (
          <ul className={styles.grid}>
            {industries.map((item) => {
              const parts = partsMap.get(item.route) || [];
              const partNames = getPartNames(parts);
              const formats = parseFormats(item?.cad_file_formats);
              return (
              <li key={item._id || item.route}>
                <article className={styles.card}>
                  <Link href={`/industry/${item.route}`} className={styles.cardMainLink}>
                    <div className={styles.cardIntro}>
                      <div className={styles.cardTop}>
                        {item.logo ? (
                          <div className={styles.cardMedia}>
                            <Image
                              src={`${MARATHON_ASSET_PREFIX_URL}${item.logo}`}
                              alt={item.industry ? `${item.industry} logo` : 'Industry logo'}
                              width={180}
                              height={120}
                              className={styles.cardImg}
                            />
                          </div>
                        ) : null}
                        <div className={styles.cardHeadText}>
                          <h3 className={styles.cardTitle}>{item.industry}</h3>
                        </div>
                      </div>
                      {item.description ? (
                        <p className={styles.cardDesc}>{textLettersLimit(item.description, 150)}</p>
                      ) : null}
                    </div>
                  </Link>
                  <div className={styles.cardMetaBlock}>
                    <div className={styles.cardMetaRow}>
                      <p className={styles.cardMetaLabel}>FORMATS</p>
                      <div className={styles.formatPills}>
                        {formats.map((format) => (
                          <span key={`${item.route}-${format}`} className={styles.metaPill}>
                            {format}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.cardMetaRow}>
                      <p className={styles.cardMetaLabel}>SAMPLE PARTS</p>
                      <p className={styles.cardMetaCount}>
                        {parts.length} {parts.length === 1 ? 'total' : 'total'}
                      </p>
                    </div>
                    <div className={styles.partsPills}>
                      {partNames.length ? (
                        partNames.map((part) => {
                          const href = part.route
                            ? `/industry/${item.route}/${part.route}`
                            : `/industry/${item.route}`;
                          return (
                            <Link key={`${item.route}-${part.name}`} href={href} className={styles.partPillLink}>
                              {part.name}
                            </Link>
                          );
                        })
                      ) : (
                        <span className={styles.partPillMuted}>Parts will appear soon</span>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            )})}
          </ul>
        )}
      </section>
      <section className={styles.bottomCta} aria-labelledby="industries-bottom-cta-title">
        <div className={styles.bottomCtaInner}>
          <div className={styles.bottomCtaText}>
            <h2 id="industries-bottom-cta-title" className={styles.bottomCtaTitle}>
              Don&apos;t see your industry?
            </h2>
            <p className={styles.bottomCtaLead}>
              Marathon OS supports any team working with 3D engineering files. Get in touch and
              we&apos;ll help configure the right viewer for your workflow.
            </p>
          </div>
          <div className={styles.bottomCtaActions}>
            <Link href="/contact-us" className={styles.bottomPrimary}>
              Talk to our team
              <span aria-hidden>→</span>
            </Link>
            <Link href="/tools" className={styles.bottomSecondary}>
              Browse tools
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
