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

function DownloadClientButton({ folderId, xaxis, yaxis, isDownladable, step, filetype, custumDownload }) {
  const [isDownLoading, setIsDownLoading] = useState(false);
  const [openEmailPopUp, setOpenEmailPopUp] = useState(false);
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
  const handleDownload = async () => {
    setIsDownLoading(true);
    try {
      if (!localStorage.getItem('is_verified')) {
        setOpenEmailPopUp(true)
        return
      }

      // 1. Create Razorpay order from backend
      const res = await axios.post(
        `${BASE_URL}/v1/payment/create-order`,
        {
          cad_file_id: folderId, // Use folderId as file id
        },
        {
          headers: {
            "user-uuid": localStorage.getItem("uuid"),
          },
        }
      );

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Razorpay SDK failed to load.");
        return;
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
          // console.log(response,'razorpay response');
          // 3. After payment success, verify with backend
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
              // Payment verified, proceed to download
              await downloadFile();
              // console.log('success')
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

  // Decide which handler to use
  const downloadHandler = isDownladable === false
    ? null
    : (/* condition for paid/free download here if needed */ handleDownload);

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
                  style={{ opacity: 0.6, cursor: 'not-allowed', color: 'white', fontSize: '20px' }}
                >
                  Download 3-D design
                </button>
              </span>
            </Tooltip>
          ) : (
            <button
              disabled={isDownLoading}
              style={{ fontSize: '20px' }}
              className="rounded bg-[#610BEE] h-12"
              onClick={downloadHandler}
            >
              {isDownLoading ? 'Processing...' : 'Download 3-D design'}
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
      {openEmailPopUp && <UserLoginPupUp onClose={() => setOpenEmailPopUp(false)} />}
    </>
  );
}

export default DownloadClientButton;

console.log("RAZORPAY_KEY_ID:", RAZORPAY_KEY_ID); // Should print your key, not undefined