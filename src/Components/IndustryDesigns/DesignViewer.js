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
  let isDxf = designData.file_type?.toLowerCase() === 'dxf' || designData.file_type?.toLowerCase() === 'dwg';
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

  // DXF-related hooks - must be called unconditionally at top level
  const dxfBaseUrl = `${DESIGN_GLB_PREFIX_URL}${designId}`;
  const dxfImageUrl = `${dxfBaseUrl}/${designId}.webp`;
  
  // Create unified list for DXF: only supporting images (no primary image)
  const dxfViews = useMemo(() => {
    if (!isDxf) return [];
    const views = [];
    supportedImages.forEach((img, idx) => {
      views.push({ type: 'image', index: idx, url: img.url, name: img.name });
    });
    return views;
  }, [isDxf, dxfImageUrl, supportedImages, designId]);
  
  // State for current view index in DXF viewer
  const [dxfViewIdx, setDxfViewIdx] = useState(0);
  
  // Keyboard navigation for DXF
  useEffect(() => {
    if (!isDxf) return;
    const handleKeyPress = (e) => {
      if (dxfViews.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setDxfViewIdx((idx) => (idx - 1 + dxfViews.length) % dxfViews.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setDxfViewIdx((idx) => (idx + 1) % dxfViews.length);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [dxfViews.length, isDxf]);
  
  // For DXF files, show only the image
  if (isDxf) {
    // Get current image to display (only from supporting files)
    const currentDxfView = dxfViews[dxfViewIdx];
    const currentImageUrl = currentDxfView?.url;
    const currentImageName = currentDxfView?.name;
    
    // Navigation functions for DXF
    const goToPreviousDxf = () => {
      setDxfViewIdx((idx) => (idx - 1 + dxfViews.length) % dxfViews.length);
    };
    
    const goToNextDxf = () => {
      setDxfViewIdx((idx) => (idx + 1) % dxfViews.length);
    };
    
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

        {/* Image viewer for DXF files with navigation */}
        <div className={styles.viewerRoot}>
          {/* Left navigation button */}
          {dxfViews.length > 1 && (
            <button
              type="button"
              aria-label="Previous DXF view"
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousDxf();
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
          {dxfViews.length > 1 && (
            <button
              type="button"
              aria-label="Next DXF view"
              onClick={(e) => {
                e.stopPropagation();
                goToNextDxf();
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
          
          {currentImageUrl && (
            <div className={styles.stage} style={{ transform: `scale(${scale})` }}>
              <img
                className={styles.frame}
                src={currentImageUrl}
                alt={currentImageName || ''}
                width={1200}
                height={650}
                loading="lazy"
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          )}
          <div className={styles.controls}>
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
        </div>

        {/* Thumbnail carousel for DXF/DWG files - only supporting images */}
        <div
          style={{
            position: 'relative',
            marginTop: 16,
            background: '#fff',
            padding: '8px 36px',
            borderRadius: 8,
            boxShadow: '0 2px 8px #0001',
          }}
        >
          {/* Left scroll button */}
          {dxfViews.length > 1 && (
            <button
              type="button"
              aria-label="Scroll thumbnails left"
              onClick={(e) => {
                e.stopPropagation();
                const carousel = e.currentTarget.parentElement.querySelector('[data-carousel]');
                if (carousel) {
                  carousel.scrollBy({ left: -320, behavior: 'smooth' });
                }
              }}
              style={{
                position: 'absolute',
                left: 4,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #D1D4D7',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                fontSize: '18px',
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

          {/* Right scroll button */}
          {dxfViews.length > 1 && (
            <button
              type="button"
              aria-label="Scroll thumbnails right"
              onClick={(e) => {
                e.stopPropagation();
                const carousel = e.currentTarget.parentElement.querySelector('[data-carousel]');
                if (carousel) {
                  carousel.scrollBy({ left: 320, behavior: 'smooth' });
                }
              }}
              style={{
                position: 'absolute',
                right: 4,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #D1D4D7',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                fontSize: '18px',
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

          {/* Scrollable carousel container */}
          <div
            data-carousel
            style={{
              display: 'flex',
              gap: 10,
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              padding: '2px 0',
            }}
          >
            <style>{`
              div[data-carousel]::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {/* Supporting image thumbnails only */}
            {dxfViews.map((view, idx) => {
              const isActive = dxfViewIdx === idx;
              return (
                <div
                  key={`dxf-img-${idx}`}
                  style={{
                    flexShrink: 0,
                    width: 70,
                    height: 70,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isActive ? '2px solid #610BEE' : '1px solid #ccc',
                    borderRadius: 6,
                    background: '#fff',
                    boxShadow: isActive ? '0 0 6px #610BEE55' : undefined,
                    cursor: 'pointer',
                    transition: 'border 0.2s, box-shadow 0.2s',
                  }}
                  onClick={() => setDxfViewIdx(idx)}
                >
                  <img
                    src={view.url}
                    alt={view.name}
                    width={70}
                    height={70}
                    style={{
                      width: '90%',
                      height: '90%',
                      objectFit: 'contain',
                      borderRadius: 4,
                      background: '#fff',
                      display: 'block',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      

      {/* Main viewer area: show 3D viewer or selected image, always show gallery below */}
      <div className={styles.viewerRoot}>
        {/* Left navigation button */}
        {allViews.length > 1 && (
          <button
            type="button"
            aria-label="Previous view"
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
            type="button"
            aria-label="Next view"
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
              <Image
                className={styles.frame}
                src={src}
                alt={`sprite x=${xDeg} y=${yDeg}`}
                width={1200}
                height={650}
                priority
                draggable={false}
                style={{ cursor: supportedImages.length > 0 ? 'pointer' : undefined }}
                sizes="(max-width: 768px) 100vw, 1200px"
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
                  aria-label="Rotate view up"
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
                    aria-label="Rotate view left"
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
                    aria-label="Rotate view right"
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
                  aria-label="Rotate view down"
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
                <button
                  type="button"
                  aria-label="Zoom in"
                  onClick={zoomIn}
                  className={styles.zoomButton}
                >
                  <AiOutlinePlus />
                </button>
                <button
                  type="button"
                  aria-label="Zoom out"
                  onClick={zoomOut}
                  className={styles.zoomButton}
                >
                  <HiOutlineMinus />
                </button>
                <button
                  type="button"
                  aria-label="Reset zoom"
                  onClick={resetZoom}
                  className={styles.zoomButton}
                >
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
              width={1200}
              height={650}
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

      {/* Unified thumbnail carousel for angle picker and supported images - horizontal scroll */}
      <div
        style={{
          position: 'relative',
          marginTop: 16,
          background: '#fff',
          padding: '8px 36px',
          borderRadius: 8,
          boxShadow: '0 2px 8px #0001',
        }}
      >
        {/* Left scroll button */}
        <button
          type="button"
          aria-label="Scroll thumbnails left"
          onClick={(e) => {
            e.stopPropagation();
            const carousel = e.currentTarget.parentElement.querySelector('[data-carousel]');
            if (carousel) {
              carousel.scrollBy({ left: -320, behavior: 'smooth' });
            }
          }}
          style={{
            position: 'absolute',
            left: 4,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid #D1D4D7',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
            fontSize: '18px',
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

        {/* Right scroll button */}
        <button
          type="button"
          aria-label="Scroll thumbnails right"
          onClick={(e) => {
            e.stopPropagation();
            const carousel = e.currentTarget.parentElement.querySelector('[data-carousel]');
            if (carousel) {
              carousel.scrollBy({ left: 320, behavior: 'smooth' });
            }
          }}
          style={{
            position: 'absolute',
            right: 4,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid #D1D4D7',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
            fontSize: '18px',
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

        {/* Scrollable carousel container */}
        <div
          data-carousel
          style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none', // Firefox - hide scrollbar
            msOverflowStyle: 'none', // IE and Edge - hide scrollbar
            padding: '2px 0',
          }}
        >
          <style>{`
            div[data-carousel]::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Opera - hide scrollbar */
            }
          `}</style>
          
          {/* Angle picker thumbnails: only specific angles as requested */}
          {ANGLE_VIEWS.map(({x, y}, angleIdx) => {
            const thumbSrc = `${baseUrl}/sprite_${fmt(wrapDeg(x), padX)}_${fmt(wrapDeg(y), padY)}.${ext}`;
            const isActive = currentViewIdx === angleIdx;
            return (
              <div
                key={`angle-${x}-${y}`}
                style={{
                  flexShrink: 0,
                  width: 70,
                  height: 70,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isActive ? '2px solid #610BEE' : '1px solid #ccc',
                  borderRadius: 6,
                  background: '#fff',
                  boxShadow: isActive ? '0 0 6px #610BEE55' : undefined,
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
                  width={70}
                  height={70}
                  style={{
                    width: '90%',
                    height: '90%',
                    objectFit: 'contain',
                    borderRadius: 4,
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
                  flexShrink: 0,
                  width: 70,
                  height: 70,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isActive ? '2px solid #610BEE' : '1px solid #ccc',
                  borderRadius: 6,
                  background: '#fff',
                  boxShadow: isActive ? '0 0 6px #610BEE55' : undefined,
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
                  width={70}
                  height={70}
                  style={{
                    width: '90%',
                    height: '90%',
                    objectFit: 'contain',
                    borderRadius: 4,
                    background: '#fff',
                    display: 'block',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}