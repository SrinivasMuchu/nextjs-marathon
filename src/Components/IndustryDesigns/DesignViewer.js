"use client";
import { useMemo, useState, useEffect } from "react";
import styles from "./IndustryDesign.module.css";
import { DESIGN_GLB_PREFIX_URL } from "@/config";
import { IoIosArrowBack,IoIosArrowDown ,IoIosArrowForward ,IoIosArrowUp  } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { HiOutlineMinus } from "react-icons/hi";
import { CiUndo } from "react-icons/ci";
import IndustryAnglePicker from "./IndustryAnglePicker";
import IndustryDesignHeader from "./IndustryDesignHeader";
import DesignStats from "../CommonJsx/DesignStats";
import Link from "next/link";// client part
import DownloadClientButton from "../CommonJsx/DownloadClientButton";

const wrapDeg = (deg) => ((deg % 360) + 360) % 360;
const step = 30;

export default function DesignViewer({
  designId,designData,
  padX = 0,
  padY = 0,
  ext = "webp",
  initialX = 0,
  initialY = 0,
}) {
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
    return () => window.removeEventListener("resize", checkScreen);
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
      {showHeader && <div className={styles["industry-design-header-viewer-top"]}>
         {/* <EditableFields initialTitle={designData.response.page_title} initialDesc={designData.page_description} fileId={designData._id} orgId={designData._id}/> */}
        {/* <span>Experience in 3-D</span> */}
        <div style={{width:'100%',display:'flex',alignItems:'flex-start',}}>
    <DesignStats
            views={designData.total_design_views}
            downloads={designData.total_design_downloads}
            ratings={{ average: designData.average_rating, total: designData.total_ratings }} />


        </div>
      
        <div className={styles.statsCont} style={{display:'flex',alignItems:'center',gap:'10px',justifyContent:'center',width:'100%',flexWrap:'wrap'}}>
            <DownloadClientButton custumDownload={true}
          folderId={designData._id} isDownladable={designData.is_downloadable} step={true} filetype={designData.file_type ? designData.file_type : 'step'} />
 <Link
          href={`/tools/cad-renderer?fileId=${designData._id}&format=${
            designData.file_type ? designData.file_type : "step"
          }`}
          rel="nofollow"
        >
          <button>Open in 3D viewer</button>
        </Link>
       
        </div>
        
      </div>}
      <div className={styles.viewerRoot}>
        <div className={styles.stage} style={{ transform: `scale(${scale})` }}>
          <img className={styles.frame} src={src} alt={`sprite x=${xDeg} y=${yDeg}`} draggable={false} />
        </div>

        <div className={styles.controls}>
          <div className={styles.dpad}>
            <button onClick={() => setXDeg((v) => wrapDeg(v + step))} className={styles.button}><IoIosArrowUp/></button>
            <div className={styles.h}>
              <button onClick={() => setYDeg((v) => wrapDeg(v - step))} className={styles.button}><IoIosArrowBack/></button>
              <button onClick={() => setYDeg((v) => wrapDeg(v + step))} className={styles.button}><IoIosArrowForward/></button>
            </div>
            <button onClick={() => setXDeg((v) => wrapDeg(v - step))} className={styles.button}><IoIosArrowDown/></button>
          </div>

          <div className={styles.zoom}>
            <button onClick={zoomIn} className={styles.zoomButton}><AiOutlinePlus/></button>
            <button onClick={zoomOut} className={styles.zoomButton}><HiOutlineMinus/></button>
            <button onClick={resetZoom} className={styles.zoomButton}><CiUndo/></button>
          </div>
        </div>
      </div>

      {/* Static angle picker */}
      <IndustryAnglePicker
        designId={designId}
        xDeg={xDeg}
        yDeg={yDeg}
        onPick={({x, y}) => { setXDeg(wrapDeg(x)); setYDeg(wrapDeg(y)); }}
        padX={padX}
        padY={padY}
        ext={ext}
      />
    </>
  );
}
