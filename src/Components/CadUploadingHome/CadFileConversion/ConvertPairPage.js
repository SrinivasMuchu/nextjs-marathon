import React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Download,
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
import ConvertPairAftercare from './ConvertPairAftercare'
import ConverterFaq from './ConverterFaq'
import ToolsPageBanner from '@/Components/CadServicesBanners/ToolsPageBanner'
import { getConverterFaqQuestions } from '@/data/cadToolFaqs'
import { getConverterPairContent } from '@/data/converterPairContent'
import cadHomeStyles from '../CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css'
import styles from './ConvertPairPage.module.css'

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
  } = content
  const faqs = getConverterFaqQuestions(conversionParams)

  const benefits = [
    {
      icon: Download,
      title: 'Browser-based conversion',
      description: `Use the converter without installing desktop software to move from ${fromUpper} to ${toUpper}.`,
    },
    {
      icon: Box,
      title: `Built for ${toInfo.family.toLowerCase()}`,
      description: `Translate ${fromInfo.geometry.toLowerCase()} into the ${toInfo.geometry.toLowerCase()} used by ${toUpper}.`,
    },
    {
      icon: Workflow,
      title: 'Ready for the next workflow',
      description: `Open the result in ${toInfo.tools} for review, editing or production.`,
    },
    {
      icon: LockKeyhole,
      title: 'Private file handling',
      description: 'Converted models are not added to the public CAD library and are removed after processing.',
    },
  ]

  const resources = [
    {
      icon: FolderOpen,
      title: 'Browse CAD models',
      description: 'Search ready-to-use engineering and 3D-printing files across the Marathon OS library.',
      href: '/library',
    },
    {
      icon: FileText,
      title: 'Browse 2D technical drawings',
      description: 'Explore PDF, SVG and DXF drawing resources for engineering review and documentation.',
      href: '/library/2d-technical-drawings',
    },
    {
      icon: Headphones,
      title: 'Get CAD design support',
      description: 'Work with a vetted designer when the model needs repair, remodelling or a production-ready native file.',
      href: '/cad-services',
    },
  ]

  return (
    <>
      <ActiveLastBreadcrumb
        variant="dark"
        links={[
          { label: 'tools', href: '/tools' },
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
              <span className={styles.freeBadge}>Free under 5 MB</span>
              <span>{fromUpper} → {toUpper}</span>
              <span>No software installation</span>
            </div>
            <h1>Convert {fromUpper}<br />to {toUpper} online</h1>
            <p>{heroDescription}</p>
            <div className={styles.trustRow}>
              <span><Shield size={15} /> Encrypted uploads</span>
              <span><Workflow size={15} /> Files up to 300 MB</span>
              <span><LockKeyhole size={15} /> Deleted after 7 days</span>
            </div>
          </div>

          <section id="cad-file-converter" className={`${heroStyles.converterCard} ${styles.uploadCard}`} aria-label={`${fromUpper} to ${toUpper} converter`}>
            <div className={styles.uploadHeader}>
              <div>
                <h2>Upload your {fromUpper} file</h2>
                <p>Choose one file to begin the conversion.</p>
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

      <section className={styles.benefits} aria-label={`${fromUpper} to ${toUpper} conversion benefits`}>
        <div className={styles.benefitGrid}>
          {benefits.map(({ icon: Icon, title, description }) => (
            <article key={title} className={styles.benefitCard}>
              <span className={styles.smallIcon}><Icon size={17} /></span>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.resources} aria-labelledby="pair-resources-heading">
        <div className={styles.resourcesInner}>
          <div className={styles.resourcesHeader}>
            <div>
              <p className={styles.eyebrow}>Continue your CAD workflow</p>
              <h2 id="pair-resources-heading">Explore Marathon<br />OS CAD resources</h2>
            </div>
            <p>Preview a model before conversion, find an existing engineering file, open a 2D drawing, or get specialist help when a source mesh needs to be rebuilt.</p>
          </div>

          <div className={styles.resourceGrid}>
            {resources.map(({ icon: Icon, title, description, href }) => (
              <Link key={title} href={href} className={styles.resourceCard}>
                <span className={styles.resourceIcon}><Icon size={18} /></span>
                <span className={styles.resourceBody}>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
                <span className={styles.resourceArrow}><ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>

          {/* Explore more — preview / library cards
          <div className={styles.exploreHeading}>
            <h3>Explore more</h3>
            <span>Useful before and after conversion</span>
          </div>
          <div className={styles.exploreGrid}>
            <Link href={`/tools/${from}-file-viewer`} className={styles.exploreCard}>
              <div>
                <span className={styles.exploreLabel}>Inspect first</span>
                <h3>Need to preview before converting?</h3>
                <p>Open the {fromUpper} in the browser to inspect geometry, orientation and scale before creating the {toUpper}.</p>
                <strong>Open CAD Viewer →</strong>
              </div>
              <span className={styles.exploreArt}><View size={42} /></span>
            </Link>
            <Link href="/library" className={`${styles.exploreCard} ${styles.exploreCardBlue}`}>
              <div>
                <span className={styles.exploreLabel}>Find a model</span>
                <h3>Looking for ready-to-use CAD files?</h3>
                <p>Search the Marathon OS library for downloadable CAD models, printable parts and engineering references.</p>
                <strong>Browse CAD Library →</strong>
              </div>
              <span className={styles.exploreArt}><FolderOpen size={42} /></span>
            </Link>
          </div>
          */}
        </div>
      </section>

      <section className={styles.workflowSection} aria-labelledby="pair-workflow-heading">
        <div className={styles.workflowInner}>
          <p className={styles.eyebrow}>Simple conversion workflow</p>
          <h2 id="pair-workflow-heading">How to convert {fromUpper} to {toUpper} online</h2>
          <p className={styles.sectionIntro}>Move from {fromInfo.name} to {toInfo.name} in three clear steps.</p>
          <div className={styles.workflowGrid}>
            {[
              [Upload, `Upload your ${fromUpper} file`, `Drag and drop the .${from} file into the converter or choose it from your device. Files up to 300 MB are supported.`],
              [Workflow, `Use ${toUpper} as the output`, `This page is preconfigured for ${fromUpper}-to-${toUpper} conversion, so you do not need to search through target formats.`],
              [Download, `Download and inspect the ${toUpper}`, `Download the result and open it in your preferred compatible application to confirm its geometry and scale.`],
            ].map(([Icon, title, description], index) => (
              <article key={title} className={styles.workflowCard}>
                <span className={styles.stepIcon}><Icon size={17} /></span>
                <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <a href="#cad-file-converter" className={styles.convertButton}>Convert a {fromUpper} file <Upload size={14} /></a>
        </div>
      </section>

      <section className={styles.behaviorSection} aria-labelledby="format-behavior-heading">
        <div className={styles.behaviorInner}>
          <div className={styles.behaviorCopy}>
            <p className={styles.eyebrow}>Format behaviour</p>
            <h2 id="format-behavior-heading">What changes when<br />{fromUpper} is converted to {toUpper}?</h2>
            <p>{behavior.summary}</p>
            <div className={styles.behaviorLists}>
              <article>
                <h3><CheckCircle2 size={15} /> Normally retained</h3>
                <ul>{behavior.retained.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <article className={styles.changedList}>
                <h3><XCircle size={15} /> May not be retained</h3>
                <ul>{behavior.changed.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            </div>
          </div>
          <div className={styles.behaviorVisual}>
            <div className={styles.formatVisualRow}>
              <article>
                <span className={styles.geometryIcon}><Box size={56} /></span>
                <strong>{fromInfo.name}</strong>
                <FormatBadge format={fromUpper} />
              </article>
              <ArrowRight className={styles.bigArrow} size={28} />
              <article>
                <span className={`${styles.geometryIcon} ${styles.geometryIconBlue}`}><Box size={56} /></span>
                <strong>{toInfo.name}</strong>
                <FormatBadge format={toUpper} tone="blue" />
              </article>
            </div>
            <p className={styles.behaviorNote}>{behavior.note}</p>
          </div>
        </div>
      </section>

      <section className={styles.comparisonSection} aria-labelledby="format-comparison-heading">
        <div className={styles.comparisonInner}>
          <p className={styles.eyebrow}>Format comparison</p>
          <h2 id="format-comparison-heading">{fromUpper} versus {toUpper}</h2>
          <p className={styles.sectionIntro}>Choose the output according to what the next stage of your workflow needs.</p>
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
                {COMPARISON_ROWS.map(([label, key]) => (
                  <tr key={key}>
                    <th scope="row">{label}</th>
                    <td>{fromInfo[key]}</td>
                    <td>{toInfo[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.chooseGrid}>
            <article>
              <h3>Choose {toUpper} when</h3>
              <p><CheckCircle2 size={14} /> Your next application or supplier specifically requires a {toUpper} file.</p>
              <p><CheckCircle2 size={14} /> {toInfo.purpose} is the next stage of the workflow.</p>
              <p><CheckCircle2 size={14} /> The target geometry representation suits the downstream task.</p>
            </article>
            <article>
              <h3>Keep {fromUpper} when</h3>
              <p><CheckCircle2 size={14} /> Your project still depends on data unique to the source format.</p>
              <p><CheckCircle2 size={14} /> You need to continue editing in {fromInfo.tools}.</p>
              <p><CheckCircle2 size={14} /> The model is still being prepared rather than handed off.</p>
            </article>
          </div>
        </div>
      </section>

      <ConvertPairAftercare conversionParams={conversionParams} />
      <DesignHub variant="converter" />
      <ConverterFaq faqQuestions={faqs} />
      <ToolsPageBanner variant="converter" />
      <Footer />
    </>
  )
}

export default ConvertPairPage

