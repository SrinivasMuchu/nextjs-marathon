"use client"
import React from 'react'
import styles from './AdminApprovalButtons.module.css'
import { BASE_URL } from '@/config';
import axios from 'axios';

function AdminApprovalButtons({design_id}) {
  // const [shouldRender, setShouldRender] = useState(true);

  // useEffect(() => {
  //   // Check if admin-uuid exists in localStorage
  //   const adminUuid = localStorage.getItem('admin-uuid');
  //   if (adminUuid) {
  //     setShouldRender(false);
  //   }
  // }, []);

  // // Return null if admin-uuid exists in localStorage
  // if (shouldRender) {
  //   return null;
  // }


  const handleActions = async(action) => {
    // Placeholder for action handling logic
    
    try {
      const response = await axios.post(`${BASE_URL}/v1/admin-pannel/approve-cad-file`, {
        action: action,
        design_id
      },{headers: { 'admin-uuid': localStorage.getItem('admin-uuid') }});
      console.log('Action response:', response.data);
    } catch (error) {
      console.log('Error handling action:', error);
    }
  }
  return (
    <div className={styles.container}>
        <button className={`${styles.button} ${styles.approve}`} onClick={()=>handleActions('approve')}>Approve</button>
        <button className={`${styles.button} ${styles.reject}`} onClick={()=>handleActions('reject')}>Reject</button>
    </div>
  )
}

export default AdminApprovalButtons