
'use client';
import React, { useRef, useState, useEffect, useContext } from 'react';
import styles from './UserCadFileUpload.module.css';
import Image from 'next/image';
import axios from 'axios';
import { BASE_URL, BUCKET, TITLELIMIT, DESCRIPTIONLIMIT, CAD_PUBLISH_EVENT, allowedFilesList } from '@/config';
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
import Link from 'next/link';


function UploadCadfileDummy({ editedDetails,onClose,type, showHeaderClose = false, rejected}) {
    console.log(editedDetails)
    const fileInputRef = useRef(null);
    // const folderInputRef = useRef(null); // Commented out - folder selection disabled
    const multipleFilesInputRef = useRef(null);
    const uploadAbortControllerRef = useRef(null); // AbortController ref
    const multipleUploadAbortControllersRef = useRef({}); // AbortControllers for multiple files
    // const [isFolderMode, setIsFolderMode] = useState(false); // Commented out - folder selection disabled
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
    const [supportedFiles, setSupportedFiles] = useState([]); // Array of file objects: {fileName, type, size, url}
    const SUPPORTING_FILES_MAX_SIZE = 1024 * 1024 * 1024; // 1GB in bytes
    const [supportingFilesTotalSize, setSupportingFilesTotalSize] = useState(0);
    const [uploadMode, setUploadMode] = useState('single'); // 'single' or 'multiple'
    const [isUploadingMultiple, setIsUploadingMultiple] = useState(false);
    const [multipleUploadProgress, setMultipleUploadProgress] = useState({}); // Track progress for each file
    const [formErrors, setFormErrors] = useState({
        file: '',
        title: '',
        description: '',
        terms: '',
        price: ''
    });

    const [uploading, setUploading] = useState(false);
    const [isApiSlow, setIsApiSlow] = useState(false);
    const [info, setInfo] = useState(false);
    const [closeNotifyInfoPopUp, setCloseNotifyInfoPopUp] = useState(false);
    const { hasUserEmail, setHasUserEmail, setUploadedFile, uploadedFile,setCadDetailsUpdate,user,setUser } = useContext(contextState);
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [price, setPrice] = useState(editedDetails?.price || "");
    const [showKyc, setShowKyc] = useState(false);
    const [isKycVerified, setIsKycVerified] = useState(false);
    // add terms checkbox state - default to true
    const [termsAccepted, setTermsAccepted] = useState(true);
    // Step management - start at step 1 for new uploads, step 2 for editing
    const [currentStep, setCurrentStep] = useState(editedDetails ? 2 : 1);

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

    const handleMultipleFilesClick = () => {
        // Folder mode disabled - only multiple files selection
        multipleFilesInputRef.current?.click();
        // if (isFolderMode) {
        //     folderInputRef.current?.click();
        // } else {
        //     multipleFilesInputRef.current?.click();
        // }
    };

    const handleCancel = () => {
        // Cancel single file upload
        if (uploadAbortControllerRef.current) {
            uploadAbortControllerRef.current.abort();
            uploadAbortControllerRef.current = null;
        }
        
        // Cancel all multiple file uploads
        Object.values(multipleUploadAbortControllersRef.current).forEach(controller => {
            controller.abort();
        });
        multipleUploadAbortControllersRef.current = {};
        
        setFileName('');
        setFileSize('');
        setUploadProgress(0);
        setUrl('');
        setSupportedFiles([]);
        setMultipleUploadProgress({});
        setIsUploadingMultiple(false);
        toast.info("Upload canceled.");
    };

    const validateForm = () => {
        const errors = {
            file: '',
            title: '',
            description: '',
            terms: '',
            price: ''
        };

        let isValid = true;

        // Only require file upload for new uploads, not for editing
        if (!editedDetails && !url && supportedFiles.length === 0) {
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
        if (!termsAccepted) {
            errors.terms = 'You must agree to the terms and conditions.';
            isValid = false;
        }
        if (price && Number(price) > 500) {
            errors.price = 'Price cannot be greater than $500.';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };


    // Validate file type
    const isValidFileType = (file) => {
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        return allowedFilesList.includes(fileExtension);
    };

    // Get file extension for error messages
    const getFileExtension = (file) => {
        return file.name.split('.').pop().toLowerCase() || 'unknown';
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type before processing
            if (!isValidFileType(file)) {
                toast.error(`File type .${getFileExtension(file)} is not supported. Supported formats: ${allowedFilesList.join(', ')}`);
                e.target.value = ''; // Reset input
                return;
            }
            setUploadMode('single');
            handleFile(file);
        }
    };

    // Handle multiple files selection (non-folder)
    // Supporting files can be any file type
    const handleMultipleFilesChange = async (e) => {
        const allFiles = Array.from(e.target.files);
        if (allFiles.length === 0) return;
        // Calculate current total size
        let currentTotal = supportedFiles.reduce((acc, file) => acc + file.size, 0);
        let newFilesTotal = allFiles.reduce((acc, file) => acc + file.size, 0);
        if (currentTotal + newFilesTotal > SUPPORTING_FILES_MAX_SIZE) {
            toast.error('Total supporting files size cannot exceed 1GB.');
            e.target.value = '';
            return;
        }
        setUploadMode('multiple');
        await handleMultipleFiles(allFiles);
        e.target.value = '';
    };

    // Handle folder selection
    // Supporting files can be any file type
    // COMMENTED OUT - Folder selection disabled
    // const handleFolderChange = async (e) => {
    //     const allFiles = Array.from(e.target.files);
    //     
    //     if (allFiles.length === 0) return;
    //     
    //     // Accept all files for supporting files (no validation needed)
    //     setUploadMode('multiple');
    //     await handleMultipleFiles(allFiles);
    //     
    //     // Reset input
    //     e.target.value = '';
    // };

    // Recursively process folder entries (handles nested folders)
    // Supporting files can be any file type
    // COMMENTED OUT - Folder selection disabled
    // const processDirectoryEntry = async (entry, path = '') => {
    //     const files = [];
    //     
    //     if (entry.isFile) {
    //         return new Promise((resolve) => {
    //             entry.file((file) => {
    //                 // Accept all file types for supporting files
    //                 files.push({
    //                     file,
    //                     path: path ? `${path}/${file.name}` : file.name
    //                 });
    //                 resolve(files);
    //             });
    //         });
    //     } else if (entry.isDirectory) {
    //         const reader = entry.createReader();
    //         const entries = await new Promise((resolve) => {
    //             reader.readEntries((entries) => {
    //                 resolve(entries);
    //             });
    //         });
    //         
    //         const newPath = path ? `${path}/${entry.name}` : entry.name;
    //         for (const entryItem of entries) {
    //             const subFiles = await processDirectoryEntry(entryItem, newPath);
    //             files.push(...subFiles);
    //         }
    //     }
    //     
    //     return files;
    // };

    // Handle drag and drop for single file
    const handleSingleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length === 1) {
            const file = files[0];
            if (isValidFileType(file)) {
                setUploadMode('single');
                handleFile(file);
            } else {
                toast.error(`File type .${getFileExtension(file)} is not supported. Supported formats: ${allowedFilesList.join(', ')}`);
            }
        } else if (files.length > 1) {
            toast.info('Multiple files detected. Please use the multiple files upload area below.');
        }
    };

    // Handle drag and drop for multiple files
    // Supporting files can be any file type
    // Folder drag and drop disabled
    const handleMultipleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            let currentTotal = supportedFiles.reduce((acc, file) => acc + file.size, 0);
            let newFilesTotal = files.reduce((acc, file) => acc + file.size, 0);
            if (currentTotal + newFilesTotal > SUPPORTING_FILES_MAX_SIZE) {
                toast.error('Total supporting files size cannot exceed 1GB.');
                return;
            }
            setUploadMode('multiple');
            await handleMultipleFiles(files);
        } else {
            toast.error('No files found.');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // Upload a single file with progress tracking
    // Note: This function is used for supporting files, so no file type validation needed
    const uploadSingleFile = async (file, updateProgress) => {
        const fileSizeMB = file.size / (1024 * 1024);
        const abortController = new AbortController();
        multipleUploadAbortControllersRef.current[file.name] = abortController;
        
        try {
            const headers = {
                "user-uuid": localStorage.getItem("uuid"),
            };
            
            // Initialize progress
            updateProgress(file.name, { loaded: 0, total: file.size, percent: 0 });
            
            // Get presigned URL
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
                // Upload file
                await axios.put(
                    presignedRes.data.url,
                    file,
                    {
                        headers: { 'Content-Type': file.type },
                        signal: abortController.signal,
                        onUploadProgress: (progressEvent) => {
                            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            updateProgress(file.name, {
                                loaded: progressEvent.loaded,
                                total: progressEvent.total,
                                percent
                            });
                        },
                    }
                );

                const fileUrl = presignedRes.data.url.split('?')[0];
                return {
                    fileName: file.name,
                    type: file.name.split('.').pop(),
                    size: file.size,
                    url: fileUrl
                };
            }
            return null;
        } catch (error) {
            if (axios.isCancel(error) || error.name === "CanceledError") {
                throw new Error('CANCELED');
            }
            throw error;
        } finally {
            delete multipleUploadAbortControllersRef.current[file.name];
        }
    };

    // Process multiple files with concurrency control
    // Supporting files can be any file type
    const handleMultipleFiles = async (files) => {
        if (!files || files.length === 0) {
            toast.error('No files to upload.');
            return;
        }
        // Check again in case files are added programmatically
        let currentTotal = supportedFiles.reduce((acc, file) => acc + file.size, 0);
        let newFilesTotal = files.reduce((acc, file) => acc + file.size, 0);
        if (currentTotal + newFilesTotal > SUPPORTING_FILES_MAX_SIZE) {
            toast.error('Total supporting files size cannot exceed 1GB.');
            return;
        }
        setIsUploadingMultiple(true);
        setMultipleUploadProgress({});
        const initialProgress = {};
        files.forEach(file => {
            initialProgress[file.name] = { loaded: 0, total: file.size, percent: 0 };
        });
        setMultipleUploadProgress(initialProgress);
        const updateProgress = (fileName, progress) => {
            setMultipleUploadProgress(prev => ({
                ...prev,
                [fileName]: progress
            }));
        };
        const CONCURRENCY_LIMIT = 5;
        const uploadedFiles = [...supportedFiles];
        const failedFiles = [];
        try {
            for (let i = 0; i < files.length; i += CONCURRENCY_LIMIT) {
                const batch = files.slice(i, i + CONCURRENCY_LIMIT);
                const batchPromises = batch.map(async (file) => {
                    try {
                        const result = await uploadSingleFile(file, updateProgress);
                        if (result) {
                            return { success: true, file: result };
                        }
                        return { success: false, fileName: file.name };
                    } catch (error) {
                        if (error.message === 'CANCELED') {
                            return { success: false, fileName: file.name, canceled: true };
                        }
                        console.error(`Error uploading ${file.name}:`, error);
                        return { success: false, fileName: file.name, error: error.message };
                    }
                });
                const batchResults = await Promise.allSettled(batchPromises);
                batchResults.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        const { success, file, fileName, canceled } = result.value;
                        if (success && file) {
                            uploadedFiles.push(file);
                        } else if (!canceled) {
                            failedFiles.push(fileName || batch[index].name);
                        }
                    } else {
                        failedFiles.push(batch[index].name);
                    }
                });
            }
            setSupportedFiles(uploadedFiles);
            setSupportingFilesTotalSize(uploadedFiles.reduce((acc, file) => acc + file.size, 0));
            setIsUploadingMultiple(false);
            if (uploadedFiles.length > supportedFiles.length) {
                toast.success(`${uploadedFiles.length - supportedFiles.length} file(s) successfully uploaded!`);
            }
            if (failedFiles.length > 0) {
                toast.error(`${failedFiles.length} file(s) failed to upload.`);
            }
        } catch (error) {
            console.error('Error processing multiple files:', error);
            setIsUploadingMultiple(false);
            toast.error('Error processing files. Please try again.');
        }
    };

    const handleFile = async (file) => {
        // Validate file type before upload
        if (!isValidFileType(file)) {
            toast.error(`File type .${getFileExtension(file)} is not supported. Supported formats: ${allowedFilesList.join(', ')}`);
            return;
        }
        
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
            const requestData = {
                uuid: localStorage.getItem("uuid"),
                title: cadFile.title,
                price: price ? price : 0,
                file_type: fileFormat,
                description: cadFile.description,
                tags: selectedOptions.map(option => option.value),
                is_downloadable: isChecked,
                converted_cad_source: uploadedFile,
            };

            // Add single file URL for backward compatibility
            if (url) {
                requestData.url = url;
            }

            // Add supported files array if multiple files were uploaded
            if (supportedFiles.length > 0) {
                requestData.supporting_files = supportedFiles;
            }

            const response = await axios.post(
                `${BASE_URL}/v1/cad/create-user-cad-file`,
                requestData,
                {
                    headers: {
                        "user-uuid": localStorage.getItem("uuid"),
                    }
                }
            );

            if (response.data.meta.success) {
                if (localStorage.getItem('is_verified')) {
                    
                        router.push("/dashboard")
                        router.refresh();
                    
                    
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
        console.log('Starting update submit...');
        console.log('editedDetails:', editedDetails);
        console.log('cadFile:', cadFile);
        console.log('selectedOptions:', selectedOptions);
        console.log('price:', price);
        console.log('isChecked:', isChecked);
        console.log('termsAccepted:', termsAccepted);
        
        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }
        
        console.log('Form validation passed, making API call...');
        setUploading(true);
        try {
            const requestData = {
                file_id: editedDetails._id,
                title: cadFile.title,
                description: cadFile.description,
                tags: selectedOptions.map(option => option.value),
                price: Number(price) || 0, // Send price as number
                is_downloadable: isChecked,
            };
            
            console.log('Request data:', requestData);
            
            const response = await axios.post(
                `${BASE_URL}/v1/cad/create-user-cad-file`,
                requestData,
                {
                    headers: {
                        "user-uuid": localStorage.getItem("uuid"),
                    }
                }
            );

            console.log('API Response:', response.data);

            if (response.data.meta.success) {
                if (localStorage.getItem('is_verified')) {

                     
                        router.push("/dashboard")
                    
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
                        .map(id => fetchedOptions.find(opt => rejected ? opt.value === id : opt.label === id))
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
        setSupportedFiles([]);
        setMultipleUploadProgress({});
        setIsUploadingMultiple(false);
        toast.info("CAD file removed.");
    }

    // KYC handlers
    const handleVerifyBankDetails = () => setShowKyc(true);
    const handleKycClose = () => {
        setShowKyc(!showKyc);
        // TODO: replace with real verification check
        setIsKycVerified(true);
    };

    // Remove individual supporting file (must be outside JSX)
    const handleRemoveSupportingFile = (idx) => {
        setSupportedFiles(prev => {
            const updated = prev.filter((_, i) => i !== idx);
            // update total size after state update
            setTimeout(() => {
                setSupportingFilesTotalSize(updated.reduce((acc, file) => acc + file.size, 0));
            }, 0);
            return updated;
        });
    };

    // Validate step 1 (file upload)
    const validateStep1 = () => {
        if (editedDetails) return true; // Skip validation for editing mode
        if (!url && supportedFiles.length === 0) {
            setFormErrors(prev => ({ ...prev, file: 'Upload your CAD file.' }));
            return false;
        }
        setFormErrors(prev => ({ ...prev, file: '' }));
        return true;
    };

    // Handle next step
    const handleNextStep = () => {
        if (validateStep1()) {
            setCurrentStep(2);
        }
    };

    // Handle previous step
    const handlePreviousStep = () => {
        setCurrentStep(1);
    };

    return (
        <>
            {/* Render KYC modal when requested */}
            {closeNotifyInfoPopUp && <CadFileNotifyInfoPopUp setClosePopUp={setCloseNotifyInfoPopUp} cad_type={'USER_CADS'} />}
            {isApiSlow && <CadFileNotifyPopUp setIsApiSlow={setIsApiSlow} />}
            {showKyc ? <Kyc onClose={handleKycClose} setUser={setUser}/> :
            <div className={styles["cad-upload-container"]}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Upload CAD file</h2>
                    {showHeaderClose && onClose && (
                        <button onClick={onClose} style={{ background: 'transparent', border: 0, cursor: 'pointer' }}>
                            <CloseIcon />
                        </button>
                    )}
                </div>
                {rejected && <span style={{color:'red',marginBottom:'10px'}}>Rejected due to: {editedDetails.rejected_message}</span>}
                
                {/* Step indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%', 
                        backgroundColor: currentStep >= 1 ? '#610bee' : '#e0e0e0',
                        color: currentStep >= 1 ? '#fff' : '#666',
                        fontWeight: 600,
                        fontSize: 14
                    }}>
                        1
                    </div>
                    <div style={{ 
                        width: 40, 
                        height: 2, 
                        backgroundColor: currentStep >= 2 ? '#610bee' : '#e0e0e0' 
                    }} />
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%', 
                        backgroundColor: currentStep >= 2 ? '#610bee' : '#e0e0e0',
                        color: currentStep >= 2 ? '#fff' : '#666',
                        fontWeight: 600,
                        fontSize: 14
                    }}>
                        2
                    </div>
                </div>

                {/* STEP 1: File Upload */}
                {currentStep === 1 && (
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Step 1: Upload Files</h3>
                        <div style={{ marginBottom: 16 }}>
                            {/* Single File Upload Dropzone */}
                            <div 
                                className={styles["cad-dropzone"]} 
                                onClick={handleClick}
                                onDrop={handleSingleDrop}
                                onDragOver={handleDragOver}
                                style={{ marginBottom: 12 }}
                            >
                                <input
                                    type="file"
                                    accept=".step,.stp,.stl,.ply,.off,.igs,.iges,.brp,.brep,.obj"
                                    ref={fileInputRef}
                                    disabled={uploadProgress > 0 || isUploadingMultiple}
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                                {uploadProgress > 0 && uploadMode === 'single' ? (
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
                                        Drag a single file here or{' '}
                                        <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#610bee' }}>select file</span>
                                    </>
                                )}
                            </div>
                            {/* Multiple Files Upload Dropzone */}
                            <div 
                                className={styles["cad-dropzone"]} 
                                onClick={handleMultipleFilesClick}
                                onDrop={handleMultipleDrop}
                                onDragOver={handleDragOver}
                                style={{ 
                                    border: '2px dashed #610bee',
                                    backgroundColor: '#f8f9fa',
                                    position: 'relative'
                                }}
                            >
                                <input
                                    type="file"
                                    multiple
                                    ref={multipleFilesInputRef}
                                    disabled={uploadProgress > 0 || isUploadingMultiple}
                                    style={{ display: "none" }}
                                    onChange={handleMultipleFilesChange}
                                />
                                {isUploadingMultiple || supportedFiles.length > 0 ? (
                                    <div style={{ marginTop: 10, width: '90%', textAlign: 'center', marginInline: 'auto' }}>
                                        {isUploadingMultiple ? (
                                            <>
                                                <div><span>Uploading {Object.keys(multipleUploadProgress).length} file(s)...</span></div>
                                                {Object.entries(multipleUploadProgress).map(([name, progress]) => (
                                                    <div key={name} style={{ marginTop: 8 }}>
                                                        <div style={{ fontSize: 12, marginBottom: 4 }}>{name}</div>
                                                        <div style={{ background: '#e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
                                                            <div style={{ width: `${progress.percent}%`, backgroundColor: '#610bee', height: 6, transition: 'width 0.3s ease-in-out' }} />
                                                        </div>
                                                        <p style={{ textAlign: 'right', fontSize: 11 }}>{progress.percent}%</p>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <>
                                                <div><span>{supportedFiles.length} file(s) uploaded successfully</span></div>
                                                <div style={{ maxHeight: '150px', overflowY: 'auto', marginTop: 8, textAlign: 'left' }}>
                                                    {supportedFiles.map((file, idx) => (
                                                        <div key={idx} style={{ fontSize: 12, padding: '4px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <span>{file.fileName} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                                                            <CloseIcon onClick={e => { e.stopPropagation(); handleRemoveSupportingFile(idx); }} style={{ cursor: 'pointer', color: '#610bee', marginLeft: 8 }} />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div style={{ marginTop: 8 }}>
                                                    <span style={{ fontSize: 12, color: '#666' }}>Total: {(supportedFiles.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(2)} MB / 1024.00 MB</span>
                                                </div>
                                                <div style={{ marginTop: 8 }}>
                                                    <CloseIcon onClick={handleCancel} style={{ cursor: 'pointer', color: '#610bee' }} />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <Image
                                            src='https://marathon-web-assets.s3.ap-south-1.amazonaws.com/uploading-icon.svg'
                                            alt='uploading-icon'
                                            width={50}
                                            height={50}
                                        />
                                        Drag multiple files here or{' '}
                                        <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#610bee' }}>
                                            select files
                                        </span>
                                        <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                                            Select multiple files. All file types are accepted for supporting files.
                                        </p>
                                    </>
                                )}
                            </div>
                            {(formErrors.file && !url && supportedFiles.length === 0) && <p style={{ color: 'red', marginTop: 8 }}>{formErrors.file}</p>}
                        </div>
                        
                        {/* Next button for step 1 */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                            <button
                                onClick={handleNextStep}
                                disabled={!url && supportedFiles.length === 0}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: (!url && supportedFiles.length === 0) ? '#a270f2' : '#610bee',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: 6,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    cursor: (!url && supportedFiles.length === 0) ? 'not-allowed' : 'pointer',
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Form Details */}
                {currentStep === 2 && (
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Step 2: Design Details</h3>
                        
                        {/* Checkbox for download permission */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 10 }}>
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

                                {/* Tags */}
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
                                {user.kycStatus !== 'completed' &&  <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 16 }}>
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
                                </div>}
                               

                                {/* Price with dollar icon on the right */}
                                <div style={{ marginBottom: 16,display:'flex',flexDirection:'column',gap:'12px' }}>
                                    
                                    <div style={{position:'relative'}}>
                                        <label style={{ display: 'block', fontSize: 13, color: '#444', marginBottom: 6 }}>Price</label>
                                        <input
                                        type="number"
                                        min={0}
                                        max={500}
                                        placeholder="Enter price"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        disabled={user.kycStatus !== 'completed'}
                                        style={{
                                            width: '100%',
                                            padding: '10px 34px 10px 12px',
                                            border: `1px solid ${formErrors.price ? 'red' : '#ddd'}`,
                                            borderRadius: 6,
                                            background: user.kycStatus === 'completed' ? '#fff' : '#f5f5f5',
                                        }}
                                    />
                                    <span style={{ position: 'absolute', right: 10, top: '58%', transform: 'translateY(-50%)', color: '#6b7280' }}>
                                        $
                                    </span></div>
                                    
                                    {formErrors.price && <p style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{formErrors.price}</p>}
                                    <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>You can upload for $0 and others can download for Free. Maximum price allowed is $500.</p>
                                   {user.kycStatus === 'completed' &&
                                   <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                        <span style={{color:'#848e96'}}>Marathon commision</span>
                                        <span style={{color:'#848e96'}}>${(price * 0.1).toFixed(2)}</span>
                                    </div>
                                   } 
                                   {user.kycStatus === 'completed' && <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                        <span style={{color:'#848e96'}}>Platform fee</span>
                                        <span style={{color:'#0f9918'}}>Free</span>
                                    </div>} 
                                </div>

                                {/* Upload button */}
                                {hasUserEmail ? (
                                    <button
                                        style={{ 
                                            width: '100%', 
                                            padding: '12px', 
                                            backgroundColor: (!termsAccepted || uploading || user.kycStatus !== 'completed') ? '#a270f2' : '#610bee', 
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: 6,
                                            fontSize: 16,
                                            fontWeight: 600,
                                            cursor: (!termsAccepted || uploading || user.kycStatus !== 'completed') ? 'not-allowed' : 'pointer',
                                            marginTop: 4
                                        }}
                                        disabled={!termsAccepted || uploading || user.kycStatus !== 'completed'}
                                        onClick={editedDetails ? handleUpdateUserCadFileSubmit : handleUserCadFileSubmit}
                                        title={
                                            !termsAccepted 
                                                ? 'Please agree to the terms and conditions to upload your design.' 
                                                : user.kycStatus !== 'completed' 
                                                    ? 'Please verify your bank details to upload your design.' 
                                                    : ''
                                        }
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
                                <div style={{ marginTop: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input type="checkbox" checked={termsAccepted} onChange={(e)=>setTermsAccepted(e.target.checked)} />
                                        <span style={{ fontSize: 13, color: '#444' }}>
                                            Agree to <Link href="/terms-and-conditions" target='_blank' style={{ color: '#610bee' }}>terms & conditions</Link> and <Link href="/privacy-policy" target='_blank' style={{ color: '#610bee' }}>privacy policy</Link> of Marathon.
                                        </span>
                                    </div>
                                    {formErrors.terms && <p style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{formErrors.terms}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Navigation buttons for step 2 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                            {!editedDetails && (
                                <button
                                    onClick={handlePreviousStep}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#fff',
                                        color: '#610bee',
                                        border: '2px solid #610bee',
                                        borderRadius: 6,
                                        fontSize: 16,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Back
                                </button>
                            )}
                            <div style={{ flex: 1 }} /> {/* Spacer */}
                        </div>

                        {/* Bottom note */}
                        <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, marginTop: 16 }}>
                            <p className="text-gray-600" style={{ margin: 0 }}>
                                ⚠️ It might take up to 24 hours for your design to go live. We will email you the link once it is published.
                            </p>
                        </div>
                    </div>
                )}
            </div>}
        </>
    );
}

export default UploadCadfileDummy;
