"use client";
import React, { useState } from "react";
import styles from './EditHierarchy.module.css';
import Select from "react-select";
import axios from "axios";
import Image from 'next/image'
import { BASE_URL, ASSET_PREFIX_URL } from "@/config";
import customStyles from "./CustomStyle.helper";
import NameProfile from "@/Components/CommonJsx.js/NameProfile";
import CommonSaveButton from "../Common/CommonSaveButton";
import CommonCancelButton from "../Common/CommonCancelButton";
import CloseButton from "../Common/CloseButton";
import AddMemberDetails from "./AddMemberDetails";
import { toast } from "react-toastify";

function AddMember({ activeNode, setAction, action, setUpdatedData, setParentId, setOpenForm, setLimitError }) {

  const [close, setClose] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [addMember, setAddMember] = useState(false);

  const handleOnchange = (selected) => {
    setJobTitle(selected.designation);
    setSelectedOption(selected)
    // setSelectedEntityId(selected.designation)
  }

  // useEffect(() => {
  //   fetchData();
  // }, [selectedOption]);



  const fetchData = async () => {
    try {
      const headers = {
        'x-auth-token': localStorage.getItem("token")
      };
      const response = await axios.get(BASE_URL + "/v1/org/getmember-details-next", { params: { uuid: localStorage.getItem('uuid'), org_id: localStorage.getItem('org_id') } },
      );
      const data = response.data.data.arr;
      console.log(data.map((i) => i.designation));
      data.sort((a, b) => a.fullName.localeCompare(b.fullName));
      setOptions(data);
    } catch (error) {
      console.error("Error fetching options data:", error);
    }
  };

  const handleClose = () => {
    setClose(true);
    setAction(false)
  };

  const handleAddMember = async () => {
    // Reset form submission status and validation errors
    setFormSubmitted(true);
    // setValidationErrors({});

    // Validate inputs
    if (!jobTitle) {
      setValidationErrors(prevErrors => ({ ...prevErrors, jobTitle: "Job Title is required." }));
      return;
    }
    if (!selectedOption) {
      setValidationErrors(prevErrors => ({ ...prevErrors, selectedOption: "Please select an employee." }));
      return;
    }

    try {
      const headers = {
        'x-auth-token': localStorage.getItem("token")
      };
      const selectedEntityId = selectedOption ? selectedOption._id : "";
      console.log(selectedEntityId)
      const response = await axios.post(BASE_URL + "/v1/org/update-hierarchy-next", {
        entity_id: selectedEntityId,
        parent_entity_id: activeNode.entity_id,
        is_sibling: true,
        job_title: jobTitle,
        entity_type: action === 'add_mem' ? "member" : "assistant",
        action: 'add', org_id: localStorage.getItem('org_id'), uuid: localStorage.getItem('uuid')
      },
        {
          headers
        });
      if (response.data.meta.success) {
        setParentId(activeNode.entity_id);
        setUpdatedData(selectedEntityId)
        setAction(false)
      } else if (
        response.meta.success === false && response.data.member_count >= 30
      ) {
        setOpenForm('demo')
        setLimitError('Free tier limit exceeded: Maximum 30 members allowed.');
      }else{
        toast.error(response.data.meta.message);
      }
      // if (response.data.meta.success) {
      //   // setParentId(activeNode.entity_id);
      //   // setUpdatedData(selectedEntityId)
      //   // setAction(false)
      //   window.location.reload()
      // } else {
      //   setErrorMessage
      //   setOpenForm(true)
      // }
    } catch (error) {
      toast.error(error);

    }
  };
  const handleErrorAddMember = async () => {
    // Reset form submission status and validation errors
   
    // setValidationErrors({});

    // Validate inputs
    console.log('clicked')
    if (!jobTitle) {
      setValidationErrors(prevErrors => ({ ...prevErrors, jobTitle: "Job Title is required." }));
      return;
    }
    if (!selectedOption) {
      setValidationErrors(prevErrors => ({ ...prevErrors, selectedOption: "Please select an employee." }));
      return;
    }
    console.log('clicked1')
    
  };

  const filterOptions = (candidate, input) => {
    if (!input) {
      return true;
    }

    const inputValue = input.toLowerCase().trim();
    const fullName = candidate.data.fullName.toLowerCase();
    return fullName.includes(inputValue);
  };



  return (
    <div className={styles["editRole"]} style={{ display: close ? "none" : "block" }}>
      <div className={styles["head-cont"]}>

        <CloseButton handleClose={handleClose} heading={`Add ${action === 'add_mem' ? "member" : "assistant"}`} styles={styles} />

        {!addMember ? <>
          <div className={styles["emp"]}>
            <span>Member</span>
            <Select
              id="mySelect1"
              options={[
                { fullName: "➕ Add Member", isAddButton: true }, // Custom add member option
                ...options, // Spread existing options below
              ]}
              menuPlacement="auto"
              styles={customStyles}
              onFocus={fetchData}
              getOptionLabel={(option) =>
                option.isAddButton ? (
                  <div className={styles["add-member-option"]}>➕ Add Member</div>
                ) : (
                  <div className={styles["select-photo"]}>
                    <NameProfile userName={option.fullName} padding="5px" width="25px" memberPhoto={option.photo} />
                    {option.fullName}&nbsp;
                    ({option.email.length > 12 ? `${option.email.slice(0, 18)}...` : option.email})
                  </div>
                )
              }
              onChange={(selected) => {
                if (selected.isAddButton) {
                  setAddMember(true); // Show add member form
                } else {
                  handleOnchange(selected);
                }
              }}
              filterOption={(candidate, input) => {
                if (candidate.data.isAddButton) return true; // Always show "Add Member"
                return candidate.data.fullName.toLowerCase().includes(input.toLowerCase());
              }}
            />

            { validationErrors.selectedOption && (
              <div className={styles["department-error"]} ><Image 
               width={20} height={20} src={`${ASSET_PREFIX_URL}warning.svg`} alt="" />&nbsp;&nbsp;&nbsp;{validationErrors.selectedOption}</div>
            )}
          </div>
          <div className={styles["emp"]}>
            <button className={styles["submit-edit-button"]} style={{ padding: '8px', borderRadius: '4px' }}
              onClick={() => setAddMember(!addMember)}>Add member</button>
          </div>
          <div className={styles["editJob"]}>
            <span>Job title</span>
            <input
              type="text"
              placeholder="Enter Title"
              onChange={(e) => setJobTitle(e.target.value)}
              value={jobTitle}
            />
            {/* Display validation error for jobTitle */}
            { validationErrors.jobTitle && (
              <div className={styles["department-error"]} ><Image src={`${ASSET_PREFIX_URL}warning.svg`} alt="" />&nbsp;&nbsp;&nbsp;{validationErrors.jobTitle}</div>
            )}
          </div>
          <div className={styles["btn-bottom"]} >
            {(!jobTitle || !selectedOption) ? <CommonSaveButton handleClick={handleErrorAddMember} className='submit-edit-errorbutton' styles={styles} /> :
              <CommonSaveButton handleClick={handleAddMember} className='submit-edit-button' styles={styles} />}

            <CommonCancelButton handleClose={handleClose} styles={styles} />
          </div>
        </> : <AddMemberDetails setParentId={setParentId} setLimitError={setLimitError} setOpenForm={setOpenForm}
          activeNode={activeNode} handleClose={handleClose} setAction={setAction} action={action} setUpdatedData={setUpdatedData} />}





      </div>


    </div>
  );
}

export default AddMember;
