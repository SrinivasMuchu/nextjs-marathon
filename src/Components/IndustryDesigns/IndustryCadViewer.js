"use client";
import dynamic from 'next/dynamic';

const CubeLoader = dynamic(() => import('../CommonJsx/Loaders/CubeLoader'), {
    ssr: false,
});
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';
import DownloadIcon from '@mui/icons-material/Download';
import { useRouter, useSearchParams } from "next/navigation";
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav';
import { sendGAtagEvent } from '@/common.helper';
import { BASE_URL, DESIGN_GLB_PREFIX_URL,CAD_VIEWER_EVENT } from '@/config';
import axios from 'axios';

const ANGLE_STEP = 30;
const BUFFER_SIZE = 0;
const MAX_ROTATION = 360;
const ZOOM_STEP = 0.5;
const MIN_ZOOM = 2;
const MAX_ZOOM = 10;
function IndustryCadViewer() {

    const mountRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const planeRef = useRef(null);
    const animationFrameRef = useRef(null);
    const loadedTexturesRef = useRef(new Set()); // Track loaded textures
    const [materials, setMaterials] = useState({});
    const [lastValidMaterial, setLastValidMaterial] = useState(null);
    const [xRotation, setXRotation] = useState(0);
    const [yRotation, setYRotation] = useState(0);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentZoom, setCurrentZoom] = useState(3.6);
    const [isDownLoading, setIsDownLoading] = useState(false);
     const [isDownLoadable, setIsDownLoadable] = useState(false);
    const searchParams = useSearchParams();
    const file_id = searchParams.get('fileId');
    const format = searchParams.get('format') || 'step';
    const [folderId, setFolderId] = useState(file_id || '');
    const router = useRouter();

    useEffect(() => {
        if (file_id) {
            setFolderId(file_id);
            checkPermission(file_id);
        }
    }, [file_id]);
    const checkPermission = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/v1/cad/check-download`, {
                params: { design_id: folderId },
                
            });

            setIsDownLoadable(response.data.data); // Re-enable button after completion
        } catch (error) {
            console.error('Error checking history:', error);
        } 
    };

    // Function to generate texture URL
    const getTextureUrl = useCallback((x, y) => {
        if (!folderId) return "";  // Prevent invalid URL when folderId is empty
        const xFormatted = ((x % 360 + 360) % 360);
        const yFormatted = ((y % 360 + 360) % 360);

        return `${DESIGN_GLB_PREFIX_URL}${folderId}/sprite_${xFormatted}_${yFormatted}.webp`;
    }, [folderId]);


    // Initial texture setup
    const setupTextures = useCallback(async () => {

        if (!rendererRef.current || !folderId) return {}; // Ensure folderId exists

        const textureLoader = new THREE.TextureLoader();
        const newMaterials = {};

        for (let x = -BUFFER_SIZE; x <= BUFFER_SIZE; x += ANGLE_STEP) {
            for (let y = -BUFFER_SIZE; y <= BUFFER_SIZE; y += ANGLE_STEP) {
                const key = `${x}_${y}`;
                const textureUrl = getTextureUrl(x, y);
                if (!textureUrl) continue; // Skip if folderId is missing

                try {
                    const texture = await new Promise((resolve, reject) => {
                        textureLoader.load(textureUrl, resolve, undefined, reject);
                    });

                    texture.minFilter = THREE.LinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    newMaterials[key] = new THREE.MeshBasicMaterial({
                        map: texture,
                        transparent: true,
                        side: THREE.DoubleSide
                    });
                } catch (error) {
                    console.error(`Failed to load texture: ${textureUrl}`, error);
                }
            }
        }

        setMaterials(newMaterials);
        // setIsLoading(false)
    }, [folderId, getTextureUrl]);

    // Progressive texture loading
    const loadTexturesForRange = useCallback((xStart, xEnd, yStart, yEnd) => {
        if (!rendererRef.current || !folderId) return;

        const textureLoader = new THREE.TextureLoader();
        const newMaterials = { ...materials };

        for (let x = xStart; x <= xEnd; x += ANGLE_STEP) {
            for (let y = yStart; y <= yEnd; y += ANGLE_STEP) {
                const normalizedX = ((x % 360 + 360) % 360);
                const normalizedY = ((y % 360 + 360) % 360);
                const key = `${normalizedX}_${normalizedY}`;

                if (loadedTexturesRef.current.has(key)) continue;

                textureLoader.load(
                    getTextureUrl(normalizedX, normalizedY),
                    (texture) => {
                        texture.minFilter = THREE.LinearFilter;
                        texture.magFilter = THREE.LinearFilter;
                        texture.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy();

                        newMaterials[key] = new THREE.MeshBasicMaterial({
                            map: texture,
                            transparent: true,
                            side: THREE.DoubleSide
                        });

                        loadedTexturesRef.current.add(key);
                        setMaterials(prev => ({ ...prev, [key]: newMaterials[key] }));
                    },
                    undefined,
                    (error) => console.error(`Failed to load texture: ${key}`, error)
                );
            }
        }
    }, [materials, getTextureUrl, folderId]);

    // Maintain texture buffer
    const maintainTextureBuffer = useCallback(() => {
        const xStart = xRotation - BUFFER_SIZE;
        const xEnd = xRotation + BUFFER_SIZE;
        const yStart = yRotation - BUFFER_SIZE;
        const yEnd = yRotation + BUFFER_SIZE;

        loadTexturesForRange(xStart, xEnd, yStart, yEnd);
    }, [xRotation, yRotation, loadTexturesForRange]);

    // Rotation handler
    const rotateView = useCallback((direction) => {
        switch (direction) {
            case 'up':
                setXRotation(prev => (prev - ANGLE_STEP + MAX_ROTATION) % MAX_ROTATION);
                break;
            case 'down':
                setXRotation(prev => (prev + ANGLE_STEP) % MAX_ROTATION);
                break;
            case 'left':
                setYRotation(prev => (prev - ANGLE_STEP + MAX_ROTATION) % MAX_ROTATION);
                break;
            case 'right':
                setYRotation(prev => (prev + ANGLE_STEP) % MAX_ROTATION);
                break;
        }
    }, []);

    // Zoom handler
    const handleZoom = useCallback((direction) => {
        if (!cameraRef.current) return;

        const newZoom = direction === 'in'
            ? Math.max(currentZoom - ZOOM_STEP, MIN_ZOOM)
            : Math.min(currentZoom + ZOOM_STEP, MAX_ZOOM);

        setCurrentZoom(newZoom);

        const direction3D = new THREE.Vector3();
        cameraRef.current.getWorldDirection(direction3D);
        direction3D.multiplyScalar(-newZoom);
        cameraRef.current.position.copy(direction3D);
    }, [currentZoom]);

    // Scene initialization
    useEffect(() => {
        let mounted = true;
        let cleanup = null;

        const initializeScene = async () => {
            if (!mountRef.current) return;

            try {
                // Initialize renderer
                const renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    powerPreference: "high-performance",
                    alpha: true
                });
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.setSize(window.innerWidth, window.innerHeight);
                mountRef.current.appendChild(renderer.domElement);
                rendererRef.current = renderer;

                // Initialize scene
                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0xffffff);
                sceneRef.current = scene;

                // Setup camera
                const camera = new THREE.PerspectiveCamera(
                    40,
                    window.innerWidth / window.innerHeight,
                    0.1,
                    1000
                );
                camera.position.set(2, 2, 2);
                camera.lookAt(0, 0, 0);
                cameraRef.current = camera;

                // Create plane
                const geometry = new THREE.PlaneGeometry(2, 2);
                const tempMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    transparent: true,
                    opacity: 0.5,
                    side: THREE.DoubleSide
                });

                const plane = new THREE.Mesh(geometry, tempMaterial);
                planeRef.current = plane;
                scene.add(plane);

                // Load initial materials
                const newMaterials = await setupTextures();
                if (!mounted) return;
                setMaterials(newMaterials);

                // Animation loop
                const animate = () => {
                    animationFrameRef.current = requestAnimationFrame(animate);
                    renderer.render(scene, camera);
                };
                animate();

                // setIsLoading(false);

                cleanup = () => {
                    cancelAnimationFrame(animationFrameRef.current);
                    renderer.dispose();
                    geometry.dispose();
                    tempMaterial.dispose();
                    if (mountRef.current?.contains(renderer.domElement)) {
                        mountRef.current.removeChild(renderer.domElement);
                    }
                };

            } catch (error) {
                console.error('Scene initialization error:', error);
                setError('Failed to initialize scene');
                // setIsLoading(false);
            }
        };

        initializeScene();

        return () => {
            mounted = false;
            if (cleanup) cleanup();
        };
    }, [setupTextures]);
    useEffect(() => {
        if (!folderId) return;
        setIsLoading(true)
        const timeout = setTimeout(() => {

            setupTextures();
            rotateView('right')
        }, 300); // Adjust delay if needed
        setIsLoading(false)
        return () => clearTimeout(timeout);
    }, [folderId]);


    // Material update effect
    useEffect(() => {
        if (!planeRef.current || !materials || Object.keys(materials).length === 0 || !folderId) return;

        const materialKey = `${xRotation}_${yRotation}`;
        const newMaterial = materials[materialKey];
        setIsLoading(true)
        if (newMaterial?.map) {
            if (planeRef.current.material !== newMaterial) {
                if (planeRef.current.material &&
                    planeRef.current.material !== lastValidMaterial &&
                    planeRef.current.material !== newMaterial) {
                    planeRef.current.material.dispose();
                }
                planeRef.current.material = newMaterial;
                setLastValidMaterial(newMaterial);
            }
        }
        setIsLoading(false)
    }, [xRotation, yRotation, materials, lastValidMaterial, folderId]);

    // Buffer maintenance effect
    useEffect(() => {
        maintainTextureBuffer();
    }, [xRotation, yRotation, maintainTextureBuffer]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
                event.preventDefault();
                switch (event.key) {
                    case 'ArrowLeft':
                        rotateView('left');
                        break;
                    case 'ArrowRight':
                        rotateView('right');
                        break;
                    case 'ArrowUp':
                        rotateView('up');
                        break;
                    case 'ArrowDown':
                        rotateView('down');
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [rotateView]);

    // Window resize handler
    useEffect(() => {
        const handleResize = () => {
            if (!cameraRef.current || !rendererRef.current) return;

            const width = window.innerWidth;
            const height = window.innerHeight;

            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();

            rendererRef.current.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavigateBack = () => {
        router.back();
    }

    const handleDownload = async () => {
        try {
            setIsDownLoading(true);
            const response = await axios.post(`${BASE_URL}/v1/cad/get-signedurl`, {
                design_id: file_id,
                step: true,
                file_type: format
            }, {
                headers: {
                    "user-uuid": localStorage.getItem("uuid"),
                }
            });

            const data = response.data;
            if (data.meta.success) {
                const url = data.data.download_url;
                window.open(url, '_blank');
            }
            sendGAtagEvent({ event_name: 'design_view_file_download', event_category: CAD_VIEWER_EVENT });
        } catch (err) {
            console.error('Error downloading file:', err);
        } finally {
            setIsDownLoading(false);
        }
    };
    return (
        <>
            <HomeTopNav />
            {/* <button onClick={()=> router.push("/tools/cad-viewer")} style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
            }}><ArrowLeft style={{ width: '1.5rem', height: '1.5rem' }} /></button> */}
            {isLoading ? <CubeLoader /> :
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100vh'
                }}>
                    <button
                        onClick={handleNavigateBack} style={{

                            padding: '10px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.2s',
                            cursor: 'pointer',
                            position: 'absolute',
                            top: '2rem', left: '1rem', zIndex: 2
                        }}><ArrowLeft style={{ width: '24px', height: '24px' }} /></button>
                    {/* <a href={`https://d1d8a3050v4fu6.cloudfront.net/${folderId}/${folderId}.step`} download={`sprite_${xRotation}_${yRotation}.webp`}>  */}
                   {isDownLoadable &&<button onClick={handleDownload}
                        disabled={isDownLoading}
                        style={{

                            padding: '10px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.2s',
                            cursor: 'pointer',
                            position: 'absolute',
                            top: '2rem', right: '1rem', zIndex: 2
                        }}><DownloadIcon style={{ width: '24px', height: '24px' }} /></button>}
                    
                    {/* </a>  */}

                    {/* Three.js Canvas Container */}
                    <div ref={mountRef} style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1
                    }} />

                    {/* Rotation Controls */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingBottom: '2rem',
                        zIndex: 1
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            {/* Control buttons */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <button
                                    onClick={() => rotateView('up')}
                                    style={{
                                        width: '3rem',
                                        height: '3rem',
                                        borderRadius: '9999px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        border: '1px solid #e5e7eb',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        transition: 'background-color 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                                >
                                    <ArrowUp style={{ width: '1.5rem', height: '1.5rem' }} />
                                </button>
                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem'
                                }}>
                                    <button
                                        onClick={() => rotateView('left')}
                                        style={{
                                            width: '3rem',
                                            height: '3rem',
                                            borderRadius: '9999px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            border: '1px solid #e5e7eb',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            transition: 'background-color 0.2s',
                                            cursor: 'pointer'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                                    >
                                        <ArrowLeft style={{ width: '1.5rem', height: '1.5rem' }} />
                                    </button>
                                    <button
                                        onClick={() => rotateView('right')}
                                        style={{
                                            width: '3rem',
                                            height: '3rem',
                                            borderRadius: '9999px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            border: '1px solid #e5e7eb',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            transition: 'background-color 0.2s',
                                            cursor: 'pointer'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                                    >
                                        <ArrowRight style={{ width: '1.5rem', height: '1.5rem' }} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => rotateView('down')}
                                    style={{
                                        width: '3rem',
                                        height: '3rem',
                                        borderRadius: '9999px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        border: '1px solid #e5e7eb',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        transition: 'background-color 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                                >
                                    <ArrowDown style={{ width: '1.5rem', height: '1.5rem' }} />
                                </button>
                            </div>

                            {/* Current view info */}
                            <div style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                padding: '0.5rem 1rem',
                                borderRadius: '9999px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e5e7eb'
                            }}>
                                <span style={{ fontWeight: 500 }}>
                                    Zoom: {currentZoom.toFixed(1)}x
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Zoom Controls */}
                    <div style={{
                        position: 'absolute',
                        right: '2rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        zIndex: 2
                    }}>
                        <button
                            onClick={() => handleZoom('in')}
                            style={{
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '9999px',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                transition: 'background-color 0.2s',
                                cursor: 'pointer',
                                opacity: currentZoom <= MIN_ZOOM ? 0.5 : 1
                            }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                            disabled={currentZoom <= MIN_ZOOM}
                        >
                            <ZoomIn style={{ width: '1.5rem', height: '1.5rem' }} />
                        </button>
                        <button
                            onClick={() => handleZoom('out')}
                            style={{
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '9999px',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                transition: 'background-color 0.2s',
                                cursor: 'pointer',
                                opacity: currentZoom >= MAX_ZOOM ? 0.5 : 1
                            }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                            disabled={currentZoom >= MAX_ZOOM}
                        >
                            <ZoomOut style={{ width: '1.5rem', height: '1.5rem' }} />
                        </button>
                    </div>

                    {/* Loading and Error states remain the same */}

                    {error && (
                        <div style={{
                            position: 'absolute',
                            top: '1rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#fee2e2',
                            border: '1px solid #ef4444',
                            color: '#b91c1c',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            zIndex: 3
                        }}>
                            {error}
                        </div>
                    )}
                </div>}
            {/* { Object.keys(materials).length === 0 && (
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                zIndex: 10
            }}>
                <cubeLoader/>
            </div>
        )} */}
        </>

    );
}

export default IndustryCadViewer