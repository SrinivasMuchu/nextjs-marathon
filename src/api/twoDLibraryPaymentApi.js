import axios from "axios";
import { BASE_URL } from "@/config";

const TWO_D_LIBRARY_API_BASE = "/v1/cad/2d-library";

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

export async function getTwoDLibraryPricingInfo() {
  const { data } = await axios.get(`${BASE_URL}${TWO_D_LIBRARY_API_BASE}/pricing-info`, {
    timeout: 30_000,
  });
  return unwrap(data);
}

export async function checkTwoDLibraryDownload(cadFileId) {
  const { data } = await axios.post(
    `${BASE_URL}${TWO_D_LIBRARY_API_BASE}/check-download`,
    { cad_file_id: cadFileId },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
}

export async function createTwoDLibraryOrder(cadFileId, billingId) {
  const { data } = await axios.post(
    `${BASE_URL}${TWO_D_LIBRARY_API_BASE}/create-order`,
    { cad_file_id: cadFileId, billing_id: billingId },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
}

export async function verifyTwoDLibraryPayment({
  cad_file_id,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  const { data } = await axios.post(
    `${BASE_URL}${TWO_D_LIBRARY_API_BASE}/verify-payment`,
    {
      cad_file_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
}
