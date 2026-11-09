"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CadFileConversionContent from "./CadFileConversionContent";
import useConverterPriceDisplay from "@/Components/HomePages/shared/useConverterPriceDisplay";
import { getConverterFaqQuestions, withConverterFaqPrice } from "@/data/cadToolFaqs";
import home from "@/Components/HomePages/HomeLandingNew/HomeHero.module.css";
import styles from "./StepTo3dmHero.module.css";

const OUTPUTS = [
  { id: "STL", note: "binary · millimetres" },
  { id: "3MF", note: "units and colours" },
  { id: "OBJ", note: "for rendering" },
  { id: "PLY", note: "for scan tools" },
  { id: "OFF", note: "for research code" },
  { id: "IGES", note: "for legacy CAD" },
  { id: "BREP", note: "for Open CASCADE" },
  { id: "3DM", note: "for Rhino" },
];

const STEP_ROUTES = [
  ["3MF", false],
  ["OBJ", false],
  ["PLY", false],
  ["IGES", true],
  ["3DM", true],
  ["BREP", true],
  ["OFF", false],
];

const SLICERS = [
  ["PrusaSlicer", "STL or STEP", "both"],
  ["Bambu Studio", "STL or STEP", "both"],
  ["OrcaSlicer", "STL or STEP", "both"],
  ["Cura", "Opens STL", "stl"],
  ["Creality Print", "Opens STL", "stl"],
  ["Lychee Slicer", "Opens STL", "stl"],
];

const CAD_TABS = ["Fusion", "SolidWorks", "FreeCAD", "Onshape"];

function RouteArrow() {
  return (
    <span className={styles.arr} aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </span>
  );
}

function FormatPair({ from, to, fromCad = true, toCad = false }) {
  return (
    <span className={styles.pair}>
      <span className={`${styles.hubBadge} ${fromCad ? styles.badgeCad : styles.badgeMesh}`}>{from}</span>
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

function CubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>
  );
}

function Dot() {
  return (
    <i aria-hidden="true">
      <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" fill="currentColor" /></svg>
    </i>
  );
}

function StepViz() {
  return (
    <svg viewBox="0 0 560 200" role="img" aria-labelledby="step-stl-viz-title">
      <title id="step-stl-viz-title">The same part as an exact STEP solid and as a faceted STL mesh</title>
      <defs>
        <linearGradient id="step-stl-cyl" x1="0" x2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#F1EAFE" />
          <stop offset="0.8" stopColor="#C9B3F7" />
          <stop offset="1" stopColor="#E6DAFD" />
        </linearGradient>
      </defs>
      <path d="M40 58 V120 A78 24 0 0 0 196 120 V58 Z" fill="url(#step-stl-cyl)" />
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
      <text x="442" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">STL</text>
      <text x="442" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">triangle mesh · no units</text>
    </svg>
  );
}

