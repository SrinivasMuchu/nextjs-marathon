"use client";
import React, { useState, useEffect } from "react";
import styles from './EditHierarchy.module.css';
import CloseIcon from "@mui/icons-material/Close";
import Select from "react-select";
import axios from "axios";
import { BASE_URL,ASSET_PREFIX_URL } from "@/config";
import NameProfile from '@/Components/CommonJsx.js/NameProfile';
import customStyles from "./CustomStyle.helper";
import CloseButton from "../Common/CloseButton";
import CommonCancelButton from "../Common/CommonCancelButton";
import CommonSaveButton from "../Common/CommonSaveButton";

function EditManager({ activeNode, hierarchy, setAction, setUpdatedData }) {
  console.log(activeNode.parent_entity_id)
  const collectAllIds = (node) => {
    let ids = [node.entity_id];
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        ids = ids.concat(collectAllIds(child));
      });
    }
    return ids;
  };

  // Collect all entity IDs from hierarchy along with parent ID
  const allIdsWithParent = [activeNode.parent_entity_id, ...collectAllIds(activeNode)];
  console.log(allIdsWithParent)
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
      
      const response = await axios.get(BASE_URL + "/v1/org/get-change-manager", {
        params: { entity_ids: allIdsWithParent }, // Send all IDs with parent ID
        headers: {
            'x-auth-token': localStorage.getItem("token")
          }
      });
      setOptions(response.data.data);
    } catch (error) {
      console.error("Error fetching options data:", error);
    }
  };

  const handleClose = () => {
    setClose(true);
    setAction(false)
  };

  const handleAddMember = async () => {
    setFormSubmitted(true);
    setValidationErrors({});

    // Validate inputs
    if (!selectedOption) {
      setValidationErrors(prevErrors => ({ ...prevErrors, selectedOption: "Please select an employee." }));
      return;
    }
    try {
      const selectedEntityId = selectedOption ? selectedOption.entity_id : "";
      // Get the selected email from the option
      await axios.post(BASE_URL + "/v1/org/update-hierarchy", {
        action: 'change_manager',
        old_manager_id: activeNode.entity_id,
        new_manager_id: selectedEntityId,
      }, {
        headers: {
            'x-auth-token': localStorage.getItem("token")
          }
      });
      setUpdatedData(selectedEntityId)
      setAction(false)
    } catch (error) {
      console.error(error.message);
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
    
        <CloseButton handleClose={handleClose} heading='Change manager' styles={styles}/>
        <div className={styles["emp"]}>
          <span>Managers</span>
          <Select
            id="mySelect"
            menuPlacement="auto"
            styles={customStyles}
            options={options}
            getOptionLabel={(option) => (
              <div className="select-photo">
                <NameProfile userName={option.entity_id.fullName} width='25px' memberPhoto={option.entity_id.photo} />



                {option.entity_id.fullName}&nbsp;
                ({option.entity_id.email.length > 12 ? `${option.entity_id.email.slice(0, 15)}...` : option.entity_id.email})
                {/* ({option.email}) */}
              </div>
            )}
            onChange={(selectedOption) => {
              setSelectedOption(selectedOption);
            }}
            filterOption={filterOptions}
            value={selectedOption}
          />
          {formSubmitted && validationErrors.selectedOption && (
            <div className={styles["department-error"]}><img src={`${ASSET_PREFIX_URL}warning.svg`} alt="" />&nbsp;&nbsp;&nbsp;{validationErrors.selectedOption}</div>
          )}
        </div>
      </div>
      <div  className={styles["btn-bottom"]} >
        {(!selectedOption) ? (
                    <CommonSaveButton handleClick={handleAddMember} className='submit-edit-errorbutton' styles={styles} />

                ) : (
                    <CommonSaveButton handleClick={handleAddMember} className='submit-edit-button' styles={styles} />

                )}
        <CommonCancelButton handleClose={handleClose} styles={styles} />
      </div>
    </div>
  );
}

export default EditManager;
