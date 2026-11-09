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
  { id: "STEP", note: "CAD exchange · .step" },
  { id: "IGES", note: "for legacy CAD" },
  { id: "BREP", note: "for Open CASCADE" },
  { id: "3DM", note: "Rhino mesh" },
  { id: "3MF", note: "for modern slicers" },
  { id: "OBJ", note: "for rendering" },
  { id: "PLY", note: "for scan tools" },
  { id: "OFF", note: "for research code" },
];

const STL_ROUTES = [
  ["IGES", true],
  ["BREP", true],
  ["3DM", false],
  ["3MF", false],
  ["OBJ", false],
  ["PLY", false],
  ["OFF", false],
];

const TO_STEP = [
  ["OBJ", false],
  ["OFF", false],
  ["PLY", false],
  ["3MF", false],
];

const CAD_TABS = ["SolidWorks", "Fusion", "Onshape", "Inventor", "FreeCAD"];

function RouteArrow() {
  return (
    <span className={styles.arr} aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </span>
  );
}

function FormatPair({ from, to, fromCad = false, toCad = false }) {
  return (
    <span className={styles.pair}>
      <span className={`${styles.hubBadge} ${fromCad ? styles.badgeCad : styles.badgeMesh}`}>{from}</span>
      <i>→</i>
      <span className={`${styles.hubBadge} ${toCad ? styles.badgeCad : styles.badgeMesh}`}>{to}</span>
    </span>
  );
}

function CubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>
  );
}

function StepViz() {
  return (
    <svg viewBox="0 0 560 200" role="img" aria-labelledby="stl-step-viz-title">
      <title id="stl-step-viz-title">A faceted STL mesh and the same part as a STEP file, with the hole fitted as a cylinder</title>
      <defs>
        <linearGradient id="stl-step-cyl" x1="0" x2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#F1EAFE" />
          <stop offset="0.8" stopColor="#C9B3F7" />
          <stop offset="1" stopColor="#E6DAFD" />
        </linearGradient>
      </defs>
      <g stroke="#6A2BE0" strokeOpacity="0.45" strokeWidth="0.9">
        <polygon points="196,58 190,67 190,129 196,120" fill="#D0BDFA" />
        <polygon points="190,67 173,75 173,137 190,129" fill="#D9C9FB" />
        <polygon points="173,75 148,80 148,142 173,137" fill="#E3D8FC" />
        <polygon points="148,80 118,82 118,144 148,142" fill="#EEE7FD" />
        <polygon points="118,82 88,80 88,142 118,144" fill="#F7F4FE" />
        <polygon points="88,80 63,75 63,137 88,142" fill="#FEFEFE" />
        <polygon points="63,75 46,67 46,129 63,137" fill="#FFFFFF" />
        <polygon points="46,67 40,58 40,120 46,129" fill="#FFFFFF" />
      </g>
      <polygon points="196,58 190,67 173,75 148,80 118,82 88,80 63,75 46,67 40,58 46,49 63,41 88,36 118,34 148,36 173,41 190,49" fill="#FBF9FF" stroke="#6A2BE0" strokeOpacity="0.45" strokeWidth="0.9" />
      <polygon points="142,58 135,63 118,65 101,63 94,58 101,53 118,51 135,53" fill="#4716B2" />
      <g transform="translate(324 0)">
        <path d="M40 58 V120 A78 24 0 0 0 196 120 V58 Z" fill="url(#stl-step-cyl)" />
        <ellipse cx="118" cy="58" rx="78" ry="24" fill="#FBF9FF" />
        <ellipse cx="118" cy="58" rx="24" ry="7.4" fill="#4716B2" />
        <path d="M94 58 A24 7.4 0 0 0 142 58" fill="none" stroke="#8B5CF6" strokeWidth="1.5" />
      </g>
      <g transform="translate(280 92)">
        <circle r="24" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.4)" />
        <path d="M-9 0 H9 M3 -6 L9 0 L3 6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="118" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">STL</text>
      <text x="118" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">triangle mesh · no units</text>
      <text x="442" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">STEP</text>
      <text x="442" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">rebuilt on a clean mesh</text>
    </svg>
  );
}

