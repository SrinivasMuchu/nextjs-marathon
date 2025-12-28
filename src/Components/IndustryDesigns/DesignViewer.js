"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import styles from "./IndustryDesign.module.css";
import { DESIGN_GLB_PREFIX_URL, IMAGEURLS } from "@/config";
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
import Image from "next/image";

const wrapDeg = (deg) => ((deg % 360) + 360) % 360;
const step = 30;

// Define angle views (constant, outside component)
const ANGLE_VIEWS = [
  { x: 0,   y: 0, type: 'angle' },
  { x: 0,   y: 60, type: 'angle' },
  { x: 0,   y: 120, type: 'angle' },
  { x: 30,  y: 0, type: 'angle' },
  { x: 330, y: 0, type: 'angle' },
];

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
  
  // Create unified list: angles first, then images
  const allViews = useMemo(() => {
    const views = [...ANGLE_VIEWS];
    // Add all supported images to the views list
    supportedImages.forEach((img, idx) => {
      views.push({ type: 'image', index: idx, url: img.url, name: img.name });
    });
    return views;
  }, [supportedImages]);
  
  // State for current view index (0 = first angle, etc.)
  const [currentViewIdx, setCurrentViewIdx] = useState(0);
  const baseUrl = `${DESIGN_GLB_PREFIX_URL}${designId}`;
  const [xDeg, setXDeg] = useState(initialX);
  const [yDeg, setYDeg] = useState(initialY);
  const [scale, setScale] = useState(0.8);
  
  // Ref to track if we're navigating (should sync) vs manually rotating (shouldn't sync)
  const isNavigatingRef = useRef(false);
  
  // Sync xDeg/yDeg when currentViewIdx changes to an angle view (only when navigating)
  useEffect(() => {
    if (isNavigatingRef.current) {
      const currentView = allViews[currentViewIdx];
      if (currentView && currentView.type === 'angle') {
        setXDeg(currentView.x);
        setYDeg(currentView.y);
      }
      isNavigatingRef.current = false;
    }
  }, [currentViewIdx, allViews]);
  
  // Navigation functions
  const goToPrevious = () => {
    isNavigatingRef.current = true;
    setCurrentViewIdx((idx) => {
      const newIdx = (idx - 1 + allViews.length) % allViews.length;
      return newIdx;
    });
  };
  
  const goToNext = () => {
    isNavigatingRef.current = true;
    setCurrentViewIdx((idx) => {
      const newIdx = (idx + 1) % allViews.length;
      return newIdx;
    });
  };
  
  // Determine if we're viewing an image
  const selectedImageIdx = useMemo(() => {
    const currentView = allViews[currentViewIdx];
    return currentView && currentView.type === 'image' ? currentView.index : null;
  }, [currentViewIdx, allViews]);

  // Add this state and effect for screen size
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const checkScreen = () => setShowHeader(window.innerWidth < 850);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);
  
  // Keyboard navigation support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (allViews.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        isNavigatingRef.current = true;
        setCurrentViewIdx((idx) => (idx - 1 + allViews.length) % allViews.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        isNavigatingRef.current = true;
        setCurrentViewIdx((idx) => (idx + 1) % allViews.length);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [allViews.length]);

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
        {/* Left navigation button */}
        {allViews.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '1px solid #D1D4D7',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              fontSize: '24px',
              color: '#610BEE',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#610BEE';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#610BEE';
            }}
          >
            <IoIosArrowBack />
          </button>
        )}
        
        {/* Right navigation button */}
        {allViews.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '1px solid #D1D4D7',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              fontSize: '24px',
              color: '#610BEE',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#610BEE';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#610BEE';
            }}
          >
            <IoIosArrowForward />
          </button>
        )}
        
        {selectedImageIdx === null ? (
          <>
            {/* Logo only in 3D viewer */}
            <div 
              style={{ position: "absolute", top: 20, left: 20, zIndex: 20 }}
              title="This preview is automatically generated from the uploaded CAD file using Marathon-OS. What you see here matches how the model opens in FreeCAD."
            >
              <Image src={IMAGEURLS.marathonPreview} alt="Logo" width={100} height={40} />
            </div>
            <div className={styles.stage} style={{ transform: `scale(${scale})` }}>
              <img
                className={styles.frame}
                src={src}
                alt={`sprite x=${xDeg} y=${yDeg}`}
                draggable={false}
                style={{ cursor: supportedImages.length > 0 ? 'pointer' : undefined }}
                onClick={() => {
                  if (supportedImages.length > 0) {
                    // Find first image view index
                    const firstImageIdx = allViews.findIndex(v => v.type === 'image');
                    if (firstImageIdx !== -1) {
                      isNavigatingRef.current = true;
                      setCurrentViewIdx(firstImageIdx);
                    }
                  }
                }}
              />
            </div>
            <div className={styles.controls}>
              <div className={styles.dpad}>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setXDeg((prev) => wrapDeg(prev + step));
                  }} 
                  className={styles.button}
                >
                  <IoIosArrowUp />
                </button>
                <div className={styles.h}>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setYDeg((prev) => wrapDeg(prev - step));
                    }} 
                    className={styles.button}
                  >
                    <IoIosArrowBack />
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setYDeg((prev) => wrapDeg(prev + step));
                    }} 
                    className={styles.button}
                  >
                    <IoIosArrowForward />
                  </button>
                </div>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setXDeg((prev) => wrapDeg(prev - step));
                  }} 
                  className={styles.button}
                >
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
        ) : selectedImageIdx !== null && supportedImages[selectedImageIdx] ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative' }}>
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
              onClick={() => {
                // Go back to first angle view
                isNavigatingRef.current = true;
                setCurrentViewIdx(0);
              }}
            />
            <div style={{ marginBottom: 8, color: '#333', fontSize: 14 }}>{supportedImages[selectedImageIdx].name}</div>
          </div>
        ) : null}
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
        {ANGLE_VIEWS.map(({x, y}, angleIdx) => {
          const thumbSrc = `${baseUrl}/sprite_${fmt(wrapDeg(x), padX)}_${fmt(wrapDeg(y), padY)}.${ext}`;
          const isActive = currentViewIdx === angleIdx;
          return (
            <div
              key={`angle-${x}-${y}`}
              style={{
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isActive ? '2px solid #610BEE' : '1px solid #ccc',
                borderRadius: 8,
                background: '#fff',
                boxShadow: isActive ? '0 0 8px #610BEE55' : undefined,
                cursor: 'pointer',
                transition: 'border 0.2s, box-shadow 0.2s',
              }}
              onClick={() => {
                isNavigatingRef.current = true;
                setCurrentViewIdx(angleIdx);
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
        {supportedImages.map((img, idx) => {
          // Find the index in allViews for this image
          const viewIdx = allViews.findIndex(v => v.type === 'image' && v.index === idx);
          const isActive = currentViewIdx === viewIdx;
          return (
            <div
              key={`img-${idx}`}
              style={{
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isActive ? '2px solid #610BEE' : '1px solid #ccc',
                borderRadius: 8,
                background: '#fff',
                boxShadow: isActive ? '0 0 8px #610BEE55' : undefined,
                cursor: 'pointer',
                transition: 'border 0.2s, box-shadow 0.2s',
              }}
              onClick={() => {
                isNavigatingRef.current = true;
                setCurrentViewIdx(viewIdx);
              }}
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
          );
        })}
      </div>
    </>
  );
}
