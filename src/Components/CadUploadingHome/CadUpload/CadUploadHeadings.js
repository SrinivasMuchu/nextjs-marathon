"use client"
import React,{useState,useEffect} from 'react'
import cadStyles from '../CadHomeDesign/CadHome.module.css'
import { usePathname } from "next/navigation";

function parseFormatFromPath(segment) {
  if (!segment || typeof segment !== 'string') return '';
  const match = segment.match(/^(.+)-file-viewer$/);
  return match ? match[1].toLowerCase() : segment.toLowerCase();
}

function CadUploadHeadings() {
    const [allowedFormats, setAllowedFormats] = useState([".step", ".stp", ".stl", ".ply", ".off", ".igs", ".iges", ".brp", ".brep",".obj"])
    const pathname = usePathname();
    const segment = pathname.split("/")[2] || '';
    const cadFile = parseFormatFromPath(segment);

    useEffect(() => {
        if (cadFile) {
            formateAcceptor(cadFile);
        }
    }, [cadFile]);
    const formateAcceptor = (format) => {
        if (format === 'step' || format === 'stp') {
            setAllowedFormats([".step", ".stp"])
        }
        if (format === 'iges' || format === 'igs') {
            setAllowedFormats([".igs", ".iges"])
        }
        if (format === 'stl') {
            setAllowedFormats([".stl"])
        }
        if (format === 'ply') {
            setAllowedFormats([".ply"])
        }
        if (format === 'off') {
            setAllowedFormats([".off"])
        }
        if (format === 'brep' || format === 'brp') {
            setAllowedFormats([".brp", ".brep"])
        }
        if (format === 'obj') {
            setAllowedFormats([".obj"])
        }
        // if (cadFile === 'glb') {
        //     setAllowedFormats([".glb"])
        // }
    }

    const formatLabel = cadFile ? cadFile.toUpperCase() : 'CAD';
    return (
        <div className={cadStyles['cad-landing-left-content']}>
            <h1 className={cadStyles['cad-landing-heading']}>{formatLabel} File Viewer – Instantly Open & Explore {formatLabel} Files</h1>
            <p className={cadStyles['cad-landing-description']}>Effortlessly view and inspect {formatLabel} ({allowedFormats.join(", ")}) files online. Marathon OS CAD Viewer delivers fast, secure, and high-performance rendering with no downloads needed.</p>
        </div>
    )
}

export default CadUploadHeadings