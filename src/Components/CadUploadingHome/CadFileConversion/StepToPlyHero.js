"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import CadFileConversionContent from "./CadFileConversionContent";
import useConverterPriceDisplay from "@/Components/HomePages/shared/useConverterPriceDisplay";
import { getConverterFaqQuestions, withConverterFaqPrice } from "@/data/cadToolFaqs";
import home from "@/Components/HomePages/HomeLandingNew/HomeHero.module.css";
import styles from "./StepTo3dmHero.module.css";

const OUTPUTS = [
  { id: "STL", note: "binary · millimetres" },
  { id: "3MF", note: "one object per part · mm" },
  { id: "OBJ", note: "mesh for rendering" },
  { id: "PLY", note: "binary mesh" },
  { id: "OFF", note: "plain-text mesh" },
  { id: "IGES", note: "exact · millimetres" },
  { id: "BREP", note: "exact · Open CASCADE" },
  { id: "3DM", note: "Rhino mesh" },
];

const STEP_ROUTES = [
  ["STL", false],
  ["3MF", false],
  ["OBJ", false],
  ["OFF", false],
  ["IGES", true],
  ["BREP", true],
  ["3DM", false],
];

const OPEN_IN = [
  ["MeshLab", "Opens PLY"],
  ["CloudCompare", "Opens PLY"],
  ["Open3D", "Reads PLY"],
  ["Blender", "Imports PLY"],
  ["PCL", "Reads PLY"],
  ["trimesh", "Reads PLY"],
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

function StepViz() {
  return (
    <svg viewBox="0 0 560 200" role="img" aria-labelledby="step-ply-viz-title">
      <title id="step-ply-viz-title">The same part as an exact STEP solid and as a PLY triangle mesh</title>
      <defs>
        <linearGradient id="step-ply-cyl" x1="0" x2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#F1EAFE" />
          <stop offset="0.8" stopColor="#C9B3F7" />
          <stop offset="1" stopColor="#E6DAFD" />
        </linearGradient>
      </defs>
      <path d="M40 58 V120 A78 24 0 0 0 196 120 V58 Z" fill="url(#step-ply-cyl)" />
      <ellipse cx="118" cy="58" rx="78" ry="24" fill="#FBF9FF" />
      <ellipse cx="118" cy="58" rx="24" ry="7.4" fill="#4716B2" />
      <path d="M94 58 A24 7.4 0 0 0 142 58" fill="none" stroke="#8B5CF6" strokeWidth="1.5" />
      <g stroke="#6A2BE0" strokeOpacity="0.45" strokeWidth="0.9">
        <polygon points="520,58 514,67 514,129 520,120" fill="#D0BDFA" />
        <polygon points="514,67 497,75 497,137 514,129" fill="#D9C9FB" />
        <polygon points="497,75 472,80 472,142 497,137" fill="#E3D8FC" />
        <polygon points="472,80 442,82 442,144 472,142" fill="#EEE7FD" />
        <polygon points="442,82 412,80 412,142 442,144" fill="#F7F4FE" />
        <polygon points="412,80 387,75 387,137 412,142" fill="#FEFEFE" />
        <polygon points="387,75 370,67 370,129 387,137" fill="#FFFFFF" />
        <polygon points="370,67 364,58 364,120 370,129" fill="#FFFFFF" />
      </g>
      <polygon points="520,58 514,67 497,75 472,80 442,82 412,80 387,75 370,67 364,58 370,49 387,41 412,36 442,34 472,36 497,41 514,49" fill="#FBF9FF" stroke="#6A2BE0" strokeOpacity="0.45" strokeWidth="0.9" />
      <polygon points="466,58 459,63 442,65 425,63 418,58 425,53 442,51 459,53" fill="#4716B2" />
      <g transform="translate(280 92)">
        <circle r="24" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.4)" />
        <path d="M-9 0 H9 M3 -6 L9 0 L3 6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="118" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">STEP</text>
      <text x="118" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">exact B-rep · true circle</text>
      <text x="442" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">PLY</text>
      <text x="442" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">triangle mesh · binary</text>
    </svg>
  );
}

