import React from 'react';
import Link from 'next/link';
import { Box, RefreshCw, Network, Eye, Layers, ArrowRight, Building2 } from 'lucide-react';
import Footer from '@/Components/HomePages/Footer/Footer';
import ActiveLastBreadcrumb from '@/Components/CommonJsx/BreadCrumbs';
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner';
import cadHomeStyles from '@/Components/CadUploadingHome/CadHomeDesign/CadHome.module.css';
import heroStyles from '@/Components/CadUploadingHome/CadHomeDesign/CadViewerHero.module.css';
import styles from './ToolsHubPage.module.css';

const HERO_FEATURES = [
  { Icon: Eye, label: 'Browser-based' },
  { Icon: Layers, label: '50+ formats' },
  { Icon: RefreshCw, label: 'Instant conversion' },
];

const QUICK_TOOLS_CARDS = [
  {
    href: '/tools/3D-cad-viewer',
    title: 'CAD Viewer',
    description:
      'Open and inspect any CAD file instantly in your browser. View STEP, IGES, STL, OBJ, PLY, and more without installing software.',
    tags: ['50+ Formats', 'Browser-based', 'Zero Install'],
    Icon: Eye,
  },
  {
    href: '/tools/3d-cad-file-converter',
    title: 'CAD Converter',
    description:
      'Convert between CAD formats in seconds. Transform STEP to STL, OBJ to STL, IGES to STEP, and more with preserved geometry.',
    tags: ['Instant Convert', 'Batch Process', 'Cloud-based'],
    Icon: RefreshCw,
  },
  {
    href: '/tools/industries',
    title: 'Industries',
    description:
      'Browse CAD viewer pages by industry—automotive, marine, aerospace, and more—with sector-specific copy and upload flows.',
    tags: ['By sector', 'Browser-based', 'All formats'],
    Icon: Building2,
  },
];

/** Per-format viewer cards (routes must match `app/tools/[tool]/page.js` allowlist). */
const CAD_VIEWER_CARDS = [
  {
    href: '/tools/obj-file-viewer',
    title: 'OBJ Viewer',
    description: 'View OBJ mesh models and 3D assets in your browser.',
    tags: ['Mesh', '3D Assets', 'Textures'],
  },
  {
    href: '/tools/stl-file-viewer',
    title: 'STL Viewer',
    description: 'Inspect STL meshes for 3D printing checks.',
    tags: ['3D Printing', 'Mesh', 'Prototyping'],
  },
  {
    href: '/tools/ply-file-viewer',
    title: 'PLY Viewer',
    description: 'Open PLY point clouds and polygon meshes online.',
    tags: ['Point Cloud', 'Polygon', 'Scan Data'],
  },
  {
    href: '/tools/step-file-viewer',
    title: 'STEP Viewer',
    description: 'View STEP solid models from any CAD software.',
    tags: ['Solid Model', 'CAD', 'Engineering'],
  },
  {
    href: '/tools/iges-file-viewer',
    title: 'IGES Viewer',
    description: 'Open legacy IGES surface and wireframe models.',
    tags: ['Surface', 'Wireframe', 'Legacy'],
  },
  {
    href: '/tools/3D-cad-viewer',
    title: '3MF Viewer',
    description: 'Preview 3MF files optimized for additive manufacturing.',
    tags: ['3D Printing', 'Manufacturing', 'Color'],
  },
];

/** Paths must exist in `converterTypes` (`/tools/convert-{path}`); 3MF uses main converter hub. */
const CAD_CONVERTER_CARDS = [
  {
    href: '/tools/convert-stl-to-obj',
    title: 'STL to OBJ Converter',
    description: 'Convert STL meshes to OBJ format with preserved geometry.',
    tags: ['Mesh', 'Export', '3D'],
  },
  {
    href: '/tools/convert-obj-to-stl',
    title: 'OBJ to STL Converter',
    description: 'Export OBJ models as STL for 3D printing workflows.',
    tags: ['3D Printing', 'Mesh', 'Export'],
  },
  {
    href: '/tools/convert-step-to-stl',
    title: 'STEP to STL Converter',
    description: 'Convert STEP solid models to printable STL meshes.',
    tags: ['Solid to Mesh', '3D Printing', 'CAD'],
  },
  {
    href: '/tools/convert-iges-to-step',
    title: 'IGES to STEP Converter',
    description: 'Upgrade legacy IGES files to modern STEP format.',
    tags: ['Legacy', 'Migration', 'Engineering'],
  },
  {
    href: '/tools/3d-cad-file-converter',
    title: '3MF to STL Converter',
    description: 'Convert 3MF additive manufacturing files to STL.',
    tags: ['Manufacturing', 'Mesh', 'Export'],
  },
  {
    href: '/tools/convert-ply-to-obj',
    title: 'PLY to OBJ Converter',
    description: 'Transform PLY scan data to OBJ for editing and rendering.',
    tags: ['Scan Data', 'Polygon', 'Render'],
  },
];

