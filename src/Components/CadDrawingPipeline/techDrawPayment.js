import {
  createTechDrawOrder,
  formatTechDrawPrice,
  getTechDrawPriceDisplay,
  verifyTechDrawPayment,
} from "@/api/cadDrawingPipelineApi";
import { MARATHONDETAILS, RAZORPAY_KEY_ID } from "@/config";
import {
  trackTechDrawPaymentCancelled,
  trackTechDrawPaymentCheckoutOpened,
  trackTechDrawPaymentCompleted,
  trackTechDrawPaymentFailed,
  trackTechDrawPaymentInitiated,
  trackTechDrawPaymentOrderCreated,
} from "@/lib/techDraw/techDrawAnalytics";

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

/**
 * Pay first (no DB job). Resolves with Razorpay ids for submit after upload.
 * @param {string} [jobId] — only for legacy dashboard jobs that were created before pay
 */
export function openTechDrawPayment({ description, jobId } = {}) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        trackTechDrawPaymentInitiated({ jobId });
        const order = await createTechDrawOrder(jobId);
        trackTechDrawPaymentOrderCreated({
          orderId: order.orderId,
          amount: order.razorpay_amount ?? order.amount,
          currency: order.currency,
        });
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          reject(new Error("Razorpay SDK failed to load."));
          return;
        }

        const prices = getTechDrawPriceDisplay();

        const chargeLabel =
          description ||
          `2D technical drawing — ${prices.totalLabel}`;

        const razorpayAmount =
          Number(order.razorpay_amount) > 0
            ? Math.round(Number(order.razorpay_amount))
            : Math.round(prices.total * 100);

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: razorpayAmount,
          currency: order.currency || "USD",
          name: MARATHONDETAILS.name,
          image: MARATHONDETAILS.image,
          description: chargeLabel,
          order_id: order.orderId,
          handler: async (response) => {
            try {
              await verifyTechDrawPayment({
                ...(jobId ? { job_id: jobId } : {}),
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              trackTechDrawPaymentCompleted({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                jobId,
              });
              resolve({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
            } catch (err) {
              trackTechDrawPaymentFailed({
                orderId: response.razorpay_order_id,
                errorMessage: err?.message,
                stage: "verify",
              });
              reject(err);
            }
          },
          theme: { color: MARATHONDETAILS.theme },
          modal: {
            ondismiss: () => {
              trackTechDrawPaymentCancelled({ orderId: order.orderId });
              reject(new Error("Payment cancelled"));
            },
          },
        };

        const rzp = new window.Razorpay(options);
        trackTechDrawPaymentCheckoutOpened({ orderId: order.orderId });
        rzp.open();
      } catch (err) {
        trackTechDrawPaymentFailed({
          errorMessage: err?.message,
          stage: "order_or_checkout",
        });
        reject(err);
      }
    })();
  });
}

export { formatTechDrawPrice, getTechDrawPriceDisplay };
