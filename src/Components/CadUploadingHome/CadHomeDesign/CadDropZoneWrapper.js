"use client";
import { IMAGEURLS ,allowedFilesList} from "@/config";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import styles from "./CadHome.module.css";
import { toast } from "react-toastify";

import { usePathname } from "next/navigation";
import { useContext } from 'react';
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import { useRouter } from "next/navigation";

function CadDropZoneWrapper({ children, isStyled, type }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false)
    const { allowedFormats, setAllowedFormats } = useContext(contextState);
   
    const pathname = usePathname();
    const { setFile } = useContext(contextState);
    const maxFileSizeMB = 300; // Max file size in MB
    const router = useRouter();
    const cadFile = pathname.split("/")[2];
    console.log(type)
    useEffect(() => {
        if (type && cadFile) {
            formateAcceptor(cadFile);
        }else{
            setAllowedFormats(allowedFilesList)
        }
    }, [type, cadFile]);
    const formateAcceptor = (cadFile) => {
        if (cadFile === 'step') {
            setAllowedFormats([".step", ".stp"])
        }
        if (cadFile === 'iges') {
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
        if (cadFile === 'brep') {
            setAllowedFormats([".brp", ".brep"])
        }
    }


    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        //   if (file) {
        //     const fileExtension = file.name.slice((file.name.lastIndexOf('.') + 1)).toLowerCase();

        //       gtag('event', 'file_upload', {
        //           'file_name': file.name,
        //           'file_size': file.size,
        //           'file_type': fileExtension // Use the extracted file extension
        //       });
        //     console.log('File uploaded:', file.name);
        // }
        validateAndProcessFile(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        // if (file) {
        //   const fileExtension = file.name.slice((file.name.lastIndexOf('.') + 1)).toLowerCase();

        //     gtag('event', 'file_upload', {
        //         'file_name': file.name,
        //         'file_size': file.size,
        //         'file_type': fileExtension // Use the extracted file extension
        //     });
        // }
        validateAndProcessFile(file);
    };

    const validateAndProcessFile = async (file) => {
        if (!file) return;

        const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB

        if (!allowedFormats.includes(fileExtension)) {
            toast.error("❌ Invalid file format! Please upload a supported 3D file.");
            return;
        }

        if (fileSizeMB > maxFileSizeMB) {
            toast.error(`⚠️ File size too large! Maximum allowed size is ${maxFileSizeMB}MB.`);
            return;
        }


        console.log(file)
        setFile(file)
        localStorage.removeItem('sample_view_cad_key')
        // handleFile(file)
        // await saveFileToIndexedDB(file);
        router.push("/tools/cad-renderer");

    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };





    return (
        <div
            className={styles["cad-dropzone"]}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClick}

            style={isStyled ? { flexDirection: "column-reverse" } : {}}
        ><input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept={allowedFormats.join(", ")} // Restrict input to allowed file types
                onChange={handleFileChange}
            />
            {React.Children.map(children, (child) =>
                React.isValidElement(child) ? React.cloneElement(child, { allowedFormats }) : child
            )}
            <Image src={IMAGEURLS.uploadIcon} alt="upload" width={68} height={68} style={{ cursor: "pointer" }} />
        </div>
    )
}

export default CadDropZoneWrapper