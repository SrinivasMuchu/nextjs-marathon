import axios from "axios";
import { BASE_URL } from "@/config";
// Adds x-device-id to our API calls (converter free files are limited per device).
import "@/lib/deviceId";

const CONVERTER_API_BASE = "/v1/cad/converter";

function userUuidHeader() {
  if (typeof window === "undefined") return {};
  const uuid = localStorage.getItem("uuid");
  return uuid ? { "user-uuid": uuid } : {};
}

function unwrap(data) {
  if (!data?.meta?.success) {
    const msg = data?.meta?.message || "Request failed";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data.data;
}

/** Quality report (HTML + file info) for one of the user's conversions. Free to view. */
export async function getConverterReport(converterFileId) {
  const { data } = await axios.get(
    `${BASE_URL}${CONVERTER_API_BASE}/report`,
    {
      params: { converter_file_id: converterFileId },
      headers: userUuidHeader(),
      timeout: 60_000,
    },
  );
  return unwrap(data);
}

export async function getConverterPricingInfo() {
  const { data } = await axios.get(
    `${BASE_URL}${CONVERTER_API_BASE}/pricing-info`,
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
}

/** Record that the owner saved the converted file. Never throws; the download already succeeded. */
export async function recordConverterDownload(converterFileId) {
  if (!converterFileId) return null;
  try {
    const { data } = await axios.post(
      `${BASE_URL}${CONVERTER_API_BASE}/record-download`,
      { converter_file_id: converterFileId },
      { headers: userUuidHeader(), timeout: 15_000 },
    );
    return unwrap(data);
  } catch (error) {
    console.error("recordConverterDownload:", error);
    return null;
  }
}

export async function checkConverterDownload(converterFileId) {
  const { data } = await axios.post(
    `${BASE_URL}${CONVERTER_API_BASE}/check-download`,
    { converter_file_id: converterFileId },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
}

/**
 * Short-lived signed URL(s) for a converted file (the only way to fetch it).
 * Throws an Error with `.reason` (payment_required, credit_required, expired,
 * not_found) when the file isn't unlocked.
 */
export async function getConverterDownloadUrl(converterFileId) {
  const { data } = await axios.post(
    `${BASE_URL}${CONVERTER_API_BASE}/download-url`,
    { converter_file_id: converterFileId },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  if (!data?.meta?.success) {
    const error = new Error(data?.meta?.message || "Download failed.");
    error.reason = data?.data?.reason || "";
    error.access = data?.data || null;
    throw error;
  }
  return data.data;
}

export async function createConverterDownloadOrder(converterFileId, billingId) {
  const { data } = await axios.post(
    `${BASE_URL}${CONVERTER_API_BASE}/create-order`,
    { converter_file_id: converterFileId, billing_id: billingId },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
}

export async function verifyConverterDownloadPayment({
  converter_file_id,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  const { data } = await axios.post(
    `${BASE_URL}${CONVERTER_API_BASE}/verify-payment`,
    {
      converter_file_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
}

export async function redeemConverterCredit(converterFileId) {
  const { data } = await axios.post(
    `${BASE_URL}${CONVERTER_API_BASE}/use-credit`,
    { converter_file_id: converterFileId },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
}

export async function createConverterPackOrder(packId, billingId) {
  const { data } = await axios.post(
    `${BASE_URL}${CONVERTER_API_BASE}/create-pack-order`,
    { pack_id: packId, billing_id: billingId },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
}

export async function verifyConverterPackPayment({
  pack_id,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  const { data } = await axios.post(
    `${BASE_URL}${CONVERTER_API_BASE}/verify-pack-payment`,
    {
      pack_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
}

export async function getAdminControls() {
  const { data } = await axios.get(`${BASE_URL}/v1/admin-pannel/get-admin-controls`, {
    headers: { "admin-uuid": localStorage.getItem("admin-uuid") },
    timeout: 30_000,
  });
  return unwrap(data);
}

export async function updateAdminControls(payload) {
  const { data } = await axios.post(
    `${BASE_URL}/v1/admin-pannel/update-admin-controls`,
    payload,
    {
      headers: { "admin-uuid": localStorage.getItem("admin-uuid") },
      timeout: 30_000,
    },
  );
  return unwrap(data);
}

export function formatConverterPrice(amount, currency = "USD") {
  const n = Number(amount);
  if (!Number.isFinite(n) || n < 0) return "";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}
