"use client";
import React, { useState } from 'react'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import styles from './EditHierarchy.module.css';
import axios from "axios";
import { ASSET_PREFIX_URL,BASE_URL } from '@/config';
import CommonSaveButton from '../Common/CommonSaveButton';
import CommonCancelButton from '../Common/CommonCancelButton';


function AddMemberDetails({ handleClose,activeNode, setAction, action, setUpdatedData,setParentId,setLimitError,setOpenForm }) {
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
    const handleAddMember = async () => {
        // Reset form submission status and validation errors
        // setFormSubmitted(true);
        // setValidationErrors({});
    
        // Validate inputs
        // if (!jobTitle.trim()) {
        //   setValidationErrors(prevErrors => ({ ...prevErrors, jobTitle: "Job Title is required." }));
        //   return;
        // }
        // if (!fullName) {
        //   setValidationErrors(prevErrors => ({ ...prevErrors, fullName: "Please select an employee." }));
        //   return;
        // }
        // if (!email) {
        //   setValidationErrors(prevErrors => ({ ...prevErrors, email: "Please select an employee." }));
        //   return;
        // }
    
        try {
          const headers = {
            'x-auth-token': localStorage.getItem("token")
          };
         const response = await axios.post(BASE_URL + "/v1/org/add-hierarchy-next", {
          uuid:localStorage.getItem('uuid'),designation:jobTitle, fullName, phoneNumber, email,org_id:localStorage.getItem('org_id'),
            
          },
            {
              headers
            });
            console.log(response.data.data.member)
          
        if(response.data.meta.success){
          const hierarchyResponse=  await axios.post(BASE_URL + "/v1/org/update-hierarchy-next", {
                entity_id: response.data.data.member,
                parent_entity_id: activeNode.entity_id,
                is_sibling: true,
                job_title: jobTitle,uuid:localStorage.getItem('uuid'),
                entity_type: action === 'add_mem' ? "member" : "assistant",
                action: 'add',org_id: localStorage.getItem('org_id')
              },
                {
                  headers
                });
                if (hierarchyResponse.data.meta.success) {
                    window.location.reload()
                    setAction(false)
                  } else if (
                    hierarchyResponse.meta.success === false && hierarchyResponse.data.member_count >= 30 
                  ) {
                    setOpenForm('demo')
                    setLimitError('Free tier limit exceeded: Maximum 30 members allowed.');
                  }
                // if(hierarchyResponse.data.meta.success){
                //     window.location.reload()
                // }else{
                //     console.log(hierarchyResponse.data.meta.message)
                // }
                
        }else{
            console.log(response.data.meta.message)
        }
         
        } catch (error) {
          console.error(error.message);
    
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
                    <br/>
                    <div>
                        <span style={{marginRight:'15px'}}>Email:</span>
                        <input className={styles["viewrole-input"]} placeholder='Enter email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <br/>
                    <div>
                        <span style={{marginRight:'15px'}}>Phone number:</span>
                        <input className={styles["viewrole-input"]} placeholder='Enter phone number' type='text' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
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
            <div className={styles["edit-btns"]}>
                {(!fullName || !email || !jobTitle) ? (
                    <CommonSaveButton handleClick={handleAddMember} className='submit-edit-errorbutton' styles={styles} />

                ) : (
                    <CommonSaveButton handleClick={handleAddMember} className='submit-edit-button' styles={styles} />

                )}
                <CommonCancelButton handleClose={handleClose} styles={styles} />

            </div>
        </>

    )
}

export default AddMemberDetails