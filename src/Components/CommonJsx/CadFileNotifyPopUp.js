'use client';
import React, { useState,useContext } from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import styles from './CommonStyles.module.css';
import usePushNotifications from './usePushNotifications';
import PopupWrapper from './PopupWrapper';
import EmailOTP from './EmailOTP'
import { sendGAtagEvent } from '../../common.helper';
import { CAD_BROWSER_NOTIFICATION_EVENT } from '@/config';
import { contextState } from './ContextProvider';

function CadFileNotifyPopUp({ setIsApiSlow, action, cad_type }) {
    const {user} = useContext(contextState);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState('');
  const [browserNotify, setBrowserNotify] = useState(true);
   const [verifyEmail, setVerifyEmail] = useState(false);
   const [isVerified, setIsVerified] = useState(false);
  const pushRegister = usePushNotifications();




  const handleAllow = async () => {
    try {
      if(!localStorage.getItem('is_verified')) {
        setVerifyEmail(true);
        return; // Stop here and wait for OTP verification
      }
      
      // This runs after OTP verification OR if already verified
      sendGAtagEvent({ 
        event_name: browserNotify ? 'browser_notification_approve' : 'browser_notification_reject',
        event_category: CAD_BROWSER_NOTIFICATION_EVENT 
      });
      
      const result = await pushRegister(email, browserNotify);
      if (result?.success === false) {
        setError(result.message);
        return;
      }
      if(cad_type) {
      
      window.location.href = `/dashboard?cad_type=${cad_type}`;
      }
      setIsApiSlow(false);
     
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
  };

  const handleOTPVerified = async () => {
    // Close the OTP popup first
    setVerifyEmail(false);
    
    // Then proceed with the original action
    try {
      sendGAtagEvent({ 
        event_name: browserNotify ? 'browser_notification_approve' : 'browser_notification_reject',
        event_category: CAD_BROWSER_NOTIFICATION_EVENT 
      });
      
      const result = await pushRegister(email, browserNotify);
      if (result?.success === false) {
        setError(result.message);
        return;
      }
      
      if(cad_type) {
      
      window.location.href = `/dashboard?cad_type=${cad_type}`;
      }
      setIsApiSlow(false);
     
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
  };

  const handleDeny = () => {
    setIsApiSlow(false);
  };

  const handleNotificationToggle = () => {
    setBrowserNotify(!browserNotify);
  };

  return (
    <PopupWrapper>
      {verifyEmail ? <EmailOTP email={email} setIsEmailVerify={setVerifyEmail} setError={setError} saveDetails={handleOTPVerified}/>:
      <div className="relative w-full bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
          onClick={handleDeny}
        >
          &times;
        </button>
        {cad_type? <>
         <h2 className="text-lg font-semibold text-gray-800 mb-1">Stay Updated</h2>
        <p className="text-sm text-gray-500 mb-5">Conversion can take a while. Get notified when it&#39;s ready.</p>

        </>:<>
         <h2 className="text-lg font-semibold text-gray-800 mb-1">Verify your Email</h2>
        {/* <p className="text-sm text-gray-500 mb-5">Conversion can take a while. Get notified when it&#39;s ready.</p> */}

        </>}

       

        {/* Email Input */}
        {!action && <div className="flex items-center gap-3 mb-4">
          <MailOutlineIcon style={{ fontSize: '20px', color: '#4B5563' }} />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            tabIndex={0}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:outline-none focus:border-blue-500"
          />
        </div>}
        { }
        {/* Browser Notifications Toggle */}
      {cad_type && <div className="flex items-center gap-3 mb-6">
          <span className="text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-3.07-1.64-5.64-5-6.32V4a1 1 0 10-2 0v.68c-3.36.68-5 3.25-5 6.32v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </span>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-gray-700">Enable Browser Notifications</span>
            <input
              type="checkbox"
              className="sr-only"
              checked={browserNotify}
              onChange={handleNotificationToggle}
            />
            <div className={`w-10 h-5 rounded-full ${browserNotify ? 'bg-blue-600' : 'bg-gray-300'} relative`}>
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${browserNotify ? 'translate-x-5' : ''}`}
              />
            </div>
          </label>
        </div>}  
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {/* Submit Button */}
        {cad_type && <div className="flex justify-between">
          <button
            style={{ border: '2px solid #610bee', color: '#610bee', borderRadius: '10px', padding: '4px 6px' }}
            onClick={handleDeny}
          >
            Close
          </button>
          {cad_type && <>
          
          </>}
          {!action && <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200"
            onClick={handleAllow}
            disabled={!email && !browserNotify}
          >
            {email && browserNotify ? 'Notify Both Ways' :
              email ? 'Notify via Email' :
                browserNotify ? 'Enable Notifications' : 'Select Notification Method'}
          </button>}
          {(action && browserNotify) && <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200"
            onClick={handleAllow}
            disabled={!browserNotify}
          >
            {
              browserNotify && 'Enable Notifications'}
          </button>}

        </div>}
        {!cad_type && <div style={{display:'flex',aligItems:'center',justifyContent:'flex-end'}}><button
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200"
            onClick={handleAllow}
           
          >
            Verify
          </button></div>}
        
      </div>
      }
      

    </PopupWrapper>
  );
}

export default CadFileNotifyPopUp;