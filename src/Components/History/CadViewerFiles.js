"use client";
import React from 'react'
import styles from './FileHistory.module.css';
import { DESIGN_GLB_PREFIX_URL, IMAGEURLS } from '@/config';
import Image from 'next/image';
import Loading from '../CommonJsx/Loaders/Loading';
import { IoAddSharp } from "react-icons/io5";
import FileStatus from '../CommonJsx/FileStatus';
import Link from 'next/link';
import { textLettersLimit } from '@/common.helper';
import HoverImageSequence from '../CommonJsx/RotatedImages';
import DesignDetailsStats from '../CommonJsx/DesignDetailsStats';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const HISTORY_PRESET_SEQUENCE = [
  new THREE.Euler(0, 0, 0), // front
  new THREE.Euler(-Math.PI / 2, 0, 0), // top
  new THREE.Euler(0, Math.PI, 0), // back
  new THREE.Euler(Math.PI / 2, 0, 0), // down
];
const HISTORY_ISOMETRIC = new THREE.Euler(0.55, 0.75, 0);

function HistoryGlbModel({ glbUrl, hovered }) {
  const { scene } = useGLTF(glbUrl);
  const modelRef = React.useRef(null);
  const clone = React.useMemo(() => scene.clone(true), [scene]);
  const presetIndexRef = React.useRef(0);
  const elapsedRef = React.useRef(0);

  useFrame((_, delta) => {
    if (!modelRef.current) return;

    if (!hovered) {
      modelRef.current.rotation.x = THREE.MathUtils.lerp(
        modelRef.current.rotation.x,
        HISTORY_ISOMETRIC.x,
        0.12
      );
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        HISTORY_ISOMETRIC.y,
        0.12
      );
      modelRef.current.rotation.z = THREE.MathUtils.lerp(
        modelRef.current.rotation.z,
        HISTORY_ISOMETRIC.z,
        0.12
      );
      elapsedRef.current = 0;
      presetIndexRef.current = 0;
      return;
    }

    elapsedRef.current += delta;
    if (elapsedRef.current >= 0.9) {
      elapsedRef.current = 0;
      presetIndexRef.current =
        (presetIndexRef.current + 1) % HISTORY_PRESET_SEQUENCE.length;
    }

    const target = HISTORY_PRESET_SEQUENCE[presetIndexRef.current];
    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x,
      target.x,
      0.14
    );
    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      target.y,
      0.14
    );
    modelRef.current.rotation.z = THREE.MathUtils.lerp(
      modelRef.current.rotation.z,
      target.z,
      0.14
    );
  });

  return (
    <group ref={modelRef} rotation={[HISTORY_ISOMETRIC.x, HISTORY_ISOMETRIC.y, HISTORY_ISOMETRIC.z]}>
      <Center>
        <primitive object={clone} />
      </Center>
    </group>
  );
}

function HistoryGlbHoverPreview({ glbUrl, hovered }) {
  return (
    <div style={{ width: '100%', height: '160px', background: '#101018' }}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 6]} intensity={1.0} />
        <directionalLight position={[-4, 2, -4]} intensity={0.22} />
        <React.Suspense fallback={null}>
          <HistoryGlbModel glbUrl={glbUrl} hovered={hovered} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

const isGlbFile = (file) => Boolean(file?.glb_url);
const resolveHistoryGlbUrl = (file) => {
  if (!file?.glb_url) return '';
  // Keep consistent with cad-renderer page: always build from CDN prefix + file id.
  // Some backend rows carry private S3 URLs in glb_url (403 from browser).
  const id = encodeURIComponent(file?._id || '');
  if (!id) return '';
  return `${DESIGN_GLB_PREFIX_URL}${id}/${id}.glb`;
};

