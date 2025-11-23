"use client";
import axios from 'axios';
import styles from '../IndustryDesigns/IndustryDesign.module.css'
import { sendGAtagEvent } from '@/common.helper';
import React, { useState, useContext } from 'react'
import { BASE_URL, CAD_VIEWER_EVENT, RAZORPAY_KEY_ID } from '@/config';
import Tooltip from '@mui/material/Tooltip';
import CadFileNotifyPopUp from './CadFileNotifyPopUp';
import UserLoginPupUp from './UserLoginPupUp';
import { contextState } from './ContextProvider';
import BillingAddress from './BillingAddress';
import { toast } from 'react-toastify';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function DownloadClientButton({ folderId, xaxis, yaxis, isDownladable, 
  step, filetype, custumDownload,designDetails }) {
  const [isDownLoading, setIsDownLoading] = useState(false);
  const [openEmailPopUp, setOpenEmailPopUp] = useState(false);
  const [openBillingDetails, setOpenBillingDetails] = useState(false);
  const { setDownloadedFileUpdate } = useContext(contextState);

  // Download logic after payment
  const downloadFile = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/v1/cad/get-signedurl`, {
        design_id: folderId, xaxis, yaxis, step, file_type: filetype, action_type: 'DOWNLOAD'
      }, {
        headers: {
          "user-uuid": localStorage.getItem("uuid"),
        }
      });

      const data = response.data;
      if (data.meta.success) {
        const url = data.data.download_url;
        setDownloadedFileUpdate(data.data.download_url)
        window.open(url, '_blank');
      }
      sendGAtagEvent({ event_name: 'design_view_file_download', event_category: CAD_VIEWER_EVENT });
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  // Razorpay payment + download
  const handleDownload = async (cadId,billingId,currency) => {
    setIsDownLoading(true);
    console.log('designPrice', folderId)
    try {
      if (!localStorage.getItem('is_verified')) {
        setOpenEmailPopUp(true);
        setIsDownLoading(false);
        return;
      }

      // 1. Create Razorpay order from backend
      const res = await axios.post(
        `${BASE_URL}/v1/payment/create-order`,
        {
          cad_file_id: cadId,
          billing_id: billingId,
          currency
        },
        {
          headers: {
            "user-uuid": localStorage.getItem("uuid"),
          },
        }
      );

      if (res.data.meta.status === 'active') {
        await downloadFile();
        setIsDownLoading(false);
        return;
      } else if (res.data.meta.success) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          alert("Razorpay SDK failed to load.");
          setIsDownLoading(false);
          return;
        }
      }

      // 2. Setup checkout options
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: res.data.data.amount,
        currency: res.data.data.currency,
        name: "Marathon-OS",
        description: "CAD Management Tool",
        order_id: res.data.data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${BASE_URL}/v1/payment/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                cad_file_id: folderId,
              },
              {
                headers: {
                  "user-uuid": localStorage.getItem("uuid"),
                },
              }
            );

            if (verifyRes.data.meta.success) {
              toast.success("✅ Payment successful! Starting download...");
              await downloadFile();
            } else {
              alert("⚠️ Payment verification failed!");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Server verification failed.");
          } finally {
            setIsDownLoading(false);
          }
        },
        prefill: {
          name: "User Name",
          email: "user@email.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: () => setIsDownLoading(false)
        }
      };

      // 4. Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Failed to create order");
      setIsDownLoading(false);
    }
  };

  // If you want to allow free download for some files, you can add a check here
  const handleFreeDownload = async () => {
    setIsDownLoading(true);
    try {
      if (!localStorage.getItem('is_verified')) {
        setOpenEmailPopUp(true)
        return
      }
      await downloadFile();
    } finally {
      setIsDownLoading(false);
    }
  };
  const billingHandler = async() => {
    if (!localStorage.getItem('is_verified')) {
      setOpenEmailPopUp(true)
      return
    }
    try {
      const downloadCheck = await axios.post(`${BASE_URL}/v1/payment/check-download`, {
      cad_file_id: folderId, // Include cad_file_id in the request body
    }, {
      headers: { 'user-uuid': localStorage.getItem('uuid') }
    });

      if(downloadCheck.data.meta.success ) {
        if(!downloadCheck.data.data.can_download ){
          
              setOpenBillingDetails(true);
          
        }else{
          await handleFreeDownload();
        }
        // if(!downloadCheck.data.data.sameUser &&
        //   downloadCheck.data.data.fileType &&
        //   // !downloadCheck.data.data.subscriptionActive &&
        //   !downloadCheck.data.data.canDownload
        // ) {
        //   setOpenBillingDetails(true);
        // }else if(downloadCheck.data.data.sameUser &&
        //   !downloadCheck.data.data.fileType &&
        //   // downloadCheck.data.data.subscriptionActive &&
        //   downloadCheck.data.data.canDownload){
        //   await handleFreeDownload();
        //   }
         
      // }
      }
    } catch (error) {
      console.error("Error checking download permissions:", error);
    }
    

  }
  // Decide which handler to use (do NOT call it during render)
  const downloadHandler = isDownladable === false
    ? undefined
    : billingHandler;

  return (
    <>
      {custumDownload ? (
        <>
          {isDownladable === false ? (
            <Tooltip
              title='This file is view-only downloads are disabled by the creator.' arrow
              placement='top'
              disableHoverListener={isDownladable}
              disableFocusListener={isDownladable}
              disableTouchListener={isDownladable}
              PopperProps={{
                sx: {
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: '#333',
                    color: '#fff',
                    fontSize: '12px',
                    padding: '6px',
                    borderRadius: '4px',
                  },
                },
              }}
            >
              <span>
                <button
                  disabled
                  className="rounded bg-[#610BEE] h-12"
                  style={{  
                    opacity: 0.6, 
                    cursor: 'not-allowed', 
                    color: 'white', 
                    fontSize: '20px',
                    background: '#610BEE',
                    borderRadius: '4px',
                    height: '48px',
                    padding: '10px 20px',
                    border: 'none',
                    width: 'auto'
                  }}
                >
                  Download 3D design
                </button>
              </span>
            </Tooltip>
          ) : (
            <button
              disabled={isDownLoading}
          style={{ 
                              
                              color: 'white', 
                              fontSize: '20px',
                              background: '#610BEE',
                              borderRadius: '4px',
                              height: '48px',
                              padding: '10px 20px',
                              border: 'none',
                              width: 'auto'
                            }}
              className="rounded bg-[#610BEE] h-12"
              onClick={downloadHandler}
            >
              {isDownLoading ? 'Processing...' : 'Download 3D design'}
            </button>
          )}
        </>
      ) : (
        <>
          {isDownladable === false ? (
            <Tooltip
              title='This file is view-only downloads are disabled by the creator.' arrow
              placement='top'
              disableHoverListener={isDownladable}
              disableFocusListener={isDownladable}
              disableTouchListener={isDownladable}
              PopperProps={{
                sx: {
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: '#333',
                    color: '#fff',
                    fontSize: '12px',
                    padding: '6px',
                    borderRadius: '4px',
                  },
                },
              }}
            >
              <span>
                <button
                  disabled
                  className={styles['industry-design-files-btn']}
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                >
                  Download
                </button>
              </span>
            </Tooltip>
          ) : (
            <button
              disabled={isDownLoading}
              className={styles['industry-design-files-btn']}
              onClick={downloadHandler}
            >
              {isDownLoading ? 'Processing...' : 'Download'}
            </button>
          )}
        </>
      )}
      {openBillingDetails && <BillingAddress 
      onClose={() => setOpenBillingDetails(false)} 
      onSave={handleDownload} cadId={folderId} designDetails={designDetails}/>}
      {openEmailPopUp && <UserLoginPupUp onClose={() => setOpenEmailPopUp(false)} />}
    </>
  );
}

export default DownloadClientButton;

// console.log("RAZORPAY_KEY_ID:", RAZORPAY_KEY_ID); // Should print your key, not undefined