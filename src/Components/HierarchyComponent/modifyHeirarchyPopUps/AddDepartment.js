"use client";
import React, { useState, useEffect } from "react";
import styles from './EditHierarchy.module.css';
import Image from 'next/image'
import axios from "axios";
import { BASE_URL, ASSET_PREFIX_URL } from "@/config";
import CommonCancelButton from "../Common/CommonCancelButton";
import CommonSaveButton from "../Common/CommonSaveButton";
import CloseButton from "../Common/CloseButton";
import { toast } from "react-toastify";


function AddDepartment({ activeNode, setAction, setParentId, setUpdatedData,setOpenForm,setLimitError }) {
  const [department, setDepartment] = useState('');
  // uniqueInitial
  const [uniqueInitial, setUniqueInitial] = useState('');
  const [description, setDescription] = useState('');
  const [deptId, setDeptId] = useState('');
  const [close, setClose] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  const [typingTimer, setTypingTimer] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setClose(true);
    setAction(false);
  };

  useEffect(() => {

    fetchDepartments();

  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BASE_URL}/v1/org/get-exist-next-department`, {
        headers: {
          'x-auth-token': localStorage.getItem("token")
        },
        params: { department_name: department, uuid: localStorage.getItem('uuid'), org_id: localStorage.getItem('org_id') },
      });
      if (response.data.meta.success) {
        setDepartments(response.data.data.filtered_departments);
      } else {
        setDepartments([]);
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleDepartmentChange = (e) => {
    setDeptId('');
    const inputValue = e.target.value;
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (regex.test(inputValue)) {
      setDepartment(inputValue);
      setErrorMessage('');
      clearTimeout(typingTimer);
      setTypingTimer(setTimeout(() => {
        fetchDepartments();

      }, 500));
    } else {
      setErrorMessage('Special characters are not allowed.');
    }
  };


  const handleClickRender = (e, dept) => {

    e.stopPropagation();
    setDeptId(dept._id);
    setDepartment(dept.department_name);
    setDescription(dept.description);
    setUniqueInitial(dept.unique_initial)
    setDepartments([]);
  };

  const HandleDepartment = async () => {
    try {
      if (!department) {
        setErrorMessage('Please enter the department name.');
        return;
      }

      let responseData;

      if (deptId) {
        responseData = await axios.post(
          `${BASE_URL}/v1/org/create-next-dept`,
          {
            department_name: department,
            description: description,
            unique_initial: uniqueInitial,
            departId: deptId, org_id: localStorage.getItem('org_id')
          },
          {
            headers: {
              'x-auth-token': localStorage.getItem("token")
            },
          }
        );
      } else {
        responseData = await axios.post(
          `${BASE_URL}/v1/org/create-next-dept`,
          {
            department_name: department,
            description: description, org_id: localStorage.getItem('org_id')

          },
          {
            headers: {
              'x-auth-token': localStorage.getItem("token")
            },
          }
        );
      }

      if (responseData.data.meta.success === true) {
        const entityId = responseData.data.data.id;

        if (activeNode && activeNode.entity_id) {
          const response = await axios.post(
            `${BASE_URL}/v1/org/update-hierarchy-next`,
            {
              entity_id: entityId,
              parent_entity_id: activeNode.entity_id,
              is_sibling: true,
              job_title: activeNode.jobTitle,
              entity_type: 'department',
              action: 'add',
              // uuid:localStorage.getItem('uuid'),
              org_id: localStorage.getItem('org_id')
            },
            {
              headers: {
                'x-auth-token': localStorage.getItem("token")
              },
            }
          );
          if (response.data.meta.success) {
            setParentId(activeNode.entity_id);
                setUpdatedData(activeNode.entity_id)
            setAction(false)
          } else if (
            response.meta.success===false && response.data.meta.limit===false )
           {
            setOpenForm('demo')
            setLimitError(response.data.meta.message);
          }else{
            toast.error(response.data.meta.message);
          }
        }


        // window.location.reload();
      } else if (responseData.data.meta.success === false) {
        toast.error(response.data.meta.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles["editRole"]} style={{ display: close ? 'none' : 'block' }}>
      <div className={styles["head-cont"]} >

        <CloseButton handleClose={handleClose} heading='Add department' styles={styles} />
        <div className={styles["edit-name"]} >
          <span>Department name</span>
          <div className={styles["edit-name-loading"]} >
            <input
              placeholder="Enter title"
              value={department}
              onChange={(e) => handleDepartmentChange(e)}
            />
            {loading && <Image width={20} height={20} className={styles["load-img"]} src={`https://marathon-web-assets.s3.ap-south-1.amazonaws.com/load-gif.gif`} />}

          </div>

          <div className={styles["filtered-departments"]}>
            {departments.map((dept) => (
              <div key={dept._id} className={styles["filtered-departments-list"]} onClick={(e) => handleClickRender(e, dept)}>
                <span>{dept.department_name}</span>
              </div>
            ))}
          </div>
          {errorMessage && (
            <div className={styles["department-error"]}>
              <Image src={`${ASSET_PREFIX_URL}warning.svg`} alt="" width={20} height={20}/>
              &nbsp;&nbsp;&nbsp;
              {errorMessage}
            </div>
          )}
        </div>

        <div className={styles["edit-title"]}>
          <span>Description (Optional)</span>
          <textarea
            placeholder="Your message..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className={styles["edit-btns"]}>
        {(!department || errorMessage !== '' || loading) ? (
          <CommonSaveButton handleClick={HandleDepartment} className='submit-edit-errorbutton' styles={styles} />

        ) : (
          <CommonSaveButton handleClick={HandleDepartment} className='submit-edit-button' styles={styles} />

        )}
        <CommonCancelButton handleClose={handleClose} styles={styles} />

      </div>
    </div>
  );
}

export default AddDepartment;
