import React, { useState } from "react";
import styles from "./IndustryDesign.module.css";

// Simple gallery for supported images (png, jpg, jpeg)
export default function IndustryImageGallery({ images, onSelect }) {
  if (!images || images.length === 0) return null;
  return (
    <div className={styles.imageGalleryRoot} style={{ marginTop: 24 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {images.map((img, idx) => (
          <img
            key={img.url}
            src={img.url}
            alt={img.name}
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              border: "1px solid #ccc",
              borderRadius: 6,
              cursor: "pointer",
            }}
            onClick={() => onSelect && onSelect(idx)}
          />
        ))}
      </div>
    </div>
  );
}