"use client"
import React from 'react'
import axios from 'axios' // Add this import
import { BASE_URL, RAZORPAY_KEY_ID } from '@/config';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

async function handleBuyClick() {
  try {
    const res = await axios.post(`${BASE_URL}/v1/payment/create-order`, {
      cad_file_id: '684a7a795eefe5e0adbd7a36', // replace with actual user ID or data
    }, {
      headers: {
        "user-uuid": localStorage.getItem("uuid"), 
      }
    });

 
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert('Razorpay SDK failed to load.');
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID, // Replace with your Razorpay key ID
      amount: res.data.data.amount, // in paise
      currency: res.data.data.currency,
      name: 'Marathon-OS',
      description: 'CAD Management Tool',
      order_id: res.data.data.orderId,
      handler: function (response) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
        // Optionally verify payment on the server here
      },
      prefill: {
        name: 'Karishma Mohammed',
        email: 'karishma@marathon-os.com',
        contact: '9390333636'
      },
      theme: { color: '#3399cc' }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    alert('Failed to create order');
  }
}

function page() {
  return (
    <div>
      <button style={{ background: '#610bee', padding: '12px', color: 'white' }} onClick={handleBuyClick}>Razorpay</button>
    </div>
  )
}

export default page