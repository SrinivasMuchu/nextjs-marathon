"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  FileOutput,
  Layers,
  Search,
} from "lucide-react";
import { converterTypes } from "@/common.helper";
import CadFileConversionContent from "@/Components/CadUploadingHome/CadFileConversion/CadFileConversionContent";
import TechDrawPriceAmount from "../shared/TechDrawPriceAmount";
import styles from "./HomeLandingNew.module.css";

const QUICK_ROUTES = [
  { label: "STL", target: "STEP", href: "/tools/convert-stl-to-step" },
  { label: "IGES", target: "STEP", href: "/tools/convert-iges-to-step" },
  { label: "DWG", target: "DXF", href: "/tools/convert-dwg-to-dxf" },
];

function buildRouteMap() {
  const targets = new Set();
  const oneLiners = {};
  converterTypes.forEach((route) => {
    const path = String(route.path || "").replace(/^\//, "");
    const [from, to] = path.split("-to-");
    if (!from || !to) return;
    const fromKey = from.toUpperCase();
    const toKey = to.toUpperCase();
    targets.add(toKey);
    oneLiners[`${fromKey}->${toKey}`] = route.oneLiner || `Convert ${fromKey} to ${toKey}.`;
  });
  return {
    targetOptions: Array.from(targets).sort(),
    oneLiners,
  };
}

const { targetOptions: TARGET_OPTIONS, oneLiners } = buildRouteMap();

function whyForTarget(target) {
  const preferred =
    oneLiners[`STEP->${target}`] ||
    oneLiners[`STL->${target}`] ||
    oneLiners[`IGES->${target}`];
  if (preferred) return preferred;
  const match = Object.entries(oneLiners).find(([key]) => key.endsWith(`->${target}`));
  return match?.[1] || `Convert your CAD file to ${target}.`;
}

function ConversionConsole() {
  const [target, setTarget] = useState("STL");

  const resolvedTarget = TARGET_OPTIONS.includes(target) ? target : TARGET_OPTIONS[0] || "STL";
  const preferredOutput = resolvedTarget.toLowerCase();
  const whyThisRoute = useMemo(() => whyForTarget(resolvedTarget), [resolvedTarget]);

  return (
    <div className={styles.conversionConsole} aria-label="Marathon OS CAD conversion routes">
      <div className={styles.consoleHead}>
        <div>
          <span>MARATHON CONVERSION DESK</span>
          <strong>Choose the result you need</strong>
        </div>
        <span className={styles.livePill}>
          <span />
          ONLINE
        </span>
      </div>

      <div className={styles.consoleRoute}>
        <div className={styles.consoleFormat}>
          <small>SOURCE FILE</small>
          <strong className={styles.consoleAutoDetect}>Auto-detect</strong>
          <span>from uploaded file</span>
        </div>

        <div className={styles.consoleArrow}>
          <span>CONVERT</span>
          <ArrowRight size={20} aria-hidden="true" />
        </div>

        <label className={`${styles.consoleFormat} ${styles.consoleFormatTarget}`}>
          <small>READY FILE</small>
          <span className={styles.consoleSelectWrap}>
            <select
              className={styles.consoleSelect}
              value={resolvedTarget}
              onChange={(event) => setTarget(event.target.value)}
              aria-label="Output format"
            >
              {TARGET_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className={styles.consoleSelectIcon} size={16} aria-hidden="true" />
          </span>
          <span>.{resolvedTarget.toLowerCase()}</span>
        </label>
      </div>

      <div className={styles.consolePurpose}>
        <span className={styles.consolePurposeIcon}>
          <Layers size={18} aria-hidden="true" />
        </span>
        <div>
          <small>WHY THIS ROUTE</small>
          <strong>{whyThisRoute}</strong>
        </div>
      </div>

      <div className={styles.consoleUpload}>
        <CadFileConversionContent
          designVariant="converterHero"
          preferredOutput={preferredOutput}
        />
      </div>

      <Link className={styles.consoleAlternative} href="/tools/cad-drawing-pipeline">
        <span className={styles.consoleAltIcon}>
          <FileOutput size={18} aria-hidden="true" />
        </span>
        <span className={styles.consoleAltCopy}>
          <small>NEED MANUFACTURING DRAWINGS?</small>
          <strong>STEP or STP to 2D drawing set</strong>
        </span>
        <span className={styles.consoleAltPrice}>
          <TechDrawPriceAmount />
          <ChevronRight size={15} aria-hidden="true" />
        </span>
      </Link>

      <Link className={styles.consoleAlternative} href="/tools/cad-match">
        <span className={styles.consoleAltIcon}>
          <Search size={18} aria-hidden="true" />
        </span>
        <span className={styles.consoleAltCopy}>
          <small>FIND SIMILAR PARTS?</small>
          <strong>Match your CAD against the library</strong>
        </span>
        <span className={styles.consoleAltPrice}>
          Free
          <ChevronRight size={15} aria-hidden="true" />
        </span>
      </Link>

      <div className={styles.consoleQuick}>
        <span>MORE FORMAT CONVERSIONS</span>
        <div>
          {QUICK_ROUTES.map((route) => (
            <Link key={route.href} href={route.href}>
              {route.label}
              <ChevronRight size={12} aria-hidden="true" />
              {route.target}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ConversionConsole;
