/**
 * CAD Services long-form resource articles (data-driven).
 * Add a new file under this folder, then register it in `registry.js`.
 */

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
 *   | { type: 'quickAnswer', paragraphs: string[] }
 *   | { type: 'prose', id: string, title: string, paragraphs: string[] }
 *   | { type: 'cardGrid', id: string, title: string, intro?: string, cards: { icon: string, title: string, body: string }[] }
 *   | { type: 'criteria', id: string, title: string, intro?: string, blocks: { title: string, body: string }[] }
 *   | { type: 'comparisonTable', id: string, title: string, intro?: string, rowLabelHeader?: string, column2Header: string, column3Header: string, column4Header?: string, rows: { label: string, col2: string, col3: string, col4?: string }[], outro?: string }
 *   | { type: 'briefList', id: string, title: string, intro?: string, items: { term: string, text: string }[] }
 *   | { type: 'steps', id: string, title: string, intro?: string, steps: { title: string, body: string }[], stepCtaLabel?: string }
 *   | { type: 'pillGrid', id: string, title: string, pills: string[] }
 *   | { type: 'faq', id: string, title: string, items: { q: string, a: string }[], defaultOpen?: boolean }
 * )} CadResourceSection
 */

/**
 * @typedef {Object} CadResourceArticle
 * @property {string} slug — URL segment under `/resources/[slug]`
 * @property {string} breadcrumbLastLabel
 * @property {CadResourceArticleMetadata} metadata
 * @property {CadResourceHero} hero
 * @property {CadResourceSection[]} sections
 * @property {CadResourceBottomCta} bottomCta
 */

export {}