export default function StepToPlyHero() {
  const router = useRouter();
  const { priceLabel } = useConverterPriceDisplay();
  const priceSentence = `First 2 files free, any size up to 300 MB. After that, ${priceLabel ? `${priceLabel} or ` : ""}1 credit per file.`;
  const faqs = withConverterFaqPrice(getConverterFaqQuestions("step-to-ply"), priceLabel);

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
              <li><span aria-current="page">STEP to PLY</span></li>
            </ol>
          </nav>
          <h1 className={home.title} id="hero-title">
            Convert STEP or STP to PLY <span>online</span>
          </h1>
          <p className={`${home.lede} ${styles.lede}`}>
            Upload a .step or .stp file and download one binary PLY mesh in millimetres, ready for MeshLab, CloudCompare or Open3D.{" "}
            <span className={styles.price}>{priceSentence}</span>
          </p>
        </div>

        <div className={`${home.card} ${styles.slot}`} id="cad-file-converter">
          <div className={home.head}>
            <h2>STEP to PLY converter</h2>
            <span className={`${home.secure} ${styles.hideNarrow}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
              Binary .ply
            </span>
          </div>
          <div className={styles.route}>
            <div className={styles.routeCell}>
              <span className={`${styles.badge} ${styles.badgeCad}`}>STEP</span>
              <div>
                <b>From STEP</b>
                <small>.step or .stp</small>
              </div>
            </div>
            <span className={styles.arrow} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
            <div className={styles.routeCell}>
              <span className={`${styles.badge} ${styles.badgeMesh}`}>PLY</span>
              <div className={styles.routeCopy}>
                <label className={home.srOnly} htmlFor="step-to-ply-output">Convert to</label>
                <select
                  id="step-to-ply-output"
                  className={styles.select}
                  value="PLY"
                  onChange={(event) => {
                    const next = event.target.value;
                    if (next !== "PLY") router.push(`/tools/convert-step-to-${next.toLowerCase()}`);
                  }}
                >
                  {OUTPUTS.map((option) => (
                    <option key={option.id} value={option.id}>{option.id}</option>
                  ))}
                </select>
                <small>binary mesh</small>
              </div>
            </div>
          </div>
          <CadFileConversionContent convert conversionParams="step-to-ply" designVariant="step3dmHero" />
          <p className={styles.reverse}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
            <span>Starting from a PLY? We also convert in <Link href="/tools/convert-ply-to-step">the reverse direction (PLY → STEP)</Link>.</span>
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
              Binary PLY in millimetres
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 3 8v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8M3 16l9-8 9 8" /></svg>
              Opens in MeshLab and CloudCompare
            </li>
          </ul>
          <figure className={`${home.viz} ${styles.viz}`}><StepViz /></figure>
        </div>
      </div>
    </section>

    <section className={styles.glance} id="at-a-glance" aria-labelledby="glance-title">
      <div className={home.wrap}>
        <h2 id="glance-title" className={home.srOnly}>STEP to PLY converter at a glance</h2>
        <dl className={styles.glanceList}>
          <div>
            <dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>Converts</dt>
            <dd>STEP and STP (AP203, AP214, AP242) to PLY.</dd>
          </div>
          <div>
            <dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg>You get</dt>
            <dd>One binary PLY file (little-endian): a single triangle mesh in millimetres, meshed at a 0.15 mm chord tolerance. No colours.</dd>
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
          <p className={home.eyebrow}>How to convert STEP to PLY</p>
          <h2 className={home.platformTitle} id="how-title">STEP to PLY in <span className={home.grad}>four steps</span></h2>
        </div>
        <div className={styles.answer}>
          <p><b>To convert STEP or STP to PLY,</b> sign in, upload your .step or .stp file above and download the .ply. You get one binary triangle mesh in millimetres that MeshLab, CloudCompare, Open3D and Blender open. STP to PLY works the same way.</p>
        </div>
        <ol className={styles.steps}>
          <li>
            <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></svg></span>
            <h3>Upload</h3>
            <p>Sign in, then drop a .step or .stp file up to 300 MB onto the converter.</p>
          </li>
          <li>
            <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 3 8v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8M3 16l9-8 9 8" /></svg></span>
            <h3>Convert</h3>
            <p>Every face is meshed into triangles at a 0.15 mm chord tolerance.</p>
          </li>
          <li>
            <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg></span>
            <h3>Download</h3>
            <p>We email you when the PLY is ready. Download one binary .ply.</p>
          </li>
          <li>
            <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1117.4 0" /></svg></span>
            <h3>Check</h3>
            <p>Open it in MeshLab or CloudCompare and measure one known dimension.</p>
          </li>
        </ol>
      </div>
    </section>

    <section className={styles.changes} id="what-changes" aria-labelledby="wc-title">
      <div className={home.wrap}>
        <div className={home.sh}>
          <p className={home.eyebrow}>STEP vs PLY</p>
          <h2 className={home.platformTitle} id="wc-title">What changes when STEP becomes PLY</h2>
          <p>STEP stores exact CAD geometry. PLY stores vertices and faces.</p>
        </div>
        <div className={styles.keepLose}>
          <article className={styles.keep}>
            <h3>
              <span className={styles.mark} aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg></span>
              What the PLY keeps
            </h3>
            <ul>
              <li>The outer shape of every solid</li>
              <li>Every part in its assembled position</li>
              <li>Coordinates in millimetres</li>
              <li>Vertices and triangle faces, in compact binary</li>
            </ul>
          </article>
          <article className={styles.lose}>
            <h3>
              <span className={styles.mark} aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg></span>
              What it leaves behind
            </h3>
            <ul>
              <li>Exact curves, which become flat facets</li>
              <li>Feature history, sketches and constraints</li>
              <li>Part names and the assembly tree</li>
              <li>Colours (no per-vertex colour is written)</li>
              <li>The unit label (PLY has no unit field)</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section className={styles.meshNote} id="triangles" aria-labelledby="rs-title">
      <div className={home.wrap}>
        <div className={home.sh}>
          <p className={home.eyebrow}>Mesh quality</p>
          <h2 className={home.platformTitle} id="rs-title">How curves become triangles</h2>
          <p>PLY stores flat triangles, so every curve becomes a chain of short straight edges.</p>
        </div>
        <div className={styles.tess}>
          <div className={styles.tessViz} role="img" aria-label="A circle drawn with 8, about 26 and 64 flat segments, compared with the true curve">
            <figure>
              <svg viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="52" fill="none" stroke="#CDB8FA" strokeWidth="1.6" strokeDasharray="3 4" /><g stroke="#A57BFF" strokeWidth="0.7" strokeOpacity="0.6"><line x1="70" y1="70" x2="70" y2="18" /><line x1="70" y1="70" x2="106.8" y2="33.2" /><line x1="70" y1="70" x2="122" y2="70" /><line x1="70" y1="70" x2="106.8" y2="106.8" /><line x1="70" y1="70" x2="70" y2="122" /><line x1="70" y1="70" x2="33.2" y2="106.8" /><line x1="70" y1="70" x2="18" y2="70" /><line x1="70" y1="70" x2="33.2" y2="33.2" /></g><polygon points="70,18 106.8,33.2 122,70 106.8,106.8 70,122 33.2,106.8 18,70 33.2,33.2" fill="#F1EAFE" fillOpacity="0.55" stroke="#6A2BE0" strokeWidth="2" strokeLinejoin="round" /></svg>
              <figcaption>8 segments<small>very loose tolerance</small></figcaption>
            </figure>
            <figure>
              <svg viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="52" fill="none" stroke="#CDB8FA" strokeWidth="1.6" strokeDasharray="3 4" /><polygon points="70,18 82.4,19.5 94.2,24 104.5,31.1 112.8,40.5 118.6,51.6 121.6,63.7 121.6,76.3 118.6,88.4 112.8,99.5 104.5,108.9 94.2,116 82.4,120.5 70,122 57.6,120.5 45.8,116 35.5,108.9 27.2,99.5 21.4,88.4 18.4,76.3 18.4,63.7 21.4,51.6 27.2,40.5 35.5,31.1 45.8,24 57.6,19.5" fill="#F1EAFE" fillOpacity="0.55" stroke="#6A2BE0" strokeWidth="2" strokeLinejoin="round" /></svg>
              <figcaption>About 26 segments<small>a hole on a NIST test part at our setting</small></figcaption>
            </figure>
            <figure>
              <svg viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="52" fill="none" stroke="#CDB8FA" strokeWidth="1.6" strokeDasharray="3 4" /><polygon points="70,18 75.1,18.3 80.1,19 85.1,20.2 89.9,22 94.5,24.1 98.9,26.8 103,29.8 106.8,33.2 110.2,37 113.2,41.1 115.9,45.5 118,50.1 119.8,54.9 121,59.9 121.7,64.9 122,70 121.7,75.1 121,80.1 119.8,85.1 118,89.9 115.9,94.5 113.2,98.9 110.2,103 106.8,106.8 103,110.2 98.9,113.2 94.5,115.9 89.9,118 85.1,119.8 80.1,121 75.1,121.7 70,122 64.9,121.7 59.9,121 54.9,119.8 50.1,118 45.5,115.9 41.1,113.2 37,110.2 33.2,106.8 29.8,103 26.8,98.9 24.1,94.5 22,89.9 20.2,85.1 19,80.1 18.3,75.1 18,70 18.3,64.9 19,59.9 20.2,54.9 22,50.1 24.1,45.5 26.8,41.1 29.8,37 33.2,33.2 37,29.8 41.1,26.8 45.5,24.1 50.1,22 54.9,20.2 59.9,19 64.9,18.3" fill="#F1EAFE" fillOpacity="0.55" stroke="#6A2BE0" strokeWidth="2" strokeLinejoin="round" /></svg>
              <figcaption>64 segments<small>fine CAD export</small></figcaption>
            </figure>
          </div>
          <div>
            <h3>One setting for every file</h3>
            <p>We mesh every STEP at a <b>0.15 mm chord tolerance</b> and about <b>29°</b> between neighbouring triangles, the same setting we use for STL. There are no quality presets. A part that won&apos;t mesh at that setting is re-meshed slightly coarser.</p>
            <div className={styles.terms}>
              <div className={styles.term}>
                <svg viewBox="0 0 120 70" aria-hidden="true"><path d="M10 62 A72 72 0 0 1 110 62" fill="none" stroke="#6A2BE0" strokeWidth="2.2" /><line x1="10" y1="62" x2="110" y2="62" stroke="#2B4C9B" strokeWidth="2.2" /><line x1="60" y1="62" x2="60" y2="43" stroke="#1E7A3B" strokeWidth="1.8" strokeDasharray="3 2" /><path d="M56 47 L60 42 L64 47" fill="none" stroke="#1E7A3B" strokeWidth="1.6" /><circle cx="10" cy="62" r="2.6" fill="#2B4C9B" /><circle cx="110" cy="62" r="2.6" fill="#2B4C9B" /></svg>
                <div><b>Chord tolerance</b><span>The largest gap between the true surface and a triangle.</span></div>
              </div>
              <div className={styles.term}>
                <svg viewBox="0 0 120 70" aria-hidden="true"><polyline points="8,62 60,30 112,62" fill="none" stroke="#2B4C9B" strokeWidth="2.2" strokeLinejoin="round" /><line x1="60" y1="30" x2="100" y2="5.4" stroke="#6B6680" strokeWidth="1.4" strokeDasharray="3 3" /><path d="M84 15.2 A28 28 0 0 1 84 44.8" fill="none" stroke="#1E7A3B" strokeWidth="1.8" /><circle cx="60" cy="30" r="2.6" fill="#2B4C9B" /></svg>
                <div><b>Angular tolerance</b><span>The largest bend between neighbouring triangles. Keeps small holes round.</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.fixes}>
          <div>
            <b>Compare CAD with a scan</b>
            <span>Load the PLY and your scan in CloudCompare, align them and compute cloud-to-mesh distances.</span>
          </div>
          <div>
            <b>Need ASCII PLY?</b>
            <span>Open the binary PLY in MeshLab and export it with Binary encoding turned off.</span>
          </div>
          <div>
            <b>Need points, not a mesh?</b>
            <span>Sample points on the mesh in CloudCompare or MeshLab.</span>
          </div>
        </div>
      </div>
    </section>

    <section className={styles.compareBand} id="compare" aria-labelledby="fmt-title">
      <div className={home.wrap}>
        <div className={home.sh}>
          <p className={home.eyebrow}>Choose the right format</p>
          <h2 className={home.platformTitle} id="fmt-title">STEP vs PLY vs STL</h2>
          <p>Pick by what the next program needs.</p>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.formatTable}>
            <caption className={home.srOnly}>STEP, PLY, STL compared</caption>
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col"><span className={`${styles.badge} ${styles.badgeCad}`}>STEP</span></th>
                <th scope="col" className={styles.hl}><span className={`${styles.badge} ${styles.badgeMesh}`}>PLY</span></th>
                <th scope="col"><span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span></th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">Geometry</th><td>Exact surfaces and solids</td><td className={styles.hl}>Vertices and faces</td><td>Triangles only</td></tr>
              <tr><th scope="row">Units</th><td>Stored</td><td className={styles.hl}>Not stored (ours is mm)</td><td>Not stored</td></tr>
              <tr><th scope="row">Colour</th><td>Colours</td><td className={styles.hl}>Per-vertex colour possible (ours has none)</td><td>None</td></tr>
              <tr><th scope="row">Storage</th><td>Text</td><td className={styles.hl}>Binary or ASCII (ours is binary)</td><td>Binary or ASCII</td></tr>
              <tr><th scope="row">Best for</th><td>Design, CNC and suppliers</td><td className={styles.hl}>Scans, point clouds and research</td><td>3D printing</td></tr>
            </tbody>
          </table>
        </div>
        <div className={styles.choose}>
          <div>
            <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>PLY</span><b>Convert to PLY when</b></span>
            <p>The model is going into MeshLab, CloudCompare, Open3D or a scan-comparison workflow.</p>
            <span className={styles.more}>You&apos;re in the right place</span>
          </div>
          <Link href="/tools/step-file-viewer" aria-label="Open the STEP viewer">
            <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>STEP</span><b>Keep STEP when</b></span>
            <p>The part will be machined, edited or quoted from exact CAD geometry.</p>
            <span className={styles.more}>Open the STEP viewer <MoreArrow /></span>
          </Link>
          <Link href="/tools/convert-step-to-obj" aria-label="STEP to OBJ for rendering">
            <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>OBJ</span><b>Choose OBJ when</b></span>
            <p>The model is going into a renderer or game engine.</p>
            <span className={styles.more}>STEP to OBJ for rendering <MoreArrow /></span>
          </Link>
        </div>
      </div>
    </section>

    <section className={styles.openBand} id="open-in" aria-labelledby="open-title">
      <div className={home.wrap}>
        <div className={styles.splitHead}>
          <div>
            <p className={home.eyebrow}>Open it anywhere</p>
            <h2 className={home.platformTitle} id="open-title">Ready for mesh and scan tools</h2>
          </div>
          <p>PLY is the common format for scan and point-cloud software.</p>
        </div>
        <div className={`${styles.apps} ${styles.slicers}`}>
          {OPEN_IN.map(([name, note]) => (
            <div key={name}><b>{name}</b><span className={styles.yes}>{note}</span></div>
          ))}
        </div>
        <p className={styles.unitNote}>
          <InfoIcon />
          <span>Our PLY is binary little-endian, with vertex positions and triangles and no colours or normals. Coordinates are in millimetres.</span>
        </p>
      </div>
    </section>

    <section className={styles.relatedBand} id="related" aria-labelledby="rel-title">
      <div className={home.wrap}>
        <div className={styles.splitHead}>
          <div>
            <p className={home.eyebrow}>Related conversions</p>
            <h2 className={home.platformTitle} id="rel-title">More STEP and PLY tools</h2>
          </div>
          <Link className={styles.more} href="/tools/3d-cad-file-converter">
            All 74 conversion routes
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
        <p className={styles.reverseNote}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
          <span>Going the other way? We also convert in <Link href="/tools/convert-ply-to-step">the reverse direction (PLY → STEP)</Link>. It rebuilds a STEP file from the mesh, with flat areas merged into single faces. Curved areas may stay faceted, and there&apos;s no feature tree.</span>
        </p>
        <div className={styles.hub}>
          <div className={styles.hubCard}>
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>
              Convert STEP to…
            </h3>
            <div className={styles.hubLinks}>
              {STEP_ROUTES.map(([to, toCad]) => (
                <Link key={to} href={`/tools/convert-step-to-${to.toLowerCase()}`} aria-label={`STEP to ${to}`}>
                  <FormatPair from="STEP" to={to} toCad={toCad} />
                  <RouteArrow />
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.hubCard}>
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 3 8v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8M3 16l9-8 9 8" /></svg>
              Also converting to PLY?
            </h3>
            <div className={`${styles.hubLinks} ${styles.hubStack}`}>
              <Link href="/tools/convert-iges-to-ply">
                <FormatPair from="IGES" to="PLY" />
                <span className={styles.sib}>IGES surfaces to PLY</span>
                <RouteArrow />
              </Link>
              <Link href="/tools/convert-brep-to-ply">
                <FormatPair from="BREP" to="PLY" />
                <span className={styles.sib}>BREP solids to PLY</span>
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
          <Link href="/tools/step-file-viewer">
            <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg></span>
            Free STEP viewer
          </Link>
          <Link href="/tools/ply-file-viewer">
            <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg></span>
            Free PLY viewer
          </Link>
          <Link href="/tools/step-bom-extractor">
            <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg></span>
            STEP BOM extractor
          </Link>
          <Link href="/tools/convert-step-to-2d-drawing">
            <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M7 15h4v-4H7zM14 8h3M14 12h3M14 16h3" /></svg></span>
            STEP to 2D drawing
          </Link>
        </div>
      </div>
    </section>

    <section className={styles.faqBand} id="faq" aria-labelledby="faq-title">
      <div className={`${home.wrap} ${styles.faqGrid}`}>
        <div className={styles.faqSide}>
          <p className={home.eyebrow}>FAQ</p>
          <h2 className={home.platformTitle} id="faq-title">STEP to PLY questions</h2>
          <p>Binary or ASCII, scans, units, mesh quality, pricing and your files.</p>
          <Link className={styles.ghostBtn} href="/contact-us">Contact us</Link>
          <small className={styles.faqUpdated}>Last updated 6 November 2026</small>
        </div>
        <div className={styles.faqList}>
          {faqs.map((item, index) => (
            <details key={item.question} className={styles.acc} open={index === 0}>
              <summary>{item.question}</summary>
              <div className={styles.accBody}>
                {item.question === "Are my STEP files private?" ? (
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
          <h2 id="cta-title">Convert your STEP file to PLY</h2>
          <p>One binary PLY mesh in millimetres, ready for MeshLab, CloudCompare and Open3D. {priceSentence}</p>
          <div className={styles.ctaBtns}>
            <a className={styles.ctaLight} href="#cad-file-converter">Convert STEP to PLY</a>
            <Link className={styles.ctaOutline} href="/tools/3d-cad-file-converter">See all converters</Link>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
