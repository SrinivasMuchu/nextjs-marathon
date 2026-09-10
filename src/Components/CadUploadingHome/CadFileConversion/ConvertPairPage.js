import React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Headphones,
  LockKeyhole,
  Shield,
  Upload,
  Workflow,
  XCircle,
} from 'lucide-react'
import ActiveLastBreadcrumb from '@/Components/CommonJsx/BreadCrumbs'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'
import Footer from '@/Components/HomePages/Footer/Footer'
import DesignHub from '@/Components/HomePages/DesignHub/DesignHub'
import CadFileConversionContent from './CadFileConversionContent'
import ConverterPricingSection from './ConverterPricingSection'
import ConvertPairAftercare from './ConvertPairAftercare'
import ConverterFaq from './ConverterFaq'
import ToolsPageBanner from '@/Components/CadServicesBanners/ToolsPageBanner'
import { getConverterFaqQuestions } from '@/data/cadToolFaqs'
import { getConverterPairContent } from '@/data/converterPairContent'
import { IMAGEURLS } from '@/config'
import cadHomeStyles from '../CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css'
import styles from './ConvertPairPage.module.css'

/** Mesh formats use wireframeImage; solid/surface CAD formats use solidImage. */
const MESH_VISUAL_FORMATS = new Set(['stl', 'obj', 'off', 'ply'])
const BENEFIT_ICONS = [Download, Box, Workflow, LockKeyhole]
const RESOURCE_ICONS = [Eye, FileText, Headphones, FolderOpen]

function getFormatGeometryImage(format) {
  return MESH_VISUAL_FORMATS.has(String(format || '').toLowerCase())
    ? IMAGEURLS.wireframeImage
    : IMAGEURLS.solidImage
}

const COMPARISON_ROWS = [
  ['Main purpose', 'purpose'],
  ['Geometry', 'geometry'],
  ['Textures and UV mapping', 'texture'],
  ['Materials', 'materials'],
  ['Object groups', 'groups'],
  ['Common workflow', 'tools'],
]

function FormatBadge({ format, tone = 'purple' }) {
  return <span className={`${styles.formatBadge} ${styles[`formatBadge${tone}`]}`}>{format}</span>
}

