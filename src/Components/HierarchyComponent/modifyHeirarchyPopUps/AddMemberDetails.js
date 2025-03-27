"use client";
import React, { useState } from 'react'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import styles from './EditHierarchy.module.css';
import axios from "axios";
import { ASSET_PREFIX_URL, BASE_URL } from '@/config';
import CommonSaveButton from '../Common/CommonSaveButton';
import CommonCancelButton from '../Common/CommonCancelButton';
import Image from 'next/image'
import { toast } from 'react-toastify';


function AddMemberDetails({ handleClose, activeNode, setAction, action, setUpdatedData, setParentId, setLimitError, setOpenForm,fetchOrg }) {
    const [photoFile, setPhotoFile] = useState('')
    const [fullName, setFullName] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [error, setError] = useState({})

    const [photoBlob, setPhotoBlob] = useState('')

    const arrayBufferToBase64 = (arrayBuffer) => {
        let binary = "";
        const bytes = new Uint8Array(arrayBuffer);
        const len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        return window.btoa(binary);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setPhotoFile(reader.result); // Directly set base64 string
        reader.readAsDataURL(file);

    };



    const handleAddMember = async () => {
        // Reset form submission status and validation errors
        // setFormSubmitted(true);
        // setError({});

        // Validate inputs
        if (!jobTitle.trim()) {
            setError(prevErrors => ({ ...prevErrors, jobTitle: "Job Title is required." }));
            return;
        }
        if (!fullName) {
            setError(prevErrors => ({ ...prevErrors, fullName: "Please enter full name." }));
            return;
        }
        if (!email) {
            setError(prevErrors => ({ ...prevErrors, email: "Please enter email ." }));
            return;
        }
        if (!email.includes('@')) {
            setError(prevErrors => ({ ...prevErrors, incorrectEmail: "Please enter valid email." }));
            return;
        }

        try {
            const headers = { 'user-uuid': localStorage.getItem('uuid') };

            const response = await axios.post(BASE_URL + "/v1/org/add-hierarchy-next", {
                 designation: jobTitle, fullName, phoneNumber, email,
                photo: photoFile, 

            },
                {
                    headers
                });





            if (response.data.meta.success) {
                const hierarchyResponse = await axios.post(BASE_URL + "/v1/org/update-hierarchy-next", {
                    entity_id: response.data.data.member,
                    parent_entity_id: activeNode.entity_id,
                    is_sibling: true,
                    job_title: jobTitle, uuid: localStorage.getItem('uuid'),
                    entity_type: action === 'add_mem' ? "member" : "assistant",
                    action: 'add', uuid: localStorage.getItem('uuid')
                },
                    {
                        headers
                    });
                if (hierarchyResponse.data.meta.success) {
                    fetchOrg(activeNode.entity_id);
                    setUpdatedData(activeNode.entity_id)
                    setAction(false)
                } else if (
                    hierarchyResponse.data.meta.success === false && hierarchyResponse.data.meta.limit === false
                ) {
                    setOpenForm('demo')
                    setLimitError(response.data.meta.message);
                } else {
                    toast.error(response.data.meta.message);
                }
                // if(hierarchyResponse.data.meta.success){
                //     window.location.reload()
                // }else{
                //     console.log(hierarchyResponse.data.meta.message)
                // }

            } else {
                toast.error(response.data.meta.message);
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message);

        }
    };



    return (
        <>
            <div className={styles["viewrole-photo-cont"]}>
                <div className={styles["general-upload"]} >
                    {photoFile ? <Image width={200} height={200} src={photoFile} alt="Uploaded" className="upd-img" style={{ width: '200px', height: '200px', borderRadius: '50%' }} /> :
                        <Image width={200} height={200} src={ASSET_PREFIX_URL + 'profilelogodefault.png'} alt="Uploaded" className="upd-img" style={{ width: '200px', height: '200px', borderRadius: '50%' }} />}
                    {/* <NameProfile userName={name} memberPhoto={photoFile} width="200px" fontSize='38px' fontweight='500' /> */}
                    <button className={styles["general-upload-btn"]} onClick={() => document.getElementById("fileupld-photo").click()} >

                        <Image width={16} height={16}
                            src={`${ASSET_PREFIX_URL}upload-plus.svg`}

                            alt=""
                        />
                    </button>

                </div>
                <input
                    type="file"
                    id="fileupld-photo"
                    accept="image/jpeg, image/png"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                    className="btn-upload"
                />
                {/* <NameProfile userName={activeNode.fullName} width='200px' memberPhoto={activeNode.photo} fontSize='100px' fontweight='500' /> */}
                {/* <Image className='viewrole-photo' src={activeNode.photo ? PHOTO_LINK + activeNode.photo : DEFAULT_PHOTO} alt='' /> */}
            </div>
            <div className={styles["viewrole-details"]}>
                <div className={styles["viewrole-name"]}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%',gap:'24px'  }}>
                        <span >Name:</span>
                        <input className={styles["viewrole-input"]} placeholder='Enter fullname' type='text' value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    {(!fullName && error.fullName) && (
                        <div className={styles["department-error"]} ><Image
                            width={20} height={20} src={`${ASSET_PREFIX_URL}warning.svg`} alt="" />&nbsp;&nbsp;&nbsp;{error.fullName}</div>
                    )}
                    <br />
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <span >Job title:</span>
                        <input className={styles["viewrole-input"]} placeholder='Enter job title' type='text' value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                    </div>
                    {(!jobTitle && error.jobTitle) && (
                        <div className={styles["department-error"]} ><Image
                            width={20} height={20} src={`${ASSET_PREFIX_URL}warning.svg`} alt="" />&nbsp;&nbsp;&nbsp;{error.jobTitle}</div>
                    )}
                    <br />
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <span >Email:</span>
                        <input className={styles["viewrole-input"]} placeholder='Enter email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    {(!email && error.email) && (
                        <div className={styles["department-error"]} ><Image
                            width={20} height={20} src={`${ASSET_PREFIX_URL}warning.svg`} alt="" />&nbsp;&nbsp;&nbsp;{error.email}</div>
                    )}
                    {(email && !email.includes("@") && error.incorrectEmail) && (
                        <div className={styles["department-error"]} ><Image
                            width={20} height={20} src={`${ASSET_PREFIX_URL}warning.svg`} alt="" />&nbsp;&nbsp;&nbsp;{error.incorrectEmail}</div>
                    )}
                    <br />
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>

                        <span >Phone:</span>


                        <input className={styles["viewrole-input"]} placeholder='Enter phone number' type='text' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                    <br />
                    <div className={styles["edit-btns"]}>
                        {(!fullName || !email || !jobTitle) ? (
                            <CommonSaveButton handleClick={handleAddMember} className='submit-edit-errorbutton' styles={styles} />

                        ) : (
                            <CommonSaveButton handleClick={handleAddMember} className='submit-edit-button' styles={styles} />

                        )}
                        <CommonCancelButton handleClose={handleClose} styles={styles} />

                    </div>

                  
                    
                    

                </div>

                {/* <div className={styles["viewrole-contact"]} >
                    <span><b>Contact</b></span>
                    <div className={styles["viewrole-email"]} >
                        <div className={styles["viewrole-email-label"]}>
                            <DraftsOutlinedIcon />
                            <span>Email</span>

                        </div>
                        <div className={styles["viewrole-email-detail"]} >
                            <input className={styles["viewrole-input"]} placeholder='Enter email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className={styles["viewrole-phone"]}>
                        <div className={styles["viewrole-label"]}>

                            <LocalPhoneOutlinedIcon />
                            <span>Phone</span>
                        </div>
                        <div className={styles["viewrole-phone-detail"]} >
                            <input className={styles["viewrole-input"]} placeholder='Enter phone number' type='text' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                    </div>
                </div> */}

            </div>

        </>

    )
}

export default AddMemberDetails;