import React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  Download,
  Eye,
  File,
  FileText,
  FolderOpen,
  Headphones,
  Hexagon,
  Layers,
  List,
  LockKeyhole,
  Pencil,
  Clock,
  Shield,
  Upload,
  Workflow,
  X,
  XCircle,
  ChevronDown,
} from 'lucide-react'
import ActiveLastBreadcrumb from '@/Components/CommonJsx/BreadCrumbs'
import ServerBreadCrumbs from '@/Components/CommonJsx/ServerBreadCrumbs'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'
import Footer from '@/Components/HomePages/Footer/Footer'
import DesignHub from '@/Components/HomePages/DesignHub/DesignHub'
import CadFileConversionContent from './CadFileConversionContent'
import ConverterPricingSectionServer from './ConverterPricingSectionServer'
import ConvertPairAftercare from './ConvertPairAftercare'
import ConverterFaq from './ConverterFaq'
import { StlToStepClose, StlToStepSections } from './StlToStepSections'
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

function withBold(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => (
    part.startsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part
  ))
}

const DESKTOP_EXPORTS = [
  {
    name: 'Autodesk Fusion',
    steps: [
      'Right-click the body or component in the Browser and choose **Save As Mesh**.',
      'Set Format to **STL (Binary)** and Unit type to **Millimeter**.',
      'Set Refinement to **High**, or open Refinement Settings to enter a surface deviation.',
    ],
  },
  {
    name: 'SolidWorks',
    steps: [
      'Go to **File → Save As** and choose **STL (*.stl)**.',
      'Click **Options**. Choose Binary output and Millimeters.',
      'Set Resolution to **Fine**, or Custom to enter deviation and angle tolerances.',
      'For assemblies, untick the single-file option to get one STL per component.',
    ],
  },
  {
    name: 'FreeCAD',
    steps: [
      'Open the STEP file with **File → Open**.',
      'Switch to the **Mesh Design** workbench, select the body and choose **Meshes → Create mesh from shape**.',
      'Set Surface deviation and Angular deviation, then click OK.',
      'Select the new mesh and choose **Meshes → Export mesh**, then save as STL.',
    ],
  },
  {
    name: 'Onshape',
    steps: [
      'Right-click the part in the Parts list and choose **Export**.',
      'Set Format to **STL**, STL format to Binary and Units to Millimeter.',
      'Choose Fine resolution, or Custom to set angular and chordal tolerance.',
    ],
  },
]

const PRINT_CHECKS = [
  ['Measure a known dimension', 'Compare an overall length or hole diameter with the drawing. If it is off by 25.4×, see the scale fixes above.'],
  ['Zoom into curved faces', 'Look at holes, fillets and arcs. If you can see flat facets where the finish matters, reconvert at Fine.'],
  ['Look for repair warnings', 'Slicers flag open edges, flipped normals and self-intersections when the file loads. A clean STEP solid should load without them.'],
  ['Check thin walls and small details', 'On FDM printers, walls thinner than about two extrusion widths (roughly 0.8 mm on a 0.4 mm nozzle) often print poorly or are skipped by the slicer.'],
  ['Count the parts', 'Make sure every body you expected is there, and that parts meant to print separately are not merged.'],
  ['Preview the sliced layers', 'Scrub through the layer preview to check supports, orientation and first-layer contact before sending the job.'],
]

const HOOD_STEPS = [
  ['Read the STEP file', 'Every solid and assembly instance is loaded with its position and the units stored in the file.'],
  ['Check the geometry', 'Open shells and invalid faces are detected before meshing, so problems show up as a clear message instead of a broken STL.'],
  ['Mesh each face', 'Surfaces are converted to triangles using the chord and angular tolerance of your chosen quality preset.'],
  ['Write the STL', 'The mesh is saved as binary or ASCII, in millimetres or inches, as one file or a ZIP with one file per body.'],
  ['Delete the files', 'The uploaded STEP and the converted STL are removed automatically within 7 days.'],
]

