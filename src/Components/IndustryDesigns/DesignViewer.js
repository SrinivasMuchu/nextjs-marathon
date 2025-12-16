"use client";
import { useMemo, useState, useEffect } from "react";
import styles from "./IndustryDesign.module.css";
import { DESIGN_GLB_PREFIX_URL } from "@/config";
import { IoIosArrowBack,IoIosArrowDown ,IoIosArrowForward ,IoIosArrowUp  } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { HiOutlineMinus } from "react-icons/hi";
import { CiUndo } from "react-icons/ci";
import IndustryAnglePicker from "./IndustryAnglePicker";
import IndustryImageGallery from "./IndustryImageGallery";
import IndustryDesignHeader from "./IndustryDesignHeader";
import DesignStats from "../CommonJsx/DesignStats";
import Link from "next/link";// client part
import DownloadClientButton from "../CommonJsx/DownloadClientButton";

const wrapDeg = (deg) => ((deg % 360) + 360) % 360;
const step = 30;

export default function DesignViewer({
  designId, designData,
  padX = 0,
  padY = 0,
  ext = "webp",
  initialX = 0,
  initialY = 0,
}) {
  // Filter supported image files (png, jpg, jpeg)
  const supportedImages = (designData?.supporting_files || []).filter(f =>
    /\.(png|jpg|jpeg)$/i.test(f.name)
  );
  // State for selected image index (null means show 3D viewer)
  const [selectedImageIdx, setSelectedImageIdx] = useState(null);
  const baseUrl = `${DESIGN_GLB_PREFIX_URL}${designId}`;
  const [xDeg, setXDeg] = useState(initialX);
  const [yDeg, setYDeg] = useState(initialY);
  const [scale, setScale] = useState(0.8);

  // Add this state and effect for screen size
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const checkScreen = () => setShowHeader(window.innerWidth < 850);
    checkScreen();
    window.addEventListener("resize", checkScreen);
  }, []);

  const fmt = (n, width) => (width > 0 ? String(n).padStart(width, "0") : String(n));
  const src = useMemo(() => {
    const x = fmt(wrapDeg(xDeg), padX);
    const y = fmt(wrapDeg(yDeg), padY);
    return `${baseUrl}/sprite_${x}_${y}.${ext}`;
  }, [xDeg, yDeg, baseUrl, padX, padY, ext]);

  const zoomIn = () => setScale((s) => Math.min(3, +(s + 0.1).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(0.25, +(s - 0.1).toFixed(2)));
  const resetZoom = () => setScale(1);

  return (
    <>
      {showHeader && (
        <div className={styles["industry-design-header-viewer-top"]}>
          {/* ...existing code... */}
          <div style={{ width: "100%", display: "flex", alignItems: "flex-start" }}>
            <DesignStats
              views={designData.total_design_views}
              downloads={designData.total_design_downloads}
              ratings={{ average: designData.average_rating, total: designData.rating_count }}
            />
          </div>
          <div style={{ width: "100%", display: "flex", alignItems: "flex-start" }}>
            {designData.price ? (
              <p style={{ fontSize: "24px", fontWeight: "500" }}>
                ${designData.price}
                <span style={{ fontSize: "16px", fontWeight: "400", color: "#001325" }}>/download</span>
              </p>
            ) : (
              <p style={{ fontSize: "24px", fontWeight: "500" }}>Free</p>
            )}
          </div>
          <div
            className={styles.statsCont}
            style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", width: "100%", flexWrap: "wrap" }}
          >
            <DownloadClientButton
              custumDownload={true}
              folderId={designData._id}
              isDownladable={designData.is_downloadable}
              step={true}
              filetype={designData.file_type ? designData.file_type : "step"}
            />
            <Link
              style={{
                color: "white",
                fontSize: "20px",
                background: "#610BEE",
                borderRadius: "4px",
                border: "none",
                width: "auto",
              }}
              href={`/tools/cad-renderer?fileId=${designData._id}&format=${designData.file_type ? designData.file_type : "step"}`}
              rel="nofollow"
            >
              <button
                style={{
                  color: "white",
                  fontSize: "20px",
                  background: "#610BEE",
                  borderRadius: "4px",
                  height: "48px",
                  padding: "10px 20px",
                  border: "none",
                  width: "236px",
                }}
              >
                Open in 3D viewer
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Main viewer area: show 3D viewer or selected image, always show gallery below */}
      <div className={styles.viewerRoot}>
        {selectedImageIdx === null ? (
          <>
            <div className={styles.stage} style={{ transform: `scale(${scale})` }}>
              <img
                className={styles.frame}
                src={src}
                alt={`sprite x=${xDeg} y=${yDeg}`}
                draggable={false}
                style={{ cursor: supportedImages.length > 0 ? 'pointer' : undefined }}
                onClick={() => {
                  if (supportedImages.length > 0) setSelectedImageIdx(0);
                }}
              />
            </div>
            <div className={styles.controls}>
              <div className={styles.dpad}>
                <button onClick={() => setXDeg((v) => wrapDeg(v + step))} className={styles.button}>
                  <IoIosArrowUp />
                </button>
                <div className={styles.h}>
                  <button onClick={() => setYDeg((v) => wrapDeg(v - step))} className={styles.button}>
                    <IoIosArrowBack />
                  </button>
                  <button onClick={() => setYDeg((v) => wrapDeg(v + step))} className={styles.button}>
                    <IoIosArrowForward />
                  </button>
                </div>
                <button onClick={() => setXDeg((v) => wrapDeg(v - step))} className={styles.button}>
                  <IoIosArrowDown />
                </button>
              </div>
              <div className={styles.zoom}>
                <button onClick={zoomIn} className={styles.zoomButton}>
                  <AiOutlinePlus />
                </button>
                <button onClick={zoomOut} className={styles.zoomButton}>
                  <HiOutlineMinus />
                </button>
                <button onClick={resetZoom} className={styles.zoomButton}>
                  <CiUndo />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <img
              src={supportedImages[selectedImageIdx].url}
              alt={supportedImages[selectedImageIdx].name}
              style={{
                maxWidth: '100%',
                maxHeight: 400,
                borderRadius: 8,
                border: '1px solid #eee',
                boxShadow: '0 2px 12px #0001',
                marginBottom: 12,
                cursor: 'pointer',
              }}
              onClick={() => setSelectedImageIdx(null)}
            />
            <div style={{ marginBottom: 8, color: '#333', fontSize: 14 }}>{supportedImages[selectedImageIdx].name}</div>
          </div>
        )}
      </div>

      {/* Unified thumbnail carousel for angle picker and supported images - consistent styling */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 24,
          background: '#fff',
          padding: '12px 0',
          borderRadius: 12,
          boxShadow: '0 2px 12px #0001',
        }}
      >
        {/* Angle picker thumbnails: only specific angles as requested */}
        {[
          { x: 0,   y: 0 },
          { x: 0,   y: 60 },
          { x: 0,   y: 120 },
          { x: 30,  y: 0 },
          { x: 330, y: 0 },
        ].map(({x, y}) => {
          const thumbSrc = `${baseUrl}/sprite_${fmt(wrapDeg(x), padX)}_${fmt(wrapDeg(y), padY)}.${ext}`;
          return (
            <div
              key={`angle-${x}-${y}`}
              style={{
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: (selectedImageIdx === null && Math.round(xDeg) === Math.round(x) && Math.round(yDeg) === Math.round(y)) ? '2px solid #610BEE' : '1px solid #ccc',
                borderRadius: 8,
                background: '#fff',
                boxShadow: (selectedImageIdx === null && Math.round(xDeg) === Math.round(x) && Math.round(yDeg) === Math.round(y)) ? '0 0 8px #610BEE55' : undefined,
                cursor: 'pointer',
                transition: 'border 0.2s, box-shadow 0.2s',
              }}
              onClick={() => {
                setXDeg(x);
                setYDeg(y);
                setSelectedImageIdx(null);
              }}
            >
              <img
                src={thumbSrc}
                alt={`Angle x=${x} y=${y}`}
                style={{
                  width: '90%',
                  height: '90%',
                  objectFit: 'contain',
                  borderRadius: 6,
                  background: '#fff',
                  display: 'block',
                }}
              />
            </div>
          );
        })}
        {/* Supported file thumbnails */}
        {supportedImages.map((img, idx) => (
          <div
            key={`img-${idx}`}
            style={{
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: (selectedImageIdx === idx) ? '2px solid #610BEE' : '1px solid #ccc',
              borderRadius: 8,
              background: '#fff',
              boxShadow: (selectedImageIdx === idx) ? '0 0 8px #610BEE55' : undefined,
              cursor: 'pointer',
              transition: 'border 0.2s, box-shadow 0.2s',
            }}
            onClick={() => setSelectedImageIdx(idx)}
          >
            <img
              src={img.url}
              alt={img.name}
              style={{
                width: '90%',
                height: '90%',
                objectFit: 'contain',
                borderRadius: 6,
                background: '#fff',
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
