

"use client";
import { allowedFilesList, CAD_CONVERTER_EVENT, IMAGEURLS } from "@/config";
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
import CadFileNotifyPopUp from "@/Components/CommonJsx/CadFileNotifyPopUp";
import { unstable_useId } from "@mui/material";
import CadFileLimitExceedPopUp from "@/Components/CommonJsx/CadFileLimitExceedPopUp";
import CadFileNotifyInfoPopUp from "@/Components/CommonJsx/CadFileNotifyInfoPopUp";
import { convertedFiles, sendGAtagEvent } from "@/common.helper";

function CadFileConversionWrapper({ children, convert }) {
    const fileInputRef = useRef(null);
    const [s3Url, setS3Url] = useState('');
    const [baseName, setBaseName] = useState('');
    const [folderId, setFolderId] = useState('');
    const [checkLimit, setCheckLimit] = useState(false);
    const [uploading, setUploading] = useState(false)
    // const [allowedFormats, setAllowedFormats] = useState([".step", ".stp", ".stl", ".ply", ".off", ".igs", ".iges", ".brp", ".brep"])
    const pathname = usePathname();
    const [uploadingMessage, setUploadingMessage] = useState('');
    const [disableSelect, setDisableSelect] = useState(false)
    const [fileConvert, setFileConvert] = useState('');
    const [isApiSlow, setIsApiSlow] = useState(false);
    const [selectedFileFormate, setSelectedFileFormate] = useState('');
    const { setFile, allowedFormats, setAllowedFormats } = useContext(contextState);
    const maxFileSizeMB = 300; // Max file size in MB
    const [toFormate, setToFormate] = useState('');
    const [closeNotifyInfoPopUp, setCloseNotifyInfoPopUp] = useState(false);

    const [fromFormate, setFromFormate] = useState('')
    // Debugging: Log the full pathname
    useEffect(() => {
        if (!convert) {
            setAllowedFormats(allowedFilesList)
            return
        }


        const pathSegments = pathname.split('/').filter(Boolean);
        const formatsSegment = pathSegments.at(-1) ?? '';
      

        let from = "", to = "";

        if (formatsSegment) {
            const extracted = formatsSegment.split(/-to-|_to_|_/i);
           

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
      
        setFromFormate(from)
        setAllowedFormats(formats);
        setToFormate(toFormats)
    }, [pathname, convert]);




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
                    sendGAtagEvent('converter_conversion_success',CAD_CONVERTER_EVENT)
                    setUploadingMessage(response.data.data.status)
                    setBaseName(response.data.data.base_name)
                } else if (response.data.data.status !== 'COMPLETED' && response.data.data.status !== 'FAILED') {
                    setUploadingMessage(response.data.data.status)
               
                } else if (response.data.data.status === 'FAILED') {
                    sendGAtagEvent('converter_conversion_failure',CAD_CONVERTER_EVENT)
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
        if (fileSizeMB < 5) {
            sendGAtagEvent('converter_file_upload_under_5mb',CAD_CONVERTER_EVENT);
        } else if (fileSizeMB < 10) {
            sendGAtagEvent('converter_file_upload_5_10mb',CAD_CONVERTER_EVENT);
        } else if (fileSizeMB < 50) {
            sendGAtagEvent('converter_file_upload_10_50mb',CAD_CONVERTER_EVENT);
        } else if (fileSizeMB < 100) {
            sendGAtagEvent('converter_file_upload_50_100mb',CAD_CONVERTER_EVENT);
        } else if (fileSizeMB < 200) {
            sendGAtagEvent('converter_file_upload_100_200mb');
        } else if (fileSizeMB < 300) {
            sendGAtagEvent('converter_file_upload_200_300mb',CAD_CONVERTER_EVENT);
        } else {
            sendGAtagEvent('converter_file_upload_size_exceeded',CAD_CONVERTER_EVENT);
        }
        if (!allowedFormats.includes(fileExtension)) {
            toast.error("❌ Invalid file format! Please upload a supported 3D file.");
            return;
        }

        if (fileSizeMB > maxFileSizeMB) {
            toast.error(`⚠️ File size too large! Maximum allowed size is ${maxFileSizeMB}MB.`);
            return;
        }


    
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

    const checkingCadFileUploadLimitExceed = async (file, s3Url) => {
        if (s3Url) {

            await CadFileConversion(s3Url)
            return
        } else {
            try {

                const response = await axios.get(`${BASE_URL}/v1/cad/validate-operations`,
                    {
                        headers: {
                            "user-uuid": localStorage.getItem("uuid"), // Moved UUID to headers for security

                        }
                    }
                )
                if (response.data.meta.success) {
                    handleFileConvert(file)
                } else {
                    setCheckLimit(true)
                 
                }
            }
            catch (error) {
                console.error("Error checking file upload limit:", error);
            }
        }

    }
    useEffect(() => {
        if(!uploadingMessage|| uploadingMessage==='COMPLETED'|| uploadingMessage === 'UPLOADING') return;
        const slowApiTimer = setTimeout(() => {
         
            if (localStorage.getItem('user_access_key') || localStorage.getItem('user_email')) {
             
                setCloseNotifyInfoPopUp(true);
            } else {
                setIsApiSlow(true);
            }
        }, 10000);
    
        // ✅ Cleanup on unmount
        return () => clearTimeout(slowApiTimer);
    }, [uploadingMessage]);
    const handleFileConvert = async (file, s3Url) => {
        if (s3Url) {

            await CadFileConversion(s3Url)
        } else {
            const fileSizeMB = file.size / (1024 * 1024); // Size in MB
            sendGAtagEvent('converter_file_upload_start',CAD_CONVERTER_EVENT)
            try {
                setDisableSelect(false)
                setUploadingMessage('UPLOADING')
                const headers = {
                    "user-uuid": localStorage.getItem("uuid"),
                };
                // const slowApiTimer = setTimeout(() => {
                //     console.log('API is slow');
                //     if (!localStorage.getItem('user_access_key') || !localStorage.getItem('user_email')) {
                //         console.log(isApiSlow, 'isApiSlow')
                //         setIsApiSlow(true);
                //     } else {
                //         setCloseNotifyInfoPopUp(true);
                //     }
                //     console.log("API is slow, showing notification.");
                // }, 10000);

                const preSignedURL = await axios.post(
                    `${BASE_URL}/v1/cad/get-next-presigned-url`,
                    {
                        bucket_name: BUCKET,
                        file: file.name,
                        category: "designs_upload",
                        filesize: fileSizeMB
                    },
                    {
                        headers
                    }
                );

                // clearTimeout(slowApiTimer);
                if (
                    preSignedURL.data.meta.code === 200 &&
                    preSignedURL.data.meta.message === "SUCCESS" &&
                    preSignedURL.data.data.url
                ) {
                    if (preSignedURL.data.data.is_mutipart) {
                        await multiUpload(preSignedURL.data.data, file, { "user-uuid": localStorage.getItem("uuid") }, fileSizeMB);
                    } else {
                        await simpleUpload(preSignedURL.data.data, file, fileSizeMB)
                        // await CadFileConversion(preSignedURL.data.data.url)
                    }

                } else {
                    sendGAtagEvent('converter_file_upload_error',CAD_CONVERTER_EVENT)
                    toast.error("⚠️ Error generating signed URL.");

                }
            } catch (e) {
                sendGAtagEvent('converter_file_upload_error',CAD_CONVERTER_EVENT)
                console.error(e);

            }
        }

    };

    const CadFileConversion = async (url) => {
        try {
            sendGAtagEvent(`converter_file_${fileConvert.name.slice(fileConvert.name.lastIndexOf(".")).toLowerCase()}_${selectedFileFormate}`,CAD_CONVERTER_EVENT)
            const response = await axios.post(
                `${BASE_URL}/v1/cad/file-conversion`,
                {
                    s3_link: url,
                    sample_file:s3Url?true:false,
                    input_format: fileConvert.name.split('.').pop(),
                    output_format: selectedFileFormate,
                    file_name: fileConvert.name,
                    s3_bucket: "design-glb", uuid: localStorage.getItem('uuid'),
                }, {
                headers: {
                    "user-uuid": localStorage.getItem("uuid"), // Moved UUID to headers for security

                }
            }

            );

            // /design-view
            if (response.data.meta.success) {
              

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
      
        const parts = [];

        for (let i = 0; i < data.total_parts; i++) {
            const start = i * data.part_size;
            const end = Math.min(start + data.part_size, file.size);
            const part = file.slice(start, end); // FIXED: Use `slice` for binary data

           

            parts.push(uploadPart(i, part, data, file));
        }

        try {
            const uploadedParts = await Promise.all(parts);
          
            await completeMultipartUpload(data, uploadedParts, headers, fileSizeMB);
         
        } catch (error) {
            console.error('Error uploading parts:', error);
            throw error;
        }
    }

    const uploadPart = async (partNumber, part, data, file) => {
        try {
            const { url } = data.url[partNumber]; // Get correct presigned URL
          

            const result = await axios.put(url, part, {
                headers: {
                    "Content-Type": file.type,
                    "Content-Length": part.size, // Ensure Content-Length is set
                },
            });

        
            const etag = result.headers["etag"] || result.headers["ETag"]; // Fix header extraction
         
            return { ETag: etag, PartNumber: partNumber + 1 };
        } catch (error) {
            console.error(`Error uploading part ${partNumber + 1}:`, error);
            throw error;
        }
    };

    const completeMultipartUpload = async (data, parts, headers, fileSizeMB) => {
     
        try {

            setUploadingMessage('UPLOADING')
            const file = {
                key: data.key,
                upload_id: data.upload_id,
                parts: parts,
            };

            const preSignedURL = await axios.post(
                `${BASE_URL}/v1/cad/get-next-presigned-url`,
                { bucket_name: BUCKET, file, category: "complete_mutipart", filesize: fileSizeMB },
                {
                    headers: {
                        "user-uuid": localStorage.getItem("uuid"), // Moved UUID to headers for security

                    }
                }
            );

            if (preSignedURL.data.meta.code === 200 && preSignedURL.data.meta.message === "SUCCESS") {
             

                // Ensure `CadFileConversion` is called correctly

                setUploading(true)
                sendGAtagEvent('converter_file_upload_success',CAD_CONVERTER_EVENT)
                await CadFileConversion(preSignedURL.data.data.Location)

                setS3Url(preSignedURL.data.data.Location)
                return true;
            }
        } catch (error) {
            console.error("Error completing multipart upload:", error);

        }
    };

    async function simpleUpload(data, file) {
      
        setUploadingMessage('UPLOADING')
        const result = await axios.put(data.url, file, {
            headers: {
                "Content-Type": file.type,
                "Content-Length": file.size,
            },
        });
        setUploading(true)
        
            sendGAtagEvent('converter_file_upload_success',CAD_CONVERTER_EVENT)
        
        await CadFileConversion(data.url)


      
    }
    const handleSampleFileUpload = (file) => {
        sendGAtagEvent('converter_sample_file_clicked',CAD_CONVERTER_EVENT)
        setFileConvert({ name: file.name })
        setDisableSelect(false)
        setS3Url(file.url)

        setUploading(true)
    }
    return (
        <>
            {closeNotifyInfoPopUp && <CadFileNotifyInfoPopUp cad_type={'CAD_CONVERTER'}
                setClosePopUp={setCloseNotifyInfoPopUp} />}
            {checkLimit && <CadFileLimitExceedPopUp setCheckLimit={setCheckLimit} />}
            {isApiSlow && <CadFileNotifyPopUp setIsApiSlow={setIsApiSlow} cad_type={'CAD_CONVERTER'}/>}
            {(!isApiSlow || !checkLimit) && <>
                {uploading ?
                    <CadUploadDropDown file={fileConvert} setDisableSelect={setDisableSelect} selectedFileFormate={selectedFileFormate} disableSelect={disableSelect}
                        setSelectedFileFormate={setSelectedFileFormate} CadFileConversion={CadFileConversion} to={toFormate}
                        folderId={folderId} baseName={baseName} s3Url={s3Url}
                        uploadingMessage={uploadingMessage} setUploadingMessage={setUploadingMessage} handleFileConvert={checkingCadFileUploadLimitExceed} />
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
                            accept={allowedFormats.join(", ")}
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

            </>}
            {!uploading && (() => {
                const filteredFiles = convertedFiles.filter(file => {
                    if (convert && fromFormate) {
                        return file.format === fromFormate.toLowerCase();
                    }
                    return true;
                });

                // Only show if:
                // 1. We're not in convert mode (show all), OR
                // 2. We're in convert mode and have matching files
                const shouldShow = !convert || (convert && filteredFiles.length > 0);

                return shouldShow && (
                    <div className={styles["cad-dropzone-samples"]}>
                        {<span>Don’t have a file? Try one of these samples:</span>}
                        <div className={styles["cad-dropzone-sample-btns"]}>
                            {filteredFiles.map((file) => (
                                <button key={file.id} onClick={() => handleSampleFileUpload(file)}>
                                    {file.name}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })()}
        </>


    )
}

export default CadFileConversionWrapper