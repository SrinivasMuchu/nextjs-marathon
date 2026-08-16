import {
  createTwoDLibraryOrder,
  verifyTwoDLibraryPayment,
} from "@/api/twoDLibraryPaymentApi";
import { MARATHONDETAILS, RAZORPAY_KEY_ID } from "@/config";
import { loadRazorpayScript } from "@/Components/CadDrawingPipeline/techDrawPayment";

/** Razorpay checkout for one 2D library drawing set. $2.99 all-in (GST included). */
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
