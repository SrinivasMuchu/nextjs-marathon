import React from 'react'
import Link from 'next/link'
import Footer from '@/Components/HomePages/Footer/Footer'
import ActiveLastBreadcrumb from '@/Components/CommonJsx/BreadCrumbs'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'
import cadHomeStyles from '@/Components/CadUploadingHome/CadHomeDesign/CadHome.module.css'
import { getRelatedResourceGuides, getResourceHubCategoryBySlug } from '@/Components/ResourcesHub/resourceHubLinks'
import {
  CAD_RESOURCE_AUTHOR,
  CAD_RESOURCE_PUBLISHED_AT,
} from '@/data/cadResourceArticles/schema'
import CadArticleDescribeProjectButton from './CadArticleDescribeProjectButton'
import { parseCadResourceInline } from './cadResourceInline'
import styles from './CadResourceArticle.module.css'

function formatArticleDate(isoDate) {
  const [year, month, day] = String(isoDate || '').split('-').map(Number)
  if (!year || !month || !day) return isoDate
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

/** @param {{ text?: string }} props */
function InlineText({ text }) {
  const parts = parseCadResourceInline(text || '')
  return parts.map((part, index) =>
    typeof part === 'string' ? (
      <span key={index}>{part}</span>
    ) : (
      <Link key={`${part.href}-${index}`} href={part.href} className={styles.inlineLink}>
        {part.label}
      </Link>
    )
  )
}

/**
 * @param {object} props
 * @param {import('@/data/cadResourceArticles/schema').CadResourceArticle} props.article
 */
export default function CadResourceArticle({ article }) {
  const canonicalPath = `/resources/${article.slug}`
  const category = getResourceHubCategoryBySlug(article.slug)
  const relatedGuides = getRelatedResourceGuides(article.slug)
  const publishedAt = article.publishedAt || CAD_RESOURCE_PUBLISHED_AT
  const author = article.author?.name ? article.author : CAD_RESOURCE_AUTHOR
  const authorHref = author.path || author.url || CAD_RESOURCE_AUTHOR.path

  return (
    <div className={styles.page}>
      <ActiveLastBreadcrumb
        links={[
          { label: 'Resources', href: '/resources' },
          category
            ? { label: category.heading, href: `/resources#${category.id}` }
            : { label: 'Resources', href: '/resources' },
          { label: article.breadcrumbLastLabel, href: canonicalPath },
        ]}
      />
      <div className={cadHomeStyles['cad-ad-bar']}>
        <div className={cadHomeStyles['cad-ad-bar-inner']}>
          <LeftRightBanner adSlot="3755241003" />
        </div>
      </div>

      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroBadge}>{article.hero.badge}</p>
          <h1 className={styles.heroH1}>{article.hero.title}</h1>
          <p className={styles.byline}>
            <span>
              By <Link href={authorHref}>{author.name}</Link>
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={publishedAt}>{formatArticleDate(publishedAt)}</time>
          </p>
          <p className={styles.heroLead}>{article.hero.lead}</p>
          <div className={styles.heroActions}>
            <CadArticleDescribeProjectButton>{article.hero.primaryCtaLabel}</CadArticleDescribeProjectButton>
            <Link href="/cad-services" className={styles.heroSecondaryAction}>
              Marathon OS CAD Services →
            </Link>
          </div>
          {article.hero.supportLine ? (
            <p className={styles.heroSupport}>{article.hero.supportLine}</p>
          ) : null}
        </div>
      </header>

      <article className={styles.main}>
        {article.sections.map((section, index) => (
          <CadResourceSection key={`${section.type}-${section.id ?? index}`} section={section} />
        ))}
      </article>

      <section className={styles.bottomCta} aria-labelledby="cad-resource-bottom-cta">
        <div className={styles.bottomCtaInner}>
          <h2 id="cad-resource-bottom-cta">{article.bottomCta.title}</h2>
          <p className={styles.bottomCtaSub}>{article.bottomCta.sub}</p>
          <CadArticleDescribeProjectButton>{article.bottomCta.primaryCtaLabel}</CadArticleDescribeProjectButton>
          {article.bottomCta.learnMoreHref ? (
            <Link href={article.bottomCta.learnMoreHref} className={styles.bottomCtaLink}>
              {article.bottomCta.learnMoreLabel ?? 'Learn more →'}
            </Link>
          ) : null}
        </div>
      </section>
      {relatedGuides.length > 0 ? (
        <section className={styles.related} aria-labelledby="related-guides">
          <h2 id="related-guides">Related guides</h2>
          <ul className={styles.relatedList}>
            {relatedGuides.map((guide) => (
              <li key={guide.href}>
                <Link href={guide.href} className={styles.relatedLink}>
                  <span className={styles.relatedTitle}>{guide.title}</span>
                  <span className={styles.relatedDesc}>{guide.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <Footer />
    </div>
  )
}

/** @param {{ section: import('@/data/cadResourceArticles/schema').CadResourceSection }} props */
function CadResourceSection({ section }) {
  switch (section.type) {
    case 'quickAnswer':
      return (
        <div className={styles.quickAnswer}>
          {section.paragraphs.map((text, i) => (
            <p key={i}>
              <InlineText text={text} />
            </p>
          ))}
        </div>
      )

    case 'prose':
      return (
        <section className={styles.section} aria-labelledby={section.id}>
          <h2 id={section.id}>{section.title}</h2>
          {section.paragraphs.map((text, i) => (
            <p key={i}>
              <InlineText text={text} />
            </p>
          ))}
        </section>
      )

    case 'cardGrid':
      return (
        <section className={styles.section} aria-labelledby={section.id}>
          <h2 id={section.id}>{section.title}</h2>
          {section.intro ? (
            <p>
              <InlineText text={section.intro} />
            </p>
          ) : null}
          <ul className={styles.cardGrid}>
            {section.cards.map((c) => (
              <li key={c.title} className={styles.card}>
                <span className={styles.cardIcon} aria-hidden>
                  {c.icon}
                </span>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardBody}>
                  <InlineText text={c.body} />
                </p>
              </li>
            ))}
          </ul>
        </section>
      )

    case 'criteria':
      return (
        <section className={styles.section} aria-labelledby={section.id}>
          <h2 id={section.id}>{section.title}</h2>
          {section.intro ? (
            <p>
              <InlineText text={section.intro} />
            </p>
          ) : null}
          {section.blocks.map((block) => (
            <div key={block.title} className={styles.h3Block}>
              <h3>{block.title}</h3>
              <p>
                <InlineText text={block.body} />
              </p>
            </div>
          ))}
        </section>
      )

    case 'comparisonTable': {
      const fourCol = Boolean(section.column4Header)
      return (
        <section className={styles.section} aria-labelledby={section.id}>
          <h2 id={section.id}>{section.title}</h2>
          {section.intro ? (
            <p className={styles.tableIntro}>
              <InlineText text={section.intro} />
            </p>
          ) : null}
          <div className={styles.tableWrap}>
            <table className={fourCol ? styles.tableWide : styles.table}>
              <thead>
                <tr>
                  <th scope="col">{section.rowLabelHeader ?? ''}</th>
                  <th scope="col">{section.column2Header}</th>
                  <th scope="col">{section.column3Header}</th>
                  {fourCol ? <th scope="col">{section.column4Header}</th> : null}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.col2}</td>
                    <td>{row.col3}</td>
                    {fourCol ? <td>{row.col4 ?? ''}</td> : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {section.outro ? (
            <p className={styles.tableOutro}>
              <InlineText text={section.outro} />
            </p>
          ) : null}
        </section>
      )
    }

    case 'briefList':
      return (
        <section className={styles.section} aria-labelledby={section.id}>
          <h2 id={section.id}>{section.title}</h2>
          {section.intro ? (
            <p>
              <InlineText text={section.intro} />
            </p>
          ) : null}
          <ul className={styles.briefList}>
            {section.items.map((item) => (
              <li key={item.term}>
                <strong>{item.term}</strong> — <InlineText text={item.text} />
              </li>
            ))}
          </ul>
        </section>
      )

    case 'steps':
      return (
        <section className={styles.section} aria-labelledby={section.id}>
          <h2 id={section.id}>{section.title}</h2>
          {section.intro ? (
            <p>
              <InlineText text={section.intro} />
            </p>
          ) : null}
          <div className={styles.steps}>
            {section.steps.map((step, i) => (
              <div key={step.title} className={styles.step}>
                <div className={styles.stepNum}>{i + 1}</div>
                <h3>{step.title}</h3>
                <p>
                  <InlineText text={step.body} />
                </p>
              </div>
            ))}
          </div>
          {section.stepCtaLabel ? (
            <div className={styles.stepCta}>
              <CadArticleDescribeProjectButton>{section.stepCtaLabel}</CadArticleDescribeProjectButton>
            </div>
          ) : null}
        </section>
      )

    case 'pillGrid':
      return (
        <section className={styles.section} aria-labelledby={section.id}>
          <h2 id={section.id}>{section.title}</h2>
          <div className={styles.pillGrid}>
            {section.pills.map((label) => (
              <span key={label} className={styles.pill}>
                {label}
              </span>
            ))}
          </div>
        </section>
      )

    case 'faq':
      return (
        <section className={styles.section} aria-labelledby={section.id}>
          <h2 id={section.id}>{section.title}</h2>
          <div className={styles.faqList}>
            {section.items.map((item) => (
              <details key={item.q} className={styles.faqItem} open={section.defaultOpen ?? false}>
                <summary>{item.q}</summary>
                <p className={styles.faqAnswer}>
                  <InlineText text={item.a} />
                </p>
              </details>
            ))}
          </div>
        </section>
      )

    default:
      return null
  }
}
