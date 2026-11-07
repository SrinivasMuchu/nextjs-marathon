"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchConverterPricingInfo,
  formatConverterPrice,
  getConverterPacksFromInfo,
  getFreeConversionsPerUser,
  getSinglePriceLabelFromInfo,
} from "@/lib/converterPricing";
import hero from "./HomeHero.module.css";
import styles from "./HomeFaq.module.css";

function lowestPerFileLabel(info) {
  const packs = getConverterPacksFromInfo(info);
  let best = null;
  packs.forEach((pack) => {
    const credits = Number(pack.credits);
    const total = Number(pack.price_with_gst);
    if (!credits || !Number.isFinite(total) || total <= 0) return;
    const each = total / credits;
    if (best == null || each < best) best = each;
  });
  if (best == null) return "";
  return formatConverterPrice(best, info?.pricing?.currency || "USD");
}

function freeAnswer({ freeCount, singleLabel, perFileLabel, drawingLabel }) {
  const count = freeCount || 2;
  const after = singleLabel ? `${singleLabel} or 1 credit per file` : "1 credit per file";
  const pack = perFileLabel ? `credit packs bring it down to ${perFileLabel} per file and credits never expire` : "credit packs bring the per-file price down and credits never expire";
  const drawing = drawingLabel ? `STEP to 2D drawing sets cost ${drawingLabel} each` : "STEP to 2D drawing sets are priced per set";
  return `First ${count} file${count === 1 ? "" : "s"} free, any size up to 300 MB. After that, ${after}. Prices include tax, you pay only when you click Download, ${pack}. The 3D viewers are free, and ${drawing}.`;
}

function drawingAnswer(drawingLabel) {
  const price = drawingLabel ? `, for ${drawingLabel}` : "";
  return `Upload the model to the STEP to 2D drawing tool. You get front, top, side and isometric views, section and detail views, dimensions and a title block as PDF, DXF, SVG and PNG, plus an editable FreeCAD file where available${price}.`;
}

function HomeFaq({ initialInfo, drawingLabel }) {
  const [info, setInfo] = useState(initialInfo || null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetchConverterPricingInfo()
        .then((next) => {
          if (!cancelled && next) setInfo(next);
        })
        .catch(() => {});
    };
    load();
    const timer = setTimeout(load, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const singleLabel = info ? getSinglePriceLabelFromInfo(info) : "";
  const perFileLabel = info ? lowestPerFileLabel(info) : "";
  const freeCount = info ? getFreeConversionsPerUser(info) : 2;
  const items = [
    {
      q: "What is Marathon OS?",
      a: "Marathon OS is an online platform for engineering CAD files. You can convert between 11 CAD, mesh and drawing formats across 74 conversion routes, open 3D files in a free browser viewer, extract a bill of materials from STEP assemblies and turn STEP models into dimensioned 2D drawings. It also has a library of 15,000+ CAD models and a network of CAD designers you can hire. Marathon OS is a CAD file conversion platform at marathon-os.com, not related to the open-source mobile operating system of the same name.",
    },
    {
      q: "Is Marathon OS free?",
      a: freeAnswer({ freeCount, singleLabel, perFileLabel, drawingLabel }),
    },
    {
      q: "Which CAD file formats can I convert?",
      a: "STEP, IGES, BREP and 3DM (CAD), STL, 3MF, OBJ, PLY and OFF (mesh), and DXF and DWG (2D drawings). Every 3D format converts to every other 3D format, and DXF and DWG convert to each other, which makes 74 conversion routes. STEP and STP, IGES and IGS, and BREP and BRP are accepted under either extension.",
    },
    {
      q: "What is the maximum file size?",
      a: "You can convert files up to 300 MB on every converter. The STEP to 2D drawing tool accepts files up to 100 MB.",
    },
    {
      q: "Are my CAD files private?",
      a: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. Uploading or converting a file never transfers ownership of your design.",
    },
    {
      q: "Does converting STEP to STL lose quality?",
      a: "STEP stores exact curved surfaces. STL stores flat triangles, so curves are approximated by facets, and STL has no units, colours or feature history. For 3D printing this is normal and expected. If you need the exact geometry later, keep the original STEP file.",
    },
    {
      q: "Which format should I use for 3D printing, STL or 3MF?",
      a: "Both work in Cura, PrusaSlicer and Bambu Studio. STL is the most widely supported. 3MF also stores units and can hold colours and multiple parts, so it avoids scale mistakes. Use STEP to STL or STEP to 3MF if you have a CAD model, and OBJ to STL if you have a polygon model.",
    },
    {
      q: "Can I turn an STL into an editable CAD model?",
      a: "STL to STEP turns a mesh into a solid that CAD programs can open, measure and cut. It stays made of flat faces, so curved surfaces remain faceted and there is no feature history. For a fully editable model with true holes and features, a CAD designer can rebuild it from the STL.",
    },
    {
      q: "What is the difference between STEP and IGES?",
      a: "Both are neutral CAD exchange formats. STEP (ISO 10303) carries exact solids, assemblies, colours and units and is the modern default. IGES is older and mostly carries surfaces and curves, so solids can arrive as loose surfaces. Use IGES only when the receiving system asks for it.",
    },
    {
      q: "What is the difference between DWG and DXF?",
      a: "DWG is AutoCAD's native drawing format. DXF is an open exchange version of the same kind of 2D data that far more tools can read, including laser, waterjet and CNC software. Convert DWG to DXF for cutting and CAM, and DXF to DWG to keep editing in AutoCAD.",
    },
    {
      q: "Can I open a STEP file without CAD software?",
      a: "Yes. The free STEP viewer opens STEP and STP files in your web browser so you can rotate, zoom and inspect solids and assemblies without installing anything. There are free viewers for STL, IGES, OBJ, 3DM, PLY, BREP, OFF, DXF and DWG too.",
    },
    {
      q: "How do I get a bill of materials from a STEP file?",
      a: "Upload a STEP or STP assembly to the STEP BOM extractor. It builds the assembly tree, counts the quantity of every part and lets you download the bill of materials as an Excel file.",
    },
    {
      q: "How do I make a 2D drawing from a STEP file?",
      a: drawingAnswer(drawingLabel),
    },
    {
      q: "Do I need a subscription?",
      a: "No. You pay per file, or buy a credit pack once. Credits never expire, 1 credit downloads any file up to 300 MB, and every purchase comes with an invoice.",
    },
  ];

  return (
    <section className={styles.band} id="faq" aria-labelledby="faq-title">
      <div className={`${hero.wrap} ${styles.grid}`}>
        <div className={styles.side}>
          <p className={hero.eyebrow}>FAQ</p>
          <h2 id="faq-title">Questions, answered</h2>
          <p>Formats, pricing, limits and privacy.</p>
          <Link className={`${hero.libBtn} ${hero.libGhost}`} href="/contact-us">Contact us</Link>
          <small>Last updated 5 November 2026</small>
        </div>
        <div className={styles.list}>
          {items.map((item, index) => (
            <details className={styles.acc} key={item.q} {...(index === 0 ? { open: true } : {})}>
              <summary>{item.q}</summary>
              <div className={styles.body}><p>{item.a}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeFaq;
