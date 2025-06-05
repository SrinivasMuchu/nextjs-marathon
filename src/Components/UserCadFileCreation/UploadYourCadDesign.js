'use client';
import React, { useRef, useState, useEffect } from 'react';
import styles from './UserCadFileUpload.module.css';
import Image from 'next/image';
import axios from 'axios';
import { BASE_URL, BUCKET } from '@/config';
import { toast } from 'react-toastify';
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import CadFileNotifyPopUp from '../CommonJsx/CadFileNotifyPopUp';
import CadFileNotifyInfoPopUp from '../CommonJsx/CadFileNotifyInfoPopUp';

function UploadYourCadDesign() {
    const fileInputRef = useRef(null);
    const uploadAbortControllerRef = useRef(null); // AbortController ref
    const [isChecked, setIsChecked] = useState(true);
    const [cadFile, setCadFile] = useState({ title: '', description: '', tags: '' });
    const [url, setUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [fileError, setFileError] = useState('');
    const [formError, setFormError] = useState('');
    const [isApiSlow, setIsApiSlow] = useState(false);
    const [info, setInfo] = useState(false);
    const [closeNotifyInfoPopUp, setCloseNotifyInfoPopUp] = useState(false);
    const [hasUserEmail, setHasUserEmail] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setHasUserEmail(!!localStorage.getItem('user_email'));
        }
    }, []);

    const router = useRouter();

    const handleChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleCancel = () => {
        if (uploadAbortControllerRef.current) {
            uploadAbortControllerRef.current.abort(); // cancel the request
            uploadAbortControllerRef.current = null;
        }
        setFileName('');
        setFileSize('');
        setUploadProgress(0);
        setUrl('');
        toast.info("Upload canceled.");
    };

    const validateForm = () => {
        if (!url) {
            setFormError("Upload your cad File.");
            return false;
        }
        if (!cadFile.title.trim()) {
            setFormError("Title is required.");
            return false;
        }
        if (!cadFile.description.trim()) {
            setFormError("Description is required.");
            return false;
        }
        
        setFormError('');
        return true;
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleFile = async (file) => {
        const fileSizeMB = file.size / (1024 * 1024);
        setFileName(file.name);
        setFileSize(fileSizeMB);
        setFileError('');

        try {
            const headers = {
                "user-uuid": localStorage.getItem("uuid"),
            };
            const { data: presignedRes } = await axios.post(
                `${BASE_URL}/v1/cad/get-next-presigned-url`,
                {
                    bucket_name: BUCKET,
                    file: file.name,
                    category: "designs_upload",
                    filesize: fileSizeMB
                },
                { headers }
            );

            if (
                presignedRes.meta.code === 200 &&
                presignedRes.meta.message === "SUCCESS" &&
                presignedRes.data.url
            ) {
                uploadAbortControllerRef.current = new AbortController();

                const uploadRes = await axios.put(
                    presignedRes.data.url,
                    file,
                    {
                        headers: { 'Content-Type': file.type },
                        signal: uploadAbortControllerRef.current.signal,
                        onUploadProgress: (progressEvent) => {
                            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(percent);
                        },
                    }
                );

                if (uploadRes.status === 200) {
                    toast.success('File successfully uploaded!');
                    setUrl(presignedRes.data.url.split('?')[0]); // Remove query params
                }
            } else {
                alert("Error generating signed URL");
            }
        } catch (error) {
            if (axios.isCancel(error) || error.name === "CanceledError") {
                console.warn("Upload canceled");
            } else {
                console.error("Upload failed", error);
                toast.error("Failed to upload file.");
            }
        }
    };

    const handleUserCadFileSubmit = async () => {
        if (!validateForm()) return;

        try {
            const response = await axios.post(
                `${BASE_URL}/v1/cad/create-user-cad-file`,
                {
                    uuid: localStorage.getItem("uuid"),
                    title: cadFile.title,
                    description: cadFile.description,
                    tags: cadFile.tags,
                    url,
                    is_downloadable: isChecked,
                },
                {
                    headers: {
                        "user-uuid": localStorage.getItem("uuid"),
                    }
                }
            );

            if (response.data.meta.success) {
                if (localStorage.getItem('user_access_key') || localStorage.getItem('user_email')) {

                    setCloseNotifyInfoPopUp(true);
                } else {
                    setIsApiSlow(true);
                }
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handlePopUp = () => {
        if (!localStorage.getItem('user_access_key') || !localStorage.getItem('user_email')) {
            setIsApiSlow(true);
        } else {
            setCloseNotifyInfoPopUp(true);
        }
    };

    useEffect(() => {
        if (info) {
            handlePopUp();
        }
    }, [info]);

    return (
        <>
            {closeNotifyInfoPopUp && <CadFileNotifyInfoPopUp setClosePopUp={setCloseNotifyInfoPopUp} cad_type={'user_cad_files'} />}
            {isApiSlow && <CadFileNotifyPopUp setIsApiSlow={setIsApiSlow} />}

            <div className={styles["cad-upload-container"]}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                    <input type="checkbox" checked={isChecked} onChange={handleChange} />
                    <span>Allow others to download this design.</span>
                </div>

                <div className={styles["cad-dropzone"]} onClick={handleClick}>
                    <input
                        type="file"
                        accept='.step,.stp'
                        ref={fileInputRef}
                        disabled={uploadProgress > 0}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                    {uploadProgress > 0 ? (
                        <div style={{ marginTop: '10px', width: '50%', textAlign: 'center' }}>
                            <div>
                                <span>{fileName} - {Math.round(fileSize)}mb</span>
                            </div>
                            <div style={{ background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${uploadProgress}%`,
                                    backgroundColor: '#610bee',
                                    height: '8px',
                                    transition: 'width 0.3s ease-in-out'
                                }}></div>
                            </div>
                            <p style={{ textAlign: 'right', fontSize: '12px' }}>{uploadProgress}%</p>
                            <div>
                                <CloseIcon onClick={handleCancel} style={{ cursor: 'pointer', color: '#610bee' }} />
                            </div>
                        </div>
                    ) : (
                        <>
                            <Image
                                src='https://marathon-web-assets.s3.ap-south-1.amazonaws.com/uploading-icon.svg'
                                alt='uploading-icon'
                                width={50}
                                height={50}
                            />
                            Drag files and folders here or{' '}
                            <span style={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                color: '#610bee'
                            }}>select files</span>
                        </>
                    )}
                </div>

                {/* {fileError && <p style={{ color: 'red' }}>{fileError}</p>} */}
                {/* {formError && <p style={{ color: 'red' }}>{formError}</p>} */}

                <div className="mt-6">
                    <input
                        placeholder="Model Name"
                        type="text"
                        className="mb-4"
                        value={cadFile.title}
                        onChange={(e) => setCadFile({ ...cadFile, title: e.target.value })}
                    />
                    {/* {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>} */}
                    <textarea
                        placeholder="Description"
                        className="mb-4"
                        value={cadFile.description}
                        onChange={(e) => setCadFile({ ...cadFile, description: e.target.value })}
                    />
                    {/* {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>} */}
                    <input
                        placeholder="Tags (separate with commas)"
                        type="text"
                        className="mb-4"
                        value={cadFile.tags}
                        onChange={(e) => setCadFile({ ...cadFile, tags: e.target.value })}
                    />
                    {formError && <p style={{ color: 'red' }}>{formError}</p>}
                    {hasUserEmail ? (
                        <button
                            className="w-full py-3 mb-4"
                            style={{ backgroundColor: '#610bee', color: '#ffffff' }}
                            onClick={handleUserCadFileSubmit}
                        >
                            Upload Your Cad Design
                        </button>
                    ) : (
                        <button
                            className="w-full py-3 mb-4"
                            style={{ backgroundColor: '#a270f2', color: '#ffffff' }}
                            title='Please update your profile to upload your design.'
                            disabled
                            // onClick={handleUserCadFileSubmit}
                        >
                            Upload Your Cad Design
                        </button>
                    )}


                    <p className="text-gray-600 text-center">
                        ⚠️ It might take up to 24 hours for your design to go live.
                        We will email you the link once it is published.
                    </p>
                </div>
            </div>
        </>
    );
}

export default UploadYourCadDesign;
