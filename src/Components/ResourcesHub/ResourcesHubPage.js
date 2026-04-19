import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import Footer from '@/Components/HomePages/Footer/Footer';
import ActiveLastBreadcrumb from '@/Components/CommonJsx/BreadCrumbs';
import heroStyles from '@/Components/IndustriesHub/IndustriesDirectoryPage.module.css';
import { RESOURCE_HUB_SECTIONS } from './resourceHubLinks';
import styles from './ResourcesHubPage.module.css';

export default function ResourcesHubPage() {
  const hasAnyLinks = RESOURCE_HUB_SECTIONS.some((s) => s.links.length > 0);

  return (
    <div className={heroStyles.page}>
      <ActiveLastBreadcrumb links={[{ label: 'Resources', href: '/resources' }]} />

      <header className={heroStyles.hero}>
        <div className={heroStyles.heroInner}>
          <p className={heroStyles.badge}>
            <BookOpen size={16} strokeWidth={2.2} aria-hidden />
            <span>Resource library</span>
          </p>
          <h1 className={heroStyles.title}>Resources</h1>
          <p className={heroStyles.lead}>
            Guides, references, and downloads for engineering and hardware teams using Marathon OS.
          </p>
        </div>
      </header>

      <div className={styles.sections}>
        {!hasAnyLinks ? (
          <p className={styles.empty}>
            New guides and reference material will appear here as we publish them.
          </p>
        ) : (
          RESOURCE_HUB_SECTIONS.map((section) =>
            section.links.length === 0 ? null : (
              <section
                key={section.id}
                className={styles.sectionBlock}
                aria-labelledby={section.id}
              >
                <h2 id={section.id} className={styles.sectionHeading}>
                  {section.heading}
                </h2>
                <ul className={styles.grid}>
                  {section.links.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={styles.card}>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <p className={styles.cardDesc}>{item.description}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ),
          )
        )}
      </div>

      <Footer />
    </div>
  );
}