/** Org chart landing vs editor: `/tools/org-hierarchy`, `/tools/org-hierarchy/chart-maker`. */
const ORG_HIERARCHY_CARDS = [
  {
    href: '/tools/org-hierarchy',
    title: 'Org Chart Creator',
    description: 'Build professional organizational charts online—no install, ready to share.',
    tags: ['Free', 'Browser', 'Teams'],
  },
  {
    href: '/tools/org-hierarchy/chart-maker',
    title: 'Interactive Chart Maker',
    description: 'Draw and edit hierarchy nodes, reporting lines, and departments in one canvas.',
    tags: ['Edit', 'Canvas', 'Structure'],
  },
  {
    href: '/tools/org-hierarchy/chart-maker',
    title: 'Team Structure Visualizer',
    description: 'Map roles and reporting relationships so everyone sees how the org fits together.',
    tags: ['Reporting', 'Roles', 'Clarity'],
  },
  {
    href: '/tools/org-hierarchy',
    title: 'Company Hierarchy Overview',
    description: 'Start from a template or blank chart to capture your company or group layout.',
    tags: ['Template', 'HR', 'Scale-ups'],
  },
  {
    href: '/tools/org-hierarchy/chart-maker',
    title: 'Reporting Lines Diagram',
    description: 'Clarify who reports to whom—ideal for onboarding and leadership reviews.',
    tags: ['Onboarding', 'Leadership', 'Export'],
  },
  {
    href: '/tools/org-hierarchy',
    title: 'Shareable Org Charts',
    description: 'Create a chart your team can reference anytime, straight from the browser.',
    tags: ['Collaboration', 'Share', 'Online'],
  },
];