export default function StepToStlHero() {
  const router = useRouter();
  const [cadTab, setCadTab] = useState(0);
  const { priceLabel } = useConverterPriceDisplay();
  const paid = priceLabel ? `${priceLabel} or ` : "";
  const priceSentence = `First 2 files free, any size up to 300 MB. After that, ${paid}1 credit per file.`;
  const faqs = withConverterFaqPrice(getConverterFaqQuestions("step-to-stl"), priceLabel);

  return (
    <>
      <section className={home.hero} aria-labelledby="hero-title">
        <div className={`${home.wrap} ${styles.grid}`}>
          <div>
            <nav className={styles.crumbs} aria-label="Breadcrumb">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/tools">Tools</Link></li>
                <li><Link href="/tools/3d-cad-file-converter">CAD converter</Link></li>
                <li><span aria-current="page">STEP to STL</span></li>
              </ol>
            </nav>
            <h1 className={home.title} id="hero-title">
              Convert STEP or STP to STL <span>online</span>
            </h1>
            <p className={`${home.lede} ${styles.lede}`}>
              Upload a .step or .stp file and download one binary STL in millimetres, ready for any slicer.{" "}
              <span className={styles.price}>{priceSentence}</span>
            </p>
          </div>

          <div className={`${home.card} ${styles.slot}`} id="cad-file-converter">
            <div className={home.head}>
              <h2>STEP to STL converter</h2>
              <span className={`${home.secure} ${styles.hideNarrow}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z" /><path d="M9 8h6M9 12h6" /></svg>
                Free quality report
              </span>
            </div>
            <div className={styles.route}>
              <div className={styles.routeCell}>
                <span className={`${styles.badge} ${styles.badgeCad}`}>STEP</span>
                <div><b>From STEP</b><small>.step or .stp</small></div>
              </div>
              <span className={styles.routeArrow} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
              <div className={styles.routeCell}>
                <span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span>
                <div className={styles.routeCopy}>
                  <label className={home.srOnly} htmlFor="step-to-stl-output">Convert to</label>
                  <select
                    id="step-to-stl-output"
                    className={styles.select}
                    value="STL"
                    onChange={(event) => {
                      const next = event.target.value;
                      if (next !== "STL") router.push(`/tools/convert-step-to-${next.toLowerCase()}`);
                    }}
                  >
                    {OUTPUTS.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}
                  </select>
                  <small>binary · millimetres</small>
                </div>
              </div>
            </div>
            <CadFileConversionContent convert conversionParams="step-to-stl" designVariant="step3dmHero" />
          </div>

          <div className={styles.art}>
            <ul className={home.ticks}>
              <li>Files up to 300 MB</li>
              <li>Binary STL in millimetres</li>
              <li>Opens in any slicer</li>
            </ul>
            <figure className={home.viz}><StepViz /></figure>
          </div>
        </div>
      </section>

      <section className={styles.glance} id="at-a-glance" aria-labelledby="glance-title">
        <div className={home.wrap}>
          <h2 id="glance-title" className={home.srOnly}>STEP to STL converter at a glance</h2>
          <dl className={styles.glanceList}>
            <div>
              <dt>Converts</dt>
              <dd>STEP and STP (AP203, AP214, AP242) to STL.</dd>
            </div>
            <div>
              <dt>You get</dt>
              <dd>One binary STL in millimetres, meshed at a 0.15 mm chord tolerance, plus a quality report (PDF).</dd>
            </div>
            <div>
              <dt>File size</dt>
              <dd>Up to 300 MB.</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>{priceSentence}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={styles.how} id="how-to" aria-labelledby="how-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>How to convert STEP to STL</p>
            <h2 className={home.platformTitle} id="how-title">STEP to STL in <span className={home.grad}>four steps</span></h2>
          </div>
          <div className={styles.answer}>
            <p><b>To convert STEP or STP to STL,</b> sign in, upload your .step or .stp file above and download the .stl. You get one binary STL written in millimetres, so it opens at the right size in any slicer. STP to STL works the same way, because .stp is just the short extension for STEP.</p>
          </div>
          <ol className={styles.steps}>
            <li><h3>Upload</h3><p>Sign in, then drop a .step or .stp file up to 300 MB onto the converter.</p></li>
            <li><h3>Convert</h3><p>Every face is meshed at a 0.15 mm chord tolerance.</p></li>
            <li><h3>Download</h3><p>Download one binary STL in millimetres, plus its quality report.</p></li>
            <li><h3>Check</h3><p>Measure one known dimension, zoom into curved faces and look for repair warnings.</p></li>
          </ol>
        </div>
      </section>

      <section className={styles.changes} id="what-changes" aria-labelledby="wc-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>STEP vs STL</p>
            <h2 className={home.platformTitle} id="wc-title">What changes when STEP becomes STL</h2>
            <p>STEP stores exact CAD geometry. STL stores only triangles.</p>
          </div>
          <div className={styles.keepLose}>
            <article className={styles.keep}>
              <h3>What the STL keeps</h3>
              <ul>
                <li>The outer shape of every solid</li>
                <li>Dimensions, written in millimetres</li>
                <li>Every part in its assembled position</li>
                <li>Separate bodies, as separate shells</li>
                <li>Closed volumes from valid solids (the report confirms it)</li>
              </ul>
            </article>
            <article className={styles.lose}>
              <h3>What it leaves behind</h3>
              <ul>
                <li>Exact curves, which become flat facets</li>
                <li>Feature history, sketches and constraints</li>
                <li>Part names and the assembly tree</li>
                <li>Colours, materials and PMI annotations</li>
                <li>The unit label (STL has no unit field)</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.meshNote} id="faceted-circles" aria-labelledby="fc-title">
        <div className={home.wrap}>
          <span id="mesh-quality-heading" aria-hidden="true" />
          <div className={home.sh}>
            <p className={home.eyebrow}>Mesh quality</p>
            <h2 className={home.platformTitle} id="fc-title">Why circles print flat, and how to fix it</h2>
            <p>STL stores only flat triangles, so every curve becomes a chain of short straight edges.</p>
          </div>
          <div className={styles.tess}>
            <div className={styles.tessViz} role="img" aria-label="A circle drawn with 8, about 26 and 64 flat segments, compared with the true curve">
              <figure>
                <svg viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="52" fill="none" stroke="#CDB8FA" strokeWidth="1.6" strokeDasharray="3 4" /><g stroke="#A57BFF" strokeWidth="0.7" strokeOpacity="0.6"><line x1="70" y1="70" x2="70" y2="18" /><line x1="70" y1="70" x2="106.8" y2="33.2" /><line x1="70" y1="70" x2="122" y2="70" /><line x1="70" y1="70" x2="106.8" y2="106.8" /><line x1="70" y1="70" x2="70" y2="122" /><line x1="70" y1="70" x2="33.2" y2="106.8" /><line x1="70" y1="70" x2="18" y2="70" /><line x1="70" y1="70" x2="33.2" y2="33.2" /></g><polygon points="70,18 106.8,33.2 122,70 106.8,106.8 70,122 33.2,106.8 18,70 33.2,33.2" fill="#F1EAFE" fillOpacity="0.55" stroke="#6A2BE0" strokeWidth="2" strokeLinejoin="round" /></svg>
                <figcaption>8 segments<small>very loose tolerance</small></figcaption>
              </figure>
              <figure>
                <svg viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="52" fill="none" stroke="#CDB8FA" strokeWidth="1.6" strokeDasharray="3 4" /><polygon points="70,18 82.4,19.5 94.2,24 104.5,31.1 112.8,40.5 118.6,51.6 121.6,63.7 121.6,76.3 118.6,88.4 112.8,99.5 104.5,108.9 94.2,116 82.4,120.5 70,122 57.6,120.5 45.8,116 35.5,108.9 27.2,99.5 21.4,88.4 18.4,76.3 18.4,63.7 21.4,51.6 27.2,40.5 35.5,31.1 45.8,24 57.6,19.5" fill="#F1EAFE" fillOpacity="0.55" stroke="#6A2BE0" strokeWidth="2" strokeLinejoin="round" /></svg>
                <figcaption>About 26 segments<small>our setting, on NIST test holes</small></figcaption>
              </figure>
              <figure>
                <svg viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="52" fill="none" stroke="#CDB8FA" strokeWidth="1.6" strokeDasharray="3 4" /><polygon points="70,18 75.1,18.3 80.1,19 85.1,20.2 89.9,22 94.5,24.1 98.9,26.8 103,29.8 106.8,33.2 110.2,37 113.2,41.1 115.9,45.5 118,50.1 119.8,54.9 121,59.9 121.7,64.9 122,70 121.7,75.1 121,80.1 119.8,85.1 118,89.9 115.9,94.5 113.2,98.9 110.2,103 106.8,106.8 103,110.2 98.9,113.2 94.5,115.9 89.9,118 85.1,119.8 80.1,121 75.1,121.7 70,122 64.9,121.7 59.9,121 54.9,119.8 50.1,118 45.5,115.9 41.1,113.2 37,110.2 33.2,106.8 29.8,103 26.8,98.9 24.1,94.5 22,89.9 20.2,85.1 19,80.1 18.3,75.1 18,70 18.3,64.9 19,59.9 20.2,54.9 22,50.1 24.1,45.5 26.8,41.1 29.8,37 33.2,33.2 37,29.8 41.1,26.8 45.5,24.1 50.1,22 54.9,20.2 59.9,19 64.9,18.3" fill="#F1EAFE" fillOpacity="0.55" stroke="#6A2BE0" strokeWidth="2" strokeLinejoin="round" /></svg>
                <figcaption>64 segments<small>fine CAD export</small></figcaption>
              </figure>
            </div>
            <div>
              <h3>One setting for every file</h3>
              <p>We mesh every STEP at a <b>0.15 mm chord tolerance</b> and about <b>29°</b> between neighbouring triangles. There are no quality presets.</p>
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
              <p className={styles.measured}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1117.4 0" /></svg>
                <span><b>Measured on three public NIST test parts</b> (ftc_10, ftc_08, ctc_01): holes came out with about 25-28 segments and at most 0.087 mm from the STEP.</span>
              </p>
            </div>
          </div>
          <div className={styles.fixes}>
            <div><b>For most FDM prints</b><span>The facets are smaller than the printer can show. Convert here.</span></div>
            <div><b>For resin prints or visible curves</b><span>Export from CAD at a 0.01-0.03 mm deviation and a 5-10° angle. <a href="#cad-export">See the export steps</a>.</span></div>
            <div><b>Slicer that opens STEP</b><span>Import the STEP straight into Bambu Studio, PrusaSlicer or OrcaSlicer and set the deflection there.</span></div>
          </div>
        </div>
      </section>

      <section className={styles.altBand} id="how-it-works" aria-labelledby="hiw-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>Under the hood</p>
            <h2 className={home.platformTitle} id="hiw-title">What happens to <span className={home.grad}>your file</span></h2>
            <p>Every STEP to STL conversion runs the same steps on our servers, with the same mesh setting.</p>
          </div>
          <ol className={styles.pipe}>
            <li><span className={styles.pipeIcon}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg></span><b>Read STEP</b><span>AP203, AP214 and AP242</span></li>
            <li><span className={styles.pipeIcon}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" /></svg></span><b>Repair STEP</b><span>Damaged records fixed before reading</span></li>
            <li><span className={styles.pipeIcon}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 3 8v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8M3 16l9-8 9 8" /></svg></span><b>Mesh every face</b><span>0.15 mm chord, about 29°</span></li>
            <li><span className={styles.pipeIcon}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15" /></svg></span><b>Retry</b><span>A face that won&apos;t mesh is retried at a coarser setting</span></li>
            <li><span className={styles.pipeIcon}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg></span><b>Write STL</b><span>One binary STL in millimetres</span></li>
            <li><span className={styles.pipeIcon}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></svg></span><b>Check</b><span>The report re-reads the STL and tests whether it&apos;s watertight</span></li>
          </ol>
        </div>
      </section>

      <section className={styles.how} id="quality-report" aria-labelledby="qr-title">
        <div className={`${home.wrap} ${styles.qr}`}>
          <div>
            <p className={home.eyebrow}>Free quality report</p>
            <h2 className={home.platformTitle} id="qr-title">A 12-check report with every conversion</h2>
            <p>Each conversion comes with a downloadable quality report (PDF) that measures the STL against the source STEP. On a surface-only STEP, 3 checks come back as not applicable. The report is free, and so are re-downloads.</p>
            <div className={styles.facts}>
              <span>12 checks</span>
              <span>PDF report</span>
              <span>Always free</span>
            </div>
            <a className={home.go} href="#cad-file-converter">Convert a STEP file</a>
          </div>
          <figure className={styles.reportFig}>
            <div className={styles.report} role="img" aria-label="Illustration of the 12-check quality report: source, output and accuracy checks">
              <div className={styles.reportTop} aria-hidden="true">
                <div><b>Quality report</b><small>part.step → part.stl</small></div>
                <span className={styles.score}>Illustration</span>
              </div>
              <div className={styles.reportStats} aria-hidden="true">
                <div><b>Count</b><span>triangles</span></div>
                <div><b>Yes / no</b><span>watertight</span></div>
                <div><b>Compared</b><span>size vs STEP</span></div>
              </div>
              <div className={styles.reportBody} aria-hidden="true">
                <div className={styles.reportGroup}>
                  <h3>Source</h3>
                  <ul>
                    {["Source readable", "Bounded geometry", "Finite volume", "Closed solid", "Solids present"].map((item) => <li key={item}><Dot />{item}</li>)}
                  </ul>
                </div>
                <div className={styles.reportGroup}>
                  <h3>Output</h3>
                  <ul>
                    {["Output mesh created", "Watertight", "Degenerate triangles", "Mesh uniformity", "Bounding box vs source"].map((item) => <li key={item}><Dot />{item}</li>)}
                  </ul>
                </div>
                <div className={`${styles.reportGroup} ${styles.reportWide}`}>
                  <h3>Accuracy</h3>
                  <ul>
                    {["Solid coverage", "Mesh overshoot"].map((item) => <li key={item}><Dot />{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
            <figcaption>Illustration of the report layout. The check names are the ones every STEP to STL report uses.</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.altBand} id="slicers" aria-labelledby="sl-title">
        <div className={home.wrap}>
          <div className={styles.splitHead}>
            <div>
              <p className={home.eyebrow}>Open it anywhere</p>
              <h2 className={home.platformTitle} id="sl-title">Ready for every slicer</h2>
            </div>
            <p>Our STL is in millimetres, the unit slicers assume.</p>
          </div>
          <div className={`${styles.apps} ${styles.slicers}`}>
            {SLICERS.map(([name, note, tone]) => (
              <div key={name}><b>{name}</b><span className={tone === "both" ? styles.both : styles.stlOnly}>{note}</span></div>
            ))}
          </div>
          <p className={styles.unitNote}>
            <InfoIcon />
            <span>PrusaSlicer, Bambu Studio and OrcaSlicer can open STEP directly. Convert to STL when a print service, print farm or another slicer needs a mesh, or when you want one file that opens the same everywhere. Want units and colours too? Try <Link href="/tools/convert-step-to-3mf">STEP to 3MF for slicers</Link>.</span>
          </p>
        </div>
      </section>

      <section className={styles.how} id="step-vs-stl" aria-labelledby="fmt-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>Choose the right format</p>
            <h2 className={home.platformTitle} id="fmt-title">STEP vs STL vs 3MF</h2>
            <p>Pick by what the next program needs.</p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.formatTable}>
              <caption className={home.srOnly}>STEP, STL and 3MF compared</caption>
              <thead>
                <tr>
                  <th scope="col" />
                  <th scope="col"><span className={`${styles.badge} ${styles.badgeCad}`}>STEP</span></th>
                  <th scope="col" className={styles.hl}><span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span></th>
                  <th scope="col"><span className={`${styles.badge} ${styles.badgeMesh}`}>3MF</span></th>
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">Geometry</th><td>Exact surfaces and solids</td><td className={styles.hl}>Triangles only</td><td>Triangle mesh</td></tr>
                <tr><th scope="row">Units</th><td>Stored</td><td className={styles.hl}>Not stored (we write mm)</td><td>Stored</td></tr>
                <tr><th scope="row">Colours and parts</th><td>Colours and a named assembly tree</td><td className={styles.hl}>No colours, unnamed shells</td><td>Colours and named objects</td></tr>
                <tr><th scope="row">Editable in CAD</th><td>Yes</td><td className={styles.hl}>Mesh editing only</td><td>Mesh editing only</td></tr>
                <tr><th scope="row">Best for</th><td>Design, CNC and suppliers</td><td className={styles.hl}>3D printing and print services</td><td>Modern slicers</td></tr>
              </tbody>
            </table>
          </div>
          <div className={styles.choose}>
            <div>
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span><b>Convert to STL when</b></span>
              <p>Your slicer or print service wants STL, or you need a mesh every program opens.</p>
              <span className={styles.more}>You&apos;re in the right place</span>
            </div>
            <Link href="/tools/step-file-viewer" aria-label="STEP viewer">
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>STEP</span><b>Keep STEP when</b></span>
              <p>The part will be machined, edited or quoted from exact CAD geometry.</p>
              <span className={styles.more}>Open the STEP viewer <MoreArrow /></span>
            </Link>
            <Link href="/tools/convert-step-to-3mf" aria-label="STEP to 3MF">
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>3MF</span><b>Choose 3MF when</b></span>
              <p>You want units, colours and named parts in one print file.</p>
              <span className={styles.more}>STEP to 3MF for slicers <MoreArrow /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.altBand} id="units" aria-labelledby="units-title">
        <div className={`${home.wrap} ${styles.scale}`}>
          <div>
            <p className={home.eyebrow}>Scale and units</p>
            <h2 className={home.platformTitle} id="units-title">STL the wrong size in your slicer?</h2>
            <p>STL has no unit field, so slicers assume millimetres. Our STL is always written in millimetres. For STL files from elsewhere, scale by:</p>
          </div>
          <table className={styles.scaleTable}>
            <caption className={home.srOnly}>Scale factors for STL files read in the wrong unit</caption>
            <thead>
              <tr><th scope="col">In the slicer</th><th scope="col">Cause</th><th scope="col">Scale by</th></tr>
            </thead>
            <tbody>
              <tr><td>About 25× too small</td><td>Modelled in inches</td><td><code>2540%</code></td></tr>
              <tr><td>About 25× too large</td><td>Millimetres read as inches</td><td><code>3.937%</code></td></tr>
              <tr><td>10× too small</td><td>Modelled in centimetres</td><td><code>1000%</code></td></tr>
              <tr><td>1000× too small</td><td>Modelled in metres</td><td><code>100000%</code></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.how} id="cad-export" aria-labelledby="cad-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>Free routes</p>
            <h2 className={home.platformTitle} id="cad-title">Export STL from Fusion, SolidWorks, FreeCAD or Onshape</h2>
            <p>Already have the model open? Export it yourself, at the finer settings resin prints need: a 0.01-0.03 mm deviation and a 5-10° angle. FreeCAD is free.</p>
          </div>
          <div className={styles.cadApps}>
            <div className={styles.jobTabs} role="tablist" aria-label="CAD program">
              {CAD_TABS.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  id={`stl-tab-${index}`}
                  aria-controls={`stl-panel-${index}`}
                  aria-selected={cadTab === index}
                  tabIndex={cadTab === index ? 0 : -1}
                  onClick={() => setCadTab(index)}
                >
                  <CubeIcon />{label}
                </button>
              ))}
            </div>
            {cadTab === 0 ? (
              <div className={styles.appPanel} role="tabpanel" id="stl-panel-0" aria-labelledby="stl-tab-0">
                <h3 className={home.srOnly}>Export STL from Fusion</h3>
                <ol>
                  <li><span>Right-click the body or component in the Browser and choose <strong>Save As Mesh</strong>.</span></li>
                  <li><span>Set Format to <strong>STL (Binary)</strong> and Unit type to <strong>Millimeter</strong>.</span></li>
                  <li><span>Set Refinement to <strong>High</strong>, or open Refinement Settings and enter a surface deviation of 0.01-0.03 mm for smooth holes.</span></li>
                </ol>
                <p className={styles.tip}>No Fusion licence to hand? <a href="#cad-file-converter">Convert the STEP here</a> instead: {priceSentence}</p>
              </div>
            ) : null}
            {cadTab === 1 ? (
              <div className={styles.appPanel} role="tabpanel" id="stl-panel-1" aria-labelledby="stl-tab-1">
                <h3 className={home.srOnly}>Export STL from SolidWorks</h3>
                <ol>
                  <li><span>Go to <strong>File → Save As</strong> and choose <strong>STL (*.stl)</strong>.</span></li>
                  <li><span>Click <strong>Options</strong>. Choose Binary output and Millimeters.</span></li>
                  <li><span>Set Resolution to <strong>Fine</strong>, or Custom to enter deviation and angle tolerances.</span></li>
                  <li><span>For assemblies, untick the single-file option to get one STL per component.</span></li>
                </ol>
                <p className={styles.tip}>No SolidWorks licence to hand? <a href="#cad-file-converter">Convert the STEP here</a> instead: {priceSentence}</p>
              </div>
            ) : null}
            {cadTab === 2 ? (
              <div className={styles.appPanel} role="tabpanel" id="stl-panel-2" aria-labelledby="stl-tab-2">
                <h3 className={home.srOnly}>Export STL from FreeCAD</h3>
                <ol>
                  <li><span>Open the STEP file with <strong>File → Open</strong>.</span></li>
                  <li><span>Switch to the <strong>Mesh Design</strong> workbench, select the body and choose <strong>Meshes → Create mesh from shape</strong>.</span></li>
                  <li><span>Set Surface deviation and Angular deviation, then click OK.</span></li>
                  <li><span>Select the new mesh and choose <strong>Meshes → Export mesh</strong>, then save as STL.</span></li>
                </ol>
                <p className={styles.tip}>Don&apos;t want to install FreeCAD? <a href="#cad-file-converter">Convert the STEP here</a> instead: {priceSentence}</p>
              </div>
            ) : null}
            {cadTab === 3 ? (
              <div className={styles.appPanel} role="tabpanel" id="stl-panel-3" aria-labelledby="stl-tab-3">
                <h3 className={home.srOnly}>Export STL from Onshape</h3>
                <ol>
                  <li><span>Right-click the part in the Parts list and choose <strong>Export</strong>.</span></li>
                  <li><span>Set Format to <strong>STL</strong>, STL format to Binary and Units to Millimeter.</span></li>
                  <li><span>Choose Fine resolution, or Custom to set angular and chordal tolerance.</span></li>
                </ol>
                <p className={styles.tip}>No Onshape account? <a href="#cad-file-converter">Convert the STEP here</a> instead: {priceSentence}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className={styles.altBand} id="troubleshooting" aria-labelledby="tr-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>Troubleshooting</p>
            <h2 className={home.platformTitle} id="tr-title">Fix common STEP to STL problems</h2>
          </div>
          <div className={styles.trouble}>
            <article className={styles.tcard}>
              <span className={styles.tcardIcon}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 3 8v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8M3 16l9-8 9 8" /></svg></span>
              <h3>Curves look faceted</h3>
              <p>Small holes and slow curves show the flat segments.</p>
              <p className={styles.fix}>Fix: export from CAD with a 0.01-0.03 mm deviation and a 5-10° angle, or import the STEP straight into Bambu Studio or OrcaSlicer and set the deflection there.</p>
            </article>
            <article className={styles.tcard}>
              <span className={styles.tcardIcon}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1117.4 0" /></svg></span>
              <h3>The model is the wrong size</h3>
              <p>The STL came from a tool that wrote inches or metres.</p>
              <p className={styles.fix}>Fix: scale it in the slicer with the table above. Our STL is always written in millimetres.</p>
            </article>
            <article className={styles.tcard}>
              <span className={styles.tcardIcon}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></svg></span>
              <h3>Holes or non-manifold edges</h3>
              <p>The STEP holds open surfaces, not closed solids.</p>
              <p className={styles.fix}>Fix: re-export as solids (AP214 or AP242), or <Link href="/cad-services">get it repaired</Link>.</p>
            </article>
            <article className={styles.tcard}>
              <span className={styles.tcardIcon}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg></span>
              <h3>Parts are in one file</h3>
              <p>An assembly comes out as one STL, each body as its own shell.</p>
              <p className={styles.fix}>Fix: split the STL into objects in your slicer, and check every body was visible when the STEP was exported.</p>
            </article>
            <article className={styles.tcard}>
              <span className={styles.tcardIcon}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3l18 18M10.6 5.1A10 10 0 0112 5c6 0 10 7 10 7a17 17 0 01-3.2 3.9M6.6 6.6C3.8 8.4 2 12 2 12s4 7 10 7a9.6 9.6 0 005.4-1.6" /></svg></span>
              <h3>Thin walls vanish in print</h3>
              <p>Features are thinner than the nozzle can lay down.</p>
              <p className={styles.fix}>Fix: keep walls above about 0.8 mm on a 0.4 mm nozzle, or <Link href="/cad-services">have them thickened</Link>.</p>
            </article>
            <article className={styles.tcard}>
              <span className={styles.tcardIcon}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg></span>
              <h3>The upload is rejected</h3>
              <p>The file is a native CAD file renamed to .step, or damaged.</p>
              <p className={styles.fix}>Fix: re-export from your CAD program as STEP AP214 or AP242.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.relatedBand} id="related" aria-labelledby="rel-title">
        <div className={home.wrap}>
          <div className={styles.splitHead}>
            <div>
              <p className={home.eyebrow}>Related conversions</p>
              <h2 className={home.platformTitle} id="rel-title">More STEP and STL tools</h2>
            </div>
            <Link className={styles.more} href="/tools/3d-cad-file-converter">
              All 74 conversion routes
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
          <p className={styles.reverseNote}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
            <span>Going the other way? Use <Link href="/tools/convert-stl-to-step">the reverse direction (STL → STEP)</Link>. It rebuilds flat and cylindrical faces as real CAD surfaces where it can.</span>
          </p>
          <div className={styles.hub}>
            <div className={styles.hubCard}>
              <h3>Convert STEP to…</h3>
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
              <h3>Also converting to STL?</h3>
              <div className={styles.hubLinks}>
                <Link href="/tools/convert-iges-to-stl" aria-label="IGES to STL"><FormatPair from="IGES" to="STL" /><RouteArrow /></Link>
                <Link href="/tools/convert-brep-to-stl" aria-label="BREP to STL"><FormatPair from="BREP" to="STL" /><RouteArrow /></Link>
                <Link href="/tools/convert-3mf-to-stl" aria-label="3MF to STL"><FormatPair from="3MF" to="STL" fromCad={false} /><RouteArrow /></Link>
                <Link href="/tools/convert-obj-to-stl" aria-label="OBJ to STL"><FormatPair from="OBJ" to="STL" fromCad={false} /><RouteArrow /></Link>
                <Link href="/tools/3d-cad-file-converter"><b className={styles.allRoutes}>All routes</b><RouteArrow /></Link>
              </div>
            </div>
          </div>
          <div className={styles.hubTools}>
            <Link href="/tools/step-file-viewer">Free STEP viewer</Link>
            <Link href="/tools/stl-file-viewer">Free STL viewer</Link>
            <Link href="/tools/step-bom-extractor">STEP BOM extractor</Link>
            <Link href="/tools/convert-step-to-2d-drawing">STEP to 2D drawing</Link>
          </div>
        </div>
      </section>

      <section className={styles.altBand} id="pricing" aria-labelledby="price-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>Pricing</p>
            <h2 className={home.platformTitle} id="price-title">Start free. <span className={home.grad}>Pay per file.</span></h2>
            <p>{priceSentence}</p>
          </div>
          <div className={styles.strip}>
            <div className={styles.stripFree}><span className={styles.stripIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg></span><div><b>2 files free</b><span>any size up to 300 MB</span></div></div>
            <div><span className={styles.stripIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg></span><div><b>{paid}1 credit</b><span>per file, incl. tax</span></div></div>
            <div><span className={styles.stripIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.6 13.4 13.4 20.6a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg></span><div><b>$1.80 per file</b><span>with a credit pack</span></div></div>
            <div><span className={styles.stripIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z" /><path d="M9 8h6M9 12h6" /></svg></span><div><b>Free reports</b><span>and free re-downloads</span></div></div>
          </div>
          <p className={styles.priceNotes}>
            <span>Charged only when you click Download</span>
            <span>Credits never expire</span>
            <span>Over 22,000 files converted on Marathon OS</span>
          </p>
          <p className={styles.priceLinks}>
            <Link className={styles.more} href="/#pricing">See credit packs <MoreArrow /></Link>
            <Link className={styles.more} href="/refund-policy">Refund Policy <MoreArrow /></Link>
          </p>
        </div>
      </section>

      <section className={styles.how} id="security" aria-labelledby="sec-title">
        <div className={home.wrap}>
          <div className={styles.fileBand}>
            <div>
              <p className={home.eyebrow}>Your files</p>
              <h2 id="sec-title">Your designs stay yours</h2>
              <p>Converted files aren&apos;t added to the public CAD library unless you publish them. Uploading or converting a file never transfers ownership of your design.</p>
              <p className={styles.fileLinks}>
                <Link className={styles.ctaLight} href="/privacy-policy">Privacy Policy</Link>
                <Link className={styles.ctaOutline} href="/terms-and-conditions">Terms and Conditions</Link>
              </p>
            </div>
            <div className={styles.fileTiles}>
              <div className={styles.fileTile}><span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg></span><b>HTTPS uploads and downloads</b></div>
              <div className={styles.fileTile}><span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5" /></svg></span><b>Deleted after 7 days</b></div>
              <div className={styles.fileTile}><span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="7.5" cy="15.5" r="4.5" /><path d="M10.7 12.3 21 2M16 7l3 3M18 5l2 2" /></svg></span><b>You keep ownership</b></div>
              <div className={styles.fileTile}><span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3l18 18M10.6 5.1A10 10 0 0112 5c6 0 10 7 10 7a17 17 0 01-3.2 3.9M6.6 6.6C3.8 8.4 2 12 2 12s4 7 10 7a9.6 9.6 0 005.4-1.6" /></svg></span><b>Not published unless you choose</b></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.faqBand} id="faq" aria-labelledby="faq-title">
        <div className={`${home.wrap} ${styles.faqGrid}`}>
          <div className={styles.faqSide}>
            <p className={home.eyebrow}>FAQ</p>
            <h2 className={home.platformTitle} id="faq-title">STEP to STL questions</h2>
            <p>Mesh quality, units, assemblies, slicers, pricing and your files.</p>
            <Link className={styles.ghostBtn} href="/contact-us">Contact us</Link>
            <small className={styles.faqUpdated}>Last updated 5 November 2026</small>
          </div>
          <div className={styles.faqList}>
            {faqs.map((item, index) => (
              <details key={item.question} className={styles.acc} open={index === 0}>
                <summary>{item.question}</summary>
                <div className={styles.accBody}><p>{item.answer}</p></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.closeBand} aria-labelledby="cta-title">
        <div className={home.wrap}>
          <div className={styles.cta}>
            <h2 id="cta-title">Convert your STEP file now</h2>
            <p>One binary STL in millimetres, with a free quality report. {priceSentence}</p>
            <div className={styles.ctaBtns}>
              <a className={styles.ctaLight} href="#cad-file-converter">Convert STEP to STL</a>
              <Link className={styles.ctaOutline} href="/tools/3d-cad-file-converter">See all converters</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
