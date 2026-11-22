/**
 * CAD Services long-form resource articles (data-driven).
 * Add a new file under this folder, then register it in `registry.js`.
 *
 * Paragraph and body strings may include same-site markdown links: [label](/path).
 */

/**
 * Copy that may include `[label](/path)` links. Only same-site paths are rendered.
 * @typedef {string} CadResourceCopy
 */

/** Shown on every guide unless an article sets its own author. */
export const CAD_RESOURCE_AUTHOR = {
  name: 'Marathon OS',
  path: '/about-us',
  url: 'https://marathon-os.com/about-us',
}

/** Guides shipped together on this date. */
export const CAD_RESOURCE_PUBLISHED_AT = '2026-04-19'

/** Body links and Article markup updated on this date. */
export const CAD_RESOURCE_MODIFIED_AT = '2026-11-16'

/**
 * @typedef {Object} CadResourceArticleMetadata
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef {Object} CadResourceHero
 * @property {string} badge
 * @property {string} title
 * @property {string} lead
 * @property {string} primaryCtaLabel
 * @property {string} [supportLine]
 */

/**
 * @typedef {Object} CadResourceBottomCta
 * @property {string} title
 * @property {string} sub
 * @property {string} primaryCtaLabel
 * @property {string} [learnMoreHref]
 * @property {string} [learnMoreLabel]
 */

/**
 * @typedef {(
 *   | { type: 'quickAnswer', paragraphs: CadResourceCopy[] }
 *   | { type: 'prose', id: string, title: string, paragraphs: CadResourceCopy[] }
 *   | { type: 'cardGrid', id: string, title: string, intro?: CadResourceCopy, cards: { icon: string, title: string, body: CadResourceCopy }[] }
 *   | { type: 'criteria', id: string, title: string, intro?: CadResourceCopy, blocks: { title: string, body: CadResourceCopy }[] }
 *   | { type: 'comparisonTable', id: string, title: string, intro?: CadResourceCopy, rowLabelHeader?: string, column2Header: string, column3Header: string, column4Header?: string, rows: { label: string, col2: string, col3: string, col4?: string }[], outro?: CadResourceCopy }
 *   | { type: 'briefList', id: string, title: string, intro?: CadResourceCopy, items: { term: string, text: CadResourceCopy }[] }
 *   | { type: 'steps', id: string, title: string, intro?: CadResourceCopy, steps: { title: string, body: CadResourceCopy }[], stepCtaLabel?: string }
 *   | { type: 'pillGrid', id: string, title: string, pills: string[] }
 *   | { type: 'faq', id: string, title: string, items: { q: string, a: CadResourceCopy }[], defaultOpen?: boolean }
 * )} CadResourceSection
 */

/**
 * @typedef {Object} CadResourceArticle
 * @property {string} slug — URL segment under `/resources/[slug]`
 * @property {string} breadcrumbLastLabel
 * @property {string} [publishedAt] — ISO date, defaults to `CAD_RESOURCE_PUBLISHED_AT`
 * @property {string} [modifiedAt] — ISO date, defaults to `CAD_RESOURCE_MODIFIED_AT`
 * @property {{ name: string, path?: string, url?: string }} [author]
 * @property {CadResourceArticleMetadata} metadata
 * @property {CadResourceHero} hero
 * @property {CadResourceSection[]} sections
 * @property {CadResourceBottomCta} bottomCta
 */
