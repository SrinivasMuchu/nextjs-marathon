"use client"
import React,{useState} from 'react'
import { GoPencil } from "react-icons/go";
import PublishCadPopUp from '../CommonJsx/PublishCadPopUp';
import styles from './IndustryDesign.module.css'
function IndustryDetailsEditButton({ EditableFields,type }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

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