import { createTechDrawOrder, verifyTechDrawPayment } from "@/api/cadDrawingPipelineApi";
import { MARATHONDETAILS, RAZORPAY_KEY_ID } from "@/config";

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function openTechDrawPayment(jobId) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const order = await createTechDrawOrder(jobId);
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          reject(new Error("Razorpay SDK failed to load."));
          return;
        }

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: Math.round(order.amount * 100),
          currency: order.currency,
          name: MARATHONDETAILS.name,
          image: MARATHONDETAILS.image,
          description: "TechDraw drawing pipeline",
          order_id: order.orderId,
          handler: async (response) => {
            try {
              await verifyTechDrawPayment({
                job_id: jobId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          theme: { color: MARATHONDETAILS.theme },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        reject(err);
      }
    })();
  });
}