const TROUBLE_CARDS = [
  {
    icon: Hexagon,
    title: 'Curves look faceted',
    body: 'The mesh is too coarse for the size of the part or the finish you need.',
    fix: 'Fix: reconvert at Fine, or Custom with a chord tolerance of 0.01 mm.',
    link: 'Switch to Fine quality',
    href: '#cad-file-converter',
  },
  {
    icon: File,
    title: 'The STL is enormous',
    body: 'The mesh is finer than the printer can use, or the file is ASCII. A binary STL uses 50 bytes per triangle; ASCII is roughly five times bigger.',
    fix: 'Fix: use Standard or Draft quality with Binary STL.',
    link: 'Use Standard, binary',
    href: '#cad-file-converter',
  },
  {
    icon: Pencil,
    title: 'The model is the wrong size',
    body: 'STL has no unit field, so the slicer assumed millimetres for a file written in another unit.',
    fix: 'Fix: reconvert with Millimetres selected, or scale in the slicer.',
    link: 'See the scale table',
    href: '#units-heading',
  },
  {
    icon: Clock,
    title: 'Slicer reports holes or non-manifold edges',
    body: 'The STEP contains open surfaces instead of closed solids, often from a surface-only export or a damaged file.',
    fix: 'Fix: re-export the STEP as solids (AP214 or AP242) from the source CAD, or use your slicer’s repair option.',
    link: 'Get a designer to repair it',
    href: '/cad-services',
  },
  {
    icon: Layers,
    title: 'Parts are merged or missing',
    body: 'All bodies went into one file, or some bodies were hidden or suppressed when the STEP was exported.',
    fix: 'Fix: choose One STL per body, and check every body was visible in the source export.',
    link: 'Export one STL per body',
    href: '#assembly-heading',
  },
  {
    icon: Eye,
    title: 'Small holes or walls disappeared',
    body: 'The features are below the mesh resolution or below what the printer can produce.',
    fix: 'Fix: use Custom with a 5° angular tolerance. If walls are under the printer’s minimum, the design needs thickening.',
    link: 'Set custom tolerances',
    href: '#cad-file-converter',
  },
]

function meshPreviewPoints(sides, radius, cx = 100, cy = 100) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = (-Math.PI / 2) + (index * 2 * Math.PI) / sides
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')
}

function MeshPreview({ sides, radius = 68 }) {
  return (
    <svg className={styles.meshPreview} viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="78" fill="none" stroke="#cbbbe8" strokeWidth="1.6" strokeDasharray="3.5 4" />
      {sides ? (
        <polygon points={meshPreviewPoints(sides, radius)} fill="#f3eaff" stroke="#6d28d9" strokeWidth="2.4" strokeLinejoin="round" />
      ) : (
        <circle cx="100" cy="100" r={radius} fill="#f3eaff" stroke="#6d28d9" strokeWidth="2.4" />
      )}
    </svg>
  )
}

const FORMAT_GLANCE = [
  ['Input', '.step and .stp files (STEP AP203, AP214, AP242)'],
  ['Output', '.stl, binary or ASCII, as one file or one per body (ZIP)'],
  ['Maximum upload', '300 MB'],
  ['Price', 'Free under 5 MB. Larger files $2.99 each, or from $1.80 with credit packs'],
  ['Default settings', 'Standard mesh quality (0.03 mm, 10°), millimetres, binary'],
  ['Works on', 'Any modern browser on Windows, macOS, Linux, iPad and Android'],
  ['File retention', 'Deleted automatically within 7 days, never published'],
]

const FORMAT_KEPT = [
  'The outer shape of every solid, within the tolerance you chose',
  'Dimensions, written in the units you select (millimetres by default)',
  'Position and orientation of each part in the assembly',
  'Separate bodies, as shells in one STL or as separate files',
  'Closed, watertight volumes, when the STEP solids are valid',
]

