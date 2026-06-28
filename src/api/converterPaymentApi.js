import axios from "axios";
import { BASE_URL } from "@/config";

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

export async function checkConverterDownload(converterFileId) {
  const { data } = await axios.post(
    `${BASE_URL}${CONVERTER_API_BASE}/check-download`,
    { converter_file_id: converterFileId },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
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
