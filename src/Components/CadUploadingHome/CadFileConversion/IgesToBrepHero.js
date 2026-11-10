"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import CadFileConversionContent from "./CadFileConversionContent";
import useConverterPriceDisplay from "@/Components/HomePages/shared/useConverterPriceDisplay";
import { getConverterFaqQuestions, withConverterFaqPrice } from "@/data/cadToolFaqs";
import home from "@/Components/HomePages/HomeLandingNew/HomeHero.module.css";
import styles from "./StepTo3dmHero.module.css";

const OUTPUTS = [
  { id: "STEP", note: "exact · millimetres" },
  { id: "STL", note: "binary mesh · mm" },
  { id: "3MF", note: "one object per part · mm" },
  { id: "OBJ", note: "mesh for rendering" },
  { id: "PLY", note: "binary mesh" },
  { id: "OFF", note: "plain-text mesh" },
  { id: "BREP", note: "exact · Open CASCADE" },
  { id: "3DM", note: "Rhino mesh" },
];

const IGES_ROUTES = [
  ["STEP", true],
  ["STL", false],
  ["3MF", false],
  ["OBJ", false],
  ["PLY", false],
  ["OFF", false],
  ["3DM", false],
];

const OPEN_IN = [
  ["FreeCAD", "Opens BREP"],
  ["CadQuery", "importBrep"],
  ["build123d", "import_brep"],
  ["gmsh", "Opens BREP"],
  ["Salome", "Imports BREP"],
  ["OCCT", "BRepTools::Read"],
];

function RouteArrow() {
  return (
    <span className={styles.arr} aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </span>
  );
}

function FormatPair({ from, to, toCad = false }) {
  return (
    <span className={styles.pair}>
      <span className={`${styles.hubBadge} ${styles.badgeCad}`}>{from}</span>
      <i>→</i>
      <span className={`${styles.hubBadge} ${toCad ? styles.badgeCad : styles.badgeMesh}`}>{to}</span>
    </span>
  );
}

function MoreArrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></svg>
  );
}

function ExactPart({ gradientId, shift = 0 }) {
  return (
    <g transform={shift ? `translate(${shift} 0)` : undefined}>
      <path d="M40 58 V120 A78 24 0 0 0 196 120 V58 Z" fill={`url(#${gradientId})`} />
      <ellipse cx="118" cy="58" rx="78" ry="24" fill="#FBF9FF" />
      <ellipse cx="118" cy="58" rx="24" ry="7.4" fill="#4716B2" />
      <path d="M94 58 A24 7.4 0 0 0 142 58" fill="none" stroke="#8B5CF6" strokeWidth="1.5" />
    </g>
  );
}

function StepViz() {
  return (
    <svg viewBox="0 0 560 200" role="img" aria-labelledby="iges-brep-viz-title">
      <title id="iges-brep-viz-title">The same part as exact IGES geometry and as an exact Open CASCADE BREP</title>
      <defs>
        <linearGradient id="iges-brep-cyl" x1="0" x2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#F1EAFE" />
          <stop offset="0.8" stopColor="#C9B3F7" />
          <stop offset="1" stopColor="#E6DAFD" />
        </linearGradient>
        <linearGradient id="iges-brep-cyl-2" x1="0" x2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#F1EAFE" />
          <stop offset="0.8" stopColor="#C9B3F7" />
          <stop offset="1" stopColor="#E6DAFD" />
        </linearGradient>
      </defs>
      <ExactPart gradientId="iges-brep-cyl" />
      <ExactPart gradientId="iges-brep-cyl-2" shift={324} />
      <g transform="translate(280 92)">
        <circle r="24" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.4)" />
        <path d="M-9 0 H9 M3 -6 L9 0 L3 6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="118" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">IGES</text>
      <text x="118" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">exact surfaces · true circle</text>
      <text x="442" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">BREP</text>
      <text x="442" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">exact B-rep · Open CASCADE</text>
    </svg>
  );
}

