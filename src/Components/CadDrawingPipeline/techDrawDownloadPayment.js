import {
  checkTechDrawDownload,
  createTechDrawOrder,
  verifyTechDrawPayment,
  formatTechDrawPrice,
} from "@/api/cadDrawingPipelineApi";
import { loadRazorpayScript } from "@/Components/History/converterPayment";
import { sendClarityEvent } from "@/common.helper";
import { MARATHONDETAILS, RAZORPAY_KEY_ID } from "@/config";

/**
 * Ensures the user may download TechDraw deliverables (free path or Razorpay checkout).
 */
export function ensureTechDrawDownloadAccess({ jobId, jobTitle, fileName, userEmail, billingId }) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const access = await checkTechDrawDownload(jobId);
        if (access.can_download) {
          resolve({ free: true, reason: access.reason });
          return;
        }

        if (!billingId) {
          reject(new Error("Billing address is required before payment."));
          return;
        }

        const order = await createTechDrawOrder(jobId, billingId);
        if (!order.payment_required) {
          resolve({ free: true, reason: order.reason || "no_payment" });
          return;
        }

        const loaded = await loadRazorpayScript();
        if (!loaded) {
          reject(new Error("Razorpay SDK failed to load."));
          return;
        }

        const totalLabel = formatTechDrawPrice(order.price_with_gst ?? order.amount);
        const label = jobTitle || fileName || "2D technical drawing";
        const chargeLabel = `2D drawing download — ${label} — ${totalLabel}`;

        const razorpayAmount =
          Number(order.razorpay_amount) > 0
            ? Math.round(Number(order.razorpay_amount))
            : Math.round(Number(order.amount) * 100);

        const prefill = { ...(order.prefill || {}) };
        if (!prefill.email && userEmail) prefill.email = userEmail;

        sendClarityEvent("techdraw_download_payment_opened", { techdraw_funnel: "payment_opened" });

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
              const verification = await verifyTechDrawPayment({
                job_id: jobId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              sendClarityEvent("techdraw_download_payment_success", { techdraw_funnel: "paid" });
              resolve({
                free: false,
                paid: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                verification,
              });
            } catch (err) {
              sendClarityEvent("techdraw_download_payment_failed", { techdraw_funnel: "payment_failed" });
              reject(err);
            }
          },
          prefill,
          ...(order.notes && Object.keys(order.notes).length ? { notes: order.notes } : {}),
          theme: { color: MARATHONDETAILS.theme },
          modal: {
            ondismiss: () => {
              sendClarityEvent("techdraw_download_payment_cancelled", {
                techdraw_funnel: "payment_cancelled",
              });
              reject(new Error("Payment cancelled"));
            },
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