export default function StlToStepHero() {
  const router = useRouter();
  const [cadTab, setCadTab] = useState(0);
  const { priceLabel } = useConverterPriceDisplay();
  const paid = priceLabel ? `${priceLabel} or ` : "";
  const priceSentence = `First 2 files free, any size up to 300 MB. After that, ${paid}1 credit per file.`;
  const faqs = withConverterFaqPrice(getConverterFaqQuestions("stl-to-step"), priceLabel);

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
                <li><span aria-current="page">STL to STEP</span></li>
              </ol>
            </nav>
            <h1 className={home.title} id="hero-title">
              Convert STL to STEP or STP <span>online</span>
            </h1>
            <p className={`${home.lede} ${styles.lede}`}>
              Upload an .stl and download a STEP file for SolidWorks, Fusion, Onshape or FreeCAD. On clean meshes it&apos;s a solid, with flat sides as single faces and many holes fitted as cylinders.{" "}
              <span className={styles.price}>{priceSentence}</span>
            </p>
          </div>

          <div className={`${home.card} ${styles.slot}`} id="cad-file-converter">
            <div className={home.head}>
              <h2>STL to STEP converter</h2>
              <span className={`${home.secure} ${styles.hideNarrow}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>
                STEP AP214 · mm
              </span>
            </div>
            <div className={styles.route}>
              <div className={styles.routeCell}>
                <span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span>
                <div><b>From STL</b><small>binary or ASCII</small></div>
              </div>
              <span className={styles.routeArrow} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
              <div className={styles.routeCell}>
                <span className={`${styles.badge} ${styles.badgeCad}`}>STEP</span>
                <div className={styles.routeCopy}>
                  <label className={home.srOnly} htmlFor="stl-to-step-output">Convert to</label>
                  <select
                    id="stl-to-step-output"
                    className={styles.select}
                    value="STEP"
                    onChange={(event) => {
                      const next = event.target.value;
                      if (next !== "STEP") router.push(`/tools/convert-stl-to-${next.toLowerCase()}`);
                    }}
                  >
                    {OUTPUTS.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}
                  </select>
                  <small>CAD exchange · .step</small>
                </div>
              </div>
            </div>
            <CadFileConversionContent convert conversionParams="stl-to-step" designVariant="step3dmHero" />
            <p className={styles.reverse}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
              <span>Converting STEP or STP to STL? Use the <Link href="/tools/convert-step-to-stl">STEP to STL converter</Link>.</span>
            </p>
          </div>

          <div className={styles.art}>
            <ul className={home.ticks}>
              <li>Files up to 300 MB</li>
              <li>Flat faces merged</li>
              <li>STEP AP214 in millimetres</li>
            </ul>
            <figure className={home.viz}><StepViz /></figure>
          </div>
        </div>
      </section>

      <section className={styles.glance} id="at-a-glance" aria-labelledby="glance-title">
        <div className={home.wrap}>
          <h2 id="glance-title" className={home.srOnly}>STL to STEP converter at a glance</h2>
          <dl className={styles.glanceList}>
            <div><dt>Converts</dt><dd>STL (binary or ASCII) to STEP and STP. Over 8,000 STL files converted to STEP so far.</dd></div>
            <div><dt>You get</dt><dd>One STEP file (AP214, millimetres). When the rebuild succeeds it&apos;s a solid; meshes over 1 million triangles come back as a faceted surface model.</dd></div>
            <div><dt>File size</dt><dd>Up to 300 MB. We email you when the STEP is ready.</dd></div>
            <div><dt>Price</dt><dd>{priceSentence}</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.how} id="how-to" aria-labelledby="how-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>How to convert STL to STEP</p>
            <h2 className={home.platformTitle} id="how-title">STL to STEP in <span className={home.grad}>four steps</span></h2>
          </div>
          <div className={styles.answer}>
            <p><b>To convert STL to STEP,</b> sign in, upload the .stl above, choose the units the model was made in (usually millimetres) and download the .step file. Flat areas come back as single faces, and on clean meshes many holes and chamfers are fitted as cylinders and cones, so the STEP opens in SolidWorks, Fusion, Onshape and FreeCAD. STL to STP is the same conversion.</p>
          </div>
          <ol className={styles.steps}>
            <li><h3>Upload</h3><p>Sign in, then drop a binary or ASCII .stl file up to 300 MB onto the converter.</p></li>
            <li><h3>Set units</h3><p>Choose the units the model was made in: millimetres, centimetres, metres or inches.</p></li>
            <li><h3>Convert</h3><p>Flat sides are merged into single faces, and on clean meshes holes are fitted as cylinders.</p></li>
            <li><h3>Open in CAD</h3><p>We email you when the STEP is ready. Download it and open it in SolidWorks, Fusion, Onshape or FreeCAD.</p></li>
          </ol>
        </div>
      </section>

      <section className={styles.changes} id="what-you-get" aria-labelledby="wyg-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>What you get</p>
            <h2 className={home.platformTitle} id="wyg-title">Not just a <span className={home.grad}>faceted shell</span></h2>
            <p>A plain conversion turns every triangle into a face. Ours merges flat sides into single faces and, on clean meshes, fits holes as cylinders.</p>
          </div>
          <div className={styles.fx}>
            <figure>
              <svg viewBox="0 0 220 140" role="img" aria-label="The same plate as a triangle mesh, with the hole approximated by flat facets">
                <rect x="30" y="20" width="160" height="100" fill="#EAF0FD" stroke="#2B4C9B" strokeWidth="2" />
                <polygon points="139,78 131,91 118,99 102,99 89,91 81,78 81,62 89,49 102,41 118,41 131,49 139,62" fill="#fff" stroke="#2B4C9B" strokeWidth="2" />
                <text x="110" y="74" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="10" fontWeight="700" fill="#2B4C9B">12 facets</text>
              </svg>
              <figcaption><b>Faceted model</b><span>Every triangle becomes a face. Holes stay polygons.</span></figcaption>
            </figure>
            <span className={styles.fxVs} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
            <figure>
              <svg viewBox="0 0 220 140" role="img" aria-label="A CAD plate with an exact circular hole">
                <rect x="30" y="20" width="160" height="100" rx="10" fill="#F1EAFE" stroke="#5B1FD1" strokeWidth="2" />
                <circle cx="110" cy="70" r="30" fill="#fff" stroke="#5B1FD1" strokeWidth="2" />
                <line x1="110" y1="70" x2="131" y2="49" stroke="#5B1FD1" strokeWidth="1.2" />
                <circle cx="110" cy="70" r="2" fill="#5B1FD1" />
                <text x="136" y="46" fontFamily="Inter,Arial,sans-serif" fontSize="11" fontWeight="700" fill="#5B1FD1">R 30.000</text>
              </svg>
              <figcaption>
                <b>Rebuilt on a clean mesh</b>
                <span>One face per flat side. Holes fitted as cylinders.</span>
                <div className={styles.surf}><span>Planes</span><span>Cylinders</span><span>Cones</span><span>Free-form faces</span></div>
              </figcaption>
            </figure>
          </div>
          <div className={styles.keepLose}>
            <article className={styles.keep}>
              <h3>What you can do with a rebuilt solid</h3>
              <ul>
                <li>Measure, section and check clearances</li>
                <li>Cut, drill, extrude and shell it with normal CAD tools</li>
                <li>Combine it with other bodies in an assembly</li>
                <li>Send it to a supplier or CAM program that needs STEP</li>
              </ul>
            </article>
            <article className={styles.lose}>
              <h3>What no converter can do</h3>
              <ul>
                <li>Restore feature history or sketches</li>
                <li>Let you change a size by editing a dimension</li>
                <li>Add detail the STL never had</li>
                <li>Rebuild noisy scans as clean engineering surfaces</li>
              </ul>
            </article>
          </div>
          <p className={styles.honest}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></svg>
            <span>Sculpts and scans have few flat or round areas to fit, and meshes over 1 million triangles skip the rebuild and come back as a faceted surface model, up to about 35,000 faces. After download, open the STEP and look at a hole: a rebuilt hole is one cylindrical face; a faceted one is many strips.</span>
          </p>
        </div>
      </section>

      <section className={styles.how} id="units" aria-labelledby="units-title">
        <div className={`${home.wrap} ${styles.scale}`}>
          <div>
            <p className={home.eyebrow}>Units</p>
            <h2 className={home.platformTitle} id="units-title">STEP the wrong size in CAD?</h2>
            <p>STL files carry no units, so you choose them when you convert. Models from Printables, Thingiverse, MakerWorld and most slicers are in millimetres. If the part opens at the wrong size, convert again with:</p>
          </div>
          <table className={styles.scaleTable}>
            <caption className={home.srOnly}>Which unit to choose when the converted STEP is the wrong size</caption>
            <thead><tr><th scope="col">In CAD the part is</th><th scope="col">You chose</th><th scope="col">Convert again with</th></tr></thead>
            <tbody>
              <tr><td>About 25× too small</td><td>Millimetres</td><td><code>Inches</code></td></tr>
              <tr><td>About 25× too large</td><td>Inches</td><td><code>Millimetres</code></td></tr>
              <tr><td>10× too small</td><td>Millimetres</td><td><code>Centimetres</code></td></tr>
              <tr><td>1000× too small</td><td>Millimetres</td><td><code>Metres</code></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.altBand} id="convert-or-rebuild" aria-labelledby="rb-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>Convert or rebuild?</p>
            <h2 className={home.platformTitle} id="rb-title">When a conversion isn&apos;t enough</h2>
            <p>For machining, tolerances or design changes, a designer can remodel the part with full feature history.</p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.formatTable}>
              <caption className={home.srOnly}>Automatic STL to STEP conversion compared with a CAD designer rebuild</caption>
              <thead>
                <tr>
                  <th scope="col" />
                  <th scope="col" className={styles.hl}>Marathon OS conversion</th>
                  <th scope="col">CAD designer rebuild</th>
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">How it&apos;s made</th><td className={styles.hl}>Flat faces merged and cylinders fitted to the mesh, then sewn together</td><td>Remodelled as features, using the mesh as a reference</td></tr>
                <tr><th scope="row">Cost</th><td className={styles.hl}>{priceSentence}</td><td>Quoted per part</td></tr>
                <tr><th scope="row">Flat faces</th><td className={styles.hl}><span className={styles.yes}>Single faces</span></td><td><span className={styles.yes}>Exact</span></td></tr>
                <tr><th scope="row">Holes and chamfers</th><td className={styles.hl}><span className={styles.yes}>Cylinders and cones fitted to the mesh</span></td><td><span className={styles.yes}>Exact, to your dimensions</span></td></tr>
                <tr><th scope="row">Edit by changing a dimension</th><td className={styles.hl}><span className={styles.no}>No</span></td><td><span className={styles.yes}>Yes, with feature history</span></td></tr>
                <tr><th scope="row">Best for</th><td className={styles.hl}>Edits, fit checks, assemblies, STEP-only workflows</td><td>CNC, toleranced drawings, moulding, redesigns</td></tr>
              </tbody>
            </table>
          </div>
          <div className={styles.rebuildCta}>
            <a className={home.go} href="#cad-file-converter">Convert it now</a>
            <Link className={styles.ghostBtn} href="/cad-services">Get it rebuilt by a designer</Link>
          </div>
        </div>
      </section>

      <section className={styles.how} id="open-in-cad" aria-labelledby="cad-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>Open and edit</p>
            <h2 className={home.platformTitle} id="cad-title">Open the STEP in SolidWorks, Fusion, Onshape or FreeCAD</h2>
            <p>When the rebuild succeeds you get a solid you can edit with direct-modelling tools.</p>
          </div>
          <div className={styles.cadApps}>
            <div className={styles.jobTabs} role="tablist" aria-label="CAD program">
              {CAD_TABS.map((label, index) => (
                <button key={label} type="button" role="tab" aria-selected={cadTab === index} tabIndex={cadTab === index ? 0 : -1} onClick={() => setCadTab(index)}>
                  <CubeIcon />{label}
                </button>
              ))}
            </div>
            {cadTab === 0 ? (
              <div className={styles.appPanel}>
                <h3 className={home.srOnly}>Open the STEP in SolidWorks</h3>
                <ol>
                  <li><span>Go to <strong>File → Open</strong> and set the file type to STEP (*.step, *.stp).</span></li>
                  <li><span>Open the file. If SolidWorks offers Import Diagnostics, run it to check the faces.</span></li>
                  <li><span>Edit with Extruded Cut, Delete Face and Move Face.</span></li>
                </ol>
                <p className={styles.tip}>No STEP yet? <a href="#cad-file-converter">Convert the STL above</a>.</p>
              </div>
            ) : null}
            {cadTab === 1 ? (
              <div className={styles.appPanel}>
                <h3 className={home.srOnly}>Open the STEP in Fusion</h3>
                <ol>
                  <li><span>Go to <strong>File → Open → Open from my computer</strong>, or upload the file in the Data Panel.</span></li>
                  <li><span>The STEP opens in a new design; a rebuilt file comes in as solid bodies.</span></li>
                  <li><span>Edit with Press Pull, Extrude cuts and Combine.</span></li>
                </ol>
                <p className={styles.tip}>No STEP yet? <a href="#cad-file-converter">Convert the STL above</a>.</p>
              </div>
            ) : null}
            {cadTab === 2 ? (
              <div className={styles.appPanel}>
                <h3 className={home.srOnly}>Open the STEP in Onshape</h3>
                <ol>
                  <li><span>On the Documents page, choose <strong>Create → Import files</strong> and select the .step.</span></li>
                  <li><span>Open the new document to find the part in its Part Studio.</span></li>
                  <li><span>Edit with Move face, Delete part faces and Extrude.</span></li>
                </ol>
                <p className={styles.tip}>No STEP yet? <a href="#cad-file-converter">Convert the STL above</a>.</p>
              </div>
            ) : null}
            {cadTab === 3 ? (
              <div className={styles.appPanel}>
                <h3 className={home.srOnly}>Open the STEP in Inventor</h3>
                <ol>
                  <li><span>Go to <strong>File → Open</strong> and choose STEP files as the file type.</span></li>
                  <li><span>Open the file as a part, then edit with direct-edit and extrude tools.</span></li>
                </ol>
                <p className={styles.tip}>No STEP yet? <a href="#cad-file-converter">Convert the STL above</a>.</p>
              </div>
            ) : null}
            {cadTab === 4 ? (
              <div className={styles.appPanel}>
                <h3 className={home.srOnly}>Open the STEP in FreeCAD</h3>
                <ol>
                  <li><span>Open the STL and switch to the <strong>Part</strong> workbench.</span></li>
                  <li><span>Select the mesh and choose <strong>Part → Create shape from mesh</strong>.</span></li>
                  <li><span>Select the new shape and choose <strong>Part → Convert to solid</strong>.</span></li>
                  <li><span>Choose <strong>Part → Create a copy → Refine shape</strong> to merge flat faces.</span></li>
                  <li><span>Select the refined solid and use <strong>File → Export</strong> to save it as STEP.</span></li>
                </ol>
                <p className={styles.tip}>FreeCAD is free and can convert an STL itself. Refine shape merges flat faces, but holes stay faceted. Ours fits holes as cylinders on clean meshes: {priceSentence}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className={styles.relatedBand} id="related" aria-labelledby="rel-title">
        <div className={home.wrap}>
          <div className={styles.splitHead}>
            <div>
              <p className={home.eyebrow}>Related conversions</p>
              <h2 className={home.platformTitle} id="rel-title">More STL and STEP tools</h2>
            </div>
            <Link className={styles.more} href="/tools/3d-cad-file-converter">All 74 conversion routes <RouteArrow /></Link>
          </div>
          <p className={styles.reverseNote}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
            <span>Going the other way? Use <Link href="/tools/convert-step-to-stl">STEP to STL</Link> to get a print-ready mesh.</span>
          </p>
          <div className={styles.hub}>
            <div className={styles.hubCard}>
              <h3>Convert STL to…</h3>
              <div className={styles.hubLinks}>
                {STL_ROUTES.map(([to, toCad]) => (
                  <Link key={to} href={`/tools/convert-stl-to-${to.toLowerCase()}`} aria-label={`STL to ${to}`}>
                    <FormatPair from="STL" to={to} toCad={toCad} />
                    <RouteArrow />
                  </Link>
                ))}
              </div>
            </div>
            <div className={styles.hubCard}>
              <h3>Also converting to STEP?</h3>
              <div className={styles.hubLinks}>
                {TO_STEP.map(([from]) => (
                  <Link key={from} href={`/tools/convert-${from.toLowerCase()}-to-step`} aria-label={`${from} to STEP`}>
                    <FormatPair from={from} to="STEP" toCad />
                    <RouteArrow />
                  </Link>
                ))}
                <Link href="/tools/3d-cad-file-converter"><b className={styles.allRoutes}>All routes</b><RouteArrow /></Link>
              </div>
            </div>
          </div>
          <div className={styles.hubTools}>
            <Link href="/tools/stl-file-viewer">Free STL viewer</Link>
            <Link href="/tools/step-file-viewer">Free STEP viewer</Link>
            <Link href="/tools/convert-step-to-2d-drawing">STEP to 2D drawing</Link>
            <Link href="/cad-services">Hire a CAD designer</Link>
          </div>
        </div>
      </section>

      <section className={styles.faqBand} id="faq" aria-labelledby="faq-title">
        <div className={`${home.wrap} ${styles.faqGrid}`}>
          <div className={styles.faqSide}>
            <p className={home.eyebrow}>FAQ</p>
            <h2 className={home.platformTitle} id="faq-title">STL to STEP questions</h2>
            <p>Editability, units, scans, pricing and your files.</p>
            <Link className={styles.ghostBtn} href="/contact-us">Contact us</Link>
            <small className={styles.faqUpdated}>Last updated 5 November 2026</small>
          </div>
          <div className={styles.faqList}>
            {faqs.map((item, index) => (
              <details key={item.question} className={styles.acc} open={index === 0}>
                <summary>{item.question}</summary>
                <div className={styles.accBody}>
                  {item.question === "Are my STL files private?" ? (
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
            <h2 id="cta-title">Turn your STL into a STEP file</h2>
            <p>Flat faces merged, and holes fitted as cylinders on clean meshes. {priceSentence}</p>
            <div className={styles.ctaBtns}>
              <a className={styles.ctaLight} href="#cad-file-converter">Convert STL to STEP</a>
              <Link className={styles.ctaOutline} href="/cad-services">Hire a CAD designer</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
