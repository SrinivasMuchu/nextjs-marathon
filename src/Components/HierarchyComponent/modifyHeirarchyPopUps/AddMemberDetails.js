"use client";
import React, { useState } from 'react'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import styles from './EditHierarchy.module.css';
import { ASSET_PREFIX_URL } from '@/config';
import CommonSaveButton from '../Common/CommonSaveButton';
import CommonCancelButton from '../Common/CommonCancelButton';

function AddMemberDetails({ handleClose,activeNode, setAction, action, setUpdatedData }) {
    const [photoFile, setPhotoFile] = useState('')
    const [fullName, setFullName] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [error, setError] = useState('')

    const [photoBlob, setPhotoBlob] = useState('')

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        setPhotoBlob(file)
        setPhotoFile(URL.createObjectURL(file))

    };
    const handleProfile = async (e) => {
        e.preventDefault();
        if (!fullName) {
            setError("Full name cannot be empty");
        } else if (!jobTitle) {
            setError("Job title cannot be empty");
        } else if (!email) {
            setError("Email cannot be empty");
        } else {
            setError("");




            try {
                if (fullName !== "") {
                    const token = localStorage.getItem("token");
                    
                        if (photoBlob) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const blobData = reader.result;
                                updateDetails(arrayBufferToBase64(blobData), token);
                            };
                            reader.readAsArrayBuffer(photoBlob);
                        } else {
                            updateDetails("", token);
                        }
                    
                }
                
            } catch (error) {
                console.error(error);
            }
        }
    };
    const arrayBufferToBase64 = (arrayBuffer) => {
        let binary = "";
        const bytes = new Uint8Array(arrayBuffer);
        const len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        return window.btoa(binary);
    };
    const updateDetails = async (photoData) => {
        const response = await axios.post(
            BASE_URL + "/v1/member/profile-details",
            { photo: photoData, fullName, phoneNumber, email,
                parent_entity_id: activeNode.entity_id,
                is_sibling: true,
                job_title: jobTitle,
                entity_type: action === 'add_mem' ? "member" : "assistant",
                action: 'add', },
            {
                headers: {
                    'x-auth-token': localStorage.getItem("token")
                  },
            }
        );
        let { message, success } = response.data.meta;
        if (success) {
            setUpdatedData(fullName);
            setAction(false)
            handleClose();

        } else {
            alert(message);
        }
    };
    return (
        <>
            <div className={styles["viewrole-photo-cont"]}>
                <div className={styles["general-upload"]} >
                    {photoFile ? <img src={photoFile} alt="Uploaded" className="upd-img" style={{ width: '200px', height: '200px', borderRadius: '50%' }} /> :
                        <img src={ASSET_PREFIX_URL + 'profile-empty.png'} alt="Uploaded" className="upd-img" style={{ width: '200px', height: '200px', borderRadius: '50%' }} />}
                    {/* <NameProfile userName={name} memberPhoto={photoFile} width="200px" fontSize='38px' fontweight='500' /> */}
                    <button className={styles["general-upload-btn"]} onClick={() => document.getElementById("fileupld").click()} >

                        <img
                            src={`${ASSET_PREFIX_URL}upload-plus.svg`}
                            width="16px"
                            height="16px"
                            alt=""
                        />
                    </button>

                </div>
                <input
                    type="file"
                    id="fileupld"
                    accept="image/jpeg, image/png, image/gif"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                    className="btn-upload"
                />
                {/* <NameProfile userName={activeNode.fullName} width='200px' memberPhoto={activeNode.photo} fontSize='100px' fontweight='500' /> */}
                {/* <img className='viewrole-photo' src={activeNode.photo ? PHOTO_LINK + activeNode.photo : DEFAULT_PHOTO} alt='' /> */}
            </div>
            <div className={styles["viewrole-details"]}>
                <div className={styles["viewrole-name"]}>
                    <div>
                        <span style={{marginRight:'5px'}}>Full name:</span>
                        <input className={styles["viewrole-input"]} placeholder='Enter fullname' type='text' value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <br/>
                    <div>
                        <span style={{marginRight:'15px'}}>Job title:</span>
                        <input className={styles["viewrole-input"]} placeholder='Enter job title' type='text' value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                    </div>

                </div>

                <div className={styles["viewrole-contact"]} >
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
                </div>

            </div>
            <div className={styles["edit-btns"]}>
                {(!fullName || !email || !jobTitle) ? (
                    <CommonSaveButton handleClick={handleProfile} className='submit-edit-errorbutton' styles={styles} />

                ) : (
                    <CommonSaveButton handleClick={handleProfile} className='submit-edit-button' styles={styles} />

                )}
                <CommonCancelButton handleClose={handleClose} styles={styles} />

            </div>
        </>

    )
}

export default AddMemberDetails