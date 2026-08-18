import {
  checkConverterDownload,
  createConverterDownloadOrder,
  createConverterPackOrder,
  formatConverterPrice,
  redeemConverterCredit,
  verifyConverterDownloadPayment,
  verifyConverterPackPayment,
} from "@/api/converterPaymentApi";
import { sendClarityEvent } from "@/common.helper";
import { MARATHONDETAILS, RAZORPAY_KEY_ID } from "@/config";
import { areConverterSubscriptionsEnabled } from "@/lib/converterPricing";

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
 * Ensures the user may download a converter file (free path or Razorpay checkout).
 * Resolves when payment is satisfied or not required.
 */
export function ensureConverterDownloadAccess({ converterFileId, fileName, userEmail, billingId }) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const access = await checkConverterDownload(converterFileId);
        if (
          access.can_download &&
          access.reason === "credits" &&
          areConverterSubscriptionsEnabled(access)
        ) {
          const redeemed = await redeemConverterCredit(converterFileId);
          resolve({
            free: true,
            reason: redeemed.reason || "credits",
            credits: redeemed.credits,
          });
          return;
        }
        if (access.can_download) {
          resolve({ free: true, reason: access.reason, credits: access.credits });
          return;
        }

        if (!billingId) {
          reject(new Error('Billing address is required before payment.'));
          return;
        }

        const order = await createConverterDownloadOrder(converterFileId, billingId);
        if (!order.payment_required) {
          resolve({ free: true, reason: order.reason || "no_payment" });
          return;
        }

        const loaded = await loadRazorpayScript();
        if (!loaded) {
          reject(new Error("Razorpay SDK failed to load."));
          return;
        }

        const totalLabel = formatConverterPrice(order.price_with_gst ?? order.amount);
        const chargeLabel = `CAD conversion download — ${totalLabel}`;

        const razorpayAmount =
          Number(order.razorpay_amount) > 0
            ? Math.round(Number(order.razorpay_amount))
            : Math.round(Number(order.amount) * 100);

        const prefill = {
          ...(order.prefill || {}),
        };
        if (!prefill.email && userEmail) prefill.email = userEmail;

        sendClarityEvent("converter_payment_opened", { converter_funnel: "payment_opened" });

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
              const verification = await verifyConverterDownloadPayment({
                converter_file_id: converterFileId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              sendClarityEvent("converter_payment_success", { converter_funnel: "paid" });
              resolve({
                free: false,
                paid: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                verification,
              });
            } catch (err) {
              sendClarityEvent("converter_payment_failed", { converter_funnel: "payment_failed" });
              reject(err);
            }
          },
          prefill,
          ...(order.notes && Object.keys(order.notes).length ? { notes: order.notes } : {}),
          theme: { color: MARATHONDETAILS.theme },
          modal: {
            ondismiss: () => {
              sendClarityEvent("converter_payment_cancelled", { converter_funnel: "payment_cancelled" });
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

export function ensureConverterPackPurchase({ packId, packName, userEmail, billingId }) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        if (!billingId) {
          reject(new Error("Billing address is required before payment."));
          return;
        }

        const order = await createConverterPackOrder(packId, billingId);
        if (!order.payment_required) {
          resolve({
            free: true,
            credits: order.credits,
            credits_granted: order.credits_granted,
            pack_id: order.pack_id || packId,
          });
          return;
        }

        const loaded = await loadRazorpayScript();
        if (!loaded) {
          reject(new Error("Razorpay SDK failed to load."));
          return;
        }

        const totalLabel = formatConverterPrice(order.price_with_gst ?? order.amount);
        const chargeLabel = `${packName || "CAD converter pack"} — ${totalLabel}`;
        const razorpayAmount =
          Number(order.razorpay_amount) > 0
            ? Math.round(Number(order.razorpay_amount))
            : Math.round(Number(order.amount) * 100);
        const prefill = { ...(order.prefill || {}) };
        if (!prefill.email && userEmail) prefill.email = userEmail;

        sendClarityEvent("converter_pack_payment_opened", { converter_funnel: "pack_opened" });

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
              const verification = await verifyConverterPackPayment({
                pack_id: packId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              sendClarityEvent("converter_pack_payment_success", { converter_funnel: "pack_paid" });
              resolve({
                free: false,
                paid: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                verification,
                credits: verification.credits,
                credits_granted: verification.credits_granted,
                pack_id: verification.pack_id || packId,
              });
            } catch (err) {
              sendClarityEvent("converter_pack_payment_failed", { converter_funnel: "pack_failed" });
              reject(err);
            }
          },
          prefill,
          ...(order.notes && Object.keys(order.notes).length ? { notes: order.notes } : {}),
          theme: { color: MARATHONDETAILS.theme },
          modal: {
            ondismiss: () => {
              sendClarityEvent("converter_pack_payment_cancelled", {
                converter_funnel: "pack_cancelled",
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

export { formatConverterPrice };
