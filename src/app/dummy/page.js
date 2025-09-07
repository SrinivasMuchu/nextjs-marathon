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
    const res = await axios.post(`${BASE_URL}/v1/cad/razor`, {
      userId: 123, // replace with actual user ID or data
    });
    const data = res.data;

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert('Razorpay SDK failed to load.');
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID, // Replace with your Razorpay key ID
      amount: data.amount, // in paise
      currency: data.currency,
      name: 'Your Company Name',
      description: 'Test Transaction',
      order_id: data.order_id,
      handler: function (response) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
        // Optionally verify payment on the server here
      },
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999'
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
      <button style={{background:'#610bee',padding:'12px',color:'white'}} onClick={handleBuyClick}>Razorpay</button>
    </div>
  )
}

export default page