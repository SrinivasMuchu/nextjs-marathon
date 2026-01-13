"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, ArrowLeft } from 'lucide-react';
import { DESIGN_GLB_PREFIX_URL } from '@/config';
import { useRouter } from 'next/navigation';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.2;

export default function DxfDwgViewer({ folderId, fileName, onBack }) {
    const [zoom, setZoom] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    const router = useRouter();

    const imageUrl = folderId ? `${DESIGN_GLB_PREFIX_URL}${folderId}/${folderId}.webp` : '';

    useEffect(() => {
        if (imageUrl) {
            setIsLoading(true);
            setImageError(false);
            
            // Preload image
            const img = new Image();
            img.onload = () => {
                setIsLoading(false);
            };
            img.onerror = () => {
                setIsLoading(false);
                setImageError(true);
            };
            img.src = imageUrl;
        }
    }, [imageUrl]);

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
    };

    const handleBackToViewer = () => {
        if (onBack) {
            onBack();
        } else {
            router.push("/tools/cad-viewer");
        }
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }} ref={containerRef}>
            {/* Back Button */}
            <button 
                onClick={handleBackToViewer} 
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
                    top: '2rem',
                    left: '3rem',
                    zIndex: 10
                }}
            >
                <ArrowLeft style={{ width: '24px', height: '24px' }} />
            </button>

            {/* Zoom Controls */}
            <div style={{
                position: 'absolute',
                right: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                zIndex: 10
            }}>
                <button
                    onClick={handleZoomIn}
                    disabled={zoom >= MAX_ZOOM}
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
                        cursor: zoom >= MAX_ZOOM ? 'not-allowed' : 'pointer',
                        opacity: zoom >= MAX_ZOOM ? 0.5 : 1
                    }}
                    onMouseOver={e => {
                        if (zoom < MAX_ZOOM) e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                >
                    <ZoomIn style={{ width: '1.5rem', height: '1.5rem' }} />
                </button>
                <button
                    onClick={handleZoomOut}
                    disabled={zoom <= MIN_ZOOM}
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
                        cursor: zoom <= MIN_ZOOM ? 'not-allowed' : 'pointer',
                        opacity: zoom <= MIN_ZOOM ? 0.5 : 1
                    }}
                    onMouseOver={e => {
                        if (zoom > MIN_ZOOM) e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                >
                    <ZoomOut style={{ width: '1.5rem', height: '1.5rem' }} />
                </button>
            </div>

            {/* Zoom Level Display */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                zIndex: 10
            }}>
                <span style={{ fontWeight: 500 }}>
                    Zoom: {zoom.toFixed(1)}x
                </span>
            </div>

            {/* Image Container */}
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'auto',
                padding: '2rem'
            }}>
                {isLoading && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                        fontSize: '1rem'
                    }}>
                        Loading image...
                    </div>
                )}
                
                {imageError && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ef4444',
                        fontSize: '1rem',
                        gap: '1rem'
                    }}>
                        <p>Failed to load image</p>
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>{imageUrl}</p>
                    </div>
                )}

                {!isLoading && !imageError && imageUrl && (
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt={fileName || 'DXF/DWG View'}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            transform: `scale(${zoom})`,
                            transition: 'transform 0.2s ease',
                            cursor: zoom > 1 ? 'move' : 'default'
                        }}
                        onError={() => {
                            setIsLoading(false);
                            setImageError(true);
                        }}
                        onLoad={() => setIsLoading(false)}
                    />
                )}
            </div>
        </div>
    );
}
