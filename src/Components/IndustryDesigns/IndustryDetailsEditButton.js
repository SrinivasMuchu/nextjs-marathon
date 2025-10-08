"use client"
import React,{useState,useEffect} from 'react'
import { GoPencil } from "react-icons/go";
import PublishCadPopUp from '../CommonJsx/PublishCadPopUp';
import axios from "axios";
import { BASE_URL} from "@/config";
import styles from './IndustryDesign.module.css'
function IndustryDetailsEditButton({ EditableFields,type,fileId }) {
  console.log(fileId)
  const [isEditing, setIsEditing] = useState(false);
  const [isEditable, setIsEditable] = useState(false)
    useEffect(() => {
      // if (!orgId || !fileId) return;
  
      const checkEditable = async () => {
        try {
          const result = await axios.get(`${BASE_URL}/v1/cad/check-cad-editable`, {
            params: { cad_id: fileId },
            headers: {
              "user-uuid": localStorage.getItem("uuid"),
            },
          });
  
          console.log("Check Editable Response:", result.data);
  
          if (result.data.meta.success) {
            setIsEditable(true)
          } else {
            setIsEditable(false)
  
          }
        } catch (error) {
          console.error("Error checking editable:", error);
        }
      };
  
      checkEditable();
    }, [ fileId]);
  const handleEditClick = () => {
    setIsEditing(true);
  };

  if(!isEditable) return null;

  return (
    <>
      <div className={styles.industryDesignHeaderEdit} onClick={handleEditClick}>
            <GoPencil /> Edit details
        </div>
        {isEditing && <PublishCadPopUp onClose={() => setIsEditing(false)} editedDetails={EditableFields} type={type}/>}
    </>
   
  )
}

export default IndustryDetailsEditButton