"use client";
import React from "react";
import axios from "axios";
import { BASE_URL, RAZORPAY_KEY_ID } from "@/config";

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

async function handleBuyClick() {
  try {
    // 1. Create Razorpay order from backend
    const res = await axios.post(
      `${BASE_URL}/v1/payment/create-order`,
      {
        cad_file_id: "684a7a795eefe5e0adbd7a36", // replace with actual data
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
        // 3. After payment success, verify with backend
        try {
          const verifyRes = await axios.post(
            `${BASE_URL}/v1/payment/verify-payment`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                "user-uuid": localStorage.getItem("uuid"),
              },
            }
          );

          if (verifyRes.data.meta.success) {
            alert("✅ Payment verified successfully!");
          } else {
            alert("⚠️ Payment verification failed!");
          }
        } catch (err) {
          console.error("Verification error:", err);
          alert("Server verification failed.");
        }
      },
      prefill: {
        name: "Karishma Mohammed",
        email: "karishma@marathon-os.com",
        contact: "9390333636",
      },
      theme: { color: "#3399cc" },
    };

    // 4. Open Razorpay checkout
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Error creating order:", error);
    alert("Failed to create order");
  }
}

function Page() {
  return (
    <div>
      <button
        style={{ background: "#610bee", padding: "12px", color: "white" }}
        onClick={handleBuyClick}
      >
        Razorpay
      </button>
    </div>
  );
}

export default Page;
