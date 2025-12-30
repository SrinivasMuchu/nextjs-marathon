import Image from "next/image";
import { DESIGN_GLB_PREFIX_URL } from "@/config";

const wrapDeg = (d) => ((d % 360) + 360) % 360;
const fmt = (n, w) => (w > 0 ? String(n).padStart(w, "0") : String(n));

export default function IndustryAnglePicker({
  designId,
  xDeg,
  yDeg,
  onPick,          // ({x,y}) => void
  padX = 0,
  padY = 0,
  ext = "webp",
}) {
  const baseUrl = `${DESIGN_GLB_PREFIX_URL}${designId}`;

  // exactly 8 static angles (all valid multiples of 30°)
  const slides = [
    { x: 0,   y: 0 },
    { x: 0,   y: 60 },
    { x: 0,   y: 120 },
    // { x: 0,   y: 180 },
    // { x: 0,   y: 240 },
    // { x: 0,   y: 300 },
    { x: 30,  y: 0 },
    { x: 330, y: 0 },
  ];

  const isActive = (s) => wrapDeg(s.x) === wrapDeg(xDeg) && wrapDeg(s.y) === wrapDeg(yDeg);

  return (
    <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 flex-wrap px-4">
      {slides.map((s, idx) => {
        const x = fmt(s.x, padX);
        const y = fmt(s.y, padY);
        const src = `${baseUrl}/sprite_${x}_${y}.${ext}`;
        const active = isActive(s);
        return (
          <button
            key={`${s.x}-${s.y}-${idx}`}
            onClick={() => onPick({ x: s.x, y: s.y })}
            className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 ${
              active ? "border-black" : "border-transparent"
            }`}
            aria-label={`Set angle X ${s.x}°, Y ${s.y}°`}
          >
            <Image
              src={src}
              alt={`x=${s.x}° y=${s.y}°`}
              width={64}
              height={64}
              className="object-cover w-16 h-16"
              loading="eager"
            />
          </button>
        );
      })}
    </div>
  );
}
