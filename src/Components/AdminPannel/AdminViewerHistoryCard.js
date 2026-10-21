"use client";

import React from "react";
import styles from "../History/FileHistory.module.css";
import { buildCadViewerGlbUrl } from "@/config";
import FileStatus from "../CommonJsx/FileStatus";
import { textLettersLimit } from "@/common.helper";
import HoverImageSequence from "../CommonJsx/RotatedImages";
import DesignDetailsStats from "../CommonJsx/DesignDetailsStats";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import { GlbViewerDownloadOverlay, useGlbSource } from "../PDMViewer/GlbLoadFallback";
import * as THREE from "three";

const PRESET_SEQUENCE = [
  new THREE.Euler(0, 0, 0),
  new THREE.Euler(-Math.PI / 2, 0, 0),
  new THREE.Euler(0, Math.PI, 0),
  new THREE.Euler(Math.PI / 2, 0, 0),
];
const ISOMETRIC = new THREE.Euler(0.55, 0.75, 0);

function PreviewModel({ glbUrl, hovered, onReady }) {
  const { scene } = useGLTF(glbUrl, true);
  const modelRef = React.useRef(null);
  const readyNotifiedRef = React.useRef(false);
  const clone = React.useMemo(() => scene.clone(true), [scene]);
  const presetIndexRef = React.useRef(0);
  const elapsedRef = React.useRef(0);

  React.useLayoutEffect(() => {
    readyNotifiedRef.current = false;
  }, [glbUrl]);

  React.useLayoutEffect(() => {
    if (!scene || readyNotifiedRef.current) return;
    readyNotifiedRef.current = true;
    onReady?.();
  }, [scene, onReady]);

  useFrame((_, delta) => {
    if (!modelRef.current) return;

    if (!hovered) {
      modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, ISOMETRIC.x, 0.12);
      modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, ISOMETRIC.y, 0.12);
      modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, ISOMETRIC.z, 0.12);
      elapsedRef.current = 0;
      presetIndexRef.current = 0;
      return;
    }

    elapsedRef.current += delta;
    if (elapsedRef.current >= 0.9) {
      elapsedRef.current = 0;
      presetIndexRef.current = (presetIndexRef.current + 1) % PRESET_SEQUENCE.length;
    }

    const target = PRESET_SEQUENCE[presetIndexRef.current];
    modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, target.x, 0.14);
    modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, target.y, 0.14);
    modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, target.z, 0.14);
  });

  return (
    <group ref={modelRef} rotation={[ISOMETRIC.x, ISOMETRIC.y, ISOMETRIC.z]}>
      <Center>
        <primitive object={clone} />
      </Center>
    </group>
  );
}

function GlbPreview({ glbUrl, hovered }) {
  const glbSource = useGlbSource(glbUrl);

  return (
    <div style={{ position: "relative", width: "100%", height: "160px", background: "#101018" }}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 6]} intensity={1.0} />
        <directionalLight position={[-4, 2, -4]} intensity={0.22} />
        <React.Suspense fallback={null}>
          {glbSource.objectUrl ? (
            <PreviewModel
              key={glbSource.objectUrl}
              glbUrl={glbSource.objectUrl}
              hovered={hovered}
              onReady={glbSource.markReady}
            />
          ) : null}
        </React.Suspense>
      </Canvas>
      <GlbViewerDownloadOverlay
        status={glbSource.status}
        progress={glbSource.progress}
        progressKnown={glbSource.progressKnown}
        stage={glbSource.stage}
        error={glbSource.error}
        variant="dark"
      />
    </div>
  );
}

function formatCreated(file) {
  if (file?.createdAtFormatted) return file.createdAtFormatted;
  if (!file?.createdAt) return "";
  const date = new Date(file.createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminViewerHistoryCard({ file }) {
  const [hovered, setHovered] = React.useState(false);
  const fileType = file?.file_name && file.file_name.includes(".")
    ? `.${file.file_name.split(".").pop().toLowerCase()}`
    : ".step";
  const fileTypeLabel = file?.file_name && file.file_name.includes(".")
    ? `.${file.file_name.split(".").pop().toUpperCase()}`
    : ".STEP";

  return (
    <div
      className={styles.historyItem}
      style={{ width: "310px", position: "relative", cursor: "default" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: "absolute", top: "10px" }}>
        <FileStatus status={file.status} />
      </div>
      {file.status === "COMPLETED" ? (
        file?.glb_url ? (
          <GlbPreview glbUrl={buildCadViewerGlbUrl(file._id)} hovered={hovered} />
        ) : (
          <HoverImageSequence design={{ _id: file._id, page_title: file.file_name }} width={300} height={160} />
        )
      ) : (
        <div style={{ width: "100%", height: "160px", background: "#e6e4f0" }} />
      )}
      <div className={styles.historyFileDetails}>
        <span style={{ fontSize: "16px", fontWeight: "500" }}>{textLettersLimit(file.file_name, 20)}</span>
      </div>
      <div style={{ width: "75px", fontSize: "12px" }}>
        <DesignDetailsStats fileType={fileType} text={fileTypeLabel} />
      </div>
      <div className={styles.historyFileDetails}>
        <span style={{ color: "rgba(0, 19, 37, 0.50)", fontSize: "12px", fontWeight: "400" }}>
          {formatCreated(file)}
        </span>
      </div>
    </div>
  );
}
