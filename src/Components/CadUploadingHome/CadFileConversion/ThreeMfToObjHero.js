"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import CadFileConversionContent from "./CadFileConversionContent";
import useConverterPriceDisplay from "@/Components/HomePages/shared/useConverterPriceDisplay";
import { getConverterFaqQuestions, withConverterFaqPrice } from "@/data/cadToolFaqs";
import home from "@/Components/HomePages/HomeLandingNew/HomeHero.module.css";
import styles from "./StepTo3dmHero.module.css";

const OUTPUTS = [
  { id: "STL", note: "binary mesh · mm" },
  { id: "STEP", note: "rebuilt CAD · mm" },
  { id: "OBJ", note: "mesh for rendering" },
  { id: "PLY", note: "binary mesh" },
  { id: "OFF", note: "plain-text mesh" },
  { id: "3DM", note: "Rhino mesh" },
  { id: "IGES", note: "rebuilt CAD · IGES" },
  { id: "BREP", note: "rebuilt · Open CASCADE" },
];

const ROUTES = [
  ["STL", false],
  ["STEP", true],
  ["PLY", false],
  ["OFF", false],
  ["3DM", false],
  ["IGES", true],
  ["BREP", true],
];

const FAQ_LINKS = [

];

function RouteArrow() {
  return (
    <span className={styles.arr} aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </span>
  );
}

function MoreArrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
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

function MeshPart({ shift = 0 }) {
  return (
    <g transform={shift ? `translate(${shift} 0)` : undefined}>
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
    </g>
  );
}

function StepViz() {
  return (
    <svg viewBox="0 0 560 200" role="img" aria-labelledby="3mf-to-obj-viz-title">
      <title id="3mf-to-obj-viz-title">A 3MF mesh and the same triangles as an OBJ mesh</title>
      <MeshPart shift={-324} />
      <MeshPart />
      <g transform="translate(280 92)">
        <circle r="24" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.4)" />
        <path d="M-9 0 H9 M3 -6 L9 0 L3 6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="118" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">3MF</text>
      <text x="118" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">mesh · units · objects</text>
      <text x="442" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">OBJ</text>
      <text x="442" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">same triangles · OBJ</text>
    </svg>
  );
}

function FaqBody({ item }) {
  if (item.question === "Are my 3MF files private?") {
    const [before] = item.answer.split(" Privacy Policy.");
    return <p>{before} <Link href="/privacy-policy">Privacy Policy</Link>.</p>;
  }
  const link = FAQ_LINKS.find((entry) => entry.question === item.question);
  if (link && item.answer.includes(link.phrase)) {
    const [before, after] = item.answer.split(link.phrase);
    return <p>{before}<Link href={link.href}>{link.phrase}</Link>{after}</p>;
  }
  return <p>{item.answer}</p>;
}

