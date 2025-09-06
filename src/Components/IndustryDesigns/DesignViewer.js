"use client";
import { useMemo, useState } from "react";
import styles from "./IndustryDesign.module.css";
import { DESIGN_GLB_PREFIX_URL } from "@/config";
import { IoIosArrowBack,IoIosArrowDown ,IoIosArrowForward ,IoIosArrowUp  } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { HiOutlineMinus } from "react-icons/hi";
import { CiUndo } from "react-icons/ci";
import IndustryAnglePicker from "./IndustryAnglePicker";

const wrapDeg = (deg) => ((deg % 360) + 360) % 360;
const step = 30;

export default function DesignViewer({
  designId,
  padX = 0,
  padY = 0,
  ext = "webp",
  initialX = 0,
  initialY = 0,
}) {
  const baseUrl = `${DESIGN_GLB_PREFIX_URL}${designId}`;
  const [xDeg, setXDeg] = useState(initialX);
  const [yDeg, setYDeg] = useState(initialY);
  const [scale, setScale] = useState(1);

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
