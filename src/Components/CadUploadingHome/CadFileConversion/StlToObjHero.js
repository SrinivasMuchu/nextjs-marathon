"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import CadFileConversionContent from "./CadFileConversionContent";
import useConverterPriceDisplay from "@/Components/HomePages/shared/useConverterPriceDisplay";
import { getConverterFaqQuestions, withConverterFaqPrice } from "@/data/cadToolFaqs";
import home from "@/Components/HomePages/HomeLandingNew/HomeHero.module.css";
import styles from "./StepTo3dmHero.module.css";

const OUTPUTS = [
  { id: "STEP", note: "rebuilt CAD · mm" },
  { id: "3MF", note: "one object · mm" },
  { id: "OBJ", note: "mesh for rendering" },
  { id: "IGES", note: "rebuilt CAD · IGES" },
  { id: "PLY", note: "binary mesh" },
  { id: "OFF", note: "plain-text mesh" },
  { id: "BREP", note: "rebuilt · Open CASCADE" },
  { id: "3DM", note: "Rhino mesh" },
];

const STL_ROUTES = [
  ["STEP", true],
  ["3MF", false],
  ["IGES", true],
  ["PLY", false],
  ["OFF", false],
  ["BREP", true],
  ["3DM", false],
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
    <svg viewBox="0 0 560 200" role="img" aria-labelledby="stl-obj-viz-title">
      <title id="stl-obj-viz-title">An STL mesh and the same triangles as an OBJ mesh</title>
      <MeshPart shift={-324} />
      <MeshPart />
      <g transform="translate(280 92)">
        <circle r="24" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.4)" />
        <path d="M-9 0 H9 M3 -6 L9 0 L3 6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="118" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">STL</text>
      <text x="118" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">triangle mesh · no units</text>
      <text x="442" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">OBJ</text>
      <text x="442" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">same triangles · OBJ</text>
    </svg>
  );
}

