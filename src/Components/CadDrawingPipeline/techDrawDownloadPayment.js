import {
  checkTechDrawDownload,
  createTechDrawOrder,
  redeemTechDrawCredits,
  verifyTechDrawPayment,
  formatTechDrawPrice,
} from "@/api/cadDrawingPipelineApi";
import { loadRazorpayScript } from "@/Components/History/converterPayment";
import { paymentEventValue, sendClarityEvent, sendGAtagEvent } from "@/common.helper";
import { CAD_2D_DRAWING_EVENT, MARATHONDETAILS, RAZORPAY_KEY_ID } from "@/config";

function trackTechDrawDownloadPaymentGa(event_name, params = {}) {
  sendGAtagEvent({
    event_name,
    event_category: CAD_2D_DRAWING_EVENT,
    payment_type: "techdraw_download",
    ...params,
  });
}

/** GA4 + Clarity for the "pay with converter credits" path (event names: techdraw_credits_*). */
export function trackTechDrawCreditsEvent(action, params = {}) {
  const event_name = `techdraw_credits_${action}`;
  sendClarityEvent(event_name, { techdraw_funnel: `credits_${action}` });
  trackTechDrawDownloadPaymentGa(event_name, {
    payment_type: "techdraw_credits",
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, value == null ? "" : String(value)]),
    ),
  });
}

/**
 * Spend converter credits to unlock a completed drawing.
 * Resolves with the API result ({ ok, reason, credits, credits_used, credit_cost, message });
 * `ok: false` is a normal outcome (e.g. insufficient_credits), not an exception.
 */
export async function unlockTechDrawWithCredits({ jobId, expectedCost }) {
  try {
    const result = await redeemTechDrawCredits(jobId, expectedCost);
    if (result.ok) {
      if (result.credits_used > 0) {
        trackTechDrawCreditsEvent("used", {
          job_id: jobId,
          credits_used: result.credits_used,
          credits_left: result.credits,
        });
      }
    } else if (result.reason === "insufficient_credits") {
      trackTechDrawCreditsEvent("insufficient", {
        job_id: jobId,
        credit_cost: result.credit_cost,
        credits: result.credits,
      });
    } else {
      trackTechDrawCreditsEvent("failed", { job_id: jobId, reason: result.reason });
    }
    return result;
  } catch (err) {
    trackTechDrawCreditsEvent("failed", { job_id: jobId, reason: "network" });
    throw err;
  }
}

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

        const paidValue = paymentEventValue(order.price_with_gst ?? order.amount);
        const paidCurrency = order.currency || "USD";
        sendClarityEvent("techdraw_download_payment_opened", { techdraw_funnel: "payment_opened" });
        trackTechDrawDownloadPaymentGa("techdraw_download_payment_opened", {
          job_id: jobId || "",
          amount: order.amount != null ? String(order.amount) : "",
          currency: order.currency || "USD",
        });

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
              sendClarityEvent("techdraw_download_payment_success", {
                techdraw_funnel: "paid",
                currency: paidCurrency,
                ...(paidValue != null ? { value: String(paidValue) } : {}),
              });
              trackTechDrawDownloadPaymentGa("techdraw_download_payment_success", {
                job_id: jobId || "",
                order_id: response.razorpay_order_id || "",
                payment_id: response.razorpay_payment_id || "",
                amount: order.amount != null ? String(order.amount) : "",
                currency: paidCurrency,
                ...(paidValue != null ? { value: paidValue } : {}),
              });
              resolve({
                free: false,
                paid: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                verification,
              });
            } catch (err) {
              sendClarityEvent("techdraw_download_payment_failed", { techdraw_funnel: "payment_failed" });
              trackTechDrawDownloadPaymentGa("techdraw_download_payment_failed", {
                job_id: jobId || "",
                order_id: response.razorpay_order_id || "",
              });
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
              trackTechDrawDownloadPaymentGa("techdraw_download_payment_cancelled", {
                job_id: jobId || "",
                order_id: order.orderId || "",
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
