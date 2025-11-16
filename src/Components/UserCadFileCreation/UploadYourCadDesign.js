'use client';
import React, { useRef, useState, useEffect, useContext } from 'react';
import styles from './UserCadFileUpload.module.css';
import Image from 'next/image';
import axios from 'axios';
import { BASE_URL, BUCKET, TITLELIMIT, DESCRIPTIONLIMIT, CAD_PUBLISH_EVENT } from '@/config';
import { toast } from 'react-toastify';
import { contextState } from '../CommonJsx/ContextProvider';
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import CadFileNotifyPopUp from '../CommonJsx/CadFileNotifyPopUp';
import CadFileNotifyInfoPopUp from '../CommonJsx/CadFileNotifyInfoPopUp';
import CreatableSelect from 'react-select/creatable';
import { createDropdownCustomStyles, sendGAtagEvent } from '@/common.helper';
import { FaRupeeSign } from "react-icons/fa";
import Kyc from '../KYC/Kyc';


function UploadYourCadDesign({ editedDetails,onClose,type, showHeaderClose = false }) {
    console.log(editedDetails)
    const fileInputRef = useRef(null);
    const uploadAbortControllerRef = useRef(null); // AbortController ref
    const [isChecked, setIsChecked] = useState(editedDetails ? editedDetails.is_downloadable : true);
    const [cadFile, setCadFile] = useState({
        title: editedDetails ? editedDetails.page_title : '',
        description: editedDetails ? editedDetails.page_description : '', tags: ''
    });
   

    const [url, setUrl] = useState('');
    const [fileFormat, setFileFormat] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [formErrors, setFormErrors] = useState({
        file: '',
        title: '',
        description: ''
    });

    const [uploading, setUploading] = useState(false);
    const [isApiSlow, setIsApiSlow] = useState(false);
    const [info, setInfo] = useState(false);
    const [closeNotifyInfoPopUp, setCloseNotifyInfoPopUp] = useState(false);
    const { hasUserEmail, setHasUserEmail, setUploadedFile, uploadedFile,setCadDetailsUpdate } = useContext(contextState);
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [price, setPrice] = useState(editedDetails?.price || "");
    const [showKyc, setShowKyc] = useState(false);
    const [isKycVerified, setIsKycVerified] = useState(false);
    // add terms checkbox state
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {

        if (uploadedFile && Object.keys(uploadedFile).length > 0) {
            setFileName(uploadedFile.file_name);
            setFileFormat(uploadedFile.output_format);
            setUrl(uploadedFile.url);
            setUploadProgress(100);
        }
    }, [uploadedFile, setFileName, setFileFormat, setUrl, setUploadProgress]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('is_verified')) {
                setHasUserEmail(true);
            }
        }
    }, [setHasUserEmail]);
    useEffect(() => {
        if (editedDetails?.cad_tags?.length) {
            getTags();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editedDetails]);

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
        const errors = {
            file: '',
            title: '',
            description: ''
        };

        let isValid = true;

        if (!url) {
            errors.file = 'Upload your CAD file.';
            isValid = false;
        }
        if (!cadFile.title.trim()) {
            errors.title = 'Title is required.';
            isValid = false;
        } else if (cadFile.title.trim().length < 40) {
            errors.title = 'Title must be at least 40 characters long.';
            isValid = false;
        }
        if (!cadFile.description.trim()) {
            errors.description = 'Description is required.';
            isValid = false;
        } else if (cadFile.description.trim().length < 100) {
            errors.description = 'Description must be at least 100 characters long.';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
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
        setFileFormat(file.name.split('.').pop());

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
        setUploading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/v1/cad/create-user-cad-file`,
                {
                    uuid: localStorage.getItem("uuid"),
                    title: cadFile.title,
                    file_type: fileFormat,
                    description: cadFile.description,
                    tags: selectedOptions.map(option => option.value),
                    url,
                    is_downloadable: isChecked,
                    converted_cad_source: uploadedFile,
                    price: Number(price) || 0, // Send price as number
                },
                {
                    headers: {
                        "user-uuid": localStorage.getItem("uuid"),
                    }
                }
            );

            if (response.data.meta.success) {
                if (localStorage.getItem('is_verified')) {
                    if(type){
                        router.push(`/library/${response.data.data.route}`)
                        router.refresh();
                    }else{
                        router.push("/dashboard")
                    }
                    
                      setCadDetailsUpdate(response)
                    onClose()
                } else {
                    setIsApiSlow(true);
                }
                sendGAtagEvent({ event_name: 'publish_cad_complete', event_category: CAD_PUBLISH_EVENT })
            } else {
                let newFormErrors = { ...formErrors };
                const validationErrors = response.data?.meta?.validationErrors;

                if (validationErrors) {
                    newFormErrors.title = validationErrors.title || "";
                    newFormErrors.description = validationErrors.description || "";
                } else if (response?.data?.meta?.message?.includes('franc')) {
                    newFormErrors.title = "Please ensure the title and description are in English.";
                    newFormErrors.description = "Please ensure the title and description are in English.";
                } else if (response?.data?.meta?.message) {
                    // Show backend error message if available
                    // Try to assign to the most relevant field
                    if (response.data.meta.message.toLowerCase().includes('title')) {
                        newFormErrors.title = response.data.meta.message;
                    } else if (response.data.meta.message.toLowerCase().includes('description')) {
                        newFormErrors.description = response.data.meta.message;
                    } else {
                        // If not specific, show under title
                        newFormErrors.title = response.data.meta.message;
                    }
                    sendGAtagEvent({ event_name: 'publish_cad_text_errors', event_category: CAD_PUBLISH_EVENT })
                } else {
                    // Generic error message as fallback
                    newFormErrors.title = "Failed to upload file. Please try again later.";
                }
                setFormErrors(newFormErrors);

            }
            setUploading(false);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploading(false);

        }
    };
    const handleUpdateUserCadFileSubmit = async () => {

        setUploading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/v1/cad/create-user-cad-file`,
                {
                    file_id: editedDetails._id,
                    title: cadFile.title,

                    description: cadFile.description,
                    tags: selectedOptions.map(option => option.value),
                    price: Number(price) || 0, // Send price as number
                    is_downloadable: isChecked,

                },
                {
                    headers: {
                        "user-uuid": localStorage.getItem("uuid"),
                    }
                }
            );

            if (response.data.meta.success) {
                if (localStorage.getItem('is_verified')) {

                      if(type){
                        router.push(`/library/${response.data.data.route}`)
                        
                        router.refresh();
                    }else{
                        router.push("/dashboard")
                    }
                    setCadDetailsUpdate(response)
                    onClose()
                } else {
                    setIsApiSlow(true);
                }
                sendGAtagEvent({ event_name: 'publish_cad_complete', event_category: CAD_PUBLISH_EVENT })
            } else {
                let newFormErrors = { ...formErrors };
                const validationErrors = response.data?.meta?.validationErrors;

                if (validationErrors) {
                    newFormErrors.title = validationErrors.title || "";
                    newFormErrors.description = validationErrors.description || "";
                } else if (response?.data?.meta?.message?.includes('franc')) {
                    newFormErrors.title = "Please ensure the title and description are in English.";
                    newFormErrors.description = "Please ensure the title and description are in English.";
                } else if (response?.data?.meta?.message) {
                    // Show backend error message if available
                    // Try to assign to the most relevant field
                    if (response.data.meta.message.toLowerCase().includes('title')) {
                        newFormErrors.title = response.data.meta.message;
                    } else if (response.data.meta.message.toLowerCase().includes('description')) {
                        newFormErrors.description = response.data.meta.message;
                    } else {
                        // If not specific, show under title
                        newFormErrors.title = response.data.meta.message;
                    }
                    sendGAtagEvent({ event_name: 'publish_cad_text_errors', event_category: CAD_PUBLISH_EVENT })
                } else {
                    // Generic error message as fallback
                    newFormErrors.title = "Failed to upload file. Please try again later.";
                }
                setFormErrors(newFormErrors);

            }
            setUploading(false);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploading(false);

        }
    };

    const handlePopUp = () => {
        if (!localStorage.getItem('is_verified')) {
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




    // Fetch all available tags
    const getTags = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/v1/cad/get-cad-tags`);
            if (response.data.meta.success) {
                const fetchedOptions = response.data.data.map(zone => ({
                    value: zone._id,
                    label: zone.cad_tag_label
                }));

                setOptions(fetchedOptions);

                // ✅ Only set selectedOptions if they haven't been set yet
                if (editedDetails?.cad_tags?.length && selectedOptions.length === 0) {
                    const mappedSelections = editedDetails.cad_tags
                        .map(id => fetchedOptions.find(opt => opt.label === id))
                        .filter(Boolean);

                    setSelectedOptions(mappedSelections);
                }
            }
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };


    const handleAddZones = async (inputValue) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/v1/cad/create-cad-tags`,
                { cad_tag_label: inputValue },
            );
            const newTags = {
                value: response.data.data.tag_id,
                label: inputValue,
            };


            setOptions(prevOptions => [...prevOptions, newTags]);
            setSelectedOptions(prevSelected => (prevSelected ? [...prevSelected, newTags] : [newTags]));
        } catch (error) {
            console.error("An error occurred during the request:", error);
        }
    };

    const handleZoneSelection = (selected) => {
        setSelectedOptions(selected || []);
    };



    const handleRemoveCadFile = () => {
        setUploadedFile({});
        setFileName('');
        setFileSize('');
        setUploadProgress(0);
        setUrl('');
        toast.info("CAD file removed.");
    }

    // KYC handlers
    const handleVerifyBankDetails = () => setShowKyc(true);
    const handleKycClose = () => {
        setShowKyc(false);
        // TODO: replace with real verification check
        setIsKycVerified(true);
    };

    return (
        <>
            {/* Render KYC modal when requested */}
            {showKyc && <Kyc onClose={handleKycClose} />}
            {closeNotifyInfoPopUp && <CadFileNotifyInfoPopUp setClosePopUp={setCloseNotifyInfoPopUp} cad_type={'USER_CADS'} />}
            {isApiSlow && <CadFileNotifyPopUp setIsApiSlow={setIsApiSlow} />}

            <div className={styles["cad-upload-container"]}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Upload CAD file</h2>
                    {/* Hide our internal close to avoid double X in the modal header */}
                    {showHeaderClose && onClose && (
                        <button onClick={onClose} style={{ background: 'transparent', border: 0, cursor: 'pointer' }}>
                            <CloseIcon />
                        </button>
                    )}
                </div>

                {/* FULL-WIDTH Dropzone (top center) */}
                {!editedDetails && (
                    <div style={{ marginBottom: 16 }}>
                        <div className={styles["cad-dropzone"]} onClick={handleClick}>
                            <input
                                type="file"
                                accept=".step,.stp,.stl,.ply,.off,.igs,.iges,.brp,.brep,.obj,.glb"
                                ref={fileInputRef}
                                disabled={uploadProgress > 0}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            {uploadProgress > 0 ? (
                                <div style={{ marginTop: 10, width: '50%', textAlign: 'center', marginInline: 'auto' }}>
                                    <div><span>{fileName} - {Math.round(fileSize)}mb</span></div>
                                    <div style={{ background: '#e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
                                        <div style={{ width: `${uploadProgress}%`, backgroundColor: '#610bee', height: 8, transition: 'width 0.3s ease-in-out' }} />
                                    </div>
                                    <p style={{ textAlign: 'right', fontSize: 12 }}>{uploadProgress}%</p>
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
                                    <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#610bee' }}>select files</span>
                                </>
                            )}
                        </div>
                        {(formErrors.file && !url) && <p style={{ color: 'red', marginTop: 8 }}>{formErrors.file}</p>}
                    </div>
                )}

                {/* Checkbox under dropzone (like figma) */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 10 }}>
                    <input type="checkbox" checked={isChecked} onChange={handleChange} />
                    <span>Allow others to download this design.</span>
                </div>

                {/* Two-column layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    {/* LEFT: File details (with tags) */}
                    <div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>File details</h3>

                        {/* Title */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, color: '#444', marginBottom: 6 }}>Model title</label>
                            <input
                                placeholder="0.5M Spur Gear | High-Quality CAD Model"
                                type="text"
                                maxLength={TITLELIMIT}
                                value={cadFile.title}
                                style={{ margin: 0, width: '100%' }}
                                onChange={(e) => setCadFile({ ...cadFile, title: e.target.value })}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ color: 'red', visibility: formErrors.title ? 'visible' : 'hidden' }}>{formErrors.title}</span>
                                <p style={{ fontSize: 12, color: cadFile.title.length >= 40 ? 'green' : 'gray' }}>{cadFile.title.length}/{TITLELIMIT}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, color: '#444', marginBottom: 6 }}>Description</label>
                            <textarea
                                placeholder="Designed for engineers and designers, 0.5M Spur Gear helps visualize, prototype, and integrate into mechanical systems."
                                value={cadFile.description}
                                maxLength={DESCRIPTIONLIMIT}
                                style={{ margin: 0, width: '100%' }}
                                onChange={(e) => setCadFile({ ...cadFile, description: e.target.value })}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ color: 'red', visibility: formErrors.description ? 'visible' : 'hidden' }}>{formErrors.description}</span>
                                <p style={{ fontSize: 12, color: cadFile.description.length >= 100 ? 'green' : 'gray' }}>{cadFile.description.length}/{DESCRIPTIONLIMIT}</p>
                            </div>
                        </div>

                        {/* Tags moved to LEFT to match figma */}
                        <div>
                            <label style={{ display: 'block', fontSize: 13, color: '#444', marginBottom: 6 }}>Select or create tags</label>
                            <CreatableSelect
                                isMulti
                                styles={createDropdownCustomStyles}
                                options={options}
                                value={selectedOptions}
                                onFocus={getTags}
                                onChange={handleZoneSelection}
                                onCreateOption={handleAddZones}
                                placeholder="Select or create Tags"
                            />
                        </div>
                    </div>

                    {/* RIGHT: Pricing details */}
                    <div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>Pricing details</h3>

                        {/* KYC box */}
                        <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                            <p style={{ margin: 0, color: '#666' }}>
                                To sell and set price for your CAD file, please verify your bank details.
                            </p>
                            <button
                                type="button"
                                onClick={handleVerifyBankDetails}
                                style={{
                                    marginTop: 12,
                                    background: '#fff',
                                    border: '2px solid #610bee',
                                    color: '#610bee',
                                    padding: '10px 16px',
                                    borderRadius: 6,
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Verify bank details
                            </button>
                        </div>

                        {/* Price with rupee icon on the right */}
                        <div style={{ position: 'relative', marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, color: '#444', marginBottom: 6 }}>Price</label>
                            <input
                                type="number"
                                min={0}
                                placeholder="Enter price"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                disabled={!isKycVerified}
                                style={{
                                    width: '100%',
                                    padding: '10px 34px 10px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: 6,
                                    background: isKycVerified ? '#fff' : '#f5f5f5',
                                }}
                            />
                            <span style={{ position: 'absolute', right: 10, top: '58%', transform: 'translateY(-50%)', color: '#6b7280' }}>
                                <FaRupeeSign />
                            </span>
                            <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>You can upload for $0 and others can download for Free.</p>
                        </div>

                        {/* Upload button */}
                        {hasUserEmail ? (
                            <button
                                style={{ 
                                    width: '100%', 
                                    padding: '12px', 
                                    backgroundColor: '#610bee', 
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: 6,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    marginTop: 4
                                }}
                                disabled={uploading}
                                onClick={editedDetails ? handleUpdateUserCadFileSubmit : handleUserCadFileSubmit}
                            >
                                {uploading ? `${editedDetails ? 'Updating' : 'Uploading'} Design...` : 'Upload Design'}
                            </button>
                        ) : (
                            <button
                                style={{ 
                                    width: '100%', 
                                    padding: '12px', 
                                    backgroundColor: '#a270f2', 
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: 6,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    cursor: 'not-allowed',
                                    marginTop: 4
                                }}
                                title='Please verify your email to upload your design.'
                                disabled
                            >
                                Upload Design
                            </button>
                        )}

                        {/* Terms & conditions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                            <input type="checkbox" checked={termsAccepted} onChange={(e)=>setTermsAccepted(e.target.checked)} />
                            <span style={{ fontSize: 13, color: '#444' }}>
                                Agree to <a href="#" style={{ color: '#610bee' }}>terms & conditions</a> of Marathon.
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom note */}
                <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, marginTop: 16 }}>
                    <p className="text-gray-600" style={{ margin: 0 }}>
                        ⚠️ It might take up to 24 hours for your design to go live. We will email you the link once it is published.
                    </p>
                </div>
            </div>
        </>
    );
}

export default UploadYourCadDesign;
