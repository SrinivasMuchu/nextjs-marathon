"use client";
import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import * as THREE from 'three';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';
import axios from 'axios'
import { BASE_URL, BUCKET } from '@/config';
import CubeLoader from '../CommonJsx/Loaders/CubeLoader';
import { toast } from 'react-toastify';
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav';
import { contextState } from '../CommonJsx/ContextProvider';
// Constants
const ANGLE_STEP = 30;
const BUFFER_SIZE = 0;
const MAX_ROTATION = 360;
const ZOOM_STEP = 0.5;
const MIN_ZOOM = 2;
const MAX_ZOOM = 10;

export default function PartDesignView() {
    // Refs
    const mountRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const planeRef = useRef(null);
    const animationFrameRef = useRef(null);
    const loadedTexturesRef = useRef(new Set()); // Track loaded textures
    const [uploadingMessage, setUploadingMessage] = useState('');
    const { file,setFile } = useContext(contextState);
    const [materials, setMaterials] = useState({});
    const [lastValidMaterial, setLastValidMaterial] = useState(null);
    const [xRotation, setXRotation] = useState(0);
    const [yRotation, setYRotation] = useState(0);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentZoom, setCurrentZoom] = useState(5);
    const [folderId, setFolderId] = useState('');


    useEffect(() => {
        if (!file) return;
        const fetchFileFromIndexedDB = async () => {
            try {

                handleFile(file);
            } catch (error) {
                console.error("Error retrieving file:", error);
            }
        };

        fetchFileFromIndexedDB();
    }, []);
    const handleFile = async (file) => {



        const fileSizeMB = file.size / (1024 * 1024); // Size in MB

        try {
            setIsLoading(true)
            setUploadingMessage('UPLOADINGFILE')
            const headers = {
                "x-auth-token": localStorage.getItem("token"),
            };
            const preSignedURL = await axios.post(
                `${BASE_URL}/v1/cad/get-next-presigned-url`,
                { bucket_name: BUCKET, file: file.name, category: "designs_upload", filesize: fileSizeMB, org_id: localStorage.getItem("org_id") }
            );

            if (
                preSignedURL.data.meta.code === 200 &&
                preSignedURL.data.meta.message === "SUCCESS" &&
                preSignedURL.data.data.url
            ) {
                if (preSignedURL.data.data.is_mutipart) {
                    await multiUpload(preSignedURL.data.data, file, headers, fileSizeMB);
                } else {
                    await simpleUpload(preSignedURL.data.data, file, fileSizeMB)
                    // await CreateCad(preSignedURL.data.data.url)
                }
                setFile('')
            } else {
                toast.error("⚠️ Error generating signed URL.");
                setIsLoading(false)
            }
        } catch (e) {
            console.error(e);
            setIsLoading(false)
        }
    };

    const CreateCad = async (link) => {
        try {
            setIsLoading(true)
            setUploadingMessage('UPLOADINGFILE')
            const response = await axios.post(
                `${BASE_URL}/v1/cad/create-cad`,
                { cad_view_link: link, organization_id: localStorage.getItem('org_id'), s3_bucket: 'design-glb' })
            // /design-view
            if (response.data.meta.success) {
                setUploadingMessage('PENDING')
                // await UpdateToDocker(link, response.data.data)
            } else {
                toast.error(response.data.meta.message)
                setIsLoading(false)
            }
            // await clearIndexedDB()
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }
    async function multiUpload(data, file, headers, fileSizeMB) {
        console.log(data, file, headers, fileSizeMB);
        const parts = [];

        for (let i = 0; i < data.total_parts; i++) {
            const start = i * data.part_size;
            const end = Math.min(start + data.part_size, file.size);
            const part = file.slice(start, end); // FIXED: Use `slice` for binary data

            console.log(`Uploading part ${i + 1}/${data.total_parts}`);
            console.log('Part size:', part.size); // Ensure correct part size

            parts.push(uploadPart(i, part, data, file));
        }

        try {
            const uploadedParts = await Promise.all(parts);
            console.log(uploadedParts);
            await completeMultipartUpload(data, uploadedParts, headers, fileSizeMB);
            console.log('All parts uploaded successfully');
        } catch (error) {
            console.error('Error uploading parts:', error);
            throw error;
        }
    }

    const uploadPart = async (partNumber, part, data, file) => {
        try {
            const { url } = data.url[partNumber]; // Get correct presigned URL
            console.log(`Uploading part ${partNumber + 1} to ${url}`);

            const result = await axios.put(url, part, {
                headers: {
                    "Content-Type": file.type,
                    "Content-Length": part.size, // Ensure Content-Length is set
                },
            });

            console.log('Response Headers:', result.headers);
            const etag = result.headers["etag"] || result.headers["ETag"]; // Fix header extraction
            console.log(`Part ${partNumber + 1} uploaded successfully`, etag);
            return { ETag: etag, PartNumber: partNumber + 1 };
        } catch (error) {
            console.error(`Error uploading part ${partNumber + 1}:`, error);
            throw error;
        }
    };

    const completeMultipartUpload = async (data, parts, headers, fileSizeMB) => {
        console.log(data, parts, headers, fileSizeMB);
        try {
            setIsLoading(true);
            setUploadingMessage('UPLOADINGFILE')
            const file = {
                key: data.key,
                upload_id: data.upload_id,
                parts: parts,
            };

            const preSignedURL = await axios.post(
                `${BASE_URL}/v1/cad/get-next-presigned-url`,
                { bucket_name: BUCKET, file, category: "complete_mutipart", org_id: localStorage.getItem("org_id"), filesize: fileSizeMB },
                { headers: headers }
            );

            if (preSignedURL.data.meta.code === 200 && preSignedURL.data.meta.message === "SUCCESS") {
                console.log("Multipart upload completed successfully.");

                // Ensure `CreateCad` is called correctly
                // if (preSignedURL.data.data.Location) {
                await CreateCad(preSignedURL.data.data.Location);
                // }

                return true;
            }
        } catch (error) {
            console.error("Error completing multipart upload:", error);
            setIsLoading(false);
        }
    };

    async function simpleUpload(data, file) {
        console.log("Uploading file:", data, file);
        setUploadingMessage('UPLOADINGFILE')
        const result = await axios.put(data.url, file, {
            headers: {
                "Content-Type": file.type,
                // "Content-Length": file.size,
            },
        });
        await CreateCad(data.url)
        console.log("Upload complete:", result);
    }



    useEffect(() => {
       
        if (uploadingMessage === 'FAILED' || uploadingMessage === 'COMPLETED' || uploadingMessage === '' || uploadingMessage === 'UPLOADINGFILE') return;

        const interval = setInterval(() => {
            getStatus();
        }, 3000);
        
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [uploadingMessage]);
    useEffect(() => {
       
        if (!file) {
            console.log('hi')
            getStatus();
        }
      
    }, [file]);

    const getStatus = async () => {
        try {
            setIsLoading(true)
            // const HEADERS = { "x-auth-token": localStorage.getItem('token') };
            const response = await axios.get(BASE_URL + '/v1/cad/get-status', {
                params: { org_id: localStorage.getItem('org_id') },

            });
            if (response.data.meta.success) {
                if (response.data.data.status === 'COMPLETED') {
                    setIsLoading(false)
                    setUploadingMessage(response.data.data.status)
                  
                    setFolderId(response.data.data.folderId)
                } else if (response.data.data.status !== 'COMPLETED' && response.data.data.status !== 'FAILED') {
                    setUploadingMessage(response.data.data.status)
                    console.log(response.data.data.status)
                } else if (response.data.data.status === 'FAILED') {
                    setUploadingMessage(response.data.data.status)
                    toast.error(response.data.data.status)
                    setIsLoading(false)
                }

            } else {
                setUploadingMessage('FAILED')
                toast.error(response.data.meta.message)
                setIsLoading(false)
            }


        } catch (error) {
            setUploadingMessage('FAILED')
            console.error("Error fetching data:", error);
            setIsLoading(false)
        }
    };

    // Function to generate texture URL
    const getTextureUrl = useCallback((x, y) => {
        if (!folderId) return "";  // Prevent invalid URL when folderId is empty
        const xFormatted = ((x % 360 + 360) % 360);
        const yFormatted = ((y % 360 + 360) % 360);
        console.log(folderId)
        return `https://d1d8a3050v4fu6.cloudfront.net/${folderId}/sprite_${xFormatted}_${yFormatted}.webp`;
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
    }, [folderId, getTextureUrl]);

    // Progressive texture loading
    const loadTexturesForRange = useCallback((xStart, xEnd, yStart, yEnd) => {
        // if() return
        if (!rendererRef.current ||!folderId) return;

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
    }, [materials, getTextureUrl]);

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
                camera.position.set(5, 5, 5);
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
        if (!folderId) return;  // Prevent loading textures with an empty folderId
        setupTextures();
    }, [folderId]);

    // Material update effect
    useEffect(() => {
        if (!planeRef.current || !materials || Object.keys(materials).length === 0) return;

        const materialKey = `${xRotation}_${yRotation}`;
        const newMaterial = materials[materialKey];

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
    }, [xRotation, yRotation, materials, lastValidMaterial]);

    // Buffer maintenance effect
    useEffect(() => {
        maintainTextureBuffer();
    }, [xRotation, yRotation, maintainTextureBuffer]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (event) => {
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


    useEffect(() => {
        console.log(`XRotation: ${xRotation}, YRotation: ${yRotation}`);
    }, [xRotation, yRotation]);
    
    useEffect(() => {
        console.log('Materials updated:', materials);
    }, [materials]);
    return (
        <>
            <HomeTopNav />
            {(isLoading||!mountRef) ? <CubeLoader uploadingMessage={uploadingMessage} /> : <div style={{
                position: 'relative',
                width: '100%',
                height: '100vh'
            }}>
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

        </>

    );
}