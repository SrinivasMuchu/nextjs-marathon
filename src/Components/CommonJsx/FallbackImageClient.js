"use client";

import { useState } from "react";

export default function FallbackImageClient({
  className,
  src,
  fallbackSrc = "",
  alt = "",
}) {
  const [currentSrc, setCurrentSrc] = useState(src || "");
  const [fallbackTried, setFallbackTried] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden || !currentSrc) return null;

  return (
    <img
      className={className}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (!fallbackTried && fallbackSrc) {
          setFallbackTried(true);
          setCurrentSrc(fallbackSrc);
          return;
        }
        setHidden(true);
      }}
    />
  );
}
