import React from 'react';
import Link from 'next/link';
import { BookOpen, Boxes, Building2, Scale, Wrench } from 'lucide-react';
import Footer from '@/Components/HomePages/Footer/Footer';
import ActiveLastBreadcrumb from '@/Components/CommonJsx/BreadCrumbs';
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner';
import cadHomeStyles from '@/Components/CadUploadingHome/CadHomeDesign/CadHome.module.css';
import { RESOURCE_HUB_SECTIONS } from './resourceHubLinks';
import styles from './ResourcesHubPage.module.css';
import DesignHub from '../HomePages/DesignHub/DesignHub';

const SECTION_META = {
  'direct-service-intent': {
    subtitle: "Start here if you're evaluating how to engage a CAD partner.",
    icon: BookOpen,
  },
  'software-specific-service-pages': {
    subtitle: 'Pick a software-specific workflow, outputs, and briefing checklist.',
    icon: Wrench,
  },
  'deliverable-type-pages': {
    subtitle: 'Choose by output type and the file package you need delivered.',
    icon: Boxes,
  },
  'industry-vertical-pages': {
    subtitle: 'Find guides tailored to your domain and delivery constraints.',
    icon: Building2,
  },
  'comparison-decision-pages': {
    subtitle: 'Compare options and use decision guides before committing scope.',
    icon: Scale,
  },
}

function getCardType(item) {
  if (/vs|comparison/i.test(item.title)) return 'COMPARISON'
  if (/guide|pricing|how to|best/i.test(item.title)) return 'GUIDE'
  if (/overview|online/i.test(item.title)) return 'OVERVIEW'
  return 'GUIDE'
}

function estimateReadMinutes(text) {
  const words = text.trim().split(/\s+/).length
  return Math.max(4, Math.min(12, Math.ceil(words / 16)))
}

export default function ResourcesHubPage() {
  const hasCards = RESOURCE_HUB_SECTIONS.some((s) => s.links.length > 0)

  return (
    <div className={styles.page}>
      <ActiveLastBreadcrumb links={[{ label: 'Resources', href: '/resources' }]} />
      <div className={cadHomeStyles['cad-ad-bar']}>
        <div className={cadHomeStyles['cad-ad-bar-inner']}>
          <LeftRightBanner adSlot="3755241003" />
        </div>
      </div>

      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.badge}>
            <BookOpen size={16} strokeWidth={2.2} aria-hidden />
            <span>Resources & guides</span>
          </p>
          <h1 className={styles.title}>
            Everything you need to brief, hire, and ship better CAD work
          </h1>
          <p className={styles.lead}>
            Practical guides for product teams, engineers, and founders — from hiring CAD
            designers to picking the right software and file format.
          </p>
          <div className={styles.heroActions}>
            <Link href="/cad-services" className={styles.heroSecondaryAction}>
              Marathon OS CAD Services →
            </Link>
          </div>
        </div>
      </header>

      <div className={styles.sections}>
        {!hasCards ? (
          <p className={styles.empty}>
            New guides and reference material will appear here as we publish them.
          </p>
        ) : (
          RESOURCE_HUB_SECTIONS.map((section) => {
            const hasLinks = section.links.length > 0
            const showPlaceholder = !hasLinks && section.emptyHint
            const sectionMeta = SECTION_META[section.id]
            const Icon = sectionMeta?.icon ?? BookOpen

            if (!hasLinks && !showPlaceholder) {
              return null
            }

            return (
              <section
                key={section.id}
                className={styles.sectionBlock}
                aria-labelledby={section.id}
              >
                <div className={styles.sectionHead}>
                  <div className={styles.sectionTitleWrap}>
                    <span className={styles.sectionIcon} aria-hidden>
                      <Icon size={18} strokeWidth={2.2} />
                    </span>
                    <div>
                      <h2 id={section.id} className={styles.sectionHeading}>
                        {section.heading}
                      </h2>
                      {sectionMeta?.subtitle ? (
                        <p className={styles.sectionSubhead}>{sectionMeta.subtitle}</p>
                      ) : null}
                    </div>
                  </div>
                  {hasLinks ? (
                    <p className={styles.resourceCount}>
                      {section.links.length} {section.links.length === 1 ? 'resource' : 'resources'}
                    </p>
                  ) : null}
                </div>
                {hasLinks ? (
                  <ul className={styles.grid}>
                    {section.links.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className={styles.card}>
                          <div className={styles.cardMetaRow}>
                            <span className={styles.cardType}>{getCardType(item)}</span>
                            <span className={styles.cardReadTime}>
                              {estimateReadMinutes(`${item.title} ${item.description}`)} min read
                            </span>
                          </div>
                          <h3 className={styles.cardTitle}>{item.title}</h3>
                          <p className={styles.cardDesc}>{item.description}</p>
                          <span className={styles.cardReadMore}>Read more →</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.sectionEmptyHint}>{section.emptyHint}</p>
                )}
              </section>
            )
          })
        )}
      </div>
      <DesignHub/>

      <Footer />
    </div>
  );
}
