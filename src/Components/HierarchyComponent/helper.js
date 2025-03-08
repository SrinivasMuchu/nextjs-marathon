"use client";
import { useCallback, useState } from "react";

export const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {
  const [translate, setTranslate] = useState(defaultTranslate);
  const [dimensions, setDimensions] = useState();
  const containerRef = useCallback((containerElem) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setDimensions({ width, height });

      // Calculate the initial x and y values for translation
      const initialX = width / 2;
      const initialY = height /4.5;
      

      setTranslate({ x: initialX, y: initialY });
    }
  }, []);
  return [dimensions, translate, containerRef];
};
