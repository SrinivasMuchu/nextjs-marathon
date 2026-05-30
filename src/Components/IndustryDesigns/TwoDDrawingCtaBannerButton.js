"use client";

import { useRouter } from "next/navigation";
import styles from "./TwoDDrawingCtaBanner.module.css";

export default function TwoDDrawingCtaBannerButton({
  href = "/tools/cad-drawing-pipeline",
  children,
}) {
  const router = useRouter();

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
