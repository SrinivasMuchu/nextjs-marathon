"use client";
import React, { useRef,} from "react";
import styles from '../CadUploadingHome/CadHomeDesign/CadHome.module.css'
import { IMAGEURLS,allowedFilesList } from '@/config'
import Image from "next/image";
import { toast } from "react-toastify";
import { useContext } from 'react';
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import { useRouter } from "next/navigation";

function IndustryDesignUplaodWrapper({children}) {
        const fileInputRef = useRef(null);
        const router = useRouter();
        
        const { setFile } = useContext(contextState);
        const maxFileSizeMB = 300; // Max file size in MB
       
       
       
       
    
    
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
    
           
    
            if (fileSizeMB > maxFileSizeMB) {
                toast.error(`⚠️ File size too large! Maximum allowed size is ${maxFileSizeMB}MB.`);
                return;
            }
    
    
         
            setFile(file)
            localStorage.removeItem('sample_view_cad_key')
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


        >
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
            accept={allowedFilesList.join(", ")}
            onChange={handleFileChange}
            />
            {children}
            <Image
                src={IMAGEURLS.uploadIcon}
                alt="upload"
                width={68}
                height={68}
                style={{ cursor: "pointer" }}
            />
        </div>
    )
}

export default IndustryDesignUplaodWrapper