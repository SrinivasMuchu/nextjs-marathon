import {
  checkTwoDLibraryDownload,
  createTwoDLibraryOrder,
  verifyTwoDLibraryPayment,
  formatTechDrawPrice,
} from "@/api/cadDrawingPipelineApi";
import { loadRazorpayScript } from "@/Components/History/converterPayment";
import { sendClarityEvent } from "@/common.helper";
import { MARATHONDETAILS, RAZORPAY_KEY_ID } from "@/config";

/**
 * Ensures the user may download 2D library deliverables (free path or Razorpay checkout).
 */
export function ensureTwoDLibraryDownloadAccess({
  cadFileId,
  designTitle,
  userEmail,
  billingId,
}) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const access = await checkTwoDLibraryDownload(cadFileId);
        if (access.can_download) {
          resolve({ free: true, reason: access.reason });
          return;
        }

        if (!billingId) {
          reject(new Error("Billing address is required before payment."));
          return;
        }

        const order = await createTwoDLibraryOrder(cadFileId, billingId);
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
        const label = designTitle || "2D technical drawing";
        const chargeLabel = `2D library download — ${label} — ${totalLabel}`;

        const razorpayAmount =
          Number(order.razorpay_amount) > 0
            ? Math.round(Number(order.razorpay_amount))
            : Math.round(Number(order.amount) * 100);

        const prefill = { ...(order.prefill || {}) };
        if (!prefill.email && userEmail) prefill.email = userEmail;

        sendClarityEvent("2d_library_download_payment_opened", { techdraw_funnel: "payment_opened" });

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
              const verification = await verifyTwoDLibraryPayment({
                cad_file_id: cadFileId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              sendClarityEvent("2d_library_download_payment_success", { techdraw_funnel: "paid" });
              resolve({
                free: false,
                paid: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                verification,
              });
            } catch (err) {
              sendClarityEvent("2d_library_download_payment_failed", { techdraw_funnel: "payment_failed" });
              reject(err);
            }
          },
          prefill,
          ...(order.notes && Object.keys(order.notes).length ? { notes: order.notes } : {}),
          theme: { color: MARATHONDETAILS.theme },
          modal: {
            ondismiss: () => {
              sendClarityEvent("2d_library_download_payment_cancelled", {
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