export default function ThreeMfToObjHero() {
  const router = useRouter();
  const { priceLabel } = useConverterPriceDisplay();
  const priceSentence = `First 2 files free, any size up to 300 MB. After that, ${priceLabel ? `${priceLabel} or ` : ""}1 credit per file.`;
  const faqs = withConverterFaqPrice(getConverterFaqQuestions("3mf-to-obj"), priceLabel);

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
                <li><span aria-current="page">3MF to OBJ</span></li>
              </ol>
            </nav>
            <h1 className={home.title} id="hero-title">Convert 3MF to OBJ <span>online</span></h1>
            <p className={`${home.lede} ${styles.lede}`}>Upload a .3mf and download one OBJ mesh in millimetres, ready for Blender, Unity, Unreal Engine or a web viewer.  <span className={styles.price}>{priceSentence}</span></p>
          </div>
          <div className={`${home.card} ${styles.slot}`} id="cad-file-converter">
            <div className={home.head}>
              <h2>3MF to OBJ converter</h2>
              <span className={`${home.secure} ${styles.hideNarrow}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
                Plain-text .obj
              </span>
            </div>
            <div className={styles.route}>
              <div className={styles.routeCell}>
                <span className={`${styles.badge} ${styles.badgeMesh}`}>3MF</span>
                <div><b>From 3MF</b><small>.3mf · units read</small></div>
              </div>
              <span className={styles.arrow} aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              <div className={styles.routeCell}>
                <span className={`${styles.badge} ${styles.badgeMesh}`}>OBJ</span>
                <div className={styles.routeCopy}>
                  <label className={home.srOnly} htmlFor="3mf-to-obj-output">Convert to</label>
                  <select id="3mf-to-obj-output" className={styles.select} value="OBJ" onChange={(event) => { const next = event.target.value; if (next !== "OBJ") router.push(`/tools/convert-3mf-to-${next.toLowerCase()}`); }}>
                    {OUTPUTS.map((option) => <option key={option.id} value={option.id}>{option.id}</option>)}
                  </select>
                  <small>mesh for rendering</small>
                </div>
              </div>
            </div>
            <CadFileConversionContent convert conversionParams="3mf-to-obj" designVariant="step3dmHero" />
            <p className={styles.reverse}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
              <span>Have an OBJ file? We also convert <Link href="/tools/convert-obj-to-3mf">OBJ to 3MF</Link>.</span>
            </p>
          </div>
          <div className={styles.art}>
            <ul className={`${home.ticks} ${styles.ticks}`} aria-label="Key facts">
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>Files up to 300 MB</li>
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Units converted to mm</li>
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 3 8v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8M3 16l9-8 9 8" /></svg>Opens in Blender and Unity</li>
            </ul>
            <figure className={`${home.viz} ${styles.viz}`}><StepViz /></figure>
          </div>
        </div>
      </section>

      <section className={styles.glance} id="at-a-glance" aria-labelledby="glance-title">
        <div className={home.wrap}>
          <h2 id="glance-title" className={home.srOnly}>3MF to OBJ converter at a glance</h2>
          <dl className={styles.glanceList}>
            <div><dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>Converts</dt><dd>3MF from any slicer or CAD program to OBJ.</dd></div>
            <div><dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg>You get</dt><dd>One OBJ file in millimetres, with every object of the 3MF in its place as one mesh object. No .mtl material file.</dd></div>
            <div><dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1117.4 0" /></svg>File size</dt><dd>Up to 300 MB. We email you when the file is ready.</dd></div>
            <div><dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>Price</dt><dd>{priceSentence}</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.how} id="how-to" aria-labelledby="how-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>How to convert 3MF to OBJ</p>
            <h2 className={home.platformTitle} id="how-title">3MF to OBJ in <span className={home.grad}>four steps</span></h2>
          </div>
          <div className={styles.answer}><p><b>To convert 3MF to OBJ,</b> sign in, upload the .3mf above and download the .obj. Every object in the build comes across in its place as one mesh object in millimetres, which Blender, Unity, Unreal Engine and Three.js import. Colours and materials stay in the 3MF.</p></div>
          <ol className={styles.steps}>
            <li><span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></svg></span><h3>Upload</h3><p>Sign in, then drop a .3mf file up to 300 MB onto the converter.</p></li>
            <li><span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15" /></svg></span><h3>Convert</h3><p>Every object is read in its place, converted to millimetres and written as one OBJ mesh.</p></li>
            <li><span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg></span><h3>Download</h3><p>We email you when the OBJ is ready. Download one .obj file.</p></li>
            <li><span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1117.4 0" /></svg></span><h3>Import</h3><p>Blender reads 1 unit as 1 metre, so set the importer&apos;s Scale to 0.001.</p></li>
          </ol>
        </div>
      </section>

      <section className={styles.changes} id="what-changes" aria-labelledby="wc-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>3MF vs OBJ</p>
            <h2 className={home.platformTitle} id="wc-title">What changes when 3MF becomes OBJ</h2>
            <p>3MF stores meshes plus units, objects and colours. OBJ stores polygons.</p>
          </div>
          <div className={styles.keepLose}>
            <article className={styles.keep}><h3><span className={styles.mark} aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg></span>What the OBJ keeps</h3><ul><li>Every triangle of every object</li><li>Each object&apos;s position</li><li>The size, converted to millimetres</li></ul></article>
            <article className={styles.lose}><h3><span className={styles.mark} aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg></span>What it leaves behind</h3><ul><li>Separate objects: they&apos;re merged into one mesh</li><li>Object names, colours and materials (no .mtl file is written)</li><li>The unit label (OBJ has no unit field)</li></ul></article>
          </div>
          <p className={styles.honest}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></svg><span>Need separate pieces? In Blender, Separate › By Loose Parts splits the mesh back into bodies.</span></p>
        </div>
      </section>

      <section className={styles.meshNote} id="what-we-read" aria-labelledby="rs-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>What we read from your 3MF</p>
            <h2 className={home.platformTitle} id="rs-title">Every object, in one mesh</h2>
            <p>3MF holds more than geometry. Here&apos;s what comes across and what stays behind.</p>
          </div>
          <div className={styles.choose}>
            <div><span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>3MF</span><b>Every object, in place</b></span><p>Every object in the build comes across in its position, merged into one mesh.</p></div>
            <div><span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>3MF</span><b>Units converted</b></span><p>3MF stores its unit. We convert it to millimetres, so an inch 3MF comes out at the right size.</p></div>
            <div><span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>OBJ</span><b>Geometry only</b></span><p>Object names, colours, painted regions, print settings and plates stay in the 3MF.</p></div>
          </div>
          <p className={styles.unitNote}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></svg><span>We don&apos;t repair, smooth or reduce the mesh. Slicer projects can hold modifier meshes and support blockers; we read every mesh, so those come through as geometry too.</span></p>
          <div className={styles.fixes}><div><b>For renders</b><span>Shade Smooth in Blender softens the facets on screen without adding triangles.</span></div><div><b>For games and the web</b><span>Cut the triangle count after import, for example with Blender&apos;s Decimate modifier.</span></div><div><b>For materials</b><span>Assign materials and textures in your 3D tool after import.</span></div></div>
        </div>
      </section>

      <section className={styles.compareBand} id="compare" aria-labelledby="fmt-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>Choose the right format</p>
            <h2 className={home.platformTitle} id="fmt-title">3MF vs OBJ vs STL</h2>
            <p>Pick by what the next program needs.</p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.formatTable}>
              <caption className={home.srOnly}>3MF, OBJ, STL compared</caption>
              <thead><tr><th scope="col" /><th scope="col"><span className={`${styles.badge} ${styles.badgeMesh}`}>3MF</span></th><th scope="col" className={styles.hl}><span className={`${styles.badge} ${styles.badgeMesh}`}>OBJ</span></th><th scope="col"><span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span></th></tr></thead>
              <tbody>
                <tr><th scope="row">Geometry</th><td>Triangle meshes</td><td className={styles.hl}>Polygons (ours are triangles)</td><td>Triangles</td></tr>
                <tr><th scope="row">Units</th><td>Stored</td><td className={styles.hl}>Not stored (ours is mm)</td><td>Not stored</td></tr>
                <tr><th scope="row">Colours and materials</th><td>Yes</td><td className={styles.hl}>Separate .mtl file (we don&apos;t write one)</td><td>No standard colour data</td></tr>
                <tr><th scope="row">Best for</th><td>Modern slicers</td><td className={styles.hl}>Rendering, games and web 3D</td><td>3D printing</td></tr>
              </tbody>
            </table>
          </div>
          <div className={styles.choose}>
            <div><span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>OBJ</span><b>Convert to OBJ when</b></span><p>The model is going into Blender, a game engine, a renderer or a web viewer.</p><span className={styles.more}>You’re in the right place</span></div>
            <Link href="/tools/convert-3mf-to-stl" aria-label="3MF to STL for printing"><span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span><b>Choose STL when</b></span><p>The part is going to another slicer or a print service.</p><span className={styles.more}>3MF to STL for printing <MoreArrow /></span></Link>
            <Link href="/tools/convert-3mf-to-step" aria-label="3MF to STEP for CAD"><span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>STEP</span><b>Choose STEP when</b></span><p>The part needs editing in CAD.</p><span className={styles.more}>3MF to STEP for CAD <MoreArrow /></span></Link>
          </div>
        </div>
      </section>

      <section className={styles.openBand} id="open-in" aria-labelledby="open-title">
        <div className={home.wrap}>
          <div className={styles.splitHead}><div><p className={home.eyebrow}>Open it anywhere</p><h2 className={home.platformTitle} id="open-title">Ready for render and game tools</h2></div><p>OBJ opens in almost every 3D program.</p></div>
          <div className={styles.apps}>
            <div><b>Blender</b><span className={styles.yes}>Imports OBJ</span></div>
            <div><b>Unity</b><span className={styles.yes}>Imports OBJ</span></div>
            <div><b>Unreal Engine</b><span className={styles.yes}>Imports OBJ</span></div>
            <div><b>3ds Max</b><span className={styles.yes}>Imports OBJ</span></div>
            <div><b>Maya</b><span className={styles.yes}>Imports OBJ</span></div>
            <div><b>Three.js</b><span className={styles.yes}>OBJLoader</span></div>
          </div>
          <p className={styles.unitNote}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></svg><span>OBJ has no unit field. Our OBJ is in millimetres, and Blender reads 1 unit as 1 metre, so a 100 mm part comes in 100 m long. Set <b>Scale</b> to 0.001 in the OBJ importer.</span></p>
        </div>
      </section>

      <section className={styles.relatedBand} id="related" aria-labelledby="rel-title">
        <div className={home.wrap}>
          <div className={styles.splitHead}>
            <div><p className={home.eyebrow}>Related conversions</p><h2 className={home.platformTitle} id="rel-title">More 3MF and OBJ tools</h2></div>
            <Link className={styles.more} href="/tools/3d-cad-file-converter">All 74 conversion routes <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
          </div>
          <p className={styles.reverseNote}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg><span>Going the other way? We also convert <Link href="/tools/convert-obj-to-3mf">OBJ to 3MF</Link>. The OBJ is read as millimetres and written as one 3MF object.</span></p>
          <div className={styles.hub}>
            <div className={styles.hubCard}>
              <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>Convert 3MF to…</h3>
              <div className={styles.hubLinks}>
                {ROUTES.map(([to, toCad]) => (
                  <Link key={to} href={`/tools/convert-3mf-to-${to.toLowerCase()}`} aria-label={`3MF to ${to}`}>
                    <FormatPair from="3MF" to={to} toCad={toCad} />
                    <RouteArrow />
                  </Link>
                ))}
              </div>
            </div>
            <div className={styles.hubCard}>
              <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 3 8v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8M3 16l9-8 9 8" /></svg>Also converting to OBJ?</h3>
              <div className={`${styles.hubLinks} ${styles.hubStack}`}>
                <Link href="/tools/convert-stl-to-obj"><FormatPair from="STL" to="OBJ" fromCad={false} toCad={false} /><span className={styles.sib}>STL files to OBJ</span><RouteArrow /></Link>
                <Link href="/tools/convert-ply-to-obj"><FormatPair from="PLY" to="OBJ" fromCad={false} toCad={false} /><span className={styles.sib}>PLY meshes to OBJ</span><RouteArrow /></Link>
                <Link href="/tools/3d-cad-file-converter"><b className={styles.allRoutes}>All routes</b><RouteArrow /></Link>
              </div>
            </div>
          </div>
          <div className={styles.hubTools}>
            <Link href="/tools/3mf-file-viewer"><span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg></span>Free 3MF viewer</Link>
            <Link href="/tools/obj-file-viewer"><span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg></span>Free OBJ viewer</Link>
            <Link href="/tools/3d-cad-viewer"><span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg></span>3D CAD viewer</Link>
            <Link href="/cad-services"><span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" /></svg></span>Hire a CAD designer</Link>
          </div>
        </div>
      </section>

      <section className={styles.faqBand} id="faq" aria-labelledby="faq-title">
        <div className={`${home.wrap} ${styles.faqGrid}`}>
          <div className={styles.faqSide}>
            <p className={home.eyebrow}>FAQ</p>
            <h2 className={home.platformTitle} id="faq-title">3MF to OBJ questions</h2>
            <p>Objects, units, materials, pricing and your files.</p>
            <Link className={styles.ghostBtn} href="/contact-us">Contact us</Link>
            <small className={styles.faqUpdated}>Last updated 14 November 2026</small>
          </div>
          <div className={styles.faqList}>
            {faqs.map((item, index) => (
              <details key={item.question} className={styles.acc} open={index === 0}>
                <summary>{item.question}</summary>
                <div className={styles.accBody}><FaqBody item={item} /></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.closeBand} aria-labelledby="cta-title">
        <div className={home.wrap}>
          <div className={styles.cta}>
            <h2 id="cta-title">Convert your 3MF file to OBJ</h2>
            <p>One OBJ mesh in millimetres, ready for Blender, Unity and renderers.  {priceSentence}</p>
            <div className={styles.ctaBtns}>
              <a className={styles.ctaLight} href="#cad-file-converter">Convert 3MF to OBJ</a>
              <Link className={styles.ctaOutline} href="/tools/3d-cad-file-converter">See all converters</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
