import React from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  Box,
  CheckCircle2,
  Eye,
  ImageOff,
  Maximize2,
  Upload,
  Waves,
  XCircle,
} from 'lucide-react'
import aftercare from '../CadFileConversion/ConvertPairAftercare.module.css'
import styles from './CadViewerUniqueArticle.module.css'

const PROBLEM_ICONS = [Maximize2, ImageOff, AlertTriangle, Waves, Box, Eye]

function CadViewerUniqueArticle({ uniquePage, parts = [] }) {
  if (!uniquePage || !parts.length) return null

  return (
    <>
      {parts.includes('capabilities') && uniquePage.capabilities?.length ? (
        <section className={styles.capabilitiesSection} aria-labelledby="viewer-capabilities-heading">
          <div className={styles.capabilitiesInner}>
            <article>
              <h2 id="viewer-capabilities-heading">{uniquePage.capabilitiesHeading}</h2>
              <ul>
                {uniquePage.capabilities.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={15} aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className={styles.limitations}>
              <h2>{uniquePage.limitationsHeading}</h2>
              <ul>
                {uniquePage.limitations.map((item) => (
                  <li key={item}>
                    <XCircle size={15} aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      ) : null}

      {parts.includes('preflight') && uniquePage.preflight?.length ? (
        <section className={aftercare.checkSection} aria-labelledby="viewer-preflight-heading">
          <div className={aftercare.checkInner}>
            <header className={aftercare.checkCopy}>
              <p className={aftercare.eyebrow}>{uniquePage.preflightEyebrow}</p>
              <h2 id="viewer-preflight-heading">{uniquePage.preflightHeading}</h2>
              <p>{uniquePage.preflightIntro}</p>
            </header>
            <ol className={aftercare.checkList}>
              {uniquePage.preflight.map(([title, description], index) => (
                <li key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {parts.includes('formatGuidance') && uniquePage.formatGuidance?.length ? (
        <section className={styles.guidanceSection} aria-labelledby="viewer-format-guidance-heading">
          <div className={styles.guidanceInner}>
            <h2 id="viewer-format-guidance-heading">{uniquePage.formatGuidanceHeading}</h2>
            {uniquePage.formatGuidanceIntro ? <p>{uniquePage.formatGuidanceIntro}</p> : null}
            <div className={styles.guidanceGrid}>
              {uniquePage.formatGuidance.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  {item.label ? <strong>{item.label}</strong> : null}
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {parts.includes('troubleshooting') && uniquePage.problems?.length ? (
        <section className={aftercare.troubleSection} aria-labelledby="viewer-troubleshooting-heading">
          <div className={aftercare.inner}>
            <header className={aftercare.sectionHeader}>
              {uniquePage.troubleEyebrow ? <p className={aftercare.eyebrow}>{uniquePage.troubleEyebrow}</p> : null}
              <h2 id="viewer-troubleshooting-heading">{uniquePage.troubleHeading}</h2>
              <p>{uniquePage.troubleIntro}</p>
            </header>
            <div className={aftercare.problemGrid}>
              {uniquePage.problems.map((problem, index) => {
                const Icon = PROBLEM_ICONS[index] || AlertTriangle
                return (
                  <article key={problem.title}>
                    <span className={aftercare.problemIcon}>
                      <Icon size={17} />
                    </span>
                    <div>
                      <h3>{problem.title}</h3>
                      <p>{problem.description}</p>
                      {problem.fix ? <strong>Fix: {problem.fix}</strong> : null}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {parts.includes('privacy') && uniquePage.privacyHeading ? (
        <section className={styles.privacySection} aria-labelledby="viewer-privacy-heading">
          <div className={styles.privacyInner}>
            <h2 id="viewer-privacy-heading">{uniquePage.privacyHeading}</h2>
            {uniquePage.privacyIntro ? <p>{uniquePage.privacyIntro}</p> : null}
            {uniquePage.privacyPolicyHref ? (
              <p>
                <Link href={uniquePage.privacyPolicyHref}>
                  {uniquePage.privacyPolicyLabel || 'Privacy Policy'}
                </Link>
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {parts.includes('finalCta') ? (
        <section className={styles.finalSection} aria-labelledby="viewer-final-cta-heading">
          <div className={styles.finalInner}>
            <h2 id="viewer-final-cta-heading">{uniquePage.finalHeading}</h2>
            <p>{uniquePage.finalBody}</p>
            <div className={styles.finalActions}>
              <a href={uniquePage.finalCtaHref} className={styles.finalPrimary}>
                <Upload size={16} strokeWidth={2.2} aria-hidden />
                {uniquePage.finalCta}
              </a>
              {uniquePage.finalSecondaryHref ? (
                <Link href={uniquePage.finalSecondaryHref} className={styles.finalSecondary}>
                  {uniquePage.finalSecondaryCta}
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

export default CadViewerUniqueArticle
