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
  ["OBJ", false],
  ["PLY", false],
  ["OFF", false],
  ["IGES", true],
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

function FaqBody({ item }) {
  if (item.question === "Are my STEP files private?") {
    return (
      <p>
        {item.answer.replace(" Privacy Policy.", "")}{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    );
  }
  if (item.question === "Why do round holes look faceted?") {
    const [before, after] = item.answer.split("how to keep holes smooth");
    return (
      <p>
        {before}
        <Link href="/tools/convert-step-to-stl">how to keep holes smooth</Link>
        {after}
      </p>
    );
  }
  return <p>{item.answer}</p>;
}

function StepViz() {
  return (
    <svg viewBox="0 0 560 200" role="img" aria-labelledby="step-3mf-viz-title">
      <title id="step-3mf-viz-title">The same part as an exact STEP solid and as a 3MF mesh</title>
      <defs>
        <linearGradient id="step-3mf-cyl" x1="0" x2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#F1EAFE" />
          <stop offset="0.8" stopColor="#C9B3F7" />
          <stop offset="1" stopColor="#E6DAFD" />
        </linearGradient>
      </defs>
      <path d="M40 58 V120 A78 24 0 0 0 196 120 V58 Z" fill="url(#step-3mf-cyl)" />
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
      <text x="442" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">3MF</text>
      <text x="442" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">mesh · parts · units</text>
    </svg>
  );
}

export default function StepTo3mfHero() {
  const router = useRouter();
  const { priceLabel } = useConverterPriceDisplay();
  const priceSentence = `First 2 files free, any size up to 300 MB. After that, ${priceLabel ? `${priceLabel} or ` : ""}1 credit per file.`;
  const faqs = withConverterFaqPrice(getConverterFaqQuestions("step-to-3mf"), priceLabel);

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
              <li><span aria-current="page">STEP to 3MF</span></li>
            </ol>
          </nav>
          <h1 className={home.title} id="hero-title">
            Convert STEP or STP to 3MF <span>online</span>
          </h1>
          <p className={`${home.lede} ${styles.lede}`}>
            Upload a .step or .stp file and download a 3MF with one object per part, in millimetres, ready for Bambu Studio, PrusaSlicer, OrcaSlicer or Cura.{" "}
            <span className={styles.price}>{priceSentence}</span>
          </p>
        </div>

        <div className={`${home.card} ${styles.slot}`} id="cad-file-converter">
          <div className={home.head}>
            <h2>STEP to 3MF converter</h2>
            <span className={`${home.secure} ${styles.hideNarrow}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>
              One object per part
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
              <span className={`${styles.badge} ${styles.badgeMesh}`}>3MF</span>
              <div className={styles.routeCopy}>
                <label className={home.srOnly} htmlFor="step-to-3mf-output">Convert to</label>
                <select
                  id="step-to-3mf-output"
                  className={styles.select}
                  value="3MF"
                  onChange={(event) => {
                    const next = event.target.value;
                    if (next !== "3MF") router.push(`/tools/convert-step-to-${next.toLowerCase()}`);
                  }}
                >
                  {OUTPUTS.map((option) => (
                    <option key={option.id} value={option.id}>{option.id}</option>
                  ))}
                </select>
                <small>one object per part · mm</small>
              </div>
            </div>
          </div>

          <CadFileConversionContent
            convert
            conversionParams="step-to-3mf"
            designVariant="step3dmHero"
          />

          <p className={styles.reverse}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
            <span>
              Have a 3MF file? You can also <Link href="/tools/convert-3mf-to-step">turn 3MF files into STEP</Link>.
            </span>
          </p>
        </div>

        <div className={styles.art}>
          <ul className={`${home.ticks} ${styles.ticks}`} aria-label="Key facts">
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
              Files up to 300 MB
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>
              One object per part
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>
              Units in millimetres
            </li>
          </ul>
          <figure className={`${home.viz} ${styles.viz}`}>
            <StepViz />
          </figure>
        </div>
      </div>
    </section>

    <section className={styles.glance} id="at-a-glance" aria-labelledby="glance-title">
      <div className={home.wrap}>
        <h2 id="glance-title" className={home.srOnly}>STEP to 3MF converter at a glance</h2>
        <dl className={styles.glanceList}>
          <div>
            <dt>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
              Converts
            </dt>
            <dd>STEP and STP (AP203, AP214, AP242) to 3MF.</dd>
          </div>
          <div>
            <dt>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg>
              You get
            </dt>
            <dd>One 3MF file with one object per solid, in millimetres, meshed at a 0.15 mm chord tolerance. Part names and colours can come across when the STEP has them.</dd>
          </div>
          <div>
            <dt>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1117.4 0" /></svg>
              File size
            </dt>
            <dd>Up to 300 MB. We email you when the file is ready.</dd>
          </div>
          <div>
            <dt>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.6 13.4 13.4 20.6a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>
              Price
            </dt>
            <dd>{priceSentence}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section className={styles.how} id="how-to" aria-labelledby="how-title">
      <div className={home.wrap}>
        <div className={home.sh}>
          <p className={home.eyebrow}>How to convert STEP to 3MF</p>
          <h2 className={home.platformTitle} id="how-title">STEP to 3MF in <span className={home.grad}>four steps</span></h2>
        </div>
        <div className={styles.answer}>
          <p><b>To convert STEP or STP to 3MF,</b> sign in, upload your .step or .stp file above and download the .3mf. Each solid becomes its own object and the file stores millimetres. Part names and colours can come across too, when the STEP has them. STP to 3MF works the same way.</p>
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
            <p>Each solid is meshed at a 0.15 mm chord tolerance and written as its own object.</p>
          </li>
          <li>
            <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg></span>
            <h3>Download</h3>
            <p>We email you when the 3MF is ready. Download one .3mf file.</p>
          </li>
          <li>
            <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V3h12v6M6 18H4a1 1 0 01-1-1v-6a2 2 0 012-2h14a2 2 0 012 2v6a1 1 0 01-1 1h-2" /><rect x="6" y="14" width="12" height="7" rx="1" /></svg></span>
            <h3>Slice</h3>
            <p>Each part is a separate object you can arrange, scale or assign a filament to.</p>
          </li>
        </ol>
      </div>
    </section>

    <section className={styles.changes} id="what-changes" aria-labelledby="wc-title">
      <div className={home.wrap}>
        <div className={home.sh}>
          <p className={home.eyebrow}>STEP vs 3MF</p>
          <h2 className={home.platformTitle} id="wc-title">What changes when STEP becomes 3MF</h2>
          <p>STEP stores exact CAD geometry. 3MF stores meshes, units and part information.</p>
        </div>
        <div className={styles.keepLose}>
          <article className={styles.keep}>
            <h3>
              <span className={styles.mark} aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg></span>
              What the 3MF keeps
            </h3>
            <ul>
              <li>The outer shape of every solid, as its own object</li>
              <li>Every part in its assembled position</li>
              <li>Units: millimetres, stored in the file</li>
              <li>Part names and a display colour per part can come across, when the STEP has them</li>
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
              <li>The assembly hierarchy (parts come in as a flat list)</li>
              <li>Face-by-face colours (each part takes one colour)</li>
            </ul>
          </article>
        </div>
        <p className={styles.honest}>
          <InfoIcon />
          <span>Check part names and colours in your slicer&apos;s object list before you print. If our part-by-part writer can&apos;t process the file, you get one uncoloured object named after the file.</span>
        </p>
      </div>
    </section>

    <section className={styles.meshNote} id="parts-colours" aria-labelledby="rs-title">
      <div className={home.wrap}>
        <div className={home.sh}>
          <p className={home.eyebrow}>Built for slicers</p>
          <h2 className={home.platformTitle} id="rs-title">Separate parts, ready to print</h2>
          <p>3MF carries what STL can&apos;t: separate objects and units, with room for names and colours. Curves still become triangles.</p>
        </div>
        <div className={styles.leadCards}>
          <div>
            <b>One object per part</b>
            <span>Each solid becomes its own object, so you can arrange, scale or assign filaments per part in the slicer.</span>
          </div>
          <div>
            <b>Names, when the STEP has them</b>
            <span>Part names in the STEP can become object names in the slicer&apos;s object list. Check them after import.</span>
          </div>
          <div>
            <b>Colours, when the STEP has them</b>
            <span>A part&apos;s STEP colour can come across as its 3MF display colour. Parts coloured face by face take their first face&apos;s colour.</span>
          </div>
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
            <b>For most FDM prints</b>
            <span>The facets are usually finer than the printer shows.</span>
          </div>
          <div>
            <b>For resin prints or visible curves</b>
            <span>Export from CAD at a 0.01-0.03 mm deviation and a 5-10° angle, or import the STEP into your slicer directly.</span>
          </div>
          <div>
            <b>Slicers that open STEP</b>
            <span>Bambu Studio, PrusaSlicer and OrcaSlicer can import a STEP and mesh it themselves.</span>
          </div>
        </div>
      </div>
    </section>

    <section className={styles.compareBand} id="compare" aria-labelledby="fmt-title">
      <div className={home.wrap}>
        <div className={home.sh}>
          <p className={home.eyebrow}>Choose the right format</p>
          <h2 className={home.platformTitle} id="fmt-title">STEP vs 3MF vs STL</h2>
          <p>Pick by what the next program needs.</p>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.formatTable}>
            <caption className={home.srOnly}>STEP, 3MF, STL compared</caption>
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col"><span className={`${styles.badge} ${styles.badgeCad}`}>STEP</span></th>
                <th scope="col" className={styles.hl}><span className={`${styles.badge} ${styles.badgeMesh}`}>3MF</span></th>
                <th scope="col"><span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Geometry</th>
                <td>Exact surfaces and solids</td>
                <td className={styles.hl}>Triangle meshes</td>
                <td>Triangles only</td>
              </tr>
              <tr>
                <th scope="row">Units</th>
                <td>Stored</td>
                <td className={styles.hl}>Stored (ours is mm)</td>
                <td>Not stored</td>
              </tr>
              <tr>
                <th scope="row">Colours</th>
                <td>Yes</td>
                <td className={styles.hl}>Display colour per object</td>
                <td>No</td>
              </tr>
              <tr>
                <th scope="row">Multiple parts</th>
                <td>Named assembly tree</td>
                <td className={styles.hl}>Separate objects</td>
                <td>Unnamed shells</td>
              </tr>
              <tr>
                <th scope="row">Best for</th>
                <td>Design, CNC and suppliers</td>
                <td className={styles.hl}>Modern slicers</td>
                <td>Any slicer or print service</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.choose}>
          <div>
            <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>3MF</span><b>Convert to 3MF when</b></span>
            <p>Your slicer reads 3MF and you want separate parts and units in one file.</p>
            <span className={styles.more}>You&apos;re in the right place</span>
          </div>
          <Link href="/tools/step-file-viewer" aria-label="Open the STEP viewer">
            <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>STEP</span><b>Keep STEP when</b></span>
            <p>The part will be machined, edited or quoted from exact CAD geometry.</p>
            <span className={styles.more}>Open the STEP viewer <MoreArrow /></span>
          </Link>
          <Link href="/tools/convert-step-to-stl" aria-label="STEP to STL for printing">
            <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span><b>Choose STL when</b></span>
            <p>A print service or older slicer asks for STL.</p>
            <span className={styles.more}>STEP to STL for printing <MoreArrow /></span>
          </Link>
        </div>
      </div>
    </section>

    <section className={styles.openBand} id="open-in" aria-labelledby="open-title">
      <div className={home.wrap}>
        <div className={styles.splitHead}>
          <div>
            <p className={home.eyebrow}>Open it anywhere</p>
            <h2 className={home.platformTitle} id="open-title">Ready for modern slicers</h2>
          </div>
          <p>3MF is the default project format in today&apos;s slicers.</p>
        </div>
        <div className={`${styles.apps} ${styles.slicers}`}>
          {["Bambu Studio", "PrusaSlicer", "OrcaSlicer", "Cura", "Creality Print"].map((name) => (
            <div key={name}><b>{name}</b><span className={styles.yes}>Opens 3MF</span></div>
          ))}
        </div>
        <p className={styles.unitNote}>
          <InfoIcon />
          <span>The file stores millimetres, so it opens at the right size. You still choose filaments, supports and print settings in the slicer.</span>
        </p>
      </div>
    </section>

    <section className={styles.relatedBand} id="related" aria-labelledby="rel-title">
      <div className={home.wrap}>
        <div className={styles.splitHead}>
          <div>
            <p className={home.eyebrow}>Related conversions</p>
            <h2 className={home.platformTitle} id="rel-title">More STEP and 3MF tools</h2>
          </div>
          <Link className={styles.more} href="/tools/3d-cad-file-converter">
            All 74 conversion routes
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
        <p className={styles.reverseNote}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
          <span>Going the other way? You can also <Link href="/tools/convert-3mf-to-step">turn 3MF files into STEP</Link>. It rebuilds a STEP file from the mesh, with flat areas merged into single faces. Curved areas may stay faceted, and there&apos;s no feature tree.</span>
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
              Also converting to 3MF?
            </h3>
            <div className={`${styles.hubLinks} ${styles.hubStack}`}>
              <Link href="/tools/convert-iges-to-3mf">
                <FormatPair from="IGES" to="3MF" />
                <span className={styles.sib}>IGES surfaces to 3MF</span>
                <RouteArrow />
              </Link>
              <Link href="/tools/convert-brep-to-3mf">
                <FormatPair from="BREP" to="3MF" />
                <span className={styles.sib}>BREP solids to 3MF</span>
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
          <Link href="/tools/3mf-file-viewer">
            <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg></span>
            Free 3MF viewer
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
          <h2 className={home.platformTitle} id="faq-title">STEP to 3MF questions</h2>
          <p>Parts, colours, units, slicers, pricing and your files.</p>
          <Link className={styles.ghostBtn} href="/contact-us">Contact us</Link>
          <small className={styles.faqUpdated}>Last updated 6 November 2026</small>
        </div>
        <div className={styles.faqList}>
          {faqs.map((item, index) => (
            <details key={item.question} className={styles.acc} open={index === 0}>
              <summary>{item.question}</summary>
              <div className={styles.accBody}>
                <FaqBody item={item} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>

    <section className={styles.closeBand} aria-labelledby="cta-title">
      <div className={home.wrap}>
        <div className={styles.cta}>
          <h2 id="cta-title">Convert your STEP file to 3MF</h2>
          <p>One object per part, in millimetres, ready for your slicer. {priceSentence}</p>
          <div className={styles.ctaBtns}>
            <a className={styles.ctaLight} href="#cad-file-converter">Convert STEP to 3MF</a>
            <Link className={styles.ctaOutline} href="/tools/3d-cad-file-converter">See all converters</Link>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
