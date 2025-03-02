
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import axios from 'axios';
import { BASE_URL } from "@/config";
import styles from './EditHierarchy.module.css';


function DeletePopUp({ activeNode,setHasChildren,onclose,setUpdatedData,setParentId }) {
    
    const handleDelete = async() => {
        // if(acti)
         await axios.delete(BASE_URL + "/v1/org/remove-role-next", {
          headers: {
            'x-auth-token': localStorage.getItem("token")
          },
          data: {
            entity_id: activeNode.entity_id,org_id:localStorage.getItem('org_id'),
            // parent_id: activeNode.parent_entity_id,
            remove_type: (activeNode.entity_type === 'department') ? 
              activeNode.department_name : activeNode.fullName
          },
        });

        // // Handle the response and other logic
        setParentId(activeNode.entity_id);
        setUpdatedData(activeNode.entity_id);
        // console.log(activeNode.entity_type)
    }

    const handleClose=()=>{
        onclose()
    }
    return (
        <div className={styles["default-popup"]}>
            <div className={styles["default-popup-container"]} >
                <div style={{width:'100%',display:'flex',justifyContent:'flex-end'}}>
                    <div className={styles["default-closing"]}  onClick={handleClose}>
                        <CloseIcon />
                    </div>
                </div>

                <div className={styles["default-message"]}>
                    <span>Would you like to remove the <span style={{color:'#610bee'}}>{activeNode.entity_type === 'department'?activeNode.department_name:activeNode.fullName}</span> from the organization?</span>


                </div>
                <div className={styles["default-btns"]} >
                    <button onClick={handleClose}>No</button>
                    <button onClick={handleDelete} style={{background:'#610bee',color:'white'}}>Yes</button>
                </div>
            </div>
        </div>
    )
}

export default DeletePopUp