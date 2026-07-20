import React from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  Box,
  CheckSquare,
  Eye,
  ImageOff,
  LockKeyhole,
  Maximize2,
  Shield,
  Trash2,
  UserRound,
  Waves,
} from 'lucide-react'
import { converterTypes, featuredConversions } from '@/common.helper'
import { getConverterPairContent } from '@/data/converterPairContent'
import styles from './ConvertPairAftercare.module.css'

const PRIVACY_ITEMS = [
  { icon: LockKeyhole, title: 'Encrypted upload', description: 'Files are transferred through a secure connection.' },
  { icon: Trash2, title: 'Automatic deletion', description: 'Uploaded and converted files are deleted after 7 days.' },
  { icon: UserRound, title: 'You retain ownership', description: 'Conversion does not transfer ownership of your model.' },
  { icon: CheckSquare, title: 'Not publicly listed', description: 'Your uploaded files are not added to the Marathon CAD library.' },
]

function parsePair(item) {
  const pair = item.path.replace(/^\//, '')
  const [from, to] = pair.split('-to-')
  return { ...item, pair, from, to }
}

function buildRelatedTools(from, to) {
  const parsed = converterTypes.map(parsePair)
  const prioritized = [
    ...parsed.filter((item) => item.from === to && item.to === from),
    ...parsed.filter((item) => item.from === from && item.to !== to),
    ...parsed.filter((item) => item.to === to && item.from !== from),
  ]
  const seen = new Set()
  const conversions = prioritized.filter((item) => {
    if (seen.has(item.pair)) return false
    seen.add(item.pair)
    return item.pair !== `${from}-to-${to}`
  }).slice(0, 4)

  return [
    ...conversions.map((item) => ({
      from: item.from.toUpperCase(),
      to: item.to.toUpperCase(),
      title: `Convert ${item.from.toUpperCase()} to ${item.to.toUpperCase()}`,
      description: item.oneLiner,
      href: `/tools/convert-${item.pair}`,
    })),
    {
      from: to.toUpperCase(),
      viewer: true,
      title: `Open a ${to.toUpperCase()} file online`,
      description: `Inspect the converted ${to.toUpperCase()} file before moving it into the next workflow.`,
      href: `/tools/${to}-file-viewer`,
    },
    {
      from: from.toUpperCase(),
      viewer: true,
      title: `Preview your ${from.toUpperCase()} model`,
      description: 'Check the source geometry before starting a new conversion.',
      href: `/tools/${from}-file-viewer`,
    },
  ]
}

function getChecks(to, toUpper) {
  if (to === 'stl') {
    return [
      ['Verify dimensions and scale', 'A source model created in centimetres may be interpreted as millimetres by another application. Confirm the expected size in the slicer.'],
      ['Confirm the model is watertight', 'The surface should form a closed volume without open boundaries, gaps or holes that could create missing layers.'],
      ['Inspect surface normals', 'Flipped or inconsistent normals can make faces appear missing or inside out. Repair them before slicing.'],
      ['Find non-manifold geometry', 'Remove internal surfaces, overlapping faces and invalid edges that can stop the slicer from understanding the solid.'],
      ['Check minimum wall thickness', 'A thin surface may be visible on screen but still be below the printable limit of the selected nozzle or process.'],
      ['Preview every sliced layer', 'Look for unexpected gaps, floating islands, missing sections and incorrect scale before starting the print.'],
    ]
  }

  return [
    ['Verify dimensions and scale', `Confirm that the converted ${toUpper} file uses the expected size and unit interpretation.`],
    ['Inspect the complete geometry', 'Check that all expected bodies, surfaces, curves or drawing entities are present.'],
    ['Review surface orientation', 'Look for flipped faces, inconsistent normals or reversed boundaries after conversion.'],
    ['Check topology and open edges', 'Inspect gaps, overlaps, invalid edges and disconnected geometry before downstream use.'],
    ['Confirm layers and object structure', 'Verify that supported layers, groups and model organisation were translated as expected.'],
    ['Open the file in its target application', `Preview the ${toUpper} result in the software used for the next workflow before production use.`],
  ]
}

function ConvertPairAftercare({ conversionParams }) {
  const { from, to, fromUpper, toUpper } = getConverterPairContent(conversionParams)
  const checks = getChecks(to, toUpper)
  const relatedTools = buildRelatedTools(from, to)

  const problems = [
    {
      icon: Maximize2,
      title: `The ${toUpper} file has the wrong size`,
      description: `The source and destination tools may interpret units differently. Open the ${toUpper} file and select the correct unit or scale.`,
      fix: 'Verify units and dimensions',
    },
    {
      icon: ImageOff,
      title: 'Textures or materials disappeared',
      description: `This can be expected when ${toUpper} does not support the texture, UV or material information stored by ${fromUpper}.`,
      fix: `Keep the original ${fromUpper} visual data`,
    },
    {
      icon: AlertTriangle,
      title: 'The model has missing faces',
      description: `The ${fromUpper} source may contain open edges, invalid polygons, overlapping geometry or inverted normals that remain visible after conversion.`,
      fix: 'Inspect and repair the source geometry',
    },
    {
      icon: Waves,
      title: 'The conversion fails on a large file',
      description: 'High polygon counts and complex geometry need more processing. Confirm the file is below 300 MB and opens correctly in a viewer.',
      fix: 'Simplify unnecessary geometry detail',
    },
  ]

  return (
    <>
      <section className={styles.checkSection} aria-labelledby="output-check-heading">
        <div className={styles.checkInner}>
          <header className={styles.checkCopy}>
            <p className={styles.eyebrow}>Before continuing</p>
            <h2 id="output-check-heading">Check the converted<br />{toUpper} before the next step</h2>
            <p>Changing the file format does not automatically make a model production-ready. Review these checks in the application used for your next workflow.</p>
            <div className={styles.important}>
              <Shield size={16} />
              <span><strong>Important:</strong> File formats may not include a standard unit definition. Always verify dimensions after conversion.</span>
            </div>
          </header>
          <ol className={styles.checkList}>
            {checks.map(([title, description], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.troubleSection} aria-labelledby="troubleshooting-heading">
        <div className={styles.inner}>
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Common problems</p>
            <h2 id="troubleshooting-heading">{fromUpper}-to-{toUpper} conversion troubleshooting</h2>
            <p>Most conversion issues come from differences between file formats or problems already present in the source geometry.</p>
          </header>
          <div className={styles.problemGrid}>
            {problems.map(({ icon: Icon, title, description, fix }) => (
              <article key={title}>
                <span className={styles.problemIcon}><Icon size={17} /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <strong>Fix: {fix}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.privacySection} aria-labelledby="pair-privacy-heading">
        <div className={styles.privacyInner}>
          <header>
            <p className={styles.privacyEyebrow}>Secure processing</p>
            <h2 id="pair-privacy-heading">Your 3D files remain yours</h2>
            <p>Product models can contain confidential engineering information. Privacy and file handling stay explicit beside the tool.</p>
          </header>
          <div className={styles.privacyGrid}>
            {PRIVACY_ITEMS.map(({ icon: Icon, title, description }) => (
              <article key={title}>
                <Icon size={16} />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.relatedSection} aria-labelledby="related-converters-heading">
        <div className={styles.inner}>
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Continue your workflow</p>
            <h2 id="related-converters-heading">Related 3D conversion tools</h2>
            <p>Recommendations are limited to pages that are contextually useful when working with {fromUpper} or {toUpper} files.</p>
          </header>
          <div className={styles.relatedGrid}>
            {relatedTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className={styles.relatedCard}>
                <div className={styles.pairBadges}>
                  <span>{tool.from}</span>
                  {tool.viewer ? <Eye size={13} /> : <><ArrowRight size={12} /><span>{tool.to}</span></>}
                </div>
                <span className={styles.cardArrow}><ArrowRight size={13} /></span>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.popularSection} aria-labelledby="popular-converters-heading">
        <div className={styles.inner}>
          <header className={styles.popularHeader}>
            <p className={styles.eyebrow}>Popular conversions</p>
            <h2 id="popular-converters-heading">CAD converter types</h2>
            <p>Move into another common engineering workflow using one of Marathon OS&apos;s most-used conversion paths.</p>
          </header>
          <div className={styles.popularGrid}>
            {featuredConversions.slice(0, 9).map((item) => {
              const parsed = parsePair(item)
              return (
                <Link key={item.path} href={`/tools/convert-${parsed.pair}`} className={styles.popularCard}>
                  <div className={styles.pairBadges}><span>{parsed.from.toUpperCase()}</span><ArrowRight size={11} /><span>{parsed.to.toUpperCase()}</span></div>
                  <div><h3>{item.label}</h3><p>{item.oneLiner}</p></div>
                </Link>
              )
            })}
          </div>
          <Link href="/tools/3d-cad-file-converter#cad-converter-types-heading" className={styles.viewAll}>
            View all CAD conversion tools <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}

export default ConvertPairAftercare

