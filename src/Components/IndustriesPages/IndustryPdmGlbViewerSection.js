"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  MdOutlineFactCheck,
  MdOutlineSettingsSuggest,
  MdOutlineBuildCircle,
  MdOutlineInsertDriveFile,
  MdOutlinePublic,
  MdOutlineSpeed,
  MdOutlineVisibility,
  MdOutlineLock,
} from "react-icons/md";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Eye, Minus, Plus } from "lucide-react";
import { DESIGN_GLB_PREFIX_URL } from "@/config";
import styles from "./IndustryPdmGlbViewerSection.module.css";

const PdmGlbPreviewCanvas = dynamic(() => import("./PdmGlbPreviewCanvas"), {
  ssr: false,
});

/** Used only when API does not return `viewer_design_id` for an industry. */
const FALLBACK_PDM_VIEWER_ID = "69d7265e562aa5e7d23e30ad";

const CAD_FORMATS = ["STEP", "IGES", "STL", "PLY", "OFF", "BREP"];
const INDUSTRY_UPLOAD_DROPZONE_ID = "industry-hero-cad-dropzone";
const VIEW_PRESETS = [
  ["FRONT", "BACK"],
  ["LEFT", "RIGHT"],
  ["TOP", "BOTTOM"],
];
const WHY_BROWSER_BASED_POINTS = [
  { label: "No CAD install", Icon: MdOutlinePublic },
  { label: "Faster reviews", Icon: MdOutlineSpeed },
  { label: "Easier stakeholder access", Icon: MdOutlineVisibility },
  { label: "Private uploads", Icon: MdOutlineLock },
];

export default function IndustryPdmGlbViewerSection({ industryData }) {
  const router = useRouter();
  const industryLabel = industryData?.industry?.trim() || "Automotive";
  const industryWord = industryLabel.split("&")[0].trim().split(" ")[0].toLowerCase();
  const [viewerAction, setViewerAction] = useState(null);
  const [activeView, setActiveView] = useState("ISOMETRIC");

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

  const pushViewerAction = (type, extra = {}) => {
    setViewerAction({ type, at: Date.now(), ...extra });
  };

  const handleUploadClick = () => {
    if (typeof document !== "undefined") {
      const uploadTarget = document.getElementById(INDUSTRY_UPLOAD_DROPZONE_ID);
      if (uploadTarget) {
        uploadTarget.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    router.push("/tools/3D-cad-viewer");
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
          <div className={styles.viewerShell}>
            <div className={styles.viewerCanvasWrap}>
              <div className={styles.dpadDock}>
                <div className={styles.dpad}>
                  <button
                    type="button"
                    className={styles.dpadBtn}
                    aria-label="Move up"
                    onClick={() => pushViewerAction("orbitUp")}
                  >
                    <ArrowUp size={18} />
                  </button>
                  <button
                    type="button"
                    className={styles.dpadBtn}
                    aria-label="Move left"
                    onClick={() => pushViewerAction("orbitLeft")}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.dpadBtn} ${styles.dpadCenterBtn}`}
                    aria-label="Isometric view"
                    onClick={() => {
                      setActiveView("ISOMETRIC");
                      pushViewerAction("preset", { name: "ISOMETRIC" });
                    }}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    className={styles.dpadBtn}
                    aria-label="Move right"
                    onClick={() => pushViewerAction("orbitRight")}
                  >
                    <ArrowRight size={18} />
                  </button>
                  <button
                    type="button"
                    className={styles.dpadBtn}
                    aria-label="Move down"
                    onClick={() => pushViewerAction("orbitDown")}
                  >
                    <ArrowDown size={18} />
                  </button>
                  <button
                    type="button"
                    className={styles.dpadBtn}
                    aria-label="Zoom out"
                    onClick={() => pushViewerAction("zoomOut")}
                  >
                    <Minus size={18} />
                  </button>
                  <button
                    type="button"
                    className={styles.dpadBtn}
                    aria-label="Zoom in"
                    onClick={() => pushViewerAction("zoomIn")}
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className={styles.viewsCard}>
                  <button
                    type="button"
                    className={styles.viewsHeading}
                    onClick={() => {
                      setActiveView("ISOMETRIC");
                      pushViewerAction("preset", { name: "ISOMETRIC" });
                    }}
                  >
                    VIEWS
                  </button>
                  <div className={styles.viewsGrid}>
                    {VIEW_PRESETS.flat().map((viewName) => (
                      <button
                        key={viewName}
                        type="button"
                        className={`${styles.viewBtn} ${activeView === viewName ? styles.viewBtnActive : ""}`}
                        onClick={() => {
                          setActiveView(viewName);
                          pushViewerAction("preset", { name: viewName });
                        }}
                      >
                        {viewName}
                      </button>
                    ))}
                    <button
                      type="button"
                      className={`${styles.viewBtn} ${styles.viewBtnWide} ${
                        activeView === "ISOMETRIC" ? styles.viewBtnActive : ""
                      }`}
                      onClick={() => {
                        setActiveView("ISOMETRIC");
                        pushViewerAction("preset", { name: "ISOMETRIC" });
                      }}
                    >
                      ISOMETRIC
                    </button>
                  </div>
                </div>
              </div>

              <PdmGlbPreviewCanvas
                key={viewerDesignId}
                glbUrl={glbUrl}
                action={viewerAction}
              />
            </div>
          </div>
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
        </aside>
      </div>

      <div className={styles.browserBasedBlock}>
        <h3 className={styles.browserBasedTitle}>Why browser based?</h3>
        <div className={styles.browserBasedPoints}>
          {WHY_BROWSER_BASED_POINTS.map(({ label, Icon }) => (
            <span key={label} className={styles.browserBasedPoint}>
              <Icon size={16} />
              {label}
            </span>
          ))}
        </div>
        <button type="button" className={styles.cta} onClick={handleUploadClick}>
          Upload Your {industryLabel} CAD File
        </button>
      </div>
    </section>
  );
}