function CadViewerFiles({ loading, cadViewerFileHistory, searchTerm,
  setSearchTerm, getFileHref, setIsEmailVerify }) {
  const [hoveredGlbId, setHoveredGlbId] = React.useState(null);
  return (
    <div className={styles.cadViewerContainerContent}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '24px',
          padding: '8px 16px',
          border: '1px solid #e9ecef',
          minWidth: '280px',
          gap: '8px'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search project"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              flex: 1,
              fontSize: '14px',
              color: '#495057'
            }}
          />
        </div>
        {/* <button className={styles.cadUploadingButton}  */}
        {/* > */}
        <Link href='/tools//3D-cad-viewer'
          // style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          style={{
            borderRadius: '8px',
            border: '2px solid #610BEE',
            background: 'white',
            color: '#610BEE',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}

          onMouseEnter={(e) => {
            e.target.style.background = '#610BEE';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'white';
            e.target.style.color = '#610BEE';
          }}><IoAddSharp /> New file</Link>
        {/* </button> */}
      </div>
      {loading ? <Loading smallScreen={true} /> : <>

        {cadViewerFileHistory.length > 0 ? (
          <>


            <div className={styles.historyContainer}>

              {cadViewerFileHistory.map((file, index) => (
                <a
                  key={index}
                  href={getFileHref(file)}
                  className={styles.historyItem}
                  style={{ width: '310px', position: 'relative' }}
                  onMouseEnter={() => setHoveredGlbId(file?._id || null)}
                  onMouseLeave={() => setHoveredGlbId(null)}
                  onClick={e => {
                    if (!localStorage.getItem('is_verified')) {
                      e.preventDefault();
                      setIsEmailVerify(true); // <-- call this here, not in getFileHref
                      return;
                    }
                    if (file.status !== 'COMPLETED') {
                      e.preventDefault();
                      return;
                    }
                    // localStorage.setItem("last_viewed_cad_key", file._id);
                  }}
                >

                  <div style={{ position: 'absolute', top: '10px' }}>
                    <FileStatus status={file.status} />
                  </div>
                  {file.status === 'COMPLETED' ? (
                    isGlbFile(file) ? (
                      <HistoryGlbHoverPreview
                        glbUrl={resolveHistoryGlbUrl(file)}
                        hovered={hoveredGlbId === file?._id}
                      />
                    ) : (
                      <HoverImageSequence design={{ _id: file._id, page_title: file.file_name }} width={300} height={160} />
                    )
                  ) : <div style={{ width: '100%', height: '160px', background: '#e6e4f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />}
                  {/* <div style={{ width: '100%', height: '2px', background: '#e6e4f0', marginBottom: '5px' }}></div> */}

                  <div className={styles.historyFileDetails}>
                    <span style={{ fontSize: '16px', fontWeight: '500' }}>{textLettersLimit(file.file_name, 20)}</span></div>
                  <div style={{ width: '75px', fontSize: '12px' }}>
                    <DesignDetailsStats
                      fileType={file?.file_name && file.file_name.includes(".")
                        ? `.${file.file_name.split(".").pop().toLowerCase()}`
                        : ".step"}
                      text={file?.file_name && file.file_name.includes(".")
                        ? `.${file.file_name.split(".").pop().toUpperCase()}`
                        : ".STEP"}
                    />



                  </div>

                  {/* <div className={styles.historyFileDetails}><span className={styles.historyFileDetailsKey}>Status</span> <span style={{ color: 'green' }}>{file.status}</span></div> */}
                  <div className={styles.historyFileDetails}> <span style={{ color: 'rgba(0, 19, 37, 0.50)', fontSize: '12px', fontWeight: '400' }}>{file.createdAtFormatted}</span></div>

                  {/* <div className={styles.historyFileDetailsbtn} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <button onClick={() => handleViewDesign(file)} disabled={file.status !== 'COMPLETED'} style={{
                            background: file.status !== 'COMPLETED' ? '#a270f2' : '#610bee',
                            color: 'white',
                            padding: '5px 10px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}>View design</button>
                        </div> */}
                </a>
              ))}
            </div>
          </>

        ) : (
          <div style={{
            display: 'flex', justifyContent: 'center',
            alignItems: 'center', flexDirection: 'column',
            width: '300px', textAlign: 'center', gap: '40px'

          }}>
            <Image src={IMAGEURLS.nofilesLogo} alt="No files" width={135} height={135} />
            <span>You don’t have any projects yet.<br />
              <Link href='/tools//3D-cad-viewer' style={{ color: 'blue' }}>Upload</Link> your project files
            </span>
            {/* <Link href='/publish-cad' style={{ color: 'blue' }}>Click here</Link> */}
          </div>

        )}
      </>}
    </div>
  )
}

export default CadViewerFiles