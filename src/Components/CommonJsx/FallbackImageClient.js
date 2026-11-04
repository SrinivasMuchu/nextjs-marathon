"use client";

import { useState } from "react";
import { useAuthedTechDrawSrc } from "@/lib/techDraw/authTechDrawFetch";

export default function FallbackImageClient({
  className,
  src,
  fallbackSrc = "",
  candidates,
  alt = "",
}) {
  const list =
    Array.isArray(candidates) && candidates.length > 0
      ? candidates.filter(Boolean)
      : [src, fallbackSrc].filter(Boolean);
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  const currentSrc = list[index] || "";
  const resolvedSrc = useAuthedTechDrawSrc(currentSrc);

  if (hidden || !resolvedSrc) return null;

  return (
    <img
      className={className}
      src={resolvedSrc}
      alt={alt}
      onError={() => {
        if (index + 1 < list.length) {
          setIndex(index + 1);
          return;
        }
        setHidden(true);
      }}
    />
  );
}