const SCALE_FIXES = [
  ['About 25× too small', 'Written in inches, read as mm', '2540%'],
  ['About 25× too large', 'Written in mm, read as inches', '3.937%'],
  ['10× too small', 'Written in centimetres', '1000%'],
  ['1000× too small', 'Written in metres', '100000%'],
]

const FORMAT_COMPARE = [
  ['Geometry', 'Exact surfaces and solids (B-rep)', 'Triangles only', 'Triangle mesh', 'Polygon mesh'],
  ['Units', 'Stored', 'Not stored', 'Stored', 'Not stored'],
  ['Colours and materials', 'Yes', 'No', 'Yes', 'Through a separate .mtl file'],
  ['Multiple parts', 'Full assembly tree with names', 'Unnamed shells', 'Named objects', 'Named groups'],
  ['Editable in CAD', 'Yes', 'Mesh editing only', 'Mesh editing only', 'Mesh editing only'],
  ['Main use', 'Design exchange, CNC, manufacturing', '3D printing, print services', 'Modern slicer workflows', 'Rendering and visualisation'],
]

const FORMAT_CHOICES = [
  ['Convert to STL when', 'Your slicer or print service asks for STL, or you need the one mesh format every 3D program can open. Keep the STEP as your editable master.'],
  ['Keep STEP when', 'The part will be machined, edited, toleranced or sent to a supplier who works from CAD. Converting to a mesh would throw away exact geometry they need.'],
  ['Consider 3MF when', 'You print with PrusaSlicer, Bambu Studio, OrcaSlicer or Cura and want units, colours and multiple named parts kept in one file.'],
]

const FORMAT_LOST = [
  'Exact cylinders, NURBS and fillets, which become triangles',
  'Feature history, sketches and constraints',
  'Assembly tree and part names (kept only as file names in per-body mode)',
  'Colours, materials and PMI or GD&T annotations',
  'The unit label itself, since STL has no field for it',
]

