

"use client";
import { allowedFilesList, IMAGEURLS } from "@/config";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import styles from '../CadHomeDesign/CadHome.module.css'
import { toast } from "react-toastify";
import axios from 'axios'
import { BASE_URL, BUCKET } from '@/config';
import { usePathname } from "next/navigation";
import { useContext } from 'react';
import CadUploadDropDown from './CadUploadDropDown'
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import { useParams } from 'next/navigation';

function CadFileConversionWrapper({children,convert}) {
    const fileInputRef = useRef(null);
    const [s3Url, setS3Url] = useState('');
    const [baseName, setBaseName] = useState('');
    const [folderId, setFolderId] = useState('');
    const [uploading, setUploading] = useState(false)
    // const [allowedFormats, setAllowedFormats] = useState([".step", ".stp", ".stl", ".ply", ".off", ".igs", ".iges", ".brp", ".brep"])
    const pathname = usePathname();
    const [uploadingMessage, setUploadingMessage] = useState('');
    const [disableSelect, setDisableSelect] = useState(false)
    const [fileConvert, setFileConvert] = useState('')
    const [selectedFileFormate, setSelectedFileFormate] = useState('');
    const { setFile ,allowedFormats, setAllowedFormats} = useContext(contextState);
    const maxFileSizeMB = 300; // Max file size in MB
   const [toFormate,setToFormate]=useState('')
  
    // Debugging: Log the full pathname
    useEffect(() => {
        if(!convert){
            setAllowedFormats(allowedFilesList)
            return
        } 
        console.log("Full Pathname:", pathname);
    
        const pathSegments = pathname.split('/').filter(Boolean);
        const formatsSegment = pathSegments.at(-1) ?? '';
        console.log("Raw formatsSegment:", formatsSegment);
    
        let from = "", to = "";
    
        if (formatsSegment) {
          const extracted = formatsSegment.split(/-to-|_to_|_/i);
          console.log("Extracted Parts:", extracted);
    
          if (extracted.length === 2) {
            [from, to] = extracted;
          } else if (extracted.length === 1) {
            from = extracted[0];
          }
        }
    
        // Clean up extensions
        from = from.replace(/\.\w+$/, '');
        to = to.replace(/\.\w+$/, '');
    
        const formats = from ? [`.${from}`] : [];
        const toFormats = to ? [`${to}`] : [];
        console.log("Allowed Formats:", formats);
    
        setAllowedFormats(formats);
        setToFormate(toFormats)
      }, [pathname,convert]);


    

    // useEffect(() => {
    //     if ( cadFile) {
    //         formateAcceptor(cadFile);
    //     }
    // }, [type, cadFile]);
    // const formateAcceptor = (cadFile) => {
    //     if (cadFile === 'step') {
    //         setAllowedFormats([".step", ".stp"])
    //     }
    //     if (cadFile === 'iges') {
    //         setAllowedFormats([".igs", ".iges"])
    //     }
    //     if (cadFile === 'stl') {
    //         setAllowedFormats([".stl"])
    //     }
    //     if (cadFile === 'ply') {
    //         setAllowedFormats([".ply"])
    //     }
    //     if (cadFile === 'off') {
    //         setAllowedFormats([".off"])
    //     }
    //     if (cadFile === 'brep') {
    //         setAllowedFormats([".brp", ".brep"])
    //     }
    // }


    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        validateAndProcessFile(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        validateAndProcessFile(file);
    };

    useEffect(() => {
        if (!folderId) return;
        if (uploadingMessage === 'FAILED' || uploadingMessage === 'COMPLETED' ||
            uploadingMessage === '' || uploadingMessage === 'UPLOADING') return;
        const interval = setInterval(() => {
            getStatus(folderId);
        }, 3000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [uploadingMessage, folderId]);

    const getStatus = async (folderId) => {
        try {
            const response = await axios.get(`${BASE_URL}/v1/cad/get-status`, {
                params: { 
                    id: folderId, 
                    cad_type: "CAD_CONVERTER" 
                },
                headers: {
                    "user-uuid": localStorage.getItem("uuid"), // Moved UUID to headers for security
                    
                }
            });
            
            if (response.data.meta.success) {
                if (response.data.data.status === 'COMPLETED') {

                    setUploadingMessage(response.data.data.status)
                    setBaseName(response.data.data.base_name)
                } else if (response.data.data.status !== 'COMPLETED' && response.data.data.status !== 'FAILED') {
                    setUploadingMessage(response.data.data.status)
                    console.log(response.data.data.status)
                } else if (response.data.data.status === 'FAILED') {
                    setUploading(false)
                    setUploadingMessage(response.data.data.status)
                    toast.error(response.data.data.status)

                }

            } else {
                setUploading(false)
                setUploadingMessage('FAILED')
                toast.error(response.data.meta.message)

            }


        } catch (error) {
            setUploading(false)
            setUploadingMessage('FAILED')
            console.error("Error fetching data:", error);

        }
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
        setDisableSelect(false)
        setFileConvert(file)
        // handleFileConvert(file)
        setUploading(true)



        // handleFile(file)
        // await saveFileToIndexedDB(file);


    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleFileConvert = async (file) => {
        const fileSizeMB = file.size / (1024 * 1024); // Size in MB

        try {
            setDisableSelect(false)
            setUploadingMessage('UPLOADING')
            const preSignedURL = await axios.post(
                `${BASE_URL}/v1/cad/get-next-presigned-url`,
                {
                    bucket_name: BUCKET,
                    file: file.name,
                    category: "designs_upload",
                    filesize: fileSizeMB
                },
                {
                    headers: {
                        "user-uuid": localStorage.getItem("uuid") // Moved UUID to headers for security
                    }
                }
            );
            

            if (
                preSignedURL.data.meta.code === 200 &&
                preSignedURL.data.meta.message === "SUCCESS" &&
                preSignedURL.data.data.url
            ) {
                if (preSignedURL.data.data.is_mutipart) {
                    await multiUpload(preSignedURL.data.data, file, {"user-uuid": localStorage.getItem("uuid")}, fileSizeMB);
                } else {
                    await simpleUpload(preSignedURL.data.data, file, fileSizeMB)
                    // await CadFileConversion(preSignedURL.data.data.url)
                }

            } else {
                toast.error("⚠️ Error generating signed URL.");

            }
        } catch (e) {
            console.error(e);

        }
    };

    const CadFileConversion = async (url) => {
        try {
         
            const response = await axios.post(
                `${BASE_URL}/v1/cad/file-conversion`,
                {
                    s3_link: url,
                    output_format:  selectedFileFormate,
                    s3_bucket: "design-glb"
                }, {headers: {
                    "user-uuid": localStorage.getItem("uuid"), // Moved UUID to headers for security
                    
                }}
                
            );
            
            // /design-view
            if (response.data.meta.success) {
                console.log(response.data.data)
              
                setFolderId(response.data.data)

                await getStatus(response.data.data)
            } else {
                toast.error(response.data.meta.message)

            }
            // await clearIndexedDB()
        } catch (error) {
            console.log(error)

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

            setUploadingMessage('UPLOADING')
            const file = {
                key: data.key,
                upload_id: data.upload_id,
                parts: parts,
            };

            const preSignedURL = await axios.post(
                `${BASE_URL}/v1/cad/get-next-presigned-url`,
                { bucket_name: BUCKET, file, category: "complete_mutipart",  filesize: fileSizeMB },
                {headers: {
                    "user-uuid": localStorage.getItem("uuid"), // Moved UUID to headers for security
                    
                }}
            );

            if (preSignedURL.data.meta.code === 200 && preSignedURL.data.meta.message === "SUCCESS") {
                console.log("Multipart upload completed successfully.");

                // Ensure `CadFileConversion` is called correctly
             
                setUploading(true)
                await CadFileConversion(preSignedURL.data.data.Location)
                setS3Url(preSignedURL.data.data.Location)
                return true;
            }
        } catch (error) {
            console.error("Error completing multipart upload:", error);

        }
    };

    async function simpleUpload(data, file) {
        console.log("Uploading file:", data, file);
        setUploadingMessage('UPLOADING')
        const result = await axios.put(data.url, file, {
            headers: {
                "Content-Type": file.type,
                "Content-Length": file.size,
            },
        });
        setUploading(true)
        await CadFileConversion(data.url)
        setS3Url(data.url)
      
        console.log("Upload complete:", result);
    }

  return (
    <>
    {uploading ?
        <CadUploadDropDown file={fileConvert} setDisableSelect={setDisableSelect} selectedFileFormate={selectedFileFormate} disableSelect={disableSelect}
            setSelectedFileFormate={setSelectedFileFormate} CadFileConversion={CadFileConversion} to={toFormate}
            folderId={folderId} baseName={baseName}
            uploadingMessage={uploadingMessage} setUploadingMessage={setUploadingMessage} handleFileConvert={handleFileConvert} />
        : <div
            className={styles["cad-dropzone"]}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClick}


        >
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept={ allowedFormats.join(", ")}
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
        </div>}

</>


  )
}

export default CadFileConversionWrapper