function FaqBody({ item }) {
  if (item.question === "Are my STL files private?") {
    const [before] = item.answer.split(" Privacy Policy.");
    return (
      <p>
        {before}{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    );
  }
  return <p>{item.answer}</p>;
}

export default function StlToObjHero() {
  const router = useRouter();
  const { priceLabel } = useConverterPriceDisplay();
  const priceSentence = `First 2 files free, any size up to 300 MB. After that, ${priceLabel ? `${priceLabel} or ` : ""}1 credit per file.`;
  const faqs = withConverterFaqPrice(getConverterFaqQuestions("stl-to-obj"), priceLabel);

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
                <li><span aria-current="page">STL to OBJ</span></li>
              </ol>
            </nav>
            <h1 className={home.title} id="hero-title">
              Convert STL to OBJ <span>online</span>
            </h1>
            <p className={`${home.lede} ${styles.lede}`}>
              Upload an .stl and download an OBJ with the same triangles, ready for Blender, Unity, Unreal Engine or a web viewer.{" "}
              <span className={styles.price}>{priceSentence}</span>
            </p>
          </div>

          <div className={`${home.card} ${styles.slot}`} id="cad-file-converter">
            <div className={home.head}>
              <h2>STL to OBJ converter</h2>
              <span className={`${home.secure} ${styles.hideNarrow}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
                Plain-text .obj
              </span>
            </div>
            <div className={styles.route}>
              <div className={styles.routeCell}>
                <span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span>
                <div>
                  <b>From STL</b>
                  <small>binary or ASCII</small>
                </div>
              </div>
              <span className={styles.arrow} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
              <div className={styles.routeCell}>
                <span className={`${styles.badge} ${styles.badgeMesh}`}>OBJ</span>
                <div className={styles.routeCopy}>
                  <label className={home.srOnly} htmlFor="stl-to-obj-output">Convert to</label>
                  <select
                    id="stl-to-obj-output"
                    className={styles.select}
                    value="OBJ"
                    onChange={(event) => {
                      const next = event.target.value;
                      if (next !== "OBJ") router.push(`/tools/convert-stl-to-${next.toLowerCase()}`);
                    }}
                  >
                    {OUTPUTS.map((option) => (
                      <option key={option.id} value={option.id}>{option.id}</option>
                    ))}
                  </select>
                  <small>mesh for rendering</small>
                </div>
              </div>
            </div>
            <CadFileConversionContent convert conversionParams="stl-to-obj" designVariant="step3dmHero" />
            <p className={styles.reverse}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
              <span>Have an OBJ file? We also convert <Link href="/tools/convert-obj-to-stl">OBJ to STL</Link>.</span>
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
                Same triangles, no repair
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 3 8v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8M3 16l9-8 9 8" /></svg>
                Opens in Blender and Unity
              </li>
            </ul>
            <figure className={`${home.viz} ${styles.viz}`}><StepViz /></figure>
          </div>
        </div>
      </section>

      <section className={styles.glance} id="at-a-glance" aria-labelledby="glance-title">
        <div className={home.wrap}>
          <h2 id="glance-title" className={home.srOnly}>STL to OBJ converter at a glance</h2>
          <dl className={styles.glanceList}>
            <div>
              <dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>Converts</dt>
              <dd>STL (binary or ASCII) to OBJ.</dd>
            </div>
            <div>
              <dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg>You get</dt>
              <dd>One OBJ file with the same triangles as your STL, as one mesh object. No .mtl material file.</dd>
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
            <p className={home.eyebrow}>How to convert STL to OBJ</p>
            <h2 className={home.platformTitle} id="how-title">STL to OBJ in <span className={home.grad}>four steps</span></h2>
          </div>
          <div className={styles.answer}>
            <p><b>To convert STL to OBJ,</b> sign in, upload the .stl above and download the .obj. You get the same triangles as one mesh object that Blender, Unity, Unreal Engine and Three.js import. We don&apos;t repair, smooth or reduce the mesh, so the OBJ holds exactly what was in the STL.</p>
          </div>
          <ol className={styles.steps}>
            <li>
              <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></svg></span>
              <h3>Upload</h3>
              <p>Sign in, then drop a binary or ASCII .stl file up to 300 MB onto the converter.</p>
            </li>
            <li>
              <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15" /></svg></span>
              <h3>Convert</h3>
              <p>The STL&apos;s triangles are written to OBJ as one mesh object.</p>
            </li>
            <li>
              <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg></span>
              <h3>Download</h3>
              <p>We email you when the OBJ is ready. Download one .obj file.</p>
            </li>
            <li>
              <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1117.4 0" /></svg></span>
              <h3>Import</h3>
              <p>Blender reads 1 unit as 1 metre, so set the importer&apos;s Scale to 0.001 for a millimetre model.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className={styles.changes} id="what-changes" aria-labelledby="wc-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>STL vs OBJ</p>
            <h2 className={home.platformTitle} id="wc-title">What changes when STL becomes OBJ</h2>
            <p>Both formats store meshes. OBJ is the one render and game tools expect.</p>
          </div>
          <div className={styles.keepLose}>
            <article className={styles.keep}>
              <h3>
                <span className={styles.mark} aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg></span>
                What the OBJ keeps
              </h3>
              <ul>
                <li>Every triangle of the mesh</li>
                <li>The coordinates, unchanged</li>
                <li>Every body, in one mesh you can split by loose parts</li>
              </ul>
            </article>
            <article className={styles.lose}>
              <h3>
                <span className={styles.mark} aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg></span>
                What it leaves behind
              </h3>
              <ul>
                <li>A unit label (neither format has one)</li>
                <li>Materials (no .mtl file is written)</li>
                <li>Nothing is repaired: holes and flipped triangles stay as they were</li>
              </ul>
            </article>
          </div>
          <p className={styles.honest}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></svg>
            <span>Need to edit the shape in CAD? <Link href="/tools/convert-stl-to-step">STL to STEP</Link> rebuilds flat areas as single faces. OBJ keeps the triangles as they are.</span>
          </p>
        </div>
      </section>

      <section className={styles.meshNote} id="same-mesh" aria-labelledby="rs-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>What happens to your mesh</p>
            <h2 className={home.platformTitle} id="rs-title">The same triangles, in OBJ</h2>
            <p>This route changes the file format, not the mesh.</p>
          </div>
          <div className={styles.choose}>
            <div>
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span><b>Nothing is changed</b></span>
              <p>We don&apos;t repair, smooth, reduce or remesh. Every triangle is written to the OBJ as it was.</p>
            </div>
            <div>
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>OBJ</span><b>One mesh object</b></span>
              <p>An STL is one list of triangles, so the OBJ holds one mesh object. Split it by loose parts in Blender if you need pieces.</p>
            </div>
            <div>
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>OBJ</span><b>Coordinates as they were</b></span>
              <p>STL has no units, and OBJ doesn&apos;t either: the numbers carry across unchanged. A millimetre STL makes a millimetre OBJ.</p>
            </div>
          </div>
          <p className={styles.unitNote}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></svg>
            <span>If the STL has holes or flipped triangles, the output has them too. The quality report shows whether the source and the output are watertight.</span>
          </p>
          <div className={styles.fixes}>
            <div>
              <b>For renders</b>
              <span>Shade Smooth in Blender softens the facets on screen without adding triangles.</span>
            </div>
            <div>
              <b>For games and the web</b>
              <span>Cut the triangle count after import, for example with Blender&apos;s Decimate modifier.</span>
            </div>
            <div>
              <b>For materials</b>
              <span>Assign materials and textures in your 3D tool after import.</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.compareBand} id="compare" aria-labelledby="fmt-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>Choose the right format</p>
            <h2 className={home.platformTitle} id="fmt-title">STL vs OBJ vs 3MF</h2>
            <p>Pick by what the next program needs.</p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.formatTable}>
              <caption className={home.srOnly}>STL, OBJ, 3MF compared</caption>
              <thead>
                <tr>
                  <th scope="col" />
                  <th scope="col"><span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span></th>
                  <th scope="col" className={styles.hl}><span className={`${styles.badge} ${styles.badgeMesh}`}>OBJ</span></th>
                  <th scope="col"><span className={`${styles.badge} ${styles.badgeMesh}`}>3MF</span></th>
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">Geometry</th><td>Triangles</td><td className={styles.hl}>Polygons (ours are triangles)</td><td>Triangle meshes</td></tr>
                <tr><th scope="row">Units</th><td>Not stored</td><td className={styles.hl}>Not stored</td><td>Stored</td></tr>
                <tr><th scope="row">Colours and materials</th><td>No standard colour data</td><td className={styles.hl}>Separate .mtl file (we don&apos;t write one)</td><td>Display colours</td></tr>
                <tr><th scope="row">Best for</th><td>3D printing</td><td className={styles.hl}>Rendering, games and web 3D</td><td>Modern slicers</td></tr>
              </tbody>
            </table>
          </div>
          <div className={styles.choose}>
            <div>
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>OBJ</span><b>Convert to OBJ when</b></span>
              <p>The mesh is going into Blender, a game engine, a renderer or a web viewer.</p>
              <span className={styles.more}>You&apos;re in the right place</span>
            </div>
            <Link href="/tools/convert-stl-to-step" aria-label="STL to STEP for CAD">
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>STEP</span><b>Choose STEP when</b></span>
              <p>You need to edit the part in CAD.</p>
              <span className={styles.more}>STL to STEP for CAD <MoreArrow /></span>
            </Link>
            <Link href="/tools/convert-stl-to-3mf" aria-label="STL to 3MF for slicers">
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>3MF</span><b>Choose 3MF when</b></span>
              <p>The mesh is going to a slicer and you want the units in the file.</p>
              <span className={styles.more}>STL to 3MF for slicers <MoreArrow /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.openBand} id="open-in" aria-labelledby="open-title">
        <div className={home.wrap}>
          <div className={styles.splitHead}>
            <div>
              <p className={home.eyebrow}>Open it anywhere</p>
              <h2 className={home.platformTitle} id="open-title">Ready for render and game tools</h2>
            </div>
            <p>OBJ opens in almost every 3D program.</p>
          </div>
          <div className={styles.apps}>
            <div><b>Blender</b><span className={styles.yes}>Imports OBJ</span></div>
            <div><b>Unity</b><span className={styles.yes}>Imports OBJ</span></div>
            <div><b>Unreal Engine</b><span className={styles.yes}>Imports OBJ</span></div>
            <div><b>3ds Max</b><span className={styles.yes}>Imports OBJ</span></div>
            <div><b>Maya</b><span className={styles.yes}>Imports OBJ</span></div>
            <div><b>Three.js</b><span className={styles.yes}>OBJLoader</span></div>
          </div>
          <p className={styles.unitNote}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></svg>
            <span>OBJ has no unit field. Blender reads 1 unit as 1 metre, so a 100 mm part comes in 100 m long. Set <b>Scale</b> to 0.001 in the OBJ importer.</span>
          </p>
        </div>
      </section>

      <section className={styles.relatedBand} id="related" aria-labelledby="rel-title">
        <div className={home.wrap}>
          <div className={styles.splitHead}>
            <div>
              <p className={home.eyebrow}>Related conversions</p>
              <h2 className={home.platformTitle} id="rel-title">More STL and OBJ tools</h2>
            </div>
            <Link className={styles.more} href="/tools/3d-cad-file-converter">
              All 74 conversion routes
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
          <p className={styles.reverseNote}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
            <span>Going the other way? We also convert <Link href="/tools/convert-obj-to-stl">OBJ to STL</Link>. Polygons are split into triangles; nothing else changes.</span>
          </p>
          <div className={styles.hub}>
            <div className={styles.hubCard}>
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>
                Convert STL to…
              </h3>
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
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 3 8v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8M3 16l9-8 9 8" /></svg>
                Also converting to OBJ?
              </h3>
              <div className={`${styles.hubLinks} ${styles.hubStack}`}>
                <Link href="/tools/convert-ply-to-obj">
                  <FormatPair from="PLY" to="OBJ" />
                  <span className={styles.sib}>PLY meshes to OBJ</span>
                  <RouteArrow />
                </Link>
                <Link href="/tools/convert-3mf-to-obj">
                  <FormatPair from="3MF" to="OBJ" />
                  <span className={styles.sib}>3MF files to OBJ</span>
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
            <Link href="/tools/stl-file-viewer">
              <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg></span>
              Free STL viewer
            </Link>
            <Link href="/tools/obj-file-viewer">
              <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg></span>
              Free OBJ viewer
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
            <h2 className={home.platformTitle} id="faq-title">STL to OBJ questions</h2>
            <p>Units, materials, triangle counts, pricing and your files.</p>
            <Link className={styles.ghostBtn} href="/contact-us">Contact us</Link>
            <small className={styles.faqUpdated}>Last updated 13 November 2026</small>
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
            <h2 id="cta-title">Convert your STL file to OBJ</h2>
            <p>The same triangles as one OBJ mesh, ready for Blender, Unity and renderers. {priceSentence}</p>
            <div className={styles.ctaBtns}>
              <a className={styles.ctaLight} href="#cad-file-converter">Convert STL to OBJ</a>
              <Link className={styles.ctaOutline} href="/tools/3d-cad-file-converter">See all converters</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
