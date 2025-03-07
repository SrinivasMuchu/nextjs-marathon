"use client";
import React, { useState, useEffect } from "react";
import styles from './EditHierarchy.module.css';
import Select from "react-select";
import axios from "axios";
import { BASE_URL, ASSET_PREFIX_URL } from "@/config";
import NameProfile from "@/Components/CommonJsx/NameProfile";
import CloseButton from "../Common/CloseButton";
import CommonCancelButton from "../Common/CommonCancelButton";
import CommonSaveButton from "../Common/CommonSaveButton";
import customStyles from "./CustomStyle.helper";
import Image from 'next/image'
import { toast } from "react-toastify";

function ChangeManager({activeNode, hierarchy, setAction,setUpdatedData,setParentId }) {
  // const allIds = [activeNode.entity_id].concat(activeNode.children.map(item => item.entity_id));
  
  // console.log(allIds);
  const collectAllIds = (node) => {
    let ids = [node.entity_id];
    if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
            ids = ids.concat(collectAllIds(child));
        });
    }
    return ids;
};

// Collect all entity IDs from hierarchy
const allIds = collectAllIds(activeNode);

console.log(allIds);
  const [close, setClose] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});



  useEffect(() => {
    fetchData();
  }, []);




  const fetchData = async () => {
    try {
      const headers = {
        'x-auth-token': localStorage.getItem("token")
      };
      const response = await axios.get(BASE_URL + "/v1/org/get-change-manager-next",
      {params:{entity_ids:allIds,org_id:localStorage.getItem('org_id') }, headers: headers });
      //  console.log(response.data.data);
      setOptions(response.data.data);
    } catch (error) {
      console.error("Error fetching options data:", error);
    }
  };


  const handleClose = () => {
    setClose(true);
    setAction(false)
  };

  const handleAddMember = async ()  => {
    setFormSubmitted(true);
    setValidationErrors({});

    // Validate inputs
    if (!selectedOption) {
      setValidationErrors(prevErrors => ({ ...prevErrors, selectedOption: "Please select an employee." }));
      return;
    }


    try {
        const selectedEntityId = selectedOption ? selectedOption.entity_id._id : "";
        // Get the selected email from the option
       const response= await axios.delete(BASE_URL + "/v1/org/remove-role-next", {
          data:{
              entity_id: activeNode.entity_id,
              new_manager_id: selectedEntityId,
              parent_id:activeNode.parent_entity_id,org_id:localStorage.getItem('org_id'),
          },
             headers: {
                'x-auth-token': localStorage.getItem("token")
              }});
              if(response.data.meta.success){
                toast.success('Manager changed successfully. Refreshing the page')
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
               setAction(false)
              }else{
                toast.error(response.data.meta.message)
              }
              
      }
      // Handle the response data or update the UI accordingly
     catch (error) {
      toast.error(error.message);
     
      // Handle the error or display an error message
    }
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
    
      <CloseButton handleClose={handleClose} heading='Change Manager before removing' styles={styles}/>
      <div className={styles["emp"]}>
        <span>Employee</span>
        <Select
          id="mySelect"
          menuPlacement="auto"
          styles={customStyles}
          options={options}
          getOptionLabel={(option) => (
            <div className={styles["select-photo"]}>
            <NameProfile userName={option.entity_id.fullName} width='25px' memberPhoto={option.entity_id.photo} />

            

             {option.entity_id.fullName}&nbsp;
             ({option.entity_id.email.length > 12 ? `${option.entity_id.email.slice(0, 15)}...` : option.entity_id.email})
        </div>
          )}
          onChange={(selectedOption) => {
            setSelectedOption(selectedOption); // Update the selected option
          }}
          filterOption={filterOptions} // Update the selected option
          value={selectedOption} // Set the selected option
        />
        {formSubmitted && validationErrors.selectedOption && (
            <div className={styles["department-error"]}><Image width={20} height={20}
            src={`${ASSET_PREFIX_URL}warning.svg`} alt=""/>&nbsp;&nbsp;&nbsp;{validationErrors.selectedOption}</div>
          )}
      </div>
    </div>

    <div className={styles["btn-bottom"]}>
      {/* <button onClick={handleAddMember}>Save</button>
      <button onClick={handleClose}>Cancel</button> */}
      <CommonSaveButton handleClick={handleAddMember} className='submit-edit-button' styles={styles} />
    
      <CommonCancelButton handleClose={handleClose} styles={styles} />
    </div>
  </div>
  );
}

export default ChangeManager;