function ConvertPairPage({ conversionParams }) {
  const content = getConverterPairContent(conversionParams)
  const {
    from,
    to,
    fromUpper,
    toUpper,
    fromInfo,
    toInfo,
    heroDescription,
    behavior,
    uniquePage,
  } = content
  const faqs = getConverterFaqQuestions(conversionParams)

  const defaultBenefits = [
    {
      title: 'Browser-based conversion',
      description: `Use the converter without installing desktop software to move from ${fromUpper} to ${toUpper}.`,
    },
    {
      title: `Built for ${toInfo.family.toLowerCase()}`,
      description: `Translate ${fromInfo.geometry.toLowerCase()} into the ${toInfo.geometry.toLowerCase()} used by ${toUpper}.`,
    },
    {
      title: 'Ready for the next workflow',
      description: `Open the result in ${toInfo.tools} for review, editing or production.`,
    },
    {
      title: 'Private file handling',
      description: 'Converted models are not added to the public CAD library and are removed after processing.',
    },
  ]
  const benefits = (uniquePage?.benefits || defaultBenefits).map((item, index) => ({
    ...item,
    icon: BENEFIT_ICONS[index] || Download,
  }))

  const defaultResources = [
    {
      title: 'Browse CAD models',
      description: 'Search ready-to-use engineering and 3D-printing files across the Marathon OS library.',
      href: '/library',
    },
    {
      title: 'Browse 2D technical drawings',
      description: 'Explore PDF, SVG and DXF drawing resources for engineering review and documentation.',
      href: '/library/2d-technical-drawings',
    },
    {
      title: 'Get CAD design support',
      description: 'Work with a vetted designer when the model needs repair, remodelling or a production-ready native file.',
      href: '/cad-services',
    },
  ]
  const resources = (uniquePage?.resources || defaultResources).map((item, index) => ({
    ...item,
    icon: RESOURCE_ICONS[index] || FolderOpen,
  }))

  const workflowSteps = uniquePage?.workflowSteps || [
    [`Upload your ${fromUpper} file`, `Drag and drop the .${from} file into the converter or choose it from your device. Files up to 300 MB are supported.`],
    [`Use ${toUpper} as the output`, `This page is preconfigured for ${fromUpper}-to-${toUpper} conversion, so you do not need to search through target formats.`],
    [`Download and inspect the ${toUpper}`, `Download the result and open it in your preferred compatible application to confirm its geometry and scale.`],
  ]

  const comparisonRows = uniquePage?.comparisonRows || COMPARISON_ROWS.map(([label, key]) => [
    label,
    fromInfo[key],
    toInfo[key],
  ])

  const chooseTo = uniquePage?.chooseTo || [
    `Your next application or supplier specifically requires a ${toUpper} file.`,
    `${toInfo.purpose} is the next stage of the workflow.`,
    'The target geometry representation suits the downstream task.',
  ]
  const keepFrom = uniquePage?.keepFrom || [
    'Your project still depends on data unique to the source format.',
    `You need to continue editing in ${fromInfo.tools}.`,
    'The model is still being prepared rather than handed off.',
  ]

  return (
    <>
      <ActiveLastBreadcrumb
        variant="dark"
        links={[
          { label: 'Tools', href: '/tools' },
          { label: '3D CAD File Converter', href: '/tools/3d-cad-file-converter' },
          { label: `${fromUpper} to ${toUpper}`, href: `/tools/convert-${conversionParams}` },
        ]}
      />

      <div className={cadHomeStyles['cad-ad-bar']}>
        <div className={cadHomeStyles['cad-ad-bar-inner']}>
          <LeftRightBanner adSlot="3755241003" />
        </div>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <div className={styles.heroBadges}>
              {(uniquePage?.badges || [`Free under 5 MB`, `${fromUpper} → ${toUpper}`, 'No software installation']).map((badge) => (
                <span key={badge} className={badge.startsWith('Free') ? styles.freeBadge : undefined}>
                  {badge}
                </span>
              ))}
            </div>
            <h1>
              {uniquePage?.h1 || (
                <>
                  Convert {fromUpper}<br />to {toUpper} online
                </>
              )}
            </h1>
            <p>{heroDescription}</p>
            <div className={styles.trustRow}>
              {(uniquePage?.trust || ['Encrypted uploads', 'Files up to 300 MB', 'Automatically deleted within 7 days']).map((item, index) => {
                const Icon = [Shield, Workflow, LockKeyhole][index] || Shield
                return (
                  <span key={item}><Icon size={15} /> {item}</span>
                )
              })}
            </div>
          </div>

          <section id="cad-file-converter" className={`${heroStyles.converterCard} ${styles.uploadCard}`} aria-label={`${fromUpper} to ${toUpper} converter`}>
            <div className={styles.uploadHeader}>
              <div>
                <h2>{uniquePage?.uploadHeading || `Upload your ${fromUpper} file`}</h2>
                <p>{uniquePage?.uploadHelper || 'Choose one file to begin the conversion.'}</p>
              </div>
              <span><LockKeyhole size={12} /> Secure</span>
            </div>
            <CadFileConversionContent
              convert
              conversionParams={conversionParams}
              designVariant="converterHero"
            />
          </section>
        </div>
      </section>

      <ConverterPricingSection />

      <section className={styles.benefits} aria-label={`${fromUpper} to ${toUpper} conversion benefits`}>
        <div className={styles.benefitGrid}>
          {benefits.map(({ icon: Icon, title, description, href, cta }) => {
            const body = (
              <>
                <span className={styles.smallIcon}><Icon size={17} /></span>
                <h2>{title}</h2>
                <p>{description}</p>
                {cta ? <em className={styles.resourceCta}>{cta}</em> : null}
              </>
            )
            return href ? (
              <Link key={title} href={href} className={styles.benefitCard}>{body}</Link>
            ) : (
              <article key={title} className={styles.benefitCard}>{body}</article>
            )
          })}
        </div>
      </section>

      <section className={styles.resources} aria-labelledby="pair-resources-heading">
        <div className={styles.resourcesInner}>
          <div className={styles.resourcesHeader}>
            <div>
              <p className={styles.eyebrow}>{uniquePage?.resourcesEyebrow || 'Continue your CAD workflow'}</p>
              <h2 id="pair-resources-heading">{uniquePage?.resourcesHeading || <>Explore Marathon<br />OS CAD resources</>}</h2>
            </div>
            <p>{uniquePage?.resourcesIntro || 'Preview a model before conversion, find an existing engineering file, open a 2D drawing, or get specialist help when a source mesh needs to be rebuilt.'}</p>
          </div>

          <div className={styles.resourceGrid}>
            {resources.map(({ icon: Icon, title, description, href, cta }) => {
              const body = (
                <>
                  <span className={styles.resourceIcon}><Icon size={18} /></span>
                  <span className={styles.resourceBody}>
                    <strong>{title}</strong>
                    <small>{description}</small>
                    {cta ? <em className={styles.resourceCta}>{cta}</em> : null}
                  </span>
                  <span className={styles.resourceArrow}><ArrowRight size={14} /></span>
                </>
              )
              return href ? (
                <Link key={title} href={href} className={styles.resourceCard}>{body}</Link>
              ) : (
                <article key={title} className={styles.resourceCard}>{body}</article>
              )
            })}
          </div>
        </div>
      </section>

      <section className={styles.workflowSection} aria-labelledby="pair-workflow-heading">
        <div className={styles.workflowInner}>
          <p className={styles.eyebrow}>Simple conversion workflow</p>
          <h2 id="pair-workflow-heading">{uniquePage?.workflowHeading || `How to convert ${fromUpper} to ${toUpper} online`}</h2>
          <p className={styles.sectionIntro}>{uniquePage?.workflowIntro || `Move from ${fromInfo.name} to ${toInfo.name} in three clear steps.`}</p>
          <div className={styles.workflowGrid}>
            {workflowSteps.map(([title, description], index) => {
              const Icon = [Upload, Workflow, Download][index] || Upload
              return (
                <article key={title} className={styles.workflowCard}>
                  <span className={styles.stepIcon}><Icon size={17} /></span>
                  <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              )
            })}
          </div>
          <a href="#cad-file-converter" className={styles.convertButton}>
            {uniquePage?.workflowCta || `Convert a ${fromUpper} file`} <Upload size={14} />
          </a>
        </div>
      </section>

      <section className={styles.behaviorSection} aria-labelledby="format-behavior-heading">
        <div className={styles.behaviorInner}>
          <div className={styles.behaviorCopy}>
            <p className={styles.eyebrow}>Format behaviour</p>
            <h2 id="format-behavior-heading">{behavior.heading || uniquePage?.behaviorHeading || `What changes when ${fromUpper} is converted to ${toUpper}?`}</h2>
            <p>{behavior.summary}</p>
            <div className={styles.behaviorLists}>
              <article>
                <h3><CheckCircle2 size={15} /> {behavior.retainedHeading || uniquePage?.retainedHeading || 'Normally retained'}</h3>
                <ul>{behavior.retained.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <article className={styles.changedList}>
                <h3><XCircle size={15} /> {behavior.changedHeading || uniquePage?.changedHeading || 'May not be retained'}</h3>
                <ul>{behavior.changed.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            </div>
          </div>
          <div className={styles.behaviorVisual}>
            <div className={styles.formatVisualRow}>
              <article>
                <span className={styles.geometryIcon}>
                  <img
                    src={getFormatGeometryImage(from)}
                    alt=""
                    width={96}
                    height={96}
                  />
                </span>
                <strong>{fromInfo.name}</strong>
                <FormatBadge format={fromUpper} />
              </article>
              <ArrowRight className={styles.bigArrow} size={28} />
              <article>
                <span className={`${styles.geometryIcon} ${styles.geometryIconBlue}`}>
                  <img
                    src={getFormatGeometryImage(to)}
                    alt=""
                    width={96}
                    height={96}
                  />
                </span>
                <strong>{toInfo.name}</strong>
                <FormatBadge format={toUpper} tone="blue" />
              </article>
            </div>
            {behavior.note ? <p className={styles.behaviorNote}>{behavior.note}</p> : null}
          </div>
        </div>
      </section>

      <section className={styles.comparisonSection} aria-labelledby="format-comparison-heading">
        <div className={styles.comparisonInner}>
          <p className={styles.eyebrow}>Format comparison</p>
          <h2 id="format-comparison-heading">{uniquePage?.comparisonHeading || `${fromUpper} versus ${toUpper}`}</h2>
          <p className={styles.sectionIntro}>{uniquePage?.comparisonIntro || 'Choose the output according to what the next stage of your workflow needs.'}</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th><FormatBadge format={fromUpper} /> {fromUpper}</th>
                  <th><FormatBadge format={toUpper} tone="blue" /> {toUpper}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([label, fromCell, toCell]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td>{fromCell}</td>
                    <td>{toCell}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.chooseGrid}>
            <article>
              <h3>{uniquePage?.chooseToHeading || `Choose ${toUpper} when`}</h3>
              {chooseTo.map((item) => (
                <p key={item}><CheckCircle2 size={14} /> {item}</p>
              ))}
            </article>
            <article>
              <h3>{uniquePage?.keepFromHeading || `Keep ${fromUpper} when`}</h3>
              {keepFrom.map((item) => (
                <p key={item}><CheckCircle2 size={14} /> {item}</p>
              ))}
            </article>
          </div>
        </div>
      </section>

      <ConvertPairAftercare conversionParams={conversionParams} />
      <DesignHub
        variant="converter"
        heading={uniquePage?.designHubHeading}
        description={uniquePage?.designHubIntro}
        nosnippet={Boolean(uniquePage)}
      />
      <ConverterFaq
        faqQuestions={faqs}
        title={uniquePage?.faqHeading}
        description={uniquePage?.faqIntro}
      />
      <ToolsPageBanner
        variant="converter"
        title={uniquePage?.designerTitle}
        description={uniquePage?.designerBody}
        primaryLabel={uniquePage ? 'Hire a CAD designer' : undefined}
        secondaryLabel={uniquePage?.designerSecondary}
      />
      <Footer />
    </>
  )
}

export default ConvertPairPage