const MESH_PRESETS = [
  ['Draft', '0.1 mm', '20°', 'Quick previews, large FDM parts, sending a model for a quote', 'Smallest'],
  ['Standard', '0.03 mm', '10°', 'Most FDM printing with 0.4 mm nozzles and 0.1–0.3 mm layers', 'Moderate'],
  ['Fine', '0.01 mm', '5°', 'Resin (SLA, MSLA) printing, SLS, visible curved surfaces, small threads', 'Largest'],
  ['Custom', 'You choose', 'You choose', 'Matching a print service’s or simulation tool’s mesh specification', 'Varies'],
]

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
  const isStepToStl = conversionParams === 'step-to-stl'
  const isModernPair = isStepToStl || conversionParams === 'stl-to-step'
  const breadcrumbLinks = isModernPair
    ? [
        { label: 'Conversion tools', href: '/tools/3d-cad-file-converter' },
        { label: `${fromUpper} to ${toUpper}`, href: `/tools/convert-${conversionParams}` },
      ]
    : [
        { label: 'Tools', href: '/tools' },
        { label: '3D CAD File Converter', href: '/tools/3d-cad-file-converter' },
        { label: `${fromUpper} to ${toUpper}`, href: `/tools/convert-${conversionParams}` },
      ]

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
      {isModernPair ? (
        <ServerBreadCrumbs links={breadcrumbLinks} />
      ) : (
        <ActiveLastBreadcrumb links={breadcrumbLinks} />
      )}

      {isModernPair ? null : (
        <div className={cadHomeStyles['cad-ad-bar']}>
          <div className={cadHomeStyles['cad-ad-bar-inner']}>
            <LeftRightBanner adSlot="3755241003" />
          </div>
        </div>
      )}

      <section className={`${styles.hero} ${isModernPair ? styles.stepHero : ''}`}>
        {isModernPair ? (
          <nav className={styles.stepCrumb} aria-label="breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/tools/3d-cad-file-converter">Conversion tools</Link>
            <span aria-hidden="true">/</span>
            <span>{fromUpper} to {toUpper}</span>
          </nav>
        ) : null}
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <div className={styles.heroBadges}>
              {(uniquePage?.badges || [`Free under 5 MB`, `${fromUpper} → ${toUpper}`, 'No software installation']).map((badge) => (
                <span key={badge} className={badge.startsWith('Free') ? styles.freeBadge : undefined}>
                  {badge}
                </span>
              ))}
            </div>
            <h1 className={isModernPair ? styles.stepTitle : undefined}>
              {isModernPair ? (
                <>
                  <span>{`Convert ${fromUpper} to`}</span>
                  <span>{`${toUpper} online`}</span>
                </>
              ) : uniquePage?.h1 || (
                <>
                  Convert {fromUpper}<br />to {toUpper} online
                </>
              )}
            </h1>
            <p>{heroDescription}</p>
            {isModernPair ? (
              <div className={styles.stepTrust}>
                {(uniquePage?.trust || ['Encrypted uploads', 'Files up to 300 MB', 'Deleted automatically within 7 days']).map((item, index) => {
                  const Icon = [Shield, List, Check, LockKeyhole][index] || Shield
                  return (
                    <span key={item}><i><Icon size={13} /></i> {item}</span>
                  )
                })}
              </div>
            ) : (
              <div className={styles.trustRow}>
                {(uniquePage?.trust || ['Encrypted uploads', 'Files up to 300 MB', 'Automatically deleted within 7 days']).map((item, index) => {
                  const Icon = [Shield, Workflow, LockKeyhole][index] || Shield
                  return (
                    <span key={item}><Icon size={15} /> {item}</span>
                  )
                })}
              </div>
            )}
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
              designVariant={isModernPair ? 'stepToStlHero' : 'converterHero'}
            />
          </section>
        </div>
      </section>

      {conversionParams === 'stl-to-step' ? <StlToStepSections /> : null}

      {isStepToStl ? (
        <nav className={styles.pageNav} aria-label="On this page">
          <span>On this page</span>
          {[
            ['#pair-workflow-heading', 'How to convert'],
            ['#mesh-quality-heading', 'Mesh quality'],
            ['#formats-heading', 'STEP and STL explained'],
            ['#units-heading', 'Units and scale'],
            ['#compare-heading', 'STEP vs STL vs 3MF'],
            ['#desktop-heading', 'Export from CAD'],
            ['#trouble-heading', 'Troubleshooting'],
            ['#step-faq-heading', 'FAQ'],
          ].map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
      ) : null}

      {isStepToStl ? (
        <section className={styles.stepHow} aria-labelledby="pair-workflow-heading">
          <div className={styles.workflowInner}>
            <p className={styles.eyebrow}>{uniquePage?.workflowEyebrow || 'Step by step'}</p>
            <h2 id="pair-workflow-heading">{uniquePage?.workflowHeading || 'How to convert STEP to STL'}</h2>
            <p className={styles.stepHowIntro}>
              To convert STEP to STL online, upload your .step or .stp file above, pick a mesh quality (Standard suits most 3D printing), keep the units in millimetres, then click <strong>Convert STEP to STL</strong> and download the .stl file. Files under 5 MB are free. STP to STL works exactly the same way, because .stp is just the short extension for STEP.
            </p>
            <div className={styles.stepHowGrid}>
              {workflowSteps.map(([title, description], index) => (
                <article key={title} className={styles.stepHowCard}>
                  <span className={styles.stepHowNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
            <a href="#cad-file-converter" className={styles.convertButton}>
              {uniquePage?.workflowCta || 'Convert STEP to STL'}
            </a>
          </div>
        </section>
      ) : null}

      {isStepToStl ? (
        <section className={styles.meshSettings} aria-labelledby="mesh-quality-heading">
          <div className={styles.meshInner}>
            <p className={styles.eyebrow}>Mesh settings</p>
            <h2 id="mesh-quality-heading">Choose the right mesh quality</h2>
            <p className={styles.meshLead}>
              STEP stores exact curves. STL can only store flat triangles, so every curved face has to be approximated. Two settings decide how closely the triangles follow the original surface, and how big the file gets.
            </p>
            <div className={styles.meshExplain}>
              <article>
                <h3>Chord tolerance</h3>
                <p>The largest gap allowed between the true CAD surface and the flat triangle that replaces it, in millimetres. Smaller values give smoother curves and more triangles.</p>
              </article>
              <article>
                <h3>Angular tolerance</h3>
                <p>The largest angle allowed between neighbouring triangles. It keeps small holes, bosses and fillets round even when the chord tolerance alone would leave them blocky.</p>
              </article>
            </div>
            <div className={styles.meshTableCard}>
              <h3>Mesh quality presets</h3>
              <div className={styles.meshTableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>Preset</th>
                      <th>Chord tolerance</th>
                      <th>Angular tolerance</th>
                      <th>Best for</th>
                      <th>File size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MESH_PRESETS.map(([preset, chord, angle, bestFor, size]) => (
                      <tr key={preset}>
                        <th scope="row">
                          {preset}
                          {preset === 'Standard' ? <span className={styles.meshDefault}>Default</span> : null}
                        </th>
                        <td>{chord}</td>
                        <td>{angle}</td>
                        <td>{bestFor}</td>
                        <td>{size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={styles.meshExamples}>
              <article>
                <MeshPreview sides={8} radius={62} />
                <h3>Draft</h3>
                <p>Facets are visible on curved faces</p>
              </article>
              <article>
                <MeshPreview sides={20} radius={70} />
                <h3>Standard</h3>
                <p>Smoother than a typical FDM layer can show</p>
              </article>
              <article>
                <MeshPreview radius={74} />
                <h3>Fine</h3>
                <p>Follows the true curve closely</p>
              </article>
            </div>
            <p className={styles.meshCaption}>The dashed line is the exact circle stored in the STEP file. The solid outline is what ends up in the STL.</p>
          </div>
        </section>
      ) : null}

      {isStepToStl ? (
        <section className={styles.formatsSection} aria-labelledby="formats-heading">
          <div className={styles.meshInner}>
            <p className={styles.eyebrow}>The formats</p>
            <h2 id="formats-heading">What are STEP and STL files?</h2>
            <div className={styles.formatCards}>
              <article>
                <h3>STEP file (.step, .stp)</h3>
                <p>A STEP file is a CAD exchange format defined by the international standard ISO 10303. It stores exact solid geometry, assembly structure, units and product data, so almost any CAD program can open and edit it.</p>
                <p>STP is not a different format. It is the shorter file extension for STEP, and both convert the same way.</p>
              </article>
              <article>
                <h3>STL file (.stl)</h3>
                <p>An STL file describes the surface of a 3D object as a list of flat triangles. It was created by 3D Systems in 1987 for stereolithography and is still the file almost every slicer, print service and mesh tool accepts.</p>
                <p>It stores no units, colours or part names, only triangle corners and the direction each triangle faces.</p>
              </article>
            </div>
            <div className={styles.glanceCard}>
              <h3>This converter at a glance</h3>
              <dl>
                {FORMAT_GLANCE.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <h2 id="carries-over-heading" className={styles.carriesHeading}>What carries over from STEP to STL</h2>
            <p className={styles.carriesLead}>
              STEP holds exact solids, assembly structure and product data. STL holds triangles and nothing else. Here is what that means for your file.
            </p>
            <div className={styles.carriesGrid}>
              <article>
                <h3 className={styles.keptTitle}>Kept</h3>
                <ul>
                  {FORMAT_KEPT.map((item) => (
                    <li key={item}><Check size={16} aria-hidden="true" /> {item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h3 className={styles.lostTitle}>Lost or changed</h3>
                <ul>
                  {FORMAT_LOST.map((item) => (
                    <li key={item}><X size={16} aria-hidden="true" /> {item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>
      ) : null}

      {isStepToStl ? (
        <section className={styles.unitsSection} aria-labelledby="units-heading">
          <div className={styles.unitsGrid}>
            <div>
              <p className={styles.eyebrow}>Units and scale</p>
              <h2 id="units-heading">Get the size right first time</h2>
              <p>An STL file stores coordinates such as 25.4 with no unit attached, and slicers read those numbers as millimetres. If a model is written out in inches, a part that should be one inch wide shows up as one millimetre wide.</p>
              <p>This converter reads the units in your STEP file and writes the STL in millimetres unless you choose inches, so parts open in the slicer at their real size. Before printing, measure one dimension you know, such as an overall length or a hole diameter.</p>
              <p>If a file from somewhere else arrives at the wrong size, scale it in the slicer. In PrusaSlicer, Bambu Studio and OrcaSlicer, use the scale fields in the object panel. In Cura, use the Scale tool with uniform scaling turned on.</p>
            </div>
            <div className={styles.scaleCard}>
              <h3>Scale fixes for unit mistakes</h3>
              <table>
                <thead>
                  <tr>
                    <th>What you see</th>
                    <th>Likely cause</th>
                    <th>Scale by</th>
                  </tr>
                </thead>
                <tbody>
                  {SCALE_FIXES.map(([seen, cause, scale]) => (
                    <tr key={seen}>
                      <td>{seen}</td>
                      <td>{cause}</td>
                      <td>{scale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {isStepToStl ? (
        <section className={styles.compareSection} aria-labelledby="compare-heading">
          <div className={styles.meshInner}>
            <p className={styles.eyebrow}>Format comparison</p>
            <h2 id="compare-heading">STEP vs STL vs 3MF</h2>
            <p className={styles.compareLead}>
              Pick the format the next program needs. STEP is for designing and manufacturing from exact geometry, STL and 3MF are for printing, and OBJ is for visualisation.
            </p>
            <div className={styles.compareTableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>STEP (.step, .stp)</th>
                    <th>STL (.stl)</th>
                    <th>3MF (.3mf)</th>
                    <th>OBJ (.obj)</th>
                  </tr>
                </thead>
                <tbody>
                  {FORMAT_COMPARE.map(([feature, step, stl, threemf, obj]) => (
                    <tr key={feature}>
                      <th scope="row">{feature}</th>
                      <td>{step}</td>
                      <td>{stl}</td>
                      <td>{threemf}</td>
                      <td>{obj}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.compareChoices}>
              {FORMAT_CHOICES.map(([title, body]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {isStepToStl ? (
        <section className={styles.assemblySection} aria-labelledby="assembly-heading">
          <div className={styles.meshInner}>
            <p className={styles.eyebrow}>Assemblies</p>
            <h2 id="assembly-heading">Converting STEP assemblies to STL</h2>
            <p className={styles.assemblyLead}>STL has no concept of an assembly. When your STEP file contains several bodies, choose how they should come out.</p>
            <div className={styles.assemblyGrid}>
              <article>
                <p>Parts: Single STL</p>
                <h3>Print the assembly as one piece</h3>
                <span>Every body is placed in one STL, in its assembled position. Use this for display models, or parts that are printed together on one plate.</span>
              </article>
              <article>
                <p>Parts: One STL per body (ZIP)</p>
                <h3>Print each part separately</h3>
                <span>You get a ZIP with one STL per solid, named after the part in the STEP file. Use this when parts need different orientations, materials or printers.</span>
              </article>
            </div>
          </div>
        </section>
      ) : null}

      {isStepToStl ? (
        <section className={styles.desktopSection} aria-labelledby="desktop-heading">
          <div className={styles.desktopGrid}>
            <div>
              <p className={styles.eyebrow}>Desktop alternatives</p>
              <h2 id="desktop-heading">Export STL from your CAD software</h2>
              <p>If you have the original CAD model, exporting STL directly works well. Use this converter when you only have the STEP file, don’t have a CAD licence on your machine, or want the same mesh settings every time.</p>
              <p>In every program, look for three things: binary output, millimetre units, and a deviation or resolution setting that matches the quality presets above.</p>
            </div>
            <div className={styles.desktopList}>
              {DESKTOP_EXPORTS.map((program) => (
                <details key={program.name} className={styles.desktopItem} open>
                  <summary>
                    {program.name}
                    <ChevronDown size={18} aria-hidden="true" />
                  </summary>
                  <ol>
                    {program.steps.map((step) => (
                      <li key={step}>{withBold(step)}</li>
                    ))}
                  </ol>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {isStepToStl ? (
        <section className={styles.printSection} aria-labelledby="print-check-heading">
          <div className={styles.printGrid}>
            <div>
              <p className={styles.eyebrow}>Before you print</p>
              <h2 id="print-check-heading">Check the STL before slicing</h2>
              <p>A conversion can succeed and still give you a file that prints badly. These checks take a couple of minutes in any slicer and catch most problems before they waste filament or resin.</p>
              <p className={styles.printViewerLink}>
                <Link href="/tools/stl-file-viewer">Open the STL viewer</Link> to inspect the file in your browser.
              </p>
            </div>
            <ol className={styles.printChecks}>
              {PRINT_CHECKS.map(([title, body], index) => (
                <li key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {isStepToStl ? (
        <section className={styles.hoodSection} aria-labelledby="hood-heading">
          <div className={styles.printGrid}>
            <div>
              <p className={styles.eyebrow}>Under the hood</p>
              <h2 id="hood-heading">How the converter works</h2>
              <p>Every conversion runs the same five steps on our servers, using the settings you choose. Nothing about your file is guessed or hidden.</p>
              <p className={styles.printViewerLink}>
                <Link href="/about-us">Read about the Marathon OS engineering team</Link>
              </p>
            </div>
            <ol className={styles.printChecks}>
              {HOOD_STEPS.map(([title, body], index) => (
                <li key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {isStepToStl ? (
        <section className={styles.troubleSection} aria-labelledby="trouble-heading">
          <div className={styles.meshInner}>
            <p className={styles.eyebrow}>Common problems</p>
            <h2 id="trouble-heading">STEP to STL troubleshooting</h2>
            <p className={styles.troubleLead}>Most problems come from the mesh setting, the units, or the STEP file itself. Each fix below can be applied with the converter on this page.</p>
            <div className={styles.troubleGrid}>
              {TROUBLE_CARDS.map(({ icon: Icon, title, body, fix, link, href }) => (
                <article key={title}>
                  <div className={styles.troubleTitle}>
                    <span><Icon size={16} aria-hidden="true" /></span>
                    <h3>{title}</h3>
                  </div>
                  <p>{body}</p>
                  <p className={styles.troubleFix}>{fix}</p>
                  <Link href={href}>{link}</Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {isStepToStl ? (
        <section className={styles.secureSection} aria-labelledby="secure-heading">
          <div className={styles.securePanel}>
            <div>
              <p className={`${styles.eyebrow} ${styles.secureEyebrow}`}>Secure processing</p>
              <h2 id="secure-heading">Your design files stay yours</h2>
              <p>Engineering files often contain confidential product geometry. Conversion uploads are kept separate from the public Marathon OS CAD library, and this is exactly how they are handled.</p>
            </div>
            <div className={styles.secureGrid}>
              <article>
                <h3>Encrypted transfer</h3>
                <p>Files are uploaded and downloaded over an encrypted connection.</p>
              </article>
              <article>
                <h3>Automatic deletion</h3>
                <p>Uploaded STEP files and converted STLs are deleted automatically within 7 days.</p>
              </article>
              <article>
                <h3>You keep ownership</h3>
                <p>Uploading or converting a file never transfers ownership of the design to Marathon OS.</p>
              </article>
              <article>
                <h3>Never published</h3>
                <p>Converted files are never listed in the public CAD library.</p>
              </article>
            </div>
          </div>
        </section>
      ) : null}

      <ConverterPricingSectionServer layout={isModernPair ? 'stepToStl' : 'default'} />

      {isModernPair ? (
        <section className={styles.faqSection} aria-labelledby="step-faq-heading">
          <div className={styles.faqGrid}>
            <div className={styles.faqCopy}>
              <p className={styles.eyebrow}>FAQ</p>
              <h2 id="step-faq-heading">{uniquePage?.faqHeading || 'STEP to STL questions'}</h2>
              <p>{uniquePage?.faqIntro || 'Answers about quality, file size, units, assemblies, pricing and privacy.'}</p>
              <article className={styles.faqReview}>
                <span className={styles.faqAvatar} aria-hidden="true">M</span>
                <div>
                  <p>
                    Reviewed by the{' '}
                    <Link href="/about-us">Marathon OS engineering team</Link>.
                  </p>
                  <small>Last updated 17 October 2026</small>
                </div>
              </article>
            </div>
            <div className={styles.faqList}>
              {faqs.map((item, index) => (
                <details key={item.question} className={styles.faqItem} open={index === 0}>
                  <summary>
                    <span>{item.question}</span>
                    <ChevronDown size={18} aria-hidden="true" />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {conversionParams === 'stl-to-step' ? <StlToStepClose /> : null}

      {isStepToStl ? (
        <section className={styles.relatedSection} aria-labelledby="related-tools-heading">
          <div className={styles.meshInner}>
            <p className={styles.eyebrow}>Related tools</p>
            <h2 id="related-tools-heading">More STEP and STL tools</h2>
            <p className={styles.relatedLead}>Inspect the source file, check the mesh, or convert to the format your next program needs.</p>
            <div className={styles.relatedGrid}>
              {[
                { badges: ['STEP'], title: 'STEP viewer', body: 'Inspect bodies and assemblies before converting', href: '/tools/step-file-viewer' },
                { badges: ['STL'], title: 'STL viewer', body: 'Check the mesh, scale and facets in your browser', href: '/tools/stl-file-viewer' },
                { badges: ['STL', 'STEP'], title: 'STL to STEP', body: 'Turn a mesh into a solid for CAD', href: '/tools/convert-stl-to-step' },
                { badges: ['STEP', 'OBJ'], title: 'STEP to OBJ', body: 'Mesh for rendering and visualisation', href: '/tools/convert-step-to-obj' },
                { badges: ['OBJ', 'STL'], title: 'OBJ to STL', body: 'Prepare a visual mesh for slicing', href: '/tools/convert-obj-to-stl' },
                { badges: ['STEP', '2D'], title: 'STEP or STP to 2D drawing', body: 'Dimensioned views from a 3D model, $5.99', href: '/tools/cad-drawing-pipeline' },
              ].map((tool) => (
                <Link key={tool.href} href={tool.href} className={styles.relatedCard}>
                  <span className={styles.relatedBadges}>
                    {tool.badges.map((badge, index) => (
                      <React.Fragment key={badge}>
                        {index > 0 ? <i aria-hidden="true">→</i> : null}
                        <em>{badge}</em>
                      </React.Fragment>
                    ))}
                  </span>
                  <strong>{tool.title}</strong>
                  <small>{tool.body}</small>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {isStepToStl ? (
        <section className={styles.designerCta} aria-labelledby="designer-cta-heading">
          <div className={styles.designerPanel}>
            <h2 id="designer-cta-heading">Need a print-ready model, not just a mesh?</h2>
            <p>Conversion gives you an STL of the geometry you have. If the model needs solid repair, thicker walls, split parts or tolerances for a specific process, a CAD designer can fix it.</p>
            <div>
              <Link href="/cad-services">Hire a CAD designer</Link>
              <a href="#cad-file-converter">Convert another STEP file</a>
            </div>
          </div>
        </section>
      ) : null}

      {isModernPair ? null : (
      <>
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
      </>
      )}
      <Footer />
    </>
  )
}

export default ConvertPairPage
