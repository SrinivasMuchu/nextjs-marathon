'use client';
import React, { useRef, useState, useEffect, useContext } from 'react';
import styles from './UserCadFileUpload.module.css';
import Image from 'next/image';
import axios from 'axios';
import { BASE_URL, BUCKET, TITLELIMIT, DESCRIPTIONLIMIT } from '@/config';
import { toast } from 'react-toastify';
import { contextState } from '../CommonJsx/ContextProvider';
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import CadFileNotifyPopUp from '../CommonJsx/CadFileNotifyPopUp';
import CadFileNotifyInfoPopUp from '../CommonJsx/CadFileNotifyInfoPopUp';
import CreatableSelect from 'react-select/creatable';
import { createDropdownCustomStyles } from '@/common.helper';

function UploadYourCadDesign() {
    const fileInputRef = useRef(null);
    const uploadAbortControllerRef = useRef(null); // AbortController ref
    const [isChecked, setIsChecked] = useState(true);
    const [cadFile, setCadFile] = useState({ title: '', description: '', tags: '' });
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
    const { hasUserEmail, setHasUserEmail,setUploadedFile,uploadedFile } = useContext(contextState);
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    
    useEffect(() => {
        console.log(uploadedFile, "uploadedFile")
        if (uploadedFile && Object.keys(uploadedFile).length > 0) {
            setFileName(uploadedFile.file_name);
            setFileFormat(uploadedFile.output_format);
            setUrl(uploadedFile.url);
            setUploadProgress(100);
        }
    }, [uploadedFile, setFileName, setFileFormat, setUrl, setUploadProgress]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('user_email')) {
                setHasUserEmail(true);
            }
        }
    }, [setHasUserEmail]);

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
                    published_cad_source_id: uploadedFile._id,
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


    const getTags = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/v1/cad/get-cad-tags`);
            if (response.data.meta.success) {

                setOptions(response.data.data.map(zone => ({
                    value: zone._id,
                    label: zone.cad_tag_label
                })));
            }
        } catch (error) {
            console.error('Error fetching tags:', error);

        }
    }

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
        setSelectedOptions(selected);
    };

    const handleRemoveCadFile = () => {
        setUploadedFile({});
        setFileName('');
        setFileSize('');
        setUploadProgress(0);
        setUrl('');
        toast.info("CAD file removed.");
    }
    return (
        <>
            {closeNotifyInfoPopUp && <CadFileNotifyInfoPopUp setClosePopUp={setCloseNotifyInfoPopUp} cad_type={'USER_CADS'} />}
            {isApiSlow && <CadFileNotifyPopUp setIsApiSlow={setIsApiSlow} />}

            <div className={styles["cad-upload-container"]}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                    <input type="checkbox" checked={isChecked} onChange={handleChange} />
                    <span>Allow others to download this design.</span>
                </div>

                {Object.keys(uploadedFile || {}).length === 0 ? <div className={styles["cad-dropzone"]} onClick={handleClick}>
                    <input
                        type="file"
                        // off
                        // working step,stp,off,stl,ply,brep,brp
                        accept=".step,.stp,.stl,.ply,.off,.igs,.iges,.brp,.brep"   
                        // accept=".off"            
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
                </div> : <div className={styles["cad-dropzone"]} onClick={handleClick}>



                    <div style={{ marginTop: '10px', width: '50%', textAlign: 'center' }}>
                        <div>
                            <span>{uploadedFile.file_name}</span>
                        </div>
                        <div style={{ background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{
                                width: `100%`,
                                backgroundColor: '#610bee',
                                height: '8px',
                                transition: 'width 0.3s ease-in-out'
                            }}></div>
                        </div>
                        <p style={{ textAlign: 'right', fontSize: '12px' }}>100%</p>
                        <div>
                            <CloseIcon onClick={handleRemoveCadFile} style={{ cursor: 'pointer', color: '#610bee' }} />
                        </div>
                    </div>

                </div>}
                {(formErrors.file && !url) && <p style={{ color: 'red' }}>{formErrors.file}</p>}


                {/* {fileError && <p style={{ color: 'red' }}>{fileError}</p>} */}
                {/* {formError && <p style={{ color: 'red' }}>{formError}</p>} */}
                <div className="bg-blue-100 text-blue-800 text-sm p-4 rounded-lg mt-4">
                    <span className="text-lg mr-2">🔍</span>
                    <strong>Help others find your design!</strong>
                    <p className="mt-1">
                        A <strong>clear title</strong> and <strong>detailed description</strong> will make your design easier to discover by others through search.
                    </p>
                </div>
                <div className="mt-6">
                    <div>
                        <input
                            placeholder="Title (minimum 40 characters)"
                            type="text"
                            className="mb-4"
                            maxLength={TITLELIMIT}
                            value={cadFile.title}
                            style={{ margin: '0px' }}
                            onChange={(e) => setCadFile({ ...cadFile, title: e.target.value })}
                        />
                        <div style={{ display: 'flex', alighnItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ color: 'red', visibility: formErrors.title ? 'visible' : 'hidden' }}>
                                {formErrors.title}
                            </span>
                            <p style={{ fontSize: '12px', color: cadFile.title.length >= 40 ? 'green' : 'gray' }}>{cadFile.title.length}/{TITLELIMIT}</p>
                        </div>
                    </div>
                    <div>
                        <textarea
                            placeholder="Description (minimum 100 characters)"
                            className="mb-4"
                            value={cadFile.description}
                            maxLength={DESCRIPTIONLIMIT}
                            style={{ margin: '0px' }}
                            onChange={(e) => setCadFile({ ...cadFile, description: e.target.value })}
                        />
                        <div style={{ display: 'flex', alighnItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ color: 'red', visibility: formErrors.description ? 'visible' : 'hidden' }}>
                                {formErrors.description}
                            </span>
                            <p style={{ fontSize: '12px', color: cadFile.description.length >= 100 ? 'green' : 'gray' }}>{cadFile.description.length}/{DESCRIPTIONLIMIT}</p>
                        </div>
                    </div>
                    {/* {formErrors.title && <p style={{ color: 'red' }}>{formErrors.title}</p>} */}

                    {/* {formErrors.description && <p style={{ color: 'red' }}>{formErrors.description}</p>} */}
                    {/* <div className='create-asset-num-div-form-label-input'>
                                <span>Select zone</span> */}
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
                    {/* </div> */}
                    {/* <input
                        placeholder="Tags (separate with commas)"
                        type="text"
                        className="mb-4"
                        value={cadFile.tags}
                        onChange={(e) => setCadFile({ ...cadFile, tags: e.target.value })}
                    /> */}

                    {hasUserEmail ? (
                        <button
                            className="w-full py-3 mb-4"
                            style={{ backgroundColor: '#610bee', color: '#ffffff' }}
                            disabled={uploading}
                            onClick={handleUserCadFileSubmit}
                        >
                            {uploading ? 'Uploading Your Cad Design' : 'Upload Your Cad Design'}
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
