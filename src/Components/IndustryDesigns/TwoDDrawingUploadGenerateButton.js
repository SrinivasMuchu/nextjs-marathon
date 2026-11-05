"use client";

import { useRouter } from "next/navigation";
import styles from "./TwoDDrawingRightSidebar.module.css";

export default function TwoDDrawingUploadGenerateButton({
  href = "/tools/convert-step-to-2d-drawing",
  label = "⚡ Upload CAD & Generate",
}) {
  const router = useRouter();

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
