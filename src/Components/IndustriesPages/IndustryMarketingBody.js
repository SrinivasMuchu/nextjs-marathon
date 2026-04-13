import React from 'react';
import Link from 'next/link';
import {
  MdOutlinePrecisionManufacturing,
  MdOutlineAccountTree,
  MdOutlineViewInAr,
  MdOutlineCategory,
  MdOutlinePolyline,
  MdOutlineGroups,
  MdOutlinePersonSearch,
  MdOutlineShield,
  MdOutlineBolt,
  MdOutlineLayers,
  MdOutlineSpeed,
  MdOutlineVerifiedUser,
} from 'react-icons/md';
import styles from './IndustryMarketingSections.module.css';
import { getIndustryExploreLinks } from '@/data/industryExploreLinks';

const FORMAT_CARDS = [
  {
    title: 'STEP files',
    description:
      'Used for exchanging precise 3D engineering geometry and assemblies across tools and suppliers.',
    Icon: MdOutlinePrecisionManufacturing,
  },
  {
    title: 'IGES files',
    description:
      'Common for surface and geometry exchange when teams collaborate across different CAD systems.',
    Icon: MdOutlineAccountTree,
  },
  {
    title: 'STL files',
    description:
      'Useful for mesh-based previews and review workflows (especially prototyping and fabrication contexts).',
    Icon: MdOutlineViewInAr,
  },
  {
    title: 'BREP files',
    description:
      'Helpful for inspecting boundary-representation solids and engineering geometry online.',
    Icon: MdOutlineCategory,
  },
  {
    title: 'PLY and OFF files',
    description:
      'Useful for polygon-based model inspection and technical visualization workflows.',
    Icon: MdOutlinePolyline,
  },
];

/** Section 8 — card grid (aligned like “Why Choose” feature cards). */
const WHY_CHOOSE_CARDS = [
  {
    title: 'No installation required',
    description: 'No software installation required (review in browser)',
    Icon: MdOutlineBolt,
  },
  {
    title: 'Supports multiple formats',
    description:
      'Supports common exchange formats (STEP/IGES) plus mesh formats (STL/PLY/OFF) and solids (BREP)',
    Icon: MdOutlineLayers,
  },
  {
    title: 'Fast online preview',
    description: 'Fast online preview for technical review discussions',
    Icon: MdOutlineSpeed,
  },
  {
    title: 'Cloud-based & secure',
    description: 'Private uploads with automatic 24-hour deletion',
    Icon: MdOutlineVerifiedUser,
  },
  {
    title: 'Built for your workflow',
    description: 'Better access for non-CAD stakeholders across the workflow',
    Icon: MdOutlineGroups,
  },
];

function splitRoles(csv, fallback) {
  if (!csv || typeof csv !== 'string') return fallback;
  const parts = csv.split(',').map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts.join(', ') : fallback;
}

/**
 * Sections 1, 2, 3, 4, 6, 7, 8 — industry CAD viewer marketing copy (dynamic industry + API roles where available).
 */
function IndustryMarketingBody({ industryData }) {
  const industry = (industryData?.industry || 'your industry').trim();
  const industryLower = industry.toLowerCase();
  const route = industryData?.route || '';

  const whoDaily = splitRoles(
    industryData?.roles_view_cad_files,
    'Mechanical Engineers, CAD Designers, Simulation Analysts'
  );
  const whoLimited = splitRoles(
    industryData?.limited_cad_access,
    'Sales Engineers, Procurement Managers, Field Technicians'
  );

  const { primary: explorePrimary, secondary: exploreSecondary } = getIndustryExploreLinks(
    route,
    industry
  );

  return (
    <>
      {/* Section 1 */}
      <section className={styles.blockAlt} aria-labelledby="industry-s1-heading">
        <div className={styles.inner}>
          <h2 id="industry-s1-heading" className={styles.h2}>
            How {industryLower} teams use CAD viewers for design review
          </h2>
          <p className={styles.body}>
            In {industryLower}, teams use CAD viewers to inspect models, validate interfaces, and align
            stakeholders during reviews and handoffs. A browser-based viewer makes it easier to open files
            quickly, inspect geometry, and keep discussions anchored to the same 3D model—without
            specialized desktop setups.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className={styles.blockWhite} aria-labelledby="industry-s2-heading">
        <div className={styles.innerWide}>
          <h2 id="industry-s2-heading" className={styles.h2}>
            What file formats are supported?
          </h2>
          <p className={styles.lead}>
            Marathon OS supports common 3D exchange formats used across industry workflows, including
            STEP, IGES, STL, PLY, OFF, and BREP. These formats help teams share engineering geometry and
            meshes across different tools while keeping reviews fast and accessible.
          </p>
          <div className={styles.formatGrid}>
            {FORMAT_CARDS.map(({ title, description, Icon }) => (
              <div key={title} className={styles.formatCard}>
                <div className={styles.formatIcon} aria-hidden>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className={styles.formatTitle}>{title}</h3>
                  <p className={styles.formatDesc}>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className={styles.blockAlt} aria-labelledby="industry-s3-heading">
        <div className={styles.inner}>
          <h2 id="industry-s3-heading" className={styles.h2}>
            Can non-CAD stakeholders access 3D models without a CAD license?
          </h2>
          <p className={styles.lead}>
            Yes. Not every stakeholder needs a full CAD seat, but many still need visibility for reviews,
            procurement, QA, operations, or field work. Marathon OS gives non-CAD roles a simpler way to
            open and inspect models in a browser, reducing reliance on screenshots, PDFs, and
            intermediaries.
          </p>
          <div className={styles.roleGrid}>
            <div className={styles.roleCard}>
              <div className={styles.roleCardHead}>
                <MdOutlineGroups className={styles.roleCardIcon} size={22} aria-hidden />
                Who uses CAD daily
              </div>
              <p className={styles.roleCardBody}>{whoDaily}</p>
            </div>
            <div className={styles.roleCard}>
              <div className={styles.roleCardHead}>
                <MdOutlinePersonSearch className={styles.roleCardIcon} size={22} aria-hidden />
                Often needs CAD access (without full CAD tools)
              </div>
              <p className={styles.roleCardBody}>{whoLimited}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section className={styles.blockWhite} aria-labelledby="industry-s4-heading">
        <div className={styles.inner}>
          <h2 id="industry-s4-heading" className={styles.h2}>
            How teams review CAD files without heavy desktop software
          </h2>
          <p className={styles.body}>
            Instead of routing every model through a CAD specialist or dedicated workstation, teams can
            upload files to Marathon OS and preview them online. This keeps cross-functional reviews moving
            and reduces delays caused by software installs, license access, or high-performance hardware
            requirements.
          </p>
        </div>
      </section>

      {/* Section 6 */}
      <section className={styles.blockAlt} aria-labelledby="industry-s6-heading">
        <div className={styles.inner}>
          <h2 id="industry-s6-heading" className={styles.h2}>
            Security and access control
          </h2>
          <div className={styles.securityRow}>
            <MdOutlineShield className={styles.securityIcon} size={28} aria-hidden />
            <p className={styles.body}>
              Many industry CAD files contain sensitive IP. Marathon OS keeps uploads private and
              automatically deletes uploaded files after 24 hours. That makes it practical for quick review
              when teams want lower friction and tighter handling of shared models.
            </p>
          </div>
        </div>
      </section>

      {/* Section 7 */}
      <section className={styles.blockWhite} aria-labelledby="industry-s7-heading">
        <div className={styles.innerWide}>
          <h2 id="industry-s7-heading" className={styles.h2}>
            Explore {industry} components in 3D
          </h2>
          <p className={styles.lead}>
            Browse the design library with descriptive links—each opens the Marathon OS library where you
            can discover models and open them in the browser viewer.
          </p>
          <div className={styles.exploreGrid}>
            {explorePrimary.map((item) => (
              <Link key={item.label} href={item.href} className={styles.exploreLink}>
                <p className={styles.exploreLinkTitle}>{item.title}</p>
                <p className={styles.exploreLinkLabel}>{item.label} →</p>
              </Link>
            ))}
          </div>
          {exploreSecondary.length > 0 ? (
            <div className={styles.secondaryChips} aria-label="More component topics">
              {exploreSecondary.map((name) => (
                <span key={name} className={styles.chip}>
                  {name}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Section 8 — centered feature cards (matches “Why Choose” grid layout) */}
      <section className={styles.blockAlt} aria-labelledby="industry-s8-heading">
        <div className={styles.innerWide}>
          <h2 id="industry-s8-heading" className={styles.h2}>
            Why teams choose Marathon OS
          </h2>
          <div className={styles.whyChooseGrid}>
            {WHY_CHOOSE_CARDS.map(({ title, description, Icon }) => (
              <div key={title} className={styles.whyChooseCard}>
                <div className={styles.whyChooseIconWrap}>
                  <Icon className={styles.whyChooseIcon} size={24} aria-hidden />
                </div>
                <h3 className={styles.whyChooseCardTitle}>{title}</h3>
                <p className={styles.whyChooseCardDesc}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default IndustryMarketingBody;
