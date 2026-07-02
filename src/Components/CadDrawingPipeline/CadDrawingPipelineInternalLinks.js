import Link from 'next/link';
import { PIPELINE_INTERNAL_LINKS } from '@/data/cadDrawingPipelinePage';
import styles from './CadDrawingPipeline.module.css';

function LinkIcon({ type }) {
  const icons = {
    draw: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 19h16M6 16l8-10 4 4-8 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    lib: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 6h16v12H4V6z" stroke="currentColor" strokeWidth="1.75" />
        <path d="M4 10h16M9 6v12" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    ),
    view: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    ),
    conv: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M7 7h10l-3-3M17 17H7l3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    step: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2L4 6.5v11L12 22l8-4.5v-11L12 2z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      </svg>
    ),
    help: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3a7 7 0 00-4 12.8V18h8v-2.2A7 7 0 0012 3z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M10 21h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  };

  return <span className={styles.pipelineLinkIcon}>{icons[type] || icons.lib}</span>;
}

export default function CadDrawingPipelineInternalLinks() {
  return (
    <section className={styles.pipelineLinks} aria-labelledby="pipeline-internal-links-heading">
      <p className={styles.pipelineLinksEyebrow}>Explore Marathon OS</p>
      <h2 id="pipeline-internal-links-heading" className={styles.pipelineLinksTitle}>
        Related tools and libraries
      </h2>
      <div className={styles.pipelineLinksGrid}>
        {PIPELINE_INTERNAL_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={styles.pipelineLinkCard}>
            <span className={styles.pipelineLinkIconWrap}>
              <LinkIcon type={link.icon} />
            </span>
            <span className={styles.pipelineLinkBody}>
              <span className={styles.pipelineLinkLabel}>{link.label}</span>
              <span className={styles.pipelineLinkDesc}>{link.description}</span>
            </span>
            <span className={styles.pipelineLinkArrow} aria-hidden>
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
