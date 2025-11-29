"use client"
import React, { useState } from 'react'
import styles from './AdminApprovalButtons.module.css'
import { BASE_URL } from '@/config';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminApprovalButtons({design_id}) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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


  const handleActions = async(action, message = '') => {
    // Placeholder for action handling logic
    setIsSubmitting(true);
    
    try {
      const payload = {
        action: action,
        design_id
      };
      
      // Add rejection message if provided
      if (action === 'reject' && message) {
        payload.rejected_message = message;
      }
      
      const response = await axios.post(`${BASE_URL}/v1/admin-pannel/approve-cad-file`, payload, {
        headers: { 'admin-uuid': localStorage.getItem('admin-uuid') }
      });
      
      if(response.data.meta.success){
        toast.success(response.data.meta.message);
        if (action === 'reject') {
          setShowRejectModal(false);
          setRejectionMessage('');
        }
      } else {
        toast.error(response.data.meta.message);
      }
      
    } catch (error) {
      console.log('Error handling action:', error);
      toast.error('Failed to perform action');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleRejectClick = () => {
    setShowRejectModal(true);
  }

  const handleRejectSubmit = () => {
    if (!rejectionMessage.trim()) {
      toast.error('Please provide a rejection message');
      return;
    }
    handleActions('reject', rejectionMessage.trim());
  }

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectionMessage('');
  }
  return (
    <>
      <div className={styles.container}>
        <button 
          className={`${styles.button} ${styles.approve}`} 
          onClick={() => handleActions('approve')}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Approve'}
        </button>
        <button 
          className={`${styles.button} ${styles.reject}`} 
          onClick={handleRejectClick}
          disabled={isSubmitting}
        >
          Reject
        </button>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Reject Design</h3>
            <p className={styles.modalDescription}>
              Please provide a reason for rejecting this design:
            </p>
            <textarea
              className={styles.textarea}
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              maxLength={500}
            />
            <div className={styles.characterCount}>
              {rejectionMessage.length}/500
            </div>
            <div className={styles.modalActions}>
              <button
                className={`${styles.button} ${styles.cancel}`}
                onClick={handleRejectCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className={`${styles.button} ${styles.reject}`}
                onClick={handleRejectSubmit}
                disabled={isSubmitting || !rejectionMessage.trim()}
              >
                {isSubmitting ? 'Rejecting...' : 'Reject Design'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminApprovalButtons