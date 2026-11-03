import {
  createTwoDLibraryOrder,
  verifyTwoDLibraryPayment,
} from "@/api/twoDLibraryPaymentApi";
import { paymentEventValue, sendClarityEvent, sendGAtagEvent } from "@/common.helper";
import { CAD_2D_DRAWING_EVENT, MARATHONDETAILS, RAZORPAY_KEY_ID } from "@/config";
import { loadRazorpayScript } from "@/Components/CadDrawingPipeline/techDrawPayment";

/** Razorpay checkout for one 2D library drawing set (all-in pricing). */
export function openTwoDLibraryPayment({ cadFileId, billingId, description } = {}) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        if (!cadFileId) {
          reject(new Error("Drawing set is required before payment."));
          return;
        }
        if (!billingId) {
          reject(new Error("Billing address is required before payment."));
          return;
        }

        const order = await createTwoDLibraryOrder(cadFileId, billingId);
        if (order?.payment_required === false) {
          resolve({ skipped: true, reason: order.reason });
          return;
        }

        const loaded = await loadRazorpayScript();
        if (!loaded) {
          reject(new Error("Razorpay SDK failed to load."));
          return;
        }

        const razorpayAmount = Math.round(Number(order.razorpay_amount) || Number(order.amount) * 100);
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: razorpayAmount,
          currency: order.currency || "USD",
          name: MARATHONDETAILS.name,
          image: MARATHONDETAILS.image,
          description: description || order.title || "2D drawing set",
          order_id: order.orderId,
          handler: async (response) => {
            try {
              await verifyTwoDLibraryPayment({
                cad_file_id: cadFileId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              const paidValue = paymentEventValue(order.price_with_gst ?? order.amount);
              const paidCurrency = order.currency || "USD";
              sendGAtagEvent({
                event_name: "2d_library_download_payment_success",
                event_category: CAD_2D_DRAWING_EVENT,
                payment_type: "2d_library_download",
                cad_file_id: cadFileId || "",
                order_id: response.razorpay_order_id || "",
                payment_id: response.razorpay_payment_id || "",
                amount: order.amount != null ? String(order.amount) : "",
                currency: paidCurrency,
                ...(paidValue != null ? { value: paidValue } : {}),
              });
              sendClarityEvent("2d_library_download_payment_success", {
                techdraw_funnel: "paid",
                currency: paidCurrency,
                ...(paidValue != null ? { value: String(paidValue) } : {}),
              });
              resolve({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
              });
            } catch (err) {
              reject(err);
            }
          },
          prefill: order.prefill || {},
          ...(order.notes && Object.keys(order.notes).length ? { notes: order.notes } : {}),
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
