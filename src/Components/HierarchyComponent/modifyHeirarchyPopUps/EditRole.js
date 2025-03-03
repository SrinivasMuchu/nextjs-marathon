"use client";
import React, { useState } from "react";
import styles from './EditHierarchy.module.css';
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { BASE_URL,ASSET_PREFIX_URL } from "@/config";
import CommonSaveButton from "../Common/CommonSaveButton";
import CommonCancelButton from "../Common/CommonCancelButton";



function EditRole({ activeNode, setAction,setUpdatedData ,setParentId}) {
    const [close, setClose] = useState(false);
    const [jobTitle, setJobTitle] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleClose = () => {
        setClose(true);
        setAction(false)
    };

    const handleAddMember = async () => {
        // Reset form submission status and validation errors
        setFormSubmitted(true);
        setValidationErrors({});

        // Validate inputs
        if (!jobTitle.trim()) {
            setValidationErrors(prevErrors => ({ ...prevErrors, jobTitle: "Job Title is required." }));
            return;
        }

        try {
            await axios.put(BASE_URL + "/v1/org/edit-role-next", {
                  entity_id: activeNode.entity_id,
                  jobTitle,org_id:localStorage.getItem('org_id')
                },
                {
                  headers: {
                    'x-auth-token': localStorage.getItem("token")
                  }
                });
                // setParentId(activeNode.entity_id);
                // setUpdatedData(activeNode.entity_id)
                window.location.reload()
                setAction(false)

        } catch (error) {
            console.error(error.message);
           
        }
    };
    return (
        <div className={styles["editRole"]} style={{ display: close ? "none" : "block" }}>
            <div className={styles["head-cont"]}>
                <div className={styles["cancel"]}>
                    <span>Edit role for<span className={styles["active-name"]} > {activeNode.fullName}</span></span>
                    <CloseIcon onClick={handleClose} />
                </div>

                <div className={styles["editJob"]}>
                    <span>New job title</span>
                    <input
                        type="text"
                        placeholder="Enter Title"
                        onChange={(e) => setJobTitle(e.target.value)}
                        value={jobTitle}
                    />
                    {/* Display validation error for jobTitle */}
                    {formSubmitted && validationErrors.jobTitle && (
                        <div className={styles["department-error"]}><img src={`${ASSET_PREFIX_URL}warning.svg`} alt=""/>&nbsp;&nbsp;&nbsp;{validationErrors.jobTitle}</div>
                    )}
                </div>
            </div>

            <div className={styles["btn-bottom"]}>
                {/* <button onClick={handleAddMember}>Save</button>
                <button onClick={handleClose}>Cancel</button> */}
                 {(!jobTitle)?<CommonSaveButton handleClick={handleAddMember} className='submit-edit-errorbutton' styles={styles} /> :
          <CommonSaveButton handleClick={handleAddMember} className='submit-edit-button' styles={styles} />}
                {/* <button onClick={handleAddMember} className="submit-edit-button">Save</button> */}
                <CommonCancelButton handleClose={handleClose} styles={styles} />
            </div>
        </div>
    );
}

export default EditRole;
