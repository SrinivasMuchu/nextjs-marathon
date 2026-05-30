"use client";

import { useRouter } from "next/navigation";
import styles from "./TwoDDrawingCtaBanner.module.css";

export default function TwoDDrawingCtaBannerButton({
  // href = "/tools/cad-drawing-pipeline",
  href = "",
  children,
}) {
  const router = useRouter();

  if (!href) return null;

  return (
    <button
      type="button"
      className={styles.btnWhite}
      onClick={() => router.push(href)}
    >
      {children}
    </button>
  );
}
