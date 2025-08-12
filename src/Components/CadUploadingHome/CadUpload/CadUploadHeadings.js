"use client"
import React,{useState,useEffect} from 'react'
import cadStyles from '../CadHomeDesign/CadHome.module.css'
import { usePathname } from "next/navigation";

function CadUploadHeadings(type) {
    const [allowedFormats, setAllowedFormats] = useState([".step", ".stp", ".stl", ".ply", ".off", ".igs", ".iges", ".brp", ".brep",".obj"])
     const pathname = usePathname();
    const cadFile = pathname.split("/")[2];

    useEffect(() => {
        if (cadFile) {
            formateAcceptor(cadFile);
        }
    }, [ cadFile]);
    const formateAcceptor = (cadFile) => {
        if (cadFile === 'step'||cadFile === 'stp') {
            setAllowedFormats([".step", ".stp"])
        }
        if (cadFile === 'iges'||cadFile === 'igs') {
            setAllowedFormats([".igs", ".iges"])
        }
        if (cadFile === 'stl') {
            setAllowedFormats([".stl"])
        }
        if (cadFile === 'ply') {
            setAllowedFormats([".ply"])
        }
        if (cadFile === 'off') {
            setAllowedFormats([".off"])
        }
        if (cadFile === 'brep'||cadFile === 'brp') {
            setAllowedFormats([".brp", ".brep"])
        }
        if (cadFile === 'obj') {
            setAllowedFormats([".obj"])
        }
    }

    return (
        <div className={cadStyles['cad-landing-left-content']}>
            <h1 className={cadStyles['cad-landing-heading']}>{cadFile.toUpperCase()
} File Viewer – Instantly Open & Explore {cadFile.toUpperCase()
} Files</h1>
            <p className={cadStyles['cad-landing-description']}>Effortlessly view and inspect {cadFile.toUpperCase()
} ({allowedFormats.join(", ")}) files online. Marathon OS CAD Viewer delivers fast, secure, and high-performance rendering with no downloads needed.
            </p>
        </div>
    )
}

export default CadUploadHeadings