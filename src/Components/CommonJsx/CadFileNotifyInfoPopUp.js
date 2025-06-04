'use client';
import React, {useState} from 'react';
import styles from './CommonStyles.module.css';
import ClearIcon from '@mui/icons-material/Clear';

function CadFileNotifyInfoPopUp({setClosePopUp,cad_type}) {
   
const handleClose = () => {
    setClosePopUp(false);
    window.location.href = `/dashboard?cad_type=${cad_type}`
};
    const email = typeof window !== 'undefined' ? localStorage.getItem('user_email') : '';
    const browserNotify = typeof window !== 'undefined' ? localStorage.getItem('user_access_key') : '';

    return (

        <div className={styles.popUpMain}>
            <div className={styles.cadNotifyPopup}>
                <div style={{ display: 'flex', justifyContent: 'flex-end',  width: '100%' }}>
                    <ClearIcon onClick={handleClose}/>
                </div>
                <h3>Your CAD File is Processing</h3>

                <p>We will notify you when your CAD file is ready. Thank you for your patience!</p>

                {(email || browserNotify) && (
                    <>
                        <div className={styles.divider} />
                        <p>Notification methods enabled:</p>

                        {email && (
                            <div className={styles.statusItem}>
                                <span className={styles.successText}>Email:</span> {email}
                            </div>
                        )}

                        {browserNotify && (
                            <div className={styles.statusItem}>
                                <span className={styles.successText}>Browser notifications:</span> Enabled
                            </div>
                        )}
                    </>
                )}

                <div className={styles.divider} />

                <p>
                    For any issues, please contact our support team at{' '}
                    <a className={styles.supportLink} href="mailto:invite@marathon-os.com">
                        invite@marathon-os.com
                    </a>
                </p>
                <p className={styles.footerText}>
                    Thank you for using Marathon OS!
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', width: '100%' }}>
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200"
                        onClick={handleClose}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>

    );
}

export default CadFileNotifyInfoPopUp;