export default function IgesToBrepHero() {
  const router = useRouter();
  const { priceLabel } = useConverterPriceDisplay();
  const priceSentence = `First 2 files free, any size up to 300 MB. After that, ${priceLabel ? `${priceLabel} or ` : ""}1 credit per file.`;
  const faqs = withConverterFaqPrice(getConverterFaqQuestions("iges-to-brep"), priceLabel);

  return (
    <>
    <section className={home.hero} aria-labelledby="hero-title">
      <div className={`${home.wrap} ${styles.layout}`}>
        <div className={`${home.copy} ${styles.copy}`}>
          <nav aria-label="Breadcrumb">
            <ol className={styles.crumbs}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/tools">Tools</Link></li>
              <li><Link href="/tools/3d-cad-file-converter">CAD converter</Link></li>
              <li><span aria-current="page">IGES to BREP</span></li>
            </ol>
          </nav>
          <h1 className={home.title} id="hero-title">
            Convert IGES or IGS to BREP <span>online</span>
          </h1>
          <p className={`${home.lede} ${styles.lede}`}>
            Upload an .iges or .igs file and download an Open CASCADE BREP file with the exact geometry, ready for FreeCAD, CadQuery, gmsh or your own OCCT code.{" "}
            <span className={styles.price}>{priceSentence}</span>
          </p>
        </div>

        <div className={`${home.card} ${styles.slot}`} id="cad-file-converter">
          <div className={home.head}>
            <h2>IGES to BREP converter</h2>
            <span className={`${home.secure} ${styles.hideNarrow}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>
              Exact · Open CASCADE
            </span>
          </div>
          <div className={styles.route}>
            <div className={styles.routeCell}>
              <span className={`${styles.badge} ${styles.badgeCad}`}>IGES</span>
              <div>
                <b>From IGES</b>
                <small>.iges or .igs</small>
              </div>
            </div>
            <span className={styles.arrow} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
            <div className={styles.routeCell}>
              <span className={`${styles.badge} ${styles.badgeCad}`}>BREP</span>
              <div className={styles.routeCopy}>
                <label className={home.srOnly} htmlFor="iges-to-brep-output">Convert to</label>
                <select
                  id="iges-to-brep-output"
                  className={styles.select}
                  value="BREP"
                  onChange={(event) => {
                    const next = event.target.value;
                    if (next !== "BREP") router.push(`/tools/convert-iges-to-${next.toLowerCase()}`);
                  }}
                >
                  {OUTPUTS.map((option) => (
                    <option key={option.id} value={option.id}>{option.id}</option>
                  ))}
                </select>
                <small>exact · Open CASCADE</small>
              </div>
            </div>
          </div>
          <CadFileConversionContent convert conversionParams="iges-to-brep" designVariant="step3dmHero" />
          <p className={styles.reverse}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
            <span>Have a BREP file? You can also <Link href="/tools/convert-brep-to-iges">turn BREP files into IGES</Link>.</span>
          </p>
        </div>

        <div className={styles.art}>
          <ul className={`${home.ticks} ${styles.ticks}`} aria-label="Key facts">
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
              Files up to 300 MB
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>
              Exact geometry, no triangles
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>
              Native Open CASCADE format
            </li>
          </ul>
          <figure className={`${home.viz} ${styles.viz}`}><StepViz /></figure>
        </div>
      </div>
    </section>

    <section className={styles.glance} id="at-a-glance" aria-labelledby="glance-title">
      <div className={home.wrap}>
        <h2 id="glance-title" className={home.srOnly}>IGES to BREP converter at a glance</h2>
        <dl className={styles.glanceList}>
          <div>
            <dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>Converts</dt>
            <dd>IGES and IGS (solids and trimmed surfaces) to BREP.</dd>
          </div>
          <div>
            <dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg>You get</dt>
            <dd>One BREP file in Open CASCADE&apos;s native format: the exact shape read from your IGES, coordinates in millimetres. One shape, with no names or colours.</dd>
          </div>
          <div>
            <dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1117.4 0" /></svg>File size</dt>
            <dd>Up to 300 MB. We email you when the file is ready.</dd>
          </div>
          <div>
            <dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.6 13.4 13.4 20.6a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>Price</dt>
            <dd>{priceSentence}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section className={styles.how} id="how-to" aria-labelledby="how-title">
      <div className={home.wrap}>
        <div className={home.sh}>
          <p className={home.eyebrow}>How to convert IGES to BREP</p>
          <h2 className={home.platformTitle} id="how-title">IGES to BREP in <span className={home.grad}>four steps</span></h2>
        </div>
        <div className={styles.answer}>
          <p><b>To convert IGES or IGS to BREP,</b> sign in, upload your .iges or .igs file above and download the BREP file. The geometry stays exact, with no triangles, and tools built on Open CASCADE load it without translating the IGES again. IGS to BREP works the same way.</p>
        </div>
        <ol className={styles.steps}>
          <li>
            <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></svg></span>
            <h3>Upload</h3>
            <p>Sign in, then drop a .iges or .igs file up to 300 MB onto the converter.</p>
          </li>
          <li>
            <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15" /></svg></span>
            <h3>Convert</h3>
            <p>The exact shape is written in Open CASCADE&apos;s native BREP format.</p>
          </li>
          <li>
            <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg></span>
            <h3>Download</h3>
            <p>We email you when the BREP is ready. Download one BREP file.</p>
          </li>
          <li>
            <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1117.4 0" /></svg></span>
            <h3>Load</h3>
            <p>Open it in FreeCAD, CadQuery or gmsh and check the shape.</p>
          </li>
        </ol>
      </div>
    </section>

    <section className={styles.changes} id="what-changes" aria-labelledby="wc-title">
      <div className={home.wrap}>
        <div className={home.sh}>
          <p className={home.eyebrow}>IGES vs BREP</p>
          <h2 className={home.platformTitle} id="wc-title">What changes when IGES becomes BREP</h2>
          <p>Both formats store exact geometry. BREP keeps only the shape.</p>
        </div>
        <div className={styles.keepLose}>
          <article className={styles.keep}>
            <h3>
              <span className={styles.mark} aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg></span>
              What the BREP keeps
            </h3>
            <ul>
              <li>Exact curves and surfaces</li>
              <li>B-rep solids as solids, trimmed surfaces as surfaces</li>
              <li>Every part in its assembled position</li>
              <li>Coordinates in millimetres, with inch files scaled</li>
            </ul>
          </article>
          <article className={styles.lose}>
            <h3>
              <span className={styles.mark} aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg></span>
              What it leaves behind
            </h3>
            <ul>
              <li>Part names, colours and layers</li>
              <li>Any assembly structure (one compound shape)</li>
              <li>Annotations and drawing entities</li>
              <li>The unit label (BREP has no unit field)</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section className={styles.meshNote} id="what-is-brep" aria-labelledby="rs-title">
      <div className={home.wrap}>
        <div className={home.sh}>
          <p className={home.eyebrow}>What a BREP file is for</p>
          <h2 className={home.platformTitle} id="rs-title">Open CASCADE&apos;s own format</h2>
          <p>BREP is how Open CASCADE stores a shape, so OCCT-based tools load it directly.</p>
        </div>
        <div className={styles.choose}>
          <div>
            <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>BREP</span><b>Exact, not meshed</b></span>
            <p>BREP stores the boundary representation Open CASCADE builds when it reads your IGES: surfaces, edges and vertices, no triangles.</p>
          </div>
          <div>
            <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>IGES</span><b>Solids or surfaces, as read</b></span>
            <p>B-rep solids in the IGES are solids in the BREP. Trimmed surfaces stay loose faces: we don&apos;t sew or heal them.</p>
          </div>
          <div>
            <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>BREP</span><b>One shape, millimetres inside</b></span>
            <p>An assembly comes out as one compound shape with every part in place. A BREP file has no unit field; the coordinates are millimetres.</p>
          </div>
        </div>
        <p className={styles.unitNote}>
          <InfoIcon />
          <span>Most commercial CAD programs don&apos;t import Open CASCADE .brep files. To send the model to SolidWorks, Fusion or CATIA users, convert <Link href="/tools/convert-iges-to-step">IGES to STEP</Link> instead. For meshing, gmsh opens .brep directly, so you can mesh the exact geometry for FEA.</span>
        </p>
      </div>
    </section>

    <section className={styles.compareBand} id="compare" aria-labelledby="fmt-title">
      <div className={home.wrap}>
        <div className={home.sh}>
          <p className={home.eyebrow}>Choose the right format</p>
          <h2 className={home.platformTitle} id="fmt-title">IGES vs BREP</h2>
          <p>Pick by what the next program needs.</p>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.formatTable}>
            <caption className={home.srOnly}>IGES, BREP compared</caption>
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col"><span className={`${styles.badge} ${styles.badgeCad}`}>IGES</span></th>
                <th scope="col" className={styles.hl}><span className={`${styles.badge} ${styles.badgeCad}`}>BREP</span></th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">Standard</th><td>IGES 5.3, last updated in 1996</td><td className={styles.hl}>Open CASCADE&apos;s native format</td></tr>
              <tr><th scope="row">Geometry</th><td>Exact curves and surfaces; solids in B-rep mode</td><td className={styles.hl}>Exact solids and surfaces</td></tr>
              <tr><th scope="row">Units</th><td>Stored</td><td className={styles.hl}>Not stored (ours is mm)</td></tr>
              <tr><th scope="row">Names, colours and layers</th><td>Possible</td><td className={styles.hl}>No</td></tr>
              <tr><th scope="row">Opens in</th><td>Most CAD and CAM programs</td><td className={styles.hl}>FreeCAD, CadQuery, gmsh, Salome and other OCCT tools</td></tr>
              <tr><th scope="row">Best for</th><td>CAM and older CAD</td><td className={styles.hl}>Scripts, meshing and OCCT pipelines</td></tr>
            </tbody>
          </table>
        </div>
        <div className={styles.choose}>
          <div>
            <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>BREP</span><b>Convert to BREP when</b></span>
            <p>The model is going into FreeCAD, CadQuery, build123d, gmsh or your own Open CASCADE code.</p>
            <span className={styles.more}>You&apos;re in the right place</span>
          </div>
          <Link href="/tools/convert-iges-to-step" aria-label="IGES to STEP for CAD">
            <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>STEP</span><b>Choose STEP when</b></span>
            <p>The model is going to another CAD program or a supplier.</p>
            <span className={styles.more}>IGES to STEP for CAD <MoreArrow /></span>
          </Link>
          <Link href="/tools/convert-iges-to-stl" aria-label="IGES to STL for printing">
            <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span><b>Choose STL when</b></span>
            <p>You need a mesh for printing rather than exact geometry.</p>
            <span className={styles.more}>IGES to STL for printing <MoreArrow /></span>
          </Link>
        </div>
      </div>
    </section>

    <section className={styles.openBand} id="open-in" aria-labelledby="open-title">
      <div className={home.wrap}>
        <div className={styles.splitHead}>
          <div>
            <p className={home.eyebrow}>Open it anywhere</p>
            <h2 className={home.platformTitle} id="open-title">Where BREP files open</h2>
          </div>
          <p>Any tool built on Open CASCADE reads BREP.</p>
        </div>
        <div className={`${styles.apps} ${styles.slicers}`}>
          {OPEN_IN.map(([name, note]) => (
            <div key={name}><b>{name}</b><span className={styles.yes}>{note}</span></div>
          ))}
        </div>
        <p className={styles.unitNote}>
          <InfoIcon />
          <span>In Python, CadQuery&apos;s importBrep and build123d&apos;s import_brep load the file in one line. In C++, BRepTools::Read does the same.</span>
        </p>
      </div>
    </section>

    <section className={styles.relatedBand} id="related" aria-labelledby="rel-title">
      <div className={home.wrap}>
        <div className={styles.splitHead}>
          <div>
            <p className={home.eyebrow}>Related conversions</p>
            <h2 className={home.platformTitle} id="rel-title">More IGES and BREP tools</h2>
          </div>
          <Link className={styles.more} href="/tools/3d-cad-file-converter">
            All 74 conversion routes
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
        <p className={styles.reverseNote}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
          <span>Going the other way? You can also <Link href="/tools/convert-brep-to-iges">turn BREP files into IGES</Link>. The geometry stays exact.</span>
        </p>
        <div className={styles.hub}>
          <div className={styles.hubCard}>
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>
              Convert IGES to…
            </h3>
            <div className={styles.hubLinks}>
              {IGES_ROUTES.map(([to, toCad]) => (
                <Link key={to} href={`/tools/convert-iges-to-${to.toLowerCase()}`} aria-label={`IGES to ${to}`}>
                  <FormatPair from="IGES" to={to} toCad={toCad} />
                  <RouteArrow />
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.hubCard}>
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>
              Also converting to BREP?
            </h3>
            <div className={`${styles.hubLinks} ${styles.hubStack}`}>
              <Link href="/tools/convert-step-to-brep">
                <FormatPair from="STEP" to="BREP" toCad />
                <span className={styles.sib}>STEP files to BREP</span>
                <RouteArrow />
              </Link>
              <Link href="/tools/3d-cad-file-converter">
                <b className={styles.allRoutes}>All routes</b>
                <RouteArrow />
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.hubTools}>
          <Link href="/tools/iges-file-viewer">
            <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg></span>
            Free IGES viewer
          </Link>
          <Link href="/tools/brep-file-viewer">
            <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg></span>
            Free BREP viewer
          </Link>
          <Link href="/tools/3d-cad-viewer">
            <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg></span>
            3D CAD viewer
          </Link>
          <Link href="/cad-services">
            <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" /></svg></span>
            Hire a CAD designer
          </Link>
        </div>
      </div>
    </section>

    <section className={styles.faqBand} id="faq" aria-labelledby="faq-title">
      <div className={`${home.wrap} ${styles.faqGrid}`}>
        <div className={styles.faqSide}>
          <p className={home.eyebrow}>FAQ</p>
          <h2 className={home.platformTitle} id="faq-title">IGES to BREP questions</h2>
          <p>The format, solids or surfaces, units, meshing, pricing and your files.</p>
          <Link className={styles.ghostBtn} href="/contact-us">Contact us</Link>
          <small className={styles.faqUpdated}>Last updated 6 November 2026</small>
        </div>
        <div className={styles.faqList}>
          {faqs.map((item, index) => (
            <details key={item.question} className={styles.acc} open={index === 0}>
              <summary>{item.question}</summary>
              <div className={styles.accBody}>
                {item.question === "Are my IGES files private?" ? (
                  <p>
                    {item.answer.replace(" Privacy Policy.", "")}{" "}
                    <Link href="/privacy-policy">Privacy Policy</Link>.
                  </p>
                ) : (
                  <p>{item.answer}</p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>

    <section className={styles.closeBand} aria-labelledby="cta-title">
      <div className={home.wrap}>
        <div className={styles.cta}>
          <h2 id="cta-title">Convert your IGES file to BREP</h2>
          <p>An exact Open CASCADE BREP, ready for FreeCAD, CadQuery and gmsh. {priceSentence}</p>
          <div className={styles.ctaBtns}>
            <a className={styles.ctaLight} href="#cad-file-converter">Convert IGES to BREP</a>
            <Link className={styles.ctaOutline} href="/tools/3d-cad-file-converter">See all converters</Link>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
