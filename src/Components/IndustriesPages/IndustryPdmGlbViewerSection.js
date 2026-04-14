"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  MdOutlineVisibility,
  MdOutlineFactCheck,
  MdOutlineSettingsSuggest,
  MdOutlineBuildCircle,
  MdOutlineInsertDriveFile,
  MdOutlinePublic,
  MdOutlineSpeed,
  MdOutlineLock,
} from "react-icons/md";
import { DESIGN_GLB_PREFIX_URL } from "@/config";
import styles from "./IndustryPdmGlbViewerSection.module.css";

const PdmGlbPreviewCanvas = dynamic(() => import("./PdmGlbPreviewCanvas"), {
  ssr: false,
});

/** Used only when API does not return `viewer_design_id` for an industry. */
const FALLBACK_PDM_VIEWER_ID = "69d7265e562aa5e7d23e30ad";

const TOOLBAR_ITEMS = [
  { id: "zoom", label: "Zoom", type: "mode" },
  { id: "pan", label: "Pan", type: "mode" },
  { id: "rotate", label: "Rotate", type: "mode" },
  { id: "fit", label: "Fit View", type: "action" },
  { id: "reset", label: "Reset", type: "action" },
];

const CAD_FORMATS = ["STEP", "IGES", "STL", "PLY", "OFF", "BREP"];

export default function IndustryPdmGlbViewerSection({ industryData }) {
  const industryLabel = industryData?.industry?.trim() || "Automotive";
  const industryWord = industryLabel.split("&")[0].trim().split(" ")[0].toLowerCase();
  const [interactionMode, setInteractionMode] = useState("rotate");
  const [viewerAction, setViewerAction] = useState(null);

  const viewerDesignId = useMemo(() => {
    const raw =
      industryData?.viewer_design_id ??
      industryData?.viewerDesignId ??
      "";
    const id = String(raw).trim();
    return id || FALLBACK_PDM_VIEWER_ID;
  }, [industryData]);

  const glbUrl = useMemo(() => {
    const encodedId = encodeURIComponent(viewerDesignId);
    return `${DESIGN_GLB_PREFIX_URL}${encodedId}/${encodedId}.glb`;
  }, [viewerDesignId]);

  const handleToolbarClick = (item) => {
    if (item.type === "mode") {
      setInteractionMode(item.id);
      return;
    }
    if (item.id === "fit") {
      setViewerAction({ type: "fit", at: Date.now() });
      return;
    }
    if (item.id === "reset") {
      setViewerAction({ type: "reset", at: Date.now() });
    }
  };

  return (
    <section className={styles.section} aria-label="PDM GLB Viewer">
      <p className={styles.eyebrow}>{industryLabel.toUpperCase()} CAD VIEWER</p>
      <h2 className={styles.heading}>Open {industryWord} CAD files instantly in your browser</h2>
      <p className={styles.description}>
        Review engine parts, body assemblies, and supplier-submitted CAD files without installing heavy
        desktop software.
      </p>

      <div className={styles.layout}>
        <div className={styles.leftPane}>
          <div className={styles.toolbar}>
            {TOOLBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                className={`${styles.toolbarButton} ${
                  item.type === "mode" && interactionMode === item.id ? styles.toolbarButtonActive : ""
                }`}
                onClick={() => handleToolbarClick(item)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className={styles.viewerShell}>
            <div className={styles.viewerCanvasWrap}>
              <span className={styles.viewerTag}>PDM Viewer / GLB Viewer</span>
              <PdmGlbPreviewCanvas
                key={viewerDesignId}
                glbUrl={glbUrl}
                interactionMode={interactionMode}
                action={viewerAction}
              />
            </div>
          </div>

          <button type="button" className={styles.cta}>
            Upload Your {industryLabel} CAD File
          </button>
        </div>

        <aside className={styles.rightPane}>
          <div className={styles.card}>
            <h3>What {industryWord} teams use it for</h3>
            <ul className={styles.list}>
              <li>
                <MdOutlineVisibility className={styles.listIcon} size={18} /> Design reviews
              </li>
              <li>
                <MdOutlineFactCheck className={styles.listIcon} size={18} /> Supplier validation
              </li>
              <li>
                <MdOutlineSettingsSuggest className={styles.listIcon} size={18} /> Manufacturing checks
              </li>
              <li>
                <MdOutlineBuildCircle className={styles.listIcon} size={18} /> Service support
              </li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>Supported formats</h3>
            <ul className={styles.list}>
              {CAD_FORMATS.map((format) => (
                <li key={format}>
                  <MdOutlineInsertDriveFile className={styles.listIcon} size={18} /> {format}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <h3>Why browser-based?</h3>
            <ul className={styles.list}>
              <li>
                <MdOutlinePublic className={styles.listIcon} size={18} /> No CAD install
              </li>
              <li>
                <MdOutlineSpeed className={styles.listIcon} size={18} /> Faster reviews
              </li>
              <li>
                <MdOutlineVisibility className={styles.listIcon} size={18} /> Easier stakeholder access
              </li>
              <li>
                <MdOutlineLock className={styles.listIcon} size={18} /> Private uploads
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