export default function ToolsHubPage() {
  return (
    <div className={styles.page}>
      <ActiveLastBreadcrumb links={[{ label: 'tools', href: '/tools' }]} />
      <div className={heroStyles.heroPage}>
        <div className={cadHomeStyles['cad-ad-bar']}>
          <div className={cadHomeStyles['cad-ad-bar-inner']}>
            <LeftRightBanner adSlot="3755241003" />
          </div>
        </div>
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.badge}>Free Online CAD Tools</p>
            <h1 className={styles.title}>
              <span className={styles.titlePrimary}>CAD Viewers &amp; Converters — </span>
              <span className={styles.titleAccent}>No Install Required</span>
            </h1>
            <p className={styles.lead}>
              Open, inspect, and convert 50+ CAD file formats directly in your browser. Built for engineers,
              designers, and teams who need instant access.
            </p>
            <ul className={styles.heroFeatures} role="list">
              {HERO_FEATURES.map(({ Icon, label }) => (
                <li key={label} className={styles.heroFeature} role="listitem">
                  <span className={styles.heroFeatureIcon} aria-hidden>
                    <Icon size={20} strokeWidth={2.2} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
            <div className={styles.heroActions}>
              <Link href="/tools/3D-cad-viewer" className={styles.heroPrimaryBtn}>
                Open CAD Viewer
              </Link>
              <Link href="/tools/3d-cad-file-converter" className={styles.heroSecondaryBtn}>
                Open CAD Converter
              </Link>
            </div>
          </div>
        </header>
      </div>

      <section className={styles.quickToolsSection} aria-label="Core CAD tools">
        <div className={styles.quickToolsInner}>
          <div className={styles.quickToolsGrid}>
            {QUICK_TOOLS_CARDS.map(({ href, title, description, tags, Icon }) => (
              <Link key={title} href={href} className={styles.quickToolCard}>
                <div className={styles.quickToolCardTop}>
                  <span className={styles.quickToolIcon} aria-hidden>
                    <Icon size={22} strokeWidth={2.2} />
                  </span>
                  <span className={styles.quickToolLaunch}>
                    Launch <ArrowRight size={16} strokeWidth={2.4} />
                  </span>
                </div>
                <h2 className={styles.quickToolTitle}>{title}</h2>
                <p className={styles.quickToolDesc}>{description}</p>
                <div className={styles.quickToolTags}>
                  {tags.map((tag) => (
                    <span key={tag} className={styles.quickToolTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.convertersSection} aria-labelledby="cad-converters-heading">
        <div className={styles.viewersInner}>
          <div className={styles.viewersHeader}>
            <div className={styles.convertersHeaderIcon} aria-hidden>
              <RefreshCw size={22} strokeWidth={2.2} />
            </div>
            <div className={styles.viewersHeaderText}>
              <h2 id="cad-converters-heading" className={styles.viewersTitle}>
                CAD Converters
              </h2>
              <p className={styles.viewersSubtitle}>
                Convert between CAD formats instantly — no software installs, no file size limits, no waiting.
              </p>
            </div>
          </div>
          <div className={styles.viewersGrid}>
            {CAD_CONVERTER_CARDS.map(({ href, title, description, tags }) => (
              <Link key={href + title} href={href} className={styles.viewerCard}>
                <div className={styles.viewerCardIcon} aria-hidden>
                  <RefreshCw size={22} strokeWidth={2.2} />
                </div>
                <h3 className={styles.viewerCardTitle}>{title}</h3>
                <p className={styles.viewerCardDesc}>{description}</p>
                <div className={styles.viewerTags}>
                  {tags.map((t) => (
                    <span key={t} className={styles.viewerTag}>
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.viewersSection} aria-labelledby="cad-viewers-heading">
        <div className={styles.viewersInner}>
          <div className={styles.viewersHeader}>
            <div className={styles.viewersHeaderIcon} aria-hidden>
              <Eye size={22} strokeWidth={2.2} />
            </div>
            <div className={styles.viewersHeaderText}>
              <h2 id="cad-viewers-heading" className={styles.viewersTitle}>
                CAD Viewers
              </h2>
              <p className={styles.viewersSubtitle}>
                Open and inspect 3D models, meshes, and point clouds — right in your browser with zero
                downloads.
              </p>
            </div>
          </div>
          <div className={styles.viewersGrid}>
            {CAD_VIEWER_CARDS.map(({ href, title, description, tags }) => (
              <Link key={href + title} href={href} className={styles.viewerCard}>
                <div className={styles.viewerCardIcon} aria-hidden>
                  <Box size={22} strokeWidth={2.2} />
                </div>
                <h3 className={styles.viewerCardTitle}>{title}</h3>
                <p className={styles.viewerCardDesc}>{description}</p>
                <div className={styles.viewerTags}>
                  {tags.map((t) => (
                    <span key={t} className={styles.viewerTag}>
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.orgSection} aria-labelledby="org-hierarchy-heading">
        <div className={styles.viewersInner}>
          <div className={styles.viewersHeader}>
            <div className={styles.viewersHeaderIcon} aria-hidden>
              <Network size={22} strokeWidth={2.2} />
            </div>
            <div className={styles.viewersHeaderText}>
              <h2 id="org-hierarchy-heading" className={styles.viewersTitle}>
                Organization Hierarchy
              </h2>
              <p className={styles.viewersSubtitle}>
                Visualize teams, reporting lines, and structure—build org charts in your browser with nothing to
                install.
              </p>
            </div>
          </div>
          <div className={styles.viewersGrid}>
            {ORG_HIERARCHY_CARDS.map(({ href, title, description, tags }) => (
              <Link key={title} href={href} className={styles.viewerCard}>
                <div className={styles.viewerCardIcon} aria-hidden>
                  <Network size={22} strokeWidth={2.2} />
                </div>
                <h3 className={styles.viewerCardTitle}>{title}</h3>
                <p className={styles.viewerCardDesc}>{description}</p>
                <div className={styles.viewerTags}>
                  {tags.map((t) => (
                    <span key={t} className={styles.viewerTag}>
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.lastCtaSection} aria-labelledby="tools-last-cta-heading">
        <div className={styles.lastCtaInner}>
          <h2 id="tools-last-cta-heading" className={styles.lastCtaTitle}>
            Don&apos;t See Your Format?
          </h2>
          <p className={styles.lastCtaDesc}>
            Marathon OS supports 50+ CAD formats. Upload any file and we&apos;ll handle the rest - viewing,
            converting, and sharing.
          </p>
          <div className={styles.lastCtaActions}>
            <Link href="/tools/3D-cad-viewer" className={styles.lastCtaPrimary}>
              Try Marathon OS Free
            </Link>
            <Link href="/cad-services" className={styles.lastCtaSecondary}>
              Need a CAD expert? Hire one →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
