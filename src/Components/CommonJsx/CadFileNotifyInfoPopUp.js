'use client';
import React, { useState, useEffect,useContext } from 'react';
import styles from './CommonStyles.module.css';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import usePushNotifications from './usePushNotifications';
import PopupWrapper from './PopupWrapper';
import { sendGAtagEvent } from '../../common.helper';
import { BASE_URL, CAD_BROWSER_NOTIFICATION_EVENT } from '@/config';
import { contextState } from './ContextProvider';
import Link from 'next/link';
import EmailOTP from './EmailOTP'

function CadFileNotifyInfoPopUp({ setClosePopUp, cad_type }) {
    const [email, setEmail] = useState('');
    const [browserNotify, setBrowserNotify] = useState(true);
    const [hasToggled, setHasToggled] = useState(false); // To detect toggle change in this session
    const pushRegister = usePushNotifications();
    const { user } = useContext(contextState);
    const [verifyEmail, setVerifyEmail] = useState(false);

   
    useEffect(() => {
        if(!localStorage.getItem('is_verified')){
            setVerifyEmail(true)
        }
            
         setEmail(user.email);
        if (user.user_access_key) {
            setHasToggled(true);
        } else {
            setHasToggled(false);
        }
    }, []);

    const handleNotificationToggle = () => {
        setBrowserNotify((prev) => !prev);
        // setHasToggled(true);
    };

    const handleClose = async () => {
        if (browserNotify) {
            try {
                sendGAtagEvent({ 
                    event_name: browserNotify ? 'browser_notification_approve' : 'browser_notification_reject',
                    event_category: CAD_BROWSER_NOTIFICATION_EVENT 
                });
                await pushRegister(email, browserNotify);

                // localStorage.setItem('user_access_key', browserNotify);
                window.location.href = `/dashboard?cad_type=${cad_type}`;
            } catch (error) {
                console.error("Notification registration failed", error);

            }
        } else {
            window.location.href = `/dashboard?cad_type=${cad_type}`;
        }
    };

    return (
        <PopupWrapper>
            {verifyEmail ? (
                <EmailOTP email={email} setIsEmailVerify={setVerifyEmail} saveDetails={handleClose}/>) : (
            <div className={styles.cadNotifyPopup}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <ClearIcon onClick={() => setClosePopUp(false)} />
                </div>
                <h3>Your CAD File is Processing</h3>
                <p>We will notify you when your CAD file is ready. Thank you for your patience!</p>

                {(email || hasToggled) && (
                    <>
                        <div className={styles.divider} />
                        <p>Notification methods enabled:</p>
                        {email && (
                            <div className={styles.statusItem}>
                                <span className={styles.successText}>Email:</span> {email}
                            </div>
                        )}
                        {hasToggled && (
                            <div className={styles.statusItem}>
                                <span className={styles.successText}>Browser notifications:</span> Enabled
                            </div>
                        )}
                    </>
                )}

                {!hasToggled && (
                    <>
                        <div className={styles.divider} />
                        <p>Notification methods enabled:</p>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-gray-700">Enable Browser Notifications</span>
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={browserNotify}
                                onChange={handleNotificationToggle}
                            />
                            <div className={`w-10 h-5 rounded-full ${browserNotify ? 'bg-blue-600' : 'bg-gray-300'} relative`}>
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${browserNotify ? 'translate-x-5' : ''}`} />
                            </div>
                        </label>
                    </>
                )}

                <div className={styles.divider} />

                <p>
                    For any issues, please contact our support team at{' '}
                    <Link className={styles.supportLink} href="mailto:invite@marathon-os.com">
                        invite@marathon-os.com
                    </Link>
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
            </div>)}
        </PopupWrapper>
    );
}

export default CadFileNotifyInfoPopUp;
