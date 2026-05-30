"use client";

import { useRouter } from "next/navigation";
import styles from "./TwoDDrawingRightSidebar.module.css";

export default function TwoDDrawingUploadGenerateButton({
  // href = "/tools/cad-drawing-pipeline",
  href = "",
  label = "⚡ Upload CAD & Generate",
}) {
  const router = useRouter();

  if (!href) return null;

  return (
    <button
      type="button"
      className={styles.generateBtn}
      onClick={() => router.push(href)}
    >
      {label}
    </button>
  );